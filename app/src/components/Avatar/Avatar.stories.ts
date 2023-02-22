import type { Meta, StoryObj } from '@storybook/svelte'

import Avatar from './Avatar.svelte'

const meta = {
  title: 'Avatar',
  component: Avatar,
  tags: ['autodocs'],
  argTypes: {
    src: {
      control: { type: 'text', describe: '画像のURL' },
    },
    size: {
      control: { type: 'select', options: ['sm', 'md', 'lg'], describe: 'サイズ' },
    },
    alt: {
      control: { type: 'text', describe: '代替テキスト' },
    },
  },
} satisfies Meta<Avatar>

export default meta
type Story = StoryObj<Avatar>

export const Sm: Story = {
  args: {
    src: 'https://api.lorem.space/image/face?w=150&h=150',
    size: 'sm',
    alt: 'avatar',
  },
}

export const Md: Story = {
  args: {
    src: 'https://api.lorem.space/image/face?w=150&h=150',
    size: 'md',
    alt: 'avatar',
  },
}

export const Lg: Story = {
  args: {
    src: 'https://api.lorem.space/image/face?w=150&h=150',
    size: 'lg',
    alt: 'avatar',
  },
}
