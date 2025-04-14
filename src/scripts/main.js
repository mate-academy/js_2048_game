'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const table = document.querySelector('.game-field');
const startButton = document.querySelector('.start');

function keyMove(ev) {
  const previousField = JSON.stringify(game.getState());

  switch (ev.key) {
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    default:
      return;
  }

  if (game.isMoveMade(previousField)) {
    game.generateCell();
  }

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

  if (!game.canMove()) {
    messageLose.style.display = 'block';
  }

  if (game.winerGame()) {
    messageWin.style.display = 'block';
  }
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

  document.addEventListener('keydown', keyMove);

  vizualized();
});
