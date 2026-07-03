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
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    const oldState = JSON.stringify(this.state);

    for (let i = 0; i < 4; i++) {
      this.state[i] = this.processRow(this.state[i]);
    }

    if (oldState !== JSON.stringify(this.state)) {
      this.addNumber();
      this.updateStatus();
    }
  }

  moveRight() {
    const oldState = JSON.stringify(this.state);

    for (let i = 0; i < 4; i++) {
      this.state[i] = this.state[i].reverse();
      this.state[i] = this.processRow(this.state[i]);
      this.state[i] = this.state[i].reverse();
    }

    if (oldState !== JSON.stringify(this.state)) {
      this.addNumber();
      this.updateStatus();
    }
  }

  moveUp() {
    const oldState = JSON.stringify(this.state);

    this.state = this.transpose(this.state);

    for (let i = 0; i < 4; i++) {
      this.state[i] = this.processRow(this.state[i]);
    }

    this.state = this.transpose(this.state);

    if (oldState !== JSON.stringify(this.state)) {
      this.addNumber();
      this.updateStatus();
    }
  }

  moveDown() {
    const oldState = JSON.stringify(this.state);

    this.state = this.transpose(this.state);

    for (let i = 0; i < 4; i++) {
      this.state[i] = this.state[i].reverse();
      this.state[i] = this.processRow(this.state[i]);
      this.state[i] = this.state[i].reverse();
    }

    this.state = this.transpose(this.state);

    if (oldState !== JSON.stringify(this.state)) {
      this.addNumber();
      this.updateStatus();
    }
  }

  processRow(row) {
    let rowState = row.filter((r) => r !== 0);

    for (let i = 0; i < rowState.length; i++) {
      if (rowState[i] === rowState[i + 1]) {
        rowState[i] = rowState[i] + rowState[i + 1];
        this.score += rowState[i];
        rowState[i + 1] = 0;
        i++;
      }
    }
    rowState = rowState.filter((r) => r !== 0);

    while (rowState.length < 4) {
      rowState.push(0);
    }

    return rowState;
  }

  transpose(array) {
    const newArray = [[], [], [], []];

    for (let i = 0; i < 4; i++) {
      for (let r = 0; r < 4; r++) {
        newArray[i].push(array[r][i]);
      }
    }

    return newArray;
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
    this.restartCells();
    this.status = 'playing';
    this.score = 0;

    const emptyCells = this.getEmptyCells();
    const value1 = this.rundomNumber();
    const value2 = this.rundomNumber();
    const cell1 = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const cell2 = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[cell1[0]][cell1[1]] = value1;
    this.state[cell2[0]][cell2[1]] = value2;
  }

  addNumber() {
    const emptyCells = this.getEmptyCells();
    const value1 = this.rundomNumber();
    const cell1 = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[cell1[0]][cell1[1]] = value1;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.restartCells();
    this.score = 0;
    this.status = 'idle';
  }

  restartCells() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  win() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 2048) {
          this.status = 'win';
        }
      }
    }
  }

  lose() {
    if (this.getEmptyCells().length > 0) {
      return;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (j < 3) {
          if (this.state[i][j] === this.state[i][j + 1]) {
            return;
          }
        }

        if (i < 3) {
          if (this.state[i][j] === this.state[i + 1][j]) {
            return;
          }
        }
      }
    }

    this.status = 'lose';
  }

  updateStatus() {
    this.win();
    this.lose();
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    return emptyCells;
  }

  rundomNumber() {
    const value = Math.random() < 0.1 ? 4 : 2;

    return value;
  }
}

module.exports = Game;
