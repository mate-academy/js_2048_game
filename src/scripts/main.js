'use strict';

/**
 * Game Class - 2048 Implementation
 */
class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.board = initialState || this.createEmptyBoard();

    if (initialState) {
      this.status = 'playing';
    }
  }

  createEmptyBoard() {
    return Array(this.size)
      .fill()
      .map(() => Array(this.size).fill(0));
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  moveRowLeft(row) {
    const newRow = [...row];
    let scoreIncrease = 0;
    let moved = false;

    const filteredRow = newRow.filter((cell) => cell !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        scoreIncrease += filteredRow[i];
        filteredRow[i + 1] = 0;
      }
    }

    const mergedRow = filteredRow.filter((cell) => cell !== 0);

    while (mergedRow.length < this.size) {
      mergedRow.push(0);
    }

    for (let i = 0; i < this.size; i++) {
      if (row[i] !== mergedRow[i]) {
        moved = true;
        break;
      }
    }

    return { newRow: mergedRow, scoreIncrease, moved };
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let totalScoreIncrease = 0;
    let boardChanged = false;
    const newBoard = [];

    for (let row = 0; row < this.size; row++) {
      const result = this.moveRowLeft(this.board[row]);

      newBoard.push(result.newRow);
      totalScoreIncrease += result.scoreIncrease;

      if (result.moved) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.board = newBoard;
      this.score += totalScoreIncrease;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let totalScoreIncrease = 0;
    let boardChanged = false;
    const newBoard = [];

    for (let row = 0; row < this.size; row++) {
      const reversedRow = [...this.board[row]].reverse();
      const result = this.moveRowLeft(reversedRow);

      newBoard.push(result.newRow.reverse());
      totalScoreIncrease += result.scoreIncrease;

      if (result.moved) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.board = newBoard;
      this.score += totalScoreIncrease;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let totalScoreIncrease = 0;
    let boardChanged = false;

    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = 0; row < this.size; row++) {
        column.push(this.board[row][col]);
      }

      const result = this.moveRowLeft(column);

      for (let row = 0; row < this.size; row++) {
        this.board[row][col] = result.newRow[row];
      }

      totalScoreIncrease += result.scoreIncrease;

      if (result.moved) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.score += totalScoreIncrease;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let totalScoreIncrease = 0;
    let boardChanged = false;

    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = 0; row < this.size; row++) {
        column.push(this.board[row][col]);
      }

      const reversedColumn = column.reverse();
      const result = this.moveRowLeft(reversedColumn);
      const finalColumn = result.newRow.reverse();

      for (let row = 0; row < this.size; row++) {
        this.board[row][col] = finalColumn[row];
      }

      totalScoreIncrease += result.scoreIncrease;

      if (result.moved) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.score += totalScoreIncrease;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  updateStatus() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (!this.canMove()) {
      this.status = 'lose';

      return;
    }

    this.status = 'playing';
  }

  canMove() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }
      }
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const current = this.board[row][col];

        if (col < this.size - 1 && this.board[row][col + 1] === current) {
          return true;
        }

        if (row < this.size - 1 && this.board[row + 1][col] === current) {
          return true;
        }
      }
    }

    return false;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }
}

// Game UI Implementation
const game = new Game();

// DOM elements
const startButton = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const gameField = document.querySelector('.game-field');

// Game state tracking
let gameStarted = false;
let gameWon = false;

function updateBoard() {
  const state = game.getState();
  const rows = gameField.querySelectorAll('.field-row');

  for (let row = 0; row < 4; row++) {
    const cells = rows[row].querySelectorAll('.field-cell');

    for (let col = 0; col < 4; col++) {
      const cell = cells[col];
      const value = state[row][col];

      // Clear all value classes
      cell.className = 'field-cell';
      cell.textContent = '';

      // Add value class and content if not empty
      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      }
    }
  }
}

function updateScore() {
  scoreElement.textContent = game.getScore();
}

function updateMessages() {
  // eslint-disable-next-line no-shadow
  const status = game.getStatus();

  // Hide all messages first
  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  switch (status) {
    case 'idle':
      startMessage.classList.remove('hidden');
      break;
    case 'win':
      if (!gameWon) {
        winMessage.classList.remove('hidden');
        gameWon = true;
      }
      break;
    case 'lose':
      loseMessage.classList.remove('hidden');
      break;
  }
}

function updateButton() {
  if (gameStarted) {
    startButton.textContent = 'Restart';
    startButton.className = 'button restart';
  } else {
    startButton.textContent = 'Start';
    startButton.className = 'button start';
  }
}

function updateDisplay() {
  updateBoard();
  updateScore();
  updateMessages();
  updateButton();
}

function handleStartRestart() {
  if (gameStarted) {
    game.restart();
    gameWon = false;
  } else {
    game.start();
    gameStarted = true;
  }

  updateDisplay();
}

// eslint-disable-next-line no-shadow
function handleKeyPress(event) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const previousState = JSON.stringify(game.getState());
  const previousScore = game.getScore();

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      game.moveLeft();
      break;
    case 'ArrowRight':
      event.preventDefault();
      game.moveRight();
      break;
    case 'ArrowUp':
      event.preventDefault();
      game.moveUp();
      break;
    case 'ArrowDown':
      event.preventDefault();
      game.moveDown();
      break;
    default:
      return;
  }

  const currentState = JSON.stringify(game.getState());
  const currentScore = game.getScore();

  if (previousState !== currentState || previousScore !== currentScore) {
    updateDisplay();
  }
}

function init() {
  startButton.addEventListener('click', handleStartRestart);
  document.addEventListener('keydown', handleKeyPress);

  updateDisplay();
}

// Start the application when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
