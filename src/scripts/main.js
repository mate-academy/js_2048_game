'use strict';

const Game = require('../modules/Game.class');
// const initialState = [
//   [2, 4, 8, 16],
//   [4, 8, 16, 32],
//   [8, 16, 32, 64],
//   [16, 32, 64, 0],
// ];
const game = new Game();
const score = document.querySelector('.game-score');
const button = document.querySelector('button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function renderCells() {
  const allCells = document.querySelectorAll('td');

  const flattenedStateToRender = game
    .getState()
    .map((innerArray) => innerArray.slice())
    .flat(1);

  allCells[0].setAttribute('class', '');

  try {
    for (let i = 0; i < 16; i++) {
      allCells[i].setAttribute('class', '');
      allCells[i].textContent = '';

      if (flattenedStateToRender[i] === 0) {
        allCells[i].classList.add('field-cell');
      } else {
        allCells[i].classList.add('field-cell');
        allCells[i].classList.add(`field-cell--${flattenedStateToRender[i]}`);
        allCells[i].textContent = flattenedStateToRender[i];
      }
    }
  } catch {}
  score.textContent = game.getScore();
  switchOnMove();
}

function restartToStart() {
  button.addEventListener('click', () => {
    button.classList.add('start');
    button.classList.remove('restart');

    game.restart();
    renderCells();
    startToRestart();
  });
}

function startToRestart() {
  button.addEventListener('click', () => {
    button.classList.remove('start');
    button.classList.add('restart');

    game.start();
    renderCells();
    restartToStart();
  });
}

function switchOnMove() {
  switch (game.getStatus()) {
    case 'idle':
      startMessage.classList.remove('hidden');
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
      break;

    case 'playing':
      startMessage.classList.add('hidden');
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
      break;

    case 'win':
      startMessage.classList.add('hidden');
      winMessage.classList.remove('hidden');
      loseMessage.classList.add('hidden');
      break;

    case 'lose':
      startMessage.classList.add('hidden');
      winMessage.classList.add('hidden');
      loseMessage.classList.remove('hidden');
      break;

    default:
      break;
  }
}
renderCells();
startToRestart();

document.querySelector('html').addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;

    case 'ArrowDown':
      game.moveDown();
      break;

    case 'ArrowLeft':
      game.moveLeft();

      break;

    case 'ArrowRight':
      game.moveRight();
      break;
  }

  renderCells();
});

document.querySelector('.move-up').addEventListener('click', () => {
  game.moveUp();
  renderCells();
});

document.querySelector('.move-down').addEventListener('click', () => {
  game.moveDown();
  renderCells();
});

document.querySelector('.move-left').addEventListener('click', () => {
  game.moveLeft();
  renderCells();
});

document.querySelector('.move-right').addEventListener('click', () => {
  game.moveRight();
  renderCells();
});
