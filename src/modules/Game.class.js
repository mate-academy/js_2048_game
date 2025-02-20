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
    this.score = 0;
    this.scoreVal = document.querySelector('.game-score');

    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.arr = this.field.map((row) => [...row]);
  }

  shiftLeft() {
    let empty = -1;

    for (let i = 0; i < 4; i++) {
      empty = -1;

      for (let j = 0; j < 4; j++) {
        if (this.field[i][j] === 0 && empty === -1) {
          empty = j;
        } else if (this.field[i][j] !== 0 && empty !== -1) {
          this.field[i][empty] = this.field[i][j];
          this.field[i][j] = 0;
          empty++;
        }
      }
    }
  }

  moveLeft() {
    this.shiftLeft();

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          this.field[i][j] !== 0 &&
          this.field[i][j] === this.field[i][j + 1]
        ) {
          const newVal = this.field[i][j] * 2;

          this.field[i][j] = newVal;
          this.field[i][j + 1] = 0;

          this.score += newVal;
          this.getScore();
        }
      }
    }

    this.shiftLeft();
  }

  shiftRight() {
    let empty = -1;

    for (let i = 0; i < 4; i++) {
      empty = -1;

      for (let j = 3; j >= 0; j--) {
        if (this.field[i][j] === 0 && empty === -1) {
          empty = j;
        } else if (this.field[i][j] !== 0 && empty !== -1) {
          this.field[i][empty] = this.field[i][j];
          this.field[i][j] = 0;
          empty--;
        }
      }
    }
  }

  moveRight() {
    this.shiftRight();

    for (let i = 0; i < 4; i++) {
      for (let j = 3; j >= 0; j--) {
        if (
          this.field[i][j] !== 0 &&
          this.field[i][j] === this.field[i][j - 1]
        ) {
          const newVal = this.field[i][j] * 2;

          this.field[i][j] = newVal;
          this.field[i][j - 1] = 0;

          this.score += newVal;
          this.getScore();
        }
      }
    }

    this.shiftRight();
  }

  shiftUp() {
    for (let j = 0; j < 4; j++) {
      let empty = -1;

      for (let i = 0; i < 4; i++) {
        if (this.field[i][j] === 0 && empty === -1) {
          empty = i;
        } else if (this.field[i][j] !== 0 && empty !== -1) {
          if (i !== empty) {
            this.field[empty][j] = this.field[i][j];
            this.field[i][j] = 0;
            empty++;
          }
        }
      }
    }
  }

  moveUp() {
    this.shiftUp();

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          this.field[j][i] !== 0 &&
          this.field[j][i] === this.field[j + 1][i]
        ) {
          const newVal = this.field[j][i] * 2;

          this.field[j][i] = newVal;
          this.field[j + 1][i] = 0;

          this.score += newVal;
        }
      }
    }

    this.shiftUp();
  }

  shiftDown() {
    let empty = -1;

    for (let i = 0; i < 4; i++) {
      empty = -1;

      for (let j = 3; j >= 0; j--) {
        if (this.field[j][i] === 0 && empty === -1) {
          empty = j;
        } else if (this.field[j][i] !== 0 && empty !== -1) {
          this.field[empty][i] = this.field[j][i];
          this.field[j][i] = 0;
          empty--;
        }
      }
    }
  }

  moveDown() {
    this.shiftDown();

    for (let i = 0; i < 4; i++) {
      for (let j = 3; j > 0; j--) {
        if (
          this.field[j][i] !== 0 &&
          this.field[j][i] === this.field[j - 1][i]
        ) {
          const newVal = this.field[j][i] * 2;

          this.field[j][i] = newVal;
          this.field[j - 1][i] = 0;

          this.score += newVal;
          this.getScore();
        }
      }
    }

    this.shiftDown();
  }

  /**
   * @returns {number}
   */
  getScore() {
    this.scoreVal.textContent = this.score;

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
    let emptyField = true;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.field[i][j] !== 0) {
          emptyField = false;
        }
      }
    }

    if (emptyField) {
      return 'idle';
    }

    if (this.winerGame()) {
      return 'win';
    }

    if (!this.canMove()) {
      return 'lose';
    }

    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    this.generateCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.field[i][j] = 0;
      }
    }

    this.generateCell();
    this.generateCell();

    this.score = 0;
    this.getScore();
  }

  // Add your own methods here
  generateCell() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.field[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { x, y } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      if (this.field[x][y] === 0) {
        this.field[x][y] = Math.random() < 0.9 ? 2 : 4;
      }
    }
  }

  canMove() {
    let game = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.field[j][i] === 0) {
          game = true;
        }

        if (this.field[j][i] !== 0) {
          if (
            this.field[j][i] === this.field[j + 1][i] ||
            this.field[i][j] === this.field[i][j + 1]
          ) {
            game = true;
          }
        }
      }

      for (let j = 3; j > 0; j--) {
        if (this.field[j][i] === 0) {
          game = true;
        }

        if (this.field[j][i] !== 0) {
          if (
            this.field[j][i] === this.field[j - 1][i] ||
            this.field[i][j] === this.field[i][j - 1]
          ) {
            game = true;
          }
        }
      }
    }

    return game;
  }

  winerGame() {
    let win = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.field[i][j] === 2048) {
          win = true;
        }
      }
    }

    return win;
  }

  isMoveMade(previousField) {
    const moved = previousField !== JSON.stringify(this.field);

    return moved;
  }
}

module.exports = Game;
