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
    this.board = this.board.map((row) => {
      const filteredRow = row.filter((num) => num !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          filteredRow[i + 1] = 0;
          this.score += filteredRow[i];
        }
      }

      const updatedRow = filteredRow.filter((num) => num !== 0);

      while (updatedRow.length < 4) {
        updatedRow.push(0);
      }

      return updatedRow;
    });

    this.addRandomTile();
    this.checkStatus();
  }

  moveRight() {
    this.board = this.board.map((row) => {
      const reversedRow = [...row].reverse();
      const filteredRow = reversedRow.filter((num) => num !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          filteredRow[i + 1] = 0;
          this.score += filteredRow[i];
        }
      }

      const updatedRow = filteredRow.filter((num) => num !== 0);

      while (updatedRow.length < 4) {
        updatedRow.push(0);
      }

      return updatedRow.reverse();
    });

    this.addRandomTile();
    this.checkStatus();
  }

  moveUp() {
    for (let col = 0; col < 4; col++) {
      const column = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ];
      const filteredColumn = column.filter((num) => num !== 0);

      for (let i = 0; i < filteredColumn.length - 1; i++) {
        if (filteredColumn[i] === filteredColumn[i + 1]) {
          filteredColumn[i] *= 2;
          filteredColumn[i + 1] = 0;
          this.score += filteredColumn[i];
        }
      }

      const updatedColumn = filteredColumn.filter((num) => num !== 0);

      while (updatedColumn.length < 4) {
        updatedColumn.push(0);
      }

      for (let i = 0; i < 4; i++) {
        this.board[i][col] = updatedColumn[i];
      }
    }

    this.addRandomTile();
    this.checkStatus();
  }

  moveDown() {
    for (let col = 0; col < 4; col++) {
      const column = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ].reverse();
      const filteredColumn = column.filter((num) => num !== 0);

      for (let i = 0; i < filteredColumn.length - 1; i++) {
        if (filteredColumn[i] === filteredColumn[i + 1]) {
          filteredColumn[i] *= 2;
          filteredColumn[i + 1] = 0;
          this.score += filteredColumn[i];
        }
      }

      const updatedColumn = filteredColumn.filter((num) => num !== 0);

      while (updatedColumn.length < 4) {
        updatedColumn.push(0);
      }

      updatedColumn.reverse();

      for (let i = 0; i < 4; i++) {
        this.board[i][col] = updatedColumn[i];
      }
    }

    this.addRandomTile();
    this.checkStatus();
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
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

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
    const randomCell = emptyCells[randomIndex];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[randomCell.r][randomCell.c] = value;
  }

  checkStatus() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = this.board[r][c];

        if (c < 3 && val === this.board[r][c + 1]) {
          return;
        }

        if (r < 3 && val === this.board[r + 1][c]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
