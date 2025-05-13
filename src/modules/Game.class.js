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
    this.board = initialState
      ? this.copyBoard(initialState)
      : this.createEmptyBoard();

    if (!initialState) {
      this.addRandomTile();
      this.addRandomTile();
      this.status = 'idle';
    } else {
      this.status = 'playing';
    }

    this.score = 0;

    // console.log(initialState);
  }

  moveLeft() {
    let moved = false;
    let scoreThisMove = 0;

    for (let i = 0; i < 4; i++) {
      const row = this.board[i].filter((val) => val !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          row[j + 1] = 0;
          scoreThisMove += row[j];
          j++;
        }
      }

      const newRow = row.filter((val) => val !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (!this.arraysEqual(this.board[i], newRow)) {
        this.board[i] = newRow;
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.score += scoreThisMove;

      if (this.status === 'idle') {
        this.status = 'playing';
      }
      this.checkGameStatus();
    }
  }

  moveRight() {
    let moved = false;
    let scoreThisMove = 0;

    for (let i = 0; i < 4; i++) {
      const row = this.board[i].slice().reverse();

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          row[j + 1] = 0;
          scoreThisMove += row[j];
          j++;
        }
      }

      const newRow = row.filter((val) => val !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }
      newRow.reverse();

      if (!this.arraysEqual(this.board[i], newRow)) {
        this.board[i] = newRow;
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
      this.score += scoreThisMove;

      if (this.status === 'idle') {
        this.status = 'playing';
      }
      this.checkGameStatus();
    }
  }
  moveUp() {
    let moved = false;
    let scoreThisMove = 0;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const filtered = column.filter((val) => val !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          filtered[i + 1] = 0;
          scoreThisMove += filtered[i];
          i++;
        }
      }

      const newColumn = filtered.filter((val) => val !== 0);

      while (newColumn.length < 4) {
        newColumn.push(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newColumn[row]) {
          this.board[row][col] = newColumn[row];
          moved = true;
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.score += scoreThisMove;

      if (this.status === 'idle') {
        this.status = 'playing';
      }
      this.checkGameStatus();
    }
  }
  moveDown() {
    let moved = false;
    let scoreThisMove = 0;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      column.reverse();

      const filtered = column.filter((val) => val !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          filtered[i + 1] = 0;
          scoreThisMove += filtered[i];
          i++;
        }
      }

      const newColumn = filtered.filter((val) => val !== 0);

      while (newColumn.length < 4) {
        newColumn.push(0);
      }

      newColumn.reverse();

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newColumn[row]) {
          this.board[row][col] = newColumn[row];
          moved = true;
        }
      }
    }

    if (moved) {
      this.addRandomTile();
      this.score += scoreThisMove;

      if (this.status === 'idle') {
        this.status = 'playing';
      }
      this.checkGameStatus();
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
    return this.copyBoard(this.board);
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
    this.addRandomTile();
    this.addRandomTile();
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  copyBoard(board) {
    return board.map((row) => [...row]);
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[x][y] = Math.random() < 0.9 ? 2 : 4;
  }

  arraysEqual(arr1, arr2) {
    return arr1.every((val, idx) => val === arr2[idx]);
  }

  checkGameStatus() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          (j < 3 && this.board[i][j] === this.board[i][j + 1]) ||
          (i < 3 && this.board[i][j] === this.board[i + 1][j])
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}
export default Game;
