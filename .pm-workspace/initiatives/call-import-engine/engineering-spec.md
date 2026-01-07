# Engineering Spec: Call Import Engine

## Technical Overview

Build a modular, queue-based call import system that can ingest calls from multiple source platforms (Gong, Fathom, RingCentral, Zoom Phone) with consistent processing, credential management, and status tracking. The architecture should support both one-time historical imports and ongoing sync for dialers.

### Architecture Principles

1. **Platform Abstraction** — Each source platform implements a common interface
2. **Queue-Based Processing** — Decouple import triggering from processing
3. **Idempotent Operations** — Safe to retry any import operation
4. **Observable** — Detailed logging, metrics, and status visibility
5. **Secure by Default** — Encrypted credentials, minimal scopes, audit logging

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            Frontend                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ Platform     │  │ Credential   │  │ Import       │                  │
│  │ Selector     │  │ Entry        │  │ Progress     │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            API Layer (GraphQL)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ Import       │  │ Credential   │  │ Platform     │                  │
│  │ Mutations    │  │ Mutations    │  │ Queries      │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Import Service                                   │
│  ┌──────────────────────────────────────────────────────────────┐       │
│  │                    Platform Adapters                          │       │
│  │  ┌────────┐  ┌────────┐  ┌────────────┐  ┌──────────┐       │       │
│  │  │  Gong  │  │ Fathom │  │ RingCentral│  │ZoomPhone │       │       │
│  │  └────────┘  └────────┘  └────────────┘  └──────────┘       │       │
│  └──────────────────────────────────────────────────────────────┘       │
│                                    │                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ Credential   │  │ Import Job   │  │ Status       │                  │
│  │ Manager      │  │ Queue        │  │ Tracker      │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Processing Pipeline                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ Download     │  │ Transcribe   │  │ AI Process   │                  │
│  │ Recording    │  │ (if needed)  │  │ & Store      │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Data Layer                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │ PostgreSQL   │  │ Cloud        │  │ Redis        │                  │
│  │ (metadata)   │  │ Storage      │  │ (queue/cache)│                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Data Model Changes

### New Tables

