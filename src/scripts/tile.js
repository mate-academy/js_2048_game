'use sctrict';

export class Tile {
  constructor(gridElement) {
    this.tileElement = document.createElement('div');
    this.tileElement.classList.add('field-cell--tile');
    this.setValue(Math.random() > 0.5 ? 2 : 4);
    this.tileElement.textContent = this.value;
    gridElement.append(this.tileElement);
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;
    this.tileElement.style.setProperty('--game-field-tile-x', x);
    this.tileElement.style.setProperty('--game-field-tile-y', y);
  }

  setValue(value) {
    this.value = value;
    this.tileElement.textContent = value;
    this.tileElement.classList.add('field-cell--' + value);
  }

  removeFromDOM() {
    this.tileElement.remove();
  }

  waitForTransitionEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener('transitionend',
        resolve, { once: true });
    });
  }

  waitForAnimationEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener('animationend',
        resolve, { once: true });
    });
  }
}
