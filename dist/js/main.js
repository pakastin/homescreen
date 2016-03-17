(function () {
  'use strict';

  function el (tagName, attrs) {
    var element = document.createElement(tagName);

    for (var attr in attrs) {
      if (element[attr] != null) {
        element[attr] = attrs[attr];
      } else {
        element.setAttribute(attr, attrs[attr]);
      }
    }

    for (var i = 2; i < arguments.length; i++) {
      mount(element, arguments[i]);
    }

    return element;
  }

  function list (View, key, initData) {
    return new List(View, key, initData);
  }

  function List (View, key, initData) {
    this.View = View;
    this.key = key;
    this.lookup = key != null ? {} : [];
    this.views = [];
    this.initData = initData;
  }

  List.prototype.update = function (data, cb) {
    var View = this.View;
    var key = this.key;
    var lookup = this.lookup;
    var newLookup = {};
    var views = this.views = new Array(data.length);
    var added = [];
    var updated = [];
    var removed = [];

    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      var id = key != null ? item[key] : i;
      var view = lookup[id];

      if (!view) {
        view = new View(this.initData, item);
        added[added.length] = view;
      } else {
        updated[updated.length] = view;
      }

      view.update && view.update(item);
      views[i] = view;

      newLookup[id] = view;
    }

    for (var id in lookup) {
      if (!newLookup[id]) {
        var view = lookup[id];
        removed[removed.length] = view;
        view.el.removing = true;
      }
    }

    if (this.parent) {
      setChildren(this.parent, views);
    }

    for (var i = 0; i < views.length; i++) {
      var item = data[i];
      var view = views[i];

      view.updated && view.updated(item);
    }

    this.lookup = newLookup;

    cb && cb(added, updated, removed);

    for (var i = 0; i < removed.length; i++) {
      var view = removed[i];
      if (view.remove) {
        this.parent && scheduleRemove(this.parent, view);
      } else {
        this.parent && unmount(this.parent, view);
      }
    }

    return this;
  }

  function scheduleRemove (parent, child) {
    child.remove(function () {
      unmount(parent, child);
    });
  }

  function mount (parent, child) {
    if (child instanceof List) {
      child.parent = parent;
      setChildren(parent, child.views);
      return;
    }
    if (child.el) {
      (parent.el || parent).appendChild(child.el);
      if (child.parent) {
        child.reorder && child.reorder();
      } else {
        child.mount && child.mount();
      }
      child.parent = parent;
    } else {
      (parent.el || parent).appendChild(child);
    }
  }

  function mountBefore (parent, child, before) {
    if (child.el) {
      (parent.el || parent).insertBefore(child.el, before.el || before);
      if (child.parent) {
        child.reorder && child.reorder();
      } else {
        child.mount && child.mount();
      }
      child.parent = parent;
    } else {
      (parent.el || parent).insertBefore(child, before.el || before);
    }
  }

  function unmount (parent, child) {
    if (child.el) {
      (parent.el || parent).removeChild(child.el);
      child.parent = null;
      child.unmount && child.unmount();
    } else {
      (parent.el || parent).removeChild(child);
    }
  }

  function setChildren (parent, children) {
    var traverse = (parent.el || parent).firstChild;

    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      var el = child.el || child;

      if (el === traverse) {
        traverse = traverse.nextSibling;
        continue;
      }
      if (traverse) {
        mountBefore(parent, child, traverse);
      } else {
        mount(parent, child);
      }
    }
    while (traverse) {
      var next = traverse.nextSibling;
      if (!traverse.removing) {
        (parent.el || parent).removeChild(traverse);
      }
      traverse = next;
    }
  }

  var data = [
    ['Social networks', [
      ['Facebook', 'facebook', '#3b5998'],
      ['Google Plus', 'google-plus', '#dc4e41'],
      ['Twitter', 'twitter', '#55acee'],
      ['LinkedIn', 'linkedin', '#0077b5'],
      ['Instagram', 'instagram', '#3f729b'],
      ['Tumblr', 'tumblr', '#35465c'],
      ['Medium', 'medium', '#020733']
    ]],
    ['Developer tools', [
      ['Github', 'github', '#333333']
    ]]
  ];

  var apps = [];
  var folders = [];

  data.forEach(function (folder, fid) {
    folders.push({
      _id: fid,
      name: folder[0]
    });

    folder[1].forEach(function (app, aid) {
      apps.push({
        _id: aid,
        folder: fid,
        name: app[0],
        icon: app[1],
        color: app[2]
      });
    });
  });

  function App () {
    this.icon = el('i');
    this.thumb = el('div', { className: 'thumb' }, this.icon);
    this.name = el('p');
    this.el = el('div', { className: 'app' }, this.thumb, this.name);
  }

  App.prototype.update = function (data) {
    this.thumb.style.backgroundColor = data.color;
    this.icon.className = 'fa fa-' + data.icon;
    this.name.textContent = data.name;
  }

  function Apps () {
    this.list = list(App, '_id');
    this.el = el('div', { className: 'apps' }, this.list);
    this.close();
  }

  Apps.prototype.close = function () {
    this.el.style.width = 'calc(300% - .5rem)';
    this.el.style.height = 'calc(300% - .5rem)';
    this.el.style.transform = 'scale(' + [1/3, 1/3].join(',') + ')';
    this.el.style.transformOrigin = '0 0';
  }

  Apps.prototype.open = function () {
    this.el.style.width = 'calc(100% - .5rem)';
    this.el.style.height = 'calc(100% - .5rem)';
    this.el.style.transform = '';
  }

  Apps.prototype.update = function (data) {
    console.log(this.list, data);
    this.list.update(data);
  }

  function Folder () {
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

    bg.style.transition = '';

    var bgStartRect = bg.getBoundingClientRect();

    apps.list.views.forEach(function (app, i) {
      app.el.style.transition = '';
      appStartRects[i] = app.el.getBoundingClientRect();
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

  function HomeScreen () {
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

  var homeScreen = new HomeScreen();

  homeScreen.update({
    apps: apps,
    folders: folders
  });

  mountBefore(document.body, homeScreen, document.body.firstChild);

}());