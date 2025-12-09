import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

/**
 * Initialization data for the @naavre/catalogue-jupyterlab extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@naavre/catalogue-jupyterlab:plugin',
  description: 'NaaVRE assets catalogue frontend on Jupyter Lab',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension @naavre/catalogue-jupyterlab is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('@naavre/catalogue-jupyterlab settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for @naavre/catalogue-jupyterlab.', reason);
        });
    }
  }
};

export default plugin;
