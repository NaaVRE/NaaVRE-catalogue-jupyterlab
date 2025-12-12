import {
  IRouter,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { MainAreaWidget, WidgetTracker } from '@jupyterlab/apputils';
import { ILauncher } from '@jupyterlab/launcher';
import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { CatalogueWidget } from './widget';
import { launcherIcon, tabIcon } from './icons';
import { ISettings } from './settings';

export namespace CommandIDs {
  export const createNew = 'create-catalogue-view';
  export const openFromUrl = 'open-catalogue-from-url';
}

/**
 * Initialization data for the @naavre/catalogue-jupyterlab extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: '@naavre/catalogue-jupyterlab:plugin',
  description: 'NaaVRE assets catalogue frontend on Jupyter Lab',
  autoStart: true,
  requires: [ILauncher, IRouter, ISettingRegistry],
  optional: [ISettingRegistry],
  activate: (
    app: JupyterFrontEnd,
    launcher: ILauncher,
    router: IRouter,
    settingRegistry: ISettingRegistry | null
  ) => {
    console.log(
      'JupyterLab extension @naavre/catalogue-jupyterlab is activated!'
    );

    // Widget tracker
    const tracker = new WidgetTracker<CatalogueWidget>({
      namespace: 'naavre-catalogue'
    });

    // Widget factory
    function createNewWidget(settings: Partial<ISettings>): CatalogueWidget {
      const widget = new CatalogueWidget(settings);
      tracker.add(widget);
      return widget;
    }

    // Launcher icon
    if (launcher) {
      launcher.add({
        command: CommandIDs.createNew,
        category: 'VRE Components',
        rank: 0
      });
    }

    // Command and route to open widget from URL
    app.commands.addCommand(CommandIDs.openFromUrl, {
      label: 'Open assets catalogue from URL',
      caption: 'Open the catalogue of NaaVRE assets from the URL',
      icon: args => (args['isPalette'] ? undefined : launcherIcon),
      execute: args => {
        if (router.current.hash.match(/^#\/naavre-catalogue/)) {
          app.commands.execute(CommandIDs.createNew);
        }
      }
    });
    router.register({
      command: CommandIDs.openFromUrl,
      pattern: /lab\/?/
    });

    // Load settings
    function loadSettings(settings: ISettingRegistry.ISettings): void {
      tracker.forEach(widget => widget.updateSettings(settings.composite));
    }
    if (settingRegistry) {
      Promise.all([app.restored, settingRegistry.load(extension.id)])
        .then(([, settings]) => {
          loadSettings(settings);
          settings.changed.connect(loadSettings);

          // Command
          app.commands.addCommand(CommandIDs.createNew, {
            label: 'Assets catalogue',
            caption: 'Catalogue of NaaVRE assets',
            icon: args => (args['isPalette'] ? undefined : launcherIcon),
            execute: args => {
              const content = createNewWidget(settings.composite);
              const widget = new MainAreaWidget<CatalogueWidget>({ content });
              widget.title.label = 'Assets catalogue';
              widget.title.icon = tabIcon;
              return app.shell.add(widget, 'main');
            }
          });
        })
        .catch(reason => {
          console.error(
            'Failed to load settings for @naavre/catalogue-jupyterlab.',
            reason
          );
        });
    }
  }
};

export default extension;
