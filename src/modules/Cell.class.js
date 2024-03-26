'use strict';

class Cell {
  constructor(field, x, y) {
    const cell = document.createElement('div');

    cell.classList.add('field__cell');
    field.append(cell);
    this.x = x;
    this.y = y;
    cell.id = (`${this.y}-${this.x}`);
  }
}

module.exports = Cell;
