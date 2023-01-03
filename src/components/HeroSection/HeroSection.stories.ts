import type { Meta, StoryObj } from '@storybook/svelte'
import HeroSection from './HeroSection.svelte'

const meta: Meta<HeroSection> = {
  title: 'HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<HeroSection>

export const Default: Story = {}
