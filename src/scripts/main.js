'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const gameField = document.querySelector('.game-field');
const button = document.querySelector('.button');
const messegeStart = document.querySelector('.message-start');

// Make cells with Id

setCells(gameField);

// button start click

button.onclick = function () {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerText = 'Restart';
    messegeStart.classList.add('hidden');

    game.start();
  } else if (button.classList.contains('restart')) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.innerText = 'Start';
    messegeStart.classList.remove('hidden');

    game.restart();
  }
};

// event lisener

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') {
    if (game.status === 'playing') {
      game.moveLeft();
      game.checkWin();
      game.setTwo();
    }
  } else if (e.code === 'ArrowRight') {
    if (game.status === 'playing') {
      game.moveRight();
      game.checkWin();
      game.setTwo();
    }
  } else if (e.code === 'ArrowUp') {
    if (game.status === 'playing') {
      game.moveUp();
      game.checkWin();
      game.setTwo();
    }
  } else if (e.code === 'ArrowDown') {
    if (game.status === 'playing') {
      game.moveDown();
      game.checkWin();
      game.setTwo();
    }
  }
});

function setCells(element) {
  const rows = 4;
  const columns = 4;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = document.createElement('div');

      cell.id = r.toString() + '-' + c.toString();
      cell.classList.add('field-cell');

      element.appendChild(cell);
    }
  }
}
