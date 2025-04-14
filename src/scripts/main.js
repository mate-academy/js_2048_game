import { Grid } from '../scripts/grid';
import { Tile } from '../scripts/tile';

const gameBoard = document.querySelector('.game-board');

const scoreValueElement = document.getElementById('score-value');
const startButton = document.querySelector('.button');
const restartButton = document.querySelector('.restart-button');

let score = 0;
let gameStarted = false;
let grid;

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

function startGame() {
  gameStarted = true;
  startButton.style.display = 'none';
  restartButton.style.display = 'inline-block';

  initializeGrid();
}

function restartGame() {
  gameStarted = false;
  startButton.style.display = 'inline-block';
  restartButton.style.display = 'none';
  score = 0;
  updateScoreUI();

  gameBoard.innerHTML = '';
  grid = null;
}

function initializeGrid() {
  gameBoard.innerHTML = '';
  grid = new Grid(gameBoard);

  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));

  score = 0;
  updateScoreUI();
  setupInputOnce();
}

function updateScoreUI() {
  scoreValueElement.textContent = score;
}

function setupInputOnce() {
  window.addEventListener('keydown', handleInput, { once: true });
}

async function handleInput(e) {
  if (!gameStarted) {
    setupInputOnce();

    return;
  }

  switch (e.key) {
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
      if (!canMoveleft()) {
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

  const newTile = new Tile(gameBoard);

  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveRight() && !canMoveleft()) {
    await newTile.waitForAnimationEnd();
    alert('Game Over! Try again.');
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
    if (cell.hasTileForMerge()) {
      score += cell.linkedTile.value;
      updateScoreUI();
      cell.mergeTiles();
    }
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
    promises.push(cellWithTile.linkedTile.waitForTransitionEnd);

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

function canMoveleft() {
  return canMove(grid.cellsGroupedByRow);
}

function canMoveRight() {
  return canMove(grid.cellsGroupedByReversedRow);
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
