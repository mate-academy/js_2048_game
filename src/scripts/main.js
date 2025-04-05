'use strict';

// Uncomment the next lines to use your game instance in the browser
const startGameBtn = document.getElementById('start-game-button');
const resetGameBtn = document.getElementById('restart-game-button');
const gameFieldsTable = document.getElementById('game-fields');
const gameScore = document.getElementById('game-score');
const startMessageElement = document.querySelector('.message-start');
const winMessageElement = document.querySelector('.message-win');
const loseMessageElement = document.querySelector('.message-lose');
const boardCells = gameFieldsTable.querySelector('tbody').children;
const Game = require('../modules/Game.class');
const game = new Game(
  boardCells,
  gameScore,
  startMessageElement,
  winMessageElement,
  loseMessageElement,
);

function hideStartButton(moved) {
  if (!moved) {
    return;
  }
  game.hideElement(startGameBtn);
  game.showElement(resetGameBtn);
}

startGameBtn.addEventListener('click', () => {
  game.start();
  game.hideElement(resetGameBtn);
  game.renderBoard();
});

resetGameBtn.addEventListener('click', () => {
  game.restart();
  game.showElement(startGameBtn);
  game.hideElement(resetGameBtn);
  game.renderBoard();
});

document.addEventListener('keydown', ($event) => {
  switch ($event.key) {
    case 'ArrowLeft':
      hideStartButton(game.moveLeft());
      break;
    case 'ArrowRight':
      hideStartButton(game.moveRight());
      break;
    case 'ArrowUp':
      hideStartButton(game.moveUp());
      break;
    case 'ArrowDown':
      hideStartButton(game.moveDown());
      break;
    default:
      break;
  }
  game.renderBoard();
});
