#!/usr/bin/env python3
"""
Condorcet Jury System - Interactive Setup Wizard

Walks users through:
1. Technical setup (dependencies, API keys)
2. Business context interview
3. Custom persona generation for their specific market

Usage:
    python scripts/setup_wizard.py
"""

import json
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional


def get_project_root() -> Path:
    return Path(__file__).parent.parent


def print_header(text: str):
    print(f"\n{'='*60}")
    print(f"  {text}")
    print(f"{'='*60}\n")


def print_step(step: int, total: int, text: str):
    print(f"\n📍 Step {step}/{total}: {text}")
    print("-" * 40)


def ask(prompt: str, default: str = "", options: List[str] = None) -> str:
    """Ask a question with optional default and options."""
    if options:
        print(f"\n{prompt}")
        for i, opt in enumerate(options, 1):
            print(f"  {i}. {opt}")
        while True:
            choice = input(f"\nEnter choice (1-{len(options)}): ").strip()
            if choice.isdigit() and 1 <= int(choice) <= len(options):
                return options[int(choice) - 1]
            print("Invalid choice, try again.")
    else:
        if default:
            response = input(f"{prompt} [{default}]: ").strip()
            return response if response else default
        else:
            return input(f"{prompt}: ").strip()


def ask_yes_no(prompt: str, default: bool = True) -> bool:
    """Ask a yes/no question."""
    suffix = "[Y/n]" if default else "[y/N]"
    response = input(f"{prompt} {suffix}: ").strip().lower()
    if not response:
        return default
    return response in ("y", "yes", "true", "1")


def ask_multiline(prompt: str) -> str:
    """Ask for multiline input."""
    print(f"\n{prompt}")
    print("(Enter a blank line when done)")
    lines = []
    while True:
        line = input()
        if not line:
            break
        lines.append(line)
    return "\n".join(lines)


def ask_list(prompt: str, min_items: int = 1) -> List[str]:
    """Ask for a list of items."""
    print(f"\n{prompt}")
    print(f"(Enter at least {min_items} items, blank line when done)")
    items = []
    while True:
        item = input(f"  {len(items)+1}. ").strip()
        if not item:
            if len(items) >= min_items:
                break
            print(f"  Please enter at least {min_items} items.")
        else:
            items.append(item)
    return items


