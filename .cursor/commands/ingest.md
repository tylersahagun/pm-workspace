# Signal Ingest Command

Capture and process signals from various sources into the PM workspace.

## Usage

```
/ingest transcript
/ingest ticket
/ingest issue [linear-id]
/ingest conversation
```

Then paste or reference the content to process.

## Behavior

**Delegates to**: `signals-processor` subagent

The subagent will:

1. Load company context (product-vision, personas)
2. Load existing signals index
3. Extract structured information (TL;DR, decisions, action items, problems, quotes)
4. Save to appropriate signals folder
5. Update `signals/_index.json`
6. Match to existing hypotheses
7. Suggest hypothesis creation for new patterns

## Signal Types

| Type               | Command                | Save Location            |
| ------------------ | ---------------------- | ------------------------ |
| Meeting transcript | `/ingest transcript`   | `signals/transcripts/`   |
| Support ticket     | `/ingest ticket`       | `signals/tickets/`       |
| Linear issue       | `/ingest issue [id]`   | `signals/issues/`        |
| Slack/email thread | `/ingest conversation` | `signals/conversations/` |

## Output

Each signal is saved with:

- TL;DR summary
- Key decisions
- Action items (who, what, when)
- Problems with verbatim quotes
- Feature requests
- Personas mentioned
- Strategic alignment assessment
- Hypothesis matches

## Next Steps

After ingesting:

- Add evidence to existing hypothesis: `/hypothesis show [name]`
- Create new hypothesis: `/hypothesis new [name]`
- Find patterns across signals: `/synthesize`
