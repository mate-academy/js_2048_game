'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const gamePoles = [...document.querySelectorAll('.field-row')];
const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');

const renderNumbers = () => {
  const actualState = game.cells;

  gamePoles.forEach((pole, rowIndex) => {
    const cells = [...pole.querySelectorAll('.field-cell')];

    cells.forEach((cell, colIndex) => {
      cell.className = 'field-cell';
      cell.innerText = '';

      const cellValue = actualState[rowIndex][colIndex];

      if (cellValue > 0) {
        cell.classList.add(`field-cell--${cellValue}`);
        cell.innerText = cellValue;
      }
    });
  });
};

const clickHandle = (moveFunction) => {
  if (game.status !== 'playing') {
    return;
  }

  moveFunction();
  game.nextTurn();
  score.innerText = game.getScore();
  renderNumbers();
  handleGameResult();
};

const handleArrowClick = (e) => {
  switch (e.key) {
    case 'ArrowUp':
      clickHandle(() => game.moveUp());
      break;
    case 'ArrowDown':
      clickHandle(() => game.moveDown());
      break;
    case 'ArrowLeft':
      clickHandle(() => game.moveLeft());
      break;
    case 'ArrowRight':
      clickHandle(() => game.moveRight());
      break;
    default:
      break;
  }
};

button.addEventListener('click', () => {
  if (game.status === 'idle') {
    game.start();
    button.classList.replace('start', 'restart');
    button.innerText = 'Restart';
    messageStart.classList.add('hidden');
  } else {
    game.restart();
    button.classList.replace('restart', 'start');
    button.innerText = 'Start';
    messageStart.classList.remove('hidden');
  }

  document[
    game.status === 'playing' ? 'addEventListener' : 'removeEventListener'
  ]('keydown', handleArrowClick);

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  renderNumbers();
});

function handleGameResult() {
  if (game.status === 'win' || game.status === 'lose') {
    const message = game.status === 'win' ? messageWin : messageLose;

    message.classList.remove('hidden');
    messageStart.classList.add('hidden');
    document.removeEventListener('keydown', handleArrowClick);
  }
}
