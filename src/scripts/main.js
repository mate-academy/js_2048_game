'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const rootStyles = getComputedStyle(document.documentElement);
const cellSize = parseFloat(rootStyles.getPropertyValue('--cell-size'));
const cellSpacing = parseFloat(rootStyles.getPropertyValue('--cell-spacing'));

const gameField = document.querySelector('.game-field');
const startBtn = document.querySelector('.start');
const scoreDisplay = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

const gameFieldContainer = document.createElement('section');

gameFieldContainer.className = 'gameFieldContainer';

gameField.parentNode.insertBefore(gameFieldContainer, gameField);
gameFieldContainer.appendChild(gameField);

const tileContainer = document.createElement('div');

tileContainer.classList.add('tile-container');
gameField.parentNode.insertBefore(tileContainer, gameField.nextElementSibling);

const tileElements = new Map();

async function renderBoard() {
  const currentTiles = game.getTiles();
  const currentTileIds = new Set(currentTiles.map((tile) => tile.id));

  for (const [id, element] of tileElements.entries()) {
    if (!currentTileIds.has(id)) {
      const transformValue = window.getComputedStyle(element).transform;

      element.animate(
        [
          { opacity: 1, transform: `${transformValue} scale(1)` },
          { opacity: 0, transform: `${transformValue} scale(0)` },
        ],
        {
          duration: 150,
          easing: 'linear',
          fill: 'forwards',
        },
      );

      element.addEventListener(
        'animationend',
        () => {
          element.remove();
          tileElements.delete(id);
        },
        { once: true },
      );
    }
  }

  currentTiles.forEach((tile) => {
    let tileElement = tileElements.get(tile.id);

    if (!tileElement) {
      tileElement = document.createElement('div');
      tileElement.classList.add('tile');
      tileElement.dataset.id = tile.id;
      tileContainer.appendChild(tileElement);
      tileElements.set(tile.id, tileElement);
    }

    tileElement.textContent = tile.value;
    tileElement.className = 'tile';
    tileElement.classList.add(`tile--${tile.value}`);

    const fullCellSize = cellSize + cellSpacing;
    let finalX = tile.col * fullCellSize;
    let finalY = tile.row * fullCellSize;

    let initialX = finalX;
    let initialY = finalY;

    if (
      tile.previousPosition &&
      (tile.previousPosition.col !== tile.col ||
        tile.previousPosition.row !== tile.row)
    ) {
      initialX = tile.previousPosition.col * fullCellSize;
      initialY = tile.previousPosition.row * fullCellSize;
      tile.previousPosition = null;

      tileElement.animate(
        [
          {
            transform: `translate(${initialX}px, ${initialY}px)`,
            offset: 0,
          },
          {
            transform: `translate(${finalX}px, ${finalY}px)`,
            offset: 1,
          },
        ],
        {
          duration: 250,
          easing: 'ease-in',
          fill: 'forwards',
        },
      );
    } else if (tile.mergedFrom) {
      const parentTileForOrigin = tile.mergedFrom[1];

      initialX = parentTileForOrigin.col * fullCellSize;
      initialY = parentTileForOrigin.row * fullCellSize;

      tileElement.animate(
        [
          {
            transform: `translate(${initialX}px, ${initialY}px) scale(1.2)`,
          },
          {
            transform: `translate(${finalX}px, ${finalY}px) scale(1)`,
          },
        ],
        {
          duration: 200,
          easing: 'linear',
          fill: 'forwards',
        },
      );

      tile.mergedFrom = null;
    }

    if (tile.isNew && !tile.mergedFrom) {
      tileElement.animate(
        [
          {
            transform: `translate(${finalX}px, ${finalY}px) scale(0)`,
            opacity: '0',
          },
          {
            transform: `translate(${finalX}px, ${finalY}px) scale(1.4)`,
            opacity: 0,
          },
          {
            transform: `translate(${finalX}px, ${finalY}px) scale(1)`,
            opacity: 1,
          },
        ],
        {
          duration: 250,
          easing: 'ease-out',
          fill: 'forwards',
        },
      );
    }

    finalX = initialX;
    finalY = initialY;
  });

  scoreDisplay.textContent = game.getScore();

  showMessage(messageWin, 'win');
  showMessage(messageLose, 'lose');
  showMessage(messageStart, 'idle');
}

function showMessage(element, type) {
  if (game.getStatus() === type) {
    element.classList.remove('hidden');
  } else {
    element.classList.add('hidden');
  }
}

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    startBtn.textContent = 'Restart';
    startBtn.classList.remove('start');
    startBtn.classList.add('restart');
  } else {
    game.restart();
  }

  renderBoard();
});

document.addEventListener('keydown', (ev) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (ev.key) {
    case 'ArrowUp':
      game.moveUp();
      moved = true;
      break;
    case 'ArrowDown':
      game.moveDown();
      moved = true;
      break;
    case 'ArrowLeft':
      game.moveLeft();
      moved = true;
      break;
    case 'ArrowRight':
      game.moveRight();
      moved = true;
      break;
    default:
      return;
  }

  if (moved) {
    renderBoard();
  }
});

renderBoard();
