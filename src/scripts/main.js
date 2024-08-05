'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const gameField = document.querySelector('.game-field');
const startButton = document.querySelector('.button.start');
const startMessage = document.querySelector('.message-start');

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
  fillField(game.getState());
  document.body.addEventListener('keydown', moveListener);
  startMessage.classList.add('hidden');
}

function restartGame() {
  startButton.className = 'button start';
  startButton.textContent = 'Start';
  game.restart();
  fillField(Game.EMPTY_STATE);
  document.body.removeEventListener('keydown', moveListener);
  startMessage.classList.remove('hidden');
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
  fillField(game.getState());
  checkState(game.getState());
}

function checkState(state) {}

function fillField(state) {
  for (let y = 0; y < Game.GAME_SIZE; y++) {
    for (let x = 0; x < Game.GAME_SIZE; x++) {
      if (state[y][x] === 0) {
        gameField.rows[y].cells[x].className = `field-cell`;
        gameField.rows[y].cells[x].textContent = '';
        continue;
      }

      gameField.rows[y].cells[x].className =
        `field-cell field-cell--${state[y][x]}`;
      gameField.rows[y].cells[x].textContent = state[y][x];
    }
  }
}
