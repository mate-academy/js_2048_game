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

  moveLeft() {
    const oldBoard = this.board.map((row) => [...row]);

    for (let row = 0; row < 4; row++) {
      const currentRow = this.board[row];

      const filteredRow = currentRow.filter((cell) => cell !== 0);
      const newRow = [];

      for (let i = 0; i < filteredRow.length; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          newRow.push(filteredRow[i] * 2);
          this.score += filteredRow[i] * 2;
          i++;
        } else {
          newRow.push(filteredRow[i]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      this.board[row] = newRow;
    }

    const moved = !this.boardsAreEqual(oldBoard, this.board);

    if (moved) {
      this.addRandomTile();
    }

    this.updateStatus();

    return moved;
  }

  moveRight() {
    const oldBoard = this.board.map((row) => [...row]);

    for (let row = 0; row < 4; row++) {
      const currentRow = this.board[row];
      const reversedRow = [...currentRow].reverse();

      const filteredRow = reversedRow.filter((cell) => cell !== 0);
      const newRow = [];

      for (let i = 0; i < filteredRow.length; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          newRow.push(filteredRow[i] * 2);
          this.score += filteredRow[i] * 2;
          i++;
        } else {
          newRow.push(filteredRow[i]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      this.board[row] = newRow.reverse();
    }

    const moved = !this.boardsAreEqual(oldBoard, this.board);

    if (moved) {
      this.addRandomTile();
    }

    this.updateStatus();

    return moved;
  }

  moveUp() {
    const oldBoard = this.board.map((row) => [...row]);

    for (let col = 0; col < 4; col++) {
      const currentCol = this.board.map((row) => row[col]);

      const filteredCol = currentCol.filter((cell) => cell !== 0);
      const newCol = [];

      for (let i = 0; i < filteredCol.length; i++) {
        if (filteredCol[i] === filteredCol[i + 1]) {
          newCol.push(filteredCol[i] * 2);
          this.score += filteredCol[i] * 2;
          i++;
        } else {
          newCol.push(filteredCol[i]);
        }
      }

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newCol[row];
      }
    }

    const moved = !this.boardsAreEqual(oldBoard, this.board);

    if (moved) {
      this.addRandomTile();
    }

    this.updateStatus();

    return moved;
  }

  moveDown() {
    const oldBoard = this.board.map((row) => [...row]);

    for (let col = 0; col < 4; col++) {
      const currentCol = this.board.map((row) => row[col]);
      const reversedCol = [...currentCol].reverse();

      const filteredCol = reversedCol.filter((cell) => cell !== 0);
      const newCol = [];

      for (let i = 0; i < filteredCol.length; i++) {
        if (filteredCol[i] === filteredCol[i + 1]) {
          newCol.push(filteredCol[i] * 2);
          this.score += filteredCol[i] * 2;
          i++;
        } else {
          newCol.push(filteredCol[i]);
        }
      }

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newCol[3 - row];
      }
    }

    const moved = !this.boardsAreEqual(oldBoard, this.board);

    if (moved) {
      this.addRandomTile();
    }

    this.updateStatus();

    return moved;
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
    return this.board.map((row) => [...row]);
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
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.updateStatus();
  }

  /**
   * Resets the game.
   */

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.updateStatus();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  boardsAreEqual(board1, board2) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board1[i][j] !== board2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  updateStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';

      return;
    }

    this.status = 'playing';
  }
}

module.exports = Game;
