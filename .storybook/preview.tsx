import React from 'react';
import type { Preview } from '@storybook/react-webpack5';

import { SettingsContext } from '../src/settings';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    settings: {
      virtualLab: 'test-virtual-lab-1',
      catalogueServiceUrl: 'http://localhost:8000'
    }
  },
  decorators: [
    (Story, { parameters }) => {
      return (
        <div
          style={{
            fontFamily:
              "system-ui,-apple-system,blinkmacsystemfont,'Segoe UI',helvetica,arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'"
          }}
        >
          <SettingsContext.Provider value={parameters.settings}>
            <Story />
          </SettingsContext.Provider>
        </div>
      );
    }
  ]
};

export default preview;