```sql
-- Platform credentials (encrypted)
CREATE TABLE import_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  platform VARCHAR(50) NOT NULL, -- 'gong', 'fathom', 'ringcentral', 'zoom_phone'
  credential_type VARCHAR(20) NOT NULL, -- 'api_key', 'oauth'
  encrypted_credentials JSONB NOT NULL, -- Encrypted at rest
  scopes TEXT[], -- OAuth scopes granted
  expires_at TIMESTAMP, -- For OAuth tokens
  last_verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  
  UNIQUE(workspace_id, platform)
);

-- Import jobs
CREATE TABLE import_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  credential_id UUID NOT NULL REFERENCES import_credentials(id),
  job_type VARCHAR(20) NOT NULL, -- 'historical', 'sync'
  status VARCHAR(20) NOT NULL DEFAULT 'pending', 
    -- 'pending', 'counting', 'in_progress', 'completed', 'failed', 'cancelled'
  
  -- Job configuration
  date_range_start TIMESTAMP,
  date_range_end TIMESTAMP,
  
  -- Progress tracking
  total_calls INTEGER,
  processed_calls INTEGER DEFAULT 0,
  failed_calls INTEGER DEFAULT 0,
  
  -- Timing
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  estimated_completion_at TIMESTAMP,
  
  -- Error tracking
  last_error TEXT,
  error_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Individual call import records
CREATE TABLE imported_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  import_job_id UUID NOT NULL REFERENCES import_jobs(id),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  
  -- Source reference
  source_platform VARCHAR(50) NOT NULL,
  source_call_id VARCHAR(255) NOT NULL,
  
  -- Processing status
  status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- 'pending', 'downloading', 'transcribing', 'processing', 'completed', 'failed'
  
  -- Destination reference (once processed)
  engagement_id UUID REFERENCES engagements(id),
  
  -- Source metadata (preserved for debugging)
  source_metadata JSONB,
  
  -- Error tracking
  last_error TEXT,
  retry_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(workspace_id, source_platform, source_call_id)
);

-- Sync configurations (for ongoing dialer sync)
CREATE TABLE import_sync_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id),
  credential_id UUID NOT NULL REFERENCES import_credentials(id),
  
  enabled BOOLEAN DEFAULT true,
  sync_frequency_minutes INTEGER DEFAULT 60, -- How often to check for new calls
  
  last_sync_at TIMESTAMP,
  last_sync_status VARCHAR(20),
  last_sync_calls_imported INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(workspace_id, credential_id)
);

-- Platform capability registry (for sales enablement)
CREATE TABLE platform_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  platform VARCHAR(50) NOT NULL UNIQUE,
  display_name VARCHAR(100) NOT NULL,
  logo_url TEXT,
  
  -- Capability flags
  supports_historical_import BOOLEAN DEFAULT false,
  supports_ongoing_sync BOOLEAN DEFAULT false,
  supports_transcript_reuse BOOLEAN DEFAULT false,
  
  -- Auth requirements
  auth_type VARCHAR(20) NOT NULL, -- 'api_key', 'oauth'
  auth_instructions TEXT,
  required_scopes TEXT[],
  
  -- Status
  status VARCHAR(20) NOT NULL DEFAULT 'coming_soon',
    -- 'supported', 'beta', 'coming_soon', 'not_planned'
  
  -- Pricing
  cost_per_call_cents INTEGER, -- null = included
  
  -- Rate limits
  rate_limit_calls_per_minute INTEGER,
  rate_limit_concurrent_downloads INTEGER,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Indexes

```sql
CREATE INDEX idx_import_jobs_workspace_status ON import_jobs(workspace_id, status);
CREATE INDEX idx_import_jobs_credential ON import_jobs(credential_id);
CREATE INDEX idx_imported_calls_job_status ON imported_calls(import_job_id, status);
CREATE INDEX idx_imported_calls_source ON imported_calls(source_platform, source_call_id);
CREATE INDEX idx_import_sync_configs_enabled ON import_sync_configs(enabled, last_sync_at);
```

---

## API Changes

### GraphQL Schema

```graphql
# Types
type ImportCredential {
  id: ID!
  platform: ImportPlatform!
  credentialType: CredentialType!
  isValid: Boolean!
  expiresAt: DateTime
  lastVerifiedAt: DateTime
  createdAt: DateTime!
}

type ImportJob {
  id: ID!
  platform: ImportPlatform!
  jobType: ImportJobType!
  status: ImportJobStatus!
  totalCalls: Int
  processedCalls: Int!
  failedCalls: Int!
  startedAt: DateTime
  completedAt: DateTime
  estimatedCompletionAt: DateTime
  lastError: String
  createdAt: DateTime!
}

type ImportPreview {
  callCount: Int!
  dateRange: DateRange
  estimatedDurationMinutes: Int!
  pricing: ImportPricing!
}

type ImportPricing {
  freeCallsIncluded: Int!
  billableCalls: Int!
  costPerCallCents: Int!
  totalCostCents: Int!
}

type PlatformCapability {
  platform: ImportPlatform!
  displayName: String!
  logoUrl: String
  supportsHistoricalImport: Boolean!
  supportsOngoingSync: Boolean!
  authType: CredentialType!
  authInstructions: String
  status: PlatformStatus!
}

enum ImportPlatform {
  GONG
  FATHOM
  GRAIN
  RINGCENTRAL
  ZOOM_PHONE
  FIVE29
}

enum CredentialType {
  API_KEY
  OAUTH
}

enum ImportJobType {
  HISTORICAL
  SYNC
}

enum ImportJobStatus {
  PENDING
  COUNTING
  IN_PROGRESS
  COMPLETED
  FAILED
  CANCELLED
}

enum PlatformStatus {
  SUPPORTED
  BETA
  COMING_SOON
  NOT_PLANNED
}

