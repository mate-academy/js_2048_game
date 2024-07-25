/* eslint-disable no-console */
'use strict';

const GRID_SIZE = 4;

export default class Game {
  constructor() {
    this.board = this.getState();

    this.score = 0;
    this.gameActive = false;
    this.cells = document.querySelectorAll('.field-cell');

    this.messageWin = document.querySelector('.message-win');
    this.messageLose = document.querySelector('.message-lose');

    this.assignDataAttributes();
  }

  assignDataAttributes() {
    this.cells.forEach((cell, index) => {
      const row = Math.floor(index / GRID_SIZE);
      const col = index % GRID_SIZE;

      cell.dataset.row = row;
      cell.dataset.col = col;
    });
  }

  moveUp() {
    if (!this.gameActive) {
      return;
    }

    let changed = false;

    for (let col = 0; col < GRID_SIZE; col++) {
      if (this.moveColumnUp(col)) {
        changed = true;
      }
    }

    if (changed) {
      this.getRandomTile();
      this.addCell();
    }

    this.checkGameStatus();
  }

  moveDown() {
    if (!this.gameActive) {
      return;
    }

    let changed = false;

    for (let col = 0; col < GRID_SIZE; col++) {
      if (this.moveColumnDown(col)) {
        changed = true;
      }
    }

    if (changed) {
      this.getRandomTile();
      this.addCell();
    }

    this.checkGameStatus();
  }

  moveLeft() {
    if (!this.gameActive) {
      return;
    }

    let changed = false;

    for (let row = 0; row < GRID_SIZE; row++) {
      if (this.moveColumnLeft(row)) {
        changed = true;
      }
    }

    if (changed) {
      this.getRandomTile();
      this.addCell();
    }

    this.checkGameStatus();
  }

  moveRight() {
    if (!this.gameActive) {
      return;
    }

    let changed = false;

    for (let row = 0; row < GRID_SIZE; row++) {
      if (this.moveColumnRight(row)) {
        changed = true;
      }
    }

    if (changed) {
      this.getRandomTile();
      this.addCell();
    }

    this.checkGameStatus();
  }

  getScore() {
    return this.board.flat().reduce((acc, value) => acc + value, 0);
  }

  getState() {
    return [...Array(GRID_SIZE)].map(() => Array(GRID_SIZE).fill(0));
  }

