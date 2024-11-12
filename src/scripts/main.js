'use strict';

import { WIN, LOSE, Game } from '../modules/Game.class';

const game = new Game(null, showWinMessage, showLoseMessage);

const startButton = document.querySelector('.start');
const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const recordElement = document.querySelector('.best__score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function showWinMessage() {
  messageWin.classList.remove('hidden');
}

function showLoseMessage() {
  messageLose.classList.remove('hidden');
}

function hideMessageStart() {
  messageStart.classList.add('hidden');
}

function hideMessageLose() {
  messageLose.classList.add('hidden');
}

function hideMessageWin() {
  messageWin.classList.add('hidden');
}

function updateScore(value) {
  score.textContent = value;
}

function saveScore(sscore) {
  const currentRecord = localStorage.getItem('highScore');

  if (!currentRecord || sscore > currentRecord) {
    localStorage.setItem('highScore', sscore);
    displayRecord();
  }
}

function displayRecord() {
  const highScore = localStorage.getItem('highScore') || 0;

  recordElement.textContent = highScore;
}

displayRecord();

game.getScore = function (moved, value) {
  if (moved && value > 0) {
    this.score += value;
    updateScore(this.score);
    saveScore(this.score);
  }
};

startButton.addEventListener('click', () => {
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  score.textContent = '0';

  cells.forEach((cell) => {
    cell.classList.remove('hidden');
  });

  if (game.status === WIN || game.status === LOSE) {
    hideMessageWin();
    hideMessageLose();
  }

  game.start();
  hideMessageStart();
  hideMessageLose();
  hideMessageWin();
  displayRecord();
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
  }
});
