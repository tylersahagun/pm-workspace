# Condorcet Jury System

**Synthetic user validation for product decisions using LLM-powered personas**

[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What is this?

The Condorcet Jury System uses 1,000+ synthetic user personas to validate product decisions at every phase of development. Based on [Condorcet's Jury Theorem](https://en.wikipedia.org/wiki/Condorcet%27s_jury_theorem): if individual voters have >50% accuracy, the majority verdict approaches certainty as group size increases.

**Use cases:**
- Validate research findings resonate with target users
- Test PRD user stories and flows match mental models
- Evaluate prototypes for usability before real user testing
- Identify skeptic/edge-case concerns before launch

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/condorcet-jury-system.git
cd condorcet-jury-system
pip install -r requirements.txt
```

### 2. Run your first evaluation (no API key needed)

```bash
python scripts/simulate_jury.py \
  --content "Your product idea or feature description here" \
  --jury-size 100
```

### 3. View results

Results are saved to `outputs/` with a verdict, breakdown by persona segment, and actionable recommendations.

## How It Works

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│ Your Product    │────▶│ 1000 Synthetic  │────▶│ Aggregated      │
│ Description     │     │ User Personas   │     │ Verdict         │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │
                    ┌──────────┼──────────┐
                    ▼          ▼          ▼
              ┌─────────┐ ┌─────────┐ ┌─────────┐
              │ Skeptic │ │ Early   │ │ Power   │
              │ 35%     │ │ Adopter │ │ User    │
              │         │ │ 20%     │ │ 24%     │
              └─────────┘ └─────────┘ └─────────┘
```

### Persona Distribution

| Archetype | % | Description |
|-----------|---|-------------|
| Sales Rep | 35% | Front-line users, time-pressed, quota-focused |
| Sales Leader | 25% | Strategic, team-focused, metrics-driven |
| CSM | 15% | Relationship-focused, customer advocates |
| Operations | 15% | Process-oriented, efficiency-focused |
| Strategic Consultant | 10% | Analytical, ROI-focused, skeptical |

### AI Adoption Stages (Critical for realistic feedback)

| Stage | % | Typical Approval Rate |
|-------|---|----------------------|
| Skeptic | 35% | ~25% (hardest to convince) |
| Curious | 21% | ~55% |
| Early-Adopter | 20% | ~75% |
| Power-User | 24% | ~85% |

## Commands

### Simulation Mode (Free, No API)

```bash
# Basic evaluation
python scripts/simulate_jury.py --content "Your feature idea"

# With initiative folder structure
python scripts/simulate_jury.py \
  --initiative path/to/initiative \
  --phase research \
  --jury-size 100

# Phases: research, prd, prototype
```

### API Mode (Requires Anthropic API Key)

```bash
export ANTHROPIC_API_KEY=your_key_here

python scripts/jury_evaluator.py \
  --initiative path/to/initiative \
  --phase research \
  --jury-size 100 \
  --skeptics 0.20
```

**Cost estimates:**
- 100 evaluations with Haiku: ~$0.50
- Synthesis with Sonnet: ~$0.10
- Full evaluation: ~$1-2 per initiative

### Generate Iteration Documents

After receiving jury feedback:

```bash
python scripts/iterate_from_feedback.py \
  --initiative path/to/initiative

# Generates:
# - research-gaps.md (interview questions for failing segments)
# - prd-amendments.md (requirements to add)
# - prototype-spec.md (UI components to build)
```

## Understanding Results

### Verdict Thresholds

| Combined Pass Rate | Verdict | Recommended Action |
|-------------------|---------|-------------------|
| ≥80% | STRONG PASS | Ship with confidence |
| ≥60% | PASS | Address key concerns, proceed |
| ≥40% | CONDITIONAL | Iterate before proceeding |
| <40% | FAIL | Major pivot needed |

### Example Output

```
🏛️  CONDORCET JURY EVALUATION
==================================================
Initiative: hubspot-agent-config-ui
Phase: research
Jury Size: 1000
==================================================

📊 VERDICT SUMMARY
   ✅ Approve: 346 (34.6%)
   ⚠️  Conditional: 160 (16.0%)
   ❌ Reject: 494 (49.4%)

🏆 OVERALL: FAIL (50.6% combined)

📈 BY ADOPTION STAGE
   Skeptic: 18.2% pass (critical gap!)
   Curious: 52.9% pass
   Early-Adopter: 66.2% pass
   Power-User: 83.1% pass

🔥 TOP FRICTION POINTS
   1. Rollback if something breaks (282 mentions)
   2. Integration with existing tools (274 mentions)
   3. Compliance/security concerns (250 mentions)
```

## Customizing Personas

### Edit Archetypes

Modify personas in `personas/archetypes/`:

```json
{
  "archetype": "sales-rep",
  "name": "Alex Chen",
  "bio": "Mid-level AE at a 200-person SaaS company...",
  "ai_adoption_stage": "curious",
  "painPoints": ["Tool fatigue", "Data entry time"],
  "voiceQuotes": ["I just want it to work without thinking"]
}
```

### Generate More Personas

```bash
python scripts/expand_personas.py \
  --count 1000 \
  --output personas/generated/
```

### Adjust Distribution

Edit `personas/generation-config.json`:

```json
{
  "archetypes": {
    "sales-rep": { "count": 350 },
    "sales-leader": { "count": 250 }
  },
  "attribute_distribution": {
    "ai_adoption_stage": {
      "skeptic": 0.35,
      "curious": 0.21,
      "early-adopter": 0.20,
      "power-user": 0.24
    }
  }
}
```

## Project Structure

```
condorcet-jury-system/
├── README.md
├── requirements.txt
├── setup.py
├── scripts/
│   ├── simulate_jury.py       # Local simulation (no API)
│   ├── jury_evaluator.py      # Full API evaluation
│   ├── expand_personas.py     # Generate more personas
│   ├── iterate_from_feedback.py # Generate iteration docs
│   └── generate_personas.py   # API-based persona generation
├── personas/
│   ├── archetypes/            # Master persona templates
│   │   ├── sales-rep.json
│   │   ├── sales-leader.json
│   │   ├── csm.json
│   │   ├── operations.json
│   │   └── strategic-consultant.json
│   ├── generated/             # Expanded persona pools
│   ├── persona-schema.json    # JSON schema for validation
│   └── generation-config.json # Distribution config
├── outputs/                   # Evaluation results
└── examples/
    └── sample-initiative/     # Example initiative structure
```

## Integrating with Your Workflow

### Cursor/AI IDE Integration

Add to your workspace rules:

```markdown
## Jury Validation Commands

| Command | Action |
|---------|--------|
| `eval [initiative]` | Run jury evaluation |
| `iterate [initiative]` | Generate iteration docs from feedback |
```

### CI/CD Integration

```yaml
# .github/workflows/jury-validation.yml
name: Jury Validation
on:
  pull_request:
    paths:
      - 'docs/prd/**'
      - 'docs/research/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      - run: pip install -r requirements.txt
      - run: python scripts/simulate_jury.py --initiative . --phase prd
      - name: Check verdict
        run: |
          PASS_RATE=$(cat outputs/latest-eval.json | jq '.combined_pass_rate')
          if (( $(echo "$PASS_RATE < 60" | bc -l) )); then
            echo "::error::Jury validation failed ($PASS_RATE% pass rate)"
            exit 1
          fi
```

## Theoretical Foundation

[Condorcet's Jury Theorem](https://en.wikipedia.org/wiki/Condorcet%27s_jury_theorem) states:

> If each voter has probability p > 0.5 of being correct, then P(majority correct) → 1 as n → ∞

With n=100 jurors and p=0.65 individual accuracy:
- **P(majority correct) ≈ 99.9%**

This makes synthetic user validation highly reliable when:
1. Personas accurately represent target users
2. Evaluation prompts elicit authentic responses
3. Jury size is sufficiently large (n ≥ 50)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

- Based on research from [Condorcet's Jury Theorem applications to AI](https://arxiv.org/abs/2305.14325)
- Persona framework inspired by Jobs-to-be-Done methodology
- Built for product teams using AI-assisted development workflows

