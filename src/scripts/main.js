'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const boardElement = document.querySelector('.game-field');
const scoreElement = document.querySelector('.game-score');
const statusElement = document.querySelector('.message-lose');
const startButton = document.querySelector('.button.start');
const messageStart = document.querySelector('.message-start');
const toolsContainer = document.querySelector('.game-tools');
const undoButton = document.querySelector('.undo-button');
const shuffleButton = document.querySelector('.shuffle-button');
const removeButton = document.querySelector('.remove-button');

function updateToolButtons() {
  const updateSlots = (button, count, max) => {
    const slots = Array.from(button.querySelectorAll('.use-slot'));

    slots.forEach((slot, index) => {
      slot.classList.toggle('used', index < count);
    });

    button.disabled = count === 0;
  };

  updateSlots(undoButton, game.undoCount, 2);
  updateSlots(shuffleButton, game.shuffleCount, 2);
  updateSlots(removeButton, game.removeCount, 2);
}

function render() {
  const state = game.getState();
  // eslint-disable-next-line no-shadow
  const status = game.getStatus();
  const cells = boardElement.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();

  switch (status) {
    case 'win':
      statusElement.textContent = 'You win!';
      statusElement.classList.remove('hidden');
      break;
    case 'lose':
      statusElement.textContent = 'You lose! Restart the game?';
      statusElement.classList.remove('hidden');
      break;
    default:
      statusElement.classList.add('hidden');
  }

  updateToolButtons();
}

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const keyActions = {
    ArrowLeft: () => game.moveLeft(),
    ArrowRight: () => game.moveRight(),
    ArrowUp: () => game.moveUp(),
    ArrowDown: () => game.moveDown(),
  };

  const action = keyActions[e.key];

  if (action) {
    action();
    render();
  }
});

startButton.addEventListener('click', () => {
  const isIdle = game.getStatus() === 'idle';

  if (isIdle) {
    game.start();
    messageStart.classList.add('hidden');
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
    toolsContainer.classList.remove('hidden');
  } else {
    game.restart();
  }

  render();
});

undoButton?.addEventListener('click', () => {
  game.undo?.();
  render();
});

shuffleButton?.addEventListener('click', () => {
  game.shuffle?.();
  render();
});

removeButton?.addEventListener('click', () => {
  game.remove?.();
  render();
});

render();
