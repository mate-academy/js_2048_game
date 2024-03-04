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

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    gameStatus = 'idle',
    gameScore = 0) {
    this.initialState = initialState;
    this.gameStatus = gameStatus;
    this.gameScore = gameScore;
    this.copyState = [...initialState];
  }

  // Function for check if any rows or columns were changed
  toComapare(comparingArr, toCompare) {
    if (comparingArr.length !== toCompare.length) {
      return false;
    }

    return comparingArr.every((val, index) => {
      if (Array.isArray(val) && Array.isArray(toCompare[index])) {
        if (this.toComapare(val, toCompare[index])) {
          return true;
        };
      } else if (val === toCompare[index]) {
        return true;
      }

      return false;
    });
  }

  // Function for check if 2048 is present
  setWinGame(cell) {
    if (cell === 2048) {
      this.gameStatus = 'win';
      this.getStatus();
    }
  }

  isGameLoseVertical() {
    for (let i = 0; i < this.copyState.length; i++) {
      const col = this.copyState.map(row => row[i]);

      if (col.some((element, index) =>
        index < col.length - 1
        && element === col[index + 1])) {
        return true;
      }
    }

    return false;
  }

  isGameLoseHorizontal() {
    for (let i = 0; i < this.copyState.length; i++) {
      if (this.copyState[i].some((element, index) =>
        index < this.copyState[i].length - 1
        && element === this.copyState[i][index + 1])) {
        return true;
      }
    }

    return false;
  }

  // Function for horizontal moves cell
  horizontalMoves(direction) {
    const toCompare = JSON.parse(JSON.stringify(this.copyState));

    this.copyState.forEach((row, i) => {
      const newRow = [];

      for (let j = 0; j < row.length; j++) {
        let nextIndex = j + 1;

        if (row[j] === 0) {
          nextIndex++;
          continue;
        }

        if (row[j] !== 0) {
          if (nextIndex < row.length && row[j] === row[nextIndex]) {
            row[j] += row[nextIndex];
            this.gameScore += row[j];
            row[nextIndex] = 0;
          }
          newRow.push(row[j]);
        }
      }

      while (newRow.length < row.length) {
        direction === 'left' ? newRow.push(0) : newRow.unshift(0);
      }
      this.copyState[i] = newRow;
    });

    if (!this.toComapare(toCompare, this.copyState)) {
      this.addNumberAfterStep();
    }

    if (!this.isGameLoseVertical() && !this.isGameLoseHorizontal()) {
      this.gameStatus = 'lose';
      this.getStatus();
    }

    console.log(this.isGameLoseVertical());
    console.log(this.isGameLoseHorizontal());

    return this.copyState;
  }

  // Function for vertical moves cell
  verticalMoves(direction) {
    const toCompare = JSON.parse(JSON.stringify(this.copyState));
    let col = [];

    this.copyState.forEach((_, i) => {
      col = this.copyState.map(c => c[i]);

      const newColumn = [];

      for (let j = 0; j < col.length; j++) {
        let nextIndex = j + 1;

        if (col[j] === 0) {
          nextIndex++;
          continue;
        }

        if (col[j] !== 0) {
          if (nextIndex < col.length && col[j] === col[nextIndex]) {
            col[j] += col[nextIndex];
            this.gameScore += col[j];
            col[nextIndex] = 0;
          }
          newColumn.push(col[j]);
        }
      }

      while (newColumn.length < col.length) {
        direction === 'up' ? newColumn.push(0) : newColumn.unshift(0);
      }

      for (let k = 0; k < this.copyState.length; k++) {
        this.copyState[k][i] = newColumn[k];
      }
    });

    if (!this.toComapare(toCompare, this.copyState)) {
      this.addNumberAfterStep();
    }

    console.log(this.isGameLoseVertical());
    console.log(this.isGameLoseHorizontal());

    if (!this.isGameLoseVertical() && !this.isGameLoseHorizontal) {
      this.gameStatus = 'lose';
      this.getStatus();
    }

    return this.copyState;
  }

  moveLeft() {
    this.horizontalMoves('left');
  }

  moveRight() {
    this.horizontalMoves('right');
  }

  moveUp() {
    this.verticalMoves('up');
  }

  moveDown() {
    this.verticalMoves('down');
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.gameScore;
  }

  /**
   * @returns {number[][]}
   */

  // Function search cell === 0 and fill the number if it's possible
  getIndexes() {
    const emptyFields = [];

    this.copyState.map((row, i) => {
      row.map((col, j) => {
        this.setWinGame(col);

        if (col === 0) {
          emptyFields.push([i, j]);
        }
      });
    });

    const randomEnptyValues = Math.floor(Math.random() * emptyFields.length);

    return emptyFields[randomEnptyValues];
  }

  getNumber() {
    return Math.random() < 0.1 ? 4 : 2;
  }

  // Function cells with number
  renderFields(maxNumbers) {
    const indexes = [];

    while (indexes.length < maxNumbers) {
      let index = [...this.getIndexes()];
      const includesSubArray = indexes.some(arr =>
        arr.every((value, i) => value === index[i]));

      if (includesSubArray && maxNumbers === 2) {
        index = [...this.getIndexes()];
      }

      if (!index.length < 0) {
        return;
      }

      if (this.copyState[index[0]][index[1]] !== 0) {
        break;
      }

      indexes.push(index);
    }

    for (const [row, col] of indexes) {
      this.copyState[row][col] = this.getNumber();
    }
  }

  getState() {
    return this.copyState;
  }

  addNumberAfterStep() {
    this.renderFields(1);
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
    return this.gameStatus;
  }

  /**
   * Starts the game.
   */

  start() {
    this.renderFields(2);
    this.gameStatus = 'playing';
    this.getStatus();
  }
  /**
   * Resets the game.
   */
  restart() {
    this.gameStatus = 'idle';
    this.getStatus();
    this.copyState = JSON.parse(JSON.stringify(this.initialState));
    this.getState();
    this.gameScore = 0;
    this.getScore();
  }

  // Add your own methods here
}
module.exports = Game;
