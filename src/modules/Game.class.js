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

    this.#gameState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initiationValues = [
      [...this.#gameState[0]],
      [...this.#gameState[1]],
      [...this.#gameState[2]],
      [...this.#gameState[3]],
    ];
  }
  #gameState;
  #score = 0;
  #gameStatus = 'idle';

  moveLeft() {
    if (this.#gameStatus === 'playing') {
      let change = false;

      this.#gameState.forEach((row) => {
        let space;
        let num;

        row.forEach((cell, i) => {
          if (cell === 0 && space === undefined) {
            space = i;
          } else if (cell > 0) {
            if (row[num] === cell) {
              row[num] = cell * 2;
              this.#score += cell * 2;
              this.checkViktory(cell * 2);
              row[i] = 0;
              space = num + 1;
              num = undefined;
              change = true;
            } else if (space !== undefined) {
              row[space] = cell;
              row[i] = 0;
              num = space;
              space = space + 1;
              change = true;
            } else {
              num = i;
            }
          }
        });
      });

      // eslint-disable-next-line curly
      if (change) this.getRandomCell();
      this.checkLose();
    }
  }
  moveRight() {
    if (this.#gameStatus === 'playing') {
      let change = false;

      this.#gameState.forEach((row) => {
        let space;
        let num;

        for (let i = row.length; i >= 0; i--) {
          if (row[i] === 0 && space === undefined) {
            space = i;
          } else if (row[i] > 0) {
            if (row[num] === row[i]) {
              row[num] = row[i] * 2;
              this.#score += row[i] * 2;
              this.checkViktory(row[i] * 2);
              row[i] = 0;
              space = num - 1;
              num = undefined;
              change = true;
            } else if (space !== undefined) {
              row[space] = row[i];
              row[i] = 0;
              num = space;
              space = space - 1;
              change = true;
            } else {
              num = i;
            }
          }
        }
      });

      // eslint-disable-next-line curly
      if (change) this.getRandomCell();
      this.checkLose();
    }
  }
  moveUp() {
    if (this.#gameStatus === 'playing') {
      let change = false;

      const table = this.#gameState;

      for (let i = 0; i < table[0].length; i++) {
        let space;
        let num;
        const column = i;

        for (let j = 0; j < table.length; j++) {
          const currentRow = table[j];
          const spaceRow = table[space];
          const numRow = table[num];

          if (currentRow[column] === 0 && space === undefined) {
            space = j;
          } else if (currentRow[column] > 0) {
            if (numRow !== undefined && numRow[column] === currentRow[column]) {
              numRow[column] = currentRow[column] * 2;
              this.#score += currentRow[column] * 2;
              this.checkViktory(currentRow[column] * 2);
              currentRow[column] = 0;
              space = num + 1;
              num = undefined;
              change = true;
            } else if (space !== undefined) {
              spaceRow[column] = currentRow[column];
              currentRow[column] = 0;
              num = space;
              space = space + 1;
              change = true;
            } else {
              num = j;
            }
          }
        }
      }

      // eslint-disable-next-line curly
      if (change) this.getRandomCell();
      this.checkLose();
    }
  }
  moveDown() {
    if (this.#gameStatus === 'playing') {
      let change = false;

      const table = this.#gameState;

      for (let i = 0; i < table[0].length; i++) {
        let space;
        let num;
        const column = i;

        for (let j = table.length - 1; j >= 0; j--) {
          const currentRow = table[j];
          const spaceRow = table[space];
          const numRow = table[num];

          if (currentRow[column] === 0 && space === undefined) {
            space = j;
          } else if (currentRow[column] > 0) {
            if (numRow !== undefined && numRow[column] === currentRow[column]) {
              numRow[column] = currentRow[column] * 2;
              this.#score += currentRow[column] * 2;
              this.checkViktory(currentRow[column] * 2);
              currentRow[column] = 0;
              space = num - 1;
              num = undefined;
              change = true;
            } else if (space !== undefined) {
              spaceRow[column] = currentRow[column];
              currentRow[column] = 0;
              num = space;
              space = space - 1;
              change = true;
            } else {
              num = j;
            }
          }
        }
      }

      // eslint-disable-next-line curly
      if (change) this.getRandomCell();
      this.checkLose();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.#score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.#gameState;
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
    return this.#gameStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    this.getRandomCell();
    this.getRandomCell();
    this.#gameStatus = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.#score = 0;
    this.#gameStatus = 'idle';

    this.#gameState = [
      [...this.initiationValues[0]],
      [...this.initiationValues[1]],
      [...this.initiationValues[2]],
      [...this.initiationValues[3]],
    ];
  }

  getRandomNumber(minNumber, maxNumber) {
    const max = Math.floor(maxNumber);
    const min = Math.ceil(minNumber);

    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getRandomCell() {
    const row = this.#gameState[this.getRandomNumber(0, 3)];
    const cell = this.getRandomNumber(0, 3);

    if (row[cell] === 0) {
      row[cell] = Math.random() < 0.1 ? 4 : 2;
    } else {
      this.getRandomCell();
    }
  }

  modifyPage(table, valueForTable) {
    valueForTable.forEach((row, i) => {
      const tableRow = table.rows[i];

      row.forEach((value, index) => {
        if (value === 0) {
          const cell = tableRow.cells[index];

          cell.innerText = '';
          cell.className = 'field-cell';
        } else if (value > 0) {
          const cell = tableRow.cells[index];

          cell.innerText = value;
          cell.className = `field-cell field-cell--${value}`;
        }
      });
    });
  }

  checkViktory(value) {
    if (value === 2048) {
      this.#gameStatus = 'win';
    }
  }

  checkLose() {
    let possibleMoving = false;

    for (let i = 0; i < this.#gameState.length; i++) {
      for (let j = 1; j < this.#gameState.length; j++) {
        const row = this.#gameState[i];

        if (row[j] === row[j - 1]) {
          possibleMoving = true;
          break;
        } else if (row[j] === 0 || row[j - 1] === 0) {
          possibleMoving = true;
          break;
        }
      }

      for (let j = 1; j < this.#gameState.length; j++) {
        const previousRow = this.#gameState[j - 1];
        const currentRow = this.#gameState[j];

        if (currentRow[i] === previousRow[i]) {
          possibleMoving = true;
          break;
        } else if (currentRow[i] === 0 || previousRow[i] === 0) {
          possibleMoving = true;
          break;
        }
      }
    }

    if (!possibleMoving) {
      this.#gameStatus = 'lose';
    }
  }
}

module.exports = Game;
