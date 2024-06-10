/* eslint-disable no-useless-return */
'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
const gameScore = document.querySelector('.game-score');

const filedRows = [...document.querySelectorAll('.field-row')];
const fieldCells = filedRows.map((row) => [...row.children]);

const messages = {
  idle: document.querySelector('.message-start'),
  lose: document.querySelector('.message-lose'),
  win: document.querySelector('.message-win'),
};

const fillGameField = (state) => {
  state.forEach((row, i) => {
    row.forEach((cell, j) => {
      const currentCell = fieldCells[i][j];

      currentCell.className = !cell
        ? 'field-cell'
        : `field-cell field-cell--${cell}`;
      currentCell.textContent = cell || '';
    });
  });
};

const showMessage = () => {
  const gameStatus = game.getStatus();

  for (const key in messages) {
    const message = messages[key];

    message.classList.toggle('hidden', key !== gameStatus);
  }
};

const updateScore = (score) => {
  gameScore.textContent = score;
};

button.addEventListener('click', (e) => {
  const buttonText = e.target.textContent;

  if (buttonText === 'Start') {
    game.start();
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
  } else {
    game.restart();
    updateScore(0);
    button.textContent = 'Start';
    button.classList.remove('restart');
    button.classList.add('start');
  }

  const state = game.getState();

  fillGameField(state);
  showMessage();
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  if (game.getStatus() !== 'playing') {
    return;
  }

  const moveActions = {
    ArrowUp: game.moveUp,
    ArrowDown: game.moveDown,
    ArrowLeft: game.moveLeft,
    ArrowRight: game.moveRight,
  };

  const action = moveActions[e.key];

  if (action) {
    action.call(game);
  }

  fillGameField(game.getState());
  updateScore(game.getScore());
  showMessage();
});
