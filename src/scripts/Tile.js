export class Tile {
  constructor(tileContainer) {
    this.tile = document.createElement('div');
    this.tile.classList.add('tile');
    this.setValue(Math.random() > 0.2 ? 2 : 4);
    tileContainer.append(this.tile);
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;
    this.tile.style.setProperty('--x', x);
    this.tile.style.setProperty('--y', y);
  }

  setValue(val) {
    this.value = val;
    this.tile.textContent = val;

    const color = 100 - Math.log2(val) * 9;

    this.tile.style.setProperty('--bg-color', `${color}%`);
    this.tile.style.setProperty('--text-color', `${color <= 50 ? 90 : 10}%`);
  }

  removeFromField() {
    this.tile?.remove();
  }
}
