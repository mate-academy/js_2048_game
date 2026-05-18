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
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moveMade = false;
    const prevBoard = JSON.stringify(this.board);

    for (let r = 0; r < 4; r++) {
      const row = this.board[r].filter((val) => val !== 0);
      const newRow = [];

      for (let i = 0; i < row.length; i++) {
        if (i < row.length - 1 && row[i] === row[i + 1]) {
          const mergedValue = row[i] * 2;

          newRow.push(mergedValue);
          this.score += mergedValue;
          i++;
        } else {
          newRow.push(row[i]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      this.board[r] = newRow;
    }

    if (JSON.stringify(this.board) !== prevBoard) {
      moveMade = true;
    }

    if (moveMade) {
      this.addRandomCell();
      this.checkStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moveMade = false;
    const prevBoard = JSON.stringify(this.board);

    for (let r = 0; r < 4; r++) {
      const row = this.board[r].filter((val) => val !== 0);
      const newRow = [];

      for (let i = row.length - 1; i >= 0; i--) {
        if (i > 0 && row[i] === row[i - 1]) {
          const mergedValue = row[i] * 2;

          newRow.unshift(mergedValue);
          this.score += mergedValue;
          i--;
        } else {
          newRow.unshift(row[i]);
        }
      }

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      this.board[r] = newRow;
    }

    if (JSON.stringify(this.board) !== prevBoard) {
      moveMade = true;
    }

    if (moveMade) {
      this.addRandomCell();
      this.checkStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moveMade = false;
    const prevBoard = JSON.stringify(this.board);

    for (let c = 0; c < 4; c++) {
      const col = [];

      for (let r = 0; r < 4; r++) {
        if (this.board[r][c] !== 0) {
          col.push(this.board[r][c]);
        }
      }

      const newCol = [];

      for (let i = 0; i < col.length; i++) {
        if (i < col.length - 1 && col[i] === col[i + 1]) {
          const mergedValue = col[i] * 2;

          newCol.push(mergedValue);
          this.score += mergedValue;
          i++;
        } else {
          newCol.push(col[i]);
        }
      }

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = newCol[r];
      }
    }

    if (JSON.stringify(this.board) !== prevBoard) {
      moveMade = true;
    }

    if (moveMade) {
      this.addRandomCell();
      this.checkStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moveMade = false;
    const prevBoard = JSON.stringify(this.board);

    for (let c = 0; c < 4; c++) {
      const col = [];

      for (let r = 0; r < 4; r++) {
        if (this.board[r][c] !== 0) {
          col.push(this.board[r][c]);
        }
      }

      const newCol = [];

      for (let i = col.length - 1; i >= 0; i--) {
        if (i > 0 && col[i] === col[i - 1]) {
          const mergedValue = col[i] * 2;

          newCol.unshift(mergedValue);
          this.score += mergedValue;
          i--;
        } else {
          newCol.unshift(col[i]);
        }
      }

      while (newCol.length < 4) {
        newCol.unshift(0);
      }

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = newCol[r];
      }
    }

    if (JSON.stringify(this.board) !== prevBoard) {
      moveMade = true;
    }

    if (moveMade) {
      this.addRandomCell();
      this.checkStatus();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return JSON.parse(JSON.stringify(this.board));
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.addRandomCell();
    this.addRandomCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  addRandomCell() {
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
    }
  }

  checkStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    const hasEmptyCells = this.board.some((row) => row.includes(0));

    if (hasEmptyCells) {
      return;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = this.board[r][c];

        if (
          (r < 3 && val === this.board[r + 1][c]) ||
          (c < 3 && val === this.board[r][c + 1])
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
