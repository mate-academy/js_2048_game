'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
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
    this.matrix = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'idle';
    this.score = 0;
    this.tiles = [];
    this.container = document.querySelector('.game-field');

    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    let matrixClone = this.matrix.map((row) => [...row]);

    matrixClone = matrixClone.map((row) => {
      const filtered = row.filter((c) => c !== 0);

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          filtered[i + 1] = 0;
          this.score += filtered[i];
        }
      }

      const result = filtered.filter((e) => e !== 0);

      while (result.length < row.length) {
        result.push(0);
      }

      return result;
    });

    const testingMove = this.isChange(matrixClone);

    if (!testingMove) {
      return false;
    }

    this.matrix = matrixClone;
    this.addRandomTile();
    this.renderTiles();

    return true;
  }

  moveRight() {
    let matrixClone = this.matrix.map((row) => [...row]);

    matrixClone = matrixClone.map((row) => {
      const filtered = row.filter((c) => c !== 0);

      for (let i = filtered.length - 1; i > 0; i--) {
        if (filtered[i] === filtered[i - 1]) {
          filtered[i] *= 2;
          filtered[i - 1] = 0;
          this.score += filtered[i];
        }
      }

      const result = filtered.filter((e) => e !== 0);

      while (result.length < row.length) {
        result.unshift(0);
      }

      return result;
    });

    const testingMove = this.isChange(matrixClone);

    if (!testingMove) {
      return false;
    }

    this.matrix = matrixClone;
    this.addRandomTile();
    this.renderTiles();

    return true;
  }

  moveUp() {
    const matrixClone = this.matrix.map((row) => [...row]);

    for (let i = 0; i < matrixClone.length; i++) {
      const column = [];

      for (let j = 0; j < matrixClone[i].length; j++) {
        column.push(matrixClone[j][i]);
      }

      const columnFilter = column.filter((c) => c !== 0);

      for (let a = 0; a < columnFilter.length - 1; a++) {
        if (columnFilter[a] === columnFilter[a + 1]) {
          columnFilter[a] *= 2;
          columnFilter[a + 1] = 0;
          this.score += columnFilter[a];
        }
      }

      const newColumn = columnFilter.filter((e) => e !== 0);

      while (newColumn.length < column.length) {
        newColumn.push(0);
      }

      for (let row = 0; row < 4; row++) {
        matrixClone[row][i] = newColumn[row];
      }
    }

    const testingMove = this.isChange(matrixClone);

    if (!testingMove) {
      return false;
    }

    this.matrix = matrixClone;
    this.addRandomTile();
    this.renderTiles();

    return true;
  }

  moveDown() {
    const matrixClone = this.matrix.map((row) => [...row]);

    for (let i = 0; i < matrixClone[0].length; i++) {
      const column = [];

      for (let j = 0; j < matrixClone.length; j++) {
        column.push(matrixClone[j][i]);
      }

      const columnFilter = column.filter((c) => c !== 0);

      for (let a = columnFilter.length - 1; a > 0; a--) {
        if (columnFilter[a] === columnFilter[a - 1]) {
          columnFilter[a] *= 2;
          columnFilter[a - 1] = 0;
          this.score += columnFilter[a];
        }
      }

      const newColumn = columnFilter.filter((e) => e !== 0);

      while (newColumn.length < column.length) {
        newColumn.unshift(0);
      }

      for (let row = 0; row < 4; row++) {
        matrixClone[row][i] = newColumn[row];
      }
    }

    const testingMove = this.isChange(matrixClone);

    if (!testingMove) {
      return false;
    }

    this.matrix = matrixClone;
    this.addRandomTile();
    this.renderTiles();

    return true;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.matrix.map((row) => [...row]);
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

  /**
   * Starts the game.
   */
  start() {
    this.matrix = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile(true);
    this.addRandomTile(true);
    this.renderTiles();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  addRandomTile(isStart = false) {
    const coords = [];

    this.matrix.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          coords.push([rowIndex, colIndex]);
        }
      });
    });

    if (coords.length === 0) {
      return;
    }

    const [randomRow, randomCol] =
      coords[Math.floor(Math.random() * coords.length)];

    const randomValue = isStart ? 2 : Math.random() < 0.9 ? 2 : 4;

    this.matrix[randomRow][randomCol] = randomValue;
  }

  isWon() {
    this.won = false;

    this.matrix.forEach((row) => {
      row.forEach((cell) => {
        if (cell === 2048) {
          this.won = true;
          this.status = `win`;
        }
      });
    });
  }

  isLose() {
    this.lose = true;

    for (let row = 0; row < this.matrix.length; row++) {
      for (let col = 0; col < this.matrix[row].length; col++) {
        if (this.matrix[row][col] === 0) {
          this.lose = false;
        }

        if (
          col + 1 < this.matrix[row].length &&
          this.matrix[row][col] === this.matrix[row][col + 1]
        ) {
          this.lose = false;
        }

        if (
          row + 1 < this.matrix.length &&
          this.matrix[row][col] === this.matrix[row + 1][col]
        ) {
          this.lose = false;
        }
      }
    }

    if (this.lose === true) {
      this.status = `lose`;
    }
  }

  isChange(matrixTest) {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix[i].length; j++) {
        if (this.matrix[i][j] !== matrixTest[i][j]) {
          return true;
        }
      }
    }

    return false;
  }

  renderTiles() {
    this.tiles.forEach((tile) => tile.remove());
    this.tiles = [];

    for (let row = 0; row < this.matrix.length; row++) {
      for (let col = 0; col < this.matrix[row].length; col++) {
        if (this.matrix[row][col] !== 0) {
          const tile = new Tile(
            row,
            col,
            this.matrix[row][col],
            this.container,
          );

          this.tiles.push(tile);
        }
      }
    }
  }
}

class Tile {
  constructor(row, col, value, container) {
    const createdTile = document.createElement('div');

    createdTile.className = `field-tile field-cell--${value}`;
    createdTile.textContent = value;

    const cellSize = 75;
    const gap = 10;

    createdTile.style.top = `${row * (cellSize + gap) + gap}px`;
    createdTile.style.left = `${col * (cellSize + gap) + gap}px`;

    container.appendChild(createdTile);

    this.el = createdTile;
    this.row = row;
    this.col = col;
    this.value = value;
  }

  remove() {
    this.el.remove();
  }
}

module.exports = Game;
