let SCORE = 0;

export class Ceil {
  constructor(gridElement, x, y) {
    const cell = document.createElement("div");
    cell.classList.add('field-cell');
    gridElement.append(cell);
    this.x = x;
    this.y = y;
    this.score = 0;
    this.gameScore = document.querySelector('.game-score');
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

  makeAnEmpty() {
    SCORE = 0;
    this.gameScore.innerHTML = SCORE;
    return this.linkedTile = null;
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
    if (this.linkedTile) {
      const result = this.linkedTile.value + this.linkedTileForMerge.value;
      this.linkedTile.setValue(result);

      this.score += result;

      if (SCORE < this.score) {
        console.log(this.score)
        SCORE = this.score;
        this.gameScore.textContent = SCORE;
      }

      if (result >= 2048) {
        const win = document.querySelector('.message-win');
        win.classList.toggle('hidden');
      }

      this.linkedTileForMerge.removeFromDOM();
      this.unlinkTileForMerge();
    }
  }
}
