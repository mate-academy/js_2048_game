export class Tile {
  constructor(gameElement) {
    this.tileElement = document.createElement('div');
    this.tileElement.classList.add('tile');
    this.setValue(Math.random() > 0.1 ? 2 : 4);
    gameElement.append(this.tileElement);
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

    const bgColor = colorChanging(value);

    this.tileElement.style.setProperty('--tile-color', bgColor);

    if (this.value === 2048) {
      gameWin();
    }
  }

  removeFromDOM() {
    this.tileElement.remove();
  }

  waitForTransitionEnd() {
    return new Promise((resolve) => {
      this.tileElement.addEventListener('transitionend', resolve, {
        once: true,
      });
    });
  }

  waitForAnimationEnd() {
    return new Promise((resolve) => {
      this.tileElement.addEventListener('animationend', resolve, {
        once: true,
      });
    });
  }
}

function colorChanging(value) {
  switch (value) {
    case 2:
      return '#fff';
    case 4:
      return '#fffbd7';
    case 8:
      return '#fff6a3';
    case 16:
      return '#ffec36';
    case 32:
      return '#ffc800';
    case 64:
      return '#ffa400';
    case 128:
      return '#ff7600';
    case 256:
      return '#ff5200';
    case 512:
      return '#ff0000';
    case 1024:
      return '#af0000';
    case 2048:
      return '#00ff37';
  }
}

function gameWin() {
  const messageWin = document.querySelector('.message-win');

  messageWin.classList.remove('hidden');
}
