'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

const GRID_SIZE = 4;
const PROBABILITY_OF_FOUR = 0.1;

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
    this.status = 'idle';
    this.score = 0;

    if (initialState) {
      this.board = initialState;
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
  }

  moveLeft() {
    const oldBoardStr = JSON.stringify(this.board);

    for (let r = 0; r < GRID_SIZE; r++) {
      let row = this.board[r];

      row = this.slide(row);
      this.board[r] = row;
    }

    const newBoardStr = JSON.stringify(this.board);

    if (oldBoardStr !== newBoardStr) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveRight() {
    const oldBoardStr = JSON.stringify(this.board);

    for (let r = 0; r < GRID_SIZE; r++) {
      let row = this.board[r];

      row.reverse();
      row = this.slide(row);
      row.reverse();

      this.board[r] = row;
    }

    if (oldBoardStr !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveUp() {
    const oldBoardStr = JSON.stringify(this.board);

    for (let c = 0; c < GRID_SIZE; c++) {
      let col = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      col = this.slide(col);

      for (let r = 0; r < GRID_SIZE; r++) {
        this.board[r][c] = col[r];
      }
    }

    if (oldBoardStr !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveDown() {
    const oldBoardStr = JSON.stringify(this.board);

    for (let c = 0; c < GRID_SIZE; c++) {
      let col = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      col.reverse();
      col = this.slide(col);
      col.reverse();

      for (let r = 0; r < GRID_SIZE; r++) {
        this.board[r][c] = col[r];
      }
    }

    if (oldBoardStr !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    this.updateStatus();
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
    this.status = 'playing';
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r: r, c: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    const newValue = Math.random() < PROBABILITY_OF_FOUR ? 4 : 2;

    this.board[randomCell.r][randomCell.c] = newValue;
  }

  slide(row) {
    let arr = row.filter((val) => val !== 0);

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] !== 0 && arr[i] === arr[i + 1]) {
        arr[i] = arr[i] * 2;
        arr[i + 1] = 0;

        this.score += arr[i];
      }
    }

    arr = arr.filter((val) => val !== 0);

    while (arr.length < GRID_SIZE) {
      arr.push(0);
    }

    return arr;
  }

  updateStatus() {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (this.board[r][c] === 0) {
          return;
        }
      }
    }

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

export default Game;
