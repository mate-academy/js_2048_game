'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowUp') {
    game.moveUp();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
  }

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
  }

  renderMatrix(game.getState());
});

function renderMatrix(matrix) {
  const cells = [...document.querySelectorAll('td')];

  const m = matrix.flat();

  for (let i = 0; i < m.length; i++) {
    if (m[i] === 0) {
      cells[i].innerText = '';
      continue;
    }

    cells[i].innerText = m[i];
  }
}

const startButton = document.querySelector('.start');

startButton.addEventListener('click', (e) => {
  if (e.target.innerText === 'Restart') {
    clickRestart();
  }

  if (e.target.innerText === 'Start') {
    clickStart();
  }

  renderMatrix(game.getState());
});

function clickStart() {
  game.start();
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.innerText = 'Restart';
}

function clickRestart() {
  game.restart();
}
