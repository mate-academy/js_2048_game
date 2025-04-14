'use strict';
import { Grid } from './Grid.js';
import { Tile } from './Tile.js';

const gameField = document.getElementById('game-field');
const button = document.querySelector('.button');
const scoreField = document.querySelector('.game-score');
const bestField = document.querySelector('.game-best');

const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const endMessage = document.querySelector('.message-end');

let grid = new Grid(gameField);

let score = 0;
let bestScore = getBestScore();

bestField.textContent = bestScore;
button.addEventListener('click', loadGame);

function loadGame() {
  while (gameField.firstChild) {
    gameField.removeChild(gameField.firstChild);
  }

  grid = new Grid(gameField);
  grid.getRandomEmptyCell().linkTile(new Tile(gameField));
  grid.getRandomEmptyCell().linkTile(new Tile(gameField));

  score = 0;
  scoreField.textContent = score;
  button.classList.replace('start', 'restart');
  button.textContent = 'Restart';

  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  endMessage.classList.add('hidden');
  button.blur();

  setupInputOnce();
}

function getBestScore() {
  return +localStorage.getItem('bestScore') || 0;
}

function setupInputOnce() {
  window.addEventListener('keydown', inputHandler, { once: true });
}

function inputHandler(e) {
  switch (e.key) {
    case 'ArrowUp':
      if (!canMoveUp()) {
        setupInputOnce();

        return;
      }

      moveUp();

      break;

    case 'ArrowDown':
      if (!canMoveDown()) {
        setupInputOnce();

        return;
      }

      moveDown();

      break;

    case 'ArrowLeft':
      if (!canMoveLeft()) {
        setupInputOnce();

        return;
      }

      moveLeft();

      break;

    case 'ArrowRight':
      if (!canMoveRight()) {
        setupInputOnce();

        return;
      }

      moveRight();

      break;

    default:
      setupInputOnce();

      return;
  }

  const newTile = new Tile(gameField);

  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    if (!winMessage.classList.contains('hidden')) {
      endMessage.classList.remove('hidden');

      return;
    }

    loseMessage.classList.remove('hidden');

    return;
  }

  setupInputOnce();
}

function moveUp() {
  slideTiles(grid.cellsGroupedByColumn);
}

function moveDown() {
  slideTiles(grid.cellsGroupedByReversedColumn);
}

function moveLeft() {
  slideTiles(grid.cellsGroupedByRow);
}

function moveRight() {
  slideTiles(grid.cellsGroupedByReversedRow);
}

function slideTiles(gruopedCells) {
  gruopedCells.forEach((group) => slideTilesInGroup(group));

  grid.cells.forEach((cell) => {
    if (cell.hasTileForMerge()) {
      const currentScore = cell.mergeTiles();

      if (currentScore === 2048) {
        winMessage.classList.remove('hidden');
      }

      score += currentScore;
      scoreField.textContent = score;

      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('bestScore', bestScore);
        bestField.textContent = bestScore;
      }
    }
  });
}

function slideTilesInGroup(group) {
  for (let i = 1; i < group.length; i += 1) {
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

function canMove(gruopedCells) {
  return gruopedCells.some((group) => canMoveInGroup(group));
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
