---
name: activity-reporter
description: Generate time-bounded activity reports (end-of-day, end-of-week, digest) that aggregate work across GitHub, Linear, and PM workspace. Use when running /eod, /eow, or /digest commands.
---

# Activity Reporter Skill

Procedural knowledge for generating activity reports that focus on **what happened** during a specific period and **what should happen next**.

## When to Use

- Running `/eod` command for end-of-day reports
- Running `/eow` command for end-of-week reports
- Running `/digest` command for quick newspaper-style summaries
- Answering "what did we do today/this week?"
- Generating stakeholder involvement recommendations
- Tracking work velocity across initiatives

## Report Modes

| Mode              | Command         | Length     | Style               | Audience       |
| ----------------- | --------------- | ---------- | ------------------- | -------------- |
| **Full EOD**      | `/eod`          | ~200 lines | Technical report    | PM/Engineering |
| **Full EOW**      | `/eow`          | ~300 lines | Technical + trends  | PM/Engineering |
| **Daily Digest**  | `/eod --digest` | ~50 lines  | Newspaper headlines | Anyone         |
| **Weekly Digest** | `/eow --digest` | ~60 lines  | Newspaper headlines | Anyone         |
| **Rob Mode**      | `/eod --rob`    | ~40 lines  | Simple + verified   | Revenue/CRO    |
| **Rob Mode**      | `/eow --rob`    | ~50 lines  | Simple + verified   | Revenue/CRO    |

### Digest Mode (`--digest` flag)

Quick "Sunday paper" format for **revenue team audience** - business impact, not technical metrics.

```
/eod --digest    # Daily digest
/eow --digest    # Weekly digest
```

**Audience:** Revenue team, stakeholders, non-technical readers
**Focus:** Features shipped, bugs fixed, product impact
**Avoid:** PR counts, technical jargon, PM workspace internals

**Core Team (use names, not GitHub handles):**
Matt Noxon, Jason, Eduardo, Palmer, Kaden, Dylan, Bryan, Adam, Skylar

**Note:** Highlight any visual/UI changes in the Features section.

### Rob Mode (`--rob` flag)

**Named after:** Robert Henderson (CRO) - optimized for revenue team consumption.

The `--rob` flag generates a **simplified, verified** report designed for the revenue team and executives:

```
/eod --rob     # Daily Rob report
/eow --rob     # Weekly Rob report
```

**Key Differences from `--digest`:**

| Aspect                   | `--digest`       | `--rob`                         |
| ------------------------ | ---------------- | ------------------------------- |
| **Reading Level**        | General audience | High school senior (12th grade) |
| **Technical Jargon**     | Minimal          | **Zero** - plain English only   |
| **Feature Availability** | Listed           | **Verified against PostHog**    |
| **Internal Features**    | May appear       | **Automatically hidden**        |
| **Language**             | Feature-focused  | **Benefit-focused**             |

**Reading Level Requirements:**

- Short sentences (max 15 words)
- Common words only (no "integration", "workflow", "synchronization")
- Active voice ("We added X" not "X was implemented")
- Concrete benefits ("Save time" not "Improved efficiency")
- No abbreviations without explanation

**Language Transformations:**

| Technical                              | Rob-Friendly                                       |
| -------------------------------------- | -------------------------------------------------- |
| "HubSpot integration sync"             | "Your CRM now updates automatically"               |
| "Workflow automation enhancements"     | "Set it and forget it - less manual work"          |
| "AI-powered conversation intelligence" | "We watch your calls and find the important stuff" |
| "Performance optimizations"            | "The app runs faster now"                          |
| "Bug fixes in recording pipeline"      | "Fixed some issues with call recording"            |
| "GraphQL query improvements"           | "Faster page loads"                                |

**Mandatory Feature Availability Check:**

When `--rob` is used, ALL features MUST be checked against PostHog:

1. Query PostHog feature flags for each feature mentioned
2. Only include features with ✅ GA status (100% rollout, no restrictions)
3. Add availability table ONLY if partial/internal features exist
4. Remove or grey-out any internal-only features
5. Add note: "All features listed are available to your team now"

**Rob Mode Sections:**

1. **What's New** (not "Features Shipped")
   - Plain English descriptions
   - Customer benefit focus
   - ✅ All verified as customer-visible
2. **What We Fixed** (not "Bug Fixes")
   - Simple descriptions
   - Focus on user impact
3. **Revenue Wins** (always included)
   - Deals closed
   - SDR stats from #sdr-stats
   - Expansions, churn saves
4. **Coming Soon** (not "What's Coming Next")
   - Plain language previews
5. **Quick Stats** (simplified)
   - New features: X
   - Bugs fixed: X
   - Deals closed: X
   - Meetings set: X

**Output:** `rob-YYYY-MM-DD.md` or `rob-YYYY-WXX.md`

**Example Rob Mode Output:**

```markdown
# What's New This Week

**January 27, 2026**

Hey Revenue Team! Here's what the product team shipped that you can use with customers right now.

## What's New

**Your CRM updates are now instant** — When you update a deal in HubSpot, it shows up in AskElephant right away. No more waiting or refreshing.

**Call recordings load faster** — We made the app quicker. You'll notice pages load faster, especially on big accounts.

## What We Fixed

- Fixed an issue where some mobile users had to log in twice
- Call recordings now show up properly after outages

## Revenue Wins

**Deals Closed:** 4 new customers ($20.4k ARR)
**SDR Activity:** 12 meetings set, 3 ICPs held
**Expansion:** $5.7k from Hadco Construction

## Coming Soon

- Better search across all your conversations
- Easier way to share meeting notes with your team

---

_All features listed are available to your team now._
_Report date: January 27, 2026_
```

**Daily Digest Sections:**

- Headline (biggest customer impact)
- New Features (type/feature-request)
- Improvements (type/improvement)
- Bugs Fixed (type/bug)
- Team Focus (who worked on what feature area)
- **Revenue Wins (deals, sets, expansions, churn saves)**
- What's Coming Next
- Stats (features, improvements, bugs, deals, sets)

**Weekly Digest Sections:**

- Week's Headline (biggest customer win)
- New Features (grouped by product area)
- Improvements (enhancements to existing features)
- Bugs Fixed (count + categories by area)
- Team Contributions (by feature area)
- **Revenue Wins (deals closed, SDR leaderboard, expansions, churn saves)**
- What's Coming Next
- Week Stats (features, improvements, bugs, deals, sets)

