export class Cell {
  constructor(gameField, x, y) {
    const cell = document.createElement('div');

    cell.classList.add('field-cell');
    gameField.append(cell);

    this.x = x;
    this.y = y;
    this.linkedTile = null;
    this.linkedTileForMerge = null;
  }

  linkTile(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTile = tile;
  }

  linkTileForMerge(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTileForMerge = tile;
  }

  hasTileForMerge() {
    return !!this.linkedTileForMerge;
  }

  isEmpty() {
    return !this.linkedTile;
  }

  unlinkTile() {
    this.linkedTile = null;
  }

  unlinkTileForMerge() {
    this.linkedTileForMerge = null;
  }

  canAccept(newTile) {
    return (
      this.isEmpty() ||
      (!this.hasTileForMerge() && this.linkedTile.value === newTile.value)
    );
  }

  mergeTiles() {
    const newValue = this.linkedTile.value + this.linkedTileForMerge.value;
    const mergedTile = this.linkedTile.tileElement;

    mergedTile.classList.add('merge');

    mergedTile.addEventListener(
      'animationend',
      () => {
        mergedTile.classList.remove('merge');
      },
      { once: true },
    );

    this.linkedTile.setValue(newValue);
    this.linkedTileForMerge.removeFromDom();
    this.unlinkTileForMerge();

    return newValue;
  }
}
