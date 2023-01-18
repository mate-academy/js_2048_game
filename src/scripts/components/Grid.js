import { Tile } from './Tile';

export class Grid {
  constructor(size, view) {
    this.size = size;
    this.view = view;
    this.changed = false;
    this.maxValue = 0;
    this.addition = 0;
    this.matrix = this.createMatrix(this.size);
  }

  createMatrix(size) {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }, () => null));
  }

  insertTileToGame(
    coords = this.getRandomEmptyCell(),
    value = Math.random() < 0.9 ? 2 : 4,
    isMerged = false,
    isNew = true
  ) {
    const tile = new Tile(coords, value, isMerged, isNew);
    const htmlElement = this.view.createTileElement();

    tile.setTileHtmlElement(htmlElement);

    this.insertTileToGrid(tile);
  };

  insertTileToGrid(tile) {
    tile.insertTileToView(this.view.gameTiles);
    this.matrix[tile.coords.row][tile.coords.cell] = tile;
  };

  removeTileFromGrid(x, y) {
    this.matrix[x][y].removeTileFromView();
    this.matrix[x][y] = null;
  };

  getRandomEmptyCell() {
    const emptyCells = this.getAllEmptyCells();

    if (emptyCells.length) {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
  };

  getAllEmptyCells() {
    const emptyCells = [];

    this.checkEachCell((rowIndex, cellIndex, cell) => {
      if (!(cell instanceof Tile)) {
        emptyCells.push({
          row: rowIndex,
          cell: cellIndex,
          index: cellIndex + rowIndex * this.size,
        });
      }
    });

    return emptyCells;
  };

  checkEachCell(callback) {
    for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
      for (let cellIndex = 0; cellIndex < this.size; cellIndex++) {
        callback(rowIndex, cellIndex, this.matrix[rowIndex][cellIndex]);
      }
    }
  }

  prepareGridBeforeMoving() {
    this.changed = false;
    this.addition = 0;
  }
  prepareTilesBeforeMoving() {
    this.checkEachCell((rowIndex, cellIndex, tile) => {
      if (tile) {
        tile.isNew = false;
        tile.isMerged = false;
      }
    });
  }

  moveTiles(revers = false, changeAxis = false) {
    this.prepareGridBeforeMoving();
    this.prepareTilesBeforeMoving();

    for (let index = 0; index < this.size; index++) {
      const current = revers ? this.size - 1 : 0;
      const next = revers ? current - 1 : 1;
      const increment = revers ? -1 : 1;

      this.movementAlgorithm(current, next, increment, index, changeAxis);
    }
  }

  movementAlgorithm(current, next, increment, index, changeAxis) {
    let currentIndex = current;
    let nextIndex = next;

    while (nextIndex >= 0 && nextIndex < this.size) {
      const x1 = changeAxis ? nextIndex : index;
      const x2 = changeAxis ? currentIndex : index;
      const y1 = changeAxis ? index : nextIndex;
      const y2 = changeAxis ? index : currentIndex;

      if (this.isTileExist(x1, y1)) {
        nextIndex += increment;
      } else {
        if (this.isTileExist(x2, y2)) {
          this.moveTileToNewCoords(x1, x2, y1, y2);
          this.changed = true;
          nextIndex += increment;
        } else if (this.tilesValueEqual(x1, x2, y1, y2)) {
          this.mergerTiles(x1, x2, y1, y2);
          this.changed = true;
          currentIndex += increment;
          nextIndex += increment;
        } else {
          currentIndex += increment;

          if (currentIndex === nextIndex) {
            nextIndex += increment;
          }
        }
      }
    }
  }

  tilesValueEqual(x1, x2, y1, y2) {
    return this.matrix[x2][y2].value === this.matrix[x1][y1].value;
  }

  moveTileToNewCoords(x1, x2, y1, y2) {
    this.matrix[x2][y2] = this.matrix[x1][y1];
    this.matrix[x2][y2].setTileCoords(x2, y2, this.size);
    this.matrix[x1][y1] = null;
  }

  mergerTiles(x1, x2, y1, y2) {
    const { coords, value } = this.matrix[x2][y2];
    const valueAfterMerging = value * 2;

    this.matrix[x1][y1].setTileCoords(x2, y2, this.size);
    this.view.setTilePositionRelativeToCell(this.matrix[x2][y2]);
    this.view.setTilePositionRelativeToCell(this.matrix[x1][y1]);
    this.removeTileFromGrid(x2, y2);
    this.removeTileFromGrid(x1, y1);

    this.insertTileToGame(coords, valueAfterMerging, true, false);
    this.updateMergerInfo(valueAfterMerging);
  }

  updateMergerInfo(value) {
    this.addition += value;

    if (this.maxValue < value) {
      this.maxValue = value;
    }
  }

  isTileExist(x, y) {
    return !this.matrix[x][y];
  }

  matrixWasChanged() {
    return this.changed;
  }

  emptyCellsAvailable() {
    return !!this.getAllEmptyCells().length;
  }

  mergerTilesPossible() {
    return this.matrix.flat().some((tile, i, matrix) => {
      if (tile) {
        const xAxisMergerPossible = matrix[i + 1] && (i + 1) % 4 !== 0
          ? tile.value === matrix[i + 1].value
          : false;

        const yAxisMergerPossible = matrix[i + 4]
          ? tile.value === matrix[i + 4].value
          : false;

        return xAxisMergerPossible || yAxisMergerPossible;
      }
    });
  }

  moveTilesLeft() {
    this.moveTiles();
  };

  moveTilesUp() {
    this.moveTiles(false, true);
  }

  moveTilesRight() {
    this.moveTiles(true);
  }

  moveTilesDown() {
    this.moveTiles(true, true);
  }
}
