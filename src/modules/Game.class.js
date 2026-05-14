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
    this.init = false;

    this.matriz = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  /* 
  [
  [0, 0, 0, 0], // row 0
  [0, 0, 0, 0], // row 1
  [0, 0, 0, 0], // row 2
  [0, 0, 0, 0]  // row 3
]
  */

  moveLeft() {
    // alert('left');
    // this.matriz = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0];
    let changeNumber = false;

    const changeMatriz = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    for (let x = 0; x < 4; x++) {
      for (let y = 1; y < 4; y++) {
        if (this.matriz[x][y] !== 0) {
          let column = y;

          while (column > 0 && this.matriz[x][column - 1] === 0) {
            this.matriz[x][column - 1] = this.matriz[x][column];
            this.matriz[x][column] = 0;
            column -= 1;
            changeNumber = true;
          }

          if (
            column > 0 &&
            this.matriz[x][column - 1] === this.matriz[x][column] &&
            !changeMatriz[x][column - 1]
          ) {
            const sumValue = this.matriz[x][column] * 2;

            this.matriz[x][column - 1] = sumValue;
            this.matriz[x][column] = 0;
            this.score += sumValue;

            changeMatriz[x][column - 1] = true;
          }
        }
      }
    }

    if (changeNumber === true) {
      this.refresh();
    }
  }
  moveRight() {
    // alert('right');
    // this.matriz = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0, 0];

    /* const slotNot0 = this.matriz.reduce((slot) => {
      return slot !== 0;
    });
    */
    let changeNumber = false;
    const changeMatriz = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    for (let x = 3; x >= 0; x--) {
      for (let y = 3; y >= 0; y--) {
        if (this.matriz[x][y] !== 0) {
          let column = y;

          while (column < 4 && this.matriz[x][column + 1] === 0) {
            this.matriz[x][column + 1] = this.matriz[x][column];
            this.matriz[x][column] = 0;
            column += 1;
            changeNumber = true;
          }

          if (
            column < 4 &&
            this.matriz[x][column + 1] === this.matriz[x][column] &&
            !changeMatriz[x][column + 1]
          ) {
            const sumValue = this.matriz[x][column] * 2;

            this.matriz[x][column + 1] = sumValue;
            this.matriz[x][column] = 0;
            this.score += sumValue;
            changeMatriz[x][column - 1] = true;
          }
        }
      }
    }

    if (changeNumber === true) {
      this.refresh();
    }
  }
  moveUp() {
    // alert('up');
    // this.matriz = [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let changeNumber = false;
    const changeMatriz = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    for (let y = 0; y < 4; y++) {
      for (let x = 1; x < 4; x++) {
        if (this.matriz[x][y] !== 0) {
          let row = x;

          while (row > 0 && this.matriz[row - 1][y] === 0) {
            this.matriz[row - 1][y] = this.matriz[row][y];
            this.matriz[row][y] = 0;
            row--;
            changeNumber = true;
          }

          if (
            row > 0 &&
            this.matriz[row - 1][y] === this.matriz[row][y] &&
            !changeMatriz[row - 1][y]
          ) {
            const sumValue = this.matriz[row][y] * 2;

            this.matriz[row - 1][y] = sumValue;
            this.matriz[row][y] = 0;
            this.score += sumValue;
            changeMatriz[row - 1][y] = true;
          }
        }
      }
    }

    if (changeNumber === true) {
      this.refresh();
    }
  }
  moveDown() {
    // alert('down');
    // this.matriz = [4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    let changeNumber = false;
    const changeMatriz = [
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
      [false, false, false, false],
    ];

    for (let y = 0; y < 4; y++) {
      for (let x = 2; x >= 0; x--) {
        if (this.matriz[x][y] !== 0) {
          let row = x;

          while (row < 3 && this.matriz[row + 1][y] === 0) {
            this.matriz[row + 1][y] = this.matriz[row][y];
            this.matriz[row][y] = 0;
            row += 1;
            changeNumber = true;
          }

          if (
            row < 3 &&
            this.matriz[row + 1][y] === this.matriz[row][y] &&
            !changeMatriz[row + 1][y]
          ) {
            const sumValue = this.matriz[row][y] * 2;

            this.matriz[row + 1][y] = sumValue;
            this.matriz[row][y] = 0;
            this.score += sumValue;
            changeMatriz[row + 1][y] = true;
          }
        }
      }
    }

    if (changeNumber === true) {
      this.refresh();
    }
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
    const flatMatriz = this.matriz.flat();

    const hasMoves = flatMatriz.some((value, i) => {
      return (
        value === 0 ||
        (i % 4 !== 3 && value === flatMatriz[i + 1]) ||
        (i < 12 && value === flatMatriz[i + 4])
      );
    });

    return !hasMoves;
  }

  refresh() {
    const blank = [];

    for (let i = 0; i < 4; i++) {
      for (let d = 0; d < 4; d++) {
        if (this.matriz[i][d] === 0) {
          blank.push({ linha: i, coluna: d });
        }
      }
    }

    if (blank.length > 0) {
      const randomSlot = Math.floor(Math.random() * blank.length);
      const localEscolhido = blank[randomSlot];

      this.matriz[localEscolhido.linha][localEscolhido.coluna] =
        this.random42();
    }

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
    if (!this.init) {
      return 'idle';
    }

    for (let i = 0; i < 4; i++) {
      for (let d = 0; d < 4; d++) {
        if (this.matriz[i][d] === 2048) {
          return 'win';
        }
      }
    }

    return this.isGameOver() ? 'lose' : 'playing';
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
    this.matriz = [
      [0, 0, 0, 0], // row 0
      [0, 0, 0, 0], // row 1
      [0, 0, 0, 0], // row 2
      [0, 0, 0, 0], // row 3
    ];
    this.score = 0;
    this.refresh();
  }

  // Add your own methods here
}

module.exports = Game;
