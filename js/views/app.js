
import { el } from '@pakastin/f';

export function App () {
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
