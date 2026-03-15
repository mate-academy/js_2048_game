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
    this.score = 0;
    this.status = 'idle';

    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  moveLeft() {
    const oldBoard = JSON.stringify(this.board);

    for (let r = 0; r < 4; r++) {
      let row = this.board[r];

      row = this.slide(row);
      this.board[r] = row;
    }

    this.afterMove(oldBoard);
  }

  moveRight() {
    const oldBoard = JSON.stringify(this.board);

    for (let r = 0; r < 4; r++) {
      let row = [...this.board[r]].reverse();

      row = this.slide(row);
      this.board[r] = row.reverse();
    }
    this.afterMove(oldBoard);
  }

  moveUp() {
    const oldBoard = JSON.stringify(this.board);

    for (let c = 0; c < 4; c++) {
      let column = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      column = this.slide(column);

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = column[r];
      }
    }
    this.afterMove(oldBoard);
  }

  moveDown() {
    const oldBoard = JSON.stringify(this.board);

    for (let c = 0; c < 4; c++) {
      let column = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      column.reverse();
      column = this.slide(column);
      column.reverse();

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = column[r];
      }
    }
    this.afterMove(oldBoard);
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

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.score = 0;
    this.status = 'idle';

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.start();
  }

  // Add your own methods here
  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { r: row, c: col } = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  slide(row) {
    const filtered = row.filter((num) => num !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered.splice(i + 1, 1);
      }
    }

    while (filtered.length < 4) {
      filtered.push(0);
    }

    return filtered;
  }

  checkStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (this.board.flat().includes(0)) {
      return;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.board[r][c];

        if (c < 3 && current === this.board[r][c + 1]) {
          return;
        }

        if (r < 3 && current === this.board[r + 1][c]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  afterMove(oldBoard) {
    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.checkStatus();
    }
  }
}

// module.exports = Game;
export default Game;
