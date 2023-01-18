export class Tile {
  constructor(coords, value, isMerged, isNew) {
    this.value = value;
    this.htmlTileElement = undefined;

    this.isNew = isNew;
    this.isMerged = isMerged;

    this.coords = {
      row: coords.row,
      cell: coords.cell,
      index: coords.index,
    };
  }

  setTileHtmlElement(htmlElement) {
    this.htmlTileElement = htmlElement;
  }

  setTileCoords(row, cell, size) {
    this.coords = {
      row: row,
      cell: cell,
      index: cell + row * size,
    };
  };

  insertTileToView(container) {
    container.append(this.htmlTileElement);
  }

  removeTileFromView() {
    setTimeout(() => {
      this.htmlTileElement.remove();
    }, 200);
  }
}
