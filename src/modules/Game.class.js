'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
// src/modules/Game.class.js

class Game {
  constructor(initialState = null) {
    this.board = initialState || this._createEmptyBoard();
    this.score = 0;
    this.status = 'pending';
    this.hasMoved = false;
    this.WINSCORE = 2048;
  }

  _createEmptyBoard() {
    return Array(4)
      .fill(0)
      .map(() => Array(4).fill(0));
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = this._createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.hasMoved = false;
    this._addRandomTile();
    this._addRandomTile();
  }

  restart() {
    // Метод restart просто перезапускає гру, викликаючи start()
    this.start();
  }

  _addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { r, c } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;

      return true;
    }

    return false;
  }

  _isGameOver() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return false;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.board[r][c];

        if (current !== 0) {
          if (c + 1 < 4 && this.board[r][c + 1] === current) {
            return false;
          }

          if (r + 1 < 4 && this.board[r + 1][c] === current) {
            return false;
          }
        }
      }
    }

    return true;
  }

  _checkWin() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === this.WINSCORE) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  _slideAndMerge(rowOrCol) {
    let changed = false;
    let currentScoreIncrease = 0;
    const mergedThisMove = Array(4).fill(false);

    let newRowOrCol = rowOrCol.filter((val) => val !== 0);
    let numZeros = 4 - newRowOrCol.length;

    for (let i = 0; i < newRowOrCol.length - 1; i++) {
      if (
        newRowOrCol[i] === newRowOrCol[i + 1] &&
        !mergedThisMove[i] &&
        !mergedThisMove[i + 1]
      ) {
        newRowOrCol[i] *= 2;
        currentScoreIncrease += newRowOrCol[i];
        newRowOrCol.splice(i + 1, 1);
        numZeros++;
        mergedThisMove[i] = true;
        changed = true;
      }
    }

    newRowOrCol = newRowOrCol.concat(Array(numZeros).fill(0));

    for (let i = 0; i < 4; i++) {
      if (rowOrCol[i] !== newRowOrCol[i]) {
        changed = true;
        break;
      }
    }

    return { newRowOrCol, changed, currentScoreIncrease };
  }

  _applyMove(direction) {
    let boardChanged = false;
    let totalScoreIncrease = 0;

    if (direction === 'left' || direction === 'right') {
      for (let r = 0; r < 4; r++) {
        let row = this.board[r];

        if (direction === 'right') {
          row = row.reverse();
        }

        const { newRowOrCol, changed, currentScoreIncrease } =
          this._slideAndMerge(row);

        if (changed) {
          boardChanged = true;
        }
        totalScoreIncrease += currentScoreIncrease;

        if (direction === 'right') {
          this.board[r] = newRowOrCol.reverse();
        } else {
          this.board[r] = newRowOrCol;
        }
      }
    } else {
      // 'up' or 'down'
      for (let c = 0; c < 4; c++) {
        let col = [];

        for (let r = 0; r < 4; r++) {
          col.push(this.board[r][c]);
        }

        if (direction === 'down') {
          col = col.reverse();
        }

        const { newRowOrCol, changed, currentScoreIncrease } =
          this._slideAndMerge(col);

        if (changed) {
          boardChanged = true;
        }
        totalScoreIncrease += currentScoreIncrease;

        if (direction === 'down') {
          newRowOrCol.reverse();
        }

        for (let r = 0; r < 4; r++) {
          this.board[r][c] = newRowOrCol[r];
        }
      }
    }

    if (boardChanged) {
      this.score += totalScoreIncrease;
      this.hasMoved = true;
      this._addRandomTile();
      this._checkWin();

      if (this.status === 'playing' && this._isGameOver()) {
        this.status = 'gameOver';
      }
    }

    return boardChanged;
  }

  moveLeft() {
    return this._applyMove('left');
  }

  moveRight() {
    return this._applyMove('right');
  }

  moveUp() {
    return this._applyMove('up');
  }

  moveDown() {
    return this._applyMove('down');
  }
}

export default Game;
