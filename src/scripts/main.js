'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

const SIZE = 4;

class Game {
  static Status = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = this.cloneBoard(initialState);
    this.board = this.cloneBoard(initialState);
    this.score = 0;
    this.status = Game.Status.IDLE;
  }

  cloneBoard(board) {
    return board.map((row) => [...row]);
  }

  transformRow(row) {
    return this.transformLine([...row].reverse()).reverse();
  }

  moveLeft() {
    this.move((board) => board.map((row) => this.transformLine(row)));
  }

  moveRight() {
    this.move((board) => board.map((row) => this.transformRow(row)));
  }

  moveUp() {
    this.move((board) => {
      const transposed = this.transpose(board);
      const moved = transposed.map((row) => this.transformLine(row));

      return this.transpose(moved);
    });
  }

  moveDown() {
    this.move((board) => {
      const transposed = this.transpose(board);
      const moved = transposed.map((row) => this.transformRow(row));

      return this.transpose(moved);
    });
  }

  getState() {
    return this.cloneBoard(this.board);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== Game.Status.IDLE) {
      return;
    }

    this.status = Game.Status.PLAYING;

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.cloneBoard(this.initialState);
    this.score = 0;
    this.status = Game.Status.IDLE;
  }

  move(transform) {
    if (this.status !== Game.Status.PLAYING) {
      return;
    }

    this.movePoints = 0;

    const newBoard = transform(this.board);

    const hasChanged = !this.boardsAreEqual(this.board, newBoard);

    if (!hasChanged) {
      return;
    }

    this.board = newBoard;
    this.score += this.movePoints;

    this.addRandomTile();

    if (this.hasWinningTile()) {
      this.status = Game.Status.WIN;
    } else if (!this.canMove()) {
      this.status = Game.Status.LOSE;
    }
  }

  transformLine(line) {
    const filtered = line.filter((value) => value !== 0);
    const result = [];

    for (let i = 0; i < filtered.length; i++) {
      const current = filtered[i];
      const next = filtered[i + 1];

      if (current === next) {
        const merged = current * 2;

        result.push(merged);
        this.movePoints += merged;
        i++;
      } else {
        result.push(current);
      }
    }

    while (result.length < SIZE) {
      result.push(0);
    }

    return result;
  }

  transpose(board) {
    return board.map((_, rowIndex) => board.map((row) => row[rowIndex]));
  }

  boardsAreEqual(boardA, boardB) {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (boardA[r][c] !== boardB[r][c]) {
          return false;
        }
      }
    }

    return true;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  hasWinningTile() {
    return this.board.some((row) => row.some((cell) => cell === 2048));
  }

  canMove() {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const value = this.board[r][c];

        if (value === 0) {
          return true;
        }

        if (c + 1 < SIZE && this.board[r][c + 1] === value) {
          return true;
        }

        if (r + 1 < SIZE && this.board[r + 1][c] === value) {
          return true;
        }
      }
    }

    return false;
  }
}

// -------------------------------------------------------------
// UI logic
// -------------------------------------------------------------

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const button = document.querySelector('.button');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function render() {
  const state = game.getState();
  const flatState = state.flat();

  cells.forEach((cell, index) => {
    const value = flatState[index];

    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    } else {
      cell.textContent = '';
    }
  });

  scoreEl.textContent = game.getScore();

  const gameStatus = game.getStatus();

  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
}

function handleStart() {
  if (button.classList.contains('start')) {
    game.start();

    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');

    startMessage.classList.add('hidden');
  } else {
    game.restart();

    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');

    startMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
  }

  render();
}

function handleKeyDown(e) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      e.preventDefault();
      game.moveLeft();
      break;

    case 'ArrowRight':
      e.preventDefault();
      game.moveRight();
      break;

    case 'ArrowUp':
      e.preventDefault();
      game.moveUp();
      break;

    case 'ArrowDown':
      e.preventDefault();
      game.moveDown();
      break;

    default:
      return;
  }

  render();
}

button.addEventListener('click', handleStart);
document.addEventListener('keydown', handleKeyDown);

render();
