'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

const cells = document.querySelectorAll('.field-cell');

function renderBoard() {
  const state = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    } else {
      cell.textContent = '';
    }
  });
}

const scoreElement = document.querySelector('.game-score');

function updateScore() {
  scoreElement.textContent = game.getScore();
}

class Game {
  constructor(initialState = null) {
    this.initialState = initialState;
    this.init();
  }

  init() {
    this.state = this.initialState
      ? this.initialState.map((row) => [...row])
      : this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => 0));
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }
  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }
    this.status = 'playing';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';

    const startMessage = document.querySelector('.message-start');

    if (startMessage) {
      startMessage.classList.add('hidden');
    }

    if (!this.initialState) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.state = this.initialState
      ? this.initialState.map((r) => [...r])
      : this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  compress(row) {
    const filtered = row.filter((x) => x !== 0);
    let i = 0;

    while (i < filtered.length - 1) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered.splice(i + 1, 1);
        i++;
      } else {
        i++;
      }
    }

    while (filtered.length < 4) {
      filtered.push(0);
    }

    return filtered;
  }

  // Методи-обгортки для сумісності з вашим інтерфейсом
  moveLeft() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
      const row = [...this.state[r]];
      const newRow = this.compress(row);

      if (newRow.toString() !== row.toString()) {
        moved = true;
      }
      this.state[r] = newRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }

    return moved;
  }
  moveRight() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
      const reversed = [...this.state[r]].reverse();
      const newRow = this.compress(reversed).reverse();

      if (JSON.stringify(newRow) !== JSON.stringify(this.state[r])) {
        moved = true;
      }

      this.state[r] = newRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }

    return moved;
  }

  moveUp() {
    let moved = false;

    if (this.status !== 'playing') {
      return false;
    }

    for (let c = 0; c < 4; c++) {
      const column = [];

      for (let r = 0; r < 4; r++) {
        column.push(this.state[r][c]);
      }

      const newColumn = this.compress(column);

      if (JSON.stringify(newColumn) !== JSON.stringify(column)) {
        moved = true;
      }

      for (let r = 0; r < 4; r++) {
        this.state[r][c] = newColumn[r];
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }

    return moved;
  }

  moveDown() {
    let moved = false;

    for (let c = 0; c < 4; c++) {
      const column = [];

      for (let r = 0; r < 4; r++) {
        column.push(this.state[r][c]);
      }

      const newColumn = this.compress(column.reverse()).reverse();

      for (let r = 0; r < 4; r++) {
        if (this.state[r][c] !== newColumn[r]) {
          moved = true;
        }

        this.state[r][c] = newColumn[r];
      }
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }

    return moved;
  }

  transpose() {
    this.state = this.state[0].map((_, i) => this.state.map((row) => row[i]));

    if (!this.state || !this.state.length) {
    }
  }

  checkGameStatus() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }

    if (this.status !== 'win' && this.status !== 'lose') {
      this.status = 'playing';
    }
  }

  canMove() {
    if (!Array.isArray(this.state) || this.state.length === 0) {
      return false;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          return true;
        }

        if (c < 3 && this.state[r][c] === this.state[r][c + 1]) {
          return true;
        }

        if (r < 3 && this.state[r][c] === this.state[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const game = new Game();

function updateMessages() {
  const newstatus = game.getStatus();

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  if (newstatus === 'win') {
    winMessage.classList.remove('hidden');
  }

  if (newstatus === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }
  renderBoard();
  updateScore();
  updateMessages();
});

const startBtn = document.querySelector('.start');

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }
  renderBoard();
  updateScore();
  updateMessages();
});

game.getState();
game.getScore();
game.getStatus();
