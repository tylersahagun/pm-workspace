# Design Brief: Call Import Engine

## Overview

Design a seamless, confidence-inspiring call import experience that enables customers to bring their historical calls from competitor platforms and connect ongoing phone dialers—transforming a high-friction, opaque process into a transparent, self-service flow.

**Design Goal:** Make importing calls feel as easy as connecting a calendar—clear steps, visible progress, and no ambiguity about what's happening.

---

## User Flow

### Flow 1: Onboarding Import (Primary)

```
┌─────────────────────────────────────────────────────────────┐
│  Onboarding Step: Data Migration                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  "Are you coming from another platform?"                    │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     Gong     │  │    Fathom    │  │    Grain     │      │
│  │     [✓]      │  │     [ ]      │  │     [ ]      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ RingCentral  │  │  Zoom Phone  │  │    Other     │      │
│  │     [ ]      │  │     [ ]      │  │     [ ]      │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│  [ ] No, I'm starting fresh                                 │
│                                                             │
│                              [Continue →]                   │
└─────────────────────────────────────────────────────────────┘
```

**Decision Points:**
1. User selects source platform → Show platform-specific requirements
2. User selects "No" → Skip to next onboarding step
3. User selects "Other" → Show unsupported message with feedback capture

### Flow 2: Credential Entry

```
┌─────────────────────────────────────────────────────────────┐
│  Connect to Gong                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ℹ️  What you'll need:                               │   │
│  │  • Gong API Access Token (Admin role required)      │   │
│  │  • Access to calls you want to import               │   │
│  │                                                      │   │
│  │  [How to get your API key →]                        │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  API Access Token                                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ ●●●●●●●●●●●●●●●●●●●●●●●●●●●●●●                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  🔒 Your credentials are encrypted and stored securely     │
│                                                             │
│  [← Back]                          [Verify & Continue →]   │
└─────────────────────────────────────────────────────────────┘
```

**For OAuth platforms (RingCentral):**
```
┌─────────────────────────────────────────────────────────────┐
│  Connect to RingCentral                                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│      ┌───────────────────────────────────┐                 │
│      │                                   │                 │
│      │    [RingCentral Logo]             │                 │
│      │                                   │                 │
│      │    Connect your RingCentral       │                 │
│      │    account to import calls        │                 │
│      │                                   │                 │
│      │    [Connect with RingCentral]     │                 │
│      │                                   │                 │
│      └───────────────────────────────────┘                 │
│                                                             │
│  🔒 AskElephant will only access call recordings            │
│     We never access contacts or messages                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Flow 3: Import Preview & Pricing

```
┌─────────────────────────────────────────────────────────────┐
│  Import Preview                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ Connected to Gong successfully                          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  📞 1,247 calls found                                │   │
│  │                                                      │   │
│  │  Date range: Jan 2024 - Jan 2026                    │   │
│  │  Average duration: 28 minutes                       │   │
│  │  Estimated import time: ~2 hours                    │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Pricing                                             │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  First 1,000 calls                        FREE      │   │
│  │  Remaining 247 calls × $0.10             $24.70     │   │
│  │  ─────────────────────────────────────────────────  │   │
│  │  Total                                   $24.70     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  [← Back]                              [Start Import →]    │
└─────────────────────────────────────────────────────────────┘
```

### Flow 4: Import Progress

```
┌─────────────────────────────────────────────────────────────┐
│  Importing Calls                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ████████████████░░░░░░░░░░░░░░░░░░░░  42%          │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  📞 523 of 1,247 calls imported                            │
│  ⏱️  Estimated time remaining: ~1 hour 15 minutes          │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Latest imports:                                    │   │
│  │  ✓ Sales call with Acme Corp - 32 min              │   │
│  │  ✓ Discovery call with TechStart - 28 min          │   │
│  │  ✓ Demo with Enterprise Inc - 45 min               │   │
│  │  ↻ Processing: Quarterly review with BigCo...      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  💡 You can close this page - we'll email you when done    │
│                                                             │
│  [Continue to AskElephant →]                               │
└─────────────────────────────────────────────────────────────┘
```

### Flow 5: Import Complete

```
┌─────────────────────────────────────────────────────────────┐
│  🎉 Import Complete!                                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │                                                      │   │
│  │         ✅                                           │   │
│  │                                                      │   │
│  │    1,247 calls imported successfully                │   │
│  │                                                      │   │
│  │    Ready for AI analysis, coaching,                 │   │
│  │    and CRM sync                                     │   │
│  │                                                      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  What's next:                                               │
│  • Your calls are being processed by AI (~10 min each)     │
│  • Insights will appear in your dashboard                  │
│  • Connect your CRM to sync call data automatically        │
│                                                             │
│                    [View My Calls →]                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Screens/States

### Screen Inventory

| Screen | Purpose | Priority |
|--------|---------|----------|
| Platform Selector | Choose import source | P0 |
| Credential Entry (API Key) | Manual credential input | P0 |
| Credential Entry (OAuth) | OAuth connection flow | P0 |
| Import Preview | Show call count, pricing, confirm | P0 |
| Import Progress | Live status during import | P0 |
| Import Complete | Success with next steps | P0 |
| Import Failed | Error with remediation | P0 |
| Unsupported Platform | Capture feedback, set expectations | P1 |
| Dialer Sync Dashboard | Ongoing connection status | P1 |
| Import History | Admin view of past imports | P2 |

### State Inventory

