import { Cell } from './cell';

const GAME_FIELD_SIZE = 4;
const CELLS_COUNT = GAME_FIELD_SIZE * GAME_FIELD_SIZE;

export class Game {
  constructor(gameElement) {
    this.cells = [];
    this.score = Cell.getScore();

    for (let i = 0; i < CELLS_COUNT; i++) {
      this.cells.push(
        new Cell(
          gameElement,
          i % GAME_FIELD_SIZE,
          Math.floor(i / GAME_FIELD_SIZE),
        ),
      );
    }

    this.cellsGroupedByColumn = this.groupCellsByColumn();

    this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map(
      (column) => [...column].reverse(),
    );

    this.cellsGroupedByRow = this.groupCellsByRow();

    // eslint-disable-next-line prettier/prettier
    this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map((row) =>
      // eslint-disable-next-line comma-dangle, prettier/prettier
      [...row].reverse(),);
  }

  getScore() {
    this.score = Cell.getScore();
  }

  getRandomEmptyCell() {
    const emptyCells = this.cells.filter((cell) => cell.isEmpty());
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

  resetScore() {
    this.cells[0].resetScore();
  }
}
