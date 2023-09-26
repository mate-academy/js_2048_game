export class Tile {
  constructor(gridElement) {
    this.tileElement = document.createElement('div');
    this.tileElement.classList.add('field_tile');
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
    this.tileElement.textContent = this.value;

    const bgLightness = 100 - Math.log2(value) * 7;

    this.tileElement.style.setProperty('--bg-lightness', `${bgLightness}%`);

    this.tileElement.style.setProperty(
      '--text-lightness', `${bgLightness < 50 ? 80 : 20}%`
    );

    if (this.value === 2048) {
      const winMessage = document.querySelector('.message_win');

      winMessage.classList.remove('hidden');
    }
  }

  removeFromDOM() {
    this.tileElement.remove();
  }

  waitForTransitionEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener(
        'transitionend', resolve, { once: true }
      );
    });
  }

  waitForAnimationEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener(
        'animationend', resolve, { once: true }
      );
    });
  }
}
