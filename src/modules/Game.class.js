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
  constructor(initialState = null) {
    this.initialState = initialState
      ? this.cloneState(initialState)
      : this.createEmptyBoard();

    this.state = this.cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.makeMove((row) => this.mergeRow(row));
  }

  moveRight() {
    this.makeMove((row) => {
      const reversedRow = [...row].reverse();
      const mergedRow = this.mergeRow(reversedRow);

      return mergedRow.reverse();
    });
  }

  moveUp() {
    this.makeColumnMove((column) => this.mergeRow(column));
  }

  moveDown() {
    this.makeColumnMove((column) => {
      const reversedColumn = [...column].reverse();
      const mergedColumn = this.mergeRow(reversedColumn);

      return mergedColumn.reverse();
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
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  cloneState(state) {
    return state.map((row) => [...row]);
  }

  mergeRow(row) {
    const numbers = row.filter((num) => num !== 0);
    const result = [];

    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] === numbers[i + 1]) {
        const mergedValue = numbers[i] * 2;

        result.push(mergedValue);
        this.score += mergedValue;
        i++;
      } else {
        result.push(numbers[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  makeMove(moveRow) {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.cloneState(this.state);
    const oldScore = this.score;

    this.state = this.state.map((row) => moveRow([...row]));

    this.finishMove(oldState, oldScore);
  }

  makeColumnMove(moveColumn) {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.cloneState(this.state);
    const oldScore = this.score;
    const newState = this.createEmptyBoard();

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.state[row][col]);
      }

      const movedColumn = moveColumn(column);

      for (let row = 0; row < 4; row++) {
        newState[row][col] = movedColumn[row];
      }
    }

    this.state = newState;
    this.finishMove(oldState, oldScore);
  }

  finishMove(oldState, oldScore) {
    if (!this.isStateChanged(oldState, this.state)) {
      this.score = oldScore;

      return;
    }

    if (this.hasWon()) {
      this.status = 'win';

      return;
    }

    this.addRandomTile();

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    this.state[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
  }

  hasWon() {
    return this.state.some((row) => row.includes(2048));
  }

  hasAvailableMoves() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }

        if (col < 3 && this.state[row][col] === this.state[row][col + 1]) {
          return true;
        }

        if (row < 3 && this.state[row][col] === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  isStateChanged(oldState, newState) {
    return JSON.stringify(oldState) !== JSON.stringify(newState);
  }
}

module.exports = Game;
