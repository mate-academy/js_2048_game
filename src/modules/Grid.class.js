'use strict';
// import { Cell} from "./Cell.class";

const Cell = require('./Cell.class');

const GRID_SIZE = 4;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;

class Grid {
  constructor(field) {
    this.cells = [];

    for (let i = 0; i < CELL_COUNT; i++) {
      this.cells.push(
        new Cell(field, i % GRID_SIZE, Math.floor(i / GRID_SIZE))
      );
    }
    this.size = GRID_SIZE;
  }

  initializeBoard() {
    const board = [];

    for (let i = 0; i < 4; i++) {
      board.push(Array(4).fill(0));
    }

    return board;
  }
}

module.exports = Grid;
