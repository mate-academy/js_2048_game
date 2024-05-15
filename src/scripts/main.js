const WINNING_VALUE = 2048;
const GRID_SIZE = 4;
const CELL_SIZE = 75;
const CELL_GAP = 5;

let score = 0;
const scoreElement = document.getElementById('game-score');
const startMessage = document.getElementById('message-start');
const loseMessage = document.getElementById('message-lose');
const winMessage = document.getElementById('message-win');

const startButton = document.getElementById('button-start');

const gameBoard = document.getElementById('game-board');

let gameWon = false;

class Game {
  constructor(gridElement) {
    gridElement.style.setProperty('--grid-size', GRID_SIZE);
    gridElement.style.setProperty('--cell-size', `${CELL_SIZE}px`);
    gridElement.style.setProperty('--gap-size', `${CELL_GAP}px`);

    this._cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE),
      );
    });
  }

  get cells() {
    return this._cells;
  }

  get cellsByColumn() {
    return this._cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;

      return cellGrid;
    }, []);
  }

  get cellsByRow() {
    return this._cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;

      return cellGrid;
    }, []);
  }

  get _emptyCells() {
    return this._cells.filter((cell) => cell.tile == null);
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this._emptyCells.length);

    return this._emptyCells[randomIndex];
  }
}

class Cell {
  constructor(cellElement, x, y) {
    this._cellElement = cellElement;
    this._x = x;
    this._y = y;
  }

  get x() {
    return this._x;
  }
  get y() {
    return this._y;
  }

  get tile() {
    return this._tile;
  }

  set tile(value) {
    this._tile = value;

    if (value == null) {
      return;
    }

    this._tile.x = this._x;
    this._tile.y = this._y;
  }

  get mergeTile() {
    return this._mergeTile;
  }

  set mergeTile(value) {
    this._mergeTile = value;

    if (value == null) {
      return;
    }

    this._mergeTile.x = this._x;
    this._mergeTile.y = this._y;
  }

  canAccept(tile) {
    return (
      this.tile == null ||
      (this.mergeTile == null && this.tile.value === tile.value)
    );
  }

  mergeTiles() {
    if (this.tile == null || this.mergeTile == null) {
      return;
    }

    score += this.tile.value;
    this.tile.value = this.tile.value + this.mergeTile.value;

    updateScore();

    this.mergeTile.remove();
    this.mergeTile = null;

    if (this.tile.value === WINNING_VALUE) {
      winGame();
    }
  }
}

function createCellElements(gridElement) {
  const cells = [];

  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    const cell = document.createElement('div');

    cell.classList.add('cell');
    cells.push(cell);
    gridElement.append(cell);
  }

  return cells;
}

class Tile {
  constructor(tileContainer, value = Math.random() > 0.1 ? 2 : 4) {
    this._tileElement = document.createElement('div');
    this._tileElement.classList.add('tile');
    tileContainer.append(this._tileElement);
    this.value = value;
  }

  get value() {
    return this._value;
  }

  set x(value) {
    this._x = value;
    this._tileElement.style.setProperty('--x', value);
  }

  set y(value) {
    this._y = value;
    this._tileElement.style.setProperty('--y', value);
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  set value(v) {
    this._value = v;
    this._tileElement.textContent = v;
    this._tileElement.classList.add(`tile--${this._value}`);
  }

  remove() {
    this._tileElement.remove();
  }

  waitForTransition(animation = false) {
    return new Promise((resolve) => {
      this._tileElement.addEventListener(
        animation ? 'animationend' : 'transitionend',
        resolve,
        { once: true },
      );
    });
  }
}

startButton.addEventListener('click', startGame);

const grid = new Game(gameBoard);

function setupInput() {
  window.addEventListener('keydown', handleInput, { once: true });
}

async function handleInput(e) {
  if (gameWon) {
    return;
  }

  switch (e.key) {
    case 'ArrowUp':
      if (!canMoveUp()) {
        setupInput();

        return;
      }
      await moveUp();
      break;
    case 'ArrowDown':
      if (!canMoveDown()) {
        setupInput();

        return;
      }
      await moveDown();
      break;
    case 'ArrowLeft':
      if (!canMoveLeft()) {
        setupInput();

        return;
      }
      await moveLeft();
      break;
    case 'ArrowRight':
      if (!canMoveRight()) {
        setupInput();

        return;
      }
      await moveRight();
      break;
    default:
      setupInput();

      return;
  }

  grid.cells.forEach((cell) => cell.mergeTiles());

  const newTile = new Tile(gameBoard);

  grid.randomEmptyCell().tile = newTile;

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    newTile.waitForTransition(true).then(() => loseGame());

    return;
  }
  setupInput();
}

function moveUp() {
  return slideTiles(grid.cellsByColumn);
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function moveLeft() {
  return slideTiles(grid.cellsByRow);
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map((row) => [...row].reverse()));
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap((group) => {
      const promises = [];

      for (let i = 0; i < group.length; i++) {
        const cell = group[i];

        if (cell.tile == null) {
          continue;
        }

        let lastValidCell;

        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j];

          if (!moveToCell.canAccept(cell.tile)) {
            break;
          }

          lastValidCell = moveToCell;
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition());

          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile;
          } else {
            lastValidCell.tile = cell.tile;
          }
          cell.tile = null;
        }
      }

      return promises;
    }),
  );
}

function canMoveUp() {
  return canMove(grid.cellsByColumn);
}

function canMoveDown() {
  return canMove(grid.cellsByColumn.map((column) => [...column].reverse()));
}

function canMoveLeft() {
  return canMove(grid.cellsByRow);
}

function canMoveRight() {
  return canMove(grid.cellsByRow.map((row) => [...row].reverse()));
}

function canMove(cells) {
  return cells.some((group) => {
    return group.some((cell, index) => {
      if (index === 0) {
        return false;
      }

      if (cell.tile == null) {
        return false;
      }

      const moveToCell = group[index - 1];

      return moveToCell.canAccept(cell.tile);
    });
  });
}

function updateScore() {
  scoreElement.textContent = score;
}

function resetGame() {
  score = 0;

  updateScore();

  setupInput();
}

function clearBoard() {
  grid.cells.forEach((cell) => {
    if (cell.tile != null) {
      cell.tile.remove();
      cell.tile = null;
    }
  });
}

function startGame() {
  resetGame();

  startButton.classList.remove('button--start');
  startButton.classList.add('button--restart');
  startButton.textContent = '↻';

  loseMessage.classList.add('message--hidden');
  startMessage.classList.add('message--hidden');
  winMessage.classList.add('message--hidden');

  clearBoard();

  grid.randomEmptyCell().tile = new Tile(gameBoard);
  grid.randomEmptyCell().tile = new Tile(gameBoard);
  gameWon = false;
  setupInput();
}

function winGame() {
  winMessage.classList.remove('message--hidden');

  startButton.classList.remove('button--restart');
  startButton.textContent = 'Start';

  startButton.classList.add('button--start');

  window.removeEventListener('keydown', handleInput);
  gameWon = true;
}

function loseGame() {
  loseMessage.classList.remove('message--hidden');
  startButton.textContent = 'Restart';
}
