import { Game } from './modules/Game.class.js';

const field = document.getElementById('game-field');
const scoreDisplay = document.getElementById('score');
const statusDisplay = document.getElementById('status');
const button = document.getElementById('start-btn');

let game;

function render() {
  const state = game.getState();
  field.innerHTML = '';

  state.forEach(row => {
    row.forEach(value => {
      const cell = document.createElement('div');
      cell.className = 'field-cell';
      if (value !== 0) cell.classList.add(`field-cell--${value}`);
      cell.textContent = value !== 0 ? value : '';
      field.appendChild(cell);
    });
  });

  scoreDisplay.textContent = game.getScore();
  const status = game.getStatus();
  if (status === 'won') {
    statusDisplay.textContent = '🎉 You win!';
    statusDisplay.classList.remove('hidden');
  } else if (status === 'lost') {
    statusDisplay.textContent = '💀 Game over!';
    statusDisplay.classList.remove('hidden');
  } else {
    statusDisplay.classList.add('hidden');
  }
}

function setupControls() {
  document.addEventListener('keydown', (e) => {
    let moved = false;
    if (game.getStatus() !== 'playing') return;

    switch (e.key) {
      case 'ArrowLeft': moved = game.moveLeft(); break;
      case 'ArrowRight': moved = game.moveRight(); break;
      case 'ArrowUp': moved = game.moveUp(); break;
      case 'ArrowDown': moved = game.moveDown(); break;
    }

    if (moved) render();
  });
}

button.addEventListener('click', () => {
  if (!game) {
    game = new Game();
    setupControls();
  } else {
    game.restart();
  }
  button.textContent = 'Restart';
  render();
});
