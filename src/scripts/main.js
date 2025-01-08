'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here
const table = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const mainButton = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

/**
 *
 * @param {number[][]} state
 */
function drawGameState(state) {
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      if (state[j][i] === 2048) {
        game.status = 'win';
      }

      table.rows[j].cells[i].classList.remove(
        `field-cell--${table.rows[j].cells[i].textContent}`,
      );

      if (state[j][i] === 0) {
        table.rows[j].cells[i].textContent = '';
        continue;
      }

      table.rows[j].cells[i].textContent = state[j][i];
      table.rows[j].cells[i].classList.add(`field-cell--${state[j][i]}`);
    }
  }
}

function gameMove() {
  game.fillRandomCell();
  drawGameState(game.getState());
  gameScore.textContent = game.getScore();

  const lose = game.checkLose();

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  } else if (lose) {
    game.status = 'lose';
    loseMessage.classList.remove('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  if (e.code !== 'ArrowDown') {
    return;
  }

  const success = game.moveDown();

  if (!success) {
    return;
  }

  gameMove();
});

document.addEventListener('keydown', (e) => {
  if (e.code !== 'ArrowUp') {
    return;
  }

  const success = game.moveUp();

  if (!success) {
    return;
  }

  gameMove();
});

document.addEventListener('keydown', (e) => {
  if (e.code !== 'ArrowLeft') {
    return;
  }

  const success = game.moveLeft();

  if (!success) {
    return;
  }

  gameMove();
});

document.addEventListener('keydown', (e) => {
  if (e.code !== 'ArrowRight') {
    return;
  }

  const success = game.moveRight();

  if (!success) {
    return;
  }

  gameMove();
});

function restartBtnLogic(msgToHide) {
  game.restart();
  drawGameState(game.getState());

  mainButton.classList.remove('restart');
  mainButton.classList.add('start');

  mainButton.textContent = 'Start';

  startMessage.classList.remove('hidden');

  if (msgToHide !== undefined) {
    msgToHide.classList.add('hidden');
  }
}

mainButton.addEventListener('click', (e) => {
  if (game.getStatus() === 'idle') {
    game.start();
    drawGameState(game.getState());

    mainButton.classList.remove('start');
    mainButton.classList.add('restart');

    mainButton.textContent = 'Restart';
    startMessage.classList.add('hidden');
  } else if (game.getStatus() === 'playing') {
    restartBtnLogic();
  } else if (game.getStatus() === 'lose') {
    restartBtnLogic(loseMessage);
  } else if (game.getStatus() === 'win') {
    restartBtnLogic(winMessage);
  }
});
