export class Tile {
  constructor(gameField) {
    this.tileElement = document.createElement('div');
    this.tileElement.classList.add('tile', 'field-cell', 'show');
    this.setValue(Math.random() > 0.1 ? 2 : 4);
    this.tileElement.textContent = this.value;
    gameField.append(this.tileElement);

    this.tileElement.addEventListener(
      'animationend',
      () => {
        this.tileElement.classList.remove('show');
      },
      { once: true },
    );
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;
    this.tileElement.style.setProperty('--x', x);
    this.tileElement.style.setProperty('--y', y);
  }

  setValue(value) {
    this.value = value;
    this.tileElement.textContent = this.value;

    this.tileElement.classList.forEach((cls) => {
      if (cls.startsWith('field-cell--')) {
        this.tileElement.classList.remove(cls);
      }
    });
    this.tileElement.classList.add(`field-cell--${this.value}`);
  }

  removeFromDom() {
    this.tileElement.remove();
  }

  waitForTransitionEnd() {
    return new Promise((resolve, reject) => {
      this.tileElement.addEventListener('transitionend', resolve, {
        once: true,
      });
    });
  }
}
