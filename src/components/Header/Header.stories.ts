import type { Meta, StoryObj } from '@storybook/svelte'
import Header from './Header.svelte'

const meta: Meta<Header> = {
  title: 'Header',
  component: Header,
  tags: ['autodocs'],
  argTypes: {
    segment: {
      control: {
        options: ['blog', 'about', 'contact'],
        type: 'select',
      },
      description: '現在のページ',
    },
    darkMode: {
      control: { type: 'boolean' },
      description: 'ダークモードかどうか',
    },
  },
}

export default meta
type Story = StoryObj<Header>

export const Default: Story = {
  args: {
    segment: 'blog',
    darkMode: false,
  },
}
