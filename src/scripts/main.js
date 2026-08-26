'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
// import Game from '../modules/Game.class';

const game = new Game();
const tableRows = [...document.querySelectorAll('tr')];

// Write your code here
const buttonStart = document.querySelector('.start');

buttonStart.addEventListener('click', (e) => {
  if (buttonStart.textContent === 'Start') {
    game.start();
    document.querySelector('.message-start').classList.add('hidden');

    buttonStart.textContent = 'Restart';
    buttonStart.classList.replace('start', 'restart');
  }

  if (buttonStart.textContent === 'Restart') {
    game.restart();
    renderScore();
    clearAllFields();
    document.querySelector('.message-lose').classList.add('hidden');
    document.querySelector('.message-win').classList.add('hidden');
    document.addEventListener('keydown', handleKeyPresses);
  }

  renderMatrix();
});

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

const handleKeyPresses = (e) => {
  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      renderMatrix();
      break;

    case 'ArrowDown':
      game.moveDown();
      break;

    case 'ArrowRight':
      game.moveRight();
      clearAllFields();
      game.addRandomNumbers();
      renderMatrix();
      break;

    case 'ArrowLeft':
      game.moveLeft();
      clearAllFields();
      game.addRandomNumbers();
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

function showHiddenMessage(messageClass) {
  const classesOfMessage = [...document.querySelector(messageClass).classList];

  if (classesOfMessage.includes('hidden')) {
    classesOfMessage.pop();
  }

  document.querySelector(messageClass).classList = classesOfMessage.join(' ');
}

document.addEventListener('keydown', handleKeyPresses);
