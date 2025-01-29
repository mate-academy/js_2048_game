'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class';

const game = new Game();

const refs = {
  gameScore: document.querySelector('.game-score'),
  startBtn: document.querySelector('.start'),
  gameField: document.querySelector('.game-field'),
  // resetBtn: document.querySelector('.restart'),
  messageStart: document.querySelector('.message-start'),
  messageLose: document.querySelector('.message-lose'),
  messageWin: document.querySelector('.message-win'),
};

renderGameField();

refs.startBtn.addEventListener('click', () => {
  if (refs.startBtn.classList.contains('restart')) {
    refs.messageStart.classList.remove('hidden');
    refs.startBtn.classList.replace('restart', 'start');
    refs.startBtn.textContent = 'Start';
    game.restart();
    renderGameField();

    return;
  }

  refs.messageStart.classList.add('hidden');
  refs.startBtn.classList.replace('start', 'restart');
  refs.startBtn.textContent = 'Restart';
  game.start();
  renderGameField();
});

function renderGameField() {
  refs.gameField.innerHTML = '';

  const state = game.getState();

  state.forEach((row) => {
    const rowEl = document.createElement('tr');

    rowEl.classList.add('field-row');

    row.forEach((cell) => {
      const cellEl = document.createElement('td');

      cellEl.classList.add('field-cell');
      cellEl.textContent = cell !== 0 ? cell : '';
      cellEl.classList.add(`field-cell--${cell}`);

      rowEl.appendChild(cellEl);
    });
    refs.gameField.appendChild(rowEl);
  });

  refs.gameScore.textContent = game.getScore();

  if (game.getStatus() === 'lose') {
    refs.messageLose.classList.remove('hidden');
  } else {
    refs.messageLose.classList.add('hidden');
  }

  if (game.getStatus() === 'win') {
    refs.messageWin.classList.remove('hidden');
  } else {
    refs.messageWin.classList.add('hidden');
  }
}

document.addEventListener('keydown', (e) => {
  switch (e.key) {
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

  renderGameField();
});
