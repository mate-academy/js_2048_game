'use strict';

import Game from '../modules/Game.class.js';

const game = new Game();

const CSS_CLASS_MODIFIER = 'field-cell--';

// console.log(game.state);

const control = document.querySelector('.controls');
const btnStart = document.querySelector('.start');
const btnRestrt = document.createElement('button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');

btnRestrt.classList.add('button', 'restart');

btnRestrt.textContent = 'Restart';

const cb = () => {
  const statusGame = game.getStatus();

  switch (statusGame) {
    case 'win':
      winMessage.classList.remove('hidden');
      break;
    case 'lose':
      loseMessage.classList.remove('hidden');
      break;
    case 'idle':
      break;
    case 'playing':
      break;
  }
};

const promise1 = new Promise((resolve, reject) => {
  document.addEventListener('keydown', (e) => {
    resolve();
  });
});

btnStart.addEventListener('click', (e) => {
  btnStart.classList.add('hidden');
  startMessage.classList.add('hidden');
  control.appendChild(btnRestrt);
  game.start();
  renderGameField();
});

btnRestrt.addEventListener('click', (e) => {
  game.restart();
  renderGameField();
  loseMessage.classList.add('hidden');
});

function renderGameField() {
  const state = game.getState();

  for (let x = 0; x < state.length; x++) {
    for (let y = 0; y < state[x].length; y++) {
      const curVal = gameField.rows[x].cells[y].innerText;

      if (state[x][y]) {
        if (state[x][y] !== curVal) {
          gameField.rows[x].cells[y].classList.remove(
            CSS_CLASS_MODIFIER + curVal,
          );

          gameField.rows[x].cells[y].classList.add(
            CSS_CLASS_MODIFIER + state[x][y],
          );
          gameField.rows[x].cells[y].innerText = state[x][y];
        }
      } else {
        gameField.rows[x].cells[y].classList.remove(
          CSS_CLASS_MODIFIER + curVal,
        );
        gameField.rows[x].cells[y].innerText = '';
      }
    }
  }
  gameScore.innerText = game.getScore() === undefined ? 0 : game.getScore();
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;

    case 'ArrowRight':
      game.moveRight();
      break;

    case 'ArrowUp':
      game.moveUp();
      break;

    case 'ArrowDown':
      game.moveDown();
      break;
  }
  renderGameField();
  promise1.then(cb);
});
