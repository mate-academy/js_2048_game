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
    // eslint-disable-next-line no-console
    this.state = initialState.map((row) => [...row]);
    this.initialState = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    const oldState = this.state.map((row) => [...row]);
    const newState = this.state.map((row) => {
      return this.processRowLeft(row);
    });

    this.state = newState;

    let hasChanged = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (oldState[row][col] !== newState[row][col]) {
          hasChanged = true;
        }
      }
    }

    if (hasChanged) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveRight() {
    const oldState = this.state.map((row) => [...row]);
    const newState = this.state.map((row) => {
      const reversed = [...row].reverse();
      const processedRow = this.processRowLeft(reversed);

      return processedRow.reverse();
    });

    this.state = newState;

    let hasChanged = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (oldState[row][col] !== newState[row][col]) {
          hasChanged = true;
        }
      }
    }

    if (hasChanged) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveUp() {
    const oldState = this.state.map((row) => [...row]);

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.state[row][col]);
      }

      const processedColumn = this.processRowLeft(column);

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = processedColumn[row];
      }
    }

    let hasChanged = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (oldState[row][col] !== this.state[row][col]) {
          hasChanged = true;
        }
      }
    }

    if (hasChanged) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveDown() {
    const oldState = this.state.map((row) => [...row]);

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.state[row][col]);
      }

      const reversed = [...column].reverse();
      const processedColumn = this.processRowLeft(reversed);
      const reversedResultBack = processedColumn.reverse();

      for (let row = 0; row < 4; row++) {
        this.state[row][col] = reversedResultBack[row];
      }
    }

    let hasChanged = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (oldState[row][col] !== this.state[row][col]) {
          hasChanged = true;
        }
      }
    }

    if (hasChanged) {
      this.addRandomTile();
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
    return this.state.map((row) => [...row]);
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
    const emptyCells = this.getEmptyCells();

    this.status = 'playing';

    if (emptyCells.length === 16) {
      this.addRandomTile();
      this.addRandomTile();
    }
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
  processRowLeft(row) {
    const filteredRow = row.filter((n) => n > 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] = filteredRow[i] * 2;
        this.score += filteredRow[i];
        filteredRow.splice(i + 1, 1);
      }
    }

    while (filteredRow.length < 4) {
      filteredRow.push(0);
    }

    return filteredRow;
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];
    const value = Math.random() < 0.9 ? 2 : 4;

    this.state[row][col] = value;
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      return false;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.state[row][col] === this.state[row][col + 1]) {
          return false;
        }
      }
    }

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === this.state[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }

  updateStatus() {
    const checkWin = this.checkWin();
    const checkLose = this.checkLose();

    if (checkWin) {
      this.status = 'win';

      return;
    }

    if (checkLose) {
      this.status = 'lose';

      return;
    }

    this.status = 'playing';
  }
}

module.exports = Game;
