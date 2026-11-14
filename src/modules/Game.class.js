'use strict';

const BOARD_SIZE = 4;
const WINNING_VALUE = 2048;
const EMPTY_BOARD = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

class Game {
  constructor(initialState = EMPTY_BOARD) {
    this.initialState = initialState.map((row) => [...row]);
    this.state = initialState.map((row) => [...row]);
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
    return this.move('left');
  }

  moveRight() {
    return this.move('right');
  }

  moveUp() {
    return this.move('up');
  }

  moveDown() {
    return this.move('down');
  }

  move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const isVertical = direction === 'up' || direction === 'down';
    const isReversed = direction === 'right' || direction === 'down';
    const nextState = this.getState();

    for (let lineIndex = 0; lineIndex < BOARD_SIZE; lineIndex++) {
      const line = isVertical
        ? this.state.map((row) => row[lineIndex])
        : [...this.state[lineIndex]];

      if (isReversed) {
        line.reverse();
      }

      const mergedLine = this.mergeLine(line);

      if (isReversed) {
        mergedLine.reverse();
      }

      for (let cellIndex = 0; cellIndex < BOARD_SIZE; cellIndex++) {
        if (isVertical) {
          nextState[cellIndex][lineIndex] = mergedLine[cellIndex];
        } else {
          nextState[lineIndex][cellIndex] = mergedLine[cellIndex];
        }
      }
    }

    const hasChanged = nextState.some((row, rowIndex) => {
      const oldRow = this.state[rowIndex];

      return row.some((value, columnIndex) => value !== oldRow[columnIndex]);
    });

    if (!hasChanged) {
      this.updateStatus();

      return false;
    }

    this.state = nextState;
    this.addRandomTile();
    this.updateStatus();

    return true;
  }

  mergeLine(line) {
    const numbers = line.filter((value) => value !== 0);
    const merged = [];

    for (let index = 0; index < numbers.length; index++) {
      if (numbers[index] === numbers[index + 1]) {
        const mergedValue = numbers[index] * 2;

        merged.push(mergedValue);
        this.score += mergedValue;
        index++;
      } else {
        merged.push(numbers[index]);
      }
    }

    while (merged.length < BOARD_SIZE) {
      merged.push(0);
    }

    return merged;
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((value, columnIndex) => {
        if (value === 0) {
          emptyCells.push([rowIndex, columnIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [selectedRow, selectedColumn] = emptyCells[randomIndex];

    this.state[selectedRow][selectedColumn] = Math.random() < 0.9 ? 2 : 4;
  }

  hasAvailableMoves() {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let column = 0; column < BOARD_SIZE; column++) {
        const value = this.state[row][column];

        if (value === 0) {
          return true;
        }

        if (column < BOARD_SIZE - 1 && value === this.state[row][column + 1]) {
          return true;
        }

        if (row < BOARD_SIZE - 1 && value === this.state[row + 1][column]) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    const values = this.state.flat();
    const hasWinningTile = values.some((value) => value >= WINNING_VALUE);

    if (hasWinningTile) {
      this.status = 'win';
    } else if (!this.hasAvailableMoves()) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }
  }
}

module.exports = Game;
