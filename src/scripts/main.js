'use strict';

import Game from '../modules/Game.class';

const game = new Game();

// #region [DOM REFERENCES] ------------------------->
const rows = Array.from(document.querySelectorAll('.field-row'));
const cellsGrid = rows.map((row) => {
  return Array.from(row.querySelectorAll('.field-cell'));
});
// #endregion

// #region [RENDERING] ------------------------------>
function clearValueClasses(cell) {
  const hasValueClass = (className) => className.startsWith('field-cell--');
  const classesToRemove = Array.from(cell.classList).filter(hasValueClass);

  classesToRemove.forEach((className) => cell.classList.remove(className));
}

function renderBoard() {
  const state = game.getState();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const cell = cellsGrid[row][col];
      const value = state[row][col];

      cell.textContent = value === 0 ? '' : value;

      clearValueClasses(cell);

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }
}

function renderScore() {
  const scoreElement = document.querySelector('.game-score');

  scoreElement.textContent = game.getScore();
}

function render() {
  renderBoard();
  renderScore();
  renderButton();
  renderMessages();
}

function renderButton() {
  const button = document.querySelector('.start, .restart');
  const isIdle = game.getStatus() === Game.Status.IDLE;

  button.textContent = isIdle ? 'Start' : 'Restart';
  button.classList.toggle('start', isIdle);
  button.classList.toggle('restart', !isIdle);
}

function renderMessages() {
  const gameStatus = game.getStatus();

  const startMessage = document.querySelector('.message-start');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');

  startMessage.classList.toggle('hidden', gameStatus !== Game.Status.IDLE);
  winMessage.classList.toggle('hidden', gameStatus !== Game.Status.WIN);
  loseMessage.classList.toggle('hidden', gameStatus !== Game.Status.LOSE);
}
// #endregion

// #region [KEYBOARD CONTROLS] ---------------------->
const keyToMove = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

document.addEventListener('keydown', (e) => {
  const move = keyToMove[e.key];

  if (!move) {
    return;
  }

  move();
  render();
});
// #endregion

// #region [BUTTON CONTROLS] ------------------------>
function handleButtonClick() {
  if (game.getStatus() === Game.Status.IDLE) {
    game.start();
  } else {
    game.restart();
  }

  render();
  document.activeElement.blur(); // removes focus from activated button
}

document.querySelector('.start').addEventListener('click', handleButtonClick);
// #endregion
