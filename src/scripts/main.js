'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const button = document.querySelector('.button');
let startX = 0;
let startY = 0;

const SWIPE_THRESHOLD = 30;

button.addEventListener('click', () => {
  const gameStatus = game.getStatus();

  if (gameStatus === 'idle') {
    game.start();
  } else {
    clearTiles();
    game.restart();
  }

  renderGame();
});

function getCSSVariable(varName) {
  return parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue(varName),
  );
}

const renderGame = (direction = null) => {
  render({
    board: game.getState(),
    tiles: game.getTiles(),
    score: game.getScore(),
    bestScore: game.getBestScore(),
    gameStatus: game.getStatus(),
    direction,
  });
};

const render = ({ tiles, score, bestScore, gameStatus, direction }) => {
  renderBoard();
  renderScore(score);
  renderStatus(gameStatus);
  renderBestScore(bestScore);
  renderButton(gameStatus);
  renderTiles(tiles, direction);
};

const makeMove = (direction) => {
  let moved = false;

  switch (direction) {
    case 'left':
      moved = game.moveLeft();
      break;

    case 'right':
      moved = game.moveRight();
      break;

    case 'up':
      moved = game.moveUp();
      break;

    case 'down':
      moved = game.moveDown();
      break;

    default:
      break;
  }

  if (moved) {
    renderGame(direction);
  }
};

document.addEventListener('touchstart', (e) => {
  const touch = e.touches[0];

  startX = touch.clientX;
  startY = touch.clientY;
});

document.addEventListener('touchend', (e) => {
  const touch = e.changedTouches[0];

  const endX = touch.clientX;
  const endY = touch.clientY;

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  if (
    Math.abs(deltaX) < SWIPE_THRESHOLD &&
    Math.abs(deltaY) < SWIPE_THRESHOLD
  ) {
    return;
  }

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      makeMove('right');
    } else {
      makeMove('left');
    }
  } else {
    if (deltaY > 0) {
      makeMove('down');
    } else {
      makeMove('up');
    }
  }
});

document.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'ArrowLeft':
      makeMove('left');
      break;

    case 'ArrowRight':
      makeMove('right');
      break;

    case 'ArrowUp':
      makeMove('up');
      break;

    case 'ArrowDown':
      makeMove('down');
      break;

    default:
      break;
  }
});

window.addEventListener('resize', () => {
  renderGame();
});

const clearTiles = () => {
  const layer = document.querySelector('.tiles-layer');

  layer.innerHTML = '';
};

const moveTileTo = (element, tile) => {
  const cellSize = getCSSVariable('--cell-size');
  const cellGap = getCSSVariable('--cell-gap');
  const step = cellSize + cellGap;

  element.style.transform = `translate(${tile.col * step}px, ${tile.row * step}px)`;
};

const renderTiles = (tiles, direction) => {
  const layer = document.querySelector('.tiles-layer');

  if (!layer) {
    throw new Error('Tiles layer not found');
  }

  const mergedIds = new Set();

  tiles.forEach((tile) => {
    if (tile.mergedFrom) {
      tile.mergedFrom.forEach((id) => mergedIds.add(id));
    }
  });

  const currentIds = new Set(tiles.map((tile) => tile.id));

  layer.querySelectorAll('.tile-wrapper').forEach((wrapper) => {
    const id = +wrapper.dataset.id;

    if (!currentIds.has(id) && !mergedIds.has(id)) {
      wrapper.remove();
    }
  });

  tiles.forEach((tile) => {
    let wrapper = layer.querySelector(`.tile-wrapper[data-id="${tile.id}"]`);

    if (!wrapper) {
      wrapper = document.createElement('div');

      wrapper.classList.add('tile-wrapper');
      wrapper.dataset.id = tile.id;

      const element = document.createElement('div');

      element.className = `tile tile--${tile.value}`;
      element.textContent = tile.value;

      if (!tile.mergedFrom) {
        element.classList.add('tile--new');
      }

      wrapper.append(element);

      wrapper.style.transition = 'none';

      moveTileTo(wrapper, tile);

      layer.append(wrapper);

      requestAnimationFrame(() => {
        wrapper.style.transition = '';
      });
    }

    const tileElement = wrapper.querySelector('.tile');

    if (!tileElement) {
      throw new Error(`Tile not found for tile ${tile.id}`);
    }

    tileElement.textContent = tile.value;

    if (tile.mergedFrom) {
      const mergedElements = tile.mergedFrom
        .map((id) => {
          return layer.querySelector(`[data-id="${id}"]`);
        })
        .filter(Boolean);

      mergedElements.forEach((el) => moveTileTo(el, tile));

      mergedElements.forEach((el) => {
        el.remove();
      });

      moveTileTo(wrapper, tile);

      tileElement.classList.add('tile--merged');
    } else {
      moveTileTo(wrapper, tile);

      const hasMoved =
        direction === 'left' || direction === 'right'
          ? tile.previousCol !== tile.col
          : tile.previousRow !== tile.row;

      if (hasMoved) {
        const overshootClass = `tile-wrapper--overshoot-${direction}`;

        wrapper.classList.add(overshootClass);

        wrapper.addEventListener(
          'animationend',
          () => {
            wrapper.classList.remove(overshootClass);
          },
          { once: true },
        );
      }
    }
  });
};

const renderButton = (gameStatus) => {
  const buttonElement = document.querySelector('.button');

  if (gameStatus === 'idle') {
    buttonElement.classList.remove('restart');
    buttonElement.classList.add('start');
    buttonElement.textContent = 'Start';
  } else {
    buttonElement.classList.remove('start');
    buttonElement.classList.add('restart');
    buttonElement.textContent = 'Restart';
  }
};

const renderBoard = () => {
  const rows = document.querySelectorAll('.field-row');

  rows.forEach((row) => {
    const cells = row.querySelectorAll('.field-cell');

    cells.forEach((cell) => {
      cell.className = 'field-cell';
      cell.textContent = '';
    });
  });
};

const renderScore = (score) => {
  const scoreElement = document.querySelector('.game-score');

  scoreElement.textContent = score;
};

const renderBestScore = (bestScore) => {
  const bestScoreElement = document.querySelector('.game-best-score');

  bestScoreElement.textContent = bestScore;
};

const renderStatus = (gameStatus) => {
  const startMessage = document.querySelector('.message-start');
  const winMessage = document.querySelector('.message-win');
  const loseMessage = document.querySelector('.message-lose');

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  switch (gameStatus) {
    case 'idle':
      startMessage.classList.remove('hidden');
      break;

    case 'win':
      winMessage.classList.remove('hidden');
      break;

    case 'lose':
      loseMessage.classList.remove('hidden');
      break;

    default:
      break;
  }
};

renderGame();
