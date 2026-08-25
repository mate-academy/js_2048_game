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

    this.currentScore = 0;
    this.currentStatus = 'idle';

    if (initialState === undefined) {
      this.currentDesk = [0, 0, 0, 0].map(() => Array(4).fill(0));
    } else {
      this.currentDesk = initialState;
    }
  }
  moveLeft() {
    this.checkWin();

    if (this.currentStatus !== 'playing') {
      return;
    }

    const previousDesk = this.currentDesk.map((newCell) => [...newCell]);

    for (let i = 0; i < this.currentDesk.length; i++) {
      const merged = [];
      const row = this.currentDesk[i];
      const filteredRow = row.filter((number) => number !== 0);

      for (let j = 0; j < filteredRow.length - 1; j++) {
        if (filteredRow[j] === filteredRow[j + 1] && !merged.includes(j)) {
          filteredRow[j] = filteredRow[j] + filteredRow[j + 1];
          this.currentScore = this.currentScore + filteredRow[j];

          filteredRow.splice(j + 1, 1);
          merged.push(j);
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      this.currentDesk[i] = filteredRow;
    }

    if (!this.isDeskEqual(previousDesk, this.currentDesk)) {
      this.addRandomTile();

      if (this.currentStatus !== 'playing') {
        return;
      }

      this.checkLose();
    }
  }
  moveRight() {
    this.checkWin();

    if (this.currentStatus !== 'playing') {
      return;
    }

    const previousDesk = this.currentDesk.map((newCell) => [...newCell]);

    for (let i = 0; i < this.currentDesk.length; i++) {
      const merged = [];
      const row = this.currentDesk[i];
      const filteredRow = row.filter((number) => number !== 0);

      filteredRow.reverse();

      for (let j = 0; j < filteredRow.length - 1; j++) {
        if (filteredRow[j] === filteredRow[j + 1] && !merged.includes(j)) {
          filteredRow[j] = filteredRow[j] + filteredRow[j + 1];
          this.currentScore = this.currentScore + filteredRow[j];
          filteredRow.splice(j + 1, 1);
          merged.push(j);
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }
      filteredRow.reverse();
      this.currentDesk[i] = filteredRow;
    }

    if (!this.isDeskEqual(previousDesk, this.currentDesk)) {
      this.addRandomTile();

      if (this.currentStatus !== 'playing') {
        return;
      }

      this.checkLose();
    }
  }
  moveUp() {
    this.checkWin();

    if (this.currentStatus !== 'playing') {
      return;
    }

    const previousDesk = this.currentDesk.map((newCell) => [...newCell]);

    for (let i = 0; i < this.currentDesk.length; i++) {
      const merged = [];
      const column = [];

      for (let j = 0; j < this.currentDesk.length; j++) {
        column.push(this.currentDesk[j][i]);
      }

      const filteredColumn = column.filter((number) => number !== 0);

      for (let j = 0; j < filteredColumn.length - 1; j++) {
        if (
          filteredColumn[j] === filteredColumn[j + 1] &&
          !merged.includes(j)
        ) {
          filteredColumn[j] = filteredColumn[j] + filteredColumn[j + 1];
          this.currentScore = this.currentScore + filteredColumn[j];
          filteredColumn.splice(j + 1, 1);
          merged.push(j);
        }
      }

      while (filteredColumn.length < 4) {
        filteredColumn.push(0);
      }

      for (let j = 0; j < this.currentDesk.length; j++) {
        this.currentDesk[j][i] = filteredColumn[j];
      }
    }

    if (!this.isDeskEqual(previousDesk, this.currentDesk)) {
      this.addRandomTile();

      if (this.currentStatus !== 'playing') {
        return;
      }

      this.checkLose();
    }
  }
  moveDown() {
    this.checkWin();

    if (this.currentStatus !== 'playing') {
      return;
    }

    const previousDesk = this.currentDesk.map((newCell) => [...newCell]);

    for (let i = 0; i < this.currentDesk.length; i++) {
      const merged = [];
      const column = [];

      for (let j = 0; j < this.currentDesk.length; j++) {
        column.push(this.currentDesk[j][i]);
      }

      const filteredColumn = column.filter((number) => number !== 0);

      filteredColumn.reverse();

      for (let j = 0; j < filteredColumn.length - 1; j++) {
        if (
          filteredColumn[j] === filteredColumn[j + 1] &&
          !merged.includes(j)
        ) {
          filteredColumn[j] = filteredColumn[j] + filteredColumn[j + 1];
          this.currentScore = this.currentScore + filteredColumn[j];
          filteredColumn.splice(j + 1, 1);
          merged.push(j);
        }
      }

      while (filteredColumn.length < 4) {
        filteredColumn.push(0);
      }
      filteredColumn.reverse();

      for (let j = 0; j < this.currentDesk.length; j++) {
        this.currentDesk[j][i] = filteredColumn[j];
      }
    }

    if (!this.isDeskEqual(previousDesk, this.currentDesk)) {
      this.addRandomTile();

      if (this.currentStatus !== 'playing') {
        return;
      }

      this.checkLose();
    }
  }
  /**
   * @returns {number}
   */
  getScore() {
    return this.currentScore;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.currentDesk;
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
    return this.currentStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    this.currentStatus = 'playing';
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.currentDesk = [0, 0, 0, 0].map(() => Array(4).fill(0));
    this.currentScore = 0;
    this.currentStatus = 'idle';
  }

  // Add your own methods here
  isDeskEqual(deskA, deskB) {
    for (let i = 0; i < deskA.length; i++) {
      for (let j = 0; j < deskA[i].length; j++) {
        if (deskA[i][j] !== deskB[i][j]) {
          return false;
        }
      }
    }

    return true;
  }
  getEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < this.currentDesk.length; i++) {
      for (let j = 0; j < this.currentDesk[i].length; j++) {
        if (this.currentDesk[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    return emptyCells;
  }
  addRandomTile() {
    const emptyCells = this.getEmptyCells();
    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    const randomValue = Math.random();

    if (randomValue < 0.9) {
      this.currentDesk[randomCell[0]][randomCell[1]] = 2;
    } else {
      this.currentDesk[randomCell[0]][randomCell[1]] = 4;
    }
  }

  checkWin() {
    for (let i = 0; i < this.currentDesk.length; i++) {
      for (let j = 0; j < this.currentDesk.length; j++) {
        if (this.currentDesk >= 2048) {
          this.currentStatus = 'win';

          return;
        }
      }
    }
  }

  checkLose() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      return;
    }

    for (let i = 0; i < this.currentDesk.length; i++) {
      for (let j = 0; j < this.currentDesk.length - 1; j++) {
        if (
          this.currentDesk[i][j] !== 0 &&
          this.currentDesk[i][j] === this.currentDesk[i][j + 1]
        ) {
          return;
        }
      }
    }

    for (let i = 0; i < this.currentDesk.length - 1; i++) {
      for (let j = 0; j < this.currentDesk.length; j++) {
        if (
          this.currentDesk[i][j] !== 0 &&
          this.currentDesk[i][j] === this.currentDesk[i + 1][j]
        ) {
          return;
        }
      }
    }
    this.currentStatus = 'lose';
  }
}

export default Game;
