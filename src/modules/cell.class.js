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

  linkTileForMerge(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTileForMerge = tile;
  }

  canAccept(newTile) {
    return (
      !this.linkedTile ||
      (!this.linkedTileForMerge && this.linkedTile.value === newTile.value)
    );
  }

  mergeTiles() {
    const mergedValue = this.linkedTile.value + this.linkedTileForMerge.value;

    this.linkedTile.setValue(mergedValue);

    this.linkedTileForMerge.removeFromDOM();
    this.linkedTileForMerge = null;

    this.grid.updateTotalScore(mergedValue);

    return (this.score += mergedValue);
  }
}
