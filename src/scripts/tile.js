export class Tile {
  constructor(gridElement) {
    this.tileElement = document.createElement('div');
    this.tileElement.classList.add('field-tile');
    this.setValue(Math.random() > 0.1 ? 2 : 4);
    gridElement.append(this.tileElement);
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;

    this.tileElement.style.setProperty('--x', x);
    this.tileElement.style.setProperty('--y', y);
  }

  setValue(value) {
    this.value = value;
    this.tileElement.textContent = value;
    const bgLightness = 100 - Math.log2(value) * 8;
    this.tileElement.style.setProperty('--bg-lightness', `${bgLightness}%`);
    this.tileElement.style.setProperty('--text-lightness', `${bgLightness < 60 ? 100 : 30}%`)
  }

  removeFromDOM() {
    this.tileElement.remove();
  }
}
