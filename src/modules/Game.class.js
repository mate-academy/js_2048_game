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
    this.initialState = initialState;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  shiftLeft() {
    const noZero = this.board.map((str) => {
      return str.filter((num) => num !== 0);
    });

    for (let i = 0; i < 4; i++) {
      let str = noZero[i];

      for (let num = 0; num < str.length - 1; num++) {
        if (str[num] === str[num + 1]) {
          str[num] = str[num] * 2;
          str[num + 1] = 0;
          this.score += str[num];
        }
      }

      str = str.filter((num) => num !== 0);

      while (str.length < 4) {
        str.push(0);
      }

      this.board[i] = str;
    }
  }

  moveLeft() {
    const beforeMove = JSON.stringify(this.board);

    this.shiftLeft();

    if (beforeMove !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    const flatBoard = this.board.flat();

    if (flatBoard.includes(2048)) {
      this.status = 'win';
    } else if (!flatBoard.includes(0)) {
      this.status = 'lose';
    }
  }

  moveRight() {
    const beforeMove = JSON.stringify(this.board);

    this.board.forEach((str) => str.reverse());
    this.shiftLeft();
    this.board.forEach((str) => str.reverse());

    if (beforeMove !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    const flatBoard = this.board.flat();

    if (flatBoard.includes(2048)) {
      this.status = 'win';
    } else if (!flatBoard.includes(0)) {
      this.status = 'lose';
    }
  }

  rotate() {
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        newBoard[c][r] = this.board[r][c];
      }
    }

    this.board = newBoard;
  }

  moveUp() {
    const beforeMove = JSON.stringify(this.board);

    this.rotate();
    this.shiftLeft();
    this.rotate();

    if (beforeMove !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    const flatBoard = this.board.flat();

    if (flatBoard.includes(2048)) {
      this.status = 'win';
    } else if (!flatBoard.includes(0)) {
      this.status = 'lose';
    }
  }

  moveDown() {
    const beforeMove = JSON.stringify(this.board);

    this.rotate();
    this.board.forEach((str) => str.reverse());
    this.shiftLeft();
    this.board.forEach((str) => str.reverse());
    this.rotate();

    if (beforeMove !== JSON.stringify(this.board)) {
      this.addRandomTile();
    }

    const flatBoard = this.board.flat();

    if (flatBoard.includes(2048)) {
      this.status = 'win';
    } else if (!flatBoard.includes(0)) {
      this.status = 'lose';
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'idle';

    this.board = this.initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  // Add your own methods here
  addRandomTile() {
    const nums = [];

    for (let n = 0; n < 4; n++) {
      for (let s = 0; s < 4; s++) {
        if (this.board[n][s] === 0) {
          nums.push({ row: n, cell: s });
        }
      }
    }

    if (nums.length === 0) {
      return;
    }

    const randomInd = Math.floor(Math.random() * nums.length);
    const randomCell = nums[randomInd];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[randomCell.row][randomCell.cell] = value;
  }
}

module.exports = Game;
