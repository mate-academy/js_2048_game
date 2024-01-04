'use strict';

const GRID_SIZE = 4;

class Field {
  constructor(fieldElement) {
    this.cells = createCellElements(fieldElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE)
      );
    });
  }

  get cellsByColumns() {
    return this.cells.reduce((gridColumns, cell) => {
      gridColumns[cell.x] = gridColumns[cell.x] || [];
      gridColumns[cell.x][cell.y] = cell;

      return gridColumns;
    }, []);
  }

  get cellsByRows() {
    return this.cells.reduce((gridRows, cell) => {
      gridRows[cell.y] = gridRows[cell.y] || [];
      gridRows[cell.y][cell.x] = cell;

      return gridRows;
    }, []);
  }

  get randomEmptyCell() {
    const emptyCells = this.cells.filter(cell => cell.block === null);
    const random = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[random];
  }
};

class Cell {
  constructor(cellElement, x, y) {
    this.cellElement = cellElement;
    this.x = x;
    this.y = y;
    this.cellElement.style.setProperty('--x', x);
    this.cellElement.style.setProperty('--y', y);
    this.block = null;
    this.mergeBlock = null;
  }

  get block() {
    return this._block;
  }

  set block(value) {
    this._block = value;

    if (value !== null) {
      this._block.x = this.x;
      this._block.y = this.y;
    }
  }

  get mergeBlock() {
    return this._mergeBlock;
  }

  set mergeBlock(newMergeBlock) {
    this._mergeBlock = newMergeBlock;

    if (newMergeBlock !== null) {
      this._mergeBlock.x = this.x;
      this._mergeBlock.y = this.y;
    }
  }

  canAccept(block) {
    return this.block === null
      || (this.mergeBlock === null && this.block.value === block.value);
  }

  mergeBlocks() {
    if (this.block !== null && this.mergeBlock !== null) {
      this.block.value = this.block.value + this.mergeBlock.value;
      this.mergeBlock.blockElement.remove();
      this.mergeBlock = null;

      return this.block.value;
    }
  }
}

function createCellElements(fieldElement) {
  const cells = [];

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement('div');

    cell.classList.add('cell');
    cells.push(cell);
    fieldElement.append(cell);
  }

  return cells;
}

module.exports = { Field };
