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
    this.state = initialState;
    this.score = 0;
    this.status = 'idle';
    this.initialStateBackup = structuredClone(initialState);
  }

  moveLeft() {
    if (this.status === 'playing') {
      const newState = [];

      for (const row of this.state) {
        const newRow = row.filter((a) => a !== 0);
        const newArray = [];

        for (let i = 0; i < newRow.length; i++) {
          if (newRow[i] === newRow[i + 1]) {
            newArray.push(newRow[i] + newRow[i + 1]);
            this.score += newRow[i] + newRow[i + 1];
            i++;
          } else {
            newArray.push(newRow[i]);
          }
        }

        for (let j = newArray.length; j < row.length; j++) {
          newArray.push(0);
        }
        newState.push(newArray);
      }

      let changed = false;

      for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
          if (newState[i][j] !== this.state[i][j]) {
            changed = true;
          }
        }
      }

      if (changed === true) {
        for (let j = 0; j < 4; j++) {
          for (let i = 0; i < 4; i++) {
            this.state[i][j] = newState[i][j];
          }
        }
        this.checkWin();
        this.addRandomTile();
      }
      this.checkLose();

      return changed;
    }
  }

  moveRight() {
    if (this.status === 'playing') {
      const newState = [];

      for (const row of this.state) {
        const newRow = row.filter((a) => a !== 0);
        const newArray = [];

        for (let i = newRow.length - 1; i >= 0; i--) {
          if (newRow[i] === newRow[i - 1]) {
            newArray.unshift(newRow[i] + newRow[i - 1]);
            this.score += newRow[i] + newRow[i - 1];
            i--;
          } else {
            newArray.unshift(newRow[i]);
          }
        }

        for (let j = newArray.length; j < row.length; j++) {
          newArray.unshift(0);
        }
        newState.push(newArray);
      }

      let changed = false;

      for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
          if (newState[i][j] !== this.state[i][j]) {
            changed = true;
          }
        }
      }

      if (changed === true) {
        for (let j = 0; j < 4; j++) {
          for (let i = 0; i < 4; i++) {
            this.state[i][j] = newState[i][j];
          }
        }
        this.checkWin();
        this.addRandomTile();
      }
      this.checkLose();

      return changed;
    }
  }

  moveUp() {
    if (this.status === 'playing') {
      const newState = [];

      const columnsArray = [];
      const updatedColumnsArray = [];

      for (let i = 0; i < 4; i++) {
        const column = [];

        for (let j = 0; j < 4; j++) {
          column.push(this.state[j][i]);
        }
        columnsArray.push(column);
      }

      for (const row of columnsArray) {
        const newRow = row.filter((a) => a !== 0);
        const newArray = [];

        for (let i = 0; i < newRow.length; i++) {
          if (newRow[i] === newRow[i + 1]) {
            newArray.push(newRow[i] + newRow[i + 1]);
            this.score += newRow[i] + newRow[i + 1];
            i++;
          } else {
            newArray.push(newRow[i]);
          }
        }

        for (let j = newArray.length; j < row.length; j++) {
          newArray.push(0);
        }
        updatedColumnsArray.push(newArray);
      }

      for (let i = 0; i < 4; i++) {
        const row = [];

        for (let j = 0; j < 4; j++) {
          row.push(updatedColumnsArray[j][i]);
        }
        newState.push(row);
      }

      let changed = false;

      for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
          if (newState[i][j] !== this.state[i][j]) {
            changed = true;
          }
        }
      }

      if (changed === true) {
        for (let j = 0; j < 4; j++) {
          for (let i = 0; i < 4; i++) {
            this.state[i][j] = newState[i][j];
          }
        }
        this.checkWin();
        this.addRandomTile();
      }
      this.checkLose();

      return changed;
    }
  }

  moveDown() {
    if (this.status === 'playing') {
      const newState = [];

      const columnsArray = [];
      const updatedColumnsArray = [];

      for (let i = 0; i < 4; i++) {
        const column = [];

        for (let j = 0; j < 4; j++) {
          column.push(this.state[j][i]);
        }
        columnsArray.push(column);
      }

      for (const row of columnsArray) {
        const newRow = row.filter((a) => a !== 0);
        const newArray = [];

        for (let i = newRow.length - 1; i >= 0; i--) {
          if (newRow[i] === newRow[i - 1]) {
            newArray.unshift(newRow[i] + newRow[i - 1]);
            this.score += newRow[i] + newRow[i - 1];
            i--;
          } else {
            newArray.unshift(newRow[i]);
          }
        }

        for (let j = newArray.length; j < row.length; j++) {
          newArray.unshift(0);
        }
        updatedColumnsArray.push(newArray);
      }

      for (let i = 0; i < 4; i++) {
        const row = [];

        for (let j = 0; j < 4; j++) {
          row.push(updatedColumnsArray[j][i]);
        }
        newState.push(row);
      }

      let changed = false;

      for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
          if (newState[i][j] !== this.state[i][j]) {
            changed = true;
          }
        }
      }

      if (changed === true) {
        for (let j = 0; j < 4; j++) {
          for (let i = 0; i < 4; i++) {
            this.state[i][j] = newState[i][j];
          }
        }
        this.checkWin();
        this.addRandomTile();
      }

      this.checkLose();

      return changed;
    }
  }

  checkWin() {
    let won = false;

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        if (this.state[i][j] >= 2048) {
          won = true;
        }
      }
    }

    if (won === true) {
      this.status = 'win';
    }
  }

  checkLose() {
    if (this.status === 'playing') {
      let lost = true;

      for (let j = 0; j < 4; j++) {
        for (let i = 0; i < 4; i++) {
          if (this.state[i][j] === 0) {
            lost = false;
          } else if (
            this.state[i][j] === this.state[i][j + 1] &&
            this.state[i][j + 1] !== undefined
          ) {
            lost = false;
          } else if (
            i < 3 &&
            this.state[i][j] === this.state[i + 1][j] &&
            this.state[i + 1][j] !== undefined
          ) {
            lost = false;
          }
        }
      }

      if (lost === true) {
        this.status = 'lose';
      }
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
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i <= 3; i++) {
      for (let j = 0; j <= 3; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomFirst = Math.floor(Math.random() * emptyCells.length);
    const selectedPositionOne = emptyCells[randomFirst];
    const randomChance = Math.floor(Math.random() * 10);

    if (randomChance === 1) {
      this.state[selectedPositionOne[0]][selectedPositionOne[1]] = 4;
    } else {
      this.state[selectedPositionOne[0]][selectedPositionOne[1]] = 2;
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = structuredClone(this.initialStateBackup);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
}

module.exports = Game;
