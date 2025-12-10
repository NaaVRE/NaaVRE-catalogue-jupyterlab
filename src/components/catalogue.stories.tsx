import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Catalogue } from './catalogue';

const meta = {
  component: Catalogue
} satisfies Meta<typeof Catalogue>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
