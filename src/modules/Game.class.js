'use strict';

class Game {
  static initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  static status = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(initialState = Game.initialState) {
    this.state = JSON.parse(JSON.stringify(initialState));
    this.status = Game.status.idle;
    this.score = 0;
  }

  moveLeft() {
    if (this.getStatus() === 'playing') {
      this.state = this.moveAndMerge(this.state, 'left');
    }
  }
  moveRight() {
    if (this.getStatus() === 'playing') {
      this.state = this.moveAndMerge(this.state, 'right');
    }
  }
  moveUp() {
    if (this.getStatus() === 'playing') {
      this.state = this.moveAndMerge(this.state, 'up');
    }
  }
  moveDown() {
    if (this.getStatus() === 'playing') {
      this.state = this.moveAndMerge(this.state, 'down');
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
    this.status = Game.status.playing;
    this.addRandomTile(this.state);
    this.addRandomTile(this.state);
  }

  restart() {
    this.status = Game.status.idle;
    this.state = JSON.parse(JSON.stringify(Game.initialState));
    this.score = 0;
  }

  moveAndMerge(prevGameState, direction) {
    const grid = JSON.parse(JSON.stringify(prevGameState));
    const size = grid.length;

    const moveRow = (row, reverse = false) => {
      if (reverse) {
        row.reverse();
      }

      const nonZeroElements = row.filter((value) => value !== 0);

      for (let i = 0; i < nonZeroElements.length - 1; i++) {
        if (nonZeroElements[i] === nonZeroElements[i + 1]) {
          nonZeroElements[i] *= 2;
          nonZeroElements[i + 1] = 0;

          this.score += nonZeroElements[i];

          if (this.score === 2048) {
            this.status = Game.status.win;
          }
        }
      }

      const mergedElements = nonZeroElements.filter((value) => value !== 0);

      while (mergedElements.length < row.length) {
        mergedElements.push(0);
      }

      if (reverse) {
        mergedElements.reverse();
      }

      return mergedElements;
    };

    const getColumn = (gridToGetFrom, colIndex) =>
      gridToGetFrom.map((row) => row[colIndex]);

    const setColumn = (gridToSetTo, colIndex, newCol) => {
      newCol.forEach((value, rowIndex) => {
        gridToSetTo[rowIndex][colIndex] = value;
      });
    };

    if (direction === 'left' || direction === 'right') {
      const reverse = direction === 'right';

      for (let row = 0; row < size; row++) {
        grid[row] = moveRow(grid[row], reverse);
      }
    } else if (direction === 'up' || direction === 'down') {
      const reverse = direction === 'down';

      for (let col = 0; col < size; col++) {
        const column = getColumn(grid, col);
        const newColumn = moveRow(column, reverse);

        setColumn(grid, col, newColumn);
      }
    }

    if (
      JSON.stringify(prevGameState) === JSON.stringify(grid) ||
      this.status === 'win'
    ) {
      return prevGameState;
    }

    return this.addRandomTile(grid);
  }

  addRandomTile(resGrid) {
    const size = resGrid.length;
    const emptyCells = [];

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (resGrid[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return resGrid;
    }

    const [randomRow, randomCol] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    resGrid[randomRow][randomCol] = Math.random() < 0.1 ? 4 : 2;

    return resGrid;
  }
}

module.exports = Game;
