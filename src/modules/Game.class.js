'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
const startState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

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
    if (!initialState) {
      this.currentState = structuredClone(startState);
    } else {
      this.currentState = initialState;
    }
    // eslint-disable-next-line no-console
    // console.log(initialState);

    this.score = 0;
    this.status = 'idle';

    this.value1 = 2;
    this.value2 = 4;

    // compare fild version
  }

  // #region moveUp
  moveUp() {
    let V1 = '';
    let V2 = '';

    // // eslint-disable-next-line no-console
    // console.log(`it's moveUp |`);

    V1 = JSON.stringify(this.currentState);

    for (let i = 0; i < this.currentState.length; i++) {
      const temp = [];

      for (let j = 0; j < this.currentState[i].length; j++) {
        temp.push(this.currentState[j][i]);
      }

      const withoutZeros = [];

      for (let k = 0; k < temp.length; k++) {
        if (temp[k] !== 0) {
          withoutZeros.push(temp[k]);
        }
      }

      while (withoutZeros.length < temp.length) {
        withoutZeros.push(0);
      }

      for (let x = 0; x < startState.length - 1; x++) {
        if (withoutZeros[x] === withoutZeros[x + 1] && withoutZeros[x] !== 0) {
          withoutZeros[x] = withoutZeros[x] * 2;
          this.score += withoutZeros[x];
          withoutZeros[x + 1] = 0;
        }
      }

      const res = [];

      for (let y = 0; y < withoutZeros.length; y++) {
        if (withoutZeros[y] !== 0) {
          res.push(withoutZeros[y]);
        }
      }

      while (res.length < temp.length) {
        res.push(0);
      }

      for (let s = 0; s < withoutZeros.length; s++) {
        this.currentState[s][i] = res[s];
      }
    }

    V2 = JSON.stringify(this.currentState);

    if (V1 === V2) {
      return false;
    }

    return true;
  }

  // #endregion

  // #region moveDown
  moveDown() {
    let V1 = '';
    let V2 = '';

    // eslint-disable-next-line no-console
    console.log(`it's moveDown |`);

    V1 = JSON.stringify(this.currentState);

    for (let i = 0; i < this.currentState.length; i++) {
      const temp = [];

      for (let j = this.currentState[i].length - 1; j >= 0; j--) {
        temp.push(this.currentState[j][i]);
      }

      const withoutZeros = [];

      for (let k = 0; k < temp.length; k++) {
        if (temp[k] !== 0) {
          withoutZeros.push(temp[k]);
        }
      }

      // adding zeros

      while (withoutZeros.length < temp.length) {
        withoutZeros.push(0);
      }

      // I add the same values

      for (let x = 0; x < startState.length - 1; x++) {
        if (withoutZeros[x] === withoutZeros[x + 1] && withoutZeros[x] !== 0) {
          withoutZeros[x] = withoutZeros[x] * 2;
          this.score += withoutZeros[x];
          withoutZeros[x + 1] = 0;
        }
      }

      const res = [];

      for (let y = 0; y < withoutZeros.length; y++) {
        if (withoutZeros[y] !== 0) {
          res.push(withoutZeros[y]);
        }
      }

      while (res.length < temp.length) {
        res.push(0);
      }

      for (let s = 0; s <= withoutZeros.length - 1; s++) {
        const nInd = withoutZeros.length - 1 - s;

        this.currentState[nInd][i] = res[s];
      }
    }

    V2 = JSON.stringify(this.currentState);

    if (V1 === V2) {
      return false;
    }

    return true;
  }
  // #endregion

  // #region move left

  moveLeft() {
    let V1 = '';
    let V2 = '';

    V1 = JSON.stringify(this.currentState);

    // creating copies of each line
    for (let i = 0; i < this.currentState.length; i++) {
      const temp = [];

      for (let j = 0; j < this.currentState[i].length; j++) {
        temp.push(this.currentState[i][j]);
      }

      // line without zeros

      const withoutZeros = [];

      for (let k = 0; k < temp.length; k++) {
        if (temp[k] !== 0) {
          withoutZeros.push(temp[k]);
        }
      }

      // adding zeros

      while (withoutZeros.length < temp.length) {
        withoutZeros.push(0);
      }

      // I add the same values

      for (let x = 0; x < startState.length - 1; x++) {
        if (withoutZeros[x] === withoutZeros[x + 1] && withoutZeros[x] !== 0) {
          withoutZeros[x] = withoutZeros[x] * 2;
          this.score += withoutZeros[x];
          withoutZeros[x + 1] = 0;
        }
      }

      // make result masive

      const res = [];

      for (let y = 0; y < withoutZeros.length; y++) {
        if (withoutZeros[y] !== 0) {
          res.push(withoutZeros[y]);
        }
      }

      // add 0s
      while (res.length < temp.length) {
        res.push(0);
      }

      for (let s = 0; s <= res.length - 1; s++) {
        this.currentState[i][s] = res[s];
      }

      // eslint-disable-next-line no-console
      console.log('this.score-->>', this.score);
    }

    V2 = JSON.stringify(this.currentState);

    if (V1 === V2) {
      return false;
    }

    return true;
  }

  // #endregion

  // #region move Right

  moveRight() {
    let V1 = '';
    let V2 = '';

    V1 = JSON.stringify(this.currentState);

    for (let i = 0; i < this.currentState.length; i++) {
      const temp = [];

      for (let j = this.currentState[i].length - 1; j >= 0; j--) {
        temp.push(this.currentState[i][j]);
      }

      // line without zeros

      const withoutZeros = [];

      for (let k = 0; k < temp.length; k++) {
        if (temp[k] !== 0) {
          withoutZeros.push(temp[k]);
        }
      }

      // adding zeros

      while (withoutZeros.length < temp.length) {
        withoutZeros.push(0);
      }

      // I add the same values

      for (let x = 0; x < startState.length - 1; x++) {
        if (withoutZeros[x] === withoutZeros[x + 1] && withoutZeros[x] !== 0) {
          withoutZeros[x] = withoutZeros[x] * 2;
          this.score += withoutZeros[x];
          withoutZeros[x + 1] = 0;
        }
      }

      // make result masive

      const res = [];

      for (let y = 0; y < withoutZeros.length; y++) {
        if (withoutZeros[y] !== 0) {
          res.push(withoutZeros[y]);
        }
      }

      // add 0s
      while (res.length < temp.length) {
        res.push(0);
      }

      for (let s = 0; s <= withoutZeros.length - 1; s++) {
        const nInd = withoutZeros.length - 1 - s;

        this.currentState[i][nInd] = res[s];
      }
    }

    V2 = JSON.stringify(this.currentState);

    if (V1 === V2) {
      return false;
    }

    return true;
  }

  // #endregion

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
    return this.currentState;
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

    // // eslint-disable-next-line no-console
    // console.log('it is inner method START');

    // eslint-disable-next-line no-console
    // console.log(this.currentState);

    this.generator();
    this.generator();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.currentState = structuredClone(startState);
    this.score = 0;
    this.status = 'idle';
    this.state = 'ready';
  }

  // Add your own methods here
  findWin() {
    if (this.currentState.flat().includes(2048)) {
      this.status = 'win';
    }
  }

  generator() {
    let chosenValue = 0;

    chosenValue = Math.random() < 0.9 ? this.value1 : this.value2;

    const makeFlat = () => {
      const rez = [];

      for (let i = 0; i < this.currentState.length; i++) {
        for (let j = 0; j < this.currentState[i].length; j++) {
          if (this.currentState[i][j] === 0) {
            rez.push([i, j]);
          }
        }
      }

      return rez;
    };

    const flatMas = makeFlat();

    if (flatMas.length > 0) {
      const random = Math.floor(Math.random() * flatMas.length);
      const ind = flatMas[random];

      this.currentState[ind[0]][ind[1]] = chosenValue;
      this.V2 = JSON.stringify(this.currentState);

      return this.currentState;
    } else {
      return null;
    }
  }

  hasMoves() {
    if (this.currentState.flat().includes(0)) {
      return true;
    }

    for (let x = 0; x < this.currentState.length; x++) {
      for (let y = 0; y < this.currentState.length; y++) {
        if (
          y + 1 < this.currentState.length &&
          this.currentState[x][y] === this.currentState[x][y + 1]
        ) {
          return true;
        }

        if (
          x + 1 < this.currentState.length &&
          this.currentState[x][y] === this.currentState[x + 1][y]
        ) {
          return true;
        }
      }
    }

    this.status = 'lose';

    return false;
  }
}

module.exports = Game;
