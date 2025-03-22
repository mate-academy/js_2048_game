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

  game.addRandom();
  checkLoose();
  checkWin();

  renderMatrix(game.getState());
  addClasses(game.getState());
  updateScore();
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

function addClasses(matrix) {
  const cells = [...document.querySelectorAll('td')];

  const m = matrix.flat();

  for (let i = 0; i < m.length; i++) {
    cells[i].className = '';
    cells[i].classList.add('field-cell');

    if (m[i] !== 0) {
      cells[i].classList.add(`field-cell--${m[i]}`);
    }
  }
}

const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');

startButton.addEventListener('click', (e) => {
  if (e.target.innerText === 'Restart') {
    clickRestart();
  }

  if (e.target.innerText === 'Start') {
    clickStart();
    startMessage.style.display = 'none';
  }

  renderMatrix(game.getState());
  addClasses(game.getState());
});

function clickStart() {
  game.start();
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.innerText = 'Restart';
}

function clickRestart() {
  game.restart();
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
}

function updateScore() {
  const score = document.querySelector('.game-score');

  score.innerText = game.getScore();
}

const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');

function checkLoose() {
  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  }
}

function checkWin() {
  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
  }
}