# Queries
extend type Query {
  # Get all supported platforms
  importPlatforms: [PlatformCapability!]!
  
  # Get credentials for current workspace
  importCredentials: [ImportCredential!]!
  
  # Get import jobs for current workspace
  importJobs(status: ImportJobStatus, limit: Int): [ImportJob!]!
  
  # Get specific job with details
  importJob(id: ID!): ImportJob
  
  # Preview import (after credentials verified)
  importPreview(credentialId: ID!, dateRangeStart: DateTime, dateRangeEnd: DateTime): ImportPreview!
}

# Mutations
extend type Mutation {
  # Store credentials (API key)
  createImportCredential(
    platform: ImportPlatform!
    apiKey: String!
  ): CreateCredentialResult!
  
  # Initiate OAuth flow
  initiateOAuthImport(platform: ImportPlatform!): OAuthInitResult!
  
  # Complete OAuth (callback handler)
  completeOAuthImport(
    platform: ImportPlatform!
    code: String!
    state: String!
  ): CreateCredentialResult!
  
  # Verify credentials are still valid
  verifyImportCredential(credentialId: ID!): VerifyCredentialResult!
  
  # Start import job
  startImportJob(
    credentialId: ID!
    jobType: ImportJobType!
    dateRangeStart: DateTime
    dateRangeEnd: DateTime
  ): StartImportResult!
  
  # Cancel import job
  cancelImportJob(jobId: ID!): CancelImportResult!
  
  # Configure ongoing sync
  configureImportSync(
    credentialId: ID!
    enabled: Boolean!
    syncFrequencyMinutes: Int
  ): ConfigureSyncResult!
  
  # Delete credentials
  deleteImportCredential(credentialId: ID!): DeleteCredentialResult!
}

# Subscriptions (for real-time progress)
extend type Subscription {
  importJobProgress(jobId: ID!): ImportJob!
}
```

---

## Platform Adapter Interface

```typescript
// src/services/import/adapters/types.ts

export interface PlatformAdapter {
  platform: ImportPlatform;
  
  // Credential management
  validateCredentials(credentials: EncryptedCredentials): Promise<ValidationResult>;
  refreshCredentials?(credentials: EncryptedCredentials): Promise<RefreshResult>;
  
  // Call discovery
  listCalls(
    credentials: EncryptedCredentials,
    options: ListCallsOptions
  ): AsyncGenerator<CallMetadata>;
  
  countCalls(
    credentials: EncryptedCredentials,
    options: ListCallsOptions
  ): Promise<number>;
  
  // Call retrieval
  downloadCall(
    credentials: EncryptedCredentials,
    callId: string
  ): Promise<CallDownloadResult>;
  
  // Transcript retrieval (if available)
  getTranscript?(
    credentials: EncryptedCredentials,
    callId: string
  ): Promise<TranscriptResult | null>;
  
  // Rate limiting
  getRateLimits(): RateLimitConfig;
}

export interface ListCallsOptions {
  dateRangeStart?: Date;
  dateRangeEnd?: Date;
  cursor?: string;
  limit?: number;
}

export interface CallMetadata {
  sourceCallId: string;
  title?: string;
  date: Date;
  durationSeconds: number;
  participants?: Participant[];
  hasTranscript: boolean;
  recordingUrl?: string;
  metadata: Record<string, unknown>;
}

export interface CallDownloadResult {
  audioBuffer: Buffer;
  mimeType: string;
  durationSeconds: number;
}

export interface TranscriptResult {
  segments: TranscriptSegment[];
  speakers: Speaker[];
}
```

### Example: Gong Adapter

```typescript
// src/services/import/adapters/gong.ts

export class GongAdapter implements PlatformAdapter {
  platform = ImportPlatform.GONG;
  
  private baseUrl = 'https://api.gong.io/v2';
  
  async validateCredentials(credentials: EncryptedCredentials): Promise<ValidationResult> {
    const decrypted = await decrypt(credentials);
    
    try {
      const response = await fetch(`${this.baseUrl}/users`, {
        headers: {
          'Authorization': `Bearer ${decrypted.apiKey}`,
        },
      });
      
      if (response.ok) {
        return { valid: true };
      } else if (response.status === 401) {
        return { valid: false, error: 'Invalid API key' };
      } else if (response.status === 403) {
        return { valid: false, error: 'Insufficient permissions. Admin access required.' };
      }
      
      return { valid: false, error: `Unexpected error: ${response.status}` };
    } catch (error) {
      return { valid: false, error: 'Could not connect to Gong API' };
    }
  }
  
