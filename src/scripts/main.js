import Game from '../modules/Game.class.js';

let game;
const scoreDisplay = document.querySelector('.game-score');
const startButton = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const tableCells = document.querySelectorAll('.field-cell');

function renderGrid(grid) {
  tableCells.forEach((cell, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const value = grid[row][col];

    cell.textContent = value || '';
    cell.className = 'field-cell'; // limpa classes antigas

    if (value) {
      cell.classList.add(`field-cell--${value}`);
    }
  });
}

function update() {
  renderGrid(game.getState());
  scoreDisplay.textContent = game.getScore();

  if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

startButton.addEventListener('click', () => {
  game = new Game();
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  update();
});

// eslint-disable-next-line no-shadow
document.addEventListener('keydown', (event) => {
  if (!game || game.getStatus() !== 'playing') {
    return;
  }

  switch (event.key) {
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

  update();
});

// comentando para alterar o arquivo e solicitar um novo PR
