export default class Tile {
  #tileElement;
  #x;
  #y;
  #value;

  constructor(tileContainer, value = Math.random() < 0.9 ? 2 : 4) {
    this.#tileElement = document.createElement('div');
    this.#tileElement.classList.add('tile');
    tileContainer.append(this.#tileElement);
    this.value = value;
  }

  get value() {
    return this.#value;
  }

  set value(v) {
    this.#value = v;
    this.#tileElement.textContent = v;

    const { background, textColor } = getColors(v);

    this.#tileElement.style.setProperty('--background-color', background);
    this.#tileElement.style.setProperty('--text-color', textColor);
  }

  set x(value) {
    this.#x = value;
    this.#tileElement.style.setProperty('--x', value);
  }

  get x() {
    return this.#x;
  }

  set y(value) {
    this.#y = value;
    this.#tileElement.style.setProperty('--y', value);
  }

  get y() {
    return this.#y;
  }

  remove() {
    this.#tileElement.remove();
  }

  waitForTransition(animation = false) {
    return new Promise((resolve) => {
      this.#tileElement.addEventListener(
        animation ? 'animationend' : 'transitionend',
        resolve,
        {
          once: true,
        },
      );
    });
  }
}

function getColors(number) {
  let colors = {};

  switch (number) {
    case 2:
      colors = {
        background: '#eee4da',
        textColor: '#776e65',
      };
      break;
    case 4:
      colors = {
        background: '#ede0c8',
        textColor: '#776e65',
      };
      break;
    case 8:
      colors = {
        background: '#f2b179',
        textColor: '#f9f6f2',
      };
      break;
    case 16:
      colors = {
        background: '#f59563',
        textColor: '#f9f6f2',
      };
      break;
    case 32:
      colors = {
        background: '#f67c5f',
        textColor: '#f9f6f2',
      };
      break;
    case 64:
      colors = {
        background: '#f65e3b',
        textColor: '#f9f6f2',
      };
      break;
    case 128:
      colors = {
        background: '#edcf72',
        textColor: '#f9f6f2',
      };
      break;
    case 256:
      colors = {
        background: '#edcc61',
        textColor: '#f9f6f2',
      };
      break;
    case 512:
      colors = {
        background: '#edc850',
        textColor: '#f9f6f2',
      };
      break;
    case 1024:
      colors = {
        background: '#edc53f',
        textColor: '#f9f6f2',
      };
      break;
    case 2048:
      colors = {
        background: '#edc22e',
        textColor: '#f9f6f2',
      };
  }

  return colors;
}
