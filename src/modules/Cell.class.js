export class Cell {
  constructor(gridElement, x, y) {
    const emptyCell = document.createElement('div');

    emptyCell.classList.add('empty-cell');
    gridElement.append(emptyCell);
    this.x = x;
    this.y = y;
    this.element = emptyCell;
    this.linkedTile = null;
  }

  linkTile(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTile = tile;
  }

  unlinkedTile() {
    this.linkedTile = null;
  }

  isEmpty() {
    return !this.linkedTile;
  }

  linkTileForMerge(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTileForMerge = tile;
  }

  unlinkTileForMerge() {
    this.linkedTileForMerge = null;
  }

  hasTileForMerge() {
    return !!this.linkedTileForMerge;
  }

  canAccept(newTile) {
    return (
      this.isEmpty() ||
      (!this.hasTileForMerge() && this.linkedTile.value === newTile.value)
    );
  }

  mergeTiles() {
    this.linkedTile.setValue(
      this.linkedTile.value + this.linkedTileForMerge.value,
    );
    this.linkedTileForMerge.remove();
    this.unlinkTileForMerge();
  }
}
