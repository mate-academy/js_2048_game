export class Tile {
  constructor(coords) {
    this.value = Math.random() < 0.9 ? 2 : 4;

    this.coords = {
      row: coords.row,
      cell: coords.cell,
      index: coords.index,
    };

    this.htmlElement = undefined;
  }

  setHtmlElement(htmlNode) {
    this.htmlElement = htmlNode;
  }

  addTileToPage(tileContainer) {
    tileContainer.append(this.htmlElement);
  }

  removeHtmlElement() {
    this.htmlElement.remove();
  }

  setNewCoords(row, cell) {
    this.coords = {
      row: row,
      cell: cell,
      index: cell + row * 4,
    };
  }
}
