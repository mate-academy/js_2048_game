'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static get STATUS() {
    return {
      idle: 'idle',
      playing: 'playing',
      win: 'win',
      lose: 'lose',
    };
  }

  static get INITIAL_STATE() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  constructor(initialState = Game.INITIAL_STATE) {
    this.grid = initialState;
    this.status = Game.STATUS.idle;
    this.score = 0;
    this.moves = 0;
  }

  moveLeft() {
    let newGrid = this.move('left');

    if (newGrid) {
      this.grid = newGrid;

      this.getRandomCell();
    }
  }

  moveRight() {
    let newGrid = this.move('right');

    if (newGrid) {
      this.grid = newGrid;
      this.getRandomCell();
    }
  }

  moveUp() {
    let columns = this.getGridData();
    let newColumns = this.move('up', columns);

    if (newColumns) {
      this.grid = this.getGridData(newColumns);
      this.getRandomCell();
    }
  }

  moveDown() {
    let columns = this.getGridData();
    let newColumns = this.move('down', columns);

    if (newColumns) {
      this.grid = this.getGridData(newColumns);
      this.getRandomCell();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {}

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

  /**
   * Starts the game.
   */
  start() {
    this.status = Game.STATUS.playing;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = Game.STATUS.idle;

    this.grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  // Add your own methods here
  move(direction, grid = this.grid) {
    let newGrid = [];
    for (let i = 0; i < grid.length; i++) {
      let newRow = [];

      grid[i].forEach((cell) => {
        if (cell) {
          newRow.push(cell);
        }
      });

      newRow = this.mergeCells(newRow);

      while (newRow.length < 4) {
        if (direction === 'left' || direction === 'up') {
          newRow.push(0);
        }

        if (direction === 'right' || direction === 'down') {
          newRow.unshift(0);
        }
      }

      newGrid.push(newRow);
    }

    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < newGrid.length; j++) {
        if (grid[i][j] !== newGrid[i][j]) {
          return newGrid;
        }
      }
    }

    return false;
  }

  getRandomCell() {
    while (true) {
      const totalCells = this.grid.length * this.grid[0].length;
      const randomIndex = Math.floor(Math.random() * totalCells);
      const x = Math.floor(randomIndex / this.grid[0].length);
      const y = randomIndex % this.grid[0].length;
      const value = Math.random() > 0.5 ? 2 : 4;

      if (this.isEmpty(this.grid[x][y])) {
        this.grid[x][y] = value;

        return [x, y, value];
      }
    }
  }

  getGridData(grid = this.grid) {
    let data = [];

    for (let i = 0; i < grid.length; i++) {
      data.push(grid.map((row) => row[i]));
    }

    return data;
  }

  isEmpty(cell) {
    return cell === 0;
  }

  mergeCells(row) {
    const newRow = [];
    let i = 0;

    while (i < row.length) {
      if (row[i] !== 0 && row[i] === row[i + 1]) {
        newRow.push(row[i] * 2);
        i += 2;
      } else {
        newRow.push(row[i]);
        i++;
      }
    }

    return newRow;
  }
}

module.exports = Game;
