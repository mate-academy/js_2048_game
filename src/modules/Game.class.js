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
  constructor(initialState = []) {
    this.field = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
  }

  alg(row) {
    const noZero = row.filter((n) => n !== 0);
    const merged = [];

    for (let i = 0; i < noZero.length; i++) {
      if (noZero[i] === noZero[i + 1]) {
        merged.push(noZero[i] * 2);
        i++;
        this.score += noZero[i] * 2;
      } else {
        merged.push(noZero[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  moveLeft() {
    const field = JSON.stringify(this.field);

    for (let row = 0; row < 4; row++) {
      this.field[row] = this.alg(this.field[row]);
    }
    this.checkGameStatus();

    if (field !== JSON.stringify(this.field)) {
      this.addRandomNumber();
    }
  }

  moveRight() {
    const field = JSON.stringify(this.field);

    for (let row = 0; row < 4; row++) {
      const reversed = this.field[row].reverse();
      const moved = this.alg(reversed);

      this.field[row] = moved.reverse();
    }
    this.checkGameStatus();

    if (field !== JSON.stringify(this.field)) {
      this.addRandomNumber();
    }
  }

  moveUp() {
    const field = JSON.stringify(this.field);

    for (let col = 0; col < 4; col++) {
      const column = [
        this.field[0][col],
        this.field[1][col],
        this.field[2][col],
        this.field[3][col],
      ];

      const moved = this.alg(column);

      for (let row = 0; row < 4; row++) {
        this.field[row][col] = moved[row];
      }
    }
    this.checkGameStatus();

    if (field !== JSON.stringify(this.field)) {
      this.addRandomNumber();
    }
  }

  moveDown() {
    const field = JSON.stringify(this.field);

    for (let col = 0; col < 4; col++) {
      const column = [
        this.field[0][col],
        this.field[1][col],
        this.field[2][col],
        this.field[3][col],
      ];

      const reversed = column.reverse();
      const moved = this.alg(reversed);
      const result = moved.reverse();

      for (let row = 0; row < 4; row++) {
        this.field[row][col] = result[row];
      }
    }
    this.checkGameStatus();

    if (field !== JSON.stringify(this.field)) {
      this.addRandomNumber();
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
    return this.field;
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

    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    for (let i = 0; i < 2; i++) {
      const random = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const index = emptyCells.indexOf(random);

      emptyCells.splice(index, 1);

      const value = Math.random() < 0.1 ? 4 : 2;

      this.field[random[0]][random[1]] = value;
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.start();
  }

  // Add your own methods here

  checkGameStatus() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    const hasEmptyCells = this.field.some((row) => row.includes(0));

    if (hasEmptyCells) {
      this.status = 'playing';

      return;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.field[row][col];

        if (col < 3 && current === this.field[row][col + 1]) {
          this.status = 'playing';

          return;
        }

        if (row < 3 && current === this.field[row + 1][col]) {
          this.status = 'playing';

          return;
        }
      }
    }

    this.status = 'lose';
  }

  addRandomNumber() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomCells =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.field[randomCells.row][randomCells.col] = value;
  }
}

module.exports = Game;
