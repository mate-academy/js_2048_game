const COLORS = {
  2: '#eee4da',
  4: '#ede0c8',
  8: '#f2b179',
  16: '#f59563',
  32: '#f67c5f',
  64: '#f65e3b',
  128: '#edcf72',
  256: '#edcc61',
  512: '#edc850',
  1024: '#edc53f',
  2048: '#edc22e',
};

export class Tile {
  constructor(gridElement) {
    this.tileElement = document.createElement('div');
    this.tileElement.classList.add('tile');
    this.setValue(Math.random() > 0.5 ? 2 : 4);
    gridElement.append(this.tileElement);
  }

  setValue(value) {
    this.value = value;
    this.tileElement.textContent = value;
    this.tileElement.style.setProperty("--bg-color", `${COLORS[value]}`);
    this.tileElement.style.setProperty("--text-color", `${value >= 8 ? '#f9f6f2' : '#776e65'}`);
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;
    this.tileElement.style.setProperty("--x", x);
    this.tileElement.style.setProperty("--y", y);
  }

  removeFromDOM() {
    this.tileElement.remove();
  }

  waitForTransitionEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener(
        "transitionend", resolve, { once: true });
    });
  }

  waitForAnimationEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener(
        "animationend", resolve, { once: true });
    });
  }
}
