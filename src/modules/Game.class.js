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

    this.initialState = initialState;
    this.size = 4; // field size 4x4
    this.score = 0;
    this.status = 'idle'; // idle | playing | win | lose

    this.scoreElement = document.getElementsByClassName('game-score')[0];

    this.startMessageElement =
      document.getElementsByClassName('message-start')[0];

    this.loseMessageElement =
      document.getElementsByClassName('message-lose')[0];

    this.winMessageElement = document.getElementsByClassName('message-win')[0];

    this.button = document.getElementsByClassName('button')[0];
    this.table = document.getElementsByClassName('game-field')[0];

    this.board =
      initialState ||
      Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  moveLeft() {
    const state = this.getState();
    let moved = false;
    let pointsEarned = 0;

    for (let row = 0; row < this.size; row++) {
      let currentRow = state[row].filter((val) => val !== 0);

      for (let col = 0; col < currentRow.length - 1; col++) {
        if (currentRow[col] === currentRow[col + 1]) {
          currentRow[col] *= 2;
          pointsEarned += currentRow[col];
          currentRow[col + 1] = 0;
          col++;
        }
      }

      currentRow = currentRow.filter((val) => val !== 0);

      while (currentRow.length < this.size) {
        currentRow.push(0);
      }

      if (state[row].toString() !== currentRow.toString()) {
        moved = true;
      }

      state[row] = currentRow;
    }

    if (moved) {
      this.score += pointsEarned;
      this.scoreElement.innerHTML = this.score;

      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          const cell = this.table.rows[row].cells[col];
          const value = state[row][col];

          cell.innerHTML = value === 0 ? '' : value;
          this.changeTitleColor(cell, value);
        }
      }

      this.addRandomCell();
      this.checkLoseCondition();
      this.checkWinCondition();
    }
  }

  moveRight() {
    const state = this.getState();
    let moved = false;
    let pointsEarned = 0;

    for (let row = 0; row < this.size; row++) {
      let currentRow = state[row].filter((val) => val !== 0);

      currentRow.reverse();

      for (let col = 0; col < currentRow.length - 1; col++) {
        if (currentRow[col] === currentRow[col + 1]) {
          currentRow[col] *= 2;
          pointsEarned += currentRow[col];
          currentRow[col + 1] = 0;
          col++;
        }
      }

      currentRow = currentRow.filter((val) => val !== 0);

      while (currentRow.length < this.size) {
        currentRow.push(0);
      }

      currentRow.reverse();

      if (state[row].toString() !== currentRow.toString()) {
        moved = true;
      }

      state[row] = currentRow;
    }

    if (moved) {
      this.score += pointsEarned;
      this.scoreElement.innerHTML = this.score;

      for (let r = 0; r < this.size; r++) {
        for (let c = 0; c < this.size; c++) {
          const cell = this.table.rows[r].cells[c];
          const value = state[r][c];

          cell.innerHTML = value === 0 ? '' : value;
          this.changeTitleColor(cell, value);
        }
      }

      this.addRandomCell();
      this.checkLoseCondition();
      this.checkWinCondition();
    }
  }
  moveUp() {
    const state = this.getState();
    let moved = false;
    let pointsEarned = 0;

    for (let col = 0; col < this.size; col++) {
      let currentCol = state.map((row) => row[col]).filter((val) => val !== 0);

      for (let row = 0; row < currentCol.length; row++) {
        if (currentCol[row] === currentCol[row + 1]) {
          currentCol[row] *= 2;
          pointsEarned += currentCol[row];
          currentCol[row + 1] = 0;
          row++;
        }
      }

      currentCol = currentCol.filter((val) => val !== 0);

      while (currentCol.length < this.size) {
        currentCol.push(0);
      }

      if (state.map((row) => row[col]).toString() !== currentCol.toString()) {
        moved = true;
      }

      for (let row = 0; row < currentCol.length; row++) {
        state[row][col] = currentCol[row];
      }
    }

    if (moved) {
      this.score += pointsEarned;
      this.scoreElement.innerHTML = this.score;

      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          const cell = this.table.rows[row].cells[col];
          const value = state[row][col];

          cell.innerHTML = value === 0 ? '' : value;
          this.changeTitleColor(cell, value);
        }
      }

      this.addRandomCell();
      this.checkLoseCondition();
      this.checkWinCondition();
    }
  }
  moveDown() {
    const state = this.getState();
    let moved = false;
    let pointsEarned = 0;

    for (let col = 0; col < this.size; col++) {
      let currentCol = state.map((row) => row[col]).filter((val) => val !== 0);

      currentCol.reverse();

      for (let row = 0; row < currentCol.length; row++) {
        if (currentCol[row] === currentCol[row + 1]) {
          currentCol[row] *= 2;
          pointsEarned += currentCol[row];
          currentCol[row + 1] = 0;
          row++;
        }
      }

      currentCol = currentCol.filter((val) => val !== 0);

      while (currentCol.length < this.size) {
        currentCol.push(0);
      }

      currentCol.reverse();

      if (state.map((row) => row[col]).toString() !== currentCol.toString()) {
        moved = true;
      }

      for (let row = 0; row < currentCol.length; row++) {
        state[row][col] = currentCol[row];
      }
    }

    if (moved) {
      this.score += pointsEarned;
      this.scoreElement.innerHTML = this.score;

      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          const cell = this.table.rows[row].cells[col];
          const value = state[row][col];

          cell.innerHTML = value === 0 ? '' : value;
          this.changeTitleColor(cell, value);
        }
      }

      this.addRandomCell();
      this.checkLoseCondition();
      this.checkWinCondition();
    }
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
    const state = [];

    for (let row = 0; row < this.size; row++) {
      const currentRow = [];

      for (let col = 0; col < this.size; col++) {
        const value = this.table.rows[row].cells[col].innerHTML;

        currentRow.push(value === '' ? 0 : parseInt(value));
      }
      state.push(currentRow);
    }

    return state;
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
    this.status = 'playing';
    this.button.innerHTML = 'Restart';
    this.button.style.fontSize = '18px';
    this.button.classList.replace('start', 'restart');
    this.startMessageElement.classList.add('hidden');

    if (this.initialState) {
      // start from initial state if available
      for (let row = 0; row < this.size; row++) {
        for (let col = 0; col < this.size; col++) {
          const value = this.initialState[row][col];
          const cell = this.table.rows[row].cells[col];

          cell.innerHTML = value === 0 ? '' : value;
          this.changeTitleColor(cell, value);
        }
      }
    } else {
      // add two random cells
      this.addRandomCell();
      this.addRandomCell();
    }

    this.getScore();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'idle';
    this.button.innerHTML = 'Start';
    this.button.style.fontSize = '20px';

    this.button.classList.replace('restart', 'start');

    this.startMessageElement.classList.remove('hidden');

    this.loseMessageElement.classList.add('hidden');
    this.winMessageElement.classList.add('hidden');

    for (let i = 0; i < this.table.rows.length; i++) {
      const row = this.table.rows[i];

      for (let j = 0; j < row.cells.length; j++) {
        const cell = row.cells[j];

        // Clear sell
        cell.innerHTML = '';
        cell.className = 'field-cell';
      }
    }
    this.scoreElement.innerHTML = this.getScore();
  }

  addRandomCell() {
    const emptyCells = [];

    // Geather empty cells
    for (let row = 0; row < this.size; row++) {
      for (let column = 0; column < this.size; column++) {
        if (this.table.rows[row].cells[column].innerHTML === '') {
          emptyCells.push({ r: row, c: column });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    // random cell
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { r, c } = emptyCells[randomIndex];

    // 90% - 2, 10% - 4
    const randomNumber = Math.random() < 0.1 ? 4 : 2;

    this.table.rows[r].cells[c].innerHTML = randomNumber;

    this.changeTitleColor(this.table.rows[r].cells[c], randomNumber);
  }

  changeTitleColor(cell, number) {
    cell.className = 'field-cell';
    cell.classList.add(`field-cell--${number}`);
  }

  checkLoseCondition() {
    const state = this.getState();

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (state[row][col] === 0) {
          return;
        }

        if (
          (col < this.size - 1 && state[row][col] === state[row][col + 1]) ||
          (row < this.size - 1 && state[row][col] === state[row + 1][col]) ||
          (col > 0 && state[row][col] === state[row][col - 1]) ||
          (row > 0 && state[row][col] === state[row - 1][col])
        ) {
          return;
        }
      }
    }

    this.loseMessageElement.classList.remove('hidden');
    this.status = 'lose';
  }

  checkWinCondition() {
    const state = this.getState();

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (state[row][col] === 2048) {
          this.winMessageElement.classList.remove('hidden');
          this.status = 'win';
        }
      }
    }
  }
}

module.exports = Game;
