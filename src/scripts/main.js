'use strict';

const Game = require('../modules/Game.class');
const BoardView = require('../modules/BoardView');

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();

  const buttonEl = document.querySelector('.button');
  const scoreEl = document.querySelector('.game-score');
  const messageStartEl = document.querySelector('.message.message-start');
  const messageWinEl = document.querySelector('.message.message-win');
  const messageLoseEl = document.querySelector('.message.message-lose');

  const gameField = document.querySelector('.game-field');
  const tilesLayer = document.querySelector('.tiles-layer');

  const boardView = new BoardView(game, tilesLayer, gameField);

  const keyMap = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
  };

  let isAnimating = false;

  function updateUI() {
    scoreEl.textContent = String(game.getScore());

    messageStartEl.classList.toggle('hidden', game.getStatus() !== 'idle');
    messageWinEl.classList.toggle('hidden', game.getStatus() !== 'win');
    messageLoseEl.classList.toggle('hidden', game.getStatus() !== 'lose');

    if (game.getStatus() === 'idle') {
      buttonEl.textContent = 'Start';
      buttonEl.classList.add('start');
      buttonEl.classList.remove('restart');
    } else {
      buttonEl.textContent = 'Restart';
      buttonEl.classList.add('restart');
      buttonEl.classList.remove('start');
    }
  }

  buttonEl.addEventListener('click', () => {
    if (game.getStatus() === 'idle') {
      game.start();
    } else {
      game.restart();
    }

    boardView.syncInitial(game.getState());
    updateUI();
  });

  document.addEventListener('keydown', (ev) => {
    const direction = keyMap[ev.key];

    if (!direction) {
      return;
    }

    ev.preventDefault();

    if (isAnimating || game.getStatus() !== 'playing') {
      return;
    }

    const result = game.moveWithMeta(direction);

    if (!result) {
      return;
    }

    isAnimating = true;

    boardView.applyMoves(result.meta);

    setTimeout(() => {
      boardView.syncInitial(game.getState());
      updateUI();
      isAnimating = false;
    }, 160);
  });

  updateUI();
});
