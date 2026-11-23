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
    this.state = initialState;

    if (!initialState) {
      this.state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
    this.initialState = this.state.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const stateBeforeMove = this.state.map((row) => [...row]);

    this.state = this.state.map((row) => this.moveLineLeft(row));

    let hasChange = false;

    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (stateBeforeMove[row][col] !== this.state[row][col]) {
          hasChange = true;
        }
      }
    }

    if (hasChange) {
      this.addRandomTile();
      this.updateStatus();
    }
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const stateBeforeMove = this.state.map((row) => [...row]);

    this.state = this.state.map((row) => this.moveLineRight(row));

    let hasChange = false;

    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (stateBeforeMove[row][col] !== this.state[row][col]) {
          hasChange = true;
        }
      }
    }

    if (hasChange) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const stateBeforeMove = this.state.map((row) => [...row]);

    for (let col = 0; col < this.state[0].length; col++) {
      const movedColumn = this.moveLineUp(col);

      for (let row = 0; row < this.state.length; row++) {
        this.state[row][col] = movedColumn[row];
      }
    }

    let hasChange = false;

    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (stateBeforeMove[row][col] !== this.state[row][col]) {
          hasChange = true;
        }
      }
    }

    if (hasChange) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const stateBeforeMove = this.state.map((row) => [...row]);

    for (let col = 0; col < this.state[0].length; col++) {
      const movedColumn = this.moveLineDown(col);

      for (let row = 0; row < this.state.length; row++) {
        this.state[row][col] = movedColumn[row];
      }
    }

    let hasChange = false;

    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (stateBeforeMove[row][col] !== this.state[row][col]) {
          hasChange = true;
        }
      }
    }

    if (hasChange) {
      this.addRandomTile();
      this.updateStatus();
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  addRandomTile() {
    const emptyCells = [];

    for (let randomRow = 0; randomRow < this.state.length; randomRow++) {
      for (
        let randomCol = 0;
        randomCol < this.state[randomRow].length;
        randomCol++
      ) {
        if (this.state[randomRow][randomCol] === 0) {
          emptyCells.push([randomRow, randomCol]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    const row = randomCell[0];
    const col = randomCell[1];

    let newNumber = 2;

    if (Math.random() < 0.1) {
      newNumber = 4;
    }

    this.state[row][col] = newNumber;
  }

  moveLineLeft(row) {
    const numbers = [];

    for (const number of row) {
      if (number !== 0) {
        numbers.push(number);
      }
    }

    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i] === numbers[i + 1]) {
        numbers[i] = numbers[i] * 2;
        this.score += numbers[i];
        numbers.splice(i + 1, 1);
      }
    }

    while (numbers.length < row.length) {
      numbers.push(0);
    }

    return numbers;
  }

  moveLineRight(row) {
    const numbers = [];

    for (const number of row) {
      if (number !== 0) {
        numbers.push(number);
      }
    }

    for (let i = numbers.length - 1; i > 0; i--) {
      if (numbers[i] === numbers[i - 1]) {
        numbers[i] = numbers[i] * 2;
        this.score += numbers[i];
        numbers.splice(i - 1, 1);
        i--;
      }
    }

    while (numbers.length < row.length) {
      numbers.unshift(0);
    }

    return numbers;
  }

  moveLineUp(col) {
    const numbers = [];

    for (let row = 0; row < this.state.length; row++) {
      if (this.state[row][col] !== 0) {
        numbers.push(this.state[row][col]);
      }
    }

    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i] === numbers[i + 1]) {
        numbers[i] = numbers[i] * 2;
        this.score += numbers[i];
        numbers.splice(i + 1, 1);
      }
    }

    while (numbers.length < this.state.length) {
      numbers.push(0);
    }

    return numbers;
  }

  moveLineDown(col) {
    const numbers = [];

    for (let row = this.state.length - 1; row >= 0; row--) {
      if (this.state[row][col] !== 0) {
        numbers.push(this.state[row][col]);
      }
    }

    for (let i = 0; i < numbers.length - 1; i++) {
      if (numbers[i] === numbers[i + 1]) {
        numbers[i] = numbers[i] * 2;
        this.score += numbers[i];
        numbers.splice(i + 1, 1);
      }
    }

    while (numbers.length < this.state.length) {
      numbers.push(0);
    }

    return numbers.reverse();
  }

  updateStatus() {
    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    this.updateLoseStatus();
  }

  updateLoseStatus() {
    let hasEmptyCell = false;

    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] === 0) {
          hasEmptyCell = true;
          break;
        }
      }
    }

    if (!hasEmptyCell) {
      let canMove = false;

      for (let row = 0; row < this.state.length; row++) {
        for (let col = 0; col < this.state[row].length; col++) {
          const currentValue = this.state[row][col];

          if (
            (row > 0 && this.state[row - 1][col] === currentValue) ||
            (row < this.state.length - 1 &&
              this.state[row + 1][col] === currentValue) ||
            (col > 0 && this.state[row][col - 1] === currentValue) ||
            (col < this.state[row].length - 1 &&
              this.state[row][col + 1] === currentValue)
          ) {
            canMove = true;
            break;
          }
        }
      }

      if (!canMove) {
        this.status = 'lose';
      }
    }
  }
}

module.exports = Game;
