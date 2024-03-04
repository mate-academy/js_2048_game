'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const container = document.querySelector('.container');
const button = container.querySelector('.button');
const messageStart = container.querySelector('.message-start');
const messageRestart = container.querySelector('.message-restart');
const messageLose = container.querySelector('.message-lose');
const messageWin = container.querySelector('.message-win');
const scoreInfo = container.querySelector('.game-score');

const gameField = document.querySelector('.game-field');
const fieldRows = [...gameField.querySelectorAll('.field-row')];
const fieldCells = fieldRows.map((row) => [...row.children]);

function renderGameField(state, cells) {
  state.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      const cellItem = cells[rowIndex][cellIndex];

      if (cell === 0) {
        cellItem.classList = 'field-cell';
        cellItem.innerHTML = '';
      } else {
        cellItem.classList = `field-cell field-cell--${cell}`;
        cellItem.innerHTML = cell;
      }
    });
  });
}

function renderScore(score, element) {
  element.innerHTML = score;
}

function renderMessage() {
  const gameStatus = game.getStatus();

  switch (gameStatus) {
    case 'playing':
      messageStart.classList.add('hidden');
      messageRestart.classList.remove('hidden');
      break;
    case 'win':
      messageRestart.classList.add('hidden');
      messageWin.classList.remove('hidden');
      break;
    case 'lose':
      messageStart.classList.add('hidden');
      messageRestart.classList.add('hidden');
      messageLose.classList.remove('hidden');
      break;
    default:
      messageStart.classList.remove('hidden');
      messageRestart.classList.add('hidden');
      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');
  }
}

button.addEventListener('click', () => {
  if (button.textContent === 'Start') {
    game.start();

    const state = game.getState();

    renderGameField(state, fieldCells);

    button.textContent = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');
  } else {
    game.restart();

    const state = game.getState();
    const score = game.getScore();

    renderScore(score, scoreInfo);
    renderGameField(state, fieldCells);

    button.textContent = 'Start';
    button.classList.add('start');
    button.classList.remove('restart');
  }

  renderMessage();
});

document.addEventListener('keydown', (keyboard) => {
  keyboard.preventDefault();

  const gameStatus = game.getStatus();

  if (gameStatus !== 'playing') {
    return;
  }

  switch (keyboard.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    default:
      break;
  }

  const state = game.getState();
  const score = game.getScore();

  renderGameField(state, fieldCells, score);
  renderScore(score, scoreInfo);
  renderMessage();
});
