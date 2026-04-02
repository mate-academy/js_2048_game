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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState.map((row) => [...row]);
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  checkWin() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }
  }

  checkLose() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          return;
        }

        if (
          i < this.board.length - 1 &&
          this.board[i][j] === this.board[i + 1][j]
        ) {
          return;
        }

        if (
          j < this.board[i].length - 1 &&
          this.board[i][j] === this.board[i][j + 1]
        ) {
          return;
        }
      }
    }
    this.status = 'lose';
  }

  slide(row) {
    function filterZero(values) {
      return values.filter((value) => value !== 0);
    }

    let newrow = filterZero(row);

    for (let i = 0; i < newrow.length - 1; i++) {
      if (newrow[i] === newrow[i + 1]) {
        newrow[i] *= 2;
        newrow[i + 1] = 0;
        this.score += newrow[i];
      }
    }

    newrow = filterZero(newrow);

    while (newrow.length < 4) {
      newrow.push(0);
    }

    return newrow;
  }

  moveLeft() {
    const oldBoard = this.board.map((row) => [...row]);

    for (let i = 0; i < this.board.length; i++) {
      let row = this.board[i];

      row = this.slide(row);

      this.board[i] = row;
    }

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.checkWin();

      if (this.status !== 'win') {
        this.addRandomTile();
        this.checkLose();
      }
    }
  }
  moveRight() {
    const oldBoard = this.board.map((row) => [...row]);

    for (let i = 0; i < this.board.length; i++) {
      let row = this.board[i];

      row.reverse();
      row = this.slide(row);
      row.reverse();
      this.board[i] = row;
    }

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.checkWin();

      if (this.status !== 'win') {
        this.addRandomTile();
        this.checkLose();
      }
    }
  }
  moveUp() {
    const oldBoard = this.board.map((row) => [...row]);

    for (let j = 0; j < this.board.length; j++) {
      let row = [
        this.board[0][j],
        this.board[1][j],
        this.board[2][j],
        this.board[3][j],
      ];

      row = this.slide(row);

      for (let i = 0; i < this.board.length; i++) {
        this.board[i][j] = row[i];
      }
    }

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.checkWin();

      if (this.status !== 'win') {
        this.addRandomTile();
        this.checkLose();
      }
    }
  }
  moveDown() {
    const oldBoard = this.board.map((row) => [...row]);

    for (let j = 0; j < this.board.length; j++) {
      let row = [
        this.board[0][j],
        this.board[1][j],
        this.board[2][j],
        this.board[3][j],
      ];

      row.reverse();
      row = this.slide(row);
      row.reverse();

      for (let i = 0; i < this.board.length; i++) {
        this.board[i][j] = row[i];
      }
    }

    if (JSON.stringify(oldBoard) !== JSON.stringify(this.board)) {
      this.checkWin();

      if (this.status !== 'win') {
        this.addRandomTile();
        this.checkLose();
      }
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
  getStatus() {
    return this.status;
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
  getState() {
    return this.board;
  }

  /**
   * Starts the game.
   */

  start() {
    if (this.status === 'playing') {
      return;
    }

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

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const x = Math.floor(Math.random() * emptyCells.length);
      const cell = emptyCells[x];

      this.board[cell.x][cell.y] = Math.random() < 0.9 ? 2 : 4;
    }
  }
}

module.exports = Game;
