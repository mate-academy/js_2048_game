'use strict';

const Game = require('../modules/Game.class');
const {
  STATUS_NON_RUN,
  STATUS_RUN,
  COUNT_WIN,
} = require('../modules/constants');

const initialState = {
  status: STATUS_NON_RUN,
  tileField: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  score: 0,
};

const game = new Game(initialState);

export const messageStartLose = document.getElementById('message-lose');

const startButton = document.getElementById('start');
const restartButton = document.getElementById('restart');
const score = document.getElementById('game-score');
const messageStart = document.getElementById('message-start');
const messageWin = document.getElementById('message-win');

const appendScore = () => {
  game.getScore();

  if (initialState.score === COUNT_WIN) {
    messageWin.classList.remove('hidden');
  }

  score.textContent = `${initialState.score}`;
};

// eslint-disable-next-line no-shadow
const moveEvent = (event) => moves(event);

const start = () => {
  game.start();
  game.setTile();

  if (game.getState().status === STATUS_RUN) {
    startButton.classList.add('hidden');
    restartButton.classList.remove('hidden');
  }

  messageStartLose?.classList.add('hidden');
  messageStart.classList.add('hidden');
  document.addEventListener('keydown', moveEvent);
};

const restart = () => {
  game.restart();
  appendScore();
  game.setTile();

  startButton.classList.remove('hidden');
  restartButton.classList.add('hidden');

  messageStartLose?.classList.add('hidden');
  messageStart.classList.remove('hidden');
  document.removeEventListener('keydown', moveEvent);
};

startButton.addEventListener('click', start);
restartButton.addEventListener('click', restart);

// eslint-disable-next-line no-shadow
const moves = (event) => {
  switch (event.key) {
    case 'ArrowUp':
      game.moveUp();
      game.setTile();
      appendScore();
      break;

    case 'ArrowDown':
      game.moveDown();
      game.setTile();
      appendScore();
      break;

    case 'ArrowLeft':
      game.moveLeft();
      game.setTile();
      appendScore();
      break;

    case 'ArrowRight':
      game.moveRight();
      game.setTile();
      appendScore();
      break;
  }
};
