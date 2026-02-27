'use strict';

const Game = require('../modules/Game.class');
// const initialBoard = [
//   [1024, 1024, 2, 4],
//   [4, 2, 4, 2],
//   [2, 4, 2, 4],
//   [4, 2, 0, 0],
// ];
const game = new Game();

const score = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const btnStart = document.querySelector('.button');
const msgStart = document.querySelector('.message-start');
const msgWin = document.querySelector('.message-win');
const msgLose = document.querySelector('.message-lose');

btnStart.addEventListener('click', () => {
  if (btnStart.classList.contains('restart')) {
    msgLose.classList.add('hidden');
    msgWin.classList.add('hidden');
    game.restart();
  } else {
    game.start();
    msgStart.classList.add('hidden');
  }

  render();
});

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener(
  'touchstart',
  (e) => {
    // Запоминаем начальную точку касания
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  },
  { passive: true },
);

document.addEventListener(
  'touchend',
  (e) => {
    // Запоминаем точку, где палец оторвался от экрана
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;

    handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
  },
  { passive: true },
);

function handleSwipe(startX, startY, endX, endY) {
  const diffX = endX - startX;
  const diffY = endY - startY;

  // Минимальное расстояние в пикселях, которое считается за свайп
  const threshold = 30;

  if (Math.abs(diffX) > Math.abs(diffY)) {
    // Горизонтальный свайп
    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        game.moveRight();
      } else {
        game.moveLeft();
      }
      render();
    }
  } else {
    // Вертикальный свайп
    if (Math.abs(diffY) > threshold) {
      if (diffY > 0) {
        game.moveDown();
      } else {
        game.moveUp();
      }
      render();
    }
  }
}

document.addEventListener('keydown', (e) => {
  btnStart.classList.remove('start');
  btnStart.classList.add('restart');
  btnStart.textContent = 'Restart';

  const gameStatus = game.getStatus();

  if (gameStatus === 'win' || gameStatus === 'lose') {
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

function render() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'win') {
    msgWin.classList.remove('hidden');
  }

  if (gameStatus === 'lose') {
    msgLose.classList.remove('hidden');
  }

  score.textContent = game.getScore();

  const board = game.getState();

  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board.length; col++) {
      const index = row * 4 + col;
      const cell = cells[index];

      cell.textContent = board[row][col] > 0 ? `${board[row][col]}` : '';
      cell.className = 'field-cell';
      cell.classList.add('field-cell--' + board[row][col]);
    }
  }
}
