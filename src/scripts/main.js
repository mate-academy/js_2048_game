'use strict';

const Game = require('../modules/Game.class');
const game = new Game();
const container = document.querySelector('.container');
const gameField = document.querySelector('.game_field');
const button = container.querySelector('.button');
const gameScore = container.querySelector('.game_score');

const messages = {
  start: container.querySelector('.message_start'),
  restart: container.querySelector('.message_restart'),
  lose: container.querySelector('.message_lose'),
  win: container.querySelector('.message_win'),
};

const fieldRows = [...gameField.querySelectorAll('.field_row')];
const fieldCells = fieldRows.map((row) => [...row.children]);

function displayGameField(state, cellElements) {
  state.forEach((row, i) => {
    row.forEach((cell, j) => {
      const currentCell = cellElements[i][j];

      currentCell.className = !cell
        ? 'field_cell'
        : `field_cell field_cell--${cell}`;
      currentCell.innerHTML = !cell ? '' : cell;
    });
  });
}

function updateScore(score, elem) {
  elem.innerHTML = score;
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

button.addEventListener('click', () => {
  const buttonText = button.textContent;

  if (buttonText === 'Start') {
    game.start();
    button.textContent = 'Restart';
    button.classList.replace('start', 'restart');
  } else {
    game.restart();
    updateScore(game.getScore(), gameScore);
    button.textContent = 'Start';
    button.classList.replace('restart', 'start');
  }

  const state = game.getState();

  displayGameField(state, fieldCells);
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

  const currentScore = game.getScore();
  const currentGameState = game.getState();

  displayGameField(currentGameState, fieldCells);
  updateScore(currentScore, gameScore);
  showMessage();
});
