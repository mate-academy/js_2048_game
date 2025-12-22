'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const scoreBoard = document.querySelector('.game-score');
const mainButton = document.querySelector('.button');
const tileContainer = document.querySelector('.tile-container');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

/**
 * Map to track tile DOM elements by their unique ID.
 * @type {Map<number, HTMLElement>}
 */
const tileElements = new Map();

/**
 * Updates the CSS position of a tile element.
 * @param {HTMLElement} element
 * @param {number} r
 * @param {number} c
 */
function updateTilePosition(element, r, c) {
  const topPos = r * 85; // 75px cell + 10px gap
  const leftPos = c * 85;

  element.style.top = `${topPos}px`;
  element.style.left = `${leftPos}px`;
}

/**
 * Creates a new tile DOM element.
 * @param {Object} tile
 * @param {number} r
 * @param {number} c
 */
function createTileElement(tile, r, c) {
  const element = document.createElement('div');

  element.className = `field-cell field-cell--${tile.value}`;
  element.textContent = tile.value;
  updateTilePosition(element, r, c);

  if (tile.isNew) {
    element.classList.add('new');
  }

  tileContainer.appendChild(element);

  return element;
}

function updateUI() {
  const detailedState = game.getDetailedState();
  const gameStatus = game.getStatus();
  const score = game.getScore();

  scoreBoard.textContent = score;

  // Handle messages and button visibility
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  mainButton.classList.add('hidden');

  if (gameStatus === 'playing') {
    mainButton.textContent = 'Restart';
    mainButton.classList.remove('start');
    mainButton.classList.add('restart');
    mainButton.classList.remove('hidden');
  } else if (gameStatus === 'win') {
    messageWin.classList.remove('hidden');
    mainButton.textContent = 'Restart';
    mainButton.classList.remove('start');
    mainButton.classList.add('restart');
    mainButton.classList.remove('hidden');
  } else if (gameStatus === 'lose') {
    messageLose.classList.remove('hidden');
    mainButton.textContent = 'Restart';
    mainButton.classList.remove('start');
    mainButton.classList.add('restart');
    mainButton.classList.remove('hidden');
  } else if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
    mainButton.textContent = 'Start';
    mainButton.classList.add('start');
    mainButton.classList.remove('restart');
    mainButton.classList.remove('hidden');
  }

  // Sync tiles with their model state
  const activeIds = new Set();

  detailedState.forEach((rowArr, rIdx) => {
    rowArr.forEach((tileObj, cIdx) => {
      if (tileObj) {
        activeIds.add(tileObj.id);

        let element = tileElements.get(tileObj.id);

        if (element) {
          // Update existing tile position and value
          updateTilePosition(element, rIdx, cIdx);
          element.textContent = tileObj.value;
          // Refresh classes to trigger animations (e.g. pop on merge)
          element.className = `field-cell field-cell--${tileObj.value}`;

          if (tileObj.mergedFrom) {
            element.classList.add('merged');
          }
        } else {
          // Create new tile
          element = createTileElement(tileObj, rIdx, cIdx);
          tileElements.set(tileObj.id, element);
        }
      }
    });
  });

  // Remove tiles that are no longer in the game state
  for (const [id, element] of tileElements.entries()) {
    if (!activeIds.has(id)) {
      element.remove();
      tileElements.delete(id);
    }
  }
}

mainButton.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
  } else {
    game.restart();
    // Reset internal UI state on restart
    tileElements.forEach((el) => el.remove());
    tileElements.clear();
  }
  updateUI();
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  let moved = false;

  switch (e.key) {
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

  if (moved) {
    updateUI();
  }
});

// Initial render
updateUI();
