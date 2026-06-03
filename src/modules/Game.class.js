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
    // eslint-disable-next-line no-console
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    const oldBoard = JSON.stringify(this.board);

    for (let l = 0; l < 4; l++) {
      this.board[l] = this.slideRow(this.board[l]);
    }

    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }
  }

  moveRight() {
    const oldBoard = JSON.stringify(this.board);

    for (let r = 0; r < 4; r++) {
      this.board[r].reverse();
      this.board[r] = this.slideRow(this.board[r]);
      this.board[r].reverse();
    }

    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }
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

      column = this.slideRow(column);
      this.board[0][c] = column[0];
      this.board[1][c] = column[1];
      this.board[2][c] = column[2];
      this.board[3][c] = column[3];
    }

    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }
  }

  moveDown() {
    const oldBoard = JSON.stringify(this.board);

    for (let d = 0; d < 4; d++) {
      let column = [
        this.board[0][d],
        this.board[1][d],
        this.board[2][d],
        this.board[3][d],
      ];

      column.reverse();
      column = this.slideRow(column);
      column.reverse();
      this.board[0][d] = column[0];
      this.board[1][d] = column[1];
      this.board[2][d] = column[2];
      this.board[3][d] = column[3];
    }

    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
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

  /**
   * Starts the game.
   */
  start() {
    this.restart();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'playing';

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  isGameOver() {
    if (this.board.some((row) => row.includes(0))) {
      return false;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return false;
        } else if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return false;
        }
      }
    }
      return true;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let rw = 0; rw < this.board.length; rw++) {
      for (let cl = 0; cl < this.board[rw].length; cl++) {
        if (this.board[rw][cl] === 0) {
          emptyCells.push([rw, cl]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];
    const tileValue = Math.random() < 0.1 ? 4 : 2;

    this.board[row][col] = tileValue;
  }

  slideRow(row) {
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
}

export default Game;
