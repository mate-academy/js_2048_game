'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Write your code here

function slideRowLeft(row) {
  const nonZero = row.filter((num) => num !== 0);
  const zerosCount = 4 - nonZero.length;
  const zeros = Array(zerosCount).fill(0);

  return [...nonZero, ...zeros];
}

function mergeRowLeft(row) {
  const result = [];
  let scoreDelta = 0;

  for (let i = 0; i < row.length; i++) {
    if (row[i] === row[i + 1] && row[i] !== 0) {
      const value = row[i] * 2;

      result.push(value);
      scoreDelta += value;
      i++;
    } else {
      result.push(row[i]);
    }
  }

  return {
    row: slideRowLeft(result),
    scoreDelta,
  };
}

function boardsAreEqual(board1, board2) {
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if (board1[row][col] !== board2[row][col]) {
        return false;
      }
    }
  }

  return true;
}

function reverseRow(row) {
  return [...row].reverse();
}

function getColumn(board, index) {
  return board.map((row) => row[index]);
}

function setColumn(board, index, column) {
  for (let row = 0; row < 4; row++) {
    board[row][index] = column[row];
  }
}
class Game {
  constructor(initialState) {
    this.board =
      initialState ?? Array.from({ length: 4 }, () => Array(4).fill(0));

    this.score = 0;
    this.status = 'idle';
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  getState() {
    return this.board;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = value;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => [...row]);
    const newBoard = [];
    let totalScoreDelta = 0;

    this.board.forEach((row) => {
      const { row: newRow, scoreDelta } = mergeRowLeft(slideRowLeft(row));

      newBoard.push(newRow);
      totalScoreDelta += scoreDelta;
    });

    if (!boardsAreEqual(oldBoard, newBoard)) {
      this.board = newBoard;
      this.score += totalScoreDelta;
      this.addRandomTile();
      this.afterMove();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => [...row]);
    const newBoard = [];
    let totalScoreDelta = 0;

    this.board.forEach((row) => {
      const reversed = reverseRow(row);

      const { row: merged, scoreDelta } = mergeRowLeft(slideRowLeft(reversed));

      const finalRow = reverseRow(merged);

      newBoard.push(finalRow);
      totalScoreDelta += scoreDelta;
    });

    if (!boardsAreEqual(oldBoard, newBoard)) {
      this.board = newBoard;
      this.score += totalScoreDelta;
      this.addRandomTile();
      this.afterMove();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => [...row]);
    let totalScoreDelta = 0;

    for (let col = 0; col < 4; col++) {
      const column = getColumn(this.board, col);

      const { row: mergedColumn, scoreDelta } = mergeRowLeft(
        slideRowLeft(column),
      );

      setColumn(this.board, col, mergedColumn);
      totalScoreDelta += scoreDelta;
    }

    if (!boardsAreEqual(oldBoard, this.board)) {
      this.score += totalScoreDelta;
      this.addRandomTile();
      this.afterMove();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => [...row]);
    let totalScoreDelta = 0;

    for (let col = 0; col < 4; col++) {
      const column = getColumn(this.board, col);
      const reversedColumn = reverseRow(column);

      const { row: mergedColumn, scoreDelta } = mergeRowLeft(
        slideRowLeft(reversedColumn),
      );

      const finalColumn = reverseRow(mergedColumn);

      setColumn(this.board, col, finalColumn);
      totalScoreDelta += scoreDelta;
    }

    if (!boardsAreEqual(oldBoard, this.board)) {
      this.score += totalScoreDelta;
      this.addRandomTile();
      this.afterMove();
    }
  }

  has2048() {
    return this.board.some((row) => row.some((cell) => cell === 2048));
  }

  canMove() {
    if (this.getEmptyCells().length > 0) {
      return true;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }
      }
    }

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameOver() {
    if (!this.canMove()) {
      this.status = 'lost';
    }
  }

  afterMove() {
    if (this.has2048()) {
      this.status = 'won';

      return;
    }

    this.checkGameOver();
  }

  restart() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }
}

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const scoreEl = document.querySelector('.game-score');
const startBtn = document.querySelector('.start');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const board = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  if (gameStatus === 'playing') {
    startBtn.textContent = 'Restart';
    startBtn.classList.add('restart');
    startBtn.classList.remove('start');
  }

  let index = 0;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = board[row][col];
      const cell = cells[index];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }

      index++;
    }
  }

  scoreEl.textContent = String(score);

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  }

  if (gameStatus === 'won') {
    messageWin.classList.remove('hidden');
  }

  if (gameStatus === 'lost') {
    messageLose.classList.remove('hidden');
  }
}

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    default:
      return;
  }

  render();
});

render();
