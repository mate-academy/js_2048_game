'use strict';

export class Tile {
  static START_INDEX_OF_ROW = 0;
  static START_INDEX_OF_COLUMN = 2;
  static END_INDEX_OF_ROW = 1;
  static END_INDEX_OF_COLUMN = 3;

  constructor(cell, domElement) {
    const numColumn = cell.coordColumn;
    const numRow = cell.coordRow;
    const valueTile = cell.value;

    this.elementTile = document.createElement('div');

    this.elementTile.id = numRow + '-' + numColumn;

    this.elementTile.classList.add('tile');
    this.elementTile.classList.add(`tile--row--${numRow}`);
    this.elementTile.classList.add(`tile--column--${numColumn}`);
    this.elementTile.textContent = valueTile;
    this.elementTile.classList.add(`tile--${valueTile}`);

    domElement.append(this.elementTile);
  }

  static getNumberOfRow(elem) {
    return elem.id.slice(this.START_INDEX_OF_ROW, this.END_INDEX_OF_ROW);
  }

  static getNumberOfColumn(elem) {
    return elem.id.slice(this.START_INDEX_OF_COLUMN, this.END_INDEX_OF_COLUMN);
  }

  static getNumberOfCell(elem) {
    return this.getNumberOfRow(elem) * 4 + this.getNumberOfColumn(elem);
  }

  static getNumberOfLine(elem, start, end) {
    return elem.id.slice(start, end);
  }

  static setTransitionEnd(elem, resolve) {
    elem.addEventListener('transitionend', resolve, { once: true });
  }
}
