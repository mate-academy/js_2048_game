'use strict';

export class Cell {
  constructor(gridElement, x, y) {
    const cell = document.createElement('div');

    cell.classList.add('field-cell');
    gridElement.append(cell);
    this.x = x;
    this.y = y;
  }

  linkTile(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTile = tile;
  }

  unlinkTile() {
    this.linkedTile = null;
  }

  linkTileForMerge(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTileForMerge = tile;
  }

  unlinkTileForMerge() {
    this.linkedTileForMerge = null;
  }

  isEmpty() {
    return !this.linkedTile;
  }

  canAccept(newTile) {
    return (
      this.isEmpty() ||
      (!this.hasTileForMerge() && this.linkedTile.value === newTile.value)
    );
  }

  hasTileForMerge() {
    return !!this.linkedTileForMerge;
  }

  mergeTiles() {
    const res = this.linkedTile.value * 2;

    this.linkedTile.setValue(res);
    this.linkedTileForMerge.removeFromField();
    this.unlinkTileForMerge();

    return res;
  }
}
