import type { Meta, StoryObj } from '@storybook/react';
import ArticleCard from './ArticleCard';

const meta: Meta<typeof ArticleCard> = {
  title: 'Components/ArticleCard',
  component: ArticleCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ArticleCard>;

export const Default: Story = {
  args: {
    article: {
      id: 1,
      title: 'Getting Started with React',
      content:
        'React is a JavaScript library for building user interfaces. ' +
        'It lets you compose complex UIs from small and isolated pieces of code.',
      previewImage: null,
      author: { id: 1, email: 'john@test.com', name: 'John Doe' },
    },
  },
};

export const WithImage: Story = {
  args: {
    article: {
      id: 2,
      title: 'Understanding TypeScript',
      content: 'TypeScript adds static type definitions to JavaScript.',
      previewImage: 'https://picsum.photos/seed/article/600/300',
      author: { id: 2, email: 'jane@test.com', name: 'Jane Smith' },
    },
  },
};

export const UnknownAuthor: Story = {
  args: {
    article: {
      id: 3,
      title: 'Anonymous Article',
      content: 'This article has no known author.',
      previewImage: null,
    },
  },
};

export const LongContent: Story = {
  args: {
    article: {
      id: 4,
      title:
        'A Comprehensive Guide to Modern Web Development with React ' +
        'TypeScript and Next.js in 2024 and Beyond',
      content: 'Lorem ipsum dolor sit amet. '.repeat(50),
      previewImage: null,
      author: { id: 3, email: 'alex@test.com', name: 'Alex Johnson' },
    },
  },
};
