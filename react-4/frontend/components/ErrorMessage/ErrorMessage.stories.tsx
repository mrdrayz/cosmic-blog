import type { Meta, StoryObj } from '@storybook/react';
import ErrorMessage from './ErrorMessage';

const meta: Meta<typeof ErrorMessage> = {
  title: 'Components/ErrorMessage',
  component: ErrorMessage,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorMessage>;

export const Default: Story = {
  args: { message: 'Something went wrong. Please try again.' },
};

export const NetworkError: Story = {
  args: { message: 'Network error. Check your internet connection.' },
};

export const LongMessage: Story = {
  args: {
    message:
      'An unexpected error occurred while processing your request. ' +
      'Please refresh the page and try again. If the problem persists, ' +
      'contact support for assistance.',
  },
};
