/* eslint-disable function-paren-newline */
/* eslint-disable prefer-const */
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
  initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
   */
  // TODO: Замінити по індексу числа
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.score = 0;
  }

  moveLeft() {
    for (const row of this.initialState) {
      let numbers = row.filter((num) => num !== 0);

      for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] === numbers[i + 1]) {
          if (numbers[i] < 256) {
            numbers[i] *= 2;
          } else {
            numbers[i] += numbers[i];
          }
          numbers[i + 1] = 0;
        }
      }

      numbers = numbers.filter((num) => num !== 0);

      const newRow = numbers.concat(Array(row.length - numbers.length).fill(0));

      row.length = 0;
      row.push(...newRow);
    }

    this.addRandomOneNumber();
    this.addScore(10);
  }

  moveRight() {
    for (const row of this.initialState) {
      let numbers = row.filter((num) => num !== 0);

      for (let i = numbers.length - 1; i > 0; i--) {
        if (numbers[i] === numbers[i - 1]) {
          if (numbers[i] < 256) {
            numbers[i] *= 2;
          } else {
            numbers[i] += numbers[i];
          }
          numbers[i - 1] = 0;
        }
      }

      numbers = numbers.filter((num) => num !== 0);

      const newRow = Array(row.length - numbers.length)
        .fill(0)
        .concat(numbers);

      row.length = 0;
      row.push(...newRow);
    }
    this.addRandomOneNumber();
    this.addScore(10);
  }

  moveUp() {
    for (let col = 0; col < this.initialState[0].length; col++) {
      let column = this.initialState
        .map((row) => row[col])
        .filter((num) => num !== 0);

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          if (column[i] < 256) {
            column[i] *= 2;
          } else {
            column[i] += column[i];
          }
          column[i + 1] = 0;
        }
      }

      column = column.filter((num) => num !== 0);

      const newColumn = column.concat(
        Array(this.initialState.length - column.length).fill(0),
      );

      for (let row = 0; row < this.initialState.length; row++) {
        this.initialState[row][col] = newColumn[row];
      }
    }

    this.addRandomOneNumber();
    this.addScore(10);
  }

  moveDown() {
    for (let col = 0; col < this.initialState[0].length; col++) {
      let column = this.initialState
        .map((row) => row[col])
        .filter((num) => num !== 0);

      for (let i = column.length - 1; i > 0; i--) {
        if (column[i] === column[i - 1]) {
          if (column[i] < 256) {
            column[i] *= 2;
          } else {
            column[i] += column[i];
          }
          column[i - 1] = 0;
        }
      }

      column = column.filter((num) => num !== 0);

      const newColumn = Array(this.initialState.length - column.length)
        .fill(0)
        .concat(column);

      for (let row = 0; row < this.initialState.length; row++) {
        this.initialState[row][col] = newColumn[row];
      }
    }

    this.addRandomOneNumber();
    this.addScore(10);
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  addScore(points) {
    this.score += points;
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
    const isWin = this.initialState.some((row) => row.includes(2048));

    if (isWin) {
      const getWinDiv = document.querySelector('.message.message-win.hidden');

      if (getWinDiv) {
        getWinDiv.classList.remove('hidden');
        getWinDiv.textContent = 'You winner';
        document.body.append(getWinDiv);
      }
    }

    const isLose = this.checkLose();

    const loseDiv = document.querySelector('.message.message-lose.hidden');

    if (isLose === 'Lose') {
      if (loseDiv) {
        loseDiv.classList.remove('hidden'); // Робимо видимим
        loseDiv.textContent = 'You lose';
      }
    } else if (loseDiv) {
      loseDiv.classList.add('hidden'); // Ховаємо, якщо програшу немає
    }
  }

  restart() {
    this.resetArrayToZero(this.initialState);

    this.state = [...this.initialState];

    this.addRandomNumber();
  }

  /**
   * Starts the game.
   */
  start() {
    this.state = [...this.initialState];
    this.addRandomNumber();
  }

  checkLose() {
    const isFull = this.initialState.every((row) =>
      // eslint-disable-next-line prettier/prettier
      row.every((cell) => cell !== 0));

    if (!isFull) {
      return 'Continue';
    }

    const hasMove = this.initialState.some((row, i) =>
      row.some((cell, j) => this.canMerge(i, j)),
    );

    return hasMove ? 'Continue' : 'Lose';
  }

  canMerge(row, col) {
    const cell = this.initialState[row][col];

    return (
      (row > 0 && this.initialState[row - 1][col] === cell) ||
      (row < this.initialState.length - 1 &&
        this.initialState[row + 1][col] === cell) ||
      (col > 0 && this.initialState[row][col - 1] === cell) ||
      (col < this.initialState[row].length - 1 &&
        this.initialState[row][col + 1] === cell)
    );
  }

  addRandomNumber() {
    let emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ rowIndex, colIndex });
        }
      });
    });

    for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { rowIndex, colIndex } = emptyCells[randomIndex];

      this.state[rowIndex][colIndex] = 2;
      emptyCells.splice(randomIndex, 1);
    }
  }

  addRandomOneNumber() {
    let emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ rowIndex, colIndex });
        }
      });
    });

    for (let i = 0; i < 1; i++) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { rowIndex, colIndex } = emptyCells[randomIndex];

      this.state[rowIndex][colIndex] = 2;
      emptyCells.splice(randomIndex, 1);
    }
  }

  resetArrayToZero(arr) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        arr[i][j] = 0;
      }
    }
  }
  /**
   * Resets the game.
   */

  // Add your own methods here
}

module.exports = Game;
