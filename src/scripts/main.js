import { Game } from '../modules/Game.class';

const game = new Game();
const field = document.querySelector('.game-field');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.button');
const messageContainer = document.querySelector('.message-container');

function updateUI() {
  const state = game.getState();
  const cells = field.querySelectorAll('.field-cell');

  cells.forEach((cell, index) => {
    const row = Math.floor(index / game.size);
    const col = index % game.size;
    const value = state[row][col];

    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }

    cell.textContent = value || '';
  });

  scoreElement.textContent = game.getScore();

  if (game.getStatus() === 'won') {
    messageContainer.querySelector('.message-win').classList.remove('hidden');
  } else if (game.getStatus() === 'lost') {
    messageContainer.querySelector('.message-lose').classList.remove('hidden');
  } else {
    messageContainer
      .querySelectorAll('.message')
      .forEach((m) => m.classList.add('hidden'));
  }
}

function handleKeydown(e) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  if (e.key === 'ArrowLeft') {
    moved = game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    moved = game.moveRight();
  } else if (e.key === 'ArrowUp') {
    moved = game.moveUp();
  } else if (e.key === 'ArrowDown') {
    moved = game.moveDown();
  }

  if (moved) {
    updateUI();
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'ready' || game.getStatus() === 'lost') {
    game.start();
    startButton.textContent = 'Restart';
    updateUI();
  } else {
    game.restart();
    updateUI();
  }
});

document.addEventListener('keydown', handleKeydown);

updateUI();
