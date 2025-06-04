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
  status = 'idle';
  score = 0;

  constructor(
    board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = board;
  }

  moveLeft() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const moved = this.processLeftMoveWithoutRendering();

    if (moved) {
      this.addRandomTile();
    }

    this.updateStatus();
  }
  processLeftMoveWithoutRendering() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const originalRow = [...this.board[row]];
      const newRow = this.mergeRowByPriority(originalRow);

      if (!this.arraysEqual(originalRow, newRow)) {
        moved = true;
        this.board[row] = newRow;
      }
    }

    return moved;
  }
  mergeRowByPriority(row) {
    let tiles = row.filter((val) => val !== 0);

    for (let i = 0; i < tiles.length - 1; i++) {
      if (tiles[i] === tiles[i + 1]) {
        tiles[i] *= 2;
        this.score += tiles[i];
        tiles[i + 1] = 0;
        i++;
      }
    }

    tiles = tiles.filter((val) => val !== 0);

    while (tiles.length < 4) {
      tiles.push(0);
    }

    return tiles.slice(0, 4);
  }
  moveRight() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    this.reverseRows();

    const moved = this.processLeftMoveWithoutRendering();

    this.reverseRows();

    if (moved) {
      this.addRandomTile();
    }

    this.updateStatus();
  }
  moveUp() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    this.board = this.transpose(this.board);

    const moved = this.processLeftMoveWithoutRendering();

    this.board = this.transpose(this.board);

    if (moved) {
      this.addRandomTile();
    }

    this.updateStatus();
  }
  moveDown() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    this.board = this.transpose(this.board);
    this.reverseRows();

    const moved = this.processLeftMoveWithoutRendering();

    this.reverseRows();
    this.board = this.transpose(this.board);

    if (moved) {
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

  updateStatus() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (this.canMakeMove()) {
      this.status = 'playing';
    } else {
      this.status = 'lose';
    }
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';

    const getRandomPosition = () => {
      const row = Math.floor(Math.random() * 4);
      const col = Math.floor(Math.random() * 4);

      return [row, col];
    };

    const getRandomValue = () => {
      return Math.random() < 0.1 ? 4 : 2;
    };

    const [row1, col1] = getRandomPosition();

    this.board[row1][col1] = getRandomValue();

    let row2, col2;

    do {
      [row2, col2] = getRandomPosition();
    } while (row2 === row1 && col2 === col1);

    this.board[row2][col2] = 2;
    this.updateStatus();
  }

  /**
   * Resets the game.
   */
  restart() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.board[i][j] = 0;
      }
    }

    this.status = 'idle';

    this.score = 0;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[row][col] = value;
  }

  canMakeMove() {
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

  reverseRows() {
    for (let i = 0; i < 4; i++) {
      this.board[i].reverse();
    }
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }
}

module.exports = Game;
