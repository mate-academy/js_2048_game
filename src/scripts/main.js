'use strict';
import Game from '../modules/Game.class.js';

// Uncomment the next lines to use your game instance in the browser
const game = new Game();

// Write your code here

const cells = document.querySelectorAll('.field-cell');
const scoreElement = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

function render() {
  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = game.getState()[row][col];

    cell.className = 'field-cell';
    cell.textContent = '';

    if (value !== 0) {
      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);
    }
  });

  scoreElement.textContent = game.getScore();
}

startButton.addEventListener('click', () => {
  if (game.status === 'win') {
    winMessage.classList.add('hidden');
  }

  if (game.status === 'lose') {
    loseMessage.classList.add('hidden');
  }

  if (!startMessage.classList.contains('hidden')) {
    startMessage.classList.add('hidden');
  }

  if (game.getStatus() === 'idle') {
    game.start();
    startButton.innerHTML = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
  } else {
    game.restart();
  }
  render();
});

window.addEventListener('keydown', (e) => {
  const snap = JSON.parse(JSON.stringify(game.state));

  switch (e.key) {
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    default:
      return;
  }

  let changed = false;

  for (let i = 0; i < 4 && !changed; i++) {
    for (let x = 0; x < 4; x++) {
      if (snap[i][x] !== game.state[i][x]) {
        changed = true;
        break;
      }
    }
  }

  if (changed) {
    game.addRandom();
    render();
  }

  const winCheck = game.checkWin();

  if (winCheck) {
    winMessage.classList.remove('hidden');
  }

  const loseCheck = game.checkLose();

  if (loseCheck) {
    loseMessage.classList.remove('hidden');
  }
});
