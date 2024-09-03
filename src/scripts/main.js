'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const startButton = document.querySelector('.button');
const gameField = document.querySelector('.game-field');

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

  const button = document.querySelector('.button');

  button.classList.remove('start');
  button.classList.add('restart');
  button.innerHTML = 'Restart';

  document
    .querySelectorAll('.message')
    .forEach((e) => e.classList.add('hidden'));

  document.addEventListener('keydown', control);
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
