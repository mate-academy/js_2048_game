export default class Tile {
  constructor(tileContainer, value = Math.random() > 0.2 ? 2 : 4) {
    this.tileElement = document.createElement('div');
    this.tileElement.classList.add('tile');
    tileContainer.append(this.tileElement);
    this.value = value;
  }

  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.tileElement.textContent = val;

    const color = 100 - Math.log2(val) * 9;

    this.tileElement.style.setProperty(
      '--bg-color',
      `${color}%`
    );

    this.tileElement.style.setProperty(
      '--text-color',
      `${color <= 70 ? 90 : 10}%`
    );
  }

  set x(value) {
    this._x = value;
    this.tileElement.style.setProperty('--x', value);
  }

  set y(value) {
    this._y = value;
    this.tileElement.style.setProperty('--y', value);
  }

  remove() {
    this.tileElement.remove();
  }
};
