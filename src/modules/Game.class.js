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
  ) {
    this.initialState = initialState.map((row) => [...row]);
    this.field = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.move(() => {
      this.field = this.field.map((row) => this.mergeRowLeft(row));
    });
  }

  moveRight() {
    this.move(() => {
      this.field = this.field.map((row) => this.mergeRowRight(row));
    });
  }

  moveUp() {
    this.move(() => {
      for (let col = 0; col < this.field[0].length; col++) {
        const column = this.getColumn(col);

        const newColumn = this.mergeRowLeft(column);

        this.setColumn(col, newColumn);
      }
    });
  }

  moveDown() {
    this.move(() => {
      for (let col = 0; col < this.field[0].length; col++) {
        const column = this.getColumn(col);

        const newColumn = this.mergeRowRight(column);

        this.setColumn(col, newColumn);
      }
    });
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
    return this.field;
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
    this.addRandomTile();
    this.addRandomTile();

    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.field = this.initialState.map((row) => [...row]);

    this.score = 0;

    this.start();
  }

  // Add your own methods here

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.field.length; row++) {
      for (let col = 0; col < this.field[row].length; col++) {
        if (this.field[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomCellIndex = Math.floor(Math.random() * emptyCells.length);

    const randomNumber = Math.random() < 0.9 ? 2 : 4;

    const { row: randomCellRow, col: randomCellCol } =
      emptyCells[randomCellIndex];

    this.field[randomCellRow][randomCellCol] = randomNumber;
  }

  mergeRowLeft(row) {
    const filteredRow = row.filter((number) => number !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] !== 0 && filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        filteredRow[i + 1] = 0;
        this.score += filteredRow[i];
      }
    }

    const finalFilter = filteredRow.filter((number) => number !== 0);

    while (finalFilter.length < row.length) {
      finalFilter.push(0);
    }

    return finalFilter;
  }

  mergeRowRight(row) {
    const reversedRow = row.toReversed();

    const mergedRow = this.mergeRowLeft(reversedRow);

    return mergedRow.reverse();
  }

  move(moveFunction) {
    if (this.status !== 'playing') {
      return;
    }

    const oldField = this.field.map((row) => [...row]);

    moveFunction();

    if (this.field.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    const hasChange = oldField.some(
      (oldRow, rowIndex) =>
        oldRow.some(
          (value, colIndex) => value !== this.field[rowIndex][colIndex],
        ),
      // eslint-disable-next-line function-paren-newline
    );

    if (hasChange) {
      this.addRandomTile();
    }

    if (this.checkLose()) {
      this.status = 'lose';
    }
  }

  getColumn(colIndex) {
    return this.field.map((row) => row[colIndex]);
  }

  setColumn(colIndex, newColumn) {
    this.field.forEach((row, index) => (row[colIndex] = newColumn[index]));
  }

  checkLose() {
    if (this.field.some((row) => row.includes(0))) {
      return false;
    }

    for (let row = 0; row < this.field.length; row++) {
      for (let col = 0; col < this.field[row].length; col++) {
        if (
          col + 1 < this.field[row].length &&
          this.field[row][col] === this.field[row][col + 1]
        ) {
          return false;
        }

        if (
          row + 1 < this.field.length &&
          this.field[row][col] === this.field[row + 1][col]
        ) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