  async *listCalls(
    credentials: EncryptedCredentials,
    options: ListCallsOptions
  ): AsyncGenerator<CallMetadata> {
    const decrypted = await decrypt(credentials);
    let cursor = options.cursor;
    
    do {
      const response = await this.fetchWithRateLimit(
        `${this.baseUrl}/calls`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${decrypted.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filter: {
              fromDateTime: options.dateRangeStart?.toISOString(),
              toDateTime: options.dateRangeEnd?.toISOString(),
            },
            cursor,
          }),
        }
      );
      
      const data = await response.json();
      
      for (const call of data.calls) {
        yield this.mapCallMetadata(call);
      }
      
      cursor = data.records?.cursor;
    } while (cursor);
  }
  
  async downloadCall(
    credentials: EncryptedCredentials,
    callId: string
  ): Promise<CallDownloadResult> {
    const decrypted = await decrypt(credentials);
    
    // Get media URL
    const mediaResponse = await this.fetchWithRateLimit(
      `${this.baseUrl}/calls/${callId}/media`,
      {
        headers: { 'Authorization': `Bearer ${decrypted.apiKey}` },
      }
    );
    
    const { url } = await mediaResponse.json();
    
    // Download actual audio
    const audioResponse = await fetch(url);
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    
    return {
      audioBuffer,
      mimeType: audioResponse.headers.get('content-type') || 'audio/mp4',
      durationSeconds: 0, // Populated from metadata
    };
  }
  
  async getTranscript(
    credentials: EncryptedCredentials,
    callId: string
  ): Promise<TranscriptResult | null> {
    const decrypted = await decrypt(credentials);
    
    const response = await this.fetchWithRateLimit(
      `${this.baseUrl}/calls/${callId}/transcript`,
      {
        headers: { 'Authorization': `Bearer ${decrypted.apiKey}` },
      }
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return this.mapTranscript(data);
  }
  
  getRateLimits(): RateLimitConfig {
    return {
      requestsPerMinute: 60,
      concurrentDownloads: 5,
      retryAfterSeconds: 60,
    };
  }
}
```

---

## Queue-Based Processing

### Job Queue Architecture

```typescript
// Using Bull for Redis-based job queue

import Bull from 'bull';

