'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {

  // This are variables used in entire instance of class
  #SIZE = 4;
  #score = 0;
  #state = [];
  #status = '';
  #initialState = undefined;
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
      this.#state = new Array(4).fill(0);

      for (const i in this.#state) {
        this.#state[i] = new Array(4).fill(0);
      }

      this.#initialState = this.#getStateCopy();
    } else {
      this.#state = this.#getStateCopy(initialState);
      this.#initialState = this.#getStateCopy();
    }
    this.#SIZE = 4;
    this.#status = 'idle';
  }


  // This is a required method
  moveLeft() {
    if (this.#status === 'playing') {
      const previousState = this.#getStateCopy().flat();

      this.#makeMove();

      if (this.#state.flat().some((e, i) => e !== previousState[i])) {
        this.#randomizer();
        this.#checkIfLose();
      }
    }
  }

  // This is a required method
  moveRight() {
    if (this.#status === 'playing') {
      const previousState = this.#getStateCopy().flat();

      this.#reverse();
      this.#makeMove();
      this.#reverse();

      if (this.#state.flat().some((e, i) => e !== previousState[i])) {
        this.#checkIfLose();
        this.#randomizer();
      }
    }
  }

  // This is a required method
  moveUp() {
    if (this.#status === 'playing') {
      const previousState = this.#getStateCopy().flat();

      this.#tranpose();
      this.#makeMove();
      this.#tranpose();

      if (this.#state.flat().some((e, i) => e !== previousState[i])) {
        this.#checkIfLose();
        this.#randomizer();
      }
    }
  }

  // This is a required method
  moveDown() {
    if (this.#status === 'playing') {
      const previousState = this.#getStateCopy().flat();

      this.#tranpose();
      this.#reverse();
      this.#makeMove();
      this.#reverse();
      this.#tranpose();

      if (this.#state.flat().some((e, i) => e !== previousState[i])) {
        this.#checkIfLose();
        this.#randomizer();
      }
    }
  }

  /**
   * This is a required method.
   *
   * @returns {number}
   */
  getScore() {
    return this.#score;
  }

  /**
   * This is a requirement method.
   *
   * @returns {number[][]}
   */
  getState() {
    return this.#getStateCopy();
  }

  /**
   * Returns the current game status.
   * This is a requirement method
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
   * Update game status.
   *
   * @param {string} value
   *
   */
  setStatus(value) {
    this.#status = value;
  }

  /**
   * This method shoud be private, but the tests consider it as public
   */
  start() {
    this.#score = 0;
    this.#status = 'playing';
    this.#state = this.#getStateCopy(this.#initialState);

    // Is called twice by requirements
    this.#randomizer();
    this.#randomizer();
  }

  // Resets the game.
  restart() {
    this.start();
    this.#status = 'idle';
  }

  /**
   * Put 2 or 4 in freely cells if they exists 
   */
  #randomizer() {
    const empties = [];
    let idxSorted;

    for (let line = 0; line < 4; line++) {
      for (let column = 0; column < 4; column++) {
        if (this.#state[line][column] === 0) {
          empties.push([line, column]);
        }
      }
    }

    if (empties.length > 0) {
      idxSorted = Math.floor(Math.random() * empties.length);

      this.#state[empties[idxSorted][0]][empties[idxSorted][1]] =
        Math.floor(Math.random() * 10) < 9 ? 2 : 4;
    }
  }

  // Matrix transformation transpose operation.
  #tranpose() {
    let tempRetriveVar;

    for (let ln = 0; ln < 4; ln++) {
      for (let cl = ln; cl < 4; cl++) {
        tempRetriveVar = this.#state[ln][cl];
        this.#state[ln][cl] = this.#state[cl][ln];
        this.#state[cl][ln] = tempRetriveVar;
      }
    }
  }

  // Atention this is used to revert each line of this.#state, dont to revert any array. 
  #reverse() {
    this.#state.forEach((e, i, arr) => arr[i].reverse());
  }

  // Check if movements isn't possible than change this.status.
  #checkIfLose() {
    let allSides = [];

    for (let column = 0; column < this.#SIZE; column++) {
      for (let line = 0; line < this.#SIZE; line++) {
        if (this.#state[line][column] !== 0) {
          allSides.push(
            this.#state[line - 1] !== undefined
              ? this.#state[line - 1][column]
              : undefined,
          );

          allSides.push(
            this.#state[line + 1] !== undefined
              ? this.#state[line + 1][column]
              : undefined,
          );
          allSides.push(this.#state[line][column + 1]);
          allSides.push(this.#state[line][column - 1]);

          if (
            allSides.includes(0) ||
            allSides.includes(this.#state[line][column])
          ) {
            return;
          }
        }
        allSides = [];
      }
    }

    this.#status = 'lose';
  }

  /**
   * This method copy two dimensional array.
   * In this code is always used to copy the state Two dimensional Array
   *
   * @param {Array} arr
   * @returns
   */
  #getStateCopy(arr = this.#state) {
    return arr.map((e) => e.slice());
  }

  // Make left movement
  #makeMove() {
    let limit;

    for (let line = 0; line < 4; line++) {
      limit = this.#SIZE - 1;

      for (let column = 0; column < limit; column++) {
        if (this.#state[line][column] === 0) {
          for (let idx = column; idx < this.#SIZE - 1; idx++) {
            this.#state[line][idx] = this.#state[line][idx + 1];
            this.#state[line][idx + 1] = 0;
          }

          column--;
          limit--;

          continue;
        } else if (this.#state[line][column + 1] === 0) {
          for (let idx = column + 1; idx < this.#SIZE - 1; idx++) {
            this.#state[line][idx] = this.#state[line][idx + 1];
            this.#state[line][idx + 1] = 0;
          }

          limit--;
          column--;

          continue;
        } else if (
          this.#state[line][column] === this.#state[line][column + 1]
        ) {
          this.#state[line][column] *= 2;
          this.#state[line][column + 1] = 0;
          this.#score += this.#state[line][column];

          if (this.#state[line][column] === 2048) {
            this.#status = 'win';
          }
        }
      }
    }
  }
}

module.exports = Game;
