'use strict';

class Game {
  constructor(initialState = null) {
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
  }

  createEmptyBoard() {
    const board = [];

    for (let i = 0; i < 4; i++) {
      board.push([0, 0, 0, 0]);
    }

    return board;
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    for (const row of this.board) {
      for (const tile of row) {
        if (tile === 2048) {
          this.status = 'win';

          return 'win';
        }
      }
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';

      return 'lose';
    }

    return 'playing';
  }

  hasEmptyCells() {
    for (const row of this.board) {
      for (const tile of row) {
        if (tile === 0) {
          return true;
        }
      }
    }

    return false;
  }

  canMerge() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  hasAvailableMoves() {
    return this.hasEmptyCells() || this.canMerge();
  }

  moveLeft() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = this.board[i];
      const newRow = this.mergeRow(row);

      if (newRow.some((tile, index) => tile !== row[index])) {
        moved = true;
      }
      this.board[i] = newRow;
    }

    if (moved) {
      this.addRandomTile();
    }
    this.updateUI();
  }

  moveRight() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = this.board[i];
      const reversedRow = [...row].reverse();
      const newRow = this.mergeRow(reversedRow);

      if (newRow.some((tile, index) => tile !== reversedRow[index])) {
        moved = true;
      }
      this.board[i] = newRow.reverse();
    }

    if (moved) {
      this.addRandomTile();
    }
    this.updateUI();
  }

  moveUp() {
    let moved = false;

    for (let j = 0; j < 4; j++) {
      const column = this.board.map((row) => row[j]);
      const newColumn = this.mergeRow(column);

      for (let i = 0; i < 4; i++) {
        this.board[i][j] = newColumn[i];
      }

      if (newColumn.some((tile, index) => tile !== column[index])) {
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
    }
    this.updateUI();
  }

  moveDown() {
    let moved = false;

    for (let j = 0; j < 4; j++) {
      const column = this.board.map((row) => row[j]).reverse();
      const newColumn = this.mergeRow(column);

      for (let i = 0; i < 4; i++) {
        this.board[i][j] = newColumn[3 - i];
      }

      if (newColumn.some((tile, index) => tile !== column[index])) {
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
    }
    this.updateUI();
  }

  mergeRow(row) {
    const newRow = row.filter((tile) => tile !== 0);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow.splice(i + 1, 1);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.updateUI();
  }

  restart() {
    this.start();
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

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const randomValue = Math.random() < 0.1 ? 4 : 2;

    this.board[randomCell[0]][randomCell[1]] = randomValue;

    // #region animation
    // Trigger 'appear' animation
    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const cellElement = document.querySelector(
      `.game-field tr:nth-child(${row + 1}) td:nth-child(${col + 1})`,
    );

    cellElement.classList.add('appear');

    // remove class after animation
    setTimeout(() => cellElement.classList.remove('appear'), 300);
    // #endregion
  }

  updateUI() {
    const gameStatus = this.getStatus();
    const startMessage = document.querySelector('.message-start');
    const winMessage = document.querySelector('.message-win');
    const loseMessage = document.querySelector('.message-lose');

    startMessage.classList.add('hidden');

    if (gameStatus === 'win') {
      winMessage.classList.remove('hidden');
      loseMessage.classList.add('hidden');
    } else if (gameStatus === 'lose') {
      loseMessage.classList.remove('hidden');
      winMessage.classList.add('hidden');
    } else {
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
    }

    document.querySelector('.game-score').textContent = this.score;

    const cells = document.querySelectorAll('.field-cell');

    let cellIndex = 0;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const tileValue = this.board[i][j];
        const cell = cells[cellIndex];

        cell.classList.remove(
          'field-cell--2',
          'field-cell--4',
          'field-cell--8',
          'field-cell--16',
          'field-cell--32',
          'field-cell--64',
          'field-cell--128',
          'field-cell--256',
          'field-cell--512',
          'field-cell--1024',
          'field-cell--2048',
        );

        if (tileValue !== 0) {
          cell.classList.add(`field-cell--${tileValue}`);
          cell.textContent = tileValue;
        } else {
          cell.textContent = '';
        }

        cellIndex++;
      }
    }
  }

  updateScoreDisplay() {
    const scoreElement = document.querySelector('.score');

    scoreElement.textContent = this.score;

    // Add score update animation
    scoreElement.classList.add('updated');

    // Remove class after animation
    setTimeout(() => scoreElement.classList.remove('updated'), 300);
  }

  checkGameStatus() {
    const statuses = this.getStatus();
    const messageElement = document.querySelector('.game-status');

    if (statuses === 'win') {
      messageElement.textContent = 'You Win!';
    } else if (statuses === 'lose') {
      messageElement.textContent = 'Game Over!';
    } else {
      messageElement.textContent = 'Keep Going!';
    }
  }
}

module.exports = Game;
