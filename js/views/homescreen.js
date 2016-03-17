
import { el, list } from '@pakastin/f';
import { Folder } from './index';

export function HomeScreen () {
  this.list = list(Folder, '_id', this);
  this.el = el('div', { className: 'homescreen' }, this.list);
  this.el.addEventListener('click', onClick);

  function onClick (e) {
    if (e.folder) {
      setTimeout(function () {
        window.addEventListener('click', onClose);
      });
      return;
    }

    function onClose () {
      e.folder.close();
      window.removeEventListener('click', onClose);
    }
  }
}

HomeScreen.prototype.update = function (data) {
  var appsByFolder = {};

  data.apps.forEach(function (app) {
    appsByFolder[app.folder] || (appsByFolder[app.folder] = []);
    appsByFolder[app.folder].push(app);
  });

  this.list.update(data.folders.map(function (folder) {
    var folderWithApps = Object.create(folder);

    folderWithApps.apps = appsByFolder[folder._id];

    return folderWithApps;
  }));
}
