/* eslint-disable no-console */

'use strict';

// Uncomment the next lines to use your game instance in the browser

const Game = require('../modules/Game.class');

const game = new Game();

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

const gameStatus = game.gameStatus;

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== game.gameStatus.playing) {
    return;
  }

  if (e.key === 'ArrowDown') {
    move(moves.down);
  }

  if (e.key === 'ArrowUp') {
    move(moves.up);
  }

  if (e.key === 'ArrowRight') {
    move(moves.right);
  }

  if (e.key === 'ArrowLeft') {
    move(moves.left);
  }
});

document.addEventListener('click', (e) => {
  if (e.target.matches('.start')) {
    if (game.getStatus() === gameStatus.idle) {
      game.start();
      startMessage.classList.add(hiddenClass);

      setValues();
    }
  }

  if (e.target.matches('.restart')) {
    game.restart();
    setValues();
    checkStatus();
  }
});

function checkStatus() {
  const currentStatus = game.getStatus();

  switch (currentStatus) {
    case gameStatus.idle:
      if (startMessage.hasAttribute('class', hiddenClass)) {
        startMessage.classList.remove(hiddenClass);
        winMessage.classList.add(hiddenClass);
        loseMessage.classList.add(hiddenClass);
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
  const current = game.board.map((row) => [...row]);

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

  const moved = game.board.map((row) => [...row]);

  if (game.moveDone(current, moved)) {
    game.setNum();
  }

  if (moved.flat().includes(2048)) {
    game.status = gameStatus.win;
  }

  if (!game.isEqual() && !game.board.flat().includes(0)) {
    game.status = gameStatus.lose;
  }

  setValues();

  checkStatus();
}
