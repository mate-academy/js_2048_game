'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

const startMessage = document.querySelector('.message-start');

export const winMessage = document.querySelector('.message-win');
export const lostMessage = document.querySelector('.message-lose');

const score = document.querySelector('.game-score');

export class Game {
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
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  static gameScore = 0;

  moveLeft() {
    if (this.getStatus() === 'win') {
      winMessage.classList.remove('hidden');
    } else if (this.getStatus() === 'lose') {
      lostMessage.classList.remove('hidden');
    } else {
      let hasChanged = false;

      for (let row = 0; row < this.initialState.length; row++) {
        const currentRow = this.initialState[row];

        const nonZeroCells = currentRow.filter((cell) => cell !== 0);
        let mergedRow = [];
        let i = 0;

        while (i < nonZeroCells.length) {
          if (
            i < nonZeroCells.length &&
            nonZeroCells[i] === nonZeroCells[i + 1]
          ) {
            mergedRow.push(nonZeroCells[i] * 2);
            this.getScore(nonZeroCells[i]);
            i += 2;
          } else {
            mergedRow.push(nonZeroCells[i]);
            i++;
          }
        }

        const zerosToAdd = currentRow.length - mergedRow.length;

        mergedRow = [...mergedRow, ...Array(zerosToAdd).fill(0)];

        const everyVal = mergedRow.every(
          (val, k) => val === this.initialState[row][k],
        );

        if (!everyVal) {
          hasChanged = true;
          this.initialState[row] = mergedRow;
        }
      }

      if (hasChanged) {
        this.generateNewNumber();
      }
      this.getUpdatedField();
    }
  }

  moveUp() {
    if (this.getStatus() === 'win') {
      winMessage.classList.remove('hidden');
    } else if (this.getStatus() === 'lose') {
      lostMessage.classList.remove('hidden');
    } else {
      let hasChanged = false;

      for (let column = 0; column < this.initialState[0].length; column++) {
        const currentColumn = [];

        for (let row = 0; row < this.initialState.length; row++) {
          currentColumn.push(this.initialState[row][column]);
        }

        const nonZeroCells = currentColumn.filter((cell) => cell !== 0);
        let mergedColumn = [];
        let i = 0;

        while (i < nonZeroCells.length) {
          if (
            i < nonZeroCells.length &&
            nonZeroCells[i] === nonZeroCells[i + 1]
          ) {
            mergedColumn.push(nonZeroCells[i] * 2);
            this.getScore(nonZeroCells[i]);
            i += 2;
          } else {
            mergedColumn.push(nonZeroCells[i]);
            i++;
          }
        }

        const addZeroesAmount = currentColumn.length - mergedColumn.length;

        mergedColumn = [...mergedColumn, ...Array(addZeroesAmount).fill(0)];

        const everyVal = mergedColumn.every(
          (val, k) => val === this.initialState[k][column],
        );

        if (!everyVal) {
          hasChanged = true;

          for (let row = 0; row < this.initialState.length; row++) {
            this.initialState[row][column] = mergedColumn[row];
          }
        }
      }

      if (hasChanged) {
        this.generateNewNumber();
      }

      this.getUpdatedField();
    }
  }

  moveRight() {
    if (this.getStatus() === 'win') {
      winMessage.classList.remove('hidden');
    } else if (this.getStatus() === 'lose') {
      lostMessage.classList.remove('hidden');
    } else {
      let hasChanged = false;

      for (let row = 0; row < this.initialState.length; row++) {
        const currentRow = this.initialState[row];

        const nonZeroCells = currentRow.filter((cell) => cell !== 0);
        const mergedRow = [];
        let i = 0;

        while (i < nonZeroCells.length) {
          if (
            i < nonZeroCells.length &&
            nonZeroCells[i] === nonZeroCells[i + 1]
          ) {
            mergedRow.push(nonZeroCells[i] * 2);
            this.getScore(nonZeroCells[i]);
            i += 2;
          } else {
            mergedRow.push(nonZeroCells[i]);
            i++;
          }
        }

        const addZeroesAmount = currentRow.length - mergedRow.length;

        mergedRow.unshift(...Array(addZeroesAmount).fill(0));

        const everyVal = mergedRow.every(
          (val, k) => val === this.initialState[row][k],
        );

        if (!everyVal) {
          hasChanged = true;
          this.initialState[row] = mergedRow;
        }
      }

      if (hasChanged) {
        this.generateNewNumber();
      }

      this.getUpdatedField();
    }
  }

