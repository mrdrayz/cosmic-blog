import type { Meta, StoryObj } from '@storybook/react';
import CommentItem from './CommentItem';

const meta: Meta<typeof CommentItem> = {
  title: 'Components/CommentItem',
  component: CommentItem,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CommentItem>;

export const WithAuthor: Story = {
  args: {
    comment: {
      id: 1,
      content: 'Great article! Thanks for sharing.',
      user: { id: 1, email: 'john@test.com', name: 'John Doe' },
    },
  },
};

export const Anonymous: Story = {
  args: {
    comment: { id: 2, content: 'Nice post!' },
  },
};

export const LongComment: Story = {
  args: {
    comment: {
      id: 3,
      content:
        'This is a very detailed and thoughtful comment that spans ' +
        'multiple lines and provides a lot of valuable feedback ' +
        'about the article content and its implications.',
      user: { id: 2, email: 'jane@test.com', name: 'Jane Smith' },
    },
  },
};
