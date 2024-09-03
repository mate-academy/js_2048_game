'use strict';

const Game = require('../modules/Game.class');

// const initialState = [
//   [8, 0, 0, 0],
//   [0, 16, 0, 0],
//   [0, 0, 32, 0],
//   [0, 0, 0, 64],
// ];
const game = new Game();

const startButton = document.querySelector('.button');
const gameField = document.querySelector('.game-field');

renderGameField();

startButton.addEventListener('click', (e) => {
  if (e.target.classList.contains('start')) {
    game.start();
  } else if (e.target.classList.contains('restart')) {
    game.restart();
  }
  resetControls();
  renderGameField(game.getState());
});

function resetControls() {
  document.querySelector('.game-score').innerHTML = 0;

  switch (game.getStatus()) {
    case 'idle':
      startButton.classList.remove('restart');
      startButton.classList.add('start');
      startButton.innerHTML = 'Start';
      document.removeEventListener('keydown', control);
      break;

    case 'playing':
      startButton.classList.remove('start');
      startButton.classList.add('restart');
      startButton.innerHTML = 'Restart';
      document.addEventListener('keydown', control);
      break;
  }

  document
    .querySelectorAll('.message')
    .forEach((e) => e.classList.add('hidden'));
}

function control(e) {
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

  game.fillOutRandomCell(game.generateNumber());
  renderGameField();
}

function renderGameField() {
  const gameStatus = game.getStatus();
  const state = game.getState();
  const score = game.getScore();

  document.querySelector('.game-score').innerHTML = score;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const number = state[i][j];
      const cell = gameField.rows[i].cells[j];

      cell.innerHTML = number || '';
      cell.classList = 'field-cell';

      if (number) {
        cell.classList.add(`field-cell--${number}`);
      }
    }
  }
  game.updateStatus();

  if (gameStatus === 'lose' || gameStatus === 'win') {
    document.querySelector(`.message-${gameStatus}`).classList.remove('hidden');
    document.removeEventListener('keydown', control);
  }
}
