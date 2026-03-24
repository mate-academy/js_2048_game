'use strict';

const { Game } = window;
const game = new Game();

const cells = [...document.querySelectorAll('.field-cell')];
const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

let hasMadeMove = false;

const moveHandlers = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

function updateButtonState() {
  const isRestart = game.getStatus() !== 'idle' && hasMadeMove;

  button.textContent = isRestart ? 'Restart' : 'Start';
  button.classList.toggle('start', !isRestart);
  button.classList.toggle('restart', isRestart);
}

function updateMessages() {
  const gameStatus = game.getStatus();
  const isIdle = gameStatus === 'idle';

  startMessage.classList.toggle('hidden', !isIdle);
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
}

function renderBoard() {
  const state = game.getState().flat();

  cells.forEach((cell, index) => {
    const value = state[index];
    const tileClass = [...cell.classList].find((className) => {
      return className.startsWith('field-cell--');
    });

    if (tileClass) {
      cell.classList.remove(tileClass);
    }

    cell.textContent = value || '';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function render() {
  renderBoard();
  scoreElement.textContent = game.getScore();
  updateMessages();
  updateButtonState();
}

button.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    hasMadeMove = false;
  } else {
    game.restart();
    hasMadeMove = false;
  }

  render();
});

document.addEventListener('keydown', (keyEvent) => {
  const move = moveHandlers[keyEvent.key];

  if (!move) {
    return;
  }

  keyEvent.preventDefault();

  const hasMoved = move();

  if (hasMoved) {
    hasMadeMove = true;
  }

  render();
});

render();
