'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export class Game {
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

  constructor() {
    // this.state = [
    //   [0, 0, 0, 0],
    //   [0, 0, 0, 0],
    //   [0, 0, 0, 0],
    //   [0, 0, 0, 0],
    // ];
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.prevState = this.state;
    this.status = 'idle';
  }

  saveState() {
    this.prevState = this.state.map((arr) => arr.slice());
  }

  generateInitialValues() {
    const initialX1 = Math.floor(Math.random() * 4);
    let initialX2 = Math.floor(Math.random() * 4);
    const initialY1 = Math.floor(Math.random() * 4);
    let initialY2 = Math.floor(Math.random() * 4);
    // eslint-disable-next-line no-console

    // console.log(`initialX1 = ${initialX1}`);
    // console.log(`initialY1 = ${initialY1}`);
    // console.log(`initialX2 = ${initialX2}`);
    // console.log(`initialY2 = ${initialY2}`);

    while (initialX1 === initialX2 && initialY1 === initialY2) {
      initialX2 = Math.floor(Math.random() * 4);
      initialY2 = Math.floor(Math.random() * 4);
    }
    // check if hit on the same spot

    this.state[initialX1][initialY1] = 2;
    this.state[initialX2][initialY2] = 2;
  }

  moveLeft() {
    this.saveState();

    for (let x = 0; x < this.state.length; x++) {
      const rowValues = {
        0: this.state[x][0], // [0+][x]
        1: this.state[x][1],
        2: this.state[x][2],
        3: this.state[x][3],
      };

      const count = [];

      for (const key in rowValues) {
        if (rowValues[key] > 0) {
          count.push(Number(key));
        }
      }

      switch (count.length) {
        case 1:
          this.state[x][0] = rowValues[count[0]];

          if (count[0] !== 0) {
            this.state[x][count[0]] = 0;
          }
          break;
        case 2:
          if (rowValues[count[0]] === rowValues[count[1]]) {
            this.state[x][0] = rowValues[count[0]] * 2;
            this.score += rowValues[count[0]] * 2;
            this.state[x][1] = 0;
          } else {
            this.state[x][0] = rowValues[count[0]];
            this.state[x][1] = rowValues[count[1]];
          }
          this.state[x][2] = 0;
          this.state[x][3] = 0;
          break;
        case 3:
          if (rowValues[count[0]] === rowValues[count[1]]) {
            this.state[x][0] = rowValues[count[0]] * 2;
            this.score += rowValues[count[0]] * 2;
            this.state[x][1] = rowValues[count[2]];
            this.state[x][2] = 0;
            this.state[x][3] = 0;
          } else if (
            rowValues[count[1]] === rowValues[count[2]] &&
            rowValues[count[0]] !== rowValues[count[1]]
          ) {
            this.state[x][0] = rowValues[count[0]];
            this.state[x][1] = rowValues[count[1]] * 2;
            this.score += rowValues[count[1]] * 2;
            this.state[x][2] = 0;
            this.state[x][3] = 0;
          } else {
            this.state[x][0] = rowValues[count[0]];
            this.state[x][1] = rowValues[count[1]];
            this.state[x][2] = rowValues[count[2]];
            this.state[x][3] = 0;
          }
          break;
        case 4:
          if (rowValues[count[0]] === rowValues[count[1]]) {
            this.state[x][0] = rowValues[count[0]] * 2;
            this.score += rowValues[count[0]] * 2;
            this.state[x][1] = 0;
          } else if (rowValues[count[1]] === rowValues[count[2]]) {
            this.state[x][1] = rowValues[count[1]] * 2;
            this.score += rowValues[count[1]] * 2;
            this.state[x][2] = 0;
          }

          if (
            rowValues[count[2]] === rowValues[count[3]] &&
            rowValues[count[1]] !== rowValues[count[2]]
          ) {
            this.state[x][2] = rowValues[count[2]] * 2;
            this.score += rowValues[count[2]] * 2;
            this.state[x][3] = 0;
          }

          if (this.state[x][1] === 0) {
            this.state[x][1] = this.state[x][2];
            this.state[x][2] = 0;
          }

          if (this.state[x][2] === 0) {
            this.state[x][2] = this.state[x][3];
            this.state[x][3] = 0;
          }
          break;
        default:
          break;
      }
    }
    this.addNewNumberToFreeCell();
  }

  moveRight() {
    this.saveState();

    for (let x = 0; x < this.state.length; x++) {
      const rowValues = {
        0: this.state[x][0], // [0+][x]
        1: this.state[x][1],
        2: this.state[x][2],
        3: this.state[x][3],
      };

      const count = [];

      for (const key in rowValues) {
        if (rowValues[key] > 0) {
          count.push(Number(key));
        }
      }

      count.reverse();

      switch (count.length) {
        case 1:
          this.state[x][3] = rowValues[count[0]];

          if (count[0] !== 3) {
            this.state[x][count[0]] = 0;
          }

          break;
        case 2:
          if (rowValues[count[0]] === rowValues[count[1]]) {
            this.state[x][3] = rowValues[count[0]] * 2;
            this.score += rowValues[count[0]] * 2;
            this.state[x][2] = 0;
          } else {
            this.state[x][3] = rowValues[count[0]];
            this.state[x][2] = rowValues[count[1]];
          }

          this.state[x][0] = 0;
          this.state[x][1] = 0;
          break;
        case 3:
          if (rowValues[count[0]] === rowValues[count[1]]) {
            this.state[x][3] = rowValues[count[0]] * 2;
            this.score += rowValues[count[0]] * 2;
            this.state[x][2] = rowValues[count[2]];
            this.state[x][1] = 0;
            this.state[x][0] = 0;
          } else if (
            rowValues[count[1]] === rowValues[count[2]] &&
            rowValues[count[0]] !== rowValues[count[1]]
          ) {
            this.state[x][3] = rowValues[count[0]];
            this.state[x][2] = rowValues[count[1]] * 2;
            this.score += rowValues[count[1]] * 2;
            this.state[x][1] = 0;
            this.state[x][0] = 0;
          } else {
            this.state[x][3] = rowValues[count[0]];
            this.state[x][2] = rowValues[count[1]];
            this.state[x][1] = rowValues[count[2]];
            this.state[x][0] = 0;
          }
          break;
        case 4:
          if (rowValues[count[0]] === rowValues[count[1]]) {
            this.state[x][3] = rowValues[count[0]] * 2;
            this.score += rowValues[count[0]] * 2;
            this.state[x][2] = 0;
          } else if (rowValues[count[1]] === rowValues[count[2]]) {
            this.state[x][2] = rowValues[count[1]] * 2;
            this.score += rowValues[count[1]] * 2;
            this.state[x][1] = 0;
          }

          if (
            rowValues[count[2]] === rowValues[count[3]] &&
            rowValues[count[1]] !== rowValues[count[2]]
          ) {
            this.state[x][1] = rowValues[count[2]] * 2;
            this.score += rowValues[count[2]] * 2;
            this.state[x][0] = 0;
          }

          if (this.state[x][2] === 0) {
            this.state[x][2] = this.state[x][1];
            this.state[x][1] = 0;
          }

          if (this.state[x][1] === 0) {
            this.state[x][1] = this.state[x][0];
            this.state[x][0] = 0;
          }

          break;
        default:
          break;
      }
    }
    this.addNewNumberToFreeCell();
  }

  moveUp() {
    this.saveState();

    for (let x = 0; x < this.state.length; x++) {
      const rowValues = {
        0: this.state[0][x], // [0+][x]
        1: this.state[1][x],
        2: this.state[2][x],
        3: this.state[3][x],
      };

      const count = [];

      for (const key in rowValues) {
        if (rowValues[key] > 0) {
          count.push(Number(key));
        }
      }

      switch (count.length) {
        case 1:
          this.state[0][x] = rowValues[count[0]];

          if (count[0] !== 0) {
            this.state[count[0]][x] = 0;
          }
          break;
        case 2:
          if (rowValues[count[0]] === rowValues[count[1]]) {
            this.state[0][x] = rowValues[count[0]] * 2;
            this.score += rowValues[count[0]] * 2;
            this.state[1][x] = 0;
          } else {
            this.state[0][x] = rowValues[count[0]];
            this.state[1][x] = rowValues[count[1]];
          }
          this.state[2][x] = 0;
          this.state[3][x] = 0;

          break;
        case 3:
          if (rowValues[count[0]] === rowValues[count[1]]) {
            this.state[0][x] = rowValues[count[0]] * 2;
            this.score += rowValues[count[0]] * 2;
            this.state[1][x] = rowValues[count[2]];
            this.state[2][x] = 0;
            this.state[3][x] = 0;
          } else if (
            rowValues[count[1]] === rowValues[count[2]] &&
            rowValues[count[0]] !== rowValues[count[1]]
          ) {
            this.state[0][x] = rowValues[count[0]];
            this.state[1][x] = rowValues[count[1]] * 2;
            this.score += rowValues[count[1]] * 2;
            this.state[2][x] = 0;
            this.state[3][x] = 0;
          } else {
            this.state[0][x] = rowValues[count[0]];
            this.state[1][x] = rowValues[count[1]];
            this.state[2][x] = rowValues[count[2]];
            this.state[3][x] = 0;
          }
          break;
        case 4:
          if (rowValues[count[0]] === rowValues[count[1]]) {
            this.state[0][x] = rowValues[count[0]] * 2;
            this.score += rowValues[count[0]] * 2;
            this.state[1][x] = 0;
          } else if (rowValues[count[1]] === rowValues[count[2]]) {
            this.state[1][x] = rowValues[count[1]] * 2;
            this.score += rowValues[count[1]] * 2;
            this.state[2][x] = 0;
          }

          if (
            rowValues[count[2]] === rowValues[count[3]] &&
            rowValues[count[1]] !== rowValues[count[2]]
          ) {
            this.state[2][x] = rowValues[count[2]] * 2;
            this.state[3][x] = 0;
          }

          if (this.state[1][x] === 0) {
            this.state[1][x] = this.state[2][x];
            this.state[2][x] = 0;
          }

          if (this.state[2][x] === 0) {
            this.state[2][x] = this.state[3][x];
            this.state[3][x] = 0;
          }

          break;
        default:
          break;
      }
    }
    this.addNewNumberToFreeCell();
  }

  moveDown() {
    this.saveState();

    for (let x = 0; x < this.state.length; x++) {
      const rowValues = {
        0: this.state[0][x], // [0+][x]
        1: this.state[1][x],
        2: this.state[2][x],
        3: this.state[3][x],
      };

      const count = [];

      for (const key in rowValues) {
        if (rowValues[key] > 0) {
          count.push(Number(key));
        }
      }
      count.reverse();

      switch (count.length) {
        case 1:
          this.state[3][x] = rowValues[count[0]];

          if (count[0] !== 3) {
            this.state[count[0]][x] = 0;
          }
          break;
        case 2:
          if (rowValues[count[0]] === rowValues[count[1]]) {
            this.state[3][x] = rowValues[count[0]] * 2;
            this.score += rowValues[count[0]] * 2;
            this.state[2][x] = 0;
          } else {
            this.state[3][x] = rowValues[count[0]];
            this.state[2][x] = rowValues[count[1]];
          }
          this.state[0][x] = 0;
          this.state[1][x] = 0;
          break;
        case 3:
          if (rowValues[count[0]] === rowValues[count[1]]) {
            this.state[3][x] = rowValues[count[0]] * 2;
            this.score += rowValues[count[0]] * 2;
            this.state[2][x] = rowValues[count[2]];
            this.state[1][x] = 0;
            this.state[0][x] = 0;
          } else if (
            rowValues[count[1]] === rowValues[count[2]] &&
            rowValues[count[0]] !== rowValues[count[1]]
          ) {
            this.state[3][x] = rowValues[count[0]];
            this.state[2][x] = rowValues[count[1]] * 2;
            this.score += rowValues[count[1]] * 2;
            this.state[1][x] = 0;
            this.state[0][x] = 0;
          } else {
            this.state[3][x] = rowValues[count[0]];
            this.state[2][x] = rowValues[count[1]];
            this.state[1][x] = rowValues[count[2]];
            this.state[0][x] = 0;
          }
          break;
        case 4:
          if (rowValues[count[0]] === rowValues[count[1]]) {
            this.state[3][x] = rowValues[count[0]] * 2;
            this.score += rowValues[count[0]] * 2;
            this.state[2][x] = 0;
          } else if (rowValues[count[1]] === rowValues[count[2]]) {
            this.state[2][x] = rowValues[count[1]] * 2;
            this.score += rowValues[count[1]] * 2;
            this.state[1][x] = 0;
          }

          if (
            rowValues[count[2]] === rowValues[count[3]] &&
            rowValues[count[1]] !== rowValues[count[2]]
          ) {
            this.state[1][x] = rowValues[count[2]] * 2;
            this.score += rowValues[count[2]] * 2;
            this.state[0][x] = 0;
          }

          if (this.state[2][x] === 0) {
            this.state[2][x] = this.state[1][x];
            this.state[1][x] = 0;
          }

          if (this.state[1][x] === 0) {
            this.state[1][x] = this.state[0][x];
            this.state[0][x] = 0;
          }

          break;
        default:
          break;
      }
    }
    this.addNewNumberToFreeCell();
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
    return this.state.map((arr) => arr.slice());
  }

  /**
   * Returns the current game statusr.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    this.checkLoseStatus();
    this.checkWinStatus();

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.score = 0;
    this.generateInitialValues();
    this.status = 'playing';
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
    this.prevState = this.state;
    this.start();
  }

  // Add your own methods here
  addNewNumberToFreeCell() {
    if (JSON.stringify(this.state) !== JSON.stringify(this.prevState)) {
      const notRandomNumbers = [2, 2, 2, 2, 2, 4, 2, 2, 2, 2];
      const rndIdx = Math.floor(Math.random() * notRandomNumbers.length);

      const freeCeels = [];

      for (let x = 0; x < this.state.length; x++) {
        for (let y = 0; y < this.state[x].length; y++) {
          const value = this.state[x][y];

          if (!value) {
            freeCeels.push({
              x: x,
              y: y,
            });
          }
        }
      }

      const cellRndIdx = Math.floor(Math.random() * (freeCeels.length - 0));

      this.state[freeCeels[cellRndIdx].x][freeCeels[cellRndIdx].y] =
        notRandomNumbers[rndIdx];

      // console.log(this.getState());
    }
  }

  checkWinStatus() {
    for (const target of this.state) {
      for (const target1 of target) {
        if (target1 === 2048) {
          this.status = 'win';

          return;
        }
      }
    }
  }

  checkLoseStatus() {
    const currentScore = this.score;
    const currentState = this.state.map((arr) => arr.slice());
    const currentPrevState = this.prevState.map((arr) => arr.slice());

    this.moveLeft();
    this.moveRight();
    this.moveUp();
    this.moveDown();

    if (JSON.stringify(this.state) === JSON.stringify(currentState)) {
      this.status = 'lose';
    } else {
      this.score = currentScore;
      this.state = currentState;
      this.prevState = currentPrevState;
    }
  }
}

module.exports = Game;
