'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const fieldCells = document.querySelectorAll('.field-cell');

button.addEventListener('click', () => {
  button.classList.toggle('start');
  button.classList.toggle('restart');

  if (button.classList.contains('restart')) {
    button.textContent = 'Restart';

    game.start();
    updateGame();

    document.addEventListener('keydown', handleKeyPress);
  } else {
    button.textContent = 'Start';

    game.restart();
    updateGame();
  }
});

function handleKeyPress(event) {
  if (event.key === 'ArrowDown') {
    game.moveDown();

    console.log(game.getState());
  } else if (event.key === 'ArrowUp') {
    game.moveUp();

    console.log(game.getState());
  } else if (event.key === 'ArrowRight') {
    game.moveRight();

    console.log(game.getState());
  } else if (event.key === 'ArrowLeft') {
    game.moveLeft();
  }

  updateGame();
}

function updateGame() {
  updateScore();
  updateBoard();
  updateMessage();
}

function updateScore() {
  scoreElement.textContent = game.getScore();
}

function updateBoard() {
  const state = game.getState();

  for (let i = 0; i < state.length; i++) {
    for (let j = 0; j < state[i].length; j++) {
      const cell = fieldCells[i * state.length + j]
      cell.textContent = state[i][j] === 0 ? '' : state[i][j];
      cell.className = 'field-cell';

      if (state[i][j] !== 0) {
        cell.classList.add(`field-cell--${state[i][j]}`);
      }
    }
  }
}

function updateMessage() {
  const status = game.getStatus();
  const messageContainer = document.querySelector('.message-container');
  const messages = messageContainer.querySelectorAll('.message');

  messages.forEach(message => message.classList.add('hidden'));

  if (status === Game.STATUS_LOSE) {
    messageContainer.querySelector('.message-lose').classList.remove('hidden');
  } else if (status === Game.STATUS_WIN) {
    messageContainer.querySelector('.message-win').classList.remove('hidden');
  } else if (status === Game.STATUS_IDLE) {
    messageContainer.querySelector('.message-start').classList.remove('hidden');
  }
}
