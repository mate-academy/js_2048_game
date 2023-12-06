export class Cell {
  constructor(gridElement, x, y) {
    const cell = document.createElement('div');

    cell.classList.add('cell');
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
    if (this.linkedTile.value === 2048) {
      const winMessage = document.querySelector('.message_win');

      winMessage.classList.remove('hidden');
      winMessage.style.color = '#00ff00';
    } else {
      const mergeValue = this.linkedTile.value + this.linkedTileForMerge.value;

      this.linkedTile.setValue(mergeValue);
      this.linkedTileForMerge.removeFromDOM();
      this.unlinkTileForMerge();
    }
  }
}
