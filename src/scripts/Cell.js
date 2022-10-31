export default class Cell {
  constructor(cellElement, x, y) {
    this.cellElement = cellElement;
    this.x = x;
    this.y = y;
  }

  get tile() {
    return this._tile;
  }

  set tile(val) {
    this._tile = val;

    if (!val) {
      return;
    }
    this._tile.x = this.x;
    this._tile.y = this.y;
  }

  get mergeTile() {
    return this._mergeTile;
  }

  set mergeTile(value) {
    this._mergeTile = value;

    if (!value) {
      return;
    }
    this._mergeTile.x = this.x;
    this._mergeTile.y = this.y;
  }

  canAccept(tile) {
    return (
      !this._tile || (!this._mergeTile && this._tile.value === tile.value)
    );
  }

  mergeTiles() {
    if (!this._tile || !this._mergeTile) {
      return;
    }
    this._tile.value = this._tile.value + this._mergeTile.value;
    this._mergeTile.remove();
    this._mergeTile = null;
  }
}