  moveDown() {
    if (this.getStatus() === 'win') {
      winMessage.classList.remove('hidden');
    } else if (this.getStatus() === 'lose') {
      lostMessage.classList.remove('hidden');
    } else {
      let hasChanged = false;

      for (let column = 0; column < this.initialState[0].length; column++) {
        const currentColumn = [];

        for (let row = 0; row < this.initialState.length; row++) {
          currentColumn.push(this.initialState[row][column]);
        }

        const nonZeroCells = currentColumn.filter((cell) => cell !== 0);
        const mergedColumn = [];
        let i = 0;

        while (i < nonZeroCells.length) {
          if (
            i < nonZeroCells.length &&
            nonZeroCells[i] === nonZeroCells[i + 1]
          ) {
            mergedColumn.push(nonZeroCells[i] * 2);
            this.getScore(nonZeroCells[i]);
            i += 2;
          } else {
            mergedColumn.push(nonZeroCells[i]);
            i++;
          }
        }

        const addZeroesAmount = currentColumn.length - mergedColumn.length;

        mergedColumn.unshift(...Array(addZeroesAmount).fill(0));

        const everyVal = mergedColumn.every(
          (val, k) => val === this.initialState[k][column],
        );

        if (!everyVal) {
          hasChanged = true;

          for (let row = 0; row < this.initialState.length; row++) {
            this.initialState[row][column] = mergedColumn[row];
          }
        }
      }

      if (hasChanged) {
        this.generateNewNumber();
      }
      this.getUpdatedField();
    }
  }

  /**
   * @returns {number}
   */
  getScore(value) {
    Game.gameScore += value * 2;

    score.textContent = Game.gameScore;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.initialState;
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
    const hasNotStartedYet = this.initialState.every((row) => {
      return row.every((cell) => cell === 0);
    });

    if (hasNotStartedYet) {
      return 'idle';
    }

    const win = this.initialState.some((row) => {
      return row.some((cell) => cell === 2048);
    });

    if (win) {
      return 'win';
    }

    const fullRows = this.initialState.every((row) => {
      return row.every((cell) => cell !== 0 && cell % 2 === 0);
    });
    let lose = true;

    for (let row = 0; row < this.initialState.length; row++) {
      const currentRow = this.initialState[row];

      for (let i = 0; i < currentRow.length; i++) {
        if (currentRow[i] === currentRow[i + 1]) {
          lose = false;
        }
      }
    }

    for (let column = 0; column < this.initialState[0].length; column++) {
      for (let row = 0; row < this.initialState.length - 1; row++) {
        if (
          this.initialState[row][column] === this.initialState[row + 1][column]
        ) {
          lose = false;
        }
      }
    }

    if (fullRows && lose) {
      return 'lose';
    }

    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    this.generateNewNumber();
    this.generateNewNumber();
    this.getUpdatedField();

    startMessage.classList.add('hidden');
    winMessage.classList.add('hidden');
    lostMessage.classList.add('hidden');
  }

  generateNewNumber() {
    let newNumber = Math.random();

    if (newNumber < 0.1) {
      newNumber = 4;
    } else {
      newNumber = 2;
    }

    let checkedRows = 0;

    while (true) {
      const randomRow = Math.floor(Math.random() * 4);
      const randomIndex = Math.floor(Math.random() * 4);

      if (this.initialState[randomRow][randomIndex] === 0) {
        this.initialState[randomRow][randomIndex] = newNumber;
        break;
      }

      checkedRows++;

      if (checkedRows === 4) {
        break;
      }
    }
    this.getUpdatedField();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.initialState.map((row) => {
      row.fill(0);
    });

    Game.gameScore = 0;
    score.textContent = 0;
    this.getUpdatedField();
    this.start();
  }

  getUpdatedField() {
    this.clearCells();

    for (let row = 0; row < this.initialState.length; row++) {
      const activeRow = document.querySelectorAll(
        `.field-row:nth-child(${row + 1})`,
      );

      for (let column = 0; column < this.initialState[row].length; column++) {
        if (this.initialState[row][column] === 0) {
          continue;
        }

        activeRow[0].children[column].textContent =
          this.initialState[row][column];

        activeRow[0].children[column].classList.add(
          `field-cell--${this.initialState[row][column]}`,
        );
      }
    }
  }

  clearCells() {
    for (let row = 0; row < this.initialState.length; row++) {
      const activeRow = document.querySelectorAll(
        `.field-row:nth-child(${row + 1})`,
      );

      Array.from(activeRow[0].children).forEach((cell) => {
        cell.classList.remove(`field-cell--${cell.textContent}`);
        cell.textContent = '';
      });
    }
  }
}
