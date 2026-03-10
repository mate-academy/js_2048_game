'use strict';

const game = new window.Game();

window.game = game;

const gameField = document.querySelector('.game-field');
const startButton = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startMessage = document.querySelector('.message-start');
const cellElements = Array.from(document.querySelectorAll('.field-cell'));

const SHAKE_DURATION_MS = 400;
const TILE_ANIMATION_MS = 250;

function clearTileClasses(cell) {
  const tileClasses = Array.from(cell.classList).filter((className) => {
    return className.startsWith('field-cell--');
  });

  cell.classList.remove(...tileClasses);
  cell.classList.remove('tile-new');
  cell.classList.remove('tile-merge');
}

function animateCell(cell, className, duration) {
  cell.classList.add(className);

  setTimeout(() => {
    cell.classList.remove(className);
  }, duration);
}

function renderBoard(previousState = null) {
  const currentState = game.getState();

  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const index = row * 4 + col;
      const cell = cellElements[index];
      const value = currentState[row][col];
      const previousValue = previousState ? previousState[row][col] : 0;

      clearTileClasses(cell);

      if (value === 0) {
        cell.textContent = '';

        continue;
      }

      cell.textContent = value;
      cell.classList.add(`field-cell--${value}`);

      if (previousState && previousValue === 0) {
        animateCell(cell, 'tile-new', TILE_ANIMATION_MS);
      }

      if (previousState && previousValue !== 0 && previousValue !== value) {
        animateCell(cell, 'tile-merge', TILE_ANIMATION_MS);
      }
    }
  }
}

function renderScore() {
  scoreElement.textContent = game.getScore();
}

function setMessageVisibility({ lose = false, win = false, start = false }) {
  loseMessage.classList.toggle('hidden', !lose);
  winMessage.classList.toggle('hidden', !win);
  startMessage.classList.toggle('hidden', !start);
}

function renderStatus() {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    setMessageVisibility({ start: true });
    gameField.classList.remove('shake');

    return;
  }

  if (gameStatus === 'win') {
    setMessageVisibility({ win: true });

    return;
  }

  if (gameStatus === 'lose') {
    setMessageVisibility({ lose: true });
    gameField.classList.add('shake');

    setTimeout(() => {
      gameField.classList.remove('shake');
    }, SHAKE_DURATION_MS);

    return;
  }

  setMessageVisibility({});
}

function render(previousState = null) {
  renderBoard(previousState);
  renderScore();
  renderStatus();
}

function setButtonToRestart() {
  startButton.textContent = 'Restart';
  startButton.classList.remove('start');
  startButton.classList.add('restart');
}

function setButtonToStart() {
  startButton.textContent = 'Start';
  startButton.classList.remove('restart');
  startButton.classList.add('start');
}

function startGame() {
  game.start();
  setButtonToRestart();
  render();
}

function restartGame() {
  game.restart();
  setButtonToStart();
  render();
}

function handleMove(keyboardEvent) {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const previousState = game.getState();
  let moved = false;

  switch (keyboardEvent.key) {
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
      return;
  }

  keyboardEvent.preventDefault();

  if (moved) {
    render(previousState);
  }
}

startButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    startGame();

    return;
  }

  restartGame();
});

document.addEventListener('keydown', handleMove);

render();
