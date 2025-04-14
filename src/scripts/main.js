'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const start = document.querySelector('.start');
const gameField = document.querySelector('.game-field');
const messageStart = document.querySelector('.message-start');
const scoreWindow = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

start.addEventListener('click', () => {
  if (start.classList.contains('restart')) {
    start.textContent = 'Restart';
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        gameField.rows[i].cells[j].classList
          .remove(`field-cell--${game.field[i][j]}`);
        gameField.rows[i].cells[j].textContent = '';
      }
    }

    game.restart();

    scoreWindow.textContent = game.getScore();

    game.start();

    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (game.field[x][y] !== 0) {
          gameField.rows[x].cells[y]
            .classList.add(`field-cell--${game.field[x][y]}`);
          gameField.rows[x].cells[y].textContent = game.field[x][y];
        }
      }
    }
  } else {
    start.classList.add('restart');
    start.textContent = 'Restart';
    messageStart.classList.add('hidden');
    game.start();

    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (game.field[x][y] !== 0) {
          gameField.rows[x].cells[y]
            .classList.add(`field-cell--${game.field[x][y]}`);
          gameField.rows[x].cells[y].textContent = game.field[x][y];
        }
      }
    }
  }
});

function createGameField() {
  for (let x = 0; x < game.field.length; x++) {
    for (let y = 0; y < game.field.length; y++) {
      gameField.rows[x].cells[y].classList
        .remove(`field-cell--${gameField.rows[x].cells[y].textContent}`);
      gameField.rows[x].cells[y].textContent = '';

      if (game.field[x][y] !== 0) {
        gameField.rows[x].cells[y].textContent = game.field[x][y];

        gameField.rows[x].cells[y]
          .classList.add(`field-cell--${game.field[x][y]}`);
      }
    }
  }
  scoreWindow.textContent = game.score;
}

document.addEventListener('keydown', e => {
  if (game.getStatus() === 'playing') {
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
    }

    createGameField();
  }

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  }

  if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
});
