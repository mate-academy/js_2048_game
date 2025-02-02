'use strict';

const INIT_STATE = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];
const BOARD_SIZE = 4;
const CELL_PROBABILITY = 0.9;
const WIN_CELL = 2048;

class Game {
  score = 0;
  status = 'idle';

  constructor(initialState = INIT_STATE) {
    this.initialState = initialState;
    this.state = this.copyState(this.initialState);
  }

  // CONTROL METHODS

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomCell();
    }
  }

  restart() {
    this.state = this.copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.handleMove('left');
  }

  moveRight() {
    this.handleMove('right');
  }

  moveUp() {
    this.handleMove('up');
  }

  moveDown() {
    this.handleMove('down');
  }

  // MAIN METHODS
  handleMove(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const moved = this.slide(direction);

    if (moved) {
      this.addRandomCell();
      this.updateGameStatus();
    }
  }

  slide(direction) {
    const originalState = this.copyState(this.state);

    switch (direction) {
      case 'left':
        this.state = this.slideLeft(this.state);
        break;

      case 'right':
        this.state = this.slideRight(this.state);
        break;

      case 'up':
        this.state = this.transpose(this.slideLeft(this.transpose(this.state)));
        break;

      case 'down':
        this.state = this.transpose(
          this.slideRight(this.transpose(this.state)),
        );
        break;
    }

    return !this.areStatesChanged(this.state, originalState);
  }

  slideLeft(state) {
    return state.map((row) => this.proccessRow(row, false));
  }

  slideRight(state) {
    return state.map((row) => this.proccessRow(row, true));
  }

  proccessRow(row, isReversed) {
    const filteredRow = isReversed ? [...row].reverse() : row;
    const nonZeroCells = filteredRow.filter((n) => n !== 0);
    const mergedRow = this.mergeCells(nonZeroCells);

    while (mergedRow.length < BOARD_SIZE) {
      mergedRow.push(0);
    }

    return isReversed ? [...mergedRow].reverse() : mergedRow;
  }

  mergeCells(row) {
    for (let i = 0; i < row.length - 1; i++) {
      let curCell = row[i];
      let nextCell = row[i + 1];

      if (curCell === nextCell) {
        curCell *= 2;
        nextCell = 0;
        this.score += curCell;
      }
    }

    return row.filter((cell) => cell !== 0);
  }

  addRandomCell() {
    const emptyCells = this.findEmptyCell();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    this.state[row][col] = Math.random() < CELL_PROBABILITY ? 2 : 4;
  }

  findEmptyCell() {
    const emptyCells = [];

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    return emptyCells;
  }

  isGameOver() {
    const hasEmptyCells = this.state.some((row) => row.includes(0));

    const canMergeCells = this.state.some((row, rowIndex) => {
      return row.some((cell, cellIndex) => {
        const rightNeighbor = row[cellIndex + 1];
        const downNeighbor = this.state[rowIndex + 1][cellIndex];
        const maxCellIndex = cellIndex < BOARD_SIZE - 1;
        const maxRowIndex = rowIndex < BOARD_SIZE - 1;

        if (cell === 0) {
          return false;
        }

        if (maxCellIndex && cell === rightNeighbor) {
          return true;
        }

        if (maxRowIndex && cell === downNeighbor) {
          return true;
        }

        return false;
      });
    });

    return !hasEmptyCells && !canMergeCells;
  }

  hasWinCell() {
    return this.state.some((row) => row.includes(WIN_CELL));
  }

  updateGameStatus() {
    if (this.hasWinCell()) {
      this.status = 'win';
    } else if (this.isGameOver()) {
      this.status = 'lose';
    }
  }

  // UTILYTY METHODS

  copyState(state) {
    return state.map((row) => [...row]);
  }

  transpose(state) {
    return state[0].map((_, colIndex) => state.map((row) => row[colIndex]));
  }

  areStatesChanged(state1, state2) {
    return state1.every((row, rowIndex) => {
      return row.every(
        (cell, cellIndex) => cell === state2[rowIndex][cellIndex],
      );
    });
  }
}

module.exports = Game;