// Job queues
export const importJobQueue = new Bull('import-jobs', {
  redis: process.env.REDIS_URL,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

export const callProcessQueue = new Bull('call-processing', {
  redis: process.env.REDIS_URL,
  limiter: {
    max: 10, // Max concurrent jobs
    duration: 1000,
  },
});

// Job types
interface ImportJobPayload {
  jobId: string;
  workspaceId: string;
  credentialId: string;
  platform: ImportPlatform;
  dateRangeStart?: string;
  dateRangeEnd?: string;
}

interface CallProcessPayload {
  importedCallId: string;
  workspaceId: string;
  sourceCallId: string;
  platform: ImportPlatform;
  hasSourceTranscript: boolean;
}

// Job processor
importJobQueue.process(async (job) => {
  const { jobId, workspaceId, credentialId, platform } = job.data;
  
  // Update job status
  await updateJobStatus(jobId, 'in_progress');
  
  // Get adapter and credentials
  const adapter = getAdapter(platform);
  const credentials = await getCredentials(credentialId);
  
  // List all calls
  let processedCount = 0;
  for await (const callMetadata of adapter.listCalls(credentials, job.data)) {
    // Check for existing import
    const existing = await findImportedCall(workspaceId, platform, callMetadata.sourceCallId);
    if (existing) continue;
    
    // Create imported_call record
    const importedCall = await createImportedCall({
      importJobId: jobId,
      workspaceId,
      sourcePlatform: platform,
      sourceCallId: callMetadata.sourceCallId,
      sourceMetadata: callMetadata,
    });
    
    // Queue for processing
    await callProcessQueue.add({
      importedCallId: importedCall.id,
      workspaceId,
      sourceCallId: callMetadata.sourceCallId,
      platform,
      hasSourceTranscript: callMetadata.hasTranscript,
    });
    
    processedCount++;
    
    // Update progress
    await updateJobProgress(jobId, processedCount);
    job.progress(processedCount);
  }
  
  await updateJobStatus(jobId, 'completed');
});

callProcessQueue.process(async (job) => {
  const { importedCallId, platform, hasSourceTranscript } = job.data;
  
  await updateImportedCallStatus(importedCallId, 'downloading');
  
  const adapter = getAdapter(platform);
  const credentials = await getCredentialsForImportedCall(importedCallId);
  
  // Download recording
  const recording = await adapter.downloadCall(credentials, job.data.sourceCallId);
  
  // Upload to our storage
  const storageUrl = await uploadToStorage(recording);
  
  // Get or create transcript
  let transcript: TranscriptResult;
  if (hasSourceTranscript && adapter.getTranscript) {
    await updateImportedCallStatus(importedCallId, 'processing');
    transcript = await adapter.getTranscript(credentials, job.data.sourceCallId);
  } else {
    await updateImportedCallStatus(importedCallId, 'transcribing');
    transcript = await transcribeRecording(storageUrl);
  }
  
  // Create engagement
  await updateImportedCallStatus(importedCallId, 'processing');
  const engagement = await createEngagementFromImport({
    workspaceId: job.data.workspaceId,
    recordingUrl: storageUrl,
    transcript,
    sourceMetadata: await getImportedCallMetadata(importedCallId),
  });
  
  // Link and complete
  await completeImportedCall(importedCallId, engagement.id);
});
```

---

## Credential Security

### Encryption at Rest

```typescript
// src/services/import/credentials.ts

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.CREDENTIAL_ENCRYPTION_KEY!, 'hex');

export async function encryptCredentials(
  plaintext: Record<string, string>
): Promise<EncryptedCredentials> {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  
  const plaintextBuffer = Buffer.from(JSON.stringify(plaintext), 'utf8');
  const encrypted = Buffer.concat([cipher.update(plaintextBuffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  
  return {
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex'),
    data: encrypted.toString('hex'),
  };
}

export async function decryptCredentials(
  encrypted: EncryptedCredentials
): Promise<Record<string, string>> {
  const decipher = createDecipheriv(
    ALGORITHM,
    KEY,
    Buffer.from(encrypted.iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));
  
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted.data, 'hex')),
    decipher.final(),
  ]);
  
  return JSON.parse(decrypted.toString('utf8'));
}
```

### OAuth Flow

```typescript
// src/services/import/oauth.ts

export async function initiateOAuth(
  platform: ImportPlatform,
  workspaceId: string,
  userId: string
): Promise<OAuthInitResult> {
  const config = getOAuthConfig(platform);
  
  // Generate state token
  const state = await createOAuthState({
    platform,
    workspaceId,
    userId,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });
  
  const authUrl = new URL(config.authorizationEndpoint);
  authUrl.searchParams.set('client_id', config.clientId);
  authUrl.searchParams.set('redirect_uri', config.redirectUri);
  authUrl.searchParams.set('scope', config.scopes.join(' '));
  authUrl.searchParams.set('state', state);
  authUrl.searchParams.set('response_type', 'code');
  
  return {
    authorizationUrl: authUrl.toString(),
    state,
  };
}

export async function completeOAuth(
  platform: ImportPlatform,
  code: string,
  state: string
): Promise<CreateCredentialResult> {
  // Verify state
  const stateData = await verifyOAuthState(state);
  if (!stateData) {
    throw new Error('Invalid or expired OAuth state');
  }
  
  const config = getOAuthConfig(platform);
  
  // Exchange code for tokens
  const tokenResponse = await fetch(config.tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }),
  });
  
  const tokens = await tokenResponse.json();
  
  // Store encrypted credentials
  const credential = await createImportCredential({
    workspaceId: stateData.workspaceId,
    platform,
    credentialType: 'oauth',
    encryptedCredentials: await encryptCredentials({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
    }),
    expiresAt: tokens.expires_in 
      ? new Date(Date.now() + tokens.expires_in * 1000)
      : null,
    scopes: tokens.scope?.split(' ') || config.scopes,
    createdBy: stateData.userId,
  });
  
  return { credential };
}
```

---

## Frontend Components

### Import Progress Hook

```typescript
// src/hooks/useImportProgress.ts

