'use strict';

const {
  DEFAULT_INITIAL_STATE,
  GAME_STATUS,
  MOVE,
  makeDeepClone,
} = require('./util');
const WIN_SCORE = 2048;

class Game {
  status = GAME_STATUS.idle;
  score = 0;

  constructor(initialState = DEFAULT_INITIAL_STATE) {
    this.initialState = initialState;
    this.board = makeDeepClone(initialState);
  }

  start() {
    this.status = GAME_STATUS.playing;
    this.addRandomTile();
    this.addRandomTile();
  }

  moveDown() {
    this.move(MOVE.down);
  }

  moveUp() {
    this.move(MOVE.up);
  }

  moveRight() {
    this.move(MOVE.right);
  }

  moveLeft() {
    this.move(MOVE.left);
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  restart() {
    this.board = makeDeepClone(this.initialState);
    this.status = GAME_STATUS.idle;
    this.score = 0;
  }

  move(direction) {
    const oldBoard = JSON.stringify(this.board);

    if (this.status !== GAME_STATUS.playing) {
      return;
    }

    if ([MOVE.up, MOVE.down].includes(direction)) {
      for (let col = 0; col < 4; col++) {
        let column =
          direction === MOVE.up
            ? this.board.map((row) => row[col])
            : this.board.map((row) => row[col]).reverse();

        column =
          direction === MOVE.up
            ? this.combineTiles(column)
            : this.combineTiles(column).reverse();

        for (let row = 0; row < 4; row++) {
          this.board[row][col] = column[row];
        }
      }
    } else if ([MOVE.left, MOVE.right].includes(direction)) {
      for (let row = 0; row < 4; row++) {
        if (direction === MOVE.left) {
          this.board[row] = this.combineTiles(this.board[row]);
        } else {
          this.board[row] = this.combineTiles(
            this.board[row].reverse(),
          ).reverse();
        }
      }
    }

    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    this.endGame();
  }

  combineTiles(row) {
    let newRow = row.filter((val) => val !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
      }
    }

    newRow = newRow.filter((val) => val !== 0);

    return newRow.concat(Array(4 - newRow.length).fill(0));
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (!emptyCells.length) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  endGame() {
    let gameOver = true;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] >= WIN_SCORE) {
          this.status = GAME_STATUS.win;
        }

        if (
          (row < 3 && this.board[row][col] === this.board[row + 1][col]) ||
          (col < 3 && this.board[row][col] === this.board[row][col + 1])
        ) {
          gameOver = false;
        }
      }
    }

    if (!this.getEmptyCells().length && gameOver) {
      this.status = GAME_STATUS.lose;
    }
  }
}

module.exports = Game;
