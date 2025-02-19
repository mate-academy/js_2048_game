'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const table = document.querySelector('.game-field');
const startButton = document.querySelector('.start');

document.addEventListener('keydown', keyMove);

function keyMove(ev) {
  if (ev.key === 'ArrowDown') {
    game.moveDown();
  }

  if (ev.key === 'ArrowUp') {
    game.moveUp();
  }

  if (ev.key === 'ArrowLeft') {
    game.moveLeft();
  }

  if (ev.key === 'ArrowRight') {
    game.moveRight();
  }

  game.genereteCell();
  game.getStatus();
  game.getScore();
  vizualized();
  game.scoreVal.textContent = game.score;
}

function vizStart() {
  game.start();

  startButton.textContent = 'Restart';
  startButton.style.fontSize = '17px';

  startButton.addEventListener('mouseenter', () => {
    startButton.style.backgroundColor = '#f87474';
  });

  startButton.addEventListener('mouseleave', () => {
    startButton.style.backgroundColor = '#f1b2b2';
  });

  messageStart.style.display = 'none';
}

function vizRestart() {
  game.restart();

  messageWin.style.display = 'none';
  messageLose.style.display = 'none';
  vizualized();
}

function vizualized() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (game.field[i][j] === 0) {
        table.rows[i].cells[j].textContent = '';
      } else {
        table.rows[i].cells[j].textContent = game.field[i][j];
      }
    }
  }

  colorCells();
}

function colorCells() {
  const cells = document.querySelectorAll('.field-cell');

  cells.forEach((cell) => {
    const value = parseInt(cell.textContent, 10);

    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

startButton.addEventListener('click', () => {
  if (startButton.textContent === 'Start') {
    game.start();
    vizStart();

    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  } else if (startButton.textContent === 'Restart') {
    game.restart();
    vizRestart();
  }

  vizualized();
});