import { useSubscription, gql } from '@apollo/client';

const IMPORT_PROGRESS_SUBSCRIPTION = gql`
  subscription ImportJobProgress($jobId: ID!) {
    importJobProgress(jobId: $jobId) {
      id
      status
      totalCalls
      processedCalls
      failedCalls
      estimatedCompletionAt
      lastError
    }
  }
`;

export function useImportProgress(jobId: string | null) {
  const { data, loading, error } = useSubscription(
    IMPORT_PROGRESS_SUBSCRIPTION,
    {
      variables: { jobId },
      skip: !jobId,
    }
  );
  
  const job = data?.importJobProgress;
  
  const progressPercent = job?.totalCalls
    ? Math.round((job.processedCalls / job.totalCalls) * 100)
    : 0;
  
  return {
    job,
    progressPercent,
    isComplete: job?.status === 'COMPLETED',
    isFailed: job?.status === 'FAILED',
    loading,
    error,
  };
}
```

---

## Dependencies

### New Packages

```json
{
  "dependencies": {
    "bull": "^4.12.0",
    "ioredis": "^5.3.0"
  }
}
```

### Infrastructure

- **Redis** — For Bull job queue (can use existing if available)
- **Additional Cloud Storage** — For temporary recording storage during processing

---

## Migration Strategy

### Phase 1: Foundation (Week 1-2)

1. Create database tables and migrations
2. Implement credential encryption/decryption
3. Build platform adapter interface and Gong adapter
4. Set up Bull queues

### Phase 2: Core Flow (Week 3-4)

1. Implement GraphQL API
2. Build import job processor
3. Build call processing pipeline
4. Implement progress tracking

### Phase 3: Frontend (Week 5-6)

1. Platform selector component
2. Credential entry forms
3. Import progress UI
4. Completion/error states

### Phase 4: Polish & Monitoring (Week 7-8)

1. Admin dashboard
2. Alerting on failures
3. Documentation
4. Sales enablement materials

---

## Testing Strategy

### Unit Tests

- Platform adapter credential validation
- Encryption/decryption round-trip
- Job state machine transitions
- Pricing calculations

### Integration Tests

- OAuth flow end-to-end (with mock OAuth server)
- Full import job lifecycle
- Queue processing with retries

### E2E Tests

- Complete import flow from UI
- Progress updates via subscription
- Error handling and recovery

### Load Testing

- 10,000 call import simulation
- Concurrent imports from multiple workspaces
- Queue backpressure handling

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Source API rate limiting | Implement adaptive rate limiting, respect Retry-After headers |
| Large imports timing out | Queue-based processing, no request timeouts |
| Credential rotation complexity | Abstract credential access, automatic refresh for OAuth |
| Queue backlog during peak | Horizontal scaling of workers, priority queues for paid imports |
| Transcript mismatch between platforms | Normalize transcript format, store original alongside |

---

## Observability

### Metrics (Prometheus)

- `import_jobs_total{platform, status}` — Job counts by outcome
- `import_job_duration_seconds{platform}` — Histogram of job durations
- `import_calls_processed_total{platform}` — Calls processed
- `import_queue_depth` — Current queue size
- `platform_api_requests_total{platform, status}` — API call counts
- `platform_api_latency_seconds{platform}` — API latency histogram

### Logging

- Structured JSON logs for all import operations
- Correlation IDs linking jobs to individual call processing
- Sensitive data (credentials) never logged

### Alerting

- Job failure rate > 5% over 1 hour
- Queue depth > 10,000 for > 30 minutes
- Credential verification failures
- Platform API error rate spikes

---

*Last updated: 2026-01-07*
*Author: Engineering Team*
*Status: Not Started*
*Complexity: Large*
