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
  export const openOrRestore = 'open-or-restore-catalogue';
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
    const tracker = new WidgetTracker<MainAreaWidget<CatalogueWidget>>({
      namespace: 'naavre-catalogue'
    });

    // Widget factory
    function createNewWidget(
      settings: Partial<ISettings>
    ): MainAreaWidget<CatalogueWidget> {
      const catalogueWidget = new CatalogueWidget(settings);
      const mainAreaWidget = new MainAreaWidget<CatalogueWidget>({
        content: catalogueWidget
      });
      mainAreaWidget.title.label = 'Assets catalogue';
      mainAreaWidget.title.icon = tabIcon;
      return mainAreaWidget;
    }

    // Launcher icon
    if (launcher) {
      launcher.add({
        command: CommandIDs.openOrRestore,
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
          app.commands.execute(CommandIDs.openOrRestore);
        }
      }
    });
    router.register({
      command: CommandIDs.openFromUrl,
      pattern: /lab\/?/
    });

    // Load settings
    function loadSettings(settings: ISettingRegistry.ISettings): void {
      tracker.forEach(widget =>
        widget.content.updateSettings(settings.composite)
      );
    }
    if (settingRegistry) {
      Promise.all([app.restored, settingRegistry.load(extension.id)])
        .then(([, settings]) => {
          loadSettings(settings);
          settings.changed.connect(loadSettings);

          // Command
          app.commands.addCommand(CommandIDs.openOrRestore, {
            label: 'Assets catalogue',
            caption: 'Catalogue of NaaVRE assets',
            icon: args => (args['isPalette'] ? undefined : launcherIcon),
            execute: args => {
              if (tracker.currentWidget) {
                app.shell.activateById(tracker.currentWidget.id);
              } else {
                const widget = createNewWidget(settings.composite);
                tracker.add(widget);
                app.shell.add(widget, 'main');
              }
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
