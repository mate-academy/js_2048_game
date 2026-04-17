'use strict';

const Game = require('../modules/Game.class');

const game = new Game();
const mainButton = document.querySelector('.button');
const score = document.querySelector('.game-score');

mainButton.addEventListener('click', function () {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    score.textContent = game.getScore();
  }

  const currentState = game.getState();

  updateButtonUI();
  renderGame(currentState.board);
});

function renderGame(state) {
  const cells = document.querySelectorAll('.field-cell');
  const flatState = state.flat();

  cells.forEach((cell, index) => {
    const value = flatState[index];

    cell.textContent = value !== 0 && value !== null ? value : '';
    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function updateButtonUI() {
  const msgStart = document.querySelector('.message-start');
  const msgWin = document.querySelector('.message-win');
  const msgLose = document.querySelector('.message-lose');

  if (!mainButton) {
    return;
  }

  const currentStatus = game.getStatus();

  if (currentStatus === 'playing') {
    msgStart.classList.add('hidden');
    mainButton.textContent = 'Restart';
    mainButton.classList.remove('start');
    mainButton.classList.add('restart');
  } else if (currentStatus === 'win') {
    msgWin.classList.remove('hidden');
  } else if (currentStatus === 'lose') {
    msgLose.classList.remove('hidden');
  } else {
    msgStart.classList.remove('hidden');
  }
}

window.addEventListener('keydown', function (pressEvent) {
  // eslint-disable-next-line no-console
  console.log(pressEvent.key);

  switch (pressEvent.key) {
    case 'ArrowLeft':
      game.moveLeft();
      renderGame(game.board);
      score.textContent = game.getScore();
      updateButtonUI();
      break;
    case 'ArrowRight':
      game.moveRight();
      renderGame(game.board);
      score.textContent = game.getScore();
      updateButtonUI();
      break;
    case 'ArrowUp':
      game.moveUp();
      renderGame(game.board);
      score.textContent = game.getScore();
      updateButtonUI();
      break;
    case 'ArrowDown':
      game.moveDown();
      renderGame(game.board);
      score.textContent = game.getScore();
      updateButtonUI();
      break;
  }
});
