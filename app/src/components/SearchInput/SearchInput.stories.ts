import type { Meta, StoryObj } from '@storybook/svelte'
import SearchInput from './SearchInput.svelte'

const meta: Meta<SearchInput> = {
  title: 'SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'text' },
      describe: '検索ワード',
    },
  },
}

export default meta
type Story = StoryObj<SearchInput>

export const Default: Story = {
  args: {
    value: '',
  },
}
