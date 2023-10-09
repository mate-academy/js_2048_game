'use strict';

const GRID_SIZE = 4;

class Tile {
  constructor(gridElement) {
    this.tileElement = document.createElement('div');
    this.tileElement.classList.add('tile');
    this.setValue(Math.random() > 0.1 ? 2 : 4);
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

    this.tileElement.classList.add(`tile--${value}`);
  }

  getValue() {
    return this.value;
  }

  removeFromField() {
    this.tileElement.remove();
  }
}

class Cell {
  constructor(gridElement, x, y) {
    const cell = document.createElement('div');

    cell.classList.add('field-cell');
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
      || (!this.hasTileForMerge() && this.linkedTile.value === newTile.value)
    );
  }

  mergeTiles() {
    this.linkedTile
      .setValue(this.linkedTile.value + this.linkedTileForMerge.value);

    this.linkedTileForMerge.removeFromField();
    this.unlinkTileForMerge();
  }

  getValue() {
    return this.linkedTile.getValue();
  }
}

class Grid {
  constructor(gridElement) {
    this.cells = [];

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      this.cells.push(
        new Cell(gridElement, i % GRID_SIZE, Math.floor(i / GRID_SIZE))
      );
    }

    this.cellsGrouppedByColumns = this.groupCellsByColumn();

    this.cellsGrouppedByReversedColumns = this.groupCellsByColumn()
      .map(column => [...column].reverse());

    this.cellsGrouppedByRows = this.groupCellsByRow();

    this.cellsGrouppedByReversedRows = this.groupCellsByRow()
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

const gameBoard = document.getElementById('game-field');
const grid = new Grid(gameBoard);

const startButton = document.getElementById('button-start');

startButton.addEventListener('click', startGame);

let score = 0;
const scoreElement = document.getElementById('score');

function startGame() {
  setupNewGame();

  document.getElementById('message-start').classList.add('hidden');

  startButton.classList.remove('start');
  startButton.innerHTML = 'Restart';
  startButton.classList.add('restart');

  startButton.removeEventListener('click', startGame);
  startButton.addEventListener('click', setupNewGame);
}

function setupNewGame() {
  grid.cells.forEach(cell => {
    if (!cell.isEmpty()) {
      cell.linkedTile.removeFromField();
      cell.unlinkTile();
    }
  });

  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  setupInputOnce();

  score = 0;
  scoreElement.innerHTML = score;

  document.getElementById('message-lose').classList.add('hidden');
  document.getElementById('message-win').classList.add('hidden');
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
    document.getElementById('message-lose').classList.remove('hidden');

    return;
  }

  setupInputOnce();
}

function moveUp() {
  slideTiles(grid.cellsGrouppedByColumns);
}

function moveDown() {
  slideTiles(grid.cellsGrouppedByReversedColumns);
}

function moveLeft() {
  slideTiles(grid.cellsGrouppedByRows);
}

function moveRight() {
  slideTiles(grid.cellsGrouppedByReversedRows);
}

function slideTiles(groupedCells) {
  groupedCells.forEach(group => slideTilesInGroup(group));

  grid.cells.forEach(cell => {
    if (cell.hasTileForMerge()) {
      cell.mergeTiles();
      score += cell.getValue();
      scoreElement.innerHTML = score;

      if (cell.getValue() === 2048) {
        document.getElementById('message-win').classList.remove('hidden');
        window.removeEventListener('keydown');
      }
    }
  });
}

function slideTilesInGroup(group) {
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
  return canMove(grid.cellsGrouppedByColumns);
}

function canMoveDown() {
  return canMove(grid.cellsGrouppedByReversedColumns);
}

function canMoveLeft() {
  return canMove(grid.cellsGrouppedByRows);
}

function canMoveRight() {
  return canMove(grid.cellsGrouppedByReversedRows);
}

function canMove(groupCells) {
  return groupCells.some(group => canMoveInGroup(group));
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
