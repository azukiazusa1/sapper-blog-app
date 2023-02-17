import type { Meta, StoryObj } from '@storybook/svelte'
import DropDown from './DropDownMenu.svelte'

const meta: Meta<DropDown> = {
  title: 'DropDown',
  component: DropDown,
  tags: ['autodocs'],
  argTypes: {
    items: {
      control: { type: 'array' },
    },
    itemHref: {
      control: { type: 'text' },
      default: 'href',
    },
    itemText: {
      control: { type: 'text' },
      default: 'text',
    },
    itemImageUrl: {
      control: { type: 'text' },
      default: 'imageUrl',
    },
    loading: {
      control: { type: 'boolean' },
      default: false,
    },
  },
}

export default meta
type Story = StoryObj<DropDown>

export const Default: Story = {
  args: {
    items: [
      {
        href: '#',
        text: 'React',
        imageUrl: 'https://picsum.photos/200/300',
      },
      {
        href: '#',
        text: 'Vue',
        imageUrl: 'https://picsum.photos/200/300',
      },
      {
        href: '#',
        text: 'Angular',
        imageUrl: 'https://picsum.photos/200/300',
      },
    ],
  },
}

export const Loading: Story = {
  args: {
    items: [],
    loading: true,
  },
}
