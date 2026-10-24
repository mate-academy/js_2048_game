'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    if (initialState) {
      this.initialState = JSON.parse(JSON.stringify(initialState));
    } else {
      this.initialState = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.restart();
  }
  getState() {
    return JSON.parse(JSON.stringify(this.board));
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';

      if (this._countEmptyCells() === 16) {
        this._spawnTile();
        this._spawnTile();
      }
    }
  }

  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    return this._makeMove(() => this._slideLeft());
  }

  moveRight() {
    return this._makeMove(() => {
      this._reverseRows();

      const result = this._slideLeft();

      this._reverseRows();

      return result;
    });
  }

  moveUp() {
    return this._makeMove(() => {
      this._transpose();

      const result = this._slideLeft();

      this._transpose();

      return result;
    });
  }

  moveDown() {
    return this._makeMove(() => {
      this._transpose();
      this._reverseRows();

      const result = this._slideLeft();

      this._reverseRows();
      this._transpose();

      return result;
    });
  }

  _makeMove(slideFunction) {
    if (this.status !== 'playing' && this.status !== 'idle') {
      return false;
    }

    if (this.status === 'idle') {
      this.start();
    }

    const { boardChanged, addedScore } = slideFunction();

    if (boardChanged) {
      this.score += addedScore;
      this._afterMove();
    }

    return boardChanged;
  }

  _slideLeft() {
    let boardChanged = false;
    let addedScore = 0;
    const newBoard = [];

    for (let r = 0; r < 4; r++) {
      const row = this.board[r];
      const filtered = row.filter((val) => val !== 0);
      const mergedRow = [];
      let skip = false;

      for (let i = 0; i < filtered.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
          const mergedVal = filtered[i] * 2;

          mergedRow.push(mergedVal);
          addedScore += mergedVal;
          skip = true;
        } else {
          mergedRow.push(filtered[i]);
        }
      }

      while (mergedRow.length < 4) {
        mergedRow.push(0);
      }

      newBoard.push(mergedRow);

      for (let c = 0; c < 4; c++) {
        if (newBoard[r][c] !== this.board[r][c]) {
          boardChanged = true;
        }
      }
    }

    if (boardChanged) {
      this.board = newBoard;
    }

    return { boardChanged, addedScore };
  }

  _reverseRows() {
    for (let r = 0; r < 4; r++) {
      this.board[r].reverse();
    }
  }

  _transpose() {
    for (let r = 0; r < 4; r++) {
      for (let c = r + 1; c < 4; c++) {
        const temp = this.board[r][c];

        this.board[r][c] = this.board[c][r];
        this.board[c][r] = temp;
      }
    }
  }

  _afterMove() {
    this._spawnTile();

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048 && this.status !== 'win') {
          this.status = 'win';
        }
      }
    }

    if (this._isGameOver()) {
      this.status = 'lose';
    }
  }

  _countEmptyCells() {
    let count = 0;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          count++;
        }
      }
    }

    return count;
  }

  _spawnTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.1 ? 4 : 2;

      this.board[randomCell.r][randomCell.c] = value;
    }
  }

  _isGameOver() {
    if (this._countEmptyCells() > 0) {
      return false;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = this.board[r][c];

        if (c < 3 && val === this.board[r][c + 1]) {
          return false;
        }

        if (r < 3 && val === this.board[r + 1][c]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
