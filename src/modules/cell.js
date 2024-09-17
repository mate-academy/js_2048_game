export class Cell {
  constructor(gameElement, x, y) {
    const cell = document.createElement('div');

    cell.classList.add('game-board__cell');
    gameElement.append(cell);
    this.x = x;
    this.y = y;
  }

  static getScore() {
    return gameScore;
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
    return (
      this.isEmpty() ||
      (!this.hasTileForMerge() && this.linkedTile.value === newTile.value)
    );
  }

  mergeTiles() {
    this.linkedTile.setValue(this.linkedTile.value + this.linkedTile.value);
    gameScore += this.linkedTile.value;
    this.linkedTileForMerge.removeFromDOM();
    this.unlinkTileForMerge();
    displayScore();
  }

  resetScore() {
    gameScore = 0;

    displayScore();
  }
}

let gameScore = 0;
const scoreDisplay = document.querySelector('.game-score');

function displayScore() {
  scoreDisplay.textContent = `${gameScore}`;
}
