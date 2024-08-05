'use strict';

const Game = require('../modules/Game.class');
const game = new Game([
  [128, 128, 0, 8],
  [16, 8, 16, 32],
  [8, 16, 32, 64],
  [16, 32, 0, 128],
]);
const gameField = document.querySelector('.game-field');
const startButton = document.querySelector('.button.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const score = document.querySelector('.game-score');

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startGame();
  } else {
    restartGame();
  }
});

function startGame() {
  startButton.className = 'button restart';
  startButton.textContent = 'Restart';
  game.start();
  fillField();
  document.body.addEventListener('keydown', moveListener);
  startMessage.classList.add('hidden');
}

function restartGame() {
  startButton.className = 'button start';
  startButton.textContent = 'Start';
  game.restart();
  fillField();
  document.body.removeEventListener('keydown', moveListener);
  startMessage.classList.remove('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
}

function moveListener(e) {
  switch (e.code) {
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

  game.addCellToState();
  fillField();

  if (game.has2048()) {
    winMessage.classList.remove('hidden');
    document.body.removeEventListener('keydown', moveListener);
  } else if (!game.hasMove()) {
    loseMessage.classList.remove('hidden');
    document.body.removeEventListener('keydown', moveListener);
  }
}

function fillField() {
  for (let y = 0; y < Game.GAME_SIZE; y++) {
    for (let x = 0; x < Game.GAME_SIZE; x++) {
      if (game.getState()[y][x] === 0) {
        gameField.rows[y].cells[x].className = `field-cell`;
        gameField.rows[y].cells[x].textContent = '';
        continue;
      }

      gameField.rows[y].cells[x].className =
        `field-cell field-cell--${game.getState()[y][x]}`;
      gameField.rows[y].cells[x].textContent = game.getState()[y][x];
    }
  }

  score.textContent = game.getScore();
}
