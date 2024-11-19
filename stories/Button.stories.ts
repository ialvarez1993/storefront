// stories/Button.stories.ts
import type { Meta, StoryObj } from '@storybook/vue3';
import Button from '../components/Button.vue';

const meta = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text' },
        primary: { control: 'boolean' },
        onClick: { action: 'clicked' }
    }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        primary: true,
        label: 'Button'
    }
};

export const Secondary: Story = {
    args: {
        primary: false,
        label: 'Button'
    }
};
