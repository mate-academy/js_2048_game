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
    const prevValue = this.value;

    this.value = value;
    this.tileElement.textContent = value;
    this.tileElement.classList.remove(`field-tile--${prevValue}`);
    this.tileElement.classList.add(`field-tile--${value}`);
  }

  removeFromDOM() {
    this.tileElement.remove();
  }

  waitForTransitionEnd(animation = false) {
    return new Promise((resolve) => {
      this.tileElement.addEventListener(
        animation ? 'animationend' : 'transitionend',
        resolve,
        { once: true },
      );
    });
  }
}
