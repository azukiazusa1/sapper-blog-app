import type { Meta, StoryObj } from '@storybook/svelte'

import Box from './BoxView.svelte'

const meta = {
  title: 'Box',
  component: Box,
  tags: ['autodocs'],
} satisfies Meta<Box>

export default meta
type Story = StoryObj<Box>

export const Default: Story = {}
