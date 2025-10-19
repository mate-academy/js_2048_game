import { Game } from '../modules/Game.class.js';

const game = new Game();

const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');

function renderBoard(board) {
  let index = 0;

  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      const value = board[i][j];
      const cell = cells[index];

      cell.textContent = value === 0 ? '' : value;
      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      }

      index += 1;
    }
  }

  scoreElement.textContent = game.getScore();

  if (game.getStatus() === 'lose') {
    loseMessage.classList.remove('hidden');
  } else {
    loseMessage.classList.add('hidden');
  }
}

function handleStart() {
  game.start();
  renderBoard(game.getState());
  startMessage.classList.add('hidden');

  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
}

function handleRestart() {
  game.restart();
  renderBoard(game.getState());
  scoreElement.textContent = '0';
  startMessage.classList.remove('hidden');
  loseMessage.classList.add('hidden');

  startButton.textContent = 'Start';
  startButton.classList.remove('restart');
  startButton.classList.add('start');
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    handleStart();
  } else {
    handleRestart();
  }
});

game.initializeControls(renderBoard);
