import { Grid } from './grid';
import { Tile } from './tile';

const gameField = document.getElementById('game-field');

const grid = new Grid(gameField);

let score = 0;
const button = document.querySelector('.button');
const scoreElement = document.querySelector('.game-score');

button.addEventListener('click', startGame);

function startGame() {
  setupNewGame();

  document.querySelector('.message-start').classList.add('hidden');
  button.classList.remove('start');
  button.innerHTML = 'Restart';
  button.classList.add('restart');

  button.removeEventListener('click', startGame);
  button.addEventListener('click', setupNewGame);
}

function setupNewGame() {
  grid.cells.forEach(cell => {
    if (!cell.isEmpty()) {
      cell.linkedTile.removeFromDom();
      cell.unlinkTile();
    }
  });

  grid.getRandomEmptyCell().linkTile(new Tile(gameField));
  grid.getRandomEmptyCell().linkTile(new Tile(gameField));

  setupInputOnce();

  score = 0;
  scoreElement.innerHTML = score;

  document.querySelector('.message-lose').classList.add('hidden');
  document.querySelector('.message-win').classList.add('hidden');
}

function handleInput(e) {
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
    document.querySelector('.message-lose').classList.remove('hidden');
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

function slideTilesInGroup(group) {
  for (let i = 0; i < group.length; i++) {
    if (group[i].isEmpty()) {
      continue;
    }

    const cellWithTail = group[i];

    let targetCell;
    let j = i - 1;

    while (j >= 0 && group[j].canAccept(cellWithTail.linkedTile)) {
      targetCell = group[j];
      j--;
    }

    if (!targetCell) {
      continue;
    }

    if (targetCell.isEmpty()) {
      targetCell.linkTile(cellWithTail.linkedTile);
    } else {
      targetCell.linkTileForMerge(cellWithTail.linkedTile);
    }

    cellWithTail.unlinkTile();
  }
}

function slideTiles(groupedCells) {
  groupedCells.forEach(group => slideTilesInGroup(group));

  grid.cells.forEach(cell => {
    if (cell.hasTileForMerge()) {
      cell.mergeTiles();
      score += cell.getValue();
      scoreElement.innerHTML = score;
    }

    if (cell.getValue() === 2048) {
      document.querySelector('.message-win').classList.remove('hidden');
      window.removeEventListener('keydown');
    }
  });
}

function setupInputOnce() {
  window.addEventListener('keydown', handleInput, { once: true });
};

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
    if (index === 0 || cell.isEmpty()) {
      return false;
    }

    const targetCell = group[index - 1];

    return targetCell.canAccept(cell.linkedTile);
  });
}
