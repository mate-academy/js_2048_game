'use strict';

import Game from '../modules/Game.class.js';

let currentSize = 4;
let game = new Game(currentSize);

const scoreElement = document.querySelector('.game-score');
const movesElement = document.querySelector('.game-moves');
const button = document.querySelector('.button');
const tableBody = document.querySelector('tbody');
const gameTable = document.querySelector('.game-field');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const continueButton = winMessage.querySelector('.keep-playing');

const settingsPanel = document.querySelector('.game-settings');
const sizeSlider = document.querySelector('#board-size-slider');
const sizeValueSpan1 = document.querySelector('#board-size-value');
const sizeValueSpan2 = document.querySelector('#board-size-value-2');

const render = () => {
  const board = game.state;
  const score = game.score;
  const moves = game.moves;

  scoreElement.textContent = score;
  tableBody.innerHTML = '';
  movesElement.textContent = moves;

  gameTable.style.setProperty('--grid-size', game.size);

  board.forEach((rowData) => {
    const tr = document.createElement('tr');

    tr.className = 'field-row';

    rowData.forEach((cellValue) => {
      const td = document.createElement('td');

      td.textContent = cellValue === 0 ? '' : cellValue;
      td.className = `field-cell field-cell--${cellValue}`;
      tr.append(td);
    });
    tableBody.append(tr);
  });
};

const updateUi = () => {
  const gameStatus = game.status;

  startMessage.classList.toggle('hidden', gameStatus !== Game.Status.Idle);
  winMessage.classList.toggle('hidden', gameStatus !== Game.Status.Win);
  loseMessage.classList.toggle('hidden', gameStatus !== Game.Status.GameOver);

  settingsPanel.classList.toggle('hidden', gameStatus !== Game.Status.Idle);
  gameTable.classList.toggle('hidden', gameStatus === Game.Status.Idle);

  if (game.status !== Game.Status.Idle) {
    button.textContent = 'Restart';
    button.className = 'button restart';
    sizeSlider.disabled = true;
  } else {
    button.textContent = 'Start';
    button.className = 'button start';
    sizeSlider.disabled = false;
  }
};

const handleMove = (direction) => {
  const moved = game.move(direction);

  if (moved) {
    render();
    updateUi();
  }
};

button.addEventListener('click', () => {
  game = new Game(currentSize);
  game.start();
  render();
  updateUi();
});

continueButton.addEventListener('click', () => {
  game.continuePlaying();
  updateUi();
});

sizeSlider.addEventListener('input', (e) => {
  currentSize = Number(e.target.value);
  sizeValueSpan1.textContent = currentSize;
  sizeValueSpan2.textContent = currentSize;
});

document.addEventListener('keydown', (e) => {
  let direction;

  switch (e.key) {
    case 'ArrowUp':
      direction = Game.Direction.Up;
      break;
    case 'ArrowDown':
      direction = Game.Direction.Down;
      break;
    case 'ArrowLeft':
      direction = Game.Direction.Left;
      break;
    case 'ArrowRight':
      direction = Game.Direction.Right;
      break;
    default:
      return;
  }
  e.preventDefault();
  handleMove(direction);
});

let touchStartX = 0;
let touchStartY = 0;

gameTable.addEventListener(
  'touchstart',
  (e) => {
    e.preventDefault();
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  },
  { passive: false },
);

gameTable.addEventListener('touchend', (e) => {
  e.preventDefault();

  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const swipeThreshold = 50;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > swipeThreshold) {
      handleMove(Game.Direction.Right);
    } else if (deltaX < -swipeThreshold) {
      handleMove(Game.Direction.Left);
    }
  } else {
    if (deltaY > swipeThreshold) {
      handleMove(Game.Direction.Down);
    } else if (deltaY < -swipeThreshold) {
      handleMove(Game.Direction.Up);
    }
  }
});

updateUi();
