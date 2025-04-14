'use strict';
import { Cell } from './Cell.js';

const GRID_SIZE = 4;

export class Grid {
  constructor(gtidElement) {
    this.cells = [];

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      this.cells.push(
        new Cell(gtidElement, i % GRID_SIZE, Math.floor(i / GRID_SIZE)),
      );
    }

    this.cellsGroupedByColumn = this.groupCellsByColumn();
    this.cellsGroupedByRow = this.groupCellsByRow();

    this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map(
      (column) => [...column].reverse(),
    );

    this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map((row) => {
      return [...row].reverse();
    });
  }

  getRandomEmptyCell() {
    const emptyCells = this.cells.filter((cell) => cell.isEmpty());
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }

  groupCellsByColumn() {
    return this.cells.reduce((gruopedCells, cell) => {
      gruopedCells[cell.x] = gruopedCells[cell.x] || [];
      gruopedCells[cell.x][cell.y] = cell;

      return gruopedCells;
    }, []);
  }

  groupCellsByRow() {
    return this.cells.reduce((gruopedCells, cell) => {
      gruopedCells[cell.y] = gruopedCells[cell.y] || [];
      gruopedCells[cell.y][cell.x] = cell;

      return gruopedCells;
    }, []);
  }
}