  getRandomTile() {
    const emptyTiles = [];

    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (this.board[row][col] === 0) {
          emptyTiles.push({ row, col });
        }
      }
    }

    if (emptyTiles.length) {
      const { row, col } =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
      this.animateNewTile(row, col);

      return { row, col, value: this.board[row][col] };
    }

    return null;
  }

  checkWin() {
    return this.board.flat().includes(2048);
  }

  checkLose() {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }

        const checkCol =
          col < GRID_SIZE - 1 &&
          this.board[row][col] === this.board[row][col + 1];

        const checkRow =
          row < GRID_SIZE - 1 &&
          this.board[row][col] === this.board[row + 1][col];

        if (checkCol || checkRow) {
          return false;
        }
      }
    }

    return true;
  }

  getStatus() {
    if (this.checkWin()) {
      return 'win';
    }

    if (this.checkLose()) {
      return 'lose';
    }

    return `playing`;
  }

  checkGameStatus() {
    const gameStatus = this.getStatus();

    if (gameStatus === 'win') {
      this.messageWin.classList.remove('hidden');
    } else if (gameStatus === 'lose') {
      this.messageLose.classList.remove('hidden');
    }
  }

  addCell() {
    this.cells.forEach((cell, index) => {
      const row = Math.floor(index / GRID_SIZE);
      const col = index % GRID_SIZE;
      const value = this.board[row][col];
      const hasValue = value ? ` field-cell--${value}` : '';

      cell.className = 'field-cell' + hasValue;
      cell.textContent = value || '';
      this.animateAppear(row, col);
    });
  }

  deleteCell() {
    this.cells.forEach((cell) => {
      cell.className = 'field-cell';
      cell.textContent = '';
    });
  }

  start(element) {
    this.gameActive = true;
    this.score = 0;

    element.classList.replace('start', 'restart');
    element.textContent = 'Restart';

    setTimeout(() => {
      this.getRandomTile();
      this.getRandomTile();
      this.addCell();
      this.assignDataAttributes();
    }, 100);
  }

  restart(element) {
    this.gameActive = false;
    this.score = 0;

    const hasHiddenLose = this.messageLose.classList.contains('hidden');
    const hasHiddenWin = this.messageWin.classList.contains('hidden');

    if (!hasHiddenLose) {
      this.messageLose.classList.add('hidden');
    }

    if (!hasHiddenWin) {
      this.messageWin.classList.add('hidden');
    }

    element.classList.replace('restart', 'start');
    element.textContent = 'Start';

    this.board = this.getState();
    this.deleteCell();
    this.assignDataAttributes();
  }

  moveColumnUp(col) {
    let changed = false;
    const compressedColumn = this.board
      .map((row) => row[col])
      .filter((value) => value !== 0);

    for (let i = 0; i < compressedColumn.length - 1; i++) {
      if (compressedColumn[i] === compressedColumn[i + 1]) {
        compressedColumn[i] *= 2;
        compressedColumn.splice(i + 1, 1);
        this.score += compressedColumn[i];
        this.animateMerge(i, col);
        changed = true;
      }
    }

    while (compressedColumn.length < GRID_SIZE) {
      compressedColumn.push(0);
    }

    for (let row = 0; row < GRID_SIZE; row++) {
      if (this.board[row][col] !== compressedColumn[row]) {
        changed = true;
      }
      this.board[row][col] = compressedColumn[row];
      this.animateMove(row, col);
    }

    return changed;
  }

  moveColumnDown(col) {
    let changed = false;
    const compressedColumn = this.board
      .map((row) => row[col])
      .filter((value) => value !== 0);

    for (let i = compressedColumn.length - 1; i > 0; i--) {
      if (compressedColumn[i] === compressedColumn[i - 1]) {
        compressedColumn[i] *= 2;
        compressedColumn.splice(i - 1, 1);
        this.score += compressedColumn[i];
        this.animateMerge(i, col);
        changed = true;
      }
    }

    while (compressedColumn.length < GRID_SIZE) {
      compressedColumn.unshift(0);
    }

    for (let row = 0; row < GRID_SIZE; row++) {
      if (this.board[row][col] !== compressedColumn[row]) {
        changed = true;
      }
      this.board[row][col] = compressedColumn[row];
      this.animateMove(row, col);
    }

    return changed;
  }

  moveColumnLeft(row) {
    let changed = false;
    const compressedRow = this.board[row].filter((value) => value !== 0);

    for (let i = 0; i < compressedRow.length - 1; i++) {
      if (compressedRow[i] === compressedRow[i + 1]) {
        compressedRow[i] *= 2;
        compressedRow.splice(i + 1, 1);
        this.score += compressedRow[i];
        this.animateMerge(row, i);
        changed = true;
      }
    }

    while (compressedRow.length < GRID_SIZE) {
      compressedRow.push(0);
    }

    if (
      this.board[row].some((value, index) => value !== compressedRow[index])
    ) {
      changed = true;
    }

    this.board[row] = compressedRow;

    for (let col = 0; col < GRID_SIZE; col++) {
      this.animateMove(row, col);
    }

    return changed;
  }

  moveColumnRight(row) {
    let changed = false;
    const compressedRow = this.board[row].filter((value) => value !== 0);

    for (let i = compressedRow.length - 1; i > 0; i--) {
      if (compressedRow[i] === compressedRow[i - 1]) {
        compressedRow[i] *= 2;
        compressedRow.splice(i - 1, 1);
        this.score += compressedRow[i];
        this.animateMerge(row, i);
        changed = true;
      }
    }

    while (compressedRow.length < GRID_SIZE) {
      compressedRow.unshift(0);
    }

    if (
      this.board[row].some((value, index) => value !== compressedRow[index])
    ) {
      changed = true;
    }

    this.board[row] = compressedRow;

    for (let col = 0; col < GRID_SIZE; col++) {
      this.animateMove(row, col);
    }

    return changed;
  }

  animateNewTile(row, col) {
    const cell = document.querySelector(
      `.field-cell[data-row="${row}"][data-col="${col}"]`,
    );

    if (cell) {
      cell.classList.add('field-cell--new');

      setTimeout(() => {
        cell.classList.remove('field-cell--new');
      }, 300);
    }
  }

  animateAppear(row, col) {
    const cell = document.querySelector(
      `.field-cell[data-row="${row}"][data-col="${col}"]`,
    );

    if (cell) {
      cell.classList.add('field-cell--appear');

      setTimeout(() => {
        cell.classList.remove('field-cell--appear');
      }, 200);
    }
  }

  animateMerge(row, col) {
    const cell = document.querySelector(
      `.field-cell[data-row="${row}"][data-col="${col}"]`,
    );

    if (cell) {
      cell.classList.add('field-cell--merge');

      setTimeout(() => {
        cell.classList.remove('field-cell--merge');
      }, 300);
    }
  }

  animateMove(row, col) {
    const cell = document.querySelector(
      `.field-cell[data-row="${row}"][data-col="${col}"]`,
    );

    if (cell) {
      cell.classList.add('field-cell--move');

      setTimeout(() => {
        cell.classList.remove('field-cell--move');
      }, 300);
    }
  }
}
