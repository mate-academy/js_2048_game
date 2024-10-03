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
  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({
            row, col,
          });
        }
      }
    }

    return emptyCells;
  }

  addRandomNumber() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    const newValue = Math.random() < 0.9 ? 2 : 4;

    this.state[randomCell.row][randomCell.col] = newValue;
  }

  gamePossible() {
    // Превіряємо наявність пустих клітинок
    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }
      }
    }

    // Перевіряємо можливість злиття по горизонталі
    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length - 1; col++) {
        if (this.state[row][col] === this.state[row][col + 1]) {
          return true;
        }
      }
    }

    // Перевіряємо можливість злиття по вертикалі
    for (let coll = 0; coll < this.state[0].length; coll++) {
      for (let row = 0; row < this.state.length - 1; row++) {
        if (this.state[row][coll] === this.state[row + 1][coll]) {
          return true;
        }
      }
    }

    return false;
  }

  constructor(initialState) {
    this.state = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    for (let row = 0; row < this.state.length; row++) {
      const currentRow = this.state[row];

      let filteredRow = currentRow.filter(num => num !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          filteredRow[i + 1] = 0;
          this.score += filteredRow[i];
        }
      }
      filteredRow = filteredRow.filter(num => num !== 0);

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      this.state[row] = filteredRow;
    }

    this.addRandomNumber();
  }

  moveRight() {
    for (let row = 0; row < this.state.length; row++) {
      const currentRow = this.state[row];

      let filteredRow = currentRow.filter(num => num !== 0);

      for (let i = filteredRow.length - 1; i > 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          filteredRow[i] *= 2;
          filteredRow[i - 1] = 0;
          this.score += filteredRow[i];
        }
      }
      filteredRow = filteredRow.filter(num => num !== 0);

      while (filteredRow.length < 4) {
        filteredRow.unshift(0);
      }

      this.state[row] = filteredRow;
    }

    this.addRandomNumber();
  };

  moveUp() {
    for (let coll = 0; coll < this.state[0].length; coll++) {
      const currentColl = [];

      for (let row = 0; row < this.state.length; row++) {
        currentColl.push(this.state[row][coll]);
      }

      let filteredColl = currentColl.filter(num => num !== 0);

      for (let i = 0; i < filteredColl.length - 1; i++) {
        if (filteredColl[i] === filteredColl[i + 1]) {
          filteredColl[i] *= 2;
          filteredColl[i + 1] = 0;
          this.score += filteredColl[i];
        }
      }
      filteredColl = filteredColl.filter(num => num !== 0);

      while (filteredColl.length < 4) {
        filteredColl.push(0);
      }

      for (let row = 0; row < this.state.length; row++) {
        this.state[row][coll] = filteredColl[row];
      }
    }
    this.addRandomNumber();
  }

  moveDown() {
    for (let coll = 0; coll < this.state[0].length; coll++) {
      const currentColl = [];

      for (let row = 0; row < this.state.length; row++) {
        currentColl.push(this.state[row][coll]);
      }

      let filteredColl = currentColl.filter(num => num !== 0);

      for (let i = filteredColl.length - 1; i > 0; i--) {
        if (filteredColl[i] === filteredColl[i - 1]) {
          filteredColl[i] *= 2;
          filteredColl[i - 1] = 0;
          this.score += filteredColl[i];
        }
      }
      filteredColl = filteredColl.filter(num => num !== 0);

      while (filteredColl.length < 4) {
        filteredColl.unshift(0);
      }

      for (let row = 0; row < this.state.length; row++) {
        this.state[row][coll] = filteredColl[row];
      }
    }
    this.addRandomNumber();
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  };

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
    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] === 2048) {
          this.status = 'win';

          return this.status;
        }
      }
    }

    if (!this.gamePossible()) {
      this.status = 'lose';

      return this.status;
    }
  }

  /**
   * Starts the game.
   */
  start() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';

    this.addRandomNumber();
    this.addRandomNumber();
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
    this.status = 'idle';
  }

  // Add your own methods here
}

module.exports = Game;