**DO NOT INCLUDE:**

- PM Workspace Advances (personal to Tyler)
- PR counts or "PRs merged" metrics
- GitHub handles (use real names)
- Technical infrastructure details

**Output files:**

- Daily: `digest-YYYY-MM-DD.md`
- Weekly: `digest-YYYY-WXX.md`

## Key Difference from Portfolio Status

| Aspect       | `/status-all` (Portfolio Status)     | `/eod` / `/eow` (Activity Reporter) |
| ------------ | ------------------------------------ | ----------------------------------- |
| Focus        | What artifacts exist (point-in-time) | What happened (time-bounded)        |
| Time Range   | Current state                        | Today / This week                   |
| Output       | Artifact gap matrix                  | Activity timeline by initiative     |
| Action Items | "Missing X artifact"                 | "Continue Y, involve Z stakeholder" |

## Data Sources

### 0. HubSpot - Authoritative Revenue Data (PRIMARY)

**Uses:** `hubspot-activity` subagent  
**MCP Server:** `user-mcp-hubspot-9wje34`

HubSpot provides **authoritative** deal data that should be the primary source for revenue metrics. This is more reliable than Slack posts which may be incomplete.

#### Invoke HubSpot Activity Subagent

```
Task: hubspot-activity subagent
Prompt: "Pull HubSpot revenue activity for [time_range]. Return deals closed, deals lost, meetings booked, and metrics."
Model: fast
```

#### Data Retrieved

| Metric              | Source                              | Notes                    |
| ------------------- | ----------------------------------- | ------------------------ |
| **Deals Closed**    | `deals` with `dealstage=closedwon`  | Authoritative ARR values |
| **Deals Lost**      | `deals` with `dealstage=closedlost` | Churn/competitive intel  |
| **Meetings Booked** | `meetings` object                   | SDR sets                 |
| **ARR Metrics**     | Calculated from deal `amount`       | Total, avg, by rep       |

#### Integration Priority

1. **Primary**: HubSpot data (authoritative values, complete)
2. **Supplement**: Slack channels (celebrations, quotes, context)
3. **Merge**: When same deal appears in both, use HubSpot values + Slack context

### 1. Slack - Revenue & Engineering Activity

**Uses:** `slack-sync` skill  
**MCP Server:** `pm-mcp-config`

Slack provides real-time signals for revenue team wins and engineering updates that aren't captured in GitHub or Linear. Use as **supplement** to HubSpot data for qualitative context.

#### Revenue Channels to Monitor

| Channel                  | Win Type                              | Priority |
| ------------------------ | ------------------------------------- | -------- |
| #sales-closed-won        | Deals closed                          | HIGH     |
| #team-sales              | SDR sets, demo bookings               | HIGH     |
| **#sdr-stats**           | **Daily SDR metrics (self-reported)** | **HIGH** |
| #expansion-opportunities | Expansion wins                        | MEDIUM   |
| #churn-alert             | Churn saves                           | HIGH     |
| #team-partners           | Partner additions                     | MEDIUM   |
| #customer-quotes         | Customer wins/quotes                  | MEDIUM   |

#### #sdr-stats Channel (NEW)

**Channel ID:** `C0A05H709SM`  
**Purpose:** SDRs post daily activity metrics in a structured format

**Message Format (self-reported by SDRs):**

```
MM/DD/YY
Conversations: X
Pitches: X
Meetings Scheduled: X
ICP Held: X
```

**Metrics Explained:**
| Metric | Definition |
|--------|------------|
| **Conversations** | Total outbound conversations (calls, emails, LinkedIn) |
| **Pitches** | Conversations that reached pitch stage |
| **Meetings Scheduled** | Demos/meetings booked |
| **ICP Held** | Meetings that happened with Ideal Customer Profile |

**SDR Team Members (resolve from org-chart.md):**
| SDR | Slack ID |
|-----|----------|
| Adia Barkley (Lead) | `U07JRK6MGL9` |
| Carter Thomas | `U09S5QQCGS1` |
| Jamis Benson | `U094PHNHCN8` |
| Michael Haimowitz | `U098Q4N5PEJ` |

**Extraction Procedure:**

1. Fetch #sdr-stats history for time range
2. Parse each message for metrics
3. Match user ID to SDR name
4. Aggregate per-SDR and team totals
5. Calculate conversion rates:
   - **Pitch Rate:** Pitches / Conversations
   - **Meeting Rate:** Meetings / Pitches
   - **ICP Hold Rate:** ICP Held / Meetings

**SDR Stats Output Format:**

```markdown
### 📞 SDR Activity

_Source: #sdr-stats channel (self-reported)_

| SDR               | Conversations | Pitches | Meetings Set | ICP Held |
| ----------------- | ------------- | ------- | ------------ | -------- |
| Jamis Benson      | 7             | 6       | 4            | 2        |
| Carter Thomas     | 8             | 6       | 5            | 1        |
| Michael Haimowitz | 3             | 2       | 3            | 0        |
| **Team Total**    | **18**        | **14**  | **12**       | **3**    |

**Conversion Rates:**

- Pitch Rate: 78% (14/18)
- Meeting Rate: 86% (12/14)
- ICP Hold Rate: 25% (3/12)
```

#### Engineering Channels to Monitor

| Channel               | Signal Type           | Priority         |
| --------------------- | --------------------- | ---------------- |
| #product-updates      | Release announcements | HIGH             |
| #product-issues       | Bugs resolved         | MEDIUM           |
| #team-dev-code-review | PR activity           | LOW (supplement) |

#### Slack Tool Calls

```bash
# Fetch channel history for time range
CallMcpTool: pm-mcp-config / SLACK_FETCH_CONVERSATION_HISTORY
  channel: "<CHANNEL_ID>"
  oldest: "<UNIX_TIMESTAMP>"  # Start of day/week
  limit: 100

# Search for specific patterns
CallMcpTool: pm-mcp-config / SLACK_SEARCH_MESSAGES
  query: "in:#sales-closed-won after:2026-01-23"
  sort: "timestamp"
  count: 50
```

#### Name Resolution

