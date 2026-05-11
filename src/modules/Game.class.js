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
  constructor(initialState = []) {
    if (initialState.length) {
      this.board = initialState;
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
    this.score = 0;
    this.status = 'idle';
    this.won = false;
    this.lost = false;
  }

  processRow(row) {
    const nonZeroTiles = row.filter((tile) => tile !== 0);
    const mergedRow = [];

    for (let i = 0; i < nonZeroTiles.length; i++) {
      if (
        i < nonZeroTiles.length - 1 &&
        nonZeroTiles[i] === nonZeroTiles[i + 1]
      ) {
        mergedRow.push(nonZeroTiles[i] * 2);
        this.score += nonZeroTiles[i] * 2;
        i++;
      } else {
        mergedRow.push(nonZeroTiles[i]);
      }
    }

    while (mergedRow.length < 4) {
      mergedRow.push(0);
    }

    return mergedRow;
  }

  transpose(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  moveLeft() {
    const oldBoard = JSON.stringify(this.board);

    this.board.forEach((row, index) => {
      this.board[index] = this.processRow(row);
    });

    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.checkWin();
      this.checkLose();

      return true;
    }

    return false;
  }
  moveRight() {
    const oldBoard = JSON.stringify(this.board);

    this.board.forEach((row, index) => {
      const reversed = [...row].reverse();
      const processed = this.processRow(reversed);

      this.board[index] = processed.reverse();
    });

    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.checkWin();
      this.checkLose();

      return true;
    }

    return false;
  }
  moveUp() {
    const oldBoard = JSON.stringify(this.board);

    const transposed = this.transpose(this.board);

    transposed.forEach((row, index) => {
      transposed[index] = this.processRow(row);
    });
    this.board = this.transpose(transposed);

    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.checkWin();
      this.checkLose();

      return true;
    }

    return false;
  }
  moveDown() {
    const oldBoard = JSON.stringify(this.board);

    const transposed = this.transpose(this.board);

    transposed.forEach((row, index) => {
      const reversed = [...row].reverse();
      const processed = this.processRow(reversed);

      transposed[index] = processed.reverse();
    });
    this.board = this.transpose(transposed);

    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.checkWin();
      this.checkLose();

      return true;
    }

    return false;
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
    if (this.won) {
      return 'win';
    }

    if (this.lost) {
      return 'lose';
    }

    if (this.status === 'idle') {
      return 'idle';
    }

    return 'playing';
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
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
    this.won = false;
    this.lost = false;
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ i, j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { i: row, j: col } = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  checkWin() {
    this.won = this.board.some((row) => row.includes(2048));
  }

  checkLose() {
    if (this.board.some((row) => row.includes(0))) {
      return;
    }

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const current = this.board[i][j];

        if (
          (i > 0 && this.board[i - 1][j] === current) ||
          (i < this.board.length - 1 && this.board[i + 1][j] === current) ||
          (j > 0 && this.board[i][j - 1] === current) ||
          (j < this.board[i].length - 1 && this.board[i][j + 1] === current)
        ) {
          return;
        }
      }
    }

    this.lost = true;
  }
}

module.exports = Game;
