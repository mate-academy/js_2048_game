'use strict';

const gridSize = 4;
const cellsCount = gridSize * gridSize;
const start = document.querySelector('.message-start');
const win = document.querySelector('.message-win');
const lose = document.querySelector('.message-lose');
let score = 0;
let grid;
const scoreElement = document.querySelector('.game-score');
const startRestartButton = document.querySelector('.start');
const gameBoard = document.querySelector('.game-board');

class Grid {
  constructor(gridElement) {
    this.cells = [];

    for (let i = 0; i < cellsCount; i++) {
      this.cells.push(new Cell(gridElement,
        i % gridSize, Math.floor(i / gridSize)));
    };

    this.cellsGroupedByColumn = this.groupCellByColumn();

    this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map(column =>
      [...column].reverse());
    this.cellsGroupedByRow = this.groupCellsByRow();

    this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map(raw =>
      [...raw].reverse());
  }

  getRandomEmptyCell() {
    const emptyCells = this.cells.filter(cell => cell.isEmpty());
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }

  groupCellByColumn() {
    return this.cells.reduce((groupCells, cell) => {
      groupCells[cell.x] = groupCells[cell.x] || [];
      groupCells[cell.x][cell.y] = cell;

      return groupCells;
    }, []);
  }

  groupCellsByRow() {
    return this.cells.reduce((groupCells, cell) => {
      groupCells[cell.y] = groupCells[cell.y] || [];
      groupCells[cell.y][cell.x] = cell;

      return groupCells;
    }, []);
  }
}

class Cell {
  constructor(gridElement, x, y) {
    const cell = document.createElement('div');

    cell.classList.add('cell');
    gridElement.append(cell);
    this.x = x;
    this.y = y;
  }

  linkTile(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTile = tile;
  }

  unlinkTile() {
    this.linkedTile = null;
  }

  isEmpty() {
    return !this.linkedTile;
  }

  linkTileForMerge(tile) {
    tile.setXY(this.x, this.y);
    this.linkedTileForMerge = tile;
  }

  unlinkTileForMerge() {
    this.linkedTileForMerge = null;
  }

  hasTileForMerge() {
    return !!this.linkedTileForMerge;
  }

  canAccept(newTile) {
    return (
      this.isEmpty()
      || (!this.hasTileForMerge()
      && this.linkedTile.value === newTile.value)
    );
  }

  mergeTiles() {
    this.linkedTile.setValue(this.linkedTile.value
      + this.linkedTileForMerge.value);

    if (this.linkTile.value === 2048) {
      win.classList.toggle('hidden');
      start.classList.toggle('hidden');

      return;
    }

    score += this.linkedTile.value;
    updateScore();

    this.linkedTileForMerge.removeFromDOM();
    this.unlinkTileForMerge();
  }
}

class Tile {
  constructor(gridElement) {
    this.tileElement = document.createElement('div');
    this.tileElement.classList.add('tile');
    this.setValue(Math.random() > 0.5 ? 2 : 4);
    gridElement.append(this.tileElement);
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;
    this.tileElement.style.setProperty('--x', x);
    this.tileElement.style.setProperty('--y', y);
  }

  setValue(value) {
    this.value = value;
    this.tileElement.textContent = value;

    const bgLightness = 100 - Math.log2(value) * 9;

    this.tileElement.style.setProperty('--bg-lightness', `${bgLightness}%`);

    this.tileElement.style.setProperty('--text-lightness',
      `${bgLightness < 50 ? 90 : 10}%`);
  }

  removeFromDOM() {
    this.tileElement.remove();
  }
}

function setupInputOnce() {
  window.addEventListener('keydown', handleInput, { once: true });
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

  const newTile = new Tile(gameBoard);

  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    lose.classList.toggle('hidden');
    start.classList.toggle('hidden');

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

function slideTiles(groupedCells) {
  groupedCells.forEach(group => slideTilesGroup(group));

  grid.cells.forEach(cell => {
    cell.hasTileForMerge() && cell.mergeTiles();
  });
}

function slideTilesGroup(group) {
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
  scoreElement.textContent = score;
}

function game() {
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  setupInputOnce();
};

startRestartButton.addEventListener('click', () => {
  win.classList.add('hidden');
  lose.classList.add('hidden');

  if (startRestartButton.innerText === 'Start') {
    startRestartButton.innerText = 'Restart';
    startRestartButton.classList.replace('start', 'restart');
    start.hidden = true;
    gameBoard.style.backgroundImage = 'none';
    grid = new Grid(gameBoard);
  } else {
    score = 0;
    gameBoard.innerHTML = '';
    grid = new Grid(gameBoard);
    updateScore();
  }
  game();
});
