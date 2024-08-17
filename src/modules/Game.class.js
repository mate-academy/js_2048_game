'use strict';

const { default: Cell } = require('./Cell.class');
const { default: Tile } = require('./Tile.class');

class Game {
  constructor(initialState) {
    const cellElements = [...document.querySelectorAll('.field-cell')];

    this.gameBoard = document.querySelector('.game-field');

    this.cells = cellElements.map((cellElement, index) => {
      return new Cell(cellElement, index % 4, Math.floor(index / 4));
    });
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

  get emptyCells() {
    return this.cells.filter((cell) => cell.tile == null);
  }

  randomEmptyCell() {
    const randomIndex = Math.floor(Math.random() * this.emptyCells.length);

    return this.emptyCells[randomIndex];
  }

  addRandomTile() {
    const emptyCell = this.randomEmptyCell();

    if (emptyCell) {
      emptyCell.tile = new Tile(this.gameBoard);
    }
  }

  moveUp() {
    return this.slideTiles(this.cellsByColumn);
  }

  moveDown() {
    return this.slideTiles(
      this.cellsByColumn.map((column) => [...column].reverse()),
    );
  }

  moveLeft() {
    return this.slideTiles(this.cellsByRow);
  }

  moveRight() {
    return this.slideTiles(this.cellsByRow.map((row) => [...row].reverse()));
  }

  slideTiles(cells) {
    return Promise.all(
      cells.map((group) => {
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
      }),
    );
  }

  updateScore() {
    const currentScore = this.getScore();

    // Update your score display here, for example:
    document.querySelector('.game-score').textContent = currentScore;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.cells.reduce((total, cell) => {
      if (cell.tile) {
        return total + cell.tile.value;
      }

      return total;
    }, 0);
  }

  /**
   * @returns {number[][]}
   */
  getState() {}

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
  getStatus() {}

  start() {
    this.addRandomTile();
    this.addRandomTile();
    this.updateScore();
  }

  restart() {
    this.cells.forEach((cell) => {
      if (cell.tile) {
        cell.tile.remove();
        cell.tile = null;
      }

      if (cell.mergeTile) {
        cell._mergeTile = null;
      }
    });

    this.addRandomTile();
    this.addRandomTile();

    // update score
    this.updateScore();
  }
}

module.exports = Game;
