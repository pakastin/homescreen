
import { el, list } from '@pakastin/f';

import { App } from './index';

export function Apps () {
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
