'use strict';

const BOARD_SIZE = 4;
const EMPTY_STATE = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

class Game {
  constructor(initialState = EMPTY_STATE) {
    this.initialState = initialState.map((row) => [...row]);
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.updateStatus();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const nextState = this.getState();
    let scoreIncrease = 0;

    for (let line = 0; line < BOARD_SIZE; line++) {
      const positions = this.getLinePositions(direction, line);
      const values = positions
        .map(({ row, column }) => this.state[row][column])
        .filter(Boolean);
      const mergedValues = [];

      for (let index = 0; index < values.length; index++) {
        if (values[index] === values[index + 1]) {
          const mergedValue = values[index] * 2;

          mergedValues.push(mergedValue);
          scoreIncrease += mergedValue;
          index++;
        } else {
          mergedValues.push(values[index]);
        }
      }

      positions.forEach(({ row, column }, index) => {
        nextState[row][column] = mergedValues[index] || 0;
      });
    }

    let changed = false;

    for (let row = 0; row < BOARD_SIZE && !changed; row++) {
      for (let column = 0; column < BOARD_SIZE; column++) {
        if (nextState[row][column] !== this.state[row][column]) {
          changed = true;
          break;
        }
      }
    }

    if (!changed) {
      return;
    }

    this.state = nextState;
    this.score += scoreIncrease;
    this.addRandomTile();
    this.updateStatus();
  }

  getLinePositions(direction, line) {
    return Array.from({ length: BOARD_SIZE }, (_, index) => {
      switch (direction) {
        case 'left':
          return { row: line, column: index };
        case 'right':
          return { row: line, column: BOARD_SIZE - 1 - index };
        case 'up':
          return { row: index, column: line };
        case 'down':
          return { row: BOARD_SIZE - 1 - index, column: line };
        default:
          return { row: line, column: index };
      }
    });
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cellValue, columnIndex) => {
        if (cellValue === 0) {
          emptyCells.push({ row: rowIndex, column: columnIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const position = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const tileValue = Math.random() < 0.1 ? 4 : 2;

    this.state[position.row][position.column] = tileValue;
  }

  updateStatus() {
    let hasEmptyCell = false;
    let hasAvailableMerge = false;

    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let column = 0; column < BOARD_SIZE; column++) {
        const value = this.state[row][column];

        if (value >= 2048) {
          this.status = 'win';

          return;
        }

        if (value === 0) {
          hasEmptyCell = true;
        }

        const hasHorizontalMerge =
          column < BOARD_SIZE - 1 &&
          value !== 0 &&
          value === this.state[row][column + 1];
        const hasVerticalMerge =
          row < BOARD_SIZE - 1 &&
          value !== 0 &&
          value === this.state[row + 1][column];

        if (hasHorizontalMerge || hasVerticalMerge) {
          hasAvailableMerge = true;
        }
      }
    }

    if (!hasEmptyCell && !hasAvailableMerge) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
