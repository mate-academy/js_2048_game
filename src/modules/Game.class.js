'use strict';

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
    this.status = Game.STATUS.idle;
    this.initialState = initialState;
    this.state = this.initialState.map((row) => row.slice());
    this.score = 0;
    this.moves = 0;

    this.animation = {
      newCell: [],
    };
  }

  moveLeft() {
    const newGrid = this.move('left');

    if (newGrid) {
      this.state = newGrid;

      this.animation.newCell = this.getRandomCell();

      if (!this.hasAvailableMoves(newGrid)) {
        this.lose();
      }
    }
  }

  moveRight() {
    const newGrid = this.move('right');

    if (newGrid) {
      this.state = newGrid;
      this.animation.newCell = this.getRandomCell();

      if (!this.hasAvailableMoves(newGrid)) {
        this.lose();
      }
    }
  }

  moveUp() {
    const columns = this.getGridData();
    const newColumns = this.move('up', columns);

    if (newColumns) {
      this.state = this.getGridData(newColumns);
      this.animation.newCell = this.getRandomCell();

      if (!this.hasAvailableMoves(newColumns)) {
        this.lose();
      }
    }
  }

  moveDown() {
    const columns = this.getGridData();
    const newColumns = this.move('down', columns);

    if (newColumns) {
      this.state = this.getGridData(newColumns);
      this.animation.newCell = this.getRandomCell();

      if (!this.hasAvailableMoves(newColumns)) {
        this.lose();
      }
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = Game.STATUS.playing;
    this.getRandomCell();
    this.getRandomCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = Game.STATUS.idle;
    this.score = 0;
    this.state = this.initialState.map((row) => row.slice());
  }

  // Add your own methods here
  lose() {
    this.status = Game.STATUS.lose;
  }

  win() {
    this.status = Game.STATUS.win;
  }

  move(direction, grid = this.state) {
    if (this.status !== 'playing') {
      return false;
    }

    const newGrid = [];

    for (let i = 0; i < grid.length; i++) {
      let newRow = grid[i].filter((cell) => cell);

      if (newRow.length > 1) {
        newRow = this.mergeCells(newRow, direction);
      }

      while (newRow.length < 4) {
        if (direction === 'left' || direction === 'up') {
          newRow.push(0);
        } else {
          newRow.unshift(0);
        }
      }

      newGrid.push(newRow);
    }

    return JSON.stringify(grid) !== JSON.stringify(newGrid) ? newGrid : false;
  }

  hasAvailableMoves(grid) {
    for (let x = 0; x < grid.length; x++) {
      for (let y = 0; y < grid[x].length; y++) {
        if (grid[x][y] === 0) {
          return true;
        }

        if (x < grid.length - 1 && grid[x][y] === grid[x + 1][y]) {
          return true;
        }

        if (y < grid[x].length - 1 && grid[x][y] === grid[x][y + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  getRandomCell() {
    while (true) {
      const totalCells = this.state.length * this.state[0].length;
      const randomIndex = Math.floor(Math.random() * totalCells);
      const x = Math.floor(randomIndex / this.state[0].length);
      const y = randomIndex % this.state[0].length;
      const value = Math.random() > 0.1 ? 2 : 4;

      if (this.isEmpty(this.state[x][y])) {
        this.state[x][y] = value;

        return [x, y, value];
      }
    }
  }

  getGridData(grid = this.state) {
    const data = [];

    for (let i = 0; i < grid.length; i++) {
      data.push(grid.map((row) => row[i]));
    }

    return data;
  }

  isEmpty(cell) {
    return cell === 0;
  }

  mergeCells(row, direction) {
    let currentRow = row;
    const newRow = [];
    let i = 0;

    if (direction === 'right' || direction === 'down') {
      currentRow = [...currentRow].reverse();
    }

    while (i < currentRow.length) {
      if (currentRow[i] !== 0 && currentRow[i] === currentRow[i + 1]) {
        const sum = currentRow[i] * 2;

        this.score += sum;

        newRow.push(sum);

        if (sum === 2048) {
          this.win();
        }
        i += 2;
      } else {
        newRow.push(currentRow[i]);
        i++;
      }
    }

    if (direction === 'right' || direction === 'down') {
      return newRow.reverse();
    }

    return newRow;
  }
}

module.exports = Game;