Map Slack user IDs to real names using:
`pm-workspace-docs/company-context/org-chart.md`

Key revenue team members:

- Ben Kinard (U09MLGSC5AL) - Head of Sales
- Adia Barkley (U07JRK6MGL9) - Founding SDR
- Michael Cook (U09V1J1VBL4) - AE
- Reuben Tang (U09KCQ48NQN) - AE
- Ben Harrison (U092NQWH9PF) - Head of CX
- Parker Alexander (U098T59RUMT) - Expansion CSM

### 2. GitHub - elephant-ai (Engineering Activity)

```bash
# Merged PRs in time range
gh pr list -R askelephant/elephant-ai \
  -s merged \
  --search "merged:>=YYYY-MM-DD" \
  --json number,title,author,mergedAt,headRefName,labels,body

# Opened PRs in time range
gh pr list -R askelephant/elephant-ai \
  -s open \
  --search "created:>=YYYY-MM-DD" \
  --json number,title,author,createdAt,headRefName

# Recent commits (for branch activity)
gh api repos/askelephant/elephant-ai/commits \
  --jq '.[].commit.message' \
  -f since=YYYY-MM-DDTHH:MM:SSZ
```

### 2. GitHub - pm-workspace (PM Activity)

```bash
# Prototype changes in time range
git log --since="YYYY-MM-DD" --name-only --pretty=format:"%h|%s|%an|%ai" -- "prototypes/src/components/"

# Doc changes in time range
git log --since="YYYY-MM-DD" --name-only --pretty=format:"%h|%s|%an|%ai" -- "pm-workspace-docs/"

# Branch activity (recent branches)
git for-each-ref --sort=-committerdate --format='%(refname:short)|%(committerdate:iso)|%(subject)' refs/heads/ | head -20

# Commits today/this week
git log --since="midnight" --oneline  # Today
git log --since="last monday" --oneline  # This week
```

### 3. Linear (Development Tracking)

Use Linear MCP tools:

- `linear_getActiveCycle(teamId)` - Current cycle snapshot
- `linear_searchIssues(...)` - Issues updated in time range
- `linear_getProjectIssues(projectId)` - Project-specific issues

**Key Fields:**

- `updatedAt` - Filter for time range
- `state.name` - Track state transitions
- `assignee` - Who worked on it
- `project` - Map to initiative

### 4. Local Workspace State

```bash
# Initiative metadata changes
git log --since="YYYY-MM-DD" --name-only -- "pm-workspace-docs/initiatives/*/_meta.json"

# Status report history
ls -la pm-workspace-docs/status/

# Prototype version changes (folder structure)
ls -la prototypes/src/components/*/v*/
```

## Initiative Mapping

### Primary: ASK-XXXX Extraction (from github-sync skill)

Extract Linear issue IDs from:

- Branch names: `ASK-4591-feature-name` → `ASK-4591`
- PR titles: `[ASK-4591] Feature` → `ASK-4591`
- Commit messages: `ASK-4591: Fix bug` → `ASK-4591`

Then resolve: ASK-XXXX → Linear Issue → Project → `_meta.json` → Initiative

### Secondary: File Path Heuristics

Map prototype/doc paths to initiatives:

| Path Pattern                                  | Initiative                |
| --------------------------------------------- | ------------------------- |
| `prototypes/src/components/HubSpotConfig/`    | hubspot-agent-config-ui   |
| `prototypes/src/components/SignalTables/`     | universal-signal-tables   |
| `prototypes/src/components/JourneyWorkspace/` | customer-journey-map      |
| `prototypes/src/components/RepWorkspace*/`    | rep-workspace             |
| `prototypes/src/components/CRMExperienceE2E/` | crm-exp-ete               |
| `prototypes/src/components/SettingsRedesign/` | settings-redesign         |
| `prototypes/src/components/BetaFeatures/`     | release-lifecycle-process |
| `pm-workspace-docs/initiatives/[name]/`       | [name]                    |

### Fallback: Unlinked Activity

Activity that can't be mapped:

- Dependabot PRs
- Infrastructure/CI changes
- Shared utility updates
- Generic commits without ASK-XXXX

## Linear Label Taxonomy

Use Linear labels to categorize work for reports and digests.

### Issue Types

| Type        | Labels                            | Description                           |
| ----------- | --------------------------------- | ------------------------------------- |
| Bug         | `type/bug`, `bug`                 | Bug report or defect                  |
| Improvement | `type/improvement`, `improvement` | Enhancement to existing functionality |
| Feature     | `type/feature-request`            | New feature or capability             |

### Product Areas

| Area            | Labels                                     | Customer-Facing Name              |
| --------------- | ------------------------------------------ | --------------------------------- |
| Conversations   | `area/conversations`, `conversation`       | Meeting Capture                   |
| Insights/Search | `area/insights-search`                     | Global Chat & Search              |
| Automations     | `area/automations`, `workflow`             | Workflows & Automation            |
| Integrations    | `area/integrations`                        | Integrations (see taxonomy below) |
| Platform        | `area/platform`                            | Settings & Security               |
| Mobile/Desktop  | `area/mobile-desktop`, `mobile`, `desktop` | Apps                              |
| Imports         | `area/imports`                             | Call Imports                      |

### Integration & Product Taxonomy

**CRITICAL**: Use correct categories when grouping integration work in digests. Misclassifying products (e.g., calling Dialpad a "CRM") is a factual error.

#### CRM Integrations

Customer Relationship Management systems that store contact/deal data.

| Product        | Type | Description                  |
| -------------- | ---- | ---------------------------- |
| **HubSpot**    | CRM  | Sales/marketing CRM platform |
| **Salesforce** | CRM  | Enterprise CRM platform      |
| **Pipedrive**  | CRM  | Sales-focused CRM            |
| **Zoho CRM**   | CRM  | SMB CRM platform             |

#### Telephony & Dialers

Phone/calling platforms that handle voice communication.

| Product         | Type             | Description                 |
| --------------- | ---------------- | --------------------------- |
| **Dialpad**     | Telephony/Dialer | Cloud phone system with AI  |
| **Aircall**     | Telephony/Dialer | Cloud call center software  |
| **RingCentral** | Telephony/Dialer | Business phone system       |
| **Twilio**      | Telephony/API    | Communications API platform |

#### Video Conferencing

