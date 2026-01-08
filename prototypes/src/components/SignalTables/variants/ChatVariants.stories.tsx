import type { Meta, StoryObj } from '@storybook/react';
import { ChatFirstTables } from './ChatFirstTables';
import { ChatCentralTables } from './ChatCentralTables';
import { ChatCompanionTables } from './ChatCompanionTables';

/**
 * ## AI Chat Emphasis Variants
 * 
 * Three different approaches to AI chat as the primary interface,
 * inspired by Woody's feedback about Cursor's planning agent:
 * 
 * > "When I use the Cursor plan agent and it shows me a flowchart, 
 * > then I review the plan... I have to understand it."
 * 
 * ### The Spectrum:
 * 
 * | Variant | Chat Role | Table/Builder Role | Inspiration |
 * |---------|-----------|-------------------|-------------|
 * | **Chat-First** | Primary controller | Artifacts/output | Claude Artifacts, Cursor Agent |
 * | **Chat-Central** | Equal partner | Live preview | Cursor Chat + Editor |
 * | **Chat-Companion** | Floating helper | Primary interface | GitHub Copilot, VS Code |
 * 
 * ### Key Design Question:
 * Where does trust come from?
 * - **Chat-First**: Trust the AI, inspect when curious
 * - **Chat-Central**: AI builds, you watch and verify
 * - **Chat-Companion**: You build, AI assists when asked
 */

// =========================================
// VARIANT A: Chat-First (Maximum AI Emphasis)
// =========================================
const ChatFirstMeta: Meta<typeof ChatFirstTables> = {
  title: 'Signal Tables/Chat Variants/A. Chat-First',
  component: ChatFirstTables,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Chat-First Tables

**AI Emphasis Level: Maximum (100%)**

Chat is the **primary and almost exclusive** interface. The table and configuration 
appear as "artifacts" that the AI produces, similar to Claude's artifacts or 
Cursor's agent mode.

### Key Characteristics:
- Full-screen conversational interface
- Table appears inline in chat as an "artifact"
- Configuration panel hidden by default (trust the AI)
- Users describe intent; AI handles execution

### When This Works Best:
- Users who trust AI outputs
- Exploratory analysis ("just show me something interesting")
- Mobile-first or voice-first scenarios
- New users who don't know what to build

### Potential Risks:
- Less control for power users
- Harder to make precise adjustments
- May feel "magic" rather than trustworthy
        `,
      },
    },
  },
};

export default ChatFirstMeta;
type ChatFirstStory = StoryObj<typeof ChatFirstTables>;

/**
 * Full chat-first experience. Try:
 * 1. "Show me competitor mentions"
 * 2. Click "Run Analysis" when the table config appears
 * 3. Results appear inline as an artifact
 */
export const Default: ChatFirstStory = {
  render: () => <ChatFirstTables />,
};

// =========================================
// VARIANT B: Chat-Central (Balanced)
// =========================================
const ChatCentralMeta: Meta<typeof ChatCentralTables> = {
  title: 'Signal Tables/Chat Variants/B. Chat-Central',
  component: ChatCentralTables,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Chat-Central Tables

**AI Emphasis Level: High (70%)**

Chat takes the prominent left position, but table and builder are **always visible**
and update in real-time as the AI works. Inspired by Cursor's chat + editor 
side-by-side experience.

### Key Characteristics:
- Three-panel layout: Chat | Table | Builder
- AI actions immediately reflected in builder panel
- "Show your work" approach builds trust
- Run button in table area gives user control

### When This Works Best:
- Users who want to understand what AI is doing
- Collaborative workflows (show others the config)
- Iterative refinement (chat adds, user tweaks)
- Training/onboarding scenarios

### The Woody Insight:
> "When I use the Cursor plan agent and it shows me a flowchart, 
> then I review the plan... I have to understand it."

This variant embodies that—AI proposes, human reviews in real-time.
        `,
      },
    },
  },
};

export const ChatCentral: StoryObj<typeof ChatCentralTables> = {
  render: () => <ChatCentralTables />,
  parameters: {
    ...ChatCentralMeta.parameters,
  },
};

