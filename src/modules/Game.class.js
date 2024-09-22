'use strict';

class Game {
  constructor(initialState = []) {
    if (initialState.length) {
      this.initialState = initialState;
    } else {
      this.initialState = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.board = [...this.initialState];
    this.score = 0;
    this.status = 'idle';
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'playing') {
      return;
    }
    this.status = 'playing';
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
    this.updateUI();
    this.listenForKeyPresses();
    this.updateButtonToRestart();
    this.hideStartMessage();
  }

  restart() {
    this.status = 'idle';
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.updateUI();
    this.updateButtonToStart();
    this.displayStartMessage();
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let hasMoved = false;

    for (let row = 0; row < 4; row++) {
      const originalRow = [...this.board[row]];
      const compressedRow = this.compressRow(originalRow);
      const mergedRow = this.mergeRow(compressedRow);
      const finalRow = this.compressRow(mergedRow);

      if (!this.rowsEqual(originalRow, finalRow)) {
        this.board[row] = finalRow;
        hasMoved = true;
      }
    }

    if (hasMoved) {
      this.addRandomTile();
      this.updateUI();
      this.checkGameStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let hasMoved = false;

    for (let row = 0; row < 4; row++) {
      const originalRow = [...this.board[row]];
      const reversedRow = [...originalRow].reverse();
      const compressedRow = this.compressRow(reversedRow);
      const mergedRow = this.mergeRow(compressedRow);
      const finalRow = this.compressRow(mergedRow).reverse();

      if (!this.rowsEqual(originalRow, finalRow)) {
        this.board[row] = finalRow;
        hasMoved = true;
      }
    }

    if (hasMoved) {
      this.addRandomTile();
      this.updateUI();
      this.checkGameStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let hasMoved = false;

    for (let col = 0; col < 4; col++) {
      const originalCol = this.getColumn(col);
      const compressedCol = this.compressRow(originalCol);
      const mergedCol = this.mergeRow(compressedCol);
      const finalCol = this.compressRow(mergedCol);

      if (!this.rowsEqual(originalCol, finalCol)) {
        this.setColumn(col, finalCol);
        hasMoved = true;
      }
    }

    if (hasMoved) {
      this.addRandomTile();
      this.updateUI();
      this.checkGameStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let hasMoved = false;

    for (let col = 0; col < 4; col++) {
      const originalCol = this.getColumn(col);
      const reversedCol = [...originalCol].reverse();
      const compressedCol = this.compressRow(reversedCol);
      const mergedCol = this.mergeRow(compressedCol);
      const finalCol = this.compressRow(mergedCol).reverse();

      if (!this.rowsEqual(originalCol, finalCol)) {
        this.setColumn(col, finalCol);
        hasMoved = true;
      }
    }

    if (hasMoved) {
      this.addRandomTile();
      this.updateUI();
      this.checkGameStatus();
    }
  }

  compressRow(row) {
    const newRow = row.filter((value) => value !== 0);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  mergeRow(row) {
    const newRow = [...row];

    for (let i = 0; i < 3; i++) {
      if (newRow[i] === newRow[i + 1] && newRow[i] !== 0) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
      }
    }

    return newRow;
  }

  getColumn(col) {
    const column = [];

    for (let row = 0; row < 4; row++) {
      column.push(this.board[row][col]);
    }

    return column;
  }

  setColumn(col, newCol) {
    for (let row = 0; row < 4; row++) {
      this.board[row][col] = newCol[row];
    }
  }

  rowsEqual(row1, row2) {
    return row1.every((value, index) => value === row2[index]);
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newValue = Math.random() < 0.9 ? 2 : 4;

    this.board[randomCell.row][randomCell.col] = newValue;
  }

  checkGameStatus() {
    if (this.checkWin()) {
      this.status = 'win';
      this.displayMessage('win');
    } else if (this.checkLose()) {
      this.status = 'lose';
      this.displayMessage('lose');
    }
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }

        if (
          (col < 3 && this.board[row][col] === this.board[row][col + 1]) ||
          (row < 3 && this.board[row][col] === this.board[row + 1][col])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  updateUI() {
    const cells = document.querySelectorAll('.field-cell');
    let index = 0;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = this.board[row][col];
        const cell = cells[index];

        if (cell) {
          cell.textContent = value === 0 ? '' : value;
          cell.className = 'field-cell';

          if (value) {
            cell.classList.add(`field-cell--${value}`);
          }
        }
        index++;
      }
    }

    const scoreElement = document.querySelector('.game-score');

    if (scoreElement) {
      scoreElement.textContent = this.score;
    }
  }

  listenForKeyPresses() {
    document.addEventListener('keydown', (eventClick) => {
      if (this.status !== 'playing') {
        return;
      }

      switch (eventClick.key) {
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

  updateButtonToRestart() {
    const button = document.querySelector('.button');

    if (button) {
      button.textContent = 'Restart';
      button.classList.remove('start');
      button.classList.add('restart');
      button.onclick = () => this.restart();
    }
  }

  updateButtonToStart() {
    const button = document.querySelector('.button');

    if (button) {
      button.textContent = 'Start';
      button.classList.remove('restart');
      button.classList.add('start');
      button.onclick = () => this.start();
    }
  }

  hideStartMessage() {
    const startMessage = document.querySelector('.message-start');

    if (startMessage) {
      startMessage.classList.add('hidden');
    }
  }

  displayStartMessage() {
    const startMessage = document.querySelector('.message-start');

    if (startMessage) {
      startMessage.classList.remove('hidden');
    }
  }

  displayMessage(type) {
    const messageElement = document.querySelector(
      type === 'win' ? '.message-win' : '.message-lose',
    );

    if (messageElement) {
      messageElement.classList.remove('hidden');
    }
  }
}

module.exports = Game;
