import 'regenerator-runtime/runtime';
import { Grid } from './grid.js';
import { Tile } from './tile.js';

window.CSS.registerProperty({
  name: '--border-angle',
  syntax: '<angle>',
  inherits: true,
  initialValue: '0turn',
});

const button = document.querySelector('.button');
const message = document.querySelectorAll('.message');
const gameField = document.getElementById('game_field');

const grid = new Grid(gameField);

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'RESTART';
    hideMessage('message_start');
  }

  grid.cells.forEach(cell => {
    if (!cell.isEmpty()) {
      cell.linkedTile.removeFromDOM();
      cell.unlinkTile();
      cell.restartScore();
    }
  });

  hideMessage('message_lose');
  hideMessage('message_win');

  grid.getRandomEmptyCell().linkTile(new Tile(gameField));
  grid.getRandomEmptyCell().linkTile(new Tile(gameField));

  setupInputOnce();
});

setupInputOnce();

function setupInputOnce() {
  window.addEventListener('keydown', handleInput, { once: true });
}

async function handleInput(moveEvent) {
  switch (moveEvent.key) {
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
      if (!canMoveRight()) {
        setupInputOnce();

        return;
      }
      await moveRight();
      break;

    default:
      setupInputOnce();

      return;
  }

  const newTile = new Tile(gameField);

  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    await newTile.waitForAnimationEnd();
    showMessage('message_lose');

    return;
  }

  setupInputOnce();
}

async function moveUp() {
  await slideTiles(grid.cellsGroupedByColumn);
}

async function moveDown() {
  await slideTiles(grid.cellsGroupedByReversedColumn);
}

async function moveLeft() {
  await slideTiles(grid.cellsGroupedByRow);
}

async function moveRight() {
  await slideTiles(grid.cellsGroupedByReversedRow);
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
    }

    cellWithTile.unlinkTile();
  }
}

function canMoveUp() {
  return canMove(grid.cellsGroupedByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsGroupedByReversedColumn);
}

function canMoveLeft() {
  return canMove(grid.cellsGroupedByRow);
}

function canMoveRight() {
  return canMove(grid.cellsGroupedByReversedRow);
}

function canMove(groupedCells) {
  return groupedCells.some(group => canMoveGroup(group));
}

function canMoveGroup(group) {
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

function hideMessage(className) {
  message.forEach((mes) => {
    if (mes.classList.contains(className)) {
      mes.classList.add('hidden');
    }
  });
}

function showMessage(className) {
  message.forEach((mes) => {
    if (mes.classList.contains(className)) {
      mes.classList.remove('hidden');
    }
  });
}