// =========================================
// VARIANT C: Chat-Companion (Minimal AI)
// =========================================
const ChatCompanionMeta: Meta<typeof ChatCompanionTables> = {
  title: 'Signal Tables/Chat Variants/C. Chat-Companion',
  component: ChatCompanionTables,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
## Chat-Companion Tables

**AI Emphasis Level: Low (30%)**

Traditional table builder as the **primary interface**. Chat is a floating 
companion that provides assistance when requested, similar to GitHub Copilot's
inline suggestions or VS Code's chat panel.

### Key Characteristics:
- Familiar table + filter + manual column builder
- Floating, minimizable chat widget
- AI suggests but doesn't drive
- Power users can ignore chat entirely

### When This Works Best:
- Power users who know what they want
- Users skeptical of AI
- Complex configurations needing precision
- Migrations from existing tools (familiarity)

### Trade-offs:
- ✅ Maximum user control
- ✅ Familiar mental model
- ❌ Doesn't leverage AI's potential
- ❌ Higher learning curve for new users
        `,
      },
    },
  },
};

export const ChatCompanion: StoryObj<typeof ChatCompanionTables> = {
  render: () => <ChatCompanionTables />,
  parameters: {
    ...ChatCompanionMeta.parameters,
  },
};

// =========================================
// COMPARISON VIEW
// =========================================

/**
 * Side-by-side comparison of all three variants.
 * Use this to discuss tradeoffs with the team.
 */
export const Comparison: StoryObj = {
  render: () => (
    <div className="h-screen flex flex-col bg-slate-900 text-white">
      <div className="p-6 bg-slate-800 border-b border-slate-700">
        <h1 className="text-2xl font-bold mb-2">AI Chat Emphasis: Design Exploration</h1>
        <p className="text-slate-400 max-w-3xl">
          Three variants exploring different levels of AI chat as the primary controller.
          Based on Woody's insight about Cursor's planning agent—showing AI's work builds trust.
        </p>
      </div>
      
      <div className="flex-1 grid grid-cols-3 gap-px bg-slate-700">
        <div className="bg-slate-800 p-4 overflow-hidden flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-violet-400">A. Chat-First</h2>
            <p className="text-sm text-slate-400">AI: 100% • You: Describe intent</p>
            <div className="mt-2 flex gap-1">
              <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded">Claude Artifacts</span>
              <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded">Cursor Agent</span>
            </div>
          </div>
          <div className="flex-1 rounded-lg overflow-hidden border border-slate-600 bg-white">
            <ChatFirstTables />
          </div>
        </div>
        
        <div className="bg-slate-800 p-4 overflow-hidden flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-emerald-400">B. Chat-Central</h2>
            <p className="text-sm text-slate-400">AI: 70% • You: Watch & verify</p>
            <div className="mt-2 flex gap-1">
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs rounded">Cursor Chat</span>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs rounded">Recommended</span>
            </div>
          </div>
          <div className="flex-1 rounded-lg overflow-hidden border border-slate-600 bg-white">
            <ChatCentralTables />
          </div>
        </div>
        
        <div className="bg-slate-800 p-4 overflow-hidden flex flex-col">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-amber-400">C. Chat-Companion</h2>
            <p className="text-sm text-slate-400">AI: 30% • You: Full control</p>
            <div className="mt-2 flex gap-1">
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs rounded">Copilot</span>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs rounded">Power Users</span>
            </div>
          </div>
          <div className="flex-1 rounded-lg overflow-hidden border border-slate-600 bg-white">
            <ChatCompanionTables />
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-slate-800 border-t border-slate-700 text-center">
        <p className="text-sm text-slate-400">
          💡 <strong className="text-white">Key Question:</strong> Where does user trust come from?
          <span className="mx-2">•</span>
          <span className="text-violet-400">AI Magic</span>
          <span className="mx-2">→</span>
          <span className="text-emerald-400">Visible Process</span>
          <span className="mx-2">→</span>
          <span className="text-amber-400">Manual Control</span>
        </p>
      </div>
    </div>
  ),
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: `
### Side-by-Side Comparison

All three variants shown together for team discussion.

**Discussion Questions:**
1. Which feels most trustworthy?
2. Which matches our users' mental model?
3. Can we start with one and evolve?
4. Should different user segments get different defaults?
        `,
      },
    },
  },
};

