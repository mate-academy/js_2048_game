'use strict';

const game = new window.Game();
const cells = [...document.querySelectorAll('.field-cell')];
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

const keyToMove = {
  ArrowLeft: () => game.moveLeft(),
  ArrowRight: () => game.moveRight(),
  ArrowUp: () => game.moveUp(),
  ArrowDown: () => game.moveDown(),
};

function renderBoard() {
  const state = game.getState().flat();

  state.forEach((value, index) => {
    const cell = cells[index];

    cell.className = 'field-cell';
    cell.textContent = value || '';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function renderMessages() {
  const gameStatus = game.getStatus();

  startMessage.classList.toggle('hidden', gameStatus !== 'idle');
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');
}

function render() {
  renderBoard();
  renderMessages();
  score.textContent = game.getScore();
}

function setRestartButton() {
  button.textContent = 'Restart';
  button.classList.remove('start');
  button.classList.add('restart');
}

function setStartButton() {
  button.textContent = 'Start';
  button.classList.remove('restart');
  button.classList.add('start');
}

button.addEventListener('click', () => {
  if (button.classList.contains('restart')) {
    game.restart();
    setStartButton();
  } else {
    game.start();
  }

  render();
});

document.addEventListener('keydown', (keyboardEvent) => {
  const move = keyToMove[keyboardEvent.key];

  if (!move || game.getStatus() !== 'playing') {
    return;
  }

  keyboardEvent.preventDefault();

  const previousState = JSON.stringify(game.getState());

  move();

  if (JSON.stringify(game.getState()) !== previousState) {
    setRestartButton();
  }

  render();
});

render();
