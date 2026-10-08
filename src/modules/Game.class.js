/* eslint-disable function-paren-newline */
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
    this.status = 'idle';
    this.size = 4;
    this.score = 0;

    this.gameField = initialState
      ? initialState.map((arr) => arr.map((num) => num))
      : Array.from({ length: this.size }, () => Array(this.size).fill(0));
    this.initialField = this.gameField.map((arr) => arr.map((num) => num));
  }

  moveLeft() {
    if (this.status === 'playing') {
      const oldGameFieldCoppy = this.gameField.map((arr) =>
        arr.map((num) => num),
      );

      this.gameField = this.gameField.map((arr) => this.moveRowLeft(arr));

      const fieldState = this.isFieldChanged(this.gameField, oldGameFieldCoppy);

      if (fieldState) {
        this.addRandomTile();
      }

      return this.gameField;
    }
  }
  moveRight() {
    if (this.status === 'playing') {
      const oldGameFieldCoppy = this.gameField.map((arr) =>
        arr.map((num) => num),
      );

      this.gameField = this.gameField.map((arr) =>
        this.moveRowLeft([...arr].reverse()).reverse(),
      );

      const fieldState = this.isFieldChanged(this.gameField, oldGameFieldCoppy);

      if (fieldState) {
        this.addRandomTile();
      }

      return this.gameField;
    }
  }
  moveUp() {
    if (this.status === 'playing') {
      const oldGameFieldCoppy = this.gameField.map((arr) =>
        arr.map((num) => num),
      );

      const transposed = this.transpose(this.gameField);
      const calculated = transposed.map((arr) => this.moveRowLeft(arr));

      this.gameField = this.transpose(calculated);

      const fieldState = this.isFieldChanged(this.gameField, oldGameFieldCoppy);

      if (fieldState) {
        this.addRandomTile();
      }

      return this.gameField;
    }
  }
  moveDown() {
    if (this.status === 'playing') {
      const oldGameFieldCoppy = this.gameField.map((arr) =>
        arr.map((num) => num),
      );

      const transposed = this.transpose(this.gameField);
      const calculated = transposed.map((arr) =>
        this.moveRowLeft([...arr].reverse()).reverse(),
      );

      this.gameField = this.transpose(calculated);

      const fieldState = this.isFieldChanged(this.gameField, oldGameFieldCoppy);

      if (fieldState) {
        this.addRandomTile();
      }

      return this.gameField;
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
    return [...this.gameField];
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
    if (this.status === 'idle') {
      return this.status;
    }

    if (this.gameField.flat().includes(2048)) {
      this.status = 'win';

      return this.status;
    }

    if (this.gameField.flat().includes(0)) {
      this.status = 'playing';

      return this.status;
    }

    for (let row = 0; row < this.gameField.length; row++) {
      for (let col = 0; col < this.gameField[row].length; col++) {
        const current = this.gameField[row][col];
        const bottom = this.gameField[row + 1]?.[col];
        const right = this.gameField[row][col + 1];

        if (current === bottom || current === right) {
          this.status = 'playing';

          return this.status;
        }
      }
    }

    this.status = 'lose';

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.score = 0;
    this.gameField = this.initialField.map((arr) => arr.map((value) => value));

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'idle';
    this.gameField = this.initialField.map((arr) => arr.map((value) => value));
  }

  // Add your own methods here

  transpose(matrix) {
    const result = [];

    for (let row = 0; row < matrix.length; row++) {
      const inner = [];

      for (let col = 0; col < matrix[row].length; col++) {
        inner.push(matrix[col][row]);
      }
      result.push(inner);
    }

    return result;
  }

  moveRowLeft(row) {
    const clearRow = row.filter((value) => value !== 0 && value !== null);
    const result = [];

    for (let num = 0; num < clearRow.length; num++) {
      if (clearRow[num] === clearRow[num + 1]) {
        result.push(clearRow[num] + clearRow[num + 1]);
        this.score += clearRow[num] + clearRow[num + 1];
        num++;
      } else {
        result.push(clearRow[num]);
      }
    }

    while (result.length !== row.length) {
      result.push(0);
    }

    return result;
  }

  findZero(matrix) {
    const tempArr = [];

    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] === 0) {
          tempArr.push({
            row,
            col,
          });
        }
      }
    }

    return tempArr;
  }

  findRandomIndex(num) {
    const result = Math.floor(Math.random() * num);

    return result;
  }

  isFieldChanged(newGameField, oldGameField) {
    const oldField = oldGameField.flat();
    const newField = newGameField.flat();

    const result = oldField.some((num, index) => num !== newField[index]);

    return result;
  }

  getRandomNumber() {
    const randomNumber = Math.random();

    if (randomNumber < 0.9) {
      return 2;
    } else {
      return 4;
    }
  }

  addRandomTile() {
    const arrOfEmptyCells = this.findZero(this.gameField);
    const arrLength = arrOfEmptyCells.length;

    if (arrLength === 0) {
      return;
    }

    const randomIndex = this.findRandomIndex(arrLength);
    const objOfCoordinates = arrOfEmptyCells[randomIndex];

    const row = objOfCoordinates.row;
    const col = objOfCoordinates.col;

    this.gameField[row][col] = this.getRandomNumber();

    return this.gameField;
  }
}

module.exports = Game;
