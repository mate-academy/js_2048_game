'use strict';

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
    return this.linkedTileForMerge;
  }

  canAccept(newTile) {
    return this.isEmpty()
      || (!this.hasTileForMerge() && this.linkedTile.value === newTile.value);
  }

  mergeTiles() {
    this.linkedTile.setValue(this.linkedTile.value * 2);
    this.linkedTile.removeClassList();
    this.linkedTileForMerge.removeFromDOM();
    this.unlinkTileForMerge();
  }

  getCellValue() {
    return this.linkedTile ? this.linkedTile.getTileValue() : 0;
  }
}

const gridSize = 4;
const cellsCount = gridSize * gridSize;

class Grid {
  constructor(gridElement) {
    this.cells = [];

    for (let i = 0; i < cellsCount; i++) {
      this.cells.push(
        new Cell(gridElement, i % gridSize, Math.floor(i / gridSize))
      );
    }

    this.cellsGroupedByColumn = this.groupCellsByColumn();

    this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn
      .map(column => [...column].reverse());

    this.cellsGroupedByRow = this.groupCellsByRow();

    this.cellsGroupedByReversedRow = this.cellsGroupedByRow
      .map(row => [...row].reverse());
  }

  getRandomEmptyCell() {
    const emptyCells = this.cells.filter(cell => cell.isEmpty());
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }

  groupCellsByColumn() {
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.x] = groupedCells[cell.x] || [];
      groupedCells[cell.x][cell.y] = cell;

      return groupedCells;
    }, []);
  }

  groupCellsByRow() {
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.y] = groupedCells[cell.y] || [];
      groupedCells[cell.y][cell.x] = cell;

      return groupedCells;
    }, []);
  }
}

class Tile {
  constructor(gridElement) {
    this.tileElement = document.createElement('div');
    this.tileElement.classList.add('tile');
    this.setValue(Math.random() >= 0.9 ? 4 : 2);
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
    this.tileElement.textContent = this.value;
    this.tileElement.classList.add(`tile--${value}`);
  }

  removeFromDOM() {
    this.tileElement.remove();
  }

  removeClassList() {
    this.tileElement.classList.remove(`tile--${this.value / 2}`);
  }

  getTileValue() {
    return this.value;
  }

  waitForTransitionEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener(
        'transitionend',
        resolve,
        { once: true }
      );
    });
  }
}

let scoreValue = 0;
const button = document.querySelector('.button');
const score = document.querySelector('.game-score');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameBoard = document.querySelector('.game-board');
const grid = new Grid(gameBoard);

button.addEventListener('click', startGame);

function startGame() {
  setupInputOnce();
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));

  messageStart.classList.add('hidden');
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';

  button.removeEventListener('click', startGame);
  button.addEventListener('click', restartGame);
}

function restartGame() {
  grid.cells.forEach(cell => {
    if (!cell.isEmpty()) {
      cell.linkedTile.removeFromDOM();
      cell.unlinkTile();
    }
  });

  scoreValue = 0;
  score.textContent = scoreValue;
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  setupInputOnce();
}

function setupInputOnce() {
  window.addEventListener('keydown', handleInput, { once: true });
}

async function handleInput(eventMove) {
  switch (eventMove.key) {
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

  const newTile = new Tile(gameBoard);

  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    messageLose.classList.remove('hidden');
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
      cell.mergeTiles();
      scoreValue += cell.getCellValue();
      score.textContent = scoreValue;
    }

    if (cell.getCellValue() === 2048) {
      messageWin.classList.remove('hidden');
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
  return groupedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {
  return group.some((cell, index) => {
    if (!index || cell.isEmpty()) {
      return false;
    }

    const targetCell = group[index - 1];

    return targetCell.canAccept(cell.linkedTile);
  });
}
