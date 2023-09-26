const score = document.querySelector('.game_score');
let scoreValue = 0;

export class Cell {
  constructor(gridElement, x, y) {
    const cell = document.createElement('div');

    cell.classList.add('field_cell');
    gridElement.append(cell);
    this.x = x;
    this.y = y;
  }

  restartScore() {
    scoreValue = 0;
    score.innerHTML = scoreValue;
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
    return this.isEmpty()
    || (!this.hasTileForMerge() && this.linkedTile.value === newTile.value);
  }

  mergeTiles() {
    this.linkedTile.setValue(this.linkedTile.value * 2);
    scoreValue += this.linkedTile.value;
    score.innerHTML = scoreValue;
    this.linkedTileForMerge.removeFromDOM();
    this.unlinkTileForMerge();
  }
}
