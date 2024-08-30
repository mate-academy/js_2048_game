'use strict';

const gameField = document.querySelector('.game-field');
const gameCells = gameField.querySelectorAll('.field-cell');
const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');

const Game = require('../modules/Game.class');
const game = new Game();

button.addEventListener('click', () => {
  if (game.getStatus() === Game.GAME_STATUS.idle) {
    game.start();

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';

    startMessage.classList.add('hidden');
  } else {
    game.restart();

    winMessage.classList.add('hidden');
    loseMessage.classList.add('hidden');
    startMessage.classList.remove('hidden');

    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';
  }

  updateGameField(gameCells);

  document.addEventListener('keydown', handleKey);
});

const handleKey = (e) => {
  e.preventDefault();

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;

    case 'ArrowRight':
      game.moveRight();
      break;

    case 'ArrowDown':
      game.moveDown();
      break;

    case 'ArrowLeft':
      game.moveLeft();
      break;

    default:
      break;
  }

  updateGameField(gameCells);
  updateScore(gameScore);
  updateStatus();
};

const updateScore = (scoreContainer) => {
  scoreContainer.textContent = game.getScore();
};

const updateGameField = (cells) => {
  const flatState = game.getState().flat();

  cells.forEach((cell, index) => {
    cell.textContent = '';
    cell.className = 'field-cell';

    if (flatState[index]) {
      cell.textContent = flatState[index];
      cell.className = `field-cell field-cell--${flatState[index]}`;
    }
  });
};

const updateStatus = () => {
  const gameStatus = game.getStatus();

  if (gameStatus === Game.GAME_STATUS.win) {
    winMessage.classList.remove('hidden');
    document.removeEventListener('keydown', handleKey);
  }

  if (gameStatus === Game.GAME_STATUS.lose) {
    loseMessage.classList.remove('hidden');
    document.removeEventListener('keydown', handleKey);
  }
};
