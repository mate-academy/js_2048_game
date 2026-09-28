import Game from '../modules/Game.class.js';

const game = new Game();

const scoreElement = document.querySelector('.game-score');
const buttonElement = document.querySelector('.button');
const cells = document.querySelectorAll('.field-cell');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function render() {
  const board = game.getState();
  const score = game.getScore();
  const gameStatus = game.getStatus();

  scoreElement.textContent = score;

  let cellIndex = 0;

  for (let rIdx = 0; rIdx < 4; rIdx += 1) {
    for (let cIdx = 0; cIdx < 4; cIdx += 1) {
      const cell = cells[cellIndex];
      const value = board[rIdx][cIdx];

      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
        cell.textContent = value;
      } else {
        cell.textContent = '';
      }

      cellIndex += 1;
    }
  }

  if (gameStatus === 'idle') {
    buttonElement.textContent = 'Start';
    buttonElement.classList.remove('restart');
    buttonElement.classList.add('start');
  } else {
    buttonElement.textContent = 'Restart';
    buttonElement.classList.remove('start');
    buttonElement.classList.add('restart');
  }

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

buttonElement.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
  }

  render();
});

document.addEventListener('keydown', (evt) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (evt.key) {
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
    default:
      break;
  }

  if (moved) {
    render();
  }
});

render();
