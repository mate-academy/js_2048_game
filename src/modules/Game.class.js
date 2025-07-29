'use strict';
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
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.status = 'idle';
  }

  moveLeft() {
    const prevState = JSON.stringify(this.initialState);

    for (let i = 0; i < this.state.length; i += 1) {
      const row = this.state[i];
      const filteredRow = row.filter((el) => el !== 0);
      const newRow = [];
      let skip = false;

      for (let j = 0; j < filteredRow.length; j += 1) {
        if (skip) {
          skip = false;
          continue;
        }

        if (filteredRow[j] === filteredRow[j + 1]) {
          this.score += filteredRow[j] * 2;
          newRow.push(filteredRow[j] * 2);
          skip = true;
        } else {
          newRow.push(filteredRow[j]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      this.state[i] = newRow;
    }

    if (JSON.stringify(this.state) !== prevState) {
      this.addRandomToState();
      this.checkWin();
    }
  }

  moveRight() {
    const prevState = JSON.stringify(this.initialState);

    for (let i = 0; i < this.state.length; i += 1) {
      const row = this.state[i];
      const filteredRow = row.filter((el) => el !== 0);
      const newRow = [];
      let skip = false;

      for (let j = filteredRow.length - 1; j >= 0; j -= 1) {
        if (skip) {
          skip = false;
          continue;
        }

        if (filteredRow[j] === filteredRow[j - 1]) {
          this.score += filteredRow[j] * 2;
          newRow.unshift(filteredRow[j] * 2);
          skip = true;
        } else {
          newRow.unshift(filteredRow[j]);
        }
      }

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      this.state[i] = newRow;
    }

    if (JSON.stringify(this.state) !== prevState) {
      this.addRandomToState();
      this.checkWin();
    }
  }
  moveUp() {
    const prevState = JSON.stringify(this.initialState);

    for (let i = 0; i < this.state[0].length; i += 1) {
      const col = [];

      for (let j = 0; j < this.state.length; j += 1) {
        col.push(this.state[j][i]);
      }

      const filteredCol = col.filter((el) => el !== 0);
      const newCol = [];
      let skip = false;

      for (let k = 0; k < filteredCol.length; k += 1) {
        if (skip) {
          skip = false;
          continue;
        }

        if (filteredCol[k] === filteredCol[k + 1]) {
          this.score += filteredCol[k] * 2;
          newCol.push(filteredCol[k] * 2);
          skip = true;
        } else {
          newCol.push(filteredCol[k]);
        }
      }

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let row = 0; row < this.state.length; row += 1) {
        this.state[row][i] = newCol[row];
      }
    }

    if (JSON.stringify(this.state) !== prevState) {
      this.addRandomToState();
      this.checkWin();
    }
  }
  moveDown() {
    const prevState = JSON.stringify(this.initialState);

    for (let i = 0; i < this.state[0].length; i += 1) {
      const col = [];

      for (let j = 0; j < this.state.length; j += 1) {
        col.push(this.state[j][i]);
      }

      const filteredCol = col.filter((el) => el !== 0);
      const newCol = [];
      let skip = false;

      for (let k = filteredCol.length - 1; k >= 0; k -= 1) {
        if (skip) {
          skip = false;
          continue;
        }

        if (filteredCol[k] === filteredCol[k - 1]) {
          this.score += filteredCol[k] * 2;
          newCol.unshift(filteredCol[k] * 2);
          skip = true;
        } else {
          newCol.unshift(filteredCol[k]);
        }
      }

      while (newCol.length < 4) {
        newCol.unshift(0);
      }

      for (let row = 0; row < this.state.length; row += 1) {
        this.state[row][i] = newCol[row];
      }
    }

    if (JSON.stringify(this.state) !== prevState) {
      this.addRandomToState();
      this.checkWin();
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
    this.addRandomToState();
    this.addRandomToState();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
    this.addRandomToState();
    this.addRandomToState();
  }

  getNumber() {
    return Math.random() < 0.1 ? 4 : 2;
  }

  addRandomToState() {
    const emptyCells = [];

    for (let row = 0; row < this.state.length; row += 1) {
      for (let col = 0; col < this.state[row].length; col += 1) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (!this.makeMove()) {
      this.status = 'lose';

      return;
    }

    const randomNumber = Math.floor(Math.random() * emptyCells.length);
    const { row: selectedRow, col: selectedCol } = emptyCells[randomNumber];

    this.state[selectedRow][selectedCol] = this.getNumber();
  }

  makeMove() {
    const size = this.state.length;

    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        const cell = this.state[i][j];

        if (cell === 0) {
          return true;
        }

        if (i + 1 < size && cell === this.state[i + 1][j]) {
          return true;
        }

        if (j + 1 < size && cell === this.state[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  checkWin() {
    for (const row of this.state) {
      if (row.includes(2048)) {
        this.status = 'win';

        return true;
      }
    }

    return false;
  }
}

module.exports = Game;
