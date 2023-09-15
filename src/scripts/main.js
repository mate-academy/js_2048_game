'use strict';

const GRID_SIZE = 4;
const GRID_COUNT = GRID_SIZE * GRID_SIZE;
const CELL_SIZE = 20;
const GAP = 1;

class Grid {
  constructor(gridElement) {
    gridElement.style.setProperty('--grid-size', `${GRID_SIZE}`);
    gridElement.style.setProperty('--cell-size', `${CELL_SIZE}vmin`);
    gridElement.style.setProperty('--gap-size', `${GAP}vmin`);

    this.cells = [];

    for (let i = 0; i < GRID_COUNT; i++) {
      this.cells.push(
        new Cell(gridElement, i % GRID_SIZE, Math.floor(i / GRID_SIZE), i)
      );
    }
  }

  getRandomEmptyCell() {
    const emptyCells = this.cells.filter((cell) => cell.isEmpty);
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }

  groupCellsByColumn() {
    const groupArray = this.cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;

      return cellGrid;
    }, []);

    return groupArray;
  }

  groupCellsByColumnReverse() {
    return this.groupCellsByColumn().map((column) => [...column].reverse());
  }

  groupCellsByRow() {
    const groupArray = this.cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;

      return cellGrid;
    }, []);

    return groupArray;
  }

  groupCellsByRowReverse() {
    return this.groupCellsByRow().map((row) => [...row].reverse());
  }
}
class Cell {
  constructor(gridElement, x, y, id) {
    const cell = document.createElement('div');

    cell.classList.add('cell');
    gridElement.append(cell);
    this.cellElement = cell;
    this.id = id;
    this.x = x;
    this.y = y;
  }
  get isEmpty() {
    return !this.tile;
  }

  get hasMergedTile() {
    return this.mergedTile;
  }

  canAccept(newTile) {
    return (
      this.isEmpty || (!this.hasMergedTile && this.tile.value === newTile.value)
    );
  }

  linkTile(tile) {
    tile.setXY(this.x, this.y);
    this.tile = tile;
  }

  setMergedTile(tile) {
    tile.setXY(this.x, this.y);
    this.mergedTile = tile;
  }

  mergeTiles() {
    this.tile.setValue(this.tile.value + this.mergedTile.value);
    this.tile.addMergeAnimation();

    this.mergedTile.removeFromDom();
    this.mergedTile = null;
  }

  unlinkTile() {
    this.tile = null;
  }
}

class Tile {
  constructor(gridElement) {
    this.tileElement = document.createElement('div');
    this.value = 0;
    this.setValue(Math.random() > 0.8 ? 4 : 2);
    gridElement.append(this.tileElement);
  }

  setXY(x, y) {
    this.x = x;
    this.y = y;

    this.tileElement.style.setProperty('--x', `${this.x}`);
    this.tileElement.style.setProperty('--y', `${this.y}`);
  }

  setValue(value) {
    this.value = value;
    this.tileElement.classList = [];
    this.tileElement.classList.add('tile');
    this.tileElement.classList.add(`tile--${this.value}`);
    this.tileElement.textContent = `${this.value}`;
  }

  removeFromDom() {
    this.tileElement.remove();
  }

  addMergeAnimation() {
    this.tileElement.classList.add(`tile--merge`);
  }
}

const gameBoard = document.getElementById('game-board');
const startButton = document.querySelector('.button.start');
const scoreElement = document.querySelector('.game-score');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

startButton.addEventListener('click', startGame);

const grid = new Grid(gameBoard);

let score = 0;

function startGame() {
  resetGame();
}

function resetGame() {
  const allTiles = gameBoard.querySelectorAll('.tile');

  grid.cells.forEach((cell) => (cell.tile = null));
  allTiles.forEach((tile) => tile.remove());

  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));
  grid.getRandomEmptyCell().linkTile(new Tile(gameBoard));

  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');

  score = 0;
  updateScoreValue();

  startButton.textContent = 'Restart';

  hideStartMessage();
  updateStartButton();
  setupInputOnce();
}

