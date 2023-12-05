import { Grid } from './grid.js';
import { Tile } from './tile.js';

const gameBoard = document.querySelector('.board');
const grid = new Grid(gameBoard);
const startButton = document.querySelector('.start');
const scoreElement = document.querySelector('.game_score');
const touchArea = document.querySelector('.body2048');
let restart = false;
let gameScore = 0;

startButton.addEventListener('click', () => {
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';

  const hiddenMessage = document.querySelector('.message_start');

  hiddenMessage.classList.add('hidden');

  if (restart) {
    window.location.reload();
  }

  restart = true;
});

setupInputOnce();

function setupInputOnce() {
  window.addEventListener('keydown', handleInput, { once: true });
}

document.addEventListener('keydown', (keypress) => {
  const keysToCancel = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

  if (keysToCancel.includes(keypress.key)) {
    keypress.preventDefault();
  }
});

async function handleInput(keypress) {
  switch (keypress.key) {
    case 'ArrowUp':
      if (!canMoveUp()) {
        setupInputOnce();

        return;
      }

      await moveUp();
      break;

    case 'ArrowDown':
      if (!canMoveDown()) {
        setupInputOnce();

        return;
      }

      await moveDown();
      break;

    case 'ArrowLeft':
      if (!canMoveLeft()) {
        setupInputOnce();

        return;
      }

      await moveLeft();
      break;

    case 'ArrowRight':
      if (!canMoveRigth()) {
        setupInputOnce();

        return;
      }

      await moveRight();
      break;

    default:
      setupInputOnce();

      return;
  }

  const newTile = new Tile(gameBoard);

  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRigth()) {
    await newTile.waitForAnimationEnd();

    const gameResultElement = document.querySelector('.message_lose');

    gameResultElement.classList.remove('hidden');
    gameResultElement.style.color = '#ff0000';

    startButton.addEventListener('click', () => {
      window.location.reload();
    });

    return;
  }

  setupInputOnce();
}

async function moveUp() {
  await slideTiles(grid.cellsGroupedByColumn);
}

async function moveDown() {
  await slideTiles(grid.cellsGroupedByReservedColumn);
}

async function moveLeft() {
  await slideTiles(grid.cellsGroupedByRow);
}

async function moveRight() {
  await slideTiles(grid.cellsGroupedByReservedRow);
}

async function slideTiles(groupedCells) {
  const promises = [];

  groupedCells.forEach(group => slideTilesInGroup(group, promises));

  await Promise.all(promises);

  grid.cells.forEach(cell => {
    cell.hasTileForMerge() && cell.mergeTiles();
  });
}

function slideTilesInGroup(group, promises) {
  for (let i = 1; i < group.length; i++) {
    if (group[i].isEmpty()) {
      continue;
    }

    const cellWithTile = group[i];
    let targetCell;
    let j = i - 1;

    while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
      targetCell = group[j];
      j--;
    }

    if (!targetCell) {
      continue;
    }

    promises.push(cellWithTile.linkedTile.waitForTransitionEnd());

    if (targetCell.isEmpty()) {
      targetCell.linkTile(cellWithTile.linkedTile);
    } else {
      targetCell.linkTileForMerge(cellWithTile.linkedTile);

      gameScore += cellWithTile.linkedTile.value;
    }

    cellWithTile.unlinkTile();
    updateScore();
  }
}

function canMoveUp() {
  return canMove(grid.cellsGroupedByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsGroupedByReservedColumn);
}

function canMoveLeft() {
  return canMove(grid.cellsGroupedByRow);
}

function canMoveRigth() {
  return canMove(grid.cellsGroupedByReservedRow);
}

function canMove(groupedCells) {
  return groupedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {
  return group.some((cell, index) => {
    if (index === 0) {
      return false;
    }

    if (cell.isEmpty()) {
      return false;
    }

    const targetCell = group[index - 1];

    return targetCell.canAccept(cell.linkedTile);
  });
}

function updateScore() {
  scoreElement.textContent = `${gameScore}`;
}

let startX, startY;

touchArea.addEventListener('touchstart', (movement) => {
  startX = movement.touches[0].clientX;
  startY = movement.touches[0].clientY;
}, { passive: true });

touchArea.addEventListener('touchend', (movement) => {
  const endX = movement.changedTouches[0].clientX;
  const endY = movement.changedTouches[0].clientY;

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  swipe(deltaX, deltaY);
}, { passive: true });

async function swipe(deltaX, deltaY) {
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0) {
      if (!canMoveRigth()) {
        setupInputOnce();

        return;
      }

      await moveRight();
    } else {
      if (!canMoveLeft()) {
        setupInputOnce();

        return;
      }

      await moveLeft();
    }
  } else {
    if (deltaY > 0) {
      if (!canMoveDown()) {
        setupInputOnce();

        return;
      }

      await moveDown();
    } else {
      if (!canMoveUp()) {
        setupInputOnce();

        return;
      }

      await moveUp();
    }
  }

  const newTile = new Tile(gameBoard);

  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRigth()) {
    await newTile.waitForAnimationEnd();

    const gameResultElement = document.querySelector('.message_lose');

    gameResultElement.classList.remove('hidden');
    gameResultElement.style.color = '#ff0000';

    startButton.addEventListener('click', () => {
      window.location.reload();
    });

    return;
  }

  setupInputOnce();
}
