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
    console.log(initialState);

    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    if (initialState) {
      this.board = initialState.board;
      this.score = initialState.score;
      this.status = initialState.status;
    } else {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  moveLeft() {
    let moved = false;

    for (let y = 0; y < this.size; y++) {
      let row = this.board[y].filter((val) => val !== 0);

      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          this.score += row[i];
          row[i + 1] = 0;

          if (row[i] === 2048) {
            this.status = 'won';
          }
        }
      }

      row = row.filter((val) => val !== 0);

      while (row.length < this.size) {
        row.push(0);
      }

      if (this.arraysEqual(this.board[y], row) === false) {
        moved = true;
        this.board[y] = row;
      }
    }

    if (moved) {
      this.addRandomTile();

      if (this.canMove() === false) {
        this.status = 'lost';
      }
    }
  }

  moveRight() {
    this.reverseRows();
    this.moveLeft();
    this.reverseRows();
  }

  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
  }

  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();
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
    return {
      board: this.board.map((row) => [...row]),
      score: this.score,
      status: this.status,
    };
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
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  // Add your own methods here

  addRandomTile() {
    const emptyCells = [];

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if (this.board[y][x] === 0) {
          emptyCells.push({ x, y });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { x: randX, y: randY } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[randY][randX] = Math.random() < 0.1 ? 4 : 2;
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  }

  canMove() {
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        const val = this.board[y][x];

        if (val === 0) {
          return true;
        }

        if (x < this.size - 1 && val === this.board[y][x + 1]) {
          return true;
        }

        if (y < this.size - 1 && val === this.board[y + 1][x]) {
          return true;
        }
      }
    }

    return false;
  }

  reverseRows() {
    for (const row of this.board) {
      row.reverse();
    }
  }

  transpose() {
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        newBoard[x][y] = this.board[y][x];
      }
    }

    this.board = newBoard;
  }
}

module.exports = Game;
