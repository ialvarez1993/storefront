import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  stories: [
    '../components/**/*.stories.@(js|jsx|ts|tsx)',
    '../stories/**/*.stories.@(js|jsx|ts|tsx)'
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/vue3-vite',
    options: {}
  },
  viteFinal: async (config) => {
    // Agrega el plugin de Vue
    config.plugins = config.plugins || [];
    config.plugins.push(require('@vitejs/plugin-vue')());

    return config;
  },
  docs: {
    autodocs: 'tag'
  }
};

export default config;
