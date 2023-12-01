export class Cell {
  constructor(gridElement, x, y, grid) {
    const cell = document.createElement('div');

    cell.classList.add('field-cell');
    gridElement.append(cell);
    this.x = x;
    this.y = y;
    this.grid = grid;
  }

  linkTile(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTile = tile;
  }

  unlinkTile() {
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
    return this.isEmpty() || (!this.hasTileForMerge() && this.linkedTile.value === newTile.value)
  }

  mergeTiles() {
    const mergedValue = this.linkedTile.value + this.linkedTileForMerge.value;
    this.linkedTile.setValue(mergedValue);

    this.linkedTileForMerge.removeFromDOM();
    this.unlinkTileForMerge();

    const score = mergedValue;
    this.grid.updateTotalScore(score);

    return this.score += score;
  }
}