class SetupWizard:
    def __init__(self):
        self.root = get_project_root()
        self.config = {
            "created_at": datetime.now().isoformat(),
            "version": "1.0.0",
        }
    
    def run(self):
        """Run the full setup wizard."""
        print_header("🏛️  CONDORCET JURY SYSTEM - SETUP WIZARD")
        print("This wizard will help you set up synthetic user validation")
        print("customized for your specific business and users.\n")
        
        total_steps = 6
        
        # Step 1: Technical setup
        print_step(1, total_steps, "Technical Setup")
        self.technical_setup()
        
        # Step 2: Business context
        print_step(2, total_steps, "Business Context")
        self.collect_business_context()
        
        # Step 3: User personas
        print_step(3, total_steps, "Define Your Users")
        self.collect_user_personas()
        
        # Step 4: Pain points & jobs
        print_step(4, total_steps, "User Pain Points")
        self.collect_pain_points()
        
        # Step 5: AI/Tech adoption
        print_step(5, total_steps, "Technology Context")
        self.collect_tech_context()
        
        # Step 6: Generate configuration
        print_step(6, total_steps, "Generate Configuration")
        self.generate_config()
        
        print_header("✅ SETUP COMPLETE!")
        self.print_next_steps()
    
    def technical_setup(self):
        """Handle technical dependencies and API keys."""
        
        # Check Python version
        py_version = sys.version_info
        print(f"✓ Python version: {py_version.major}.{py_version.minor}.{py_version.micro}")
        
        if py_version < (3, 9):
            print("⚠️  Warning: Python 3.9+ recommended")
        
        # Install dependencies
        if ask_yes_no("Install Python dependencies?"):
            print("\n📦 Installing dependencies...")
            try:
                subprocess.run(
                    [sys.executable, "-m", "pip", "install", "-r", str(self.root / "requirements.txt")],
                    check=True,
                    capture_output=True
                )
                print("✓ Dependencies installed")
            except subprocess.CalledProcessError as e:
                print(f"⚠️  Failed to install dependencies: {e}")
                print("   Run manually: pip install -r requirements.txt")
        
        # API key setup (optional)
        print("\n📝 API Configuration (optional)")
        print("The jury system can run in simulation mode without API keys.")
        print("For production use with real LLM evaluations, you'll need an API key.")
        
        if ask_yes_no("Configure Anthropic API key now?", default=False):
            api_key = input("Enter your ANTHROPIC_API_KEY: ").strip()
            if api_key:
                env_file = self.root / ".env"
                with open(env_file, "w") as f:
                    f.write(f"ANTHROPIC_API_KEY={api_key}\n")
                print(f"✓ Saved to {env_file}")
                self.config["has_api_key"] = True
        else:
            self.config["has_api_key"] = False
            print("✓ Skipping API setup (simulation mode)")
    
    def collect_business_context(self):
        """Collect information about the user's business."""
        
        print("Tell me about your business so I can customize the personas.\n")
        
        # Company type
        self.config["company"] = {}
        
        self.config["company"]["name"] = ask("What's your company/product name?")
        
        self.config["company"]["type"] = ask(
            "What type of product are you building?",
            options=[
                "B2B SaaS",
                "B2C App",
                "Enterprise Software",
                "Developer Tools",
                "E-commerce/Marketplace",
                "FinTech",
                "HealthTech",
                "EdTech",
                "Other"
            ]
        )
        
        self.config["company"]["stage"] = ask(
            "What stage is your company?",
            options=[
                "Pre-seed / Idea stage",
                "Seed / Early product",
                "Series A / Growth",
                "Series B+ / Scale",
                "Established company"
            ]
        )
        
        self.config["company"]["team_size"] = ask(
            "How big is your team?",
            options=[
                "Just me",
                "2-5 people",
                "6-20 people",
                "21-100 people",
                "100+ people"
            ]
        )
        
        # Industry/vertical
        self.config["company"]["industry"] = ask(
            "What industry or vertical do you serve?",
            default="General/Multiple"
        )
        
        # Value proposition
        print("\n💡 Value Proposition")
        self.config["company"]["value_prop"] = ask(
            "In one sentence, what problem do you solve?",
            default="Help users save time and be more productive"
        )
        
        self.config["company"]["differentiator"] = ask(
            "What makes you different from alternatives?",
            default="Our unique approach to solving the problem"
        )
        
        print(f"\n✓ Got it! Building personas for {self.config['company']['name']}")
    
    def collect_user_personas(self):
        """Collect information about target users."""
        
        print("Now let's define your target users (personas).\n")
        
        self.config["personas"] = []
        
        # Collect 3-5 personas
        num_personas = int(ask(
            "How many distinct user types do you have?",
            options=["2", "3", "4", "5"]
        ))
        
        for i in range(num_personas):
            print(f"\n👤 Persona {i+1} of {num_personas}")
            print("-" * 30)
            
            persona = {}
            
            persona["title"] = ask("Job title or role (e.g., 'Sales Manager', 'Developer', 'Founder')")
            persona["archetype_id"] = persona["title"].lower().replace(" ", "-")
            
            persona["description"] = ask(
                f"Describe a typical {persona['title']} in 1-2 sentences",
                default=f"A {persona['title']} focused on achieving their goals"
            )
            
            persona["goals"] = ask_list(
                f"What are {persona['title']}'s main goals? (Enter 2-3)",
                min_items=2
            )
            
            persona["frustrations"] = ask_list(
                f"What frustrates {persona['title']} most? (Enter 2-3)",
                min_items=2
            )
            
            persona["tools_used"] = ask(
                f"What tools does {persona['title']} use daily?",
                default="Email, Slack, various software"
            )
            
            persona["weight"] = round(1.0 / num_personas, 2)  # Equal weight by default
            
            self.config["personas"].append(persona)
        
        print(f"\n✓ Defined {len(self.config['personas'])} personas")
    
    def collect_pain_points(self):
        """Collect common pain points and jobs-to-be-done."""
        
        print("Let's understand the problems you're solving.\n")
        
        self.config["problems"] = {}
        
        # Main pain points
        print("What are the TOP pain points your users have?")
        self.config["problems"]["pain_points"] = ask_list(
            "List the main pain points you address",
            min_items=3
        )
        
        # Jobs to be done
        print("\n🎯 Jobs to be Done")
        print("What 'jobs' do users 'hire' your product to do?")
        self.config["problems"]["jobs_to_be_done"] = ask_list(
            "List the jobs users need done (e.g., 'Save time on X', 'Get visibility into Y')",
            min_items=2
        )
        
        # Objections
        print("\n🚧 Common Objections")
        self.config["problems"]["common_objections"] = ask_list(
            "What objections do you hear from skeptical users?",
            min_items=2
        )
        
        # Competitors
        print("\n🏁 Competitive Context")
        self.config["problems"]["alternatives"] = ask_list(
            "What alternatives do users compare you to? (Include 'doing nothing')",
            min_items=2
        )
        
        print("\n✓ Captured problem context")
    
    def collect_tech_context(self):
        """Collect technology adoption context."""
        
        print("Understanding your users' relationship with technology.\n")
        
        self.config["tech_context"] = {}
        
        # AI involvement
        self.config["tech_context"]["uses_ai"] = ask_yes_no(
            "Does your product use AI/ML?",
            default=True
        )
        
        if self.config["tech_context"]["uses_ai"]:
            self.config["tech_context"]["ai_role"] = ask(
                "How does AI feature in your product?",
                options=[
                    "Core to the product (AI-first)",
                    "Significant feature (AI-enhanced)",
                    "Minor feature (AI-assisted)",
                    "Behind the scenes only"
                ]
            )
        
        # User tech savviness
        self.config["tech_context"]["user_tech_level"] = ask(
            "How tech-savvy are your typical users?",
            options=[
                "Non-technical (prefer simple tools)",
                "Somewhat technical (comfortable with software)",
                "Technical (developers, engineers)",
                "Mixed (varies widely)"
            ]
        )
        
        # Adoption challenges
        self.config["tech_context"]["adoption_challenges"] = ask_list(
            "What are the main barriers to adoption you've seen?",
            min_items=2
        )
        
        # AI skepticism estimate
        self.config["tech_context"]["estimated_skeptic_pct"] = ask(
            "What % of your users are skeptical of new tools/AI?",
            options=[
                "10-20% (mostly early adopters)",
                "20-35% (balanced mix)",
                "35-50% (significant skepticism)",
                "50%+ (very conservative users)"
            ]
        )
        
        print("\n✓ Captured tech context")
    
    def generate_config(self):
        """Generate configuration files based on collected info."""
        
        print("Generating your custom configuration...\n")
        
        # Save raw config
        config_dir = self.root / "config"
        config_dir.mkdir(exist_ok=True)
        
        with open(config_dir / "workspace-config.json", "w") as f:
            json.dump(self.config, f, indent=2)
        print(f"✓ Saved workspace config: config/workspace-config.json")
        
        # Generate custom archetypes
        self.generate_custom_archetypes()
        
        # Generate generation config
        self.generate_generation_config()
        
        # Generate initial personas
        self.generate_initial_personas()
        
        # Create sample initiative
        self.create_sample_initiative()
    
    def generate_custom_archetypes(self):
        """Generate archetype files from collected persona info."""
        
        archetypes_dir = self.root / "personas" / "archetypes-custom"
        archetypes_dir.mkdir(exist_ok=True)
        
        for persona in self.config["personas"]:
            archetype = {
                "archetype": persona["archetype_id"],
                "name": f"Sample {persona['title']}",
                "bio": persona["description"],
                "role": {
                    "title": persona["title"],
                    "level": "mid",
                },
                "firmographics": {
                    "company_size": "50-200",
                    "industry": self.config["company"]["industry"],
                },
                "psychographics": {
                    "ai_adoption_stage": "curious",
                    "trust_in_ai": 0.5,
                    "tool_fatigue": 0.4,
                    "patience_for_learning": 0.6,
                },
                "context": {
                    "tools_used": persona["tools_used"].split(", "),
                    "primary_pain": persona["frustrations"][0] if persona["frustrations"] else "General efficiency",
                },
                "goals": persona["goals"],
                "frustrations": persona["frustrations"],
                "voiceQuotes": [
                    f"As a {persona['title']}, I {persona['goals'][0].lower() if persona['goals'] else 'want to be more effective'}.",
                    f"The biggest challenge is {persona['frustrations'][0].lower() if persona['frustrations'] else 'finding the right tools'}.",
                ]
            }
            
            filepath = archetypes_dir / f"{persona['archetype_id']}.json"
            with open(filepath, "w") as f:
                json.dump(archetype, f, indent=2)
        
        print(f"✓ Generated {len(self.config['personas'])} custom archetypes")
    
    def generate_generation_config(self):
        """Generate persona generation configuration."""
        
        # Map skepticism estimate to percentage
        skeptic_map = {
            "10-20% (mostly early adopters)": 0.15,
            "20-35% (balanced mix)": 0.30,
            "35-50% (significant skepticism)": 0.45,
            "50%+ (very conservative users)": 0.55,
        }
        
        skeptic_pct = skeptic_map.get(
            self.config["tech_context"].get("estimated_skeptic_pct", ""),
            0.30
        )
        
        config = {
            "archetypes": {
                p["archetype_id"]: {
                    "count": int(100 * p["weight"]),
                    "seeds": 3
                }
                for p in self.config["personas"]
            },
            "attribute_distribution": {
                "ai_adoption_stage": {
                    "skeptic": round(skeptic_pct, 2),
                    "curious": round((1 - skeptic_pct) * 0.4, 2),
                    "early-adopter": round((1 - skeptic_pct) * 0.35, 2),
                    "power-user": round((1 - skeptic_pct) * 0.25, 2),
                }
            },
            "company_context": {
                "name": self.config["company"]["name"],
                "type": self.config["company"]["type"],
                "industry": self.config["company"]["industry"],
            }
        }
        
        with open(self.root / "config" / "generation-config.json", "w") as f:
            json.dump(config, f, indent=2)
        
        print(f"✓ Generated generation config (skeptic target: {skeptic_pct*100:.0f}%)")
    
    def generate_initial_personas(self):
        """Generate initial persona pool."""
        
        generated_dir = self.root / "personas" / "generated" / "custom"
        generated_dir.mkdir(parents=True, exist_ok=True)
        
        import random
        
        adoptions = ["skeptic", "curious", "early-adopter", "power-user"]
        skeptic_pct = 0.30  # Default
        
        personas = []
        for persona_config in self.config["personas"]:
            count = int(100 * persona_config["weight"])
            
            for i in range(count):
                # Weighted adoption stage
                adoption = random.choices(
                    adoptions,
                    weights=[skeptic_pct, 0.3, 0.25, 0.15]
                )[0]
                
                persona = {
                    "id": f"{persona_config['archetype_id']}-{i}",
                    "archetype_id": persona_config["archetype_id"],
                    "name": f"{persona_config['title']} #{i+1}",
                    "bio": persona_config["description"],
                    "psychographics": {
                        "ai_adoption_stage": adoption,
                        "trust_in_ai": random.uniform(0.3, 0.8),
                        "tool_fatigue": random.uniform(0.2, 0.7),
                        "patience_for_learning": random.uniform(0.3, 0.8),
                    },
                    "context": {
                        "goals": persona_config["goals"],
                        "frustrations": persona_config["frustrations"],
                    }
                }
                personas.append(persona)
        
        with open(generated_dir / "personas.json", "w") as f:
            json.dump(personas, f, indent=2)
        
        print(f"✓ Generated {len(personas)} initial personas")
    
    def create_sample_initiative(self):
        """Create a sample initiative based on collected info."""
        
        init_dir = self.root / "examples" / "my-first-initiative"
        init_dir.mkdir(parents=True, exist_ok=True)
        
        research_content = f"""# Research: {self.config['company']['name']} - Initial Validation

## Problem Statement

{self.config['company']['value_prop']}

## Target Users

"""
        for p in self.config["personas"]:
            research_content += f"""### {p['title']}

{p['description']}

**Goals:**
"""
            for g in p["goals"]:
                research_content += f"- {g}\n"
            
            research_content += f"""
**Frustrations:**
"""
            for f in p["frustrations"]:
                research_content += f"- {f}\n"
            
            research_content += "\n"
        
        research_content += f"""## User Problems Identified

| Problem | Severity | Evidence |
|---------|----------|----------|
"""
        for pp in self.config["problems"]["pain_points"]:
            research_content += f"| {pp} | High | User interviews |\n"
        
        research_content += f"""
## Competitive Context

Alternatives users consider:
"""
        for alt in self.config["problems"]["alternatives"]:
            research_content += f"- {alt}\n"
        
        research_content += f"""
## Our Differentiator

{self.config['company']['differentiator']}

## Common Objections

"""
        for obj in self.config["problems"]["common_objections"]:
            research_content += f"- {obj}\n"
        
        with open(init_dir / "research.md", "w") as f:
            f.write(research_content)
        
        print(f"✓ Created sample initiative: examples/my-first-initiative/")
    
    def print_next_steps(self):
        """Print next steps for the user."""
        
        print(f"""
Your Condorcet Jury System is now configured for {self.config['company']['name']}!

📁 Generated files:
   config/workspace-config.json     - Your full configuration
   config/generation-config.json    - Persona generation settings
   personas/archetypes-custom/      - Your custom persona templates
   personas/generated/custom/       - Initial persona pool
   examples/my-first-initiative/    - Ready-to-test initiative

🚀 Quick Start:

   1. Run your first evaluation:
      python scripts/simulate_jury.py \\
        --initiative examples/my-first-initiative \\
        --jury-size 50

   2. View the report:
      cat examples/my-first-initiative/jury-evaluations/latest-report.md

   3. Create a new initiative:
      mkdir -p initiatives/my-feature
      # Add research.md with your feature/idea description
      python scripts/simulate_jury.py --initiative initiatives/my-feature

📚 Documentation: README.md

💡 Tips:
   - Run with --jury-size 100+ for more reliable results
   - Check skeptic pass rate - if <25%, you have fundamental issues
   - Use iterate_from_feedback.py to get actionable next steps
""")


def main():
    wizard = SetupWizard()
    wizard.run()


if __name__ == "__main__":
    main()

