import '../styles/main.scss';
import Game from '../modules/Game.class.js';

const game = new Game();

const startBtn = document.querySelector('.start');
const restartBtn = document.querySelector('.restart');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');

/**
 * Відмалювати стан гри
 */
function render() {
  const state = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  scoreElement.textContent = score;

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = state[row][col];

    cell.className = 'field-cell';
    cell.textContent = value > 0 ? String(value) : '';

    if (value > 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  });

  // Повідомлення про стан гри
  winMessage.classList.toggle('hidden', gameStatus !== 'win');
  loseMessage.classList.toggle('hidden', gameStatus !== 'lose');

  // Початкове повідомлення показується тільки коли статус = 'idle'
  startMessage.classList.toggle('hidden', gameStatus !== 'idle');
}

// -------------------- Обробники --------------------

// Start game
startBtn.addEventListener('click', () => {
  game.start();

  startBtn.classList.add('hidden');
  restartBtn.classList.remove('hidden');

  render();
});

// Restart game
restartBtn.addEventListener('click', () => {
  game.status = 'idle'; // повертаємо статус у idle
  game.restart();

  startBtn.classList.remove('hidden');
  restartBtn.classList.add('hidden');

  render();
});

// Arrow key movement
document.addEventListener('keydown', (e) => {
  let moved = false;

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      moved = true;
      break;
    case 'ArrowRight':
      game.moveRight();
      moved = true;
      break;
    case 'ArrowUp':
      game.moveUp();
      moved = true;
      break;
    case 'ArrowDown':
      game.moveDown();
      moved = true;
      break;
    default:
      break;
  }

  if (moved) {
    render();
  }
});

// -------------------- Початковий рендер --------------------
render(); // показуємо "Press Start to begin game" при завантаженні сторінки
