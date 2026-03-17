import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import SearchBar from './SearchBar';

const meta: Meta<typeof SearchBar> = {
  title: 'Components/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  args: { onSearch: fn() },
};

export default meta;
type Story = StoryObj<typeof SearchBar>;

export const Default: Story = {};

export const WithInitialValue: Story = {
  args: { initialValue: 'React hooks' },
};

export const CustomPlaceholder: Story = {
  args: { placeholder: 'Type something...' },
};