Meeting platforms for video calls.

| Product             | Type               | Description                        |
| ------------------- | ------------------ | ---------------------------------- |
| **Zoom**            | Video Conferencing | Video meeting platform             |
| **Google Meet**     | Video Conferencing | Google's video platform            |
| **Microsoft Teams** | Video Conferencing | Microsoft's collaboration platform |
| **Webex**           | Video Conferencing | Cisco's video platform             |

#### Calendar & Scheduling

Calendar and meeting scheduling tools.

| Product              | Type       | Description               |
| -------------------- | ---------- | ------------------------- |
| **Google Calendar**  | Calendar   | Google's calendar service |
| **Outlook Calendar** | Calendar   | Microsoft's calendar      |
| **Calendly**         | Scheduling | Meeting scheduling tool   |

#### Other Integration Types

| Category      | Examples                      |
| ------------- | ----------------------------- |
| **Email**     | Gmail, Outlook                |
| **Messaging** | Slack, Microsoft Teams (chat) |
| **Storage**   | Google Drive, Dropbox         |
| **Analytics** | PostHog, Mixpanel             |

### Digest Category Groupings

When organizing features in digests, use these **accurate** category headers:

```markdown
**CRM Integrations**

- HubSpot workflow testing
- Salesforce field mapping

**Telephony & Dialers**

- Dialpad direct integration ← NOT "CRM"!
- Aircall call sync

**Recording & Capture**

- Desktop MP4 audio
- Web recording indicators

**Video Conferencing**

- Zoom bot improvements
- Teams integration updates
```

**DO NOT** group Dialpad, Aircall, or other telephony under "CRM Integrations".

### Feature Labels

| Feature         | Labels                              |
| --------------- | ----------------------------------- |
| Meeting Capture | `feature/meeting-capture`           |
| AI Intelligence | `feature/conversation-intelligence` |
| Global Chat     | `feature/internal-search`           |
| Signals         | `feature/signals`                   |
| Workflows       | `feature/workflows`                 |
| HubSpot         | `feature/hubspot`, `hubspot`        |
| Salesforce      | `feature/salesforce`, `salesforce`  |
| Desktop App     | `feature/desktop-app`, `desktop`    |
| Mobile App      | `feature/mobile-app`, `mobile`      |

### Digest Work Categories

Group work in digests by **type first**:

```markdown
### ✨ NEW FEATURES

[type/feature-request or new capabilities]

### 🔧 IMPROVEMENTS

[type/improvement or enhancements]

### 🐛 BUGS FIXED

[type/bug items]
```

Within each type, organize by product area:

- **Recording & Capture** — conversations, mobile-desktop
- **CRM Integrations** — hubspot, salesforce
- **Workflows & Automation** — automations, workflows
- **Platform & Settings** — platform, security

---

## Revenue Team Wins (NEW)

**CRITICAL**: EOD and EOW reports MUST include a dedicated **Revenue Team Wins** section. This is separate from engineering activity and provides visibility into business momentum.

### Win Categories

| Win Type              | Source Channel                    | Extraction Pattern                   |
| --------------------- | --------------------------------- | ------------------------------------ |
| **Deals Closed**      | #sales-closed-won                 | Any message = deal celebration       |
| **SDR Sets**          | #team-sales                       | "set", "booked", "demo"              |
| **Partner Additions** | #team-partners, #hubspot-partners | "signed", "new partner", "onboarded" |
| **Quotes Sent**       | #team-sales                       | "quote", "proposal"                  |
| **Expansion Added**   | #expansion-opportunities          | Any message                          |
| **Churn Mitigated**   | #churn-alert                      | "saved", "renewed", "won back"       |
| **Customer Wins**     | #customer-quotes                  | Notable quotes, testimonials         |

### Revenue Team Members

Map Slack IDs to names (from org-chart.md):

**Sales Leadership:**

- Ben Kinard (U09MLGSC5AL) - Head of Sales
- James Hinkson (U08QCGQFD1A) - Head of HubSpot Partnership

**Account Executives:**

- Michael Cook (U09V1J1VBL4)
- Reuben Tang (U09KCQ48NQN)
- Pete Belliston (U07FAMYTG87)

**SDR Team:**

- Adia Barkley (U07JRK6MGL9) - Founding SDR
- Carter Thomas (U09S5QQCGS1)
- Jamis Benson (U094PHNHCN8)
- Michael Haimowitz (U098Q4N5PEJ)

**Partnerships:**

- Tanner Mattson (U0A6T7A92T0)

**Customer Success:**

- Ben Harrison (U092NQWH9PF) - Head of CX
- Eli Gomez (U060G4DK1CZ)
- Parker Alexander (U098T59RUMT) - Expansion
- Tyler Whittaker (U08GHTYTWVC)
- Erika Vasquez (U092MH288P3)

### Revenue Wins Format (for Reports)

```markdown
---

## 🎯 Revenue Team Wins

**Period:** [Date Range]
**Source:** HubSpot (authoritative) + Slack (context)

### Deals Closed 🎉

| Deal | Rep | ARR | Closed |
|------|-----|-----|--------|
| [Company Name] | [Rep Name] | $XX,XXX | [Date] |
| [Company Name] | [Rep Name] | $XX,XXX | [Date] |

**Total ARR Won:** $XX,XXX | **Deals:** X | **Avg Deal:** $XX,XXX

### SDR Activity 📞

| Rep | Meetings Booked |
|-----|-----------------|
| Adia Barkley | X |
| Jamis Benson | X |
| [SDR Name] | X |

**Total Meetings:** X

### Deals Lost 📉

| Deal | Rep | ARR | Reason |
|------|-----|-----|--------|
| [Company] | [Rep] | $XX,XXX | [Reason] |

**Lost ARR:** $XX,XXX | **Win Rate:** XX%

### Partner Wins 🤝
- **[Partner Name]** - Signed/onboarded by [Rep]

### Expansion Revenue 📈
- **[Account Name]**: [Expansion type] by [CSM]

### Churn Saves 🛡️
- **[Account Name]**: Saved by [CSM] - [Reason]

### Customer Highlights 💬
> "[Notable quote]" - [Customer Name]

---
```

### Revenue Wins Extraction Procedure

