'use strict';

import { buttonStart } from '../scripts/main';
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

    this.score = 0;
    this.status = 'idle';
    this.gameScore = document.querySelector('.game-score');
    this.firstMove = true;
    this.cells = document.querySelectorAll('.field-cell');
  }

  bindControls() {
    document.addEventListener('keydown', (e) => {
      if (this.status !== 'playing') {
        return;
      }
      e.preventDefault();

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
        default:
      }
    });
  }

  hasBoardChanged(oldBoard, newBoard) {
    return JSON.stringify(oldBoard) !== JSON.stringify(newBoard);
  }

  moveLeft() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let r = 0; r < 4; r++) {
      let row = this.board[r];

      row = row.filter((v) => v !== 0);

      for (let c = 0; c < row.length - 1; c++) {
        if (row[c] === row[c + 1]) {
          row[c] *= 2;
          row[c + 1] = 0;
          this.score += row[c];
        }
      }
      row = row.filter((v) => v !== 0);

      while (row.length < 4) {
        row.push(0);
      }
      this.board[r] = row;
    }

    if (this.hasBoardChanged(oldBoard, this.board)) {
      if (this.firstMove) {
        buttonStart.classList.remove('start');
        buttonStart.classList.add('restart');
        buttonStart.textContent = 'Restart';
        this.firstMove = false;
      }

      this.addNewCell();

      if (!this.checkWin()) {
        this.checkLose();
      }
      this.render();
    }
  }

  moveRight() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let r = 0; r < 4; r++) {
      let row = this.board[r].filter((v) => v !== 0);

      for (let c = row.length - 1; c > 0; c--) {
        if (row[c] === row[c - 1]) {
          row[c] *= 2;
          row[c - 1] = 0;
          this.score += row[c];
        }
      }
      row = row.filter((el) => el !== 0);

      while (row.length < 4) {
        row.unshift(0);
      }
      this.board[r] = row;
    }

    if (this.hasBoardChanged(oldBoard, this.board)) {
      if (this.firstMove) {
        buttonStart.classList.remove('start');
        buttonStart.classList.add('restart');
        buttonStart.textContent = 'Restart';
        this.firstMove = false;
      }

      this.addNewCell();

      if (!this.checkWin()) {
        this.checkLose();
      }
      this.render();
    }
  }

  moveUp() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let c = 0; c < 4; c++) {
      let column = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      column = column.filter((v) => v !== 0);

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column[i + 1] = 0;
        }
      }

      column = column.filter((v) => v !== 0);

      while (column.length < 4) {
        column.push(0);
      }

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = column[r];
      }
    }

    if (this.hasBoardChanged(oldBoard, this.board)) {
      if (this.firstMove) {
        buttonStart.classList.remove('start');
        buttonStart.classList.add('restart');
        buttonStart.textContent = 'Restart';
        this.firstMove = false;
      }

      this.addNewCell();

      if (!this.checkWin()) {
        this.checkLose();
      }
      this.render();
    }
  }

  moveDown() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let c = 0; c < 4; c++) {
      let column = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      column = column.filter((v) => v !== 0);

      for (let i = column.length - 1; i > 0; i--) {
        if (column[i] === column[i - 1]) {
          column[i] *= 2;
          this.score += column[i];
          column[i - 1] = 0;
        }
      }

      column = column.filter((v) => v !== 0);

      while (column.length < 4) {
        column.unshift(0);
      }

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = column[r];
      }
    }

    if (this.hasBoardChanged(oldBoard, this.board)) {
      if (this.firstMove) {
        buttonStart.classList.remove('start');
        buttonStart.classList.add('restart');
        buttonStart.textContent = 'Restart';
        this.firstMove = false;
      }

      this.addNewCell();

      if (!this.checkWin()) {
        this.checkLose();
      }
      this.render();
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

  addNewCell = () => {
    const empty = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    if (empty.length === 0) {
      return null;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;

    return [row, col];
  };

  render() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const value = this.board[r][c];
        const cell = this.cells[r * 4 + c];

        cell.className = 'field-cell';
        cell.textContent = value === 0 ? '' : value;

        if (value > 0) {
          cell.classList.add(`field-cell--${value}`);
        } else {
          cell.classList.add(`empty`);
        }
      }
    }
    this.gameScore.textContent = this.score;
    this.renderStatus();
  }

  renderStatus() {
    const msgStart = document.querySelector('.message-start');
    const msgWin = document.querySelector('.message-win');
    const msgLose = document.querySelector('.message-lose');

    msgStart.classList.add('hidden');
    msgWin.classList.add('hidden');
    msgLose.classList.add('hidden');

    if (this.status === 'idle') {
      msgStart.classList.remove('hidden');
    }

    if (this.status === 'win') {
      msgWin.classList.remove('hidden');
    }

    if (this.status === 'lose') {
      msgLose.classList.remove('hidden');
    }
  }

  checkWin() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    if (this.board.flat().includes(0)) {
      return false;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (
          (c < 3 && this.board[r][c] === this.board[r][c + 1]) ||
          (r < 3 && this.board[r][c] === this.board[r + 1][c])
        ) {
          return false;
        }
      }
    }

    this.status = 'lose';

    return true;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.addNewCell();
    this.addNewCell();

    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
    buttonStart.textContent = 'Restart';
    this.firstMove = false;

    this.render();
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
    this.firstMove = true;

    buttonStart.classList.remove('restart');
    buttonStart.classList.add('start');
    buttonStart.textContent = 'Start';

    this.render();
  }

  // Add your own methods here
}

module.exports = Game;
