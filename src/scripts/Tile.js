export default class Tile {
  constructor(x, y) {
    this.value = Math.random() < 0.9 ? 2 : 4;
    this.tileHTML = document.createElement('div');

    this.position = {
      row: x,
      cell: y,
      indexArr: x * 4 + y,
    };
  }

  setNewPosition(rowIndex, cellIndex) {
    this.position = {
      row: rowIndex,
      cell: cellIndex,
      indexArr: rowIndex * 4 + cellIndex,
    };
  };

  merge(tile) {
    this.value += tile.value;
    tile.setNewPosition(this.position.row, this.position.cell);
    this.tileHTML.style.zIndex = '2';
    tile.tileHTML.style.zIndex = '1';
    tile.render();
    setTimeout(() => tile.tileHTML.remove(), 300);
  }

  render() {
    const allTd = document.querySelectorAll('.field-cell');

    this.tileHTML.textContent = `${this.value}`;
    this.tileHTML.className = `tile tile--${this.value}`;

    // eslint-disable-next-line no-shadow
    const { top, left } = allTd[this.position.indexArr]
      .getBoundingClientRect();

    this.tileHTML.style.top = `${top}px`;
    this.tileHTML.style.left = `${left}px`;
  }

  addTileToView() {
    const containerTile = document.querySelector('.tile-container');

    containerTile.append(this.tileHTML);
  }
}
