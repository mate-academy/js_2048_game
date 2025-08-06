'use strict';

import Game from '../modules/Game.class';

const game = new Game();

const blocksRows = Array.from(document.querySelectorAll('tr'));
const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
const message = Array.from(document.querySelectorAll('.message'));
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const body = document.querySelector('body');

body.style.height = '100vh';

function newBlocks(board) {
  for (let i = 0; i < blocksRows.length; i++) {
    const blocksElements = Array.from(blocksRows[i].querySelectorAll('td'));

    for (let j = 0; j < blocksElements.length; j++) {
      if (board[i][j] !== 0) {
        blocksElements[j].textContent = board[i][j];
      } else {
        blocksElements[j].textContent = '';
      }

      blocksElements[j].classList.forEach((cls) => {
        if (cls.startsWith('field-cell--')) {
          blocksElements[j].classList.remove(cls);
        }
        blocksElements[j].classList.add(`field-cell--${board[i][j]}`);
      });
    }
  }
}

function cleanDisplayStyles() {
  message.forEach((el) => {
    el.style.display = 'none';
  });
}

window.addEventListener('keydown', (e) => {
  if (game.getStatus() === 'lose') {
    cleanDisplayStyles();
    messageLose.style.display = 'block';

    return;
  }

  if (game.getStatus() === 'win') {
    cleanDisplayStyles();
    messageWin.style.display = 'block';

    return;
  }

  if (!game.isGame) {
    return;
  }

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
  }

  const board = game.getState();

  newBlocks(board);

  score.textContent = String(game.getScore());
});

button.addEventListener('click', () => {
  button.classList.toggle('start');
  button.classList.toggle('restart');

  cleanDisplayStyles();

  if (button.textContent === 'Start') {
    button.textContent = 'Restart';
    game.start();

    if (game.getStatus() === 'playing') {
      messageStart.style.display = 'none';
    }
  } else if (button.textContent === 'Restart') {
    button.textContent = 'Start';
    game.restart();

    if (game.getStatus() === 'idle') {
      messageStart.style.display = 'block';
    }
  }
  score.textContent = String(game.getScore());

  const board = game.getState();

  newBlocks(board);
});

// вставив з чату GPT щоб управління працювало на телефоні

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

const threshold = 30; // Мінімальна відстань для свайпу

document.addEventListener('touchstart', (e) => {
  if (game.getStatus() === 'lose') {
    cleanDisplayStyles();
    messageLose.style.display = 'block';

    return;
  }

  if (game.getStatus() === 'win') {
    cleanDisplayStyles();
    messageWin.style.display = 'block';

    return;
  }

  if (!game.isGame) {
    return;
  }

  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
});

document.addEventListener('touchend', (e) => {
  if (game.getStatus() === 'lose') {
    cleanDisplayStyles();
    messageLose.style.display = 'block';

    return;
  }

  if (game.getStatus() === 'win') {
    cleanDisplayStyles();
    messageWin.style.display = 'block';

    return;
  }

  if (!game.isGame) {
    return;
  }
  touchEndX = e.changedTouches[0].screenX;
  touchEndY = e.changedTouches[0].screenY;

  handleGesture();
});

function handleGesture() {
  if (!game.isGame) {
    return;
  }

  const diffX = touchEndX - touchStartX;
  const diffY = touchEndY - touchStartY;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Горизонтальний свайп
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        game.moveRight();
      } else {
        game.moveLeft();
      }
    }
  } else {
    // Вертикальний свайп
    if (Math.abs(diffY) > threshold) {
      if (diffY > 0) {
        game.moveDown();
      } else {
        game.moveUp();
      }
    }
  }

  const board = game.getState();

  newBlocks(board);
  score.textContent = String(game.getScore());
}
