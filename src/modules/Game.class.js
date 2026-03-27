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
    this.score = 0; // можливо треба видалити
    this.status = 'idle';
  }

  moveLeft() {
    const oldBoard = JSON.stringify(this.board);

    this.board.forEach((e, idx) => {
      let filtered = e.filter((x) => x !== 0);

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          this.score += filtered[i];
          filtered[i + 1] = 0;
        }
      }

      filtered = filtered.filter((x) => x !== 0);

      while (filtered.length < 4) {
        filtered.push(0);
      }
      this.board[idx] = filtered;
    });

    const movedBoard = JSON.stringify(this.board);

    if (oldBoard !== movedBoard) {
      this.addRandomTile();
    }
  }

  moveRight() {
    const oldBoard = JSON.stringify(this.board);

    this.board.forEach((e, idx) => {
      const row = [...e].reverse();
      let filtered = row.filter((x) => x !== 0);

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          this.score += filtered[i];
          filtered[i + 1] = 0;
        }
      }

      filtered = filtered.filter((x) => x !== 0);

      while (filtered.length < 4) {
        filtered.push(0);
      }
      filtered = filtered.reverse();
      this.board[idx] = filtered;
    });

    const movedBoard = JSON.stringify(this.board);

    if (oldBoard !== movedBoard) {
      this.addRandomTile();
    }
  }

  moveUp() {
    const oldBoard = JSON.stringify(this.board);

    const newBoard = [[], [], [], []];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        newBoard[j][i] = this.board[i][j];
      }
    }

    newBoard.forEach((e, idx) => {
      let filtered = e.filter((x) => x !== 0);

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          this.score += filtered[i];
          filtered[i + 1] = 0;
        }
      }

      filtered = filtered.filter((x) => x !== 0);

      while (filtered.length < 4) {
        filtered.push(0);
      }

      newBoard[idx] = filtered;
    });

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.board[i][j] = newBoard[j][i];
      }
    }

    const movedBoard = JSON.stringify(this.board);

    if (oldBoard !== movedBoard) {
      this.addRandomTile();
    }
  }

  moveDown() {
    const oldBoard = JSON.stringify(this.board);
    const newBoard = [[], [], [], []];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        newBoard[j][i] = this.board[i][j];
      }
    }

    newBoard.forEach((e, idx) => {
      let filtered = e.reverse().filter((x) => x !== 0);

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          this.score += filtered[i];
          filtered[i + 1] = 0;
        }
      }

      filtered = filtered.filter((x) => x !== 0);

      while (filtered.length < 4) {
        filtered.push(0);
      }

      newBoard[idx] = filtered.reverse();
    });

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        this.board[i][j] = newBoard[j][i];
      }
    }

    const movedBoard = JSON.stringify(this.board);

    if (oldBoard !== movedBoard) {
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
    if (this.status === 'idle') {
      return this.status;
    }

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 2048) {
          return 'win';
        }

        if (this.board[i][j] === 0) {
          return 'playing';
        }
      }
    }

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length - 1; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          return 'playing';
        }
      }
    }

    for (let i = 0; i < this.board.length - 1; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === this.board[i + 1][j]) {
          return 'playing';
        }
      }
    }

    return 'lose';
  }

  /**
   * Starts the game.
   */
  start() {
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
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

  addRandomTile() {
    const zeros = [];

    for (let i = 0; i <= 15; i++) {
      const r = Math.floor(i / 4);
      const c = i % 4;

      if (this.board[r][c] === 0) {
        zeros.push(i);
      }
    }

    const randomIdx = Math.floor(Math.random() * zeros.length);

    const row = Math.floor(zeros[randomIdx] / 4);
    const col = zeros[randomIdx] % 4;

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;

    return this.board;
  }
}

export default Game;
