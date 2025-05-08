import Game from '../modules/Game.class.js';

const game = new Game();

const cells = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.start');
const scoreElement = document.querySelector('.game-score');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    startGame();
  } else {
    restartGame();
  }
});

function updateUI() {
  const board = game.getState();

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = board[row][col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value) {
      cell.classList.add(`field-cell--${value}`);

      cell.classList.add('field-cell--merged');
      setTimeout(() => cell.classList.remove('field-cell--merged'), 150);
    }
  });

  scoreElement.textContent = game.getScore();

  winMessage.classList.toggle('hidden', game.getStatus() !== 'win');
  loseMessage.classList.toggle('hidden', game.getStatus() !== 'lose');
}

function startGame() {
  game.start();
  startMessage.classList.add('hidden');
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  updateUI();
}

function restartGame() {
  game.restart();
  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  updateUI();
}

document.addEventListener('keydown', (e) => {
  const key = e.key;
  const prevState = JSON.stringify(game.getState());

  switch (key) {
    case 'ArrowLeft':
      game.moveLeft();
      break;
    case 'ArrowRight':
      game.moveRight();
      break;
    case 'ArrowUp':
      game.moveUp();
      break;
    case 'ArrowDown':
      game.moveDown();
      break;
    default:
      return;
  }

  if (JSON.stringify(game.getState()) !== prevState) {
    updateUI();
  }
});
