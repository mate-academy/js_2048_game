'use strict';

class Cell {
  constructor(element) {
    this.isEmpty = true;
    this.value = 0;
    this.element = element;
  }

  setValue(value) {
    if (!this.isEmpty) {
      this.element.classList.remove('field-cell--' + this.value);
    }
    this.isEmpty = false;
    this.element.classList.add('field-cell--' + value);
    this.value = value;
    this.element.textContent = value;
  }

  clear() {
    this.isEmpty = true;
    this.element.classList.remove('field-cell--' + this.value);
    this.value = 0;
    this.element.textContent = '';
  }
}

module.exports = Cell;
