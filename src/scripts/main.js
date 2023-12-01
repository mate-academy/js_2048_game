import { Grid } from './grid.js';
import { Tile } from './tile.js';

const button = document.querySelector('.button');
const gameBoard = document.getElementById('game-board');
const grid = new Grid(gameBoard);

const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const messageRestart = document.querySelector('.message-restart');

const gameScore = document.querySelector('.game-score');

button.addEventListener('click', () => {
  if (button.classList.contains('restart')) {

    restartGame();
  } else {
    button.classList.remove('start');
    button.classList.add('restart');
    button.innerHTML = 'Restart';

    restartGame();

    messageRestart.classList.remove('hidden');
    messageStart.classList.add('hidden');
  }
});

function setupInputOnce() {
  window.addEventListener('keydown', handleInput, {once: true});
}

function handleInput(event) {
  switch (event.key) {
    case 'ArrowUp':
      if(!canMoveUp()) {
        setupInputOnce();
        return;
      }
      moveUp();
      break;

    case 'ArrowDown':
      if(!canMoveDown()) {
        setupInputOnce();
        return;
      }
      moveDown();
      break;

    case 'ArrowLeft':
      if(!canMoveLeft()) {
        setupInputOnce();
        return;
      }
      moveLeft();
      break;

    case 'ArrowRight':
      if(!canMoveRight()) {
        setupInputOnce();
        return;
      }
      moveRight();
      break;

    default:
      setupInputOnce();
      return;
  }

  const newTile = new Tile(gameBoard);
  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    messageLose.classList.remove('hidden');
    messageStart.classList.add('hidden');
    messageRestart.classList.add('hidden');
  }

  setupInputOnce();
}

function moveUp() {
  slideTiles(grid.cellsGroupedByColumn);
  updateGameScore();
}

function moveDown() {
  slideTiles(grid.cellsGroupedByReversedColumn);
  updateGameScore();
}

function moveLeft() {
  slideTiles(grid.cellsGroupedByRow);
  updateGameScore();
}

function moveRight() {
  slideTiles(grid.cellsGroupedByReversedRow);
  updateGameScore();
}

function slideTiles(groupedCells) {
  groupedCells.forEach(group => slideTilesInGroup(group));

  grid.cells.forEach(cell => {
    cell.hasTileForMerge() && cell.mergeTiles();
  });

  setupInputOnce();
}

function slideTilesInGroup(group) {
  for (let i = 0; i < group.length; i++) {
    if (group[i].isEmpty()) {
      continue;
    }

    const cellWithTile = group[i];

    let targetCell;
    let j = i - 1;
    while(j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
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

function canMove(groupedCells) {
  return groupedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {
  return group.some((cell, index) => {
    if (index === 0)  {
      return false;
    }

    if (cell.isEmpty()) {
      return false;
    }

    const targetCell = group[index - 1];
    return targetCell.canAccept(cell.linkedTile);
  })
}

function updateGameScore() {
  gameScore.textContent = grid.totalScore;

  if (grid.lastMerge === 2048) {
    messageRestart.classList.add('hidden');
    messageWin.classList.remove('hidden');
  }
}

function restartGame() {
  grid.reset();
  grid.totalScore = 0;
  gameScore.textContent = grid.totalScore;

  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));

  messageRestart.classList.remove('hidden');
  messageLose.classList.add('hidden');

  if (!messageWin.classList.contains('hidden')) {
    messageWin.classList.add ('hidden');
  };

  setupInputOnce();
}
