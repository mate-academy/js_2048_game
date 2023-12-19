import 'regenerator-runtime/runtime';

const score = document.querySelector('.game_score');
let scoreValue = 0;

class Cell {
  constructor(gridElement, x, y) {
    const cell = document.createElement('div');

    cell.classList.add('field_cell');
    gridElement.append(cell);
    this.x = x;
    this.y = y;
  }

  restartScore() {
    scoreValue = 0;
    score.innerHTML = scoreValue;
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
    return this.isEmpty()
    || (!this.hasTileForMerge() && this.linkedTile.value === newTile.value);
  }

  mergeTiles() {
    this.linkedTile.setValue(this.linkedTile.value * 2);
    scoreValue += this.linkedTile.value;
    score.innerHTML = scoreValue;
    this.linkedTileForMerge.removeFromDOM();
    this.unlinkTileForMerge();
  }
}

const GRID_SIZE = 4;

class Grid {
  constructor(gridElement) {
    this.cells = [];

    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
      this.cells.push(
        new Cell(gridElement, i % GRID_SIZE, Math.floor(i / GRID_SIZE))
      );
    }

    this.cellsGroupedByColumn = this.groupCellsByColumn();
    this.cellsGroupedByRow = this.groupCellsByRow();
    this.cellsGroupedByReversedColumn = this.groupByReversedColumn();
    this.cellsGroupedByReversedRow = this.groupByReversedRow();
  }

  groupByReversedColumn() {
    return this.cellsGroupedByColumn.map(
      (column) => {
        return [...column].reverse();
      }
    );
  }

  groupByReversedRow() {
    return this.cellsGroupedByRow.map(
      (row) => {
        return [...row].reverse();
      }
    );
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

const DARK_TEXT_LIGHTNESS = 80;
const LIGHT_TEXT_LIGHTNESS = 20;
const TEXT_LIGHTNESS_DIVIDER = 50;

class Tile {
  constructor(gridElement) {
    this.tileElement = document.createElement('div');
    this.tileElement.classList.add('field_tile');
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
    this.tileElement.textContent = this.value;

    const bgLightness = 100 - Math.log2(value) * 7;

    this.tileElement.style.setProperty('--bg-lightness', `${bgLightness}%`);

    this.tileElement.style.setProperty(
      '--text-lightness',
      `${bgLightness < TEXT_LIGHTNESS_DIVIDER
        ? DARK_TEXT_LIGHTNESS
        : LIGHT_TEXT_LIGHTNESS}%`
    );

    if (this.value === 2048) {
      const winMessage = document.querySelector('.message_win');

      winMessage.classList.remove('hidden');
    }
  }

  removeFromDOM() {
    this.tileElement.remove();
  }

  waitForTransitionEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener(
        'transitionend', resolve, { once: true }
      );
    });
  }

  waitForAnimationEnd() {
    return new Promise(resolve => {
      this.tileElement.addEventListener(
        'animationend', resolve, { once: true }
      );
    });
  }
}

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

    targetCell.isEmpty()
      ? targetCell.linkTile(cellWithTile.linkedTile)
      : targetCell.linkTileForMerge(cellWithTile.linkedTile);

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
