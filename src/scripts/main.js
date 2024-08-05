'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gameBoard = Array.from(document.querySelectorAll('.field-cell'));
const scoreDisplay = document.querySelector('.game-score');
const startButton = document.querySelector('.button.start');
const container = document.querySelector('.container');
const messages = {
  idle: container.querySelector('.message-start'),
  lose: container.querySelector('.message-lose'),
  win: container.querySelector('.message-win'),
};

function render() {
  const state = game.getState();

  gameBoard.forEach((cell, index) => {
    const rowIndex = Math.floor(index / 4);
    const colIndex = index % 4;
    const cellValue = state[rowIndex][colIndex];

    cell.className = `field-cell field-cell--${cellValue}`;
    cell.textContent = cellValue === 0 ? '' : cellValue;
  });

  scoreDisplay.textContent = game.getScore();

  showMessage();
}

function showMessage() {
  const gameStatus = game.getStatus();

  for (const key in messages) {
    if (Object.hasOwnProperty.call(messages, key)) {
      const message = messages[key];

      if (message) {
        message.classList.toggle('hidden', key !== gameStatus);
      }
    }
  }
}

function startGame() {
  if (game.getStatus() === Game.STATUS.idle
  || game.getStatus() === Game.STATUS.lose
  || game.getStatus() === Game.STATUS.win) {
    game.start(); // Почати нову гру
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else if (game.getStatus() === Game.STATUS.playing) {
    game.restart(); // Перезапустити гру
    game.start(); // Почати нову гру після перезапуску
  }
  render();
}

function handleKeydown(e) {
  if (game.getStatus() !== Game.STATUS.playing) {
    return;
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
  render();
}

startButton.addEventListener('click', startGame);
document.addEventListener('keydown', handleKeydown);

render();
showMessage();
