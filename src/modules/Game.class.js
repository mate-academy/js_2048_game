'use strict';

const {
  STATUS_IDLE,
  STATUS_PLAYING,
  STATUS_WIN,
  STATUS_LOSE,
  Direction,
} = require('./constants');

class Game {
  constructor(initialState = null) {
    this.initialState = initialState || this.createEmptyBoard();
    this.state = this.initialState;
    this.score = 0;
    this.status = STATUS_IDLE;
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  start() {
    this.state = this.initialState.map((row) => [...row]);
    this.status = STATUS_PLAYING;
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.status = STATUS_IDLE;
    this.score = 0;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((r, rowIndex) => {
      r.forEach((c, colIndex) => {
        if (c === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    const newTileValue = Math.random() < 0.9 ? 2 : 4;

    this.state[row][col] = newTileValue;
  }

  slideLeft(row) {
    const nonZeroRow = row.filter((cell) => cell !== 0);
    const mergedRow = [];

    for (let i = 0; i < nonZeroRow.length; i++) {
      const currentValue = nonZeroRow[i];

      if (i < nonZeroRow.length - 1 && nonZeroRow[i] === nonZeroRow[i + 1]) {
        const newValue = currentValue * 2;

        if (newValue === 2048) {
          this.status = STATUS_WIN;
        }

        mergedRow.push(newValue);
        nonZeroRow[i + 1] = 0;
        i++;
        this.score += newValue;
      } else {
        mergedRow.push(currentValue);
      }
    }

    return [...mergedRow, ...Array(row.length - mergedRow.length).fill(0)];
  }

  canMove() {
    let canMove = false;

    for (let r = 0; r < this.state.length; r++) {
      for (let c = 0; c < this.state[r].length; c++) {
        if (this.state[r][c] === 0) {
          canMove = true;
        }

        if (
          (c < this.state[r].length - 1 &&
            this.state[r][c] === this.state[r][c + 1]) ||
          (r < this.state.length - 1 &&
            this.state[r][c] === this.state[r + 1][c])
        ) {
          canMove = true;
        }
      }
    }

    if (!canMove) {
      this.status = STATUS_LOSE;
    }

    return canMove;
  }

  transpose(grid) {
    return grid[0].map((_, index) => grid.map((row) => row[index]));
  }

  reverseRows(grid) {
    return grid.map((row) => row.reverse());
  }

  handleMovement(transpose, reverse) {
    let newState = this.state.map((row) => [...row]);

    if (transpose) {
      newState = this.transpose(newState);
    }

    if (reverse) {
      newState = this.reverseRows(newState);
    }

    newState = newState.map((row) => this.slideLeft(row));

    if (reverse) {
      newState = this.reverseRows(newState);
    }

    if (transpose) {
      newState = this.transpose(newState);
    }

    return newState;
  }

  move(direction) {
    if (this.status !== STATUS_PLAYING) {
      return;
    }

    const prevState = JSON.stringify(this.state);

    switch (direction) {
      case Direction.UP:
        this.state = this.handleMovement(true, false);
        break;
      case Direction.DOWN:
        this.state = this.handleMovement(true, true);
        break;
      case Direction.LEFT:
        this.state = this.handleMovement(false, false);
        break;
      case Direction.RIGHT:
        this.state = this.handleMovement(false, true);
        break;
    }

    if (prevState !== JSON.stringify(this.state)) {
      this.addRandomTile();
    }

    if (!this.canMove()) {
      this.status = STATUS_LOSE;
    }
  }

  moveLeft() {
    this.move(Direction.LEFT);
  }

  moveRight() {
    this.move(Direction.RIGHT);
  }

  moveUp() {
    this.move(Direction.UP);
  }

  moveDown() {
    this.move(Direction.DOWN);
  }
}

module.exports = Game;
