'use strict';

const Game = require('../modules/Game.class');
const PROGRESS_KEY = '2048-progress';

const game = new Game();

const GAME_STATUS = Game.STATUS;
const BOARD_SIZE = Game.BOARD_SIZE;

const startBtn = document.querySelector('.button.start');
const restartBtn = document.querySelector('.button.restart');

const score = document.querySelector('.game-score');
const board = document.querySelectorAll('.field-cell');

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

function save() {
  if (game.getStatus() !== GAME_STATUS.PLAYING) {
    return;
  }

  localStorage.setItem(
    PROGRESS_KEY,
    JSON.stringify({
      gameState: game.getState(),
      gameScore: game.getScore(),
      gameStatus: game.getStatus(),
    }),
  );
}

function renderBoard() {
  board.forEach((cell, i) => {
    const value = game.getState()[Math.floor(i / BOARD_SIZE)][i % BOARD_SIZE];

    cell.textContent = value || '';

    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function renderScore() {
  score.textContent = game.getScore();
}

function renderStatus() {
  const currStatus = game.getStatus();

  messageStart.classList.toggle('hidden', currStatus !== GAME_STATUS.IDLE);
  messageLose.classList.toggle('hidden', currStatus !== GAME_STATUS.LOSE);
  messageWin.classList.toggle('hidden', currStatus !== GAME_STATUS.WIN);
  startBtn.classList.toggle('hidden', currStatus !== GAME_STATUS.IDLE);
  restartBtn.classList.toggle('hidden', currStatus === GAME_STATUS.IDLE);
}

function render() {
  renderBoard();
  renderScore();
  renderStatus();

  save();
}

function start() {
  game.start();
  render();
}

function restart() {
  localStorage.removeItem(PROGRESS_KEY);
  game.restart();
  render();
}

startBtn.addEventListener('click', () => {
  start();
});

restartBtn.addEventListener('click', () => {
  restart();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key.toUpperCase() === 'A') {
    game.moveLeft();
    render();
  } else if (e.key === 'ArrowRight' || e.key.toUpperCase() === 'D') {
    game.moveRight();
    render();
  } else if (e.key === 'ArrowUp' || e.key.toUpperCase() === 'W') {
    game.moveUp();
    render();
  } else if (e.key === 'ArrowDown' || e.key.toUpperCase() === 'S') {
    game.moveDown();
    render();
  } else if (e.key === 'Escape') {
    restart();
  } else if (e.key === 'Enter' && game.getStatus() === GAME_STATUS.IDLE) {
    start();
  }
});

const saveData = localStorage.getItem(PROGRESS_KEY);

if (saveData) {
  const { gameState, gameScore, gameStatus } = JSON.parse(saveData);

  game.state = gameState;
  game.score = gameScore;
  game.status = gameStatus;
  render();
}
