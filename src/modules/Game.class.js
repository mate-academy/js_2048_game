'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static LEFT = 'LEFT';
  static RIGHT = 'RIGHT';

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
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.state =
      initialState ||
      Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  baseMove(diraction, needTranspose = false) {
    let matrix = [...this.state];

    if (needTranspose) {
      matrix = this.transpose(matrix);
    }

    matrix = matrix.map((arr) => {
      let filteredArr = arr.filter((x) => x !== 0);
      let newArr = [];

      if (diraction === Game.LEFT) {
        filteredArr = filteredArr.reverse();
      }

      if (filteredArr.length > 0) {
        for (let i = filteredArr.length - 1; i >= 0; ) {
          if (filteredArr[i] === filteredArr[i - 1]) {
            const sum = filteredArr[i] * 2;

            newArr.unshift(sum);
            this.score += sum;
            i -= 2;
          } else {
            newArr.unshift(filteredArr[i]);
            i--;
          }
        }
      }

      while (newArr.length < this.size) {
        newArr.unshift(0);
      }

      if (diraction === Game.LEFT) {
        newArr = newArr.reverse();
      }

      return newArr;
    });

    if (needTranspose) {
      matrix = this.transpose(matrix);
    }
    this.state = matrix;

    this.addNewItem();
    this.checkGameStatus();
  }

  checkGameStatus() {
    if (this.state.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (!this.hasMoves()) {
      this.status = 'lose';
    }
  }

  hasMoves() {
    if (this.state.flat().includes(0)) {
      return true;
    }

    const matrix = [...this.state];
    const combinedArray = [...matrix, ...this.transpose(matrix)];

    for (const arr of combinedArray) {
      for (let i = arr.length - 1; i > 0; ) {
        if (arr[i] === arr[i - 1]) {
          i--;

          return true;
        } else {
          i--;
        }
      }
    }

    return false;
  }

  moveLeft() {
    this.baseMove(Game.LEFT);
  }

  moveRight() {
    this.baseMove(Game.RIGHT);
  }

  moveUp() {
    this.baseMove(Game.LEFT, true);
  }

  moveDown() {
    this.baseMove(Game.RIGHT, true);
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  addNewItem() {
    const freeCords = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          freeCords.push([i, j]);
        }
      }
    }

    const [k, l] = freeCords[Math.floor(Math.random() * freeCords.length)];

    this.state[k][l] = Math.random() < 0.9 ? 2 : 4;
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
    this.state = Array.from({ length: 4 }, () => Array(this.size).fill(0));
    this.score = 0;
    this.status = 'playing';
    this.addNewItem();
    this.addNewItem();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here
}

module.exports = Game;
