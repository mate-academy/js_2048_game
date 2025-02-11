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
    this.board =
      initialState || Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    this.board = this.board.map((row) => this.merge(row));
    this.addRandomTile();
  }

  moveRight() {
    this.board = this.board.map((row) => this.merge(row.reverse()).reverse());
    this.addRandomTile();
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

  merge(row) {
    const newRow = row.filter((num) => num !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
      }
    }

    return newRow
      .filter((num) => num !== 0)
      .concat(Array(4).fill(0))
      .slice(0, 4);
  }

  transpose() {
    this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
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
    if (this.board.some((row) => row.includes(2048))) {
      return 'win';
    }

    if (this.isGameOver()) {
      return 'lose';
    }

    return 'playing';
  }

  isGameOver() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return false;
        }

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return false;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Starts the game.
   */
  start() {
    this.updateUI();

    document.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          this.moveLeft();
          break;
        case 'ArrowRight':
          this.moveRight();
          break;
        case 'ArrowUp':
          this.moveUp();
          break;
        case 'ArrowDown':
          this.moveDown();
          break;
      }
    });
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  updateUI() {
    const boardElement = document.getElementById('board');

    boardElement.innerHTML = '';

    this.board.forEach((row) => {
      const rowElement = document.createElement('div');

      rowElement.classList.add('row');

      row.forEach((cell) => {
        const cellElement = document.createElement('div');

        cellElement.classList.add('cell');
        cellElement.textContent = cell !== 0 ? cell : '';
        rowElement.appendChild(cellElement);
      });
      boardElement.appendChild(rowElement);
    });
    document.getElementById('score').textContent = `Score: ${this.score}`;
  }
}

module.exports = Game;
