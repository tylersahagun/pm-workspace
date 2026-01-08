import type { Meta, StoryObj } from '@storybook/react';
import { ChatFirstTables } from './ChatFirstTables';

const meta: Meta<typeof ChatFirstTables> = {
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

export default meta;
type Story = StoryObj<typeof ChatFirstTables>;

/**
 * Full chat-first experience. Try:
 * 1. "Show me competitor mentions"
 * 2. Click "Run Analysis" when the table config appears
 * 3. Results appear inline as an artifact
 */
export const Default: Story = {
  render: () => <ChatFirstTables />,
};