function hideStartMessage() {
  const startMessage = document.querySelector('.message-start');

  startMessage.classList.add('hidden');
}

function updateStartButton(gameOver = false) {
  startButton.textContent = gameOver ? 'Start' : 'Restart';

  if (!gameOver) {
    startButton.classList.add('restart');
  } else {
    startButton.classList.remove('restart');
  }

  startButton.addEventListener('click', startGame);
}

function updateScoreValue(value = 0) {
  score += value;
  scoreElement.textContent = `${score}`;
}

function setupInputOnce() {
  window.addEventListener('keydown', handleInput, { once: true });
}

function handleInput(e) {
  switch (e.key) {
    case 'ArrowUp':
      e.preventDefault();

      if (!canUp()) {
        setupInputOnce();

        return;
      }
      moveUp();
      break;
    case 'ArrowDown':
      e.preventDefault();

      if (!canDown()) {
        e.preventDefault();
        setupInputOnce();

        return;
      }
      moveDown();
      break;
    case 'ArrowLeft':
      e.preventDefault();

      if (!canLeft()) {
        setupInputOnce();

        return;
      }
      moveLeft();
      break;
    case 'ArrowRight':
      e.preventDefault();

      if (!canRight()) {
        setupInputOnce();

        return;
      }
      moveRight();
      break;
    default:
      setupInputOnce();
      break;
  }

  const keys = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowLeft'];

  if (keys.some((k) => e.key === k)) {
    const newTile = new Tile(gameBoard);

    grid.getRandomEmptyCell().linkTile(newTile);
  }

  if (checkWinCondition() || checkLoseCondition()) {
    return;
  }
  setupInputOnce();
}

function checkWinCondition() {
  const isWin = grid.cells.some((cell) => {
    return cell.tile && cell.tile.value === 2048;
  });

  if (isWin) {
    winMessage.classList.remove('hidden');
    updateStartButton(true);
  }

  return isWin;
}

function checkLoseCondition() {
  const isLose = !canUp() && !canDown() && !canLeft() && !canRight();

  if (isLose) {
    loseMessage.classList.remove('hidden');
  }

  return isLose;
}

function moveUp() {
  slideTiles(grid.groupCellsByColumn());
}

function moveDown() {
  slideTiles(grid.groupCellsByColumnReverse());
}

function moveLeft() {
  slideTiles(grid.groupCellsByRow());
}

function moveRight() {
  slideTiles(grid.groupCellsByRowReverse());
}

function slideTiles(groups) {
  if (!groups) {
    return;
  }

  groups.forEach((group) => slideTilesInGroupe(group));

  grid.cells.forEach((cell) => {
    if (cell.hasMergedTile) {
      cell.mergeTiles();
      updateScoreValue(cell.tile.value);
    }
  });
}

function slideTilesInGroupe(group) {
  for (let i = 1; i < group.length; i++) {
    if (group[i].isEmpty) {
      continue;
    }

    const cell = group[i];
    let targetCell;
    let j = i - 1;

    while (j >= 0 && group[j].canAccept(cell.tile)) {
      targetCell = group[j];
      j--;
    }

    if (!targetCell) {
      continue;
    }

    if (targetCell.isEmpty) {
      targetCell.linkTile(cell.tile);
    } else {
      targetCell.setMergedTile(cell.tile);
    }

    cell.unlinkTile();
  }
}

function canUp() {
  return canMove(grid.groupCellsByColumn());
}

function canDown() {
  return canMove(grid.groupCellsByColumnReverse());
}

function canLeft() {
  return canMove(grid.groupCellsByRow());
}

function canRight() {
  return canMove(grid.groupCellsByRowReverse());
}

function canMove(group) {
  return group.some((grp) => canMoveInGroupe(grp));
}

function canMoveInGroupe(group) {
  return group.some((cell, index) => {
    if (index === 0) {
      return false;
    }

    if (cell.isEmpty) {
      return false;
    }

    const targetCell = group[index - 1];

    return targetCell.canAccept(cell.tile);
  });
}
