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

    this.columns = this.board[0].length;
    this.rows = this.board.length;

    this.score = 0;
    this.status = 'idle';

    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  filterZerows(row) {
    return row.filter((cell) => cell !== 0);
  }

  slide(row) {
    let newRow = this.filterZerows(row);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;
        this.score += newRow[i];
      }
    }

    newRow = this.filterZerows(newRow);

    while (newRow.length < this.columns) {
      newRow.push(0);
    }

    return newRow;
  }

  boardsEaqual(board1, board2) {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (board1[r][c] !== board2[r][c]) {
          return false;
        }
      }
    }

    return true;
  }

  moveLeft() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let r = 0; r < this.rows; r++) {
      let row = this.board[r];

      row = this.slide(row);
      this.board[r] = row;
    }

    return !this.boardsEaqual(oldBoard, this.board);
  }

  moveRight() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let r = 0; r < this.rows; r++) {
      let row = this.board[r];

      row = row.reverse();
      row = this.slide(row);
      row.reverse();
      this.board[r] = row;
    }

    return !this.boardsEaqual(oldBoard, this.board);
  }

  moveUp() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let c = 0; c < this.columns; c++) {
      let column = [];

      for (let r = 0; r < this.rows; r++) {
        column.push(this.board[r][c]);
      }

      column = this.slide(column);

      for (let r = 0; r < this.rows; r++) {
        this.board[r][c] = column[r];
      }
    }

    return !this.boardsEaqual(oldBoard, this.board);
  }

  moveDown() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let c = 0; c < this.columns; c++) {
      let column = [];

      for (let r = 0; r < this.rows; r++) {
        column.push(this.board[r][c]);
      }

      column.reverse();
      column = this.slide(column);
      column.reverse();

      for (let r = 0; r < this.rows; r++) {
        this.board[r][c] = column[r];
      }
    }

    return !this.boardsEaqual(oldBoard, this.board);
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

  generateNewTile() {
    const emptyTiles = [];

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.board[r][c] === 0) {
          emptyTiles.push([r, c]);
        }
      }
    }

    if (emptyTiles.length === 0) {
      return false;
    }

    const [row, col] =
      emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;

    this.generateNewTile();
    this.generateNewTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.start();
  }

  isWinner() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  isLoser() {
    if (this.hasEmptyTiles()) {
      return false;
    }

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        const current = this.board[r][c];

        if (c + 1 < this.columns && this.board[r][c + 1] === current) {
          return false;
        }

        if (r + 1 < this.rows && this.board[r + 1][c] === current) {
          return false;
        }
      }
    }
    this.status = 'lose';

    return true;
  }

  hasEmptyTiles() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
