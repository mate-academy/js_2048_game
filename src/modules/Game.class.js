/* eslint-disable no-console */
'use strict';

const GRID_SIZE = 4;

export default class Game {
  constructor() {
    this.board = this.getState();

    this.score = 0;
    this.gameActive = false;
    this.cells = document.querySelectorAll('.field-cell');
  }

  moveUp() {
    if (!this.gameActive) {
      return;
    }

    for (let col = 0; col < GRID_SIZE; col++) {
      this.moveColumnUp(col);
    }
    this.getRandomTile();
    this.addCell();
  }
  moveDown() {
    if (!this.gameActive) {
      return;
    }

    for (let col = 0; col < GRID_SIZE; col++) {
      this.moveColumnDown(col);
    }
    this.getRandomTile();
    this.addCell();
  }
  moveLeft() {
    if (!this.gameActive) {
      return;
    }

    console.log('moveLeft');
  }
  moveRight() {
    if (!this.gameActive) {
      return;
    }

    console.log('moveRight');
  }

  getScore() {
    return this.board.flat().reduce((acc, value) => acc + value, 0);
  }

  getState() {
    return [...Array(GRID_SIZE)].map(() => Array(GRID_SIZE).fill(0));
  }

  getRandomTile() {
    const emptyTiles = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyTiles.push({ i, j });
        }
      }
    }

    if (emptyTiles.length) {
      const { i, j } =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.board[i][j] = Math.random() < 0.9 ? 2 : 4;

      return { i, j, value: this.board[i][j] };
    }

    return null;
  }

  addCell() {
    this.cells.forEach((cell, index) => {
      const row = Math.floor(index / GRID_SIZE);
      const col = index % GRID_SIZE;
      const value = this.board[row][col];
      const hasValue = value ? ` field-cell--${value}` : '';

      cell.className = 'field-cell' + hasValue;
      cell.textContent = value || '';
    });
  }

  deleteCell() {
    this.cells.forEach((cell) => {
      cell.className = 'field-cell';
      cell.textContent = '';
    });
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
  getStatus() {}

  start(element) {
    this.gameActive = true;
    this.score = 0;

    element.classList.replace('start', 'restart');
    element.textContent = 'Restart';

    this.getRandomTile();
    this.getRandomTile();
    this.addCell();
  }

  restart(element) {
    this.gameActive = false;
    this.score = 0;

    element.classList.replace('restart', 'start');
    element.textContent = 'Start';

    this.board = this.getState();
    this.deleteCell();
  }

  moveColumnUp(col) {
    const compressedColumn = this.board
      .map((row) => row[col])
      .filter((value) => value !== 0);

    for (let i = 0; i < compressedColumn.length - 1; i++) {
      if (compressedColumn[i] === compressedColumn[i + 1]) {
        compressedColumn[i] *= 2;
        compressedColumn.splice(i + 1, 1);
        this.score += compressedColumn[i];
      }
    }

    while (compressedColumn.length < 4) {
      compressedColumn.push(0);
    }

    for (let row = 0; row < 4; row++) {
      this.board[row][col] = compressedColumn[row];
    }
  }

  moveColumnDown(col) {
    const compressedColumn = this.board
      .map((row) => row[col])
      .filter((value) => value !== 0);

    for (let i = 0; i < compressedColumn.length - 1; i++) {
      if (compressedColumn[i] === compressedColumn[i + 1]) {
        compressedColumn[i] *= 2;
        compressedColumn.splice(i + 1, 1);
        this.score += compressedColumn[i];
      }
    }

    while (compressedColumn.length < 4) {
      compressedColumn.push(0);
    }

    for (let row = 0; row < 4; row++) {
      this.board[row][col] = compressedColumn[row];
    }
  }
}
