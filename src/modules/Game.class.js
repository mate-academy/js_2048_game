'use strict';

const PLAYING_FIELD_SIZE = 4;

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  score = 0;
  playingField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  status = 'idle';
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
    this.playingField = initialState ?? this.playingField;
  }

  moveLeft() {
    for (let rowIndex = 0; rowIndex < PLAYING_FIELD_SIZE; rowIndex++) {
      const row = this.getRow(rowIndex);

      const compactRow = this.compactLine(row);

      this.setRow(rowIndex, compactRow);
    }

    this.updateStatus();
  }

  moveRight() {
    for (let rowIndex = 0; rowIndex < PLAYING_FIELD_SIZE; rowIndex++) {
      const row = this.getRow(rowIndex);

      const compactRow = this.compactLine(row.reverse()).reverse();

      this.setRow(rowIndex, compactRow);
    }

    this.updateStatus();
  }

  moveUp() {
    for (let columnIndex = 0; columnIndex < PLAYING_FIELD_SIZE; columnIndex++) {
      const column = this.getColumn(columnIndex);

      const compactColumn = this.compactLine(column);

      this.setColumn(columnIndex, compactColumn);
    }

    this.updateStatus();
  }

  moveDown() {
    for (let columnIndex = 0; columnIndex < PLAYING_FIELD_SIZE; columnIndex++) {
      const column = this.getColumn(columnIndex);

      const compactColumn = this.compactLine(column.reverse()).reverse();

      this.setColumn(columnIndex, compactColumn);
    }

    this.updateStatus();
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
    return this.playingField;
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
    this.score = 0;

    this.populateRandomly(2);
  }

  /**
   * Resets the game.
   */
  restart() {
    this.playingField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.start();
  }

  /**
   * Returns a column by index;
   * @param {number} index
   */
  getColumn(index) {
    const column = new Array(PLAYING_FIELD_SIZE);

    for (let row = 0; row < PLAYING_FIELD_SIZE; row++) {
      column[row] = this.playingField[row][index];
    }

    return column;
  }

  /**
   * Sets a column by index;
   * @param {number} index
   */
  setColumn(index, column) {
    for (let rowIndex = 0; rowIndex < PLAYING_FIELD_SIZE; rowIndex++) {
      this.playingField[rowIndex][index] = column[rowIndex];
    }
  }

  /**
   * Returns a row by index;
   * @param {number} index
   */
  getRow(index) {
    return [...this.playingField[index]];
  }

  /**
   * Sets a row by index;
   * @param {number} index
   */
  setRow(index, row) {
    this.playingField[index] = row;
  }

  getCells() {
    const cells = this.playingField.reduce((acc, row) => [...acc, ...row], []);

    return cells;
  }

  getIndexedCells() {
    function getIndexedRow(row, rowIndex) {
      const indexedRow = row.map((value, columnIndex) => ({
        row: rowIndex,
        column: columnIndex,
        value,
      }));

      return indexedRow;
    }

    const indexedCells = this.playingField.reduce(
      (acc, row, rowIndex) => [...acc, ...getIndexedRow(row, rowIndex)],
      [],
    );

    return indexedCells;
  }

  getCell(row, column) {
    return this.playingField[row][column];
  }

  setCell(row, column, value) {
    this.playingField[row][column] = value;
  }

  populateRandomly(count) {
    let j = 0;

    for (let i = 0; i < count; i++) {
      if (j >= 100) {
        break;
      }

      const row = Math.floor(Math.random() * PLAYING_FIELD_SIZE);
      const column = Math.floor(Math.random() * PLAYING_FIELD_SIZE);

      if (this.getCell(row, column) !== 0) {
        i--;
      } else {
        const t = Math.random();

        if (t > 0.9) {
          this.setCell(row, column, 4);
        } else {
          this.setCell(row, column, 2);
        }
      }

      j++;
    }

    this.updateStatus();
  }

  /**
   * Takes the line of numbers and compacts it into a valid line
   * @param {number[]} line
   */
  compactLine(line) {
    const numbers = line.filter((item) => item !== 0);

    if (numbers.length < 2) {
      return this.padWithZeros(numbers);
    }

    const compactedNumbers = [];

    for (let i = 0; i < numbers.length; i++) {
      const current = numbers[i];
      const next = numbers[i + 1];

      if (current === next) {
        compactedNumbers.push(current * 2);
        this.score += current * 2; // TODO: burn it with fire
        i++;
      } else {
        compactedNumbers.push(current);
      }
    }

    return this.padWithZeros(compactedNumbers);
  }

  padWithZeros(line) {
    while (line.length < PLAYING_FIELD_SIZE) {
      line.push(0);
    }

    return line;
  }

  updateStatus() {
    function winCondition(cells) {
      return cells.some((cell) => cell === 2048);
    }

    function loseCondition(cells) {
      // of some zeros are present, moves are possible
      if (cells.some((cell) => cell === 0)) {
        return false;
      }

      // else check value pairs to check if any move is possible
      for (let row = 0; row < PLAYING_FIELD_SIZE; row++) {
        for (let column = 0; column < PLAYING_FIELD_SIZE - 1; column++) {
          const current = cells[row * PLAYING_FIELD_SIZE + column];
          const next = cells[row * PLAYING_FIELD_SIZE + (column + 1)];

          if (current === next) {
            return false;
          }
        }
      }

      for (let row = 0; row < PLAYING_FIELD_SIZE - 1; row++) {
        for (let column = 0; column < PLAYING_FIELD_SIZE; column++) {
          const current = cells[row * PLAYING_FIELD_SIZE + column];
          const next = cells[(row + 1) * PLAYING_FIELD_SIZE + column];

          if (current === next) {
            return false;
          }
        }
      }

      return true;
    }

    const cells = this.getCells();

    if (winCondition(cells)) {
      this.status = 'win';
    } else if (loseCondition(cells)) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
