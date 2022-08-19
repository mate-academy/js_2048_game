'use strict';

class Cell {
  constructor(element, value) {
    this._element = element;
    this._value = value || 0;
  }

  get value() {
    return this._value;
  }

  set value(number) {
    this._value = number;
    this._element.innerText = number || ''; // ignore zero

    this._element.className = this._element.className
      .replace(/( ?field__cell--\d+)/, '');
    this._element.classList.add(`field__cell--${number}`);
  }
}

module.exports = Cell;
