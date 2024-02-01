'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const buttonStart = document.querySelector('.button');
const gameField = document.querySelector('.game-field');
const fieldRows = gameField.getElementsByTagName('tr');
const page = document.body;

buttonStart.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    buttonStart.classList.add('restart');
    buttonStart.textContent = 'Restart';
    game.start();
    document.querySelector('.message-start').classList.add('hidden');
  } else if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.add('hidden');
    game.restart();
  } else if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.add('hidden');
    game.restart();
  } else {
    game.restart();
  }

  synchronization();
});

page.addEventListener('keydown', eventListener => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const currentState = JSON.stringify(game.getState());

  switch (eventListener.keyCode) {
    case 37:
      game.moveLeft();
      break;
    case 38:
      game.moveUp();
      break;
    case 39:
      game.moveRight();
      break;
    case 40:
      game.moveDown();
      break;
  }

  if (currentState === JSON.stringify(game.getState())) {
    return;
  }

  game.spawnCell();

  game.checkWin();

  game.checkLose();

  synchronization();

  if (game.getStatus() === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
});

function synchronization(gameCells = getGameArray()) {
  const gameState = game.getState();

  for (let i = 0; i < gameState.length; i++) {
    for (let j = 0; j < gameState[i].length; j++) {
      gameCells[i][j].classList = ['field-cell'];

      if (gameState[i][j] !== 0) {
        gameCells[i][j].textContent = gameState[i][j];
        gameCells[i][j].classList.add(`field-cell--${gameState[i][j]}`);
      } else {
        gameCells[i][j].textContent = '';
      }
    }
  }

  const score = document.querySelector('.game-score');

  score.textContent = '' + game.getScore();
}

function getGameArray() {
  const gameCellsArray = [];

  for (let i = 0; i < fieldRows.length; i++) {
    const cells = fieldRows[i].getElementsByTagName('td');
    const rowArray = [];

    for (let j = 0; j < cells.length; j++) {
      rowArray.push(cells[j]);
    }

    gameCellsArray.push(rowArray);
  }

  return gameCellsArray;
}
