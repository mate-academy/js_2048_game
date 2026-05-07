'use strict';

class Game {
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
  }

  start() {
    this.addRandomTile();
    this.addRandomTile();
  }

  getStatus() {
    return this.status;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  slide(row) {
    const arr = row.filter((num) => num !== 0);

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        this.score += arr[i];
        arr.splice(i + 1, 1);
      }
    }

    while (arr.length < 4) {
      arr.push(0);
    }

    return arr;
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells[randomIndex];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveLeft() {
    const lastState = JSON.stringify(this.board);

    for (let i = 0; i < 4; i++) {
      this.board[i] = this.slide(this.board[i]);
    }
    this.afterMove(lastState);
  }

  moveRight() {
    const lastState = JSON.stringify(this.board);

    for (let i = 0; i < 4; i++) {
      this.board[i] = this.slide(this.board[i].reverse()).reverse();
    }
    this.afterMove(lastState);
  }

  transpose() {
    const tempBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        tempBoard[i][j] = this.board[j][i];
      }
    }
    this.board = tempBoard;
  }

  moveUp() {
    const lastState = JSON.stringify(this.board);

    this.transpose();

    for (let i = 0; i < 4; i++) {
      this.board[i] = this.slide(this.board[i]);
    }
    this.transpose();
    this.afterMove(lastState);
  }

  moveDown() {
    const lastState = JSON.stringify(this.board);

    this.transpose();

    for (let i = 0; i < 4; i++) {
      this.board[i] = this.slide(this.board[i].reverse()).reverse();
    }
    this.transpose();
    this.afterMove(lastState);
  }

  afterMove(lastState) {
    if (lastState !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing'; // Исправлено (было gamestatus)
    this.start();
  }

  updateStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'won';

      return;
    }

    if (this.getEmptyCells().length === 0 && !this.canMove()) {
      this.status = 'lost';
    }
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }
}

const game = new Game();
const scoreElement = document.querySelector('.game-score');
const fieldCells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button.start');

const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

function updateUI() {
  const state = game.getState().flat();
  const gameStatus = game.getStatus();
  const score = game.getScore();

  fieldCells.forEach((cell, i) => {
    const val = state[i];

    cell.textContent = val > 0 ? val : '';
    cell.className = `field-cell field-cell--${val}`;
  });

  if (scoreElement) {
    scoreElement.textContent = score;
  }

  if (messageWin) {
    messageWin.classList.toggle('hidden', gameStatus !== 'won');
  }

  if (messageLose) {
    messageLose.classList.toggle('hidden', gameStatus !== 'lost');
  }

  if (messageStart) {
    messageStart.classList.toggle(
      'hidden',
      gameStatus !== 'playing' || score > 0 || state.some((v) => v > 0),
    );
  }
}

if (startButton) {
  startButton.addEventListener('click', () => {
    startButton.textContent = 'Restart';
    startButton.classList.add('restart');
    game.restart();
    updateUI();
  });
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const moves = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  if (moves[e.key]) {
    moves[e.key]();
    updateUI();
  }
});

updateUI();
