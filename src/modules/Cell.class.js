'use strict';

class Cell {
  constructor(cellElement, x, y) {
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get tile() {
    return this._tile;
  }

  set tile(value) {
    this._tile = value;

    if (value == null) {
      return;
    }

    this._tile.setXY(this._x, this._y);
  }

  get mergeTile() {
    return this._mergeTile;
  }

  set mergeTile(value) {
    this._mergeTile = value;

    if (value == null) {
      return;
    }
    this._mergeTile.x = this._x;
    this._mergeTile.y = this._y;
  }

  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value === tile.value)
    );
  }

  mergeTiles(updateScoreCallback) {
    if (this.tile == null || this._mergeTile == null) {
      return;
    }
    this.tile.value = this.tile.value + this._mergeTile.value;

    if (updateScoreCallback) {
      updateScoreCallback(this.tile.value);
    }

    this._mergeTile.remove();
    this._mergeTile = null;
  }
}
module.exports = Cell;
