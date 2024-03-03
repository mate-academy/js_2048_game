'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const gameUIFields = [[], [], [], []];
const startGameButton = document.querySelector('.button.start');
const gameFieldRows = [...document.querySelectorAll('.field-row')];
let gameFieldCell = [...document.querySelectorAll('.field-row .field-cell')];

const renderUIFields = () => {
  for (let i = 0; i < gameFieldRows.length; i++) {
    gameUIFields[i] = gameFieldRows[i];

    for (let j = 0; j < gameFieldRows.length; j++) {
      gameUIFields[i][j] = gameFieldCell[j];
    }
    gameFieldCell = gameFieldCell.slice(4);
  }
};

const renderGameDesc = () => {
  game.initialState.map((row, i) => {
    row.map((coll, j) => {
      gameUIFields[i][j].textContent = '';

      if (gameUIFields[i][j].textContent === '') {
        gameUIFields[i][j].className = `field-cell`;
      }

      if (coll > 0) {
        gameUIFields[i][j].append(coll);
        gameUIFields[i][j].className = `field-cell field-cell--${coll}`;
      }
    });
  });
};

startGameButton.addEventListener('click', el => {
  game.start();
  renderUIFields();
  renderGameDesc();
});

document.addEventListener('keydown', ev => {
  switch (ev.key) {
    case 'ArrowLeft':
      game.moveLeft();
      renderGameDesc();
      break;
    case 'ArrowRight':
      game.moveRight();
      renderGameDesc();
      break;
    case 'ArrowUp':
      game.moveUp();
      renderGameDesc();
      break;
    case 'ArrowDown':
      game.moveDown();
      renderGameDesc();
      break;
    default:
      break;
  }
});

// Write your code here