1. **Load org chart** for Slack ID → Name mapping
2. **Calculate time range** (today or this week)
3. **Fetch channels:**

   ```
   SLACK_FETCH_CONVERSATION_HISTORY:
   - #sales-closed-won
   - #expansion-opportunities
   - #team-partners

   SLACK_SEARCH_MESSAGES:
   - "set" OR "booked" in:#team-sales after:YYYY-MM-DD
   - "saved" OR "renewed" in:#churn-alert after:YYYY-MM-DD
   ```

4. **Parse messages:**
   - Extract deal names, rep names, values (if mentioned)
   - Count SDR sets by rep
   - Identify expansion accounts
   - Track churn saves
5. **Format output** using template above
6. **Insert after engineering section** in report

### Digest Mode Revenue Section

For `--digest` mode, include a condensed revenue section:

```markdown
---

## 🎯 REVENUE WINS

**Deals Closed:** X new customers
**SDR Sets:** X demos booked  
**Expansion:** $XXk added
**Churn Saved:** X accounts

**Highlights:**
- [Top deal of the day/week]
- [Notable SDR performance]
- [Key churn save]

---
```

### SDR Activity Section (NEW)

Query HubSpot for meetings created today, filtered by SDR owner IDs:

```markdown
### 📞 SDR Activity (Meetings Set Today)

| SDR               | Meetings Booked | Notes              |
| ----------------- | --------------- | ------------------ |
| Adia Barkley      | X               | [Notable accounts] |
| Carter Thomas     | X               |                    |
| Jamis Benson      | X               |                    |
| Michael Haimowitz | X               |                    |

**SDR Total:** X meetings set

_Note: SDR meeting activity from HubSpot. AE-sourced meetings tracked separately._
```

**SDR Owner IDs (from org-chart.md):**

- Adia Barkley: 70146239 / 1721345617
- Carter Thomas: 85047772
- Jamis Benson: 81467875
- Michael Haimowitz: 82187301

**AE Owner IDs (for context):**

- Reuben Tang: 83885337
- Michael Cook: 85535426
- Ben Kinard: 84501860

**Partnership Owner IDs:**

- Pete Belliston: 668593263
- Tanner Mattson: 86821908
- James Hinkson: 79737960

### Feature Availability Section (NEW)

For `--digest` mode, add availability table to NEW FEATURES section:

```markdown
## ✨ NEW FEATURES

| Feature          | Availability | Notes                    |
| ---------------- | ------------ | ------------------------ |
| **Feature Name** | ✅ GA        | `flag-key` at 100%       |
| **Feature Name** | ⚠️ Partial   | 50% rollout              |
| **Feature Name** | ❌ Internal  | AskElephant only         |
| **Feature Name** | ✅ GA        | No flag (shipped direct) |
```

**Availability Classification:**

- ✅ **GA** — 100% rollout, no workspace restrictions
- ⚠️ **Partial** — <100% rollout or Early Access linked
- ❌ **Internal** — Restricted to AskElephant workspace
- ✅ **No flag** — Feature shipped without flag (backend/native app)

**PostHog Query:**

```
CallMcpTool: user-mcp-posthog-zps2ir / POSTHOG_LIST_AND_MANAGE_PROJECT_FEATURE_FLAGS
{ "project_id": "81505", "limit": 100 }
```

**Flag-to-Feature Mapping (common):**
| Feature | Flag Key |
|---------|----------|
| Notes | `notes-object` |
| Projects | `projects-page` |
| Privacy Agent | `privacy-determination-agent` |
| Global Chat | `global-chat-enabled` |
| Internal Search | `chat-tool-internal-search` |
| Composio/Integrations | `composio-enabled` |
| Dataloaders | `dataloaders-enabled` |

### No Activity Handling

If no revenue wins found:

```markdown
## 🎯 Revenue Team Wins

_No closed deals, sets, or expansions recorded in Slack for this period._

**Channels checked:** #sales-closed-won, #team-sales, #expansion-opportunities
```

## Activity Categorization

Categorize each activity item by domain:

| Category        | Indicators                                                                     |
| --------------- | ------------------------------------------------------------------------------ |
| **Engineering** | PR merged, code commits, `fix:`, `feat:`, Linear issue state changes           |
| **Product**     | PRD updates, research.md changes, hypothesis updates, `/pm` outputs            |
| **Design**      | Prototype iterations, design-brief.md changes, Figma exports, `/proto` outputs |
| **Revenue/GTM** | gtm-brief.md changes, launch planning updates                                  |

### Categorization Rules

```
IF file in prototypes/src/components/* THEN Design
IF file matches *.stories.tsx THEN Design
IF file is prd.md OR research.md THEN Product
IF file is design-brief.md OR prototype-notes.md THEN Design
IF file is gtm-brief.md THEN Revenue
IF file is engineering-spec.md THEN Engineering
IF PR merged in elephant-ai THEN Engineering
IF Linear issue completed THEN Engineering
```

## Report Generation Procedure

### Step 1: Collect Raw Activity

For the specified time range (today, this week):

1. **GitHub elephant-ai**: Fetch merged PRs, opened PRs
2. **GitHub pm-workspace**: Run git log for docs and prototypes
3. **Linear**: Search issues updated in range, get cycle progress
4. **Local**: Check recent status reports, \_meta.json changes

### Step 2: Map to Initiatives

For each activity item:

1. Extract ASK-XXXX if present → resolve to initiative
2. If no ASK, check file path → map to initiative
3. If no match → mark as "Unlinked"

### Step 3: Load Initiative Context

For each initiative with activity:

1. Load `_meta.json` for phase, status, priority
2. Load artifact existence (which docs exist)
3. Load `dev_activity` if present (Linear/GitHub stats)

### Step 4: Generate Per-Initiative Summary

For each initiative with activity:

```markdown
### [initiative-name]

**Phase:** [phase] | **Status:** [status] | **Priority:** [priority]

**What Got Done:**

- [Activity 1 with author and timestamp]
- [Activity 2 with author and timestamp]

**What Needs to Continue:**

- [Open issue or incomplete work]
- [Blocked item with reason]

**Stakeholder Involvement:**
[Narrative recommendation based on phase and gaps]
```

### Step 5: Generate Stakeholder Narratives

Use phase + artifact state + activity to generate contextual recommendations:

#### Narrative Templates by Situation

