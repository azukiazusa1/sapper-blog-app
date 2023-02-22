import type { Meta, StoryObj } from '@storybook/svelte'

import Contributors from './Contributors.svelte'

const meta = {
  title: 'Contributors',
  component: Contributors,
  tags: ['autodocs'],
  argTypes: {
    contributors: {
      control: { type: 'object', describe: 'Contributor の一覧' },
    },
  },
} satisfies Meta<Contributors>

export default meta
type Story = StoryObj<Contributors>

export const Default: Story = {
  args: {
    contributors: [
      {
        username: 'azukiazusa1',
        avatar: 'https://api.lorem.space/image/face?w=150&h=150',
        url: 'https://example.com',
      },
      {
        username: 'azukiazusa2',
        avatar: 'https://api.lorem.space/image/face?w=150&h=150',
        url: 'https://example.com',
      },
      {
        username: 'azukiazusa3',
        avatar: 'https://api.lorem.space/image/face?w=150&h=150',
        url: 'https://example.com',
      },
    ],
  },
}
