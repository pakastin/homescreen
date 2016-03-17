
import { mountBefore } from '@pakastin/f';

import { apps, folders } from './data';
import { HomeScreen } from './views/index';

var homeScreen = new HomeScreen();

homeScreen.update({
  apps: apps,
  folders: folders
});

mountBefore(document.body, homeScreen, document.body.firstChild);