**Phase: discovery, No research.md:**

```
Product should gather user evidence through customer interviews or
signal analysis before defining requirements.
```

**Phase: define, No design-brief:**

```
Design should create the design brief based on the PRD so engineering
can begin implementation planning.
```

**Phase: define, All docs present:**

```
Ready for engineering handoff. Product should schedule kickoff with
engineering to review requirements and design before build begins.
```

**Phase: build, Active engineering but stale docs (>7 days):**

```
Engineering is actively building, but docs are [X] days stale. Product
should sync documentation with implementation progress to avoid drift.
```

**Phase: build, Prototype missing:**

```
Product/Design should create prototype documentation so validation
criteria are clear before jury evaluation.
```

**Phase: validate, Jury pass < 70%:**

```
Design should address jury feedback, focusing on [top concerns]. Once
addressed, Product should re-run validation with the same persona mix.
```

**Phase: validate, Jury passed but no GTM:**

```
Revenue/GTM team should prepare go-to-market brief before launch.
Product should coordinate launch timing with marketing.
```

**Phase: validate, Ready for launch:**

```
All validation criteria met. Engineering should prepare production
deployment. Product should coordinate with Customer Success for
rollout communication.
```

**Blocked issues detected:**

```
Engineering is blocked on [blocker]. [Owner] should unblock by
[suggested action] before work can continue.
```

### Step 6: Generate Focus Recommendations

Prioritize tomorrow's/next week's focus based on:

1. P0 initiatives with recent activity
2. Blocked items that can be unblocked
3. Initiatives ready to advance phases
4. Stale initiatives needing attention

## Output Formats

### End-of-Day Report (Markdown)

```markdown
# End of Day Report: [Full Date]

**Time Range:** 00:00 - 23:59 [Timezone]
**Your Activity:** X commits, Y doc updates, Z prototype iterations

---

## Summary

| Source          | Activity                             |
| --------------- | ------------------------------------ |
| elephant-ai PRs | X merged, Y opened                   |
| pm-workspace    | X docs updated, Y prototype versions |
| Linear          | X issues progressed, Y completed     |
| Slack Revenue   | X deals, Y sets, Z expansions        |

---

## 🎯 Revenue Team Wins

### Deals Closed 🎉

- **[Deal Name]** - Closed by [Rep Name]

### SDR Activity 📞

- **[SDR Name]**: X sets/demos booked

### Partner Wins 🤝

- **[Partner Name]** - Signed by [Rep]

### Expansion Revenue 📈

- **[Account]**: [Expansion] by [CSM]

### Churn Saves 🛡️

- **[Account]**: Saved by [CSM]

### Customer Highlights 💬

> "[Quote]" - [Customer]

---

## By Initiative

### [initiative-name]

**Phase:** [phase] | **Status:** [status]

**What Got Done:**

- [Activity item]

**What Needs to Continue:**

- [Open work]

**Stakeholder Involvement:**
[Narrative]

---

## Unlinked Activity

Work without clear initiative mapping:

- [Unlinked item 1]
- [Unlinked item 2]

---

## Tomorrow's Focus

Based on today's activity and blockers:

1. **[initiative]**: [action]
2. **[initiative]**: [action]
3. **[initiative]**: [action]
```

### End-of-Week Report (Markdown)

Includes all daily sections plus:

```markdown
## Week Summary

| Metric              | This Week | Last Week | Trend |
| ------------------- | --------- | --------- | ----- |
| PRs Merged          | X         | Y         | ↑/↓/→ |
| Issues Completed    | X         | Y         | ↑/↓/→ |
| Initiatives Touched | X         | Y         | ↑/↓/→ |
| Phase Advances      | X         | Y         | ↑/↓/→ |
| Deals Closed        | X         | Y         | ↑/↓/→ |
| SDR Sets            | X         | Y         | ↑/↓/→ |

---

## 🎯 Revenue Team Wins (Week)

### Deals Closed This Week 🎉

| Deal        | Rep   | Day |
| ----------- | ----- | --- |
| [Deal Name] | [Rep] | Mon |
| [Deal Name] | [Rep] | Wed |

**Total New Customers:** X

### SDR Leaderboard 📞

| SDR    | Sets | Trend |
| ------ | ---- | ----- |
| [Name] | X    | ↑/↓   |
| [Name] | X    | ↑/↓   |

**Total Sets This Week:** X

### Partner Activity 🤝

- **New Partners:** X signed
- **Active Onboarding:** X in progress

### Expansion & Retention 📈

- **Expansion Revenue:** $XXk added
- **Churn Saves:** X accounts saved

### Customer Highlights 💬

> "[Best quote of the week]" - [Customer]

---

## Phase Transitions This Week

| Initiative | From   | To    | Date |
| ---------- | ------ | ----- | ---- |
| [name]     | define | build | Mon  |

---

## Velocity by Initiative

| Initiative | Issues Started | Issues Completed | PRs Merged |
| ---------- | -------------- | ---------------- | ---------- |
| [name]     | X              | Y                | Z          |

---

## Next Week's Focus

Priority actions for the coming week:

1. [Action 1]
2. [Action 2]
```

### JSON Output

```json
{
  "generated_at": "ISO8601",
  "report_type": "eod|eow",
  "time_range": {
    "start": "ISO8601",
    "end": "ISO8601"
  },
  "summary": {
    "elephant_ai_prs_merged": 0,
    "elephant_ai_prs_opened": 0,
    "pm_workspace_docs_updated": 0,
    "pm_workspace_prototype_versions": 0,
    "linear_issues_progressed": 0,
    "linear_issues_completed": 0
  },
  "by_initiative": [
    {
      "id": "initiative-slug",
      "phase": "build",
      "status": "on_track",
      "priority": "P0",
      "activity": {
        "engineering": [],
        "product": [],
        "design": [],
        "revenue": []
      },
      "what_got_done": [],
      "what_needs_continue": [],
      "stakeholder_narrative": "..."
    }
  ],
  "unlinked_activity": [],
  "focus_recommendations": [],
  "velocity": {
    "prs_merged": 0,
    "issues_completed": 0,
    "initiatives_touched": 0
  }
}
```

## File Locations

### Save Reports

