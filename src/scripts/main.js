'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const gameFieldRect = document.querySelector('.game-field');
const animationWrapper = document.querySelector('.animations-layer');

animationWrapper.style.height =
  gameFieldRect.getBoundingClientRect().height + 'px';
animationWrapper.style.top = gameFieldRect.offsetTop + 'px';

const startBtn = document.querySelector('.button');
const score = document.querySelector('.game-score');
const boardRows = document.querySelector('.game-field').tBodies[0].rows;

startBtn.addEventListener('click', () => {
  if (game.getStatus() === Game.STATUS_IDLE) {
    game.start();
  } else {
    game.restart();
  }

  updateBtnState();
  updateMessageState();
  updateScore();
  updateCells();
});

function updateBtnState() {
  startBtn.className = 'button';

  if (game.getStatus() === Game.STATUS_IDLE) {
    startBtn.classList.add('start');
    startBtn.textContent = 'Start';
  } else {
    startBtn.classList.add('restart');
    startBtn.textContent = 'Restart';
  }
}

function updateMessageState() {
  const messages = [...document.querySelectorAll('.message')];

  messages.forEach((mes) => {
    mes.classList.add('hidden');
  });

  switch (game.getStatus()) {
    case Game.STATUS_IDLE:
      messages
        .find((mes) => mes.classList.contains('message-start'))
        .classList.remove('hidden');
      break;

    case Game.STATUS_LOSE:
      messages
        .find((mes) => mes.classList.contains('message-lose'))
        .classList.remove('hidden');
      break;

    case Game.STATUS_WIN:
      messages
        .find((mes) => mes.classList.contains('message-win'))
        .classList.remove('hidden');
      break;
  }
}

function updateScore() {
  score.textContent = game.getScore();
}

function updateCells(direction = 'left') {
  const { rowIndex, colIndex } = game.getLastAddedCell();
  const animationWrapperRect = animationWrapper.getBoundingClientRect();
  const prevState = game.getPrevState();
  const newState = JSON.stringify(game.getState());

  if (prevState === newState) {
    return;
  }

  for (let i = 0; i < boardRows.length; i++) {
    for (let j = 0; j < boardRows[i].cells.length; j++) {
      const cell = boardRows[i].cells[j];
      const cellRect = cell.getBoundingClientRect();

      cell.className = 'field-cell';
      cell.textContent = game.getState()[i][j] || '';

      cell.classList.add(`field-cell--${game.getState()[i][j]}`);

      if (cell.textContent && i !== rowIndex && j !== colIndex) {
        const cellCopy = cell.cloneNode(true);

        cell.style.opacity = 0;
        cellCopy.style.lineHeight = cellRect.height + 'px';
        cellCopy.style.position = 'absolute';
        cellCopy.style.left = cellRect.left - animationWrapperRect.left + 'px';
        cellCopy.style.top = cellRect.top - animationWrapperRect.top + 'px';
        cellCopy.style.transition = '0.3s';

        animationWrapper.append(cellCopy);

        switch (direction) {
          case 'left':
            cellCopy.style.transform = 'translateX(100%)';
            break;

          case 'right':
            cellCopy.style.transform = 'translateX(-100%)';
            break;

          case 'up':
            cellCopy.style.transform = 'translateY(100%)';
            break;

          case 'down':
            cellCopy.style.transform = 'translateY(-100%)';
            break;
        }

        requestAnimationFrame(() => {
          cellCopy.style.transform = 'translate(0, 0)';
        });

        cellCopy.addEventListener('transitionend', () => {
          cell.style.opacity = 1;
          cellCopy.remove();
        });
      }

      if (i === rowIndex && j === colIndex) {
        cell.classList.add('field-cell--new');

        setTimeout(() => cell.classList.remove('field-cell--new'), 200);
      }
    }
  }
}

document.addEventListener('keydown', (e) => {
  if (
    game.getStatus() !== Game.STATUS_WIN &&
    game.getStatus() !== Game.STATUS_LOSE
  ) {
    if (e.key === 'ArrowLeft') {
      game.move('left');
      updateCells('left');
    }

    if (e.key === 'ArrowRight') {
      game.move('right');
      updateCells('right');
    }

    if (e.key === 'ArrowUp') {
      game.move('up');
      updateCells('up');
    }

    if (e.key === 'ArrowDown') {
      game.move('down');
      updateCells('down');
    }

    updateBtnState();
    updateScore();
    updateMessageState();
  }
});
