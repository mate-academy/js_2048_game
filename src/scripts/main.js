'use strict';

// Uncomment the next lines to use your game instance in the browser
import Game from '../modules/Game.class.js';

const game = new Game();

const scoreEl = document.querySelector('.game-score');
const mainBtn = document.querySelector('.button.start');
const startMsg = document.querySelector('.message-start');
const winMsg = document.querySelector('.message-win');
const overMsg = document.querySelector('.message-lose');
const cells = Array.from(document.querySelectorAll('.field-cell'));

// Write your code here
function clearClassesValue(cell) {
  cell.classList.forEach((cls) => {
    if (cls.startsWith('field-cell--') && cls !== 'field-cell') {
      cell.classList.remove(cls);
    }
  });
}

function renderGame() {
  const state = game.getState(); // state será a cópia de board
  const score = game.getScore();
  const gameStatus = game.getStatus();

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const idx = r * 4 + c;
      const value = state[r][c];
      const cellEl = cells[idx];

      cellEl.textContent = value === 0 ? '' : String(value);
      clearClassesValue(cellEl);

      if (value > 0) {
        cellEl.classList.add(`field-cell--${value}`);
      }
    }
  }

  scoreEl.textContent = String(score);
  startMsg.classList.toggle('hidden', gameStatus !== 'play');
  winMsg.classList.toggle('hidden', gameStatus !== 'won');
  overMsg.classList.toggle('hidden', gameStatus !== 'over');

  mainBtn.textContent = gameStatus !== 'play' ? 'Restart' : 'Start';

  if (gameStatus !== 'play') {
    mainBtn.classList.add('restart');
    mainBtn.classList.remove('start');
  } else {
    mainBtn.classList.add('start');
    mainBtn.classList.remove('restart');
  }
}

document.addEventListener('keydown', (e) => {
  const prev = JSON.stringify(game.getState());

  if (e.key === 'ArrowLeft') {
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    game.moveRight();
  } else if (e.key === 'ArrowUp') {
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    game.moveDown();
  }
  // get.State é uma cópia do board

  const next = JSON.stringify(game.getState());

  if (prev !== next) {
    renderGame(game);
  }
});

mainBtn.addEventListener('click', () => {
  game.restart();
  renderGame(game);
});
