'use strict';

class Tile {
  constructor(value, row, col) {
    this.value = value;
    this.row = row;
    this.col = col;
    this.id = Date.now() + Math.random();
    this.previousPosition = null;
    this.mergedFrom = null;
    this.isNew = true;
  }

  savePosition() {
    this.previousPosition = { row: this.row, col: this.col };
    this.isNew = false;
  }

  updatePosition(row, col) {
    this.row = row;
    this.col = col;
  }
}

module.exports = Tile;
