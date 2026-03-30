import { selectors } from '../modules/selectors.js';
import Game from '../modules/Game.class.js';

const game = new Game();

const root = document.querySelector(selectors.root);
const startButtonElement = root.querySelector(selectors.buttonStart);
const messageStartElement = root.querySelector(selectors.messageStart);
const messageWinElement = root.querySelector(selectors.messageWin);
const messageLoseElement = root.querySelector(selectors.messageLose);
const gameScoreElement = root.querySelector(selectors.gameScore);

function render() {
  const state = game.getState();
  const cells = root.querySelectorAll('.field-cell');

  let index = 0;

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const value = state[row][col];
      const cell = cells[index];

      cell.textContent = value === 0 ? '' : value;

      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
      }

      index++;
    }
  }

  gameScoreElement.textContent = game.getScore();

  // eslint-disable-next-line no-shadow
  const status = game.getStatus();

  if (status === 'win') {
    messageWinElement.classList.remove('hidden');
  }

  if (status === 'lose') {
    messageLoseElement.classList.remove('hidden');
  }
}

startButtonElement.addEventListener('click', () => {
  if (game.status === 'idle') {
    game.start();
    startButtonElement.textContent = 'Restart';
    startButtonElement.classList.add('restart');
    startButtonElement.classList.remove('start');
    messageStartElement.classList.add('hidden');
  } else {
    game.restart();
    startButtonElement.textContent = 'Start';
    startButtonElement.classList.add('start');
    startButtonElement.classList.remove('restart');
    messageLoseElement.classList.add('hidden');
    messageStartElement.classList.remove('hidden');
    messageWinElement.classList.add('hidden');
  }
  render();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    game.moveLeft();
    game.updateStatus();
    render();
  }

  if (e.key === 'ArrowRight') {
    game.moveRight();
    game.updateStatus();
    render();
  }

  if (e.key === 'ArrowDown') {
    game.moveDown();
    game.updateStatus();
    render();
  }

  if (e.key === 'ArrowUp') {
    game.moveUp();
    game.updateStatus();
    render();
  }
});
