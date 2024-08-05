'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// const gameField = document.querySelector('.game-field');
const button = document.querySelector('.button');
const messegeStart = document.querySelector('.message-start');

// Make cells with Id

// setCells(gameField);

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
    if (game.status === 'playing' && game.canMoveLeft()) {
      game.moveLeft();
      game.setTwo();
    }

    game.checkLose();
    game.checkWin();
  } else if (e.code === 'ArrowRight') {
    if (game.status === 'playing' && game.canMoveRight()) {
      game.moveRight();
      game.setTwo();
    }

    game.checkLose();
    game.checkWin();
  } else if (e.code === 'ArrowUp') {
    if (game.status === 'playing' && game.canMoveUp()) {
      game.moveUp();
      game.setTwo();
    }

    game.checkLose();
    game.checkWin();
  } else if (e.code === 'ArrowDown') {
    if (game.status === 'playing' && game.canMoveDown()) {
      game.moveDown();
      game.setTwo();
    }

    game.checkLose();
    game.checkWin();
  }

  document.querySelector('.game-score').innerText = game.getScore();
});

// function setCells(element) {
//   const rows = 4;
//   const columns = 4;

//   for (let r = 0; r < rows; r++) {
//     for (let c = 0; c < columns; c++) {
//       const cell = document.createElement('div');

//       cell.id = r.toString() + '-' + c.toString();
//       cell.classList.add('field-cell');

//       element.appendChild(cell);
//     }
//   }
// }
