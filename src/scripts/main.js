'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const container = document.querySelector('.container');
const gameField = document.querySelector('.game-field');
const button = container.querySelector('.button');
const gameScore = container.querySelector('.game-score');

const fieldRows = [...gameField.querySelectorAll('.field-row')];
const fieldCells = fieldRows.map((row) => [...row.children]);

const messages = {
  idle: container.querySelector('.message-start'),
  lose: container.querySelector('.message-lose'),
  win: container.querySelector('.message-win'),
};

function fillGameField(state) {
  state.forEach((row, i) => {
    row.forEach((cell, j) => {
      const currentCell = fieldCells[i][j];

      currentCell.className = !cell
        ? 'field-cell'
        : `field-cell field-cell--${cell}`;
      currentCell.innerHTML = !cell ? '' : cell;
    });
  });
}

function showMessage() {
  const gameStatus = game.getStatus();

  for (const key in messages) {
    if (Object.hasOwnProperty.call(messages, key)) {
      const message = messages[key];

      if (message) {
        message.classList.toggle('hidden', key !== gameStatus);
      }
    }
  }
}

function updateScore(score) {
  gameScore.innerHTML = score;
}

button.addEventListener('click', () => {
  const buttonText = button.textContent;

  if (buttonText === 'Start') {
    game.start();
    button.textContent = 'Restart';
    button.classList.replace('start', 'restart');
  } else {
    game.restart();
    updateScore(0);
    button.textContent = 'Start';
    button.classList.replace('restart', 'start');
  }

  const state = game.getState();

  fillGameField(state);
  showMessage();
});

document.addEventListener('keydown', (keyEvent) => {
  keyEvent.preventDefault();

  if (game.getStatus() !== 'playing') {
    return;
  }

  const moveActions = {
    ArrowUp: game.moveUp,
    ArrowDown: game.moveDown,
    ArrowLeft: game.moveLeft,
    ArrowRight: game.moveRight,
  };

  const action = moveActions[keyEvent.key];

  if (action) {
    action.call(game);
  }

  fillGameField(game.getState());
  updateScore(game.getScore());
  showMessage();
});
