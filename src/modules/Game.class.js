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
  constructor(initialState = this.getInitialState()) {
    // eslint-disable-next-line no-console
    this.state = initialState;
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.moveInline('left');
  }
  moveRight() {
    this.moveInline('right');
  }
  moveUp() {
    this.moveBlock('up');
  }
  moveDown() {
    this.moveBlock('down');
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
    return this.state;
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
    this.score = 0;
    this.status = 'playing';
    this.addRandomSell();
    this.addRandomSell();
  }

  // Add your own methods here
  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.score = 0;
    this.state = this.getInitialState();
  }

  // Add your own methods here
  moveBlock(direction) {
    if (this.getStatus() === 'playing') {
      let isMove = false;

      this.state.forEach((row, rowIndex) => {
        const column = [];

        row.forEach((_, cellIndex) => {
          column.push(this.state[cellIndex][rowIndex]);
        });

        let notEmptyCells = this.getNotEmptyCells(column, direction);

        notEmptyCells = this.mergeCells(notEmptyCells, direction);

        for (let i = 0; i < 4; i++) {
          this.state[i][rowIndex] = notEmptyCells[i] || 0;

          if (this.state[i][rowIndex] !== column[i]) {
            isMove = true;
          }
        }
      });

      if (isMove) {
        this.addRandomSell();
        this.checkWinLose();
      }
    }
  }

  moveInline(direction) {
    if (this.getStatus() === 'playing') {
      let isMove;

      this.state.forEach((row) => {
        const oldRow = [...row];
        let notEmptyCells = this.getNotEmptyCells(row, direction);

        notEmptyCells = this.mergeCells(notEmptyCells, direction);

        row.forEach((_, i) => {
          row[i] = notEmptyCells[i] || 0;
        });

        if (!oldRow.every((cell, index) => cell === row[index])) {
          isMove = true;
        }
      });

      if (isMove) {
        this.addRandomSell();
        this.checkWinLose();
      }
    }
  }

  getInitialState() {
    return new Array(4).fill(0).map(() => new Array(4).fill(0));
  }

  addRandomSell() {
    const freeIndex = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          freeIndex.push([row, col]);
        }
      }
    }

    const getRandIndex = Math.floor(Math.random() * freeIndex.length);

    const getNum = Math.random() < 0.9 ? 2 : 4;

    const [newRow, newCol] = freeIndex[getRandIndex];

    this.state[newRow][newCol] = getNum;
  }

  getNotEmptyCells(position, direction) {
    const notEmptyCells = position.filter((cell) => cell > 0);

    if (direction === 'right' || direction === 'down') {
      while (notEmptyCells.length < 4) {
        notEmptyCells.unshift(0);
      }
    }

    if (direction === 'left' || direction === 'up') {
      while (notEmptyCells.length < 4) {
        notEmptyCells.push(0);
      }
    }

    return notEmptyCells;
  }

  mergeCells(cells, direction) {
    for (let i = 0; i < cells.length - 1; i++) {
      const valueOne = cells[i];
      const valueTwo = cells[i + 1];

      if (valueOne === valueTwo && valueOne > 0) {
        this.score += valueOne + valueTwo;
        cells[i] = valueOne + valueTwo;
        cells.splice(i + 1, 1);
      }
    }

    if (direction === 'right' || direction === 'down') {
      return this.getNotEmptyCells(cells, direction);
    }

    return cells;
  }

  hasMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.state[row][col];

        if (current === 0) {
          return true;
        }

        if ((row < 3 ? this.state[row + 1][col] : 0) === current) {
          return true;
        }

        if ((col < 3 ? this.state[row][col + 1] : 0) === current) {
          return true;
        }
        // if (current === right) {
        //   return true;
        // }

        // if (current === down) {
        //   return true;
        // }

        // if (down === 0 || right === 0) {
        //   return true;
        // }
      }
    }

    return false;
  }

  checkWinLose() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'win';
    }

    if (!this.hasMove()) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
