import type { Meta, StoryObj } from '@storybook/react';
import { ChatCompanionTables } from './ChatCompanionTables';

const meta: Meta<typeof ChatCompanionTables> = {
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

export default meta;
type Story = StoryObj<typeof ChatCompanionTables>;

/**
 * Traditional builder with floating AI assistant.
 */
export const Default: Story = {
  render: () => <ChatCompanionTables />,
};

