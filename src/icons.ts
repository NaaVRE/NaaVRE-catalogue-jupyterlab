import { LabIcon } from '@jupyterlab/ui-components';

import launcherIconSvgStr from '../style/icons/launcher-icon.svg';
import tabIconSvgStr from '../style/icons/tab-icon.svg';

export const launcherIcon = new LabIcon({
  name: 'launcher-icon',
  svgstr: launcherIconSvgStr
});

export const tabIcon = new LabIcon({
  name: 'tab-icon',
  svgstr: tabIconSvgStr
});
