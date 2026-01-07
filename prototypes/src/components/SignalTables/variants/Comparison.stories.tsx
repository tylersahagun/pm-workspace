import type { Meta, StoryObj } from '@storybook/react';
import { ChatFirstTables } from './ChatFirstTables';
import { ChatCentralTables } from './ChatCentralTables';
import { ChatCompanionTables } from './ChatCompanionTables';

/**
 * ## AI Chat Emphasis Variants - Comparison
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
 */

const ComparisonComponent = () => (
  <div className="h-screen flex flex-col bg-slate-900 text-white">
    <div className="p-6 bg-slate-800 border-b border-slate-700">
      <h1 className="text-2xl font-bold mb-2">
        AI Chat Emphasis: Design Exploration
      </h1>
      <p className="text-slate-400 max-w-3xl">
        Three variants exploring different levels of AI chat as the primary
        controller. Based on Woody's insight about Cursor's planning
        agent—showing AI's work builds trust.
      </p>
    </div>

    <div className="flex-1 grid grid-cols-3 gap-px bg-slate-700">
      <div className="bg-slate-800 p-4 overflow-hidden flex flex-col">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-violet-400">
            A. Chat-First
          </h2>
          <p className="text-sm text-slate-400">AI: 100% • You: Describe intent</p>
          <div className="mt-2 flex gap-1">
            <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded">
              Claude Artifacts
            </span>
            <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded">
              Cursor Agent
            </span>
          </div>
        </div>
        <div className="flex-1 rounded-lg overflow-hidden border border-slate-600 bg-white">
          <ChatFirstTables />
        </div>
      </div>

      <div className="bg-slate-800 p-4 overflow-hidden flex flex-col">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-emerald-400">
            B. Chat-Central
          </h2>
          <p className="text-sm text-slate-400">AI: 70% • You: Watch & verify</p>
          <div className="mt-2 flex gap-1">
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs rounded">
              Cursor Chat
            </span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs rounded">
              Recommended
            </span>
          </div>
        </div>
        <div className="flex-1 rounded-lg overflow-hidden border border-slate-600 bg-white">
          <ChatCentralTables />
        </div>
      </div>

      <div className="bg-slate-800 p-4 overflow-hidden flex flex-col">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-amber-400">
            C. Chat-Companion
          </h2>
          <p className="text-sm text-slate-400">AI: 30% • You: Full control</p>
          <div className="mt-2 flex gap-1">
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs rounded">
              Copilot
            </span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs rounded">
              Power Users
            </span>
          </div>
        </div>
        <div className="flex-1 rounded-lg overflow-hidden border border-slate-600 bg-white">
          <ChatCompanionTables />
        </div>
      </div>
    </div>

    <div className="p-4 bg-slate-800 border-t border-slate-700 text-center">
      <p className="text-sm text-slate-400">
        💡 <strong className="text-white">Key Question:</strong> Where does user
        trust come from?
        <span className="mx-2">•</span>
        <span className="text-violet-400">AI Magic</span>
        <span className="mx-2">→</span>
        <span className="text-emerald-400">Visible Process</span>
        <span className="mx-2">→</span>
        <span className="text-amber-400">Manual Control</span>
      </p>
    </div>
  </div>
);

const meta: Meta<typeof ComparisonComponent> = {
  title: 'Signal Tables/Chat Variants/Comparison',
  component: ComparisonComponent,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
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

export default meta;
type Story = StoryObj<typeof ComparisonComponent>;

export const Default: Story = {
  render: () => <ComparisonComponent />,
};

