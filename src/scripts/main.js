'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');

const game = new Game();

// Write your code here
const startButton = document.querySelector('.start');

startButton.addEventListener('click', startGame);

function startGame() {
  const start = game.start.bind(game);

  start();

  changeClass('start', 'restart', 'Restart');

  startButton.removeEventListener('click', startGame);

  startButton.addEventListener('click', restartGame);
}

function restartGame() {
  const restartGameFunc = game.restart.bind(game);
  const tdItems = document.querySelectorAll('td');

  [...tdItems].forEach((el) => {
    el.textContent = '';

    const classesToRemove = [...el.classList];

    el.classList.remove(...classesToRemove);

    el.classList.add('field-cell');
  });

  restartGameFunc();

  document.querySelector('.message-win').classList.add('hidden');
  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.game-score').textContent = 0;

  changeClass('restart', 'start', 'Start');

  startButton.removeEventListener('click', restartGame);

  startButton.addEventListener('click', startGame);

  document.addEventListener('keydown', handleKeydown);
}

function changeClass(removeClass, addClass, text) {
  startButton.classList.remove(removeClass);
  startButton.classList.add(addClass);
  startButton.textContent = text;
  document.querySelector('.message-start').classList.toggle('hidden');
}

function handleKeydown(evt) {
  if (evt.key === 'ArrowUp') {
    const moveUpper = game.moveUp.bind(game);

    moveUpper();
  }

  if (evt.key === 'ArrowDown') {
    const moveDwn = game.moveDown.bind(game);

    moveDwn();
  }

  if (evt.key === 'ArrowRight') {
    const moveRgt = game.moveRight.bind(game);

    moveRgt();
  }

  if (evt.key === 'ArrowLeft') {
    const moveLft = game.moveLeft.bind(game);

    moveLft();
  }

  updateUI(game.getState.bind(game));

  if (game.status === 'win') {
    document.querySelector('.message-win').classList.remove('hidden');

    document.removeEventListener('keydown', handleKeydown);
  }

  if (game.status === 'lose') {
    document.querySelector('.message-lose').classList.remove('hidden');

    document.removeEventListener('keydown', handleKeydown);
  }
}

document.addEventListener('keydown', handleKeydown);

function updateUI(getState) {
  const tdItems = document.querySelectorAll('td');
  const stateNow = getState();

  for (let row = 0; row < stateNow.length; row++) {
    for (let column = 0; column < stateNow.length; column++) {
      const cell = tdItems[row * 4 + column];

      cell.className = 'field-cell';

      if (stateNow[row][column] !== 0) {
        cell.textContent = stateNow[row][column];
        cell.classList.add(`field-cell--${stateNow[row][column]}`);
      } else {
        cell.textContent = '';
      }
    }
  }
}
