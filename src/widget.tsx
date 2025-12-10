import React from 'react';
import { ReactWidget } from '@jupyterlab/apputils';

import { ISettings, SettingsContext } from './settings';
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
        <Catalogue />
      </SettingsContext.Provider>
    );
  }
}
