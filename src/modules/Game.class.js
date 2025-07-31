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
    this.initialState = initialState;
    this.gameScore = 0;
    this.state = [...this.initialState];
    this.size = 4; // The size of the board (4x4)
    this.lastGameScore = 2048; // The score to win the game
    this.status = 'idle';
  }

  start() {
    this.status = 'playing';

    this.addCell();
    this.addCell();
  }

  restart() {
    this.status = 'idle';

    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.gameScore = 0;
  }

  getScore() {
    return this.gameScore;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  moveLeft() {
    let canMove = false;
    const newState = [];

    for (let i = 3; i >= 0; i--) {
      const row = this.state[i].filter((number) => number !== 0);

      for (let n = 1; n < row.length; n++) {
        if (row[n] === row[n - 1]) {
          row[n - 1] *= 2;
          delete row[n];

          this.gameScore += row[n - 1];
        }
      }

      const newRow = row.filter((number) => number !== undefined);

      for (let j = newRow.length; j < this.size; j++) {
        newRow.push(0);
      }

      newState[i] = newRow;
    }

    for (let i = 0; i <= this.size - 1; i++) {
      for (let n = 0; n <= this.size - 1; n++) {
        if (newState[i][n] !== this.state[i][n]) {
          canMove = true;
        }
      }
    }

    if (canMove) {
      this.state = newState;
      this.addCell();
    }

    this.isLose();
    this.isWin();
  }

  moveRight() {
    const newState = [];
    let canMove = false;

    for (let i = 3; i >= 0; i--) {
      const row = this.state[i].filter((number) => number !== 0);

      for (let n = row.length - 1; n >= 0; n--) {
        if (row[n] === row[n - 1]) {
          row[n] *= 2;
          row[n - 1] = 0;

          this.gameScore += row[n];
        }
      }

      const newRow = row.filter((number) => number !== 0);

      for (let j = newRow.length; j < this.size; j++) {
        newRow.unshift(0);
      }

      newState[i] = newRow;
    }

    for (let i = 0; i <= 3; i++) {
      for (let n = 0; n <= 3; n++) {
        if (newState[i][n] !== this.state[i][n]) {
          canMove = true;
        }
      }
    }

    if (canMove) {
      this.state = newState;
      this.addCell();
    }

    this.isLose();
    this.isWin();
  }

  moveUp() {
    this.state = this.updateState(this.state);

    this.moveLeft();

    this.state = this.updateState(this.state);
  }

  moveDown() {
    this.state = this.updateState(this.state);

    this.moveRight();

    this.state = this.updateState(this.state);
  }

  addCell() {
    const initial = Math.random() > 0.1 ? 2 : 4;
    let count = 0;

    do {
      const row = Math.round(Math.random() * 3);
      const column = Math.round(Math.random() * 3);

      if (this.state[row][column] === 0) {
        this.state[row][column] = initial;
        count++;
      }
    } while (count < 1);
  }

  updateState(state) {
    const newState = [];

    for (let i = 0; i <= this.size - 1; i++) {
      newState.push([state[0][i], state[1][i], state[2][i], state[3][i]]);
    }

    return newState;
  }

  isWin() {
    for (let i = 0; i <= this.size - 1; i++) {
      for (let n = 0; n <= this.size - 1; n++) {
        if (this.state[i][n] === this.lastGameScore) {
          this.status = 'win';
        }
      }
    }
  }

  isLose() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.state[i][j] === 0) {
          return;
        }

        if (
          (i < 3 && this.state[i][j] === this.state[i + 1][j]) ||
          (j < 3 && this.state[i][j] === this.state[i][j + 1])
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

export default Game;
