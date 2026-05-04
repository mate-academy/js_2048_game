'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

class Game {
  constructor(initialState) {
    this.initialState = initialState
      ? JSON.parse(JSON.stringify(initialState))
      : null;

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
    } else {
      this.checkGameOver();

      if (this.board.flat().includes(2048)) {
        this.status = 'won';
      }
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

    if (this.board.flat().every((cell) => cell === 0)) {
      this.setupRandom();
      this.setupRandom();
    }
  }

  restart() {
    this.score = 0;
    this.status = 'playing';
    this.isStarted = false;

    if (this.initialState) {
      this.board = JSON.parse(JSON.stringify(this.initialState));
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      // this.setupRandom();
      // this.setupRandom();
    }
  }

  compactRow(row) {
    const filteredRow = row.filter((num) => num !== 0);
    const finalRow = [];

    for (let i = 0; i < filteredRow.length; i++) {
      if (i < filteredRow.length - 1 && filteredRow[i] === filteredRow[i + 1]) {
        const doubled = filteredRow[i] * 2;

        finalRow.push(doubled);
        this.score += doubled;
        i++;
      } else {
        finalRow.push(filteredRow[i]);
      }
    }

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
      this.isStarted = true;
      this.setupRandom();

      if (this.board.flat().includes(2048)) {
        this.status = 'won';
      }
      this.checkGameOver();
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

  if (game.isStarted) {
    startMessage.classList.add('hidden');
  } else {
    startMessage.classList.remove('hidden');
  }

  winMessage.classList.toggle('hidden', gameStatus !== 'won');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lost');
}

function updateButton() {
  const btn = document.querySelector('.button');

  if (game.isStarted) {
    btn.textContent = 'Restart';
    btn.classList.add('restart');
    btn.classList.remove('start');
  } else {
    btn.textContent = 'Start';
    btn.classList.add('start');
    btn.classList.remove('restart');
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
  if (!game.isStarted) {
    game.start();
  } else {
    game.restart();
  }
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
