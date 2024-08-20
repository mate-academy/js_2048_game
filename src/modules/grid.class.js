import { Cell } from './cell.class.js';

const GRID_SIZE = 4;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;

export class Grid {
  constructor(gridElement) {
    this.cells = [];
    this.totalScore = 0;

    for (let i = 0; i < TOTAL_CELLS; i++) {
      this.cells.push(
        new Cell(gridElement, i % GRID_SIZE, Math.floor(i / GRID_SIZE), this),
      );
    }

    this.cellsByCol = this.groupCellsByColumn();
    this.cellsByReversedCol = this.cellsByCol.map((col) => [...col].reverse());
    this.cellsByRow = this.groupCellsByRow();
    this.cellsByReversedRow = this.cellsByRow.map((row) => [...row].reverse());
  }

  getRandomEmptyCell() {
    const emptyCells = this.cells.filter((cell) => !cell.linkedTile);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }

  groupCellsByColumn() {
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.x] = groupedCells[cell.x] || [];
      groupedCells[cell.x][cell.y] = cell;

      return groupedCells;
    }, []);
  }

  groupCellsByRow() {
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.y] = groupedCells[cell.y] || [];
      groupedCells[cell.y][cell.x] = cell;

      return groupedCells;
    }, []);
  }

  reset() {
    document.querySelectorAll('.field-tile').forEach((tile) => {
      tile.remove();
    });

    this.cells.forEach((cell) => {
      cell.linkedTile = null;
    });
  }

  updateTotalScore(score) {
    this.lastMerge = score;
    this.totalScore += score;
  }
}
