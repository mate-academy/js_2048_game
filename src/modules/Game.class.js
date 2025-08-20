'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
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
    // eslint-disable-next-line no-console
    console.log(initialState);
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board =
      initialState ||
      Array.from({ length: this.size }, () => Array(this.size).fill(0));
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
    return this.board;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'gameover'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `gameover` - the game is lost
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
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = [];

    for (let i = 0; i < this.size; i++) {
      const row = new Array(this.size).fill(0);

      this.board.push(row);
    }
    this.score = 0;
    this.status = 'playing'; // voltar direto pro jogo
    this.addRandomTile();
    this.addRandomTile();
  }

  // Add your own methods here
  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    // Place a new tile (2 or 4) at the selected empty cell
    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    if (this.getStatus() !== 'playing') {
      return false;
    }

    return this.move((row) => row);
  }
  moveRight() {
    if (this.getStatus() !== 'playing') {
      return false;
    }

    return this.move((row) => row.slice().reverse(), true);
  }
  moveUp() {
    if (this.getStatus() !== 'playing') {
      return false;
    }

    return this.moveColumn((col) => col);
  }
  moveDown() {
    if (this.getStatus() !== 'playing') {
      return false;
    }

    return this.moveColumn((col) => col.slice().reverse(), true);
  }

  move(mapFn, reverse = false) {
    let moved = false;

    this.board = this.board.map((row) => {
      let workRow = mapFn(row).filter((x) => x !== 0); // remove zeros

      // merge iguais
      for (let i = 0; i < workRow.length - 1; i++) {
        if (workRow[i] === workRow[i + 1]) {
          workRow[i] *= 2;
          this.score += workRow[i];
          workRow[i + 1] = 0;
        }
      }

      // compacta de novo
      workRow = workRow.filter((x) => x !== 0);

      while (workRow.length < this.size) {
        workRow.push(0);
      }

      if (reverse) {
        workRow.reverse();
      }

      if (workRow.toString() !== row.toString()) {
        moved = true;
      }

      return workRow;
    });

    if (moved) {
      this.addRandomTile();
      this.checkGameOver();
    }

    return moved;
  }

  moveColumn(mapFn, reverse = false) {
    let moved = false;

    for (let c = 0; c < this.size; c++) {
      let col = this.board.map((row) => row[c]);

      col = mapFn(col).filter((x) => x !== 0);

      // merge iguais
      for (let i = 0; i < col.length - 1; i++) {
        if (col[i] === col[i + 1]) {
          col[i] *= 2;
          this.score += col[i];
          col[i + 1] = 0;
        }
      }

      // compacta de novo
      col = col.filter((x) => x !== 0);

      while (col.length < this.size) {
        col.push(0);
      }

      if (reverse) {
        col.reverse();
      }

      const oldCol = this.board.map((row) => row[c]);

      if (col.toString() !== oldCol.toString()) {
        moved = true;
      }

      for (let r = 0; r < this.size; r++) {
        this.board[r][c] = col[r];
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameOver();
    }

    return moved;
  }

  checkGameOver() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (this.board.flat().includes(0)) {
      return;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];

        if (
          (r < this.size - 1 && this.board[r + 1][c] === val) ||
          (c < this.size - 1 && this.board[r][c + 1] === val)
        ) {
          return;
        }
      }
    }

    this.status = 'gameover';
  }
}
