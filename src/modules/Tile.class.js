'use strict';

class Tile {
  constructor(tileValue, position) {
    this.tileValue = tileValue; // number
    this.position = position; // [number, number]
    this.moveTo = []; // [number, number]
    this.ref = null;
    this.isNew = true; // flag to correctly spawn tile
  }

  get value() {
    return this.tileValue;
  }

  set value(value) {
    this.tileValue = value;
  }

  valueOf() {
    return this.tileValue;
  }
}

module.exports = Tile;
