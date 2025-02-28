import Game from '../modules/Game.class';
import { GAME_STATUS } from '../constants';

const game = new Game();

const score = document.querySelector('.game-score');
const best = document.querySelector('.game-best');
const startButton = document.querySelector('.button.start');
const cells = document.querySelectorAll('.field-cell');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

let bestScore = localStorage.getItem('bestScore') || 0;

best.textContent = bestScore;

startButton.addEventListener('click', () => {
  const isNewGame = startButton.classList.contains('start');

  if (isNewGame) {
    game.start();
    startButton.textContent = 'RESTART';
    startButton.classList.replace('start', 'restart');
  } else {
    game.restart();
    startButton.textContent = 'START';
    startButton.classList.replace('restart', 'start');
  }

  updateUI();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== GAME_STATUS.PLAYING) {
    return;
  }

  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    e.preventDefault();
  }

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

  updateUI();
});

function updateUI() {
  updateGrid();
  updateScores();
  updateMessages();
}

function updateGrid() {
  const grid = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = grid[row][col];

    cell.textContent = value || '';
    cell.className = `field-cell${value ? ` field-cell--${value}` : ''}`;
  });
}

function updateScores() {
  const currentScore = game.getScore();

  score.textContent = currentScore;

  if (currentScore > bestScore) {
    bestScore = currentScore;
    localStorage.setItem('bestScore', bestScore);
    best.textContent = bestScore;
  }
}

function updateMessages() {
  const gameStatus = game.getStatus();

  messageWin.classList.toggle('hidden', gameStatus !== GAME_STATUS.WIN);
  messageLose.classList.toggle('hidden', gameStatus !== GAME_STATUS.LOSE);
  messageStart.classList.toggle('hidden', gameStatus !== GAME_STATUS.IDLE);
}
