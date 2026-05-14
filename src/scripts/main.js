'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const cells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.start');
const restartButton = document.querySelector('.restart');
const score = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

startButton.addEventListener('click', () => {
  game.init = true;

  const matriz = game.getState();

  const planMatriz = matriz.flat();

  for (let a = 0; a < cells.length; a++) {
    const valor = planMatriz[a];

    cells[a].innerText = valor === 0 ? '' : valor;

    if (valor === 4) {
      cells[a].classList.add('field-cell--4');
    } else {
      cells[a].classList.remove('field-cell--4');
    }
  }

  startButton.innerText = 'Restart';

  startButton.classList.add('restart');
  startButton.classList.remove('start');
});

restartButton.addEventListener('click', () => {
  const matriz = game.matriz;

  for (let i = 0; i < matriz.length; i++) {
    cells[i].innerText = matriz[i];

    if (matriz[i] === 4) {
      cells[i].classList.add('field-cell--4');
    }

    if (matriz[i] === 0) {
      cells[i].innerText = '';
    }
  }

  game.restart();
  update();
  messageWin.style.display = 'none';
  messageLose.style.display = 'none';
  messageStart.style.display = 'block';
});

/* 
if (!game.init) {
  alert('you must start the game first');
}
*/
const update = () => {
  const planMatriz = game.getState().flat();

  for (let i = 0; i < planMatriz.length; i++) {
    const valor = planMatriz[i];

    cells[i].innerText = valor === 0 ? '' : valor;

    cells[i].classList.remove('field-cell--2');
    cells[i].classList.remove('field-cell--4');
    cells[i].classList.remove('field-cell--8');
    cells[i].classList.remove('field-cell--16');
    cells[i].classList.remove('field-cell--32');
    cells[i].classList.remove('field-cell--64');
    cells[i].classList.remove('field-cell--128');
    cells[i].classList.remove('field-cell--256');
    cells[i].classList.remove('field-cell--512');
    cells[i].classList.remove('field-cell--1024');

    if (valor !== 0) {
      cells[i].classList.add(`field-cell--${valor}`);
    }
  }

  score.innerText = game.getScore();

  const st = game.getStatus();

  if (st === 'win') {
    messageWin.style.display = 'block';
    messageStart.style.display = 'none';
  } else if (st === 'lose') {
    messageLose.style.display = 'block';
    messageStart.style.display = 'none';
  }
};

document.addEventListener('keydown', (ev) => {
  if (game.init) {
    switch (ev.keyCode) {
      case 37:
        game.moveLeft();
        break;
      case 38:
        game.moveUp();
        break;
      case 39:
        game.moveRight();
        break;
      case 40:
        game.moveDown();
        break;
    }
    update();
  }
});
