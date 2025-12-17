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
    // eslint-disable-next-line no-console
    console.log(initialState);
    this.isGameOver = false;
    this.score = 0;
    this.hasMovedOnce = false;
  }

  moveLeft() {
    if (this.isGameOver) {
      return;
    }

    const prevState = this.getState();

    const tbody = document.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');

    rows.forEach((row) => {
      const cells = Array.from(row.querySelectorAll('td'));

      this.processLine(cells);
    });

    this.afterMoveActions(prevState);

    return this.score;
  }

  moveRight() {
    if (this.isGameOver) {
      return;
    }

    const prevState = this.getState();

    const tbody = document.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');

    rows.forEach((row) => {
      let cells = Array.from(row.querySelectorAll('td'));

      cells = cells.reverse();
      this.processLine(cells);
    });

    this.afterMoveActions(prevState);

    return this.score;
  }

  moveUp() {
    if (this.isGameOver) {
      return;
    }

    const prevState = this.getState();

    const tbody = document.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    const colsNum = rows[0].querySelectorAll('td').length;

    for (let col = 0; col < colsNum; col++) {
      const cells = [];

      rows.forEach((row) => {
        cells.push(row.querySelectorAll('td')[col]);
      });
      this.processLine(cells);
    }

    this.afterMoveActions(prevState);

    return this.score;
  }

  moveDown() {
    if (this.isGameOver) {
      return;
    }

    const prevState = this.getState();

    const tbody = document.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');
    const colsNum = rows[0].querySelectorAll('td').length;

    for (let col = 0; col < colsNum; col++) {
      const cells = [];

      rows.forEach((row) => {
        cells.push(row.querySelectorAll('td')[col]);
      });
      cells.reverse();
      this.processLine(cells);
    }

    this.afterMoveActions(prevState);

    return this.score;
  }

  /**
   * @returns {number}
   */
  getScore() {
    const score = document.querySelector('.game-score');

    score.textContent = this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    const state = [];
    const rows = document.querySelectorAll('tbody tr');

    rows.forEach((row) => {
      const rowState = [];
      const cells = row.querySelectorAll('td');

      cells.forEach((cell) => {
        const value = parseInt(cell.textContent.trim());

        rowState.push(isNaN(value) ? 0 : value);
      });

      state.push(rowState);
    });

    return state;
  }

  /**
   * Returns the current game status.
@@ -50,19 +164,234 @@ class Game {
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    const state = this.getState();

    const hasEmpty = state.some((row) => row.includes(0));

    const isWin = state.some((row) => row.includes(2048));

    if (!hasEmpty && !this.canMerge(state)) {
      this.isGameOver = true;

      const lose = document.querySelector('.message-lose');

      lose.classList.remove('hidden');

      return 'lose';
    }

    if (isWin) {
      this.isGameOver = true;

      const win = document.querySelector('.message-win');

      win.classList.remove('hidden');

      return 'win';
    }

    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    this.isGameOver = false;

    const message = document.querySelector('.message-start');

    message.classList.add('hidden');

    let count = 0;
    const values = this.getState();

    values.forEach((row) => {
      row.forEach((cell) => {
        if (cell !== 0) {
          count++;
        }
      });
    });

    for (let i = 0; i < 2 - count; i++) {
      this.generateCube();
    }

    this.getScore();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.isGameOver = false;
    this.hasMovedOnce = false;

    const mainButton = document.querySelector('.button');

    mainButton.classList.remove('restart');
    mainButton.classList.add('start');

    mainButton.textContent = 'Start';

    const message = document.querySelector('.message-start');

    message.classList.remove('hidden');

    const messageLose = document.querySelector('.message-lose');

    messageLose.classList.add('hidden');

    const messageWin = document.querySelector('.message-win');

    messageWin.classList.add('hidden');

    this.score = 0;

    const rows = document.querySelectorAll('tbody tr');

    rows.forEach((row) => {
      row.querySelectorAll('td').forEach((col) => {
        col.textContent = '';

        col.classList.forEach((className) => {
          if (className.startsWith('field-cell--')) {
            col.classList.remove(className);
          }
        });
      });
    });

    this.getScore();
  }

  extractValues(cells) {
    const values = [];

    cells.forEach((cell) => {
      const value = cell.textContent.trim();

      if (value !== '') {
        values.push(value);
      }
    });

    return values;
  }

  updateCells(cells, values) {
    cells.forEach((cell, i) => {
      cell.classList.forEach((className) => {
        if (className.startsWith('field-cell--')) {
          cell.classList.remove(className);
        }
      });

      if (values[i]) {
        cell.classList.add(`field-cell--${values[i]}`);
        cell.textContent = values[i];
      } else {
        cell.textContent = '';
      }
    });
  }

  processLine(cells) {
    const values = this.extractValues(cells);

    this.mergeCubes(values);
    this.updateCells(cells, values);
  }

  afterMoveActions(prevState) {
    const newState = this.getState();
    const hasChanged = this.areStatesEqual(prevState, newState);

    if (!hasChanged) {
      this.generateCube();
      this.getStatus();
      this.markFirstMove();
    }
  }

  mergeCubes(values) {
    for (let i = 0; i < values.length; i++) {
      if (values[i] === values[i + 1]) {
        values[i] *= 2;
        this.score += values[i];
        values.splice(i + 1, 1);
      }
    }

    return values;
  }

  generateCube() {
    const tbody = document.querySelector('tbody');
    const rows = tbody.querySelectorAll('tr');

    const randomRowIndex = Math.floor(Math.random() * rows.length);
    const randomRow = rows[randomRowIndex];

    const columns = randomRow.querySelectorAll('td');

    const randomColumnIndex = Math.floor(Math.random() * columns.length);
    const randomColumn = columns[randomColumnIndex];

    if (randomColumn.textContent.trim() !== '') {
      this.generateCube();

      return;
    }

    const value = Math.random() < 0.9 ? 2 : 4;

    // Add your own methods here
    randomColumn.classList.add(`field-cell--${value}`);
    randomColumn.textContent = value;
  }

  canMerge(state) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = state[row][col];

        if (col < 3 && current === state[row][col + 1]) {
          return true;
        }

        if (row < 3 && current === state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  areStatesEqual(state1, state2) {
    for (let row = 0; row < state1.length; row++) {
      for (let col = 0; col < state1[row].length; col++) {
        if (state1[row][col] !== state2[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  markFirstMove() {
    if (!this.hasMovedOnce) {
      const mainButton = document.querySelector('.button');

      mainButton.classList.remove('start');
      mainButton.classList.add('restart');

      mainButton.textContent = 'Restart';
      this.hasMovedOnce = true;
    }
  }
}

module.exports = Game;
