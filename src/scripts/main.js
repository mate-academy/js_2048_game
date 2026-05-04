'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

class Game {
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0], // 0
      [0, 0, 0, 0], // 1
      [0, 0, 0, 0], // 2
      [0, 0, 0, 0], // 3
    ];

    this.score = 0; // рахунок
    this.status = 'playing'; // статус гри
    this.isStarted = false;

    if (!initialState) {
      this.setupRandom();
      this.setupRandom();
    }
  }

  getState() {
    return this.board; // масив (дошка)
  }

  getScore() {
    return this.score; // поточні очки
  }

  getStatus() {
    return this.status; // 'playing', 'won' або 'lost'
  }

  setupRandom() {
    const emptyCells = [];

    for (let y = 0; y < this.board.length; y++) {
      for (let x = 0; x < this.board[y].length; x++) {
        if (this.board[y][x] === 0) {
          emptyCells.push({ y: y, x: x });
        }
      }
    }

    if (emptyCells.length !== 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const coords = emptyCells[randomIndex];
      const newValue = Math.random() < 0.1 ? 4 : 2;

      this.board[coords.y][coords.x] = newValue;
    }
  }

  start() {
    this.status = 'playing';
    this.isStarted = true;
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
    this.setupRandom();
    this.setupRandom();
    this.isStarted = true;
  }

  compactRow(row) {
    const filteredRow = row.filter((num) => num !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;

        this.score += filteredRow[i];

        filteredRow[i + 1] = 0;
      }
    }

    const finalRow = filteredRow.filter((num) => num !== 0);

    if (finalRow.includes(2048)) {
      this.status = 'won';
    }

    while (finalRow.length < 4) {
      finalRow.push(0);
    }

    return finalRow;
  }

  checkMoveSuccess(stateBefore) {
    if (stateBefore !== JSON.stringify(this.board)) {
      this.setupRandom();
      this.checkGameOver();
      this.isStarted = true;
    }
  }

  checkGameOver() {
    if (this.status === 'won') {
      return false;
    }

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const current = this.board[y][x];

        if (current === 0) {
          return false;
        }

        if (x < 3 && current === this.board[y][x + 1]) {
          return false;
        }

        if (y < 3 && current === this.board[y + 1][x]) {
          return false;
        }
      }
    }

    this.status = 'lost';

    return true;
  }

  moveLeft() {
    const stateBefore = JSON.stringify(this.board);

    for (let i = 0; i < 4; i++) {
      this.board[i] = this.compactRow(this.board[i]);
    }

    this.checkMoveSuccess(stateBefore);
  }

  moveRight() {
    const stateBefore = JSON.stringify(this.board);

    for (let i = 0; i < 4; i++) {
      const row = this.board[i];
      const reversed = [...row].reverse();
      const processed = this.compactRow(reversed);

      this.board[i] = processed.reverse();
    }

    this.checkMoveSuccess(stateBefore);
  }

  moveUp() {
    const stateBefore = JSON.stringify(this.board);

    for (let x = 0; x < 4; x++) {
      const column = [
        this.board[0][x],
        this.board[1][x],
        this.board[2][x],
        this.board[3][x],
      ];
      const processed = this.compactRow(column);

      this.board[0][x] = processed[0];
      this.board[1][x] = processed[1];
      this.board[2][x] = processed[2];
      this.board[3][x] = processed[3];
    }

    this.checkMoveSuccess(stateBefore);
  }

  moveDown() {
    const stateBefore = JSON.stringify(this.board);

    for (let x = 0; x < 4; x++) {
      const column = [
        this.board[0][x],
        this.board[1][x],
        this.board[2][x],
        this.board[3][x],
      ];

      column.reverse();

      const processed = this.compactRow(column);

      processed.reverse();

      this.board[0][x] = processed[0];
      this.board[1][x] = processed[1];
      this.board[2][x] = processed[2];
      this.board[3][x] = processed[3];
    }

    this.checkMoveSuccess(stateBefore);
  }
}

const game = new Game();

function updateStatusUI() {
  const gameStatus = game.getStatus();
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');
  const startMessage = document.querySelector('.message-start');
  const scoreDisplay = document.querySelector('.game-score');

  scoreDisplay.textContent = game.getScore();

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  startMessage.classList.add('hidden');

  if (gameStatus === 'playing') {
    if (!game.isStarted) {
      startMessage.classList.remove('hidden');
    }
  } else if (gameStatus === 'won') {
    winMessage.classList.remove('hidden');
  } else if (gameStatus === 'lost') {
    loseMessage.classList.remove('hidden');
  }
}

function updateButton() {
  const btn = document.querySelector('.button'); // або .start / .restart

  if (game.isStarted === true || game.getStatus() !== 'playing') {
    btn.textContent = 'Restart';
    btn.classList.remove('start');
    btn.classList.add('restart');
  } else {
    btn.textContent = 'Start';
    btn.classList.remove('restart');
    btn.classList.add('start');
  }
}

function draw() {
  const state = game.getState();
  const cells = document.querySelectorAll('.field-cell');
  const flatBoard = state.flat();

  cells.forEach((cell, i) => {
    const value = flatBoard[i];

    cell.className = 'field-cell';

    if (value > 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    } else {
      cell.textContent = '';
    }
  });

  updateStatusUI();
  updateButton();
}

document.querySelector('.button').addEventListener('click', () => {
  game.restart();
  draw();
});

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

  draw();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Game;
}
