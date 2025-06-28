import Game from '../modules/Game.class.js';

const game = new Game();

document.addEventListener('keydown', (e) => {
  if (game.status !== 'playing') {
    return;
  }

  switch (e.key) {
    case 'ArrowLeft':
      game.moveLeft();
      render();
      break;
    case 'ArrowRight':
      game.moveRight();
      render();
      break;
    case 'ArrowUp':
      game.moveUp();
      render();
      break;
    case 'ArrowDown':
      game.moveDown();
      render();
      break;
  }
});

const cells = document.body.querySelectorAll('.field-cell');
const score = document.body.querySelector('.game-score');
const messageWin = document.body.querySelector('.message-win');
const messageLose = document.body.querySelector('.message-lose');
const messageStart = document.body.querySelector('.message-start');
const startBtn = document.body.querySelector('.start');

function render() {
  const state = game.getState();

  let index = 0;

  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = state[row][col];
      const cell = cells[index];

      cell.className = 'field-cell';

      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.textContent = '';
      }

      index++;
    }
  }

  score.textContent = game.getScore();

  if (game.getStatus() === 'idle') {
    messageStart.classList.remove('hidden');
  } else if (game.getStatus() === 'win') {
    messageWin.classList.remove('hidden');
  } else if (game.getStatus() === 'lose') {
    messageLose.classList.remove('hidden');
  }
}

startBtn.addEventListener('click', () => {
  game.start();
  render();

  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
  startBtn.textContent = 'Restart';
});
