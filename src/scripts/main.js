'use strict';

const score = document.querySelector('.game_score');
const buttonStart = document.querySelector('.start');
const gameBoard = document.querySelector('.game_board');
const messageWin = document.querySelector('.message_win');
const messageLose = document.querySelector('.message_lose');
const messageStart = document.querySelector('.message_start');
const BOARD_SIZE = 4;
const CELL_COUNT = BOARD_SIZE * BOARD_SIZE;
let scoreValue = 0;

buttonStart.addEventListener('click', () => {
  if (buttonStart.classList.contains('start')) {
    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
    buttonStart.textContent = 'Restart';
    messageStart.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');
  }

  board.cells.forEach(cell => {
    if (!cell.isEmpty()) {
      cell.linkedTile.removeElement();
      cell.unlinkTile();
    }

    score.textContent = 0;
  });

  board.findEmptyCell().linkTile(new Tile(gameBoard));
  board.findEmptyCell().linkTile(new Tile(gameBoard));
});

class Board {
  constructor(boardElement) {
    this.cells = [];

    for (let i = 0; i < CELL_COUNT; i++) {
      this.cells.push(
        new Cell(
          boardElement,
          i % BOARD_SIZE,
          Math.floor(i / BOARD_SIZE)
        )
      );
    }

    this.cellsGroupedByColumn = this.cells.reduce((groupCells, cell) => {
      groupCells[cell.x] = groupCells[cell.x] || [];
      groupCells[cell.x][cell.y] = cell;

      return groupCells;
    }, []);

    this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map(
      column => [...column].reverse()
    );

    this.cellsGroupedByRow = this.cells.reduce((groupCells, cell) => {
      groupCells[cell.y] = groupCells[cell.y] || [];
      groupCells[cell.y][cell.x] = cell;

      return groupCells;
    }, []);

    this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map(
      row => [...row].reverse()
    );
  }

  findEmptyCell() {
    const emptyCells = this.cells.filter(cell => cell.isEmpty());
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }
}

class Cell {
  constructor(boardElement, x, y) {
    this.x = x;
    this.y = y;

    const cell = document.createElement('div');

    cell.classList.add('cell');
    boardElement.append(cell);
  }

  linkTile(tile) {
    tile.setCoords(this.x, this.y);
    this.linkedTile = tile;
  }

  unlinkTile() {
    this.linkedTile = null;
  }

  isEmpty() {
    return !this.linkedTile;
  }

  linkTileForMerge(tile) {
    tile.setCoords(this.x, this.y);
    this.linkedTileForMerge = tile;
  }

  hasTileForMerge() {
    return !!this.linkedTileForMerge;
  }

  canAccept(newTile) {
    return this.isEmpty()
      || (!this.hasTileForMerge() && this.linkedTile.value === newTile.value);
  }

  mergeTiles() {
    this.linkedTile.setValue(this.linkedTile.value
      + this.linkedTileForMerge.value);

    scoreValue += this.linkedTile.value;
    score.textContent = scoreValue;

    this.linkedTileForMerge.removeElement();
    this.linkedTileForMerge = null;
  }
}

class Tile {
  constructor(boardElement) {
    this.tile = document.createElement('div');
    this.tile.classList.add('tile');

    this.setValue(Math.random() > 0.1 ? 2 : 4);

    boardElement.append(this.tile);
  }

  setCoords(x, y) {
    this.x = x;
    this.y = y;

    this.tile.style.setProperty('--x', x);
    this.tile.style.setProperty('--y', y);
  }

  setValue(value) {
    this.value = value;
    this.tile.textContent = this.value;

    const bgLightness = 100 - Math.log2(value) * 8;

    this.tile.style.setProperty('--bg-lightness', `${bgLightness}%`);

    this.tile.style.setProperty('--text-lightness',
      `${bgLightness < 40 ? 80 : 20}%`);

    if (this.value === 2048) {
      messageWin.classList.remove('hidden');
    }
  }

  removeElement() {
    this.tile.remove();
  }
}

const board = new Board(gameBoard);

setupInput();

function setupInput() {
  window.addEventListener('keydown', handleInput, { once: true });
}

function handleInput(e) {
  switch (e.key) {
    case 'ArrowUp': {
      if (!canMoveUp()) {
        setupInput();

        return;
      }

      moveUp();
      break;
    }

    case 'ArrowDown': {
      if (!canMoveDown()) {
        setupInput();

        return;
      }

      moveDown();
      break;
    }

    case 'ArrowLeft': {
      if (!canMoveLeft()) {
        setupInput();

        return;
      }

      moveLeft();
      break;
    }

    case 'ArrowRight': {
      if (!canMoveRight()) {
        setupInput();

        return;
      }

      moveRight();
      break;
    }

    default:
      setupInput();

      return;
  }

  board.findEmptyCell().linkTile(new Tile(gameBoard));

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    messageLose.classList.remove('hidden');
  }

  setupInput();
}

function moveUp() {
  moveTiles(board.cellsGroupedByColumn);
}

function moveDown() {
  moveTiles(board.cellsGroupedByReversedColumn);
}

function moveLeft() {
  moveTiles(board.cellsGroupedByRow);
}

function moveRight() {
  moveTiles(board.cellsGroupedByReversedRow);
}

function moveTiles(groupedCells) {
  groupedCells.forEach(group => {
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
  });

  board.cells.forEach(cell => {
    cell.hasTileForMerge() && cell.mergeTiles();
  });
}

function canMoveUp() {
  return canMove(board.cellsGroupedByColumn);
}

function canMoveDown() {
  return canMove(board.cellsGroupedByReversedColumn);
}

function canMoveLeft() {
  return canMove(board.cellsGroupedByRow);
}

function canMoveRight() {
  return canMove(board.cellsGroupedByReversedRow);
}

function canMove(groupedCells) {
  return groupedCells.some(group => canMoveInGroup(group));
}

function canMoveInGroup(group) {
  return group.some((cell, i) => {
    if (i === 0 || cell.isEmpty()) {
      return false;
    }

    const targetCell = group[i - 1];

    return targetCell.canAccept(cell.linkedTile);
  });
}
