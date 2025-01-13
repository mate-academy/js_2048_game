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
  }

  #status = 'idle';
  #score = 0;
  #state = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  #lastPosition = {};
  #lastNumber = 2;
  #maxNumber = 2;

  moveLeft() {
    this.#state.forEach((row, n) => {
      let lastNumberIndex = 0;
      const len = row.length;

      for (let i = 1; i < len; i++) {
        if (row[i] === 0) {
          continue;
        }

        if (row[lastNumberIndex] === 0) {
          row[lastNumberIndex] = row[i];
          row[i] = 0;
          lastNumberIndex++;
          continue;
        }

        if (row[i] === row[lastNumberIndex]) {
          row[lastNumberIndex] *= 2;
          row[i] = 0;
          lastNumberIndex++;

          if (row[lastNumberIndex] > this.#maxNumber) {
            this.#maxNumber = row[lastNumberIndex];
          }
          continue;
        }

        if (row[i] !== row[lastNumberIndex]) {
          lastNumberIndex++;

          if (lastNumberIndex < i) {
            row[lastNumberIndex] = row[i];
            row[i] = 0;
          }
          continue;
        }
      }
    });

    this.#score++;

    if (this.#maxNumber < 2048) {
      this.setNewNumber();
    } else {
      this.#status = 'win';
    }
  }

  moveRight() {
    this.#state.forEach((row) => {
      let lastNumberIndex = row.length - 1;

      for (let i = row.length - 2; i >= 0; i--) {
        if (row[i] === 0) {
          continue;
        }

        if (row[lastNumberIndex] === 0) {
          row[lastNumberIndex] = row[i];
          row[i] = 0;
          lastNumberIndex--;
          continue;
        }

        if (row[i] === row[lastNumberIndex]) {
          row[lastNumberIndex] *= 2;
          row[i] = 0;
          lastNumberIndex--;

          if (row[lastNumberIndex] > this.#maxNumber) {
            this.#maxNumber = row[lastNumberIndex];
          }
          continue;
        }

        if (row[i] !== row[lastNumberIndex]) {
          lastNumberIndex--;

          if (lastNumberIndex !== i) {
            row[lastNumberIndex] = row[i];
            row[i] = 0;
          }
          continue;
        }
      }
    });

    this.#score++;

    if (this.#maxNumber < 2048) {
      this.setNewNumber();
    } else {
      this.#status = 'win';
    }
  }
  moveUp() {
    const lenY = this.#state.length;
    const lenX = this.#state[0].length;

    for (let j = 0; j < lenX; j++) {
      let targetPosRow = 0;

      for (let i = 1; i < lenY; i++) {
        if (this.#state[i][j] === 0) {
          continue;
        }

        if (this.#state[targetPosRow][j] === 0) {
          this.#state[targetPosRow][j] = this.#state[i][j];
          this.#state[i][j] = 0;
          targetPosRow++;
          continue;
        }

        if (this.#state[i][j] === this.#state[targetPosRow][j]) {
          this.#state[targetPosRow][j] *= 2;
          this.#state[i][j] = 0;
          targetPosRow++;

          if (this.#state[targetPosRow][j] > this.#maxNumber) {
            this.#maxNumber = this.#state[targetPosRow][j];
          }
          continue;
        }

        if (this.#state[i][j] !== this.#state[targetPosRow][j]) {
          targetPosRow++;

          if (targetPosRow !== i) {
            this.#state[targetPosRow][j] = this.#state[i][j];
            this.#state[i][j] = 0;
          }

          continue;
        }
      }
    }

    this.#score++;

    if (this.#maxNumber < 2048) {
      this.setNewNumber();
    } else {
      this.#status = 'win';
    }
  }
  moveDown() {
    const lenY = this.#state.length;
    const lenX = this.#state[0].length;

    for (let j = 0; j < lenX; j++) {
      let targetPosRow = lenY - 1;

      for (let i = lenY - 2; i >= 0; i--) {
        if (this.#state[i][j] === 0) {
          continue;
        }

        if (this.#state[targetPosRow][j] === 0) {
          this.#state[targetPosRow][j] = this.#state[i][j];
          this.#state[i][j] = 0;
          targetPosRow--;
          continue;
        }

        if (this.#state[i][j] === this.#state[targetPosRow][j]) {
          this.#state[targetPosRow][j] *= 2;
          this.#state[i][j] = 0;
          targetPosRow--;

          if (this.#state[targetPosRow][j] > this.#maxNumber) {
            this.#maxNumber = this.#state[targetPosRow][j];
          }
          continue;
        }

        if (this.#state[i][j] !== this.#state[targetPosRow][j]) {
          targetPosRow--;

          if (targetPosRow !== i) {
            this.#state[targetPosRow][j] = this.#state[i][j];
            this.#state[i][j] = 0;
          }

          continue;
        }
      }
    }

    this.#score++;

    if (this.#maxNumber < 2048) {
      this.setNewNumber();
    } else {
      this.#status = 'win';
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.#score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.#state;
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
    return this.#status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.setNewNumber();
    this.#status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.#state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.setNewNumber();

    this.#status = 'playing';
    this.#score = 0;
  }

  getLastPosition() {
    return this.#lastPosition;
  }

  getLastNumber() {
    return this.#lastNumber;
  }

  setNewNumber() {
    const freeCells = [];

    this.#state.forEach((row, i) => {
      row.forEach((value, j) => {
        if (value === 0) {
          freeCells.push({ i, j });
        }
      });
    });

    if (freeCells.length === 0) {
      this.#status = 'lose';

      return;
    }

    const placeRandom = Math.floor(Math.random() * freeCells.length);
    const coords = freeCells[placeRandom];
    const number = Math.random() < 0.9 ? 2 : 4;

    this.#state[coords.i][coords.j] = number;

    this.#lastPosition = {
      x: coords.i,
      y: coords.j,
    };
  }

  // Add your own methods here
}

module.exports = Game;
