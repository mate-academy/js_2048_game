'use strict';

class Grid {
  constructor(gridElement) {
    this.cells = createCells(gridElement).map((cell, index) => {
      return new Cell(
        cell,
        index % 4,
        Math.floor(index / 4),
      );
    });
  }

  get emptyCells() {
    return this.cells.filter(cell => cell.tile === null);
  }

  get cellsByColumn() {
    return this.cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;

      return cellGrid;
    }, []);
  }

  get cellsByRow() {
    return this.cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;

      return cellGrid;
    }, []);
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.emptyCells.length);

    return this.emptyCells[randomIndex];
  }
}

class Cell {
  constructor(cellElement, x, y, tile = null, mergeTile = null) {
    this.cellElement = cellElement;
    this.x = x;
    this.y = y;
    this.tile = tile;
    this.mergeTile = mergeTile;
  }

  get tile() {
    return this._tile;
  }

  set tile(value) {
    this._tile = value;

    if (value === null) {
      return;
    }

    this._tile.x = this.x;
    this._tile.y = this.y;
  }

  get mergeTile() {
    return this._mergeTile;
  }

  set mergeTile(value) {
    this._mergeTile = value;
  }

  canAccept(tile) {
    return (
      this.tile === null
      || (this.mergeTile === null && this.tile.value === tile.value)
    );
  }

  mergeTiles() {
    if (this.tile === null || this.mergeTile === null) {
      return;
    }

    const increase = this.tile.value + this.mergeTile.value;
    const newScore = score + increase;

    score = newScore;

    scoreElement.textContent = newScore;

    showScoreIncrease(increase);

    this.tile.value = this.tile.value + this.mergeTile.value;
    this.mergeTile.remove();
    this.mergeTile = null;

    const newValue = this.tile.value;

    if (this.tile.value === 2048) {
      winMessage.classList.remove('hidden');
      gameWon = true;
    }

    this.tile.tileElement.classList.remove(`field-tile--${newValue / 2}`);
    this.tile.tileElement.classList.add(`field-tile--${newValue}`);
    this.tile.tileElement.textContent = newValue;
  }
}

class Tile {
  constructor(gameField, value = Math.random() < 0.1 ? 4 : 2) {
    this.tileElement = document.createElement('div');
    this.tileElement.classList.add('field-tile', `field-tile--${value}`);
    gameField.append(this.tileElement);
    this.value = value;
  }

  get value() {
    return this._value;
  }

  set value(v) {
    this._value = v;
    this.tileElement.textContent = v;
  }

  set x(value) {
    this._x = value;
    this.tileElement.style.setProperty('left', `${value * (75 + 10) + 10}px`);
  }

  set y(value) {
    this._y = value;
    this.tileElement.style.setProperty('top', `${value * (75 + 10) + 10}px`);
  }

  remove() {
    this.tileElement.remove();
  }
}

function createCells(gridElement) {
  const cells = [];

  for (let i = 0; i < 16; i++) {
    const cell = document.createElement('div');

    cell.classList.add('field-cell');
    cells.push(cell);
  }

  cells.forEach((cell) => {
    gridElement.appendChild(cell);
  });

  return cells;
}

const gameBoard = document.querySelector('.game-field');
const startButton = document.querySelector('.start');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
let grid = new Grid(gameBoard);
let score = 0;
let gameWon = false;

startButton.addEventListener('click', startGame);

const scoreElement = document.querySelector('.game-score');

function startGame() {
  gameWon = false;
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'restart';
  startMessage.classList.add('hidden');

  grid.randomEmptyCell().tile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = new Tile(gameBoard);

  startButton.removeEventListener('click', startGame);
  startButton.addEventListener('click', restartGame);
  setInput();
}

const scoreIncreaseQueue = [];

function showScoreIncrease(increase) {
  scoreIncreaseQueue.push(increase);

  if (scoreIncreaseQueue.length === 1) {
    displayNextScoreIncrease();
  }
}

function displayNextScoreIncrease() {
  if (scoreIncreaseQueue.length === 0) {
    return;
  }

  const increase = scoreIncreaseQueue[0];

  const scoreIncreaseElement = document.querySelector('.score-increase');

  scoreIncreaseElement.textContent = `+${increase}`;

  setTimeout(() => {
    scoreIncreaseElement.textContent = '';
    scoreIncreaseQueue.shift();
    displayNextScoreIncrease();
  }, 300);
}

function restartGame() {
  const tiles = document.querySelectorAll('.field-tile');

  tiles.forEach(tile => tile.remove());

  gameBoard.innerHTML = '';

  grid = new Grid(gameBoard);

  grid.randomEmptyCell().tile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = new Tile(gameBoard);

  score = 0;
  gameWon = false;
  scoreElement.textContent = score;
  winMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
}

function setInput() {
  window.addEventListener('keydown', handleImput);
}

function handleImput(e) {
  if (gameWon) {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      if (!canMoveUp()) {
        setInput();

        return;
      }

      moveUp();
      break;

    case 'ArrowDown':
      if (!canMoveDown()) {
        setInput();

        return;
      }
      moveDown();
      break;

    case 'ArrowLeft':
      if (!canMoveLeft()) {
        setInput();

        return;
      }
      moveLeft();
      break;

    case 'ArrowRight':
      if (!canMoveRight()) {
        setInput();

        return;
      }
      moveRight();
      break;

    default:
      setInput();

      return;
  }

  grid.cells.forEach(cell => cell.mergeTiles());

  const newTile = new Tile(gameBoard);

  grid.randomEmptyCell().tile = newTile;

  if (!canMoveUp() && !canMoveDown()
    && !canMoveLeft() && !canMoveRight()) {
    loseMessage.classList.remove('hidden');
  }

  setInput();
}

function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()));
}

function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map(row => [...row].reverse()));
}

function slideTiles(cells) {
  cells.forEach(group => {
    for (let i = 1; i < group.length; i++) {
      const cell = group[i];

      if (cell.tile === null) {
        continue;
      }

      let lastValidCell = null;

      for (let j = i - 1; j >= 0; j--) {
        const moveToCell = group[j];

        if (!moveToCell.canAccept(cell.tile)) {
          break;
        }
        lastValidCell = moveToCell;
      }

      if (lastValidCell !== null) {
        if (lastValidCell.tile !== null) {
          lastValidCell.mergeTile = cell.tile;
        } else {
          lastValidCell.tile = cell.tile;
        }
        cell.tile = null;
      }
    }
  });
}

function canMoveUp() {
  return canMove(grid.cellsByColumn);
};

function canMoveDown() {
  return canMove(grid.cellsByColumn.map(column => [...column].reverse()));
};

function canMoveLeft() {
  return canMove(grid.cellsByRow);
};

function canMoveRight() {
  return canMove(grid.cellsByRow.map(row => [...row].reverse()));
};

function canMove(cells) {
  return cells.some(group => {
    return group.some((cell, index) => {
      if (index === 0) {
        return false;
      }

      if (cell.tile === null) {
        return false;
      }

      const moveToCell = group[index - 1];

      return moveToCell.canAccept(cell.tile);
    });
  });
}