| State | Trigger | Visual Treatment |
|-------|---------|------------------|
| Loading | Verifying credentials | Spinner + "Verifying..." |
| Success | Credentials valid | Green checkmark, proceed button |
| Error - Invalid credentials | API rejected | Red alert, inline error message |
| Error - Insufficient permissions | Missing scopes | Yellow warning, specific instructions |
| Error - Rate limited | Too many requests | Yellow warning, retry timer |
| Error - Platform unavailable | API down | Red alert, suggest retry later |
| Partial success | Some calls failed | Yellow summary, option to retry failed |

---

## Interaction Patterns

### 1. Progressive Disclosure

- Don't overwhelm with all options upfront
- Show requirements only after platform selection
- Pricing visible only after successful connection
- Advanced options (date range filter) collapsed by default

### 2. Inline Validation

- Verify credentials before proceeding
- Show immediate feedback on API key format
- Test connection with loading state
- Clear error messages with remediation steps

### 3. Non-Blocking Progress

- User can leave import page and return
- Email notification on completion
- Background indicator in app header during active import
- No page-blocking modals during long imports

### 4. Confidence Builders

- Security messaging near credential inputs ("encrypted", "secure")
- Permission transparency for OAuth ("only accesses recordings")
- Price preview before commitment
- Clear cancellation path during import

---

## Edge Cases

### Empty States

| Scenario | Design |
|----------|--------|
| No calls found | "We couldn't find any calls in your account. Check your date range or permissions." |
| All calls already imported | "All calls from this source have already been imported." |
| No supported platforms | (Shouldn't happen) Fallback to manual upload option |

### Error States

| Error | Message | Remediation |
|-------|---------|-------------|
| Invalid API key | "This API key doesn't appear to be valid. Double-check you copied the full key." | [How to find your API key] |
| Expired credentials | "Your connection to [Platform] has expired. Please reconnect." | [Reconnect] button |
| Permission denied | "AskElephant doesn't have permission to access your recordings. Your [Platform] admin may need to grant access." | Instructions for admin |
| Platform API down | "We're having trouble connecting to [Platform] right now. This is usually temporary." | Retry in 5 minutes |
| Partial import failure | "1,200 of 1,247 calls imported. 47 calls couldn't be imported due to access restrictions." | [View failed calls] [Retry] |

### Loading States

| Context | Treatment |
|---------|-----------|
| Credential verification | Button → Spinner → "Verifying..." (2-5 sec) |
| Counting calls | Skeleton with pulsing numbers |
| Import in progress | Progress bar with percentage, call count, time estimate |
| Large import (>5000) | Same as above, plus email notification option emphasized |

---

## Accessibility Considerations

### Requirements

- [ ] All interactive elements keyboard accessible
- [ ] Progress bar has ARIA live region for screen readers
- [ ] Error messages associated with form fields via aria-describedby
- [ ] Color not sole indicator of state (icons + text + color)
- [ ] Focus management after async operations (return focus to logical element)
- [ ] Sufficient color contrast for all text (WCAG AA minimum)

### Screen Reader Announcements

- "Connection verified successfully"
- "Import in progress. 523 of 1,247 calls imported. Approximately 1 hour 15 minutes remaining."
- "Import complete. 1,247 calls imported successfully."
- "Error: Invalid API key. Instructions for finding your API key are available."

---

## Design References

### Internal Patterns to Reuse

- OAuth connection flow from HubSpot/Salesforce integrations
- Progress indicators from existing upload flows
- Error/success toast patterns from current app
- Card-based selector from workspace settings

### External Inspiration

| Product | Pattern | Why It's Relevant |
|---------|---------|-------------------|
| Zapier | Integration connector cards | Clean platform selection |
| Notion | Import progress UI | Non-blocking, transparent progress |
| Stripe | Checkout pricing breakdown | Clear cost transparency |
| Linear | Onboarding wizard | Step-by-step with ability to skip |

---

## Component Inventory

### New Components Needed

| Component | Description | Complexity |
|-----------|-------------|------------|
| `PlatformSelector` | Grid of platform cards with selection state | Medium |
| `CredentialForm` | API key input with validation, help link | Low |
| `OAuthConnectButton` | OAuth flow trigger with loading state | Low |
| `ImportPreview` | Call count, pricing breakdown, CTA | Medium |
| `ImportProgress` | Progress bar, stats, live updates | High |
| `ImportComplete` | Success state with next steps | Low |
| `ImportError` | Error display with remediation | Medium |
| `SyncStatusCard` | Ongoing dialer connection status | Medium |

### Existing Components to Extend

- Form inputs (adapt for credential entry)
- Button variants (OAuth branded buttons)
- Alert/notification patterns
- Modal/sheet for confirmations

---

## Open Design Questions

1. **Platform logos:** Do we have licensing/permission for Gong, Fathom, RingCentral logos?
2. **Pricing display:** Show per-call breakdown or just total? Both?
3. **Date range filter:** MVP or Phase 2? Adds complexity but high value for large libraries.
4. **Cancel import:** Allow mid-import cancellation? What happens to already-imported calls?
5. **Batch imports:** Can user import from multiple platforms simultaneously?

---

## Prototype Plan

### Storybook Components

Location: `prototypes/src/components/CallImport/`

1. `PlatformSelector.stories.tsx` - All selection states
2. `CredentialForm.stories.tsx` - API key and OAuth variants
3. `ImportPreview.stories.tsx` - Various call counts and pricing
4. `ImportProgress.stories.tsx` - 0%, 50%, 100%, error states
5. `ImportComplete.stories.tsx` - Success with next steps

### Interactive Prototype

After component approval, assemble into clickable flow for stakeholder review.

---

*Last updated: 2026-01-07*
*Designer: TBD*
*Status: Not Started*
