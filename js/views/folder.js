
import { el } from '@pakastin/f';

import { Apps } from './index';

export function Folder () {
  this.bg = el('div', { className: 'bg' });
  this.apps = new Apps();
  this.name = el('p');
  this.el = el('div', { className: 'folder' }, this.name, this.bg, this.apps);

  var self = this;

  this.el.addEventListener('click', function (e) {
    e.folder = self;
    self.open();
  });
}

Folder.prototype.open = function () {
  this.opened = true;

  this.el.style.zIndex = 10000;

  var apps = this.apps;
  var bg = this.bg;
  var appStartRects = [];

  bg.style.transition = '';

  var bgStartRect = bg.getBoundingClientRect();

  apps.list.views.forEach(function (app, i) {
    app.el.transition = '';
    appStartRects[i] = app.el.getBoundingClientRect();
  });

  this.el.classList.add('opened');
  apps.open();

  var bgEndRect = bg.getBoundingClientRect();

  apps.list.views.forEach(function (app, i) {
    var startRect = appStartRects[i];
    var endRect = app.el.getBoundingClientRect();

    var rectDiff = {
      x: startRect.left - endRect.left,
      y: startRect.top - endRect.top,
      w: startRect.width / endRect.width,
      h: startRect.height / endRect.height
    }

    app.el.style.transition = '';
    app.el.style.transform = 'translate(' + [rectDiff.x, rectDiff.y].join('px,') + 'px)' +
      'scale(' + [rectDiff.w, rectDiff.h].join(',') + ')';
    app.el.style.transformOrigin = '0 0';

    setTimeout(function () {
      app.el.style.transition = 'transform .5s';
      app.el.style.transform = '';
    }, 0);
  });
  var bgDiffRect = {
    x: bgStartRect.left - bgEndRect.left,
    y: bgStartRect.top - bgEndRect.top,
    w: bgStartRect.width / bgEndRect.width,
    h: bgStartRect.height / bgEndRect.height
  }
  bg.style.transform = 'translate(' + [bgDiffRect.x, bgDiffRect.y].join('px,') + 'px)' +
    'scale(' + [bgDiffRect.w, bgDiffRect.h].join(',') + ')';
  bg.style.transformOrigin = '0 0';

  setTimeout(function () {
    bg.style.transition = 'transform .5s';
    bg.style.transform = '';
  }, 0);
}

Folder.prototype.close = function () {
  var apps = this.apps;
  var bg = this.bg
  var appStartRects = [];

  var bgStartRect = bg.getBoundingClientRect();
  bg.style.transition = '';

  apps.list.views.forEach(function (app, i) {
    appStartRects[i] = app.el.getBoundingClientRect();
    app.el.style.transition = '';
  });

  this.el.classList.remove('opened');
  apps.close();

  var bgEndRect = bg.getBoundingClientRect();

  apps.list.views.forEach(function (app, i) {
    var startRect = appStartRects[i];
    var endRect = app.el.getBoundingClientRect();

    var rectDiff = {
      x: startRect.left - endRect.left,
      y: startRect.top - endRect.top,
      w: startRect.width / endRect.width,
      h: startRect.height / endRect.height
    }
    app.el.style.transition = '';
    app.el.style.transform =
      'scale(' + [rectDiff.w, rectDiff.h].join(',') + ')' +
      'translate(' + [rectDiff.x, rectDiff.y].join('px,') + 'px)';
    app.el.style.transformOrigin = '0 0';

    setTimeout(function () {
      app.el.style.transition = 'transform .5s';
      app.el.style.transform = '';
    }, 0);
  });

  var bgDiffRect = {
    x: bgStartRect.left - bgEndRect.left,
    y: bgStartRect.top - bgEndRect.top,
    w: bgStartRect.width / bgEndRect.width,
    h: bgStartRect.height / bgEndRect.height
  }
  bg.style.transform = 'translate(' + [bgDiffRect.x, bgDiffRect.y].join('px,') + 'px)' +
    'scale(' + [bgDiffRect.w, bgDiffRect.h].join(',') + ')';
  bg.style.transformOrigin = '0 0';

  setTimeout(function () {
    bg.style.transition = 'transform .5s';
    bg.style.transform = '';
  }, 0);

  setTimeout(function () {
    this.el.style.zIndex = '';
  }, 500);
}

Folder.prototype.update = function (data) {
  this.name.textContent = data.name;
  this.apps.update(data.apps);
}
