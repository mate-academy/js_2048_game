'use strict';

/* eslint no-console: ["error", { allow: ["warn", "log"] }] */

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
    this.size = 4;
    this.status = 'idle';
    this.score = 0;
    this.board = initialState || this.createEmptyBoard();
  }

  moveLeft() {
    const changed = this.slideLeft();

    if (!changed) {
      return;
    }
    this.addRandomNumber();
    this.renderCells();
  }

  moveRight() {
    const changed = this.slideRight();

    if (!changed) {
      return;
    }
    this.addRandomNumber();
    this.renderCells();
  }

  moveUp() {
    const changed = this.slideUp();

    if (!changed) {
      return;
    }
    this.addRandomNumber();
    this.renderCells();
  }

  moveDown() {
    const changed = this.slideDown();

    if (!changed) {
      return;
    }
    this.addRandomNumber();
    this.renderCells();
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
    this.board = this.createEmptyBoard();
    this.status = 'playing';
    this.score = 0;
    this.updateScore();
    this.addRandomNumber();
    this.addRandomNumber();
    this.renderCells();
    this.updateMessage();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let cell = 0; cell < this.size; cell++) {
        if (this.board[row][cell] === 0) {
          emptyCells.push({ row, cell });
        }
      }
    }

    return emptyCells;
  }

  addRandomNumber() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return this.board;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomNumber = Math.random() < 0.9 ? 2 : 4;
    const { row, cell } = emptyCells[randomIndex];

    this.board[row][cell] = randomNumber;

    return this.board;
  }

  renderCells() {
    const table = document.querySelector('.game-field');

    for (let row = 0; row < this.size; row++) {
      for (let cell = 0; cell < this.size; cell++) {
        const value = this.board[row][cell] > 0 ? this.board[row][cell] : '';

        table.rows[row].cells[cell].classList.value = `field-cell`;

        table.rows[row].cells[cell].textContent = value;

        if (value > 0) {
          table.rows[row].cells[cell].classList.add(`field-cell--${value}`);
        }
      }
    }
  }

  slide(row) {
    let newRow = row.filter((r) => r !== 0);

    for (let r = 0; r < newRow.length - 1; r++) {
      if (newRow[r] === newRow[r + 1]) {
        newRow[r] *= 2;
        newRow[r + 1] = 0;
        this.updateScore(newRow[r]);
      }
    }
    newRow = newRow.filter((r) => r !== 0);

    while (newRow.length < this.size) {
      newRow.push(0);
    }

    return newRow;
  }

  slideLeft() {
    const prevBoard = this.board.map((row) => [...row]);

    for (let r = 0; r < this.size; r++) {
      const row = this.slide(this.board[r]);

      this.board[r] = row;
    }

    const changed = JSON.stringify(prevBoard) !== JSON.stringify(this.board);

    return changed;
  }

  slideRight() {
    const prevBoard = this.board.map((row) => [...row]);

    for (let r = 0; r < this.size; r++) {
      const row = this.slide(this.board[r].reverse());

      this.board[r] = row.reverse();
    }

    const changed = JSON.stringify(prevBoard) !== JSON.stringify(this.board);

    return changed;
  }

  slideUp() {
    const prevBoard = this.board.map((row) => [...row]);

    for (let c = 0; c < this.size; c++) {
      const row = [];

      for (let r = 0; r < this.size; r++) {
        row.push(this.board[r][c]);
      }

      const newRow = this.slide(row);

      for (let r = 0; r < this.size; r++) {
        this.board[r][c] = newRow[r];
      }
    }

    const changed = JSON.stringify(prevBoard) !== JSON.stringify(this.board);

    return changed;
  }

  slideDown() {
    const prevBoard = this.board.map((row) => [...row]);

    for (let c = 0; c < this.size; c++) {
      const row = [];

      for (let r = 0; r < this.size; r++) {
        row.push(this.board[r][c]);
      }

      const newRow = this.slide(row.reverse()).reverse();

      for (let r = 0; r < this.size; r++) {
        this.board[r][c] = newRow[r];
      }
    }

    const changed = JSON.stringify(prevBoard) !== JSON.stringify(this.board);

    return changed;
  }

  updateScore(add = 0) {
    this.score += add;

    document.querySelector('.game-score').textContent = this.score;
  }

  updateMessage() {
    this.checkStatus();

    const start = document.querySelector('.message-start');
    const lose = document.querySelector('.message-lose');
    const win = document.querySelector('.message-win');

    switch (this.status) {
      case 'idle':
        start.classList.remove('hidden');
        break;
      case 'playing':
        start.classList.add('hidden');
        win.classList.add('hidden');
        lose.classList.add('hidden');
        break;
      case 'win':
        win.classList.remove('hidden');
        break;
      case 'lose':
        lose.classList.remove('hidden');
        break;
    }
  }

  canMerge() {
    let canMerge = false;

    for (let r = 0; r < this.size - 1; r++) {
      for (let c = 0; c < this.size - 1; c++) {
        if (
          this.board[r][c] === this.board[r][c + 1] ||
          this.board[r][c] === this.board[r + 1][c]
        ) {
          canMerge = true;
        }
      }
    }

    return canMerge;
  }

  checkStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    }

    if (this.getEmptyCells().length === 0 && !this.canMerge()) {
      this.status = 'lose';
    }

    return this.status;
  }
}

module.exports = Game;