| Report Type | Location                                                   |
| ----------- | ---------------------------------------------------------- |
| End of Day  | `pm-workspace-docs/status/activity/eod-YYYY-MM-DD.md`      |
| End of Week | `pm-workspace-docs/status/activity/eow-YYYY-WXX.md`        |
| JSON data   | `pm-workspace-docs/status/activity/[type]-YYYY-MM-DD.json` |
| History     | `pm-workspace-docs/status/activity/activity-history.json`  |

### Activity History Schema

```json
{
  "$schema": "pm-workspace-activity-history-v1",
  "description": "Historical activity snapshots for trend tracking",
  "daily": [
    {
      "date": "2026-01-23",
      "prs_merged": 8,
      "prs_opened": 3,
      "issues_completed": 4,
      "issues_progressed": 12,
      "initiatives_touched": 5,
      "docs_updated": 5,
      "prototype_versions": 2
    }
  ],
  "weekly": [
    {
      "week": "2026-W04",
      "start_date": "2026-01-20",
      "end_date": "2026-01-26",
      "totals": {
        "prs_merged": 35,
        "issues_completed": 20,
        "phase_advances": 2
      }
    }
  ]
}
```

## Command Options

### /eod Options

| Option                | Description                           |
| --------------------- | ------------------------------------- |
| (none)                | Full end-of-day report                |
| `--initiative [name]` | Focus on specific initiative only     |
| `--json`              | Output JSON format only               |
| `--no-save`           | Display but don't save to file        |
| `--since HH:MM`       | Custom start time (default: midnight) |

### /eow Options

| Option         | Description                                    |
| -------------- | ---------------------------------------------- |
| (none)         | Full end-of-week report                        |
| `--compare`    | Include last week comparison                   |
| `--team [key]` | Focus on specific Linear team (ASK, VAN, etc.) |
| `--json`       | Output JSON format only                        |
| `--no-save`    | Display but don't save to file                 |

## Integration Points

### With slack-sync (NEW)

The `slack-sync` skill handles all Slack MCP tool interactions:

- Use it to fetch revenue channel activity
- Use it to map Slack user IDs to real names
- Reference `pm-workspace-docs/company-context/org-chart.md` for team structure

### With sync-dev

After `/sync-dev` completes, suggest running `/eod` for activity summary.

### With portfolio-status

`/status-all` can reference latest activity report for velocity context.

### With initiative-status

`/status [name]` can include recent activity from activity history.

### With org-chart.md (NEW)

Load `pm-workspace-docs/company-context/org-chart.md` to:

- Map Slack user IDs to real names
- Understand reporting structure
- Identify department ownership

### With Slack Routing Guide

Reference `pm-workspace-docs/audits/slack-communication-routing-guide.md` for:

- Channel purposes and routing decisions
- Understanding where signals come from
- Knowing which channels to check for which signals

### With slack-block-kit Skill (NEW)

When sending reports to Slack (e.g., `/eod --rob` to Robert Henderson), use the **slack-block-kit** skill for formatting:

1. **Read the skill** at `.cursor/skills/slack-block-kit/SKILL.md`
2. **Select appropriate template**:
   - `--rob` mode → Use "Rob Report" template (table block for SDR metrics)
   - `--digest` mode → Use "Daily Digest" or "Newsletter" template
   - Regular reports → Use "Daily Digest" template
3. **Apply formatting rules**:
   - Use `blocks` parameter (not `markdown_text`) for rich layouts
   - Include fallback `text` field at message root
   - Only 1 table block per message (place at END of blocks)
   - Use `context` blocks for metadata/timestamps
   - Use `header` blocks for section titles

**Template Selection by Mode:**

| Mode       | Template     | Key Blocks Used                     |
| ---------- | ------------ | ----------------------------------- |
| `--rob`    | Rob Report   | header, section, divider, **table** |
| `--digest` | Daily Digest | header, context, section, fields    |
| Regular    | Daily Digest | header, context, section, fields    |
| Newsletter | Newsletter   | header, context, divider, accessory |

### Future: Slack Auto-Post

Auto-post EOD summary to Slack channel at configurable time.

## Error Handling

### GitHub CLI Not Available

```
⚠️ GitHub CLI (gh) not found or not authenticated.

Install with: brew install gh
Authenticate: gh auth login

Proceeding with pm-workspace and Linear data only.
```

### No Activity Found

```
ℹ️ No activity found for the specified time range.

Try:
- Expanding the time range: /eod --since 08:00
- Running /sync-dev to refresh data sources
```

### Linear Not Available

```
⚠️ Linear MCP tools not available.

Proceeding with GitHub data only. Linear issue tracking skipped.
```

## Execution Checklist

When generating a report:

- [ ] Determine time range (today vs this week)
- [ ] **Fetch HubSpot activity (PRIMARY - use hubspot-activity subagent):**
  - [ ] Invoke hubspot-activity subagent with time range
  - [ ] Receive deals closed, deals lost, meetings booked
  - [ ] Store metrics: total ARR, deal count, win rate
  - [ ] Map owner IDs to rep names
- [ ] **Fetch SDR Meeting Activity (from HubSpot):**
  - [ ] Query meetings created today: `HUBSPOT_SEARCH_CRM_OBJECTS_BY_CRITERIA` with `objectType: meetings`, `hs_createdate >= today`
  - [ ] Filter by SDR owner IDs: Adia Barkley (70146239), Carter Thomas (85047772), Jamis Benson (81467875), Michael Haimowitz (82187301)
  - [ ] Count meetings set per SDR
  - [ ] Also track AE/Partner meetings for context (Reuben, Michael Cook, Pete, Tanner, James)
- [ ] **Fetch Slack activity (SUPPLEMENT - use slack-sync skill):**
  - [ ] Fetch #sales-closed-won for deals closed
  - [ ] Search #team-sales for SDR sets
  - [ ] **Fetch #sdr-stats (C0A05H709SM) for SDR daily metrics**
  - [ ] Fetch #expansion-opportunities for expansions
  - [ ] Search #churn-alert for saves
  - [ ] Fetch #team-partners for partner wins
  - [ ] Fetch #customer-quotes for notable quotes
  - [ ] Fetch #product-updates for release announcements
