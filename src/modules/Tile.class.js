export default class Tile {
  constructor(tileContainer, value = Math.random() > 0.1 ? 2 : 4) {
    this.tileElement = document.createElement('div');
    tileContainer.append(this.tileElement);
    this._value = value;
    this.updateTileElement();
  }

  get value() {
    this.updateTileElement();

    return this._value;
  }

  set value(v) {
    this._value = v;
    this.updateTileElement();
  }

  updateTileElement() {
    this.tileElement.textContent = this._value;
    this.tileElement.className = '';
    this.tileElement.classList.add('tile', `tile--${this._value}`);
  }

  setXY(x, y) {
    this._x = x;
    this._y = y;
    this.tileElement.style.setProperty('--x', x);
    this.tileElement.style.setProperty('--y', y);
  }

  remove() {
    this.tileElement.remove();
    this.updateTileElement();
  }

  waitForTransition() {
    return new Promise((resolve) => {
      this.tileElement.addEventListener('transitionend', resolve, {
        once: true,
      });
    });
  }
}
