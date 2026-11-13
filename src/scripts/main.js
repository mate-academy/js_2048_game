'use strict';

const Game = require('../modules/Game.class');

const game = new Game();

const startBtn = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');
const cells = document.querySelectorAll('.field-cell');
const tileContainer = document.querySelector('.tile-container');

const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');

function getCellPosition(row, col) {
  const targetCell = cells[row * 4 + col];

  return {
    x: targetCell.offsetLeft,
    y: targetCell.offsetTop,
  };
}

function createTileElement(tileData, extraClass) {
  const wrapper = document.createElement('div');

  wrapper.className = extraClass ? `tile ${extraClass}` : 'tile';

  const inner = document.createElement('div');

  inner.className = `tile-inner field-cell field-cell--${tileData.value}`;
  inner.textContent = tileData.value;

  wrapper.append(inner);

  return wrapper;
}

function render() {
  const gameStatus = game.getStatus();
  const tiles = game.getTiles();
  const ghosts = game.getMergedGhosts();
  const animatedMoves = [];

  tileContainer.innerHTML = '';

  ghosts.forEach((ghost) => {
    const startPos = getCellPosition(ghost.prevRow, ghost.prevCol);
    const endPos = getCellPosition(ghost.row, ghost.col);
    const ghostEl = createTileElement(ghost, '');

    ghostEl.style.transform = `translate(${startPos.x}px, ${startPos.y}px)`;
    tileContainer.append(ghostEl);

    animatedMoves.push({
      element: ghostEl,
      endPos,
    });

    setTimeout(() => {
      ghostEl.remove();
    }, 150);
  });

  tiles.forEach((tile) => {
    let modifier = '';

    if (tile.isNew) {
      modifier = 'tile--new';
    } else if (tile.isMerged) {
      modifier = 'tile--merged';
    }

    const tileEl = createTileElement(tile, modifier);
    const endPos = getCellPosition(tile.row, tile.col);

    if (tile.prevRow !== null && tile.prevCol !== null) {
      const startPos = getCellPosition(tile.prevRow, tile.prevCol);

      tileEl.style.transform = `translate(${startPos.x}px, ${startPos.y}px)`;
      tileContainer.append(tileEl);

      animatedMoves.push({
        element: tileEl,
        endPos,
      });
    } else {
      tileEl.style.transform = `translate(${endPos.x}px, ${endPos.y}px)`;
      tileContainer.append(tileEl);
    }
  });

  if (animatedMoves.length > 0) {
    void tileContainer.offsetWidth;

    animatedMoves.forEach(({ element, endPos }) => {
      element.style.transform = `translate(${endPos.x}px, ${endPos.y}px)`;
    });
  }

  scoreElement.textContent = game.getScore();

  if (gameStatus === 'idle') {
    messageStart.classList.remove('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  } else if (gameStatus === 'playing') {
    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  } else if (gameStatus === 'win') {
    messageStart.classList.add('hidden');
    messageWin.classList.remove('hidden');
    messageLose.classList.add('hidden');
  } else if (gameStatus === 'lose') {
    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.remove('hidden');
  }
}

startBtn.addEventListener('click', () => {
  if (game.getStatus() === 'idle') {
    game.start();
    render();
  } else {
    game.restart();
    startBtn.className = 'button start';
    startBtn.textContent = 'Start';
    render();
  }
});

document.addEventListener('keydown', (e) => {
  if (game.getStatus() !== 'playing') {
    return;
  }

  const stateBefore = JSON.stringify(game.getState());

  if (e.key === 'ArrowLeft') {
    e.preventDefault();
    game.moveLeft();
  } else if (e.key === 'ArrowRight') {
    e.preventDefault();
    game.moveRight();
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    game.moveUp();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    game.moveDown();
  } else {
    return;
  }

  const stateAfter = JSON.stringify(game.getState());

  if (stateBefore !== stateAfter) {
    startBtn.className = 'button restart';
    startBtn.textContent = 'Restart';
  }

  render();
});

render();