- [ ] Fetch GitHub elephant-ai PRs (merged + opened)
- [ ] Run git log for pm-workspace changes
- [ ] Query Linear for issue updates (if available)
- [ ] Map all activity to initiatives
- [ ] Load initiative context (\_meta.json, artifacts)
- [ ] **Check Feature Availability (from PostHog):**
  - [ ] For each new feature shipped, identify related feature flag
  - [ ] Query PostHog: `POSTHOG_LIST_AND_MANAGE_PROJECT_FEATURE_FLAGS` with project_id `81505`
  - [ ] Check flag status: active, rollout_percentage, internal restrictions
  - [ ] Classify: ✅ GA (100% rollout), ⚠️ Partial, ❌ Internal Only
  - [ ] Add availability table to NEW FEATURES section in digest
- [ ] **Map Slack user IDs to real names (from org-chart.md)**
- [ ] Categorize activity (engineering/product/design/revenue)
- [ ] **Generate Revenue Team Wins section (merge HubSpot + Slack):**
  - [ ] Use HubSpot for authoritative deal values and counts
  - [ ] Use Slack for celebration context and quotes
  - [ ] Mark deals appearing in both as "verified"
  - [ ] Include metrics: Total ARR, Deals, Win Rate
- [ ] Generate stakeholder narratives
- [ ] Compile focus recommendations
- [ ] Save report to status/activity/
- [ ] Update activity-history.json
- [ ] **Run post-generation validation (see below)**
- [ ] Display summary to user

---

## Post-Generation Validation

**CRITICAL**: After generating any report or digest, run these validation checks before presenting to the user. Fix any issues found.

### 1. Day-of-Week Validation

Verify the day of week matches the actual date. This is a common error source.

**Check**: For any date mentioned with a day name (e.g., "Thursday, January 23, 2026"):

1. Parse the date (YYYY-MM-DD)
2. Calculate the actual day of week
3. Verify it matches what's written

**Day Calculation Reference** (for manual verification):

```
Use: date -d "YYYY-MM-DD" +%A  (Linux)
Or:  date -j -f "%Y-%m-%d" "YYYY-MM-DD" +%A  (macOS)
Or:  Calculate using Zeller's congruence or similar
```

**Common 2026 Reference Points:**

- January 1, 2026 = Thursday
- January 5, 2026 = Monday (first Monday)
- So: Jan 23, 2026 = Friday (not Thursday!)

**Fix**: If day-of-week is wrong, correct it in all occurrences (header AND footer).

### 2. Stats Consistency

Verify the "Stats" section counts match actual items listed.

**Check**:

- Count bullet points under "NEW FEATURES" → should match `New Features: X`
- Count bullet points under "IMPROVEMENTS" → should match `Improvements: X`
- Count bullet points under "BUGS FIXED" → should match `Bugs Fixed: X`

**Fix**: Update stats to match actual counts, or add missing items.

### 3. Team Member Names

Verify names match the known team list (not GitHub handles).

**Valid Names:**
Matt Noxon, Jason, Eduardo, Palmer, Kaden, Dylan, Bryan, Adam, Skylar

**Check**:

- No GitHub handles (e.g., `@mnoxon` should be `Matt Noxon`)
- No unknown names that aren't on the team
- Names are consistent throughout (not "Matt" in one place and "Matt Noxon" in another)

**Fix**: Replace handles with real names, standardize name format.

### 4. Week Number Validation (Weekly Reports)

Verify ISO week numbers are correct.

**Check**: For `digest-YYYY-WXX.md` files:

- Week 1 starts on the Monday of the week containing January 4th
- Week numbers run 01-52 (or 53 in some years)

**2026 Week Reference:**

- W01: Dec 29, 2025 - Jan 4, 2026
- W04: Jan 19 - Jan 25, 2026
- W05: Jan 26 - Feb 1, 2026

**Fix**: Correct week number in filename and any references.

### 5. Date Range Consistency

Verify dates mentioned are internally consistent.

**Check**:

- Report date matches filename (eod-2026-01-23.md should be about Jan 23)
- "What's Coming Next" items are future-dated
- No references to dates outside the report's time range

### 6. Product & Integration Categorization

Verify products are categorized correctly (see Integration & Product Taxonomy above).

**Common Errors to Check:**

| Product     | ❌ Wrong Category | ✅ Correct Category   |
| ----------- | ----------------- | --------------------- |
| Dialpad     | CRM Integrations  | Telephony & Dialers   |
| Aircall     | CRM Integrations  | Telephony & Dialers   |
| Zoom        | CRM Integrations  | Video Conferencing    |
| Google Meet | CRM Integrations  | Video Conferencing    |
| Calendly    | CRM Integrations  | Calendar & Scheduling |

**Check**:

- Scan each category header (e.g., "CRM Integrations")
- Verify each item listed actually belongs to that category
- Cross-reference against the Integration & Product Taxonomy

**Fix**: Move items to correct category or rename the category header.

**Example Fix:**

```markdown
# Before (WRONG)

**CRM Integrations**

- Dialpad direct integration
- HubSpot workflow testing

# After (CORRECT)

**CRM Integrations**

- HubSpot workflow testing

**Telephony & Dialers**

- Dialpad direct integration
```

### 7. Section Completeness

Verify all required sections are present.

**Daily Digest Required Sections:**

- [ ] Headline
- [ ] New Features OR Improvements OR Bugs Fixed (at least one)
- [ ] Team Focus
- [ ] What's Coming Next
- [ ] Stats

**Weekly Digest Required Sections:**

- [ ] Week's Headline
- [ ] New Features (grouped)
- [ ] Improvements
- [ ] Bugs Fixed
- [ ] Team Contributions
- [ ] What's Coming Next
- [ ] Week Stats

### Validation Output

After validation, report findings:

```
✅ Validation passed - no issues found

OR

⚠️ Validation found issues:
- Day-of-week: "Thursday" should be "Friday" for Jan 23, 2026
- Stats mismatch: Listed 6 features but stats say 5
- [Auto-fixed: Updated day-of-week in 2 locations]
```

### Validation Checklist (Quick Reference)

Run after every report generation:

- [ ] Day-of-week matches actual date
- [ ] Stats counts match listed items
- [ ] Team names are valid (no handles)
- [ ] Week numbers are correct (if weekly)
- [ ] Dates are internally consistent
- [ ] **Products categorized correctly** (Dialpad ≠ CRM!)
- [ ] All required sections present
