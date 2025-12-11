import React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import { ThemeProvider } from '@mui/material/styles';

import { App } from './app';
import { ISettings, SettingsContext } from './settings';
import { theme } from './theme';

export class CatalogueWidget extends ReactWidget {
  settings: ISettings = {};

  constructor(settings: Partial<ISettings>) {
    super();
    this.settings = settings;
  }

  updateSettings(settings: Partial<ISettings>) {
    this.settings = { ...this.settings, ...settings };
    this.update();
  }

  render() {
    return (
      <SettingsContext.Provider value={this.settings}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </SettingsContext.Provider>
    );
  }
}
