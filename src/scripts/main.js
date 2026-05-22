'use strict';
import Game from '../modules/Game.class';

// Рандомити місце положення початкове цифорок
// console.log(Game);
const game = new Game();

// Write your code here
const gameField = document.querySelector('.game-field');
const start = document.querySelector('.start');
const gameScore = document.querySelector('.game-score');
const bestScore = document.querySelector('.best-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const boardWrapper = document.querySelector('.board-wrapper');

function startGame() {
  game.restart();

  start.textContent = 'Restart';

  winMessage.classList.add('hidden');
  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  const state = game.getState();

  renderRows(state);

  gameScore.textContent = game.getScore();
  bestScore.textContent = game.getBestScore();
}

function renderRows(state) {
  state.forEach((rows, i) => {
    rows.forEach((rowValue, j) => {
      const cell = gameField.rows[i].cells[j];

      if (rowValue !== 0) {
        cell.textContent = rowValue;
        cell.className = `field-cell field-cell--${rowValue}`;
      } else {
        cell.textContent = '';
        cell.className = 'field-cell';
      }
    });
  });
}

function handleInput(e) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let didMove = false;

  switch (e.code) {
    case 'ArrowLeft':
      didMove = game.moveLeft();
      break;
    case 'ArrowRight':
      didMove = game.moveRight();
      break;
    case 'ArrowUp':
      didMove = game.moveUp();
      break;
    case 'ArrowDown':
      didMove = game.moveDown();
      break;
  }

  if (didMove) {
    e.preventDefault();
    renderRows(game.getState());
    gameScore.textContent = game.getScore();
    bestScore.textContent = game.getBestScore();

    const currentStatus = game.getStatus();

    if (currentStatus === 'win') {
      winMessage.classList.remove('hidden');
    } else if (currentStatus === 'lose') {
      loseMessage.classList.remove('hidden');
    }
  }
}

start.addEventListener('click', startGame);

boardWrapper.addEventListener('click', (e) => {
  const clickedRestart = e.target.closest('.btn-overlay');

  if (clickedRestart) {
    startGame();
  }
});

document.addEventListener('keydown', handleInput);
