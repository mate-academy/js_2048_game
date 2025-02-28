/* eslint-disable no-console */

'use strict';

// Uncomment the next lines to use your game instance in the browser

const Game = require('../modules/Game.class');

const game = new Game([
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
]);

// Write your code here

const rows = [...document.getElementsByClassName('field-row')];

// elements
const controlBtn = document.querySelector('.button');
const score = document.querySelector('.game-score');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');

// classes
const hiddenClass = 'hidden';

function setValues() {
  for (let i = 0; i < game.board.length; i++) {
    [...rows[i].children].forEach((c, colI) => {
      const currentCellValue = game.board[i][colI];

      const cellValue = c.innerText;

      c.classList.remove(`field-cell--${cellValue}`);

      score.innerText = game.score;

      if (currentCellValue === 0) {
        c.innerText = '';
      } else {
        c.innerText = currentCellValue;
        c.classList.add(`field-cell--${currentCellValue}`);
      }
    });
  }
}

const moves = {
  up: 'up',
  down: 'down',
  right: 'right',
  left: 'left',
};

const gameStatus = {
  idle: 'idle',
  playing: 'playing',
  win: 'win',
  lose: 'lose',
};

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    move(moves.down);
    console.log('move', moves.down);
  }

  if (e.key === 'ArrowUp') {
    move(moves.up);
    console.log('move', moves.up);
  }

  if (e.key === 'ArrowRight') {
    move(moves.right);
    console.log('move', moves.right);
  }

  if (e.key === 'ArrowLeft') {
    move(moves.left);
    console.log('move', moves.left);
  }
});

document.addEventListener('click', (e) => {
  if (e.target.matches('.start')) {
    console.log('start');

    if (game.getStatus() === gameStatus.idle) {
      game.start();
      startMessage.classList.add(hiddenClass);

      setValues();
    }
  }

  if (e.target.matches('.restart')) {
    console.log('restart');

    game.restart();

    checkStatus();
    setValues();
  }
});

function checkStatus() {
  const currentStatus = game.getStatus();

  switch (currentStatus) {
    case gameStatus.idle:
      if (startMessage.hasAttribute('class', hiddenClass)) {
        startMessage.classList.remove(hiddenClass);
      }

      if (controlBtn.hasAttribute('class', 'restart')) {
        controlBtn.classList.remove('restart');
        controlBtn.classList.add('start');

        controlBtn.innerText = 'Start';
      }
      break;

    case gameStatus.lose:
      loseMessage.classList.remove(hiddenClass);
      break;

    case gameStatus.win:
      winMessage.classList.remove(hiddenClass);
      break;

    case gameStatus.playing:
      if (controlBtn.hasAttribute('class', 'start')) {
        controlBtn.classList.remove('start');
        controlBtn.classList.add('restart');

        controlBtn.innerText = 'Restart';
      }

      break;
  }
}

function move(moveDirection) {
  switch (moveDirection) {
    case moves.up:
      game.moveUp();
      break;

    case moves.down:
      game.moveDown();
      break;

    case moves.right:
      game.moveRight();
      break;

    case moves.left:
      game.moveLeft();
      break;
  }

  checkStatus();

  game.setNum();
  setValues();
}
