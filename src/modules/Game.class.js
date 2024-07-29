'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

class Cell {
  #tile;
  #mergeTile;

  constructor(cellElement, x, y) {
    this.cellElement = cellElement;
    this.x = x;
    this.y = y;
  }

  set tile(value) {
    this.#tile = value;

    if (!value) {
      return;
    }

    this.tile.x = +this.x;
    this.tile.y = +this.y;
  }

  get tile() {
    return this.#tile;
  }
  get mergeTile() {
    return this.#mergeTile;
  }

  set mergeTile(value) {
    this.#mergeTile = value;

    if (!value) {
      return;
    }

    this.#mergeTile.x = this.x;
    this.#mergeTile.y = this.y;
  }

  canAcceptTile(tile) {
    return !this.tile || (this.tile.value === tile.value && !this.mergeTile);
  }

  mergeTiles() {
    if (!this.tile || !this.#mergeTile) {
      return;
    }

    this.tile.value = +this.tile.value + +this.#mergeTile.value;

    this.#mergeTile.remove();
    this.#mergeTile = null;
  }
}

class Tile {
  #x;
  #y;
  #value;

  constructor(parentElement, initValue = Math.random() <= 0.1 ? 4 : 2) {
    const newTile = document.createElement('div');
    const { cellElement, x, y } = parentElement;

    newTile.style.setProperty('--coord-y', y);
    newTile.style.setProperty('--coord-x', x);
    newTile.textContent = initValue;

    newTile.className = `field-cell game-cell field-cell--${initValue}`;
    this.tileElement = newTile;
    this.#x = x;
    this.#y = y;
    this.#value = +initValue;
    cellElement.append(newTile);
  }

  set x(coordX) {
    this.#x = +coordX;
    this.tileElement.style.setProperty('--coord-x', +coordX);
  }

  get x() {
    return this.#x;
  }

  set y(coordY) {
    this.#y = +coordY;
    this.tileElement.style.setProperty('--coord-y', +coordY);
  }

  get y() {
    return this.#y;
  }

  set value(value1) {
    if (value1) {
      this.#value = +value1;
      this.tileElement.textContent = value1.toString();
      this.tileElement.className = `field-cell game-cell field-cell--${value1}`;
    }
  }

  get value() {
    return this.#value;
  }

  remove() {
    this.tileElement.remove();
  }

  waitForTransition() {
    return new Promise((resolve) => {
      this.tileElement.addEventListener('transitionend', resolve, {
        once: true,
      });
    });
  }
}

class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    // eslint-disable-next-line no-console
    if (initialState) {
      this.initialState = initialState;
    }
    this.cellState = document.querySelectorAll('.field-row');

    this.cellState = [...this.cellState].map((row, y) => {
      const cells = [...row.children];
      const updatedRow = [];

      for (let x = 0; x < cells.length; x++) {
        const cell = cells[x];
        const newCell = new Cell(cell, x, y);

        if (initialState) {
          const initialRow = initialState[y];
          const initialValue = initialRow[x];

          if (initialValue !== 0) {
            const tile = new Tile(newCell, initialValue);

            newCell.tile = tile;
          }
        }

        updatedRow.push(newCell);
      }

      return updatedRow;
    });
  }
  canMoveLeft() {
    return this.canMove(this.cellState);
  }

  moveLeft() {
    return this.slideTiles(this.cellState);
  }

  canMoveRight() {
    return this.canMove(this.cellState.map((row) => [...row].reverse()));
  }

  moveRight() {
    return this.slideTiles(this.cellState.map((row) => [...row].reverse()));
  }

  canMoveUp() {
    return this.canMove(this.cellsByColumn);
  }

  moveUp() {
    return this.slideTiles(this.cellsByColumn);
  }

  canMoveDown() {
    return this.canMove(
      this.cellsByColumn.map((column) => [...column].reverse()),
    );
  }
  moveDown() {
    return this.slideTiles(
      this.cellsByColumn.map((column) => [...column].reverse()),
    );
  }

  /**
   * @returns {number}
   */
  getScore() {
    const gameScore = document.querySelector('.game-score');
    const prevScore = +gameScore.textContent;
    const score = this.mergedCells.reduce((sum, cell) => {
      const value = +cell.mergeTile.value;

      return sum + value * 2;
    }, prevScore);

    gameScore.textContent = `${score}`;

    return score;
  }
  noMovesPossible() {
    return (
      !this.canMoveDown() &&
      !this.canMoveUp() &&
      !this.canMoveLeft() &&
      !this.canMoveRight()
    );
  }

  isWinner() {
    return this.cellState
      .flat()
      .some((cell) => (cell.tile ? +cell.tile.value === 2048 : false));
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    const state = this.cellState.map((cells) => {
      const values = [];

      for (let i = 0; i < cells.length; i++) {
        if (!cells[i].tile) {
          values.push(0);
          continue;
        }

        const value = +cells[i].tile.value;

        values.push(value);
      }

      return values;
    });

    return state;
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
    const startButton = document.querySelector('.start');

    if (startButton) {
      return 'idle';
    }

    if (this.isWinner()) {
      return 'won';
    }

    if (this.noMovesPossible()) {
      return 'lose';
    }

    return 'playing';
  }

  canMove(cells) {
    return cells.some((group) => {
      return group.some((cell, index) => {
        if (index === 0) {
          return false;
        }

        if (!cell.tile) {
          return false;
        }

        return group[index - 1].canAcceptTile(cell.tile);
      });
    });
  }

  get mergedCells() {
    return this.cellState.flat().filter((cell) => cell.mergeTile);
  }

  get cellsByColumn() {
    const board = this.cellState;
    const newBoard = [];

    for (let y = 0; y < board.length; y++) {
      const column = board.map((row) => row[y]);

      newBoard.push(column);
    }

    return newBoard;
  }

  slideTiles(group) {
    return Promise.all(
      group.flatMap((cells) => {
        const promises = [];

        for (let i = 1; i < cells.length; i++) {
          const cellTile = cells[i].tile;
          const currentCell = cells[i];

          if (!cellTile) {
            continue;
          }

          let lastValidCell;

          for (let j = i - 1; j >= 0; j--) {
            const moveToCell = cells[j];

            if (!moveToCell.canAcceptTile(cellTile)) {
              break;
            }

            lastValidCell = moveToCell;
          }

          if (lastValidCell) {
            if (lastValidCell.tile) {
              promises.push(cellTile.waitForTransition());

              if (!lastValidCell.mergeTile) {
                lastValidCell.mergeTile = cellTile;
              }
            } else {
              lastValidCell.tile = cellTile;
              promises.push(cellTile.waitForTransition());
            }

            currentCell.tile = null;
          }
        }

        return promises;
      }),
    );
  }

  /**
   * Starts the game.
   */
  start() {
    this.createTile();
    this.createTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.cellState.forEach((row) => {
      for (let i = 0; i < row.length; i++) {
        const cell = row[i];

        if (cell.tile) {
          cell.tile.remove();
        }

        if (cell.mergeTile) {
          cell.mergeTile.remove();
        }
      }
    });

    const gameScore = document.querySelector('.game-score');

    gameScore.textContent = '0';

    this.createTile();
    this.createTile();
  }

  createTile() {
    const cell = this.randomEmptyCell;

    cell.tile = new Tile(cell);

    return cell.tile;
  }

  get emptyCells() {
    const cells = [...this.cellState].flat().filter((cell) => !cell.tile);

    return cells;
  }

  get randomEmptyCell() {
    const emptyCells = this.emptyCells;
    const randomIndex = () => Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex()];

    return randomCell;
  }
}

module.exports = Game;
