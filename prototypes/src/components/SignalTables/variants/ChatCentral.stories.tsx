import type { Meta, StoryObj } from '@storybook/react';
import { ChatCentralTables } from './ChatCentralTables';

const meta: Meta<typeof ChatCentralTables> = {
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

export default meta;
type Story = StoryObj<typeof ChatCentralTables>;

/**
 * Balanced chat experience with live preview.
 */
export const Default: Story = {
  render: () => <ChatCentralTables />,
};

