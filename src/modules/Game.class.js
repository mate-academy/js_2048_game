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
    this.score = 0;
  }

  init = false;

  /* 
  [
  [0, 0, 0, 0], // row 0
  [0, 0, 0, 0], // row 1
  [4, 0, 0, 0], // row 2
  [0, 0, 0, 0]  // row 3
]
  */

  matriz = [
    [0, 0, 0, 0], // row 0
    [0, 0, 0, 0], // row 1
    [4, 0, 0, 0], // row 2
    [0, 0, 0, 0], // row 3
  ];

  moveLeft() {
    // alert('left');
    // this.matriz = [0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < this.matriz.length; i++) {
      if (this.matriz[i] !== 0 && this.matriz[i - 1] === 0) {
        // left corner indexes
        if (i !== 3 && i !== 7 && i !== 11 && i !== 15) {
          this.matriz[i - 1] = this.matriz[i];
          this.matriz[i] = 0;
        }
      }

      if (this.matriz[i] !== 0 && this.matriz[i] === this.matriz[i - 1]) {
        // left corner indexes
        if (i !== 3 && i !== 7 && i !== 11 && i !== 15) {
          const value = this.matriz[i] * 2;

          this.matriz[i - 1] = value;
          this.matriz[i] = 0;

          this.score += value;
        }
      }
    }
    this.refresh();
  }
  moveRight() {
    // alert('right');
    // this.matriz = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0];

    /* const slotNot0 = this.matriz.reduce((slot) => {
      return slot !== 0;
    });
    */

    for (let i = this.matriz.length - 2; i >= 0; i--) {
      if (this.matriz[i] !== 0 && this.matriz[i + 1] === 0) {
        // right corner indexes
        if (i !== 3 && i !== 7 && i !== 11 && i !== 15) {
          this.matriz[i + 1] = this.matriz[i];
          this.matriz[i] = 0;
        }
      }

      if (this.matriz[i] !== 0 && this.matriz[i] === this.matriz[i + 1]) {
        // right corner indexes
        if (i !== 3 && i !== 7 && i !== 11 && i !== 15) {
          const value = this.matriz[i] * 2;

          this.matriz[i + 1] = value;
          this.matriz[i] = 0;

          this.score += value;
        }
      }
    }
    this.refresh();
  }
  moveUp() {
    // alert('up');
    // this.matriz = [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < this.matriz.length; i++) {
      if (this.matriz[i] !== 0 && this.matriz[i - 4] === 0) {
        if (i >= 4) {
          this.matriz[i - 4] = this.matriz[i];
          this.matriz[i] = 0;
        }
      }

      if (this.matriz[i] !== 0 && this.matriz[i] === this.matriz[i - 4]) {
        if (i >= 4) {
          const value = this.matriz[i] * 2;

          this.matriz[i - 4] = value;
          this.matriz[i] = 0;

          this.score += value;
        }
      }
    }
    this.isGameOver();
  }
  moveDown() {
    // alert('down');
    // this.matriz = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0];
    for (let i = this.matriz.length - 2; i >= 0; i--) {
      if (this.matriz[i] !== 0 && this.matriz[i + 4] === 0) {
        if (i < 12) {
          const value = this.matriz[i] * 2;

          this.matriz[i + 4] = this.matriz[i];
          this.matriz[i] = 0;

          this.score += value;
        }
      }

      if (this.matriz[i] !== 0 && this.matriz[i] === this.matriz[i + 4]) {
        if (i < 12) {
          this.matriz[i + 4] = this.matriz[i] * 2;
          this.matriz[i] = 0;
        }
      }
    }
    this.refresh();
  }
  random42() {
    const number = Math.random();

    if (number < 0.1) {
      return 4;
    } else {
      return 2;
    }
  }

  isGameOver() {
    const hasMoves = this.matriz.some((value, i) => {
      return (
        value === 0 ||
        (i % 4 !== 3 && value === this.matriz[i + 1]) ||
        (i < 12 && value === this.matriz[i + 4])
      );
    });

    if (!hasMoves) {
      alert('Game Over');
    }

    return true;
  }

  refresh() {
    const blank = [];

    for (let i = 0; i < this.matriz.length; i++) {
      if (this.matriz[i] === 0) {
        blank.push(i);
      }
    }

    if (blank.length > 0) {
      const randomSlot = Math.floor(Math.random() * blank.length);
      const choice = blank[randomSlot];

      this.matriz[choice] = this.random42();
    }

    // console.log(this.matriz);
    this.isGameOver();
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
    return this.matriz;
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
    if (this.matriz.includes(2048)) {
      return 'win';
    } else {
      return this.isGameOver() ? 'lose' : 'playing';
    }
  }

  /**
   * Starts the game.
   */
  start() {
    this.init = true;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.matriz = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    this.refresh();
  }

  // Add your own methods here
}

module.exports = Game;
