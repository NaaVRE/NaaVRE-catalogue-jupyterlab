import React from 'react';
import type { Preview } from '@storybook/react-webpack5';

import { ThemeProvider } from '@mui/material/styles';
import { SettingsContext } from '../src/settings';
import { theme } from '../src/theme';

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
            <ThemeProvider theme={theme}>
              <Story />
            </ThemeProvider>
          </SettingsContext.Provider>
        </div>
      );
    }
  ]
};

export default preview;
