'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = Array.from(document.querySelectorAll('.field-cell'));

function render() {
  const gameState = game.getState();
  const gameStatus = game.getStatus();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = gameState[row][col];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
      cell.textContent = value;
    }
  });

  scoreElement.textContent = game.getScore();

  if (gameStatus === Game.STATUS.WIN) {
    messageWin.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageStart.classList.add('hidden');
  } else if (gameStatus === Game.STATUS.LOSE) {
    messageLose.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.add('hidden');
  } else if (gameStatus === Game.STATUS.PLAYING) {
    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  } else {
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }

  if (gameStatus === Game.STATUS.PLAYING) {
    startButton.textContent = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    startButton.textContent = 'Start';
    startButton.classList.remove('restart');
    startButton.classList.add('start');
  }
}

function handleKeydown(e) {
  if (game.getStatus() !== Game.STATUS.PLAYING) {
    return;
  }

  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      moved = game.moveLeft();
      break;
    case 'ArrowRight':
      moved = game.moveRight();
      break;
    case 'ArrowUp':
      moved = game.moveUp();
      break;
    case 'ArrowDown':
      moved = game.moveDown();
      break;
  }

  if (moved) {
    game.addRandomTile();
    game.checkLose();
    render();
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === Game.STATUS.IDLE) {
    game.start();
  } else {
    game.restart();
    game.start();
  }
  render();
});

document.addEventListener('keydown', handleKeydown);

render();
