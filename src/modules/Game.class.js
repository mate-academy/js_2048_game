'use strict';

class Game {
  /**
   * @param {number[][]} [initialState]
   */
  constructor(initialState) {
    this.initialState = initialState;
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'

    if (initialState) {
      this.board = initialState.map((row) => [...row]);
    } else {
      this.board = this.createEmptyBoard();
    }
  }

  createEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.restart();
  }

  restart() {
    this.score = 0;
    this.status = 'playing';

    if (this.initialState) {
      this.board = this.initialState.map((row) => [...row]);
    } else {
      this.board = this.createEmptyBoard();
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { r, c } = emptyCells[randomIndex];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[r][c] = value;
  }

  slideAndMergeRow(row) {
    const nonZero = row.filter((val) => val !== 0);
    const newRow = [];
    let scoreGained = 0;
    let i = 0;

    while (i < nonZero.length) {
      if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
        const mergedValue = nonZero[i] * 2;

        newRow.push(mergedValue);
        scoreGained += mergedValue;
        i += 2;
      } else {
        newRow.push(nonZero[i]);
        i += 1;
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return { newRow, scoreGained };
  }

  moveLeft() {
    if (this.status !== 'playing' && this.status !== 'idle') {
      return false;
    }

    let changed = false;
    let turnScore = 0;
    const newBoard = [];

    for (let r = 0; r < 4; r++) {
      const { newRow, scoreGained } = this.slideAndMergeRow(this.board[r]);

      newBoard.push(newRow);
      turnScore += scoreGained;

      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] !== newRow[c]) {
          changed = true;
        }
      }
    }

    if (!changed) {
      return false;
    }

    this.board = newBoard;
    this.score += turnScore;
    this.status = 'playing';
    this.addRandomTile();
    this.updateStatus();

    return true;
  }

  moveRight() {
    this.reverseRows();

    const moved = this.moveLeft();

    this.reverseRows();

    return moved;
  }

  moveUp() {
    this.transpose();

    const moved = this.moveLeft();

    this.transpose();

    return moved;
  }

  moveDown() {
    this.transpose();
    this.reverseRows();

    const moved = this.moveLeft();

    this.reverseRows();
    this.transpose();

    return moved;
  }

  reverseRows() {
    for (let r = 0; r < 4; r++) {
      this.board[r].reverse();
    }
  }

  transpose() {
    const nextBoard = this.createEmptyBoard();

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        nextBoard[c][r] = this.board[r][c];
      }
    }

    this.board = nextBoard;
  }

  hasWon() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  canMakeMove() {
    if (this.getEmptyCells().length > 0) {
      return true;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.board[r][c];

        if (c + 1 < 4 && current === this.board[r][c + 1]) {
          return true;
        }

        if (r + 1 < 4 && current === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    if (this.hasWon()) {
      this.status = 'win';
    } else if (!this.canMakeMove()) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
