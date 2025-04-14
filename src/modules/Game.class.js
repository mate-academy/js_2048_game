'use strict';

class Game {
  static const = Object.freeze({
    PLAYING_FIELD_SIZE: 4,
    STATUS_IDLE: 'idle',
    STATUS_PLAYING: 'playing',
    STATUS_WIN: 'win',
    STATUS_LOSE: 'lose',
  });

  score = 0;
  playingField = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  status = Game.const.STATUS_IDLE;

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
    if (initialState) {
      for (let row = 0; row < Game.const.PLAYING_FIELD_SIZE; row++) {
        for (let column = 0; column < Game.const.PLAYING_FIELD_SIZE; column++) {
          this.initialState[row][column] = initialState[row][column];
          this.playingField[row][column] = initialState[row][column];
        }
      }
    }
  }

  /**
   * Moves all cells left and compacts them,
   * then updates the score and game status.
   */
  moveLeft() {
    if (this.getStatus() !== Game.const.STATUS_PLAYING) {
      return;
    }

    let isTrivial = true;

    for (
      let rowIndex = 0;
      rowIndex < Game.const.PLAYING_FIELD_SIZE;
      rowIndex++
    ) {
      const row = this.getRow(rowIndex);

      const compactionResult = this.compactLine(row);

      if (!this.areLinesEqual(row, compactionResult.compacted)) {
        isTrivial = false;

        this.setRow(rowIndex, compactionResult.compacted);
        this.score += compactionResult.score;
      }
    }

    if (!isTrivial) {
      this.populateRandomly(1);
      this.updateStatus();
    }
  }

  /**
   * Moves all cells right and compacts them,
   * then updates the score and game status.
   */
  moveRight() {
    if (this.getStatus() !== Game.const.STATUS_PLAYING) {
      return;
    }

    let isTrivial = true;

    for (
      let rowIndex = 0;
      rowIndex < Game.const.PLAYING_FIELD_SIZE;
      rowIndex++
    ) {
      const row = this.getRow(rowIndex);

      const compactionResult = this.compactLine(row.reverse());

      if (!this.areLinesEqual(row, compactionResult.compacted)) {
        isTrivial = false;

        this.setRow(rowIndex, compactionResult.compacted.reverse());
        this.score += compactionResult.score;
      }
    }

    if (!isTrivial) {
      this.populateRandomly(1);
      this.updateStatus();
    }
  }

  /**
   * Moves all cells up and compacts them,
   * then updates the score and game status.
   */
  moveUp() {
    if (this.getStatus() !== Game.const.STATUS_PLAYING) {
      return;
    }

    let isTrivial = true;

    for (
      let columnIndex = 0;
      columnIndex < Game.const.PLAYING_FIELD_SIZE;
      columnIndex++
    ) {
      const column = this.getColumn(columnIndex);

      const compactionResult = this.compactLine(column);

      if (!this.areLinesEqual(column, compactionResult.compacted)) {
        isTrivial = false;

        this.setColumn(columnIndex, compactionResult.compacted);
        this.score += compactionResult.score;
      }
    }

    if (!isTrivial) {
      this.populateRandomly(1);
      this.updateStatus();
    }
  }

  /**
   * Moves all cells down and compacts them,
   * then updates the score and game status.
   */
  moveDown() {
    if (this.getStatus() !== Game.const.STATUS_PLAYING) {
      return;
    }

    let isTrivial = true;

    for (
      let columnIndex = 0;
      columnIndex < Game.const.PLAYING_FIELD_SIZE;
      columnIndex++
    ) {
      const column = this.getColumn(columnIndex);

      const compactionResult = this.compactLine(column.reverse());

      if (!this.areLinesEqual(column, compactionResult.compacted)) {
        isTrivial = false;

        this.setColumn(columnIndex, compactionResult.compacted.reverse());
        this.score += compactionResult.score;
      }
    }

    if (!isTrivial) {
      this.populateRandomly(1);
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
    const result = new Array(Game.const.PLAYING_FIELD_SIZE);

    for (let row = 0; row < Game.const.PLAYING_FIELD_SIZE; row++) {
      result[row] = new Array(Game.const.PLAYING_FIELD_SIZE);

      for (let column = 0; column < Game.const.PLAYING_FIELD_SIZE; column++) {
        result[row][column] = this.playingField[row][column];
      }
    }

    return result;
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
    this.status = Game.const.STATUS_PLAYING;
    this.score = 0;

    this.populateRandomly(2);
  }

  /**
   * Resets the game.
   */
  restart() {
    for (let row = 0; row < Game.const.PLAYING_FIELD_SIZE; row++) {
      for (let column = 0; column < Game.const.PLAYING_FIELD_SIZE; column++) {
        this.playingField[row][column] = this.initialState[row][column];
      }
    }

    this.status = Game.const.STATUS_IDLE;
    this.score = 0;
  }

  /**
   * Returns a column by index;
   * @param {number} index
   */
  getColumn(index) {
    const column = new Array(Game.const.PLAYING_FIELD_SIZE);

    for (let row = 0; row < Game.const.PLAYING_FIELD_SIZE; row++) {
      column[row] = this.playingField[row][index];
    }

    return column;
  }

  /**
   * Sets a column by index;
   * @param {number} index
   */
  setColumn(index, column) {
    for (let row = 0; row < Game.const.PLAYING_FIELD_SIZE; row++) {
      this.playingField[row][index] = column[row];
    }
  }

  /**
   * Returns a row by index.
   *
   * @param {number} index
   */
  getRow(index) {
    const row = new Array(Game.const.PLAYING_FIELD_SIZE);

    for (let column = 0; column < Game.const.PLAYING_FIELD_SIZE; column++) {
      row[column] = this.playingField[index][column];
    }

    return row;
  }

  /**
   * Sets a row by index.
   *
   * @param {number} index
   */
  setRow(index, row) {
    for (let column = 0; column < Game.const.PLAYING_FIELD_SIZE; column++) {
      this.playingField[index][column] = row[column];
    }
  }

  /**
   * Returns a 1D array of all cell values. To get 2D version use {getState()}
   *
   * @returns {number[]}
   */
  getCells() {
    const cells = this.playingField.reduce((acc, row) => [...acc, ...row], []);

    return cells;
  }

  /**
   * Returns a 1D array of {IndexedCell}
   * that contain information about their position in the grid
   * and their value.
   *
   * @typedef {Object} IndexedCell
   * @property {number} row
   * @property {number} column
   * @property {number} value
   *
   * @returns {IndexedCell[]}
   */
  getIndexedCells() {
    const indexedCells = this.getCells().map((value, index) => {
      const column = index % Game.const.PLAYING_FIELD_SIZE;
      const row = (index - column) / Game.const.PLAYING_FIELD_SIZE;

      return { row, column, value };
    });

    return indexedCells;
  }

  /**
   * Returns a value of a specified game cell.
   *
   * @param {number} row
   * @param {number} column
   * @returns {number}
   */
  getCell(row, column) {
    return this.playingField[row][column];
  }

  /**
   * Sets a value of a specified game cell.
   *
   * @param {number} row
   * @param {number} column
   * @param {nunber} value
   */
  setCell(row, column, value) {
    this.playingField[row][column] = value;
  }

  /**
   * Fills some amount of random empty cells with values
   *
   * @param {number} count - how many cells to populate
   */
  populateRandomly(count) {
    const emptyCells = this.getIndexedCells().filter(
      ({ value }) => value === 0,
    );

    for (let i = 0; i < count; i++) {
      if (emptyCells.length === 0) {
        break;
      }

      const index = Math.floor(Math.random() * emptyCells.length);
      const { row, column } = emptyCells[index];

      emptyCells.splice(index, 1);

      this.setCell(row, column, this.generateCellValue());
    }
  }

  /**
   * Generates a cell value.
   *
   * @returns {number}
   */
  generateCellValue() {
    const t = Math.random();

    if (t > 0.9) {
      return 4;
    }

    return 2;
  }

  /**
   * Takes the line of numbers and merges equal adjacent cells together,
   * then pads the result with 0 to {PLAYING_FIELD_SIZE}.
   *
   * @typedef {Object} CompactedLine
   * @param {number[]} compacted
   * @param {number} score
   *
   * @param {number[]} line - a line that needs compacting
   *
   * @returns {CompactedLine}
   */
  compactLine(line) {
    const numbers = line.filter((item) => item !== 0);

    if (numbers.length < 2) {
      this.padWithZeros(numbers);

      return {
        compacted: numbers,
        score: 0,
      };
    }

    const compactedNumbers = [];
    let compactingScore = 0;

    for (let i = 0; i < numbers.length; i++) {
      const current = numbers[i];
      const next = numbers[i + 1];

      if (current === next) {
        compactedNumbers.push(current * 2);
        compactingScore += current * 2;
        i++;
      } else {
        compactedNumbers.push(current);
      }
    }

    this.padWithZeros(compactedNumbers);

    return {
      compacted: compactedNumbers,
      score: compactingScore,
    };
  }

  /**
   * Checks if two game lines are equal.
   *
   * @param {number[]} a
   * @param {number[]} b
   *
   * @returns {boolean}
   */
  areLinesEqual(a, b) {
    for (let i = 0; i < Game.const.PLAYING_FIELD_SIZE; i++) {
      if (a[i] !== b[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Pads an array of numbers with 0 to {PLAYING_FIELD_SIZE}
   * @param {number[]} line
   * @returns {number[]}
   */
  padWithZeros(line) {
    while (line.length < Game.const.PLAYING_FIELD_SIZE) {
      line.push(0);
    }

    return line;
  }

  /**
   * Checks if the game is won or lost, and sets {status} accordingly.
   */
  updateStatus() {
    function winCondition(numbers) {
      return numbers.some((number) => number === 2048);
    }

    function loseCondition(numbers) {
      // of some zeros are present, moves are possible
      if (numbers.some((number) => number === 0)) {
        return false;
      }

      // else check if any hirizontal move is possible
      for (let row = 0; row < Game.const.PLAYING_FIELD_SIZE; row++) {
        for (
          let column = 0;
          column < Game.const.PLAYING_FIELD_SIZE - 1;
          column++
        ) {
          const current = numbers[row * Game.const.PLAYING_FIELD_SIZE + column];

          const next =
            numbers[row * Game.const.PLAYING_FIELD_SIZE + (column + 1)];

          if (current === next) {
            return false;
          }
        }
      }

      // else check if any vertical move is possible
      for (let row = 0; row < Game.const.PLAYING_FIELD_SIZE - 1; row++) {
        for (let column = 0; column < Game.const.PLAYING_FIELD_SIZE; column++) {
          const current = numbers[row * Game.const.PLAYING_FIELD_SIZE + column];

          const next =
            numbers[(row + 1) * Game.const.PLAYING_FIELD_SIZE + column];

          if (current === next) {
            return false;
          }
        }
      }

      // if no moves are possible -- game is lost
      return true;
    }

    const cells = this.getCells();

    if (winCondition(cells)) {
      this.status = Game.const.STATUS_WIN;
    } else if (loseCondition(cells)) {
      this.status = Game.const.STATUS_LOSE;
    }
  }
}

module.exports = Game;
