import type { Meta, StoryObj } from '@storybook/svelte'
import FloatingActionButton from './FloatingActionButton.svelte'

const meta = {
  title: 'FloatingActionButton',
  component: FloatingActionButton,
  tags: ['autodocs'],
  argTypes: {
    slot: {
      control: { type: 'text' },
    },
  },
} satisfies Meta<FloatingActionButton>

export default meta
type Story = StoryObj<FloatingActionButton>

export const Default: Story = {
  args: {
    slot: 'Add',
  },
}
