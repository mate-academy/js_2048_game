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
    clearAllFields();
  }

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
});

function clearAllFields() {
  tableRows.map((row, rowIndex) => {
    const elements = [...row.querySelectorAll('td')];

    return elements.map((element, elementIndex) => {
      element.textContent = '';

      return element;
    });
  });
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;

    case 'ArrowDown':
      game.moveDown();
      break;

    case 'ArrowRight':
      game.moveRight();
      break;

    case 'ArrowLeft':
      game.moveLeft();
      break;

    default:
      break;
  }
});
