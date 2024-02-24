'use strict';

let isFirstMove = true;
let score = 0;
const GRID_SIZE = 4;
const CELLS_COUNT = GRID_SIZE * GRID_SIZE;

class Grid {
  constructor(gridElement) {
    this.cells = [];

    for (let i = 0; i < CELLS_COUNT; i++) {
      this.cells.push(
        new Cell(gridElement, i % GRID_SIZE, Math.floor(i / GRID_SIZE)),
      );
    }

    this.cellsGroupedByColumn = this.groupCellsByColumn();

    this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn
      .map(column => [ ...column ].reverse());
    this.cellsGroupedByRow = this.groupCellsByRow();

    this.cellsGroupedByReversedRow = this.cellsGroupedByRow
      .map(row => [ ...row ].reverse());
  }

  getRandomEmptyCell() {
    const emptyCells = this.cells.filter(cell => cell.isEmpty());
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }

  groupCellsByColumn() {
    return this.cells.reduce((gropedCells, cell) => {
      gropedCells[cell.x] = gropedCells[cell.x] || [];
      gropedCells[cell.x][cell.y] = cell;

      return gropedCells;
    }, []);
  }

  groupCellsByRow() {
    return this.cells.reduce((gropedCells, cell) => {
      gropedCells[cell.y] = gropedCells[cell.y] || [];
      gropedCells[cell.y][cell.x] = cell;

      return gropedCells;
    }, []);
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
    return this.isEmpty() || (!this.hasTileForMerge()
    && this.linkedTile.value === newTile.value);
  }

  mergeTiles() {
    this.linkedTile.updateTiles(
      this.linkedTile.value + this.linkedTileForMerge.value,
    );
    this.linkedTileForMerge.removeFromDOM();
    this.unlinkTileForMerge();

    score += this.linkedTile.value;
    updateScore();
  }
}

class Tile {
  constructor(gridElement) {
    this.tileElement = document.createElement('div');
    this.tileElement.classList.add('tile');
    this.updateTiles(Math.random() < 0.9 ? 2 : 4);
    this.tileElement.textContent = this.value;
    gridElement.append(this.tileElement);
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;
    this.tileElement.style.setProperty('--x', x);
    this.tileElement.style.setProperty('--y', y);
  }

  updateTiles(value) {
    this.value = value;
    this.tileElement.textContent = value;

    this.setTileClass();
  }

  setTileClass() {
    for (let i = 2; i <= 2048; i *= 2) {
      this.tileElement.classList.remove(`tile--${i}`);
    }

    this.tileElement.classList.add(`tile--${this.value}`);
  }

  removeFromDOM() {
    this.tileElement.remove();
  }

  waitForTransitionEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener(
        'transitionend', resolve, { once: true },
      );
    });
  }

  waitForAnimationEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener(
        'animationend', resolve, { once: true },
      );
    });
  }
}

const gameField = document.querySelector('.game-field');
const startButton = document.getElementById('startButton');
const tryAgain = document.querySelector('.tryAgain');
const gameOver = document.querySelector('.gameOver');
const youWin = document.querySelector('.gameOver-title');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');

const grid = new Grid(gameField);

grid.getRandomEmptyCell().linkTile(new Tile(gameField));
grid.getRandomEmptyCell().linkTile(new Tile(gameField));

setupInputOnce();

function updateScore() {
  const gameScore = document.querySelector('.game-score');

  if (gameScore) {
    gameScore.textContent = score;
  }
}

function setupInputOnce() {
  window.addEventListener('keydown', hendleInput, { once: true });
}

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    restart();
  } else if (startButton.classList.contains('restart')) {
    const restsatGame = confirm(
      'Are you sure you want to start a new game? All progress will be lost.',
    );

    if (restsatGame) {
      startButton.classList.add('start');
      startButton.classList.remove('restart');
      startButton.innerHTML = 'New Game';
      restart();
    }
  }
});

tryAgain.addEventListener('click', () => {
  restart();
});

async function hendleInput(e) {
  if (isFirstMove) {
    isFirstMove = false;
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
    messageStart.classList.add('hidden');
  }

  if (hasReached2048()) {
    gameOver.classList.remove('hidden');
    messageWin.classList.remove('hidden');
    youWin.innerHTML = 'You Win!';
    gameOver.style.backgroundColor = '#edc22e';
    tryAgain.innerHTML = 'New Game';

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
  };

  const newTile = new Tile(gameField);

  grid.getRandomEmptyCell().linkTile(newTile);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    await newTile.waitForAnimationEnd();
    gameOver.classList.remove('hidden');
    messageLose.classList.remove('hidden');

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

async function slideTiles(gropedCells) {
  const promises = [];

  gropedCells.forEach(group => slideTilesIngroup(group, promises));

  await Promise.all(promises);

  grid.cells.forEach(cell => {
    cell.hasTileForMerge() && cell.mergeTiles();
  });
}

function slideTilesIngroup(group, promises) {
  for (let i = 1; i < group.length; i++) {
    if (group[i].isEmpty()) {
      continue;
    }

    const cellWithTile = group[i];
    let taregetCell;
    let j = i - 1;

    while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
      taregetCell = group[j];
      j--;
    }

    if (!taregetCell) {
      continue;
    }

    promises.push(cellWithTile.linkedTile.waitForTransitionEnd());

    if (taregetCell.isEmpty()) {
      taregetCell.linkTile(cellWithTile.linkedTile);
    } else {
      taregetCell.linkTileForMerge(cellWithTile.linkedTile);
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

function canMove(gropedCells) {
  return gropedCells.some(group => canMoveinGroup(group));
}

function canMoveinGroup(group) {
  return group.some((cell, index) => {
    if (index === 0) {
      return false;
    }

    if (cell.isEmpty()) {
      return false;
    }

    const taregetCell = group[index - 1];

    return taregetCell.canAccept(cell.linkedTile);
  });
}

function hasReached2048() {
  return grid.cells.some(
    cell => cell.linkedTile && cell.linkedTile.value === 2048,
  );
}

function restart() {
  location.reload();
}
