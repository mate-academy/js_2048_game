'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const gameField = document.querySelector('.game-field');
const startButton = document.querySelector('.button.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const score = document.querySelector('.game-score');

fillField();

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    startGame();
  } else {
    restartGame();
  }
});

document.body.addEventListener('keydown', moveListener);

function startGame() {
  startButton.className = 'button restart';
  startButton.textContent = 'Restart';
  game.start();
  fillField();
  startMessage.classList.add('hidden');
}

function restartGame() {
  startButton.className = 'button start';
  startButton.textContent = 'Start';
  game.restart();
  fillField();
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

  fillField();

  if (game.getStatus() === 'win') {
    winMessage.classList.remove('hidden');
    document.body.removeEventListener('keydown', moveListener);
  } else if (game.getStatus() === 'lose') {
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
