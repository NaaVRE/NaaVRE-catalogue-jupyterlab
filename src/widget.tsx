import React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';
import { ThemeProvider } from '@mui/material/styles';

import { ISettings, SettingsContext } from './settings';
import { theme } from './theme';
import { Catalogue } from './components/catalogue';

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
          <Catalogue />
        </ThemeProvider>
      </SettingsContext.Provider>
    );
  }
}
