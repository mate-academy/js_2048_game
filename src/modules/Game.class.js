'use strict';

const GRID_SIZE = 4;
const CELL_SIZE = 75;
const CELL_GAP = 10;
let score = 0;

class Game {
  static Statuses = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };
  #cells;

  constructor(gridElement) {
    gridElement.style.setProperty('--grid-size', GRID_SIZE);
    gridElement.style.setProperty('--cell-size', `${CELL_SIZE}px`);
    gridElement.style.setProperty('--cell-gap', `${CELL_GAP}px`);

    this.#cells = createCellElements(gridElement).map((cellElement, index) => {
      return new Cell(
        cellElement,
        index % GRID_SIZE,
        Math.floor(index / GRID_SIZE),
      );
    });
    score = 0;
    this.status = Game.Statuses.IDLE;

    this.board = [
      [0, 4, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  get cells() {
    return this.#cells;
  }

  get cellsByRow() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.y] = cellGrid[cell.y] || [];
      cellGrid[cell.y][cell.x] = cell;

      return cellGrid;
    }, []);
  }

  get cellsByColumn() {
    return this.#cells.reduce((cellGrid, cell) => {
      cellGrid[cell.x] = cellGrid[cell.x] || [];
      cellGrid[cell.x][cell.y] = cell;

      return cellGrid;
    }, []);
  }

  get #emptyCells() {
    return this.#cells.filter((cell) => cell.tile == null);
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.#emptyCells.length);

    return this.#emptyCells[randomIndex];
  }

  moveLeft() {
    return this.slideTiles(this.cellsByRow);
  }

  moveRight() {
    return this.slideTiles(this.cellsByRow.map((row) => [...row].reverse()));
  }

  moveUp() {
    return this.slideTiles(this.cellsByColumn);
  }

  moveDown() {
    return this.slideTiles(
      this.cellsByColumn.map((column) => [...column].reverse()),
    );
  }

  slideTiles(cells) {
    return Promise.all(
      cells.flatMap((group) => {
        const promises = [];

        for (let i = 1; i < group.length; i++) {
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

  /**
   * @returns {number}
   */
  getScore() {
    return score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  setStatus(statusGame) {
    this.status = statusGame;
  }

  start() {
    this.status = Game.Statuses.PLAYING;
  }

  checkForWin() {
    let check = false;

    this.cells.forEach((cell) => {
      if (cell.tile == null) {
        return;
      }

      if (cell.tile.value === 2048) {
        check = true;
      }
    });

    return check;
  }

  restart() {
    const tiles = document.querySelectorAll('.tile');

    tiles.forEach((el) => el.remove());
    score = 0;
    this.status = Game.Statuses.PLAYING;

    this.#cells.forEach((cell) => {
      cell.tile = null;
      cell.mergeTile = null;
    });
  }
}

class Cell {
  #cellElement;
  #x;
  #y;
  #tile;
  #mergeTile;

  constructor(cellElement, x, y) {
    this.#cellElement = cellElement;
    this.#x = x;
    this.#y = y;
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get tile() {
    return this.#tile;
  }

  set tile(value) {
    this.#tile = value;

    if (value == null) {
      return;
    }
    this.#tile.x = this.#x;
    this.#tile.y = this.#y;
  }

  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;

    if (value == null) {
      return;
    }
    this.#mergeTile.x = this.#x;
    this.#mergeTile.y = this.#y;
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
    score += this.tile.value + this.mergeTile.value;
    this.tile.value = this.tile.value + this.mergeTile.value;
    this.mergeTile.remove();
    this.mergeTile = null;
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

module.exports = Game;
