import { Status } from '@prisma/client';

export const PROJECT_SATURN = {
  name: 'Saturn',
  description:
    'Saturn is my personal project dashboard where I manage all my personal projects. It allows me to create tasks, brainstorms, and projects effortlessly. I can also visualize graphs with data to track my progress and stay organized.',
  status: 'IN_PROGRESS' as Status,

  logo: 'https://saturn-storage-bucket.s3.ap-southeast-2.amazonaws.com/6c7a02fc-aaec-4942-b7f4-90ef3d1a4da2-blob'
};

export const PROJECT_SATURN_STACK = {
  frontend: ['react', 'radix', 'shadcnui', 'tanstack-query', 'tailwind', 'next.js', 'hookform'],
  backend: ['nodejs', 'express', 'joi', 'swagger', 'prisma', 'postgresql'],
  misc: ['typescript', 'aws', 'openai', 'github']
};
