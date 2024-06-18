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
    this.moveAndMerge(this.state, 'left');
  }
  moveRight() {
    this.moveAndMerge(this.state, 'right');
  }
  moveUp() {
    this.moveAndMerge(this.state, 'up');
  }
  moveDown() {
    this.moveAndMerge(this.state, 'down');
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
    const getRandomN = () => Math.floor(Math.random() * 16) + 1;

    const getRandomCell = (n) => {
      const row = Math.ceil(n / 4) - 1;
      const cell = n % 4 === 0 ? 3 : (n % 4) - 1;

      return [row, cell];
    };

    const getRandomCells = () => {
      const n1 = getRandomN();
      let n2;

      do {
        n2 = getRandomN();
      } while (n1 === n2);

      return [getRandomCell(n1), getRandomCell(n2)];
    };

    const cells = getRandomCells();

    this.status = Game.status.playing;

    cells.forEach(
      ([row, cell]) => (this.state[row][cell] = Math.random() < 0.9 ? 2 : 4),
    );
  }

  restart() {
    this.status = Game.status.idle;
    this.state = JSON.parse(JSON.stringify(Game.initialState));
    this.score = 0;
  }

  moveAndMerge(grid, direction) {
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

    return grid;
  }
}

module.exports = Game;
