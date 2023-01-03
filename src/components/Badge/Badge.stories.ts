import type { Meta, StoryObj } from '@storybook/svelte'

import BadgeView from './BadgeView.svelte'

const meta: Meta<BadgeView> = {
  title: 'Badge',
  component: BadgeView,
  tags: ['autodocs'],
  argTypes: {
    slot: {
      control: { type: 'text' },
    },
  },
}

export default meta
type Story = StoryObj<BadgeView>

export const Primary: Story = {
  args: {
    slot: '3',
  },
}
