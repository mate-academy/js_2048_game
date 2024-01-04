'use strict';

class Block {
  constructor(
    blockContainer,
    value = Math.random() < 0.1 ? 4 : 2
  ) {
    this.blockElement = document.createElement('div');
    this.blockElement.classList.add('block');
    blockContainer.append(this.blockElement);
    this.value = value;
  }

  get value() {
    return this._value;
  }

  set value(newValue) {
    this._value = newValue;
    this.blockElement.textContent = newValue;

    for (const className of this.blockElement.classList) {
      if (className.includes('block--')) {
        this.blockElement.classList.remove(className);
      }
    }
    this.blockElement.classList.add(`block--${newValue}`);
  }

  set x(value) {
    this._x = value;
    this.blockElement.style.setProperty('--x', value);
  }

  set y(value) {
    this._y = value;
    this.blockElement.style.setProperty('--y', value);
  }
}

module.exports = { Block };
