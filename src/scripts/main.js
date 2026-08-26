'use strict';

const Game = require('../modules/Game.class');

const game = new Game();
const tableRows = [...document.querySelectorAll('tr')];

const buttonStart = document.querySelector('.start');

buttonStart.addEventListener('click', (e) => {
  if (buttonStart.textContent === 'Start') {
    game.start();
    document.querySelector('.message-start').classList.add('hidden');

    buttonStart.textContent = 'Restart';
    buttonStart.classList.replace('start', 'restart');
  } else if (buttonStart.textContent === 'Restart') {
    game.restart();
    game.start();
    renderScore();
    clearAllFields();
    document.querySelector('.message-lose').classList.add('hidden');
    document.querySelector('.message-win').classList.add('hidden');
    document.addEventListener('keydown', handleKeyPresses);
  }

  renderMatrix();
});

const handleKeyPresses = (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      clearAllFields();
      renderMatrix();
      break;

    case 'ArrowDown':
      game.moveDown();
      clearAllFields();
      renderMatrix();
      break;

    case 'ArrowRight':
      game.moveRight();
      clearAllFields();
      renderMatrix();
      break;

    case 'ArrowLeft':
      game.moveLeft();
      clearAllFields();
      renderMatrix();
      break;

    default:
      break;
  }

  renderScore();

  if (game.gameWon) {
    document.removeEventListener('keydown', handleKeyPresses);
    showHiddenMessage('.message-win');
  }

  if (!game.checkAvailableMoves()) {
    showHiddenMessage('.message-lose');
  }
};

document.addEventListener('keydown', handleKeyPresses);

function renderMatrix() {
  const gameState = game.getState();

  tableRows.map((row, rowIndex) => {
    const elements = [...row.querySelectorAll('td')];

    return elements.map((element, elementIndex) => {
      const gameElementValue = gameState[rowIndex][elementIndex].toString();

      if (element.textContent !== gameElementValue) {
        if (gameElementValue !== '0') {
          element.textContent = gameElementValue;
        }
      }

      return element;
    });
  });
}

function renderScore() {
  document.querySelector('.game-score').textContent = game.getScore();
}

function clearAllFields() {
  tableRows.map((row, rowIndex) => {
    const elements = [...row.querySelectorAll('td')];

    return elements.map((element, elementIndex) => {
      element.textContent = '';

      return element;
    });
  });
}

function showHiddenMessage(messageClass) {
  const classesOfMessage = [...document.querySelector(messageClass).classList];

  if (classesOfMessage.includes('hidden')) {
    classesOfMessage.pop();
  }

  document.querySelector(messageClass).classList = classesOfMessage.join(' ');
}
