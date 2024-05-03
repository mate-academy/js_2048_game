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
    this.state = JSON.parse(JSON.stringify(initialState));
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    const state = this.getState();

    // below I update the state if ArrowLeft was pressed

    for (let row = 0; row < 4; row++) {
      const cache = [];

      // here I push all digits (except 0) of current row in the state
      // to the cache array

      for (let cell = 0; cell < 4; cell++) {
        const currentDigit = state[row][cell];

        if (!currentDigit) {
          continue;
        }

        cache.push(currentDigit);
      }

      // here I sum equal numbers in the cache array and update the score

      for (let i = 0; i < cache.length; i++) {
        const currentDigit = cache[i];
        const nextDigit = i + 1 < cache.length ? cache[i + 1] : null;

        if (!nextDigit) {
          break;
        }

        if (currentDigit === nextDigit) {
          const prevScore = this.getScore();
          const currentScore = prevScore + currentDigit * 2;

          this.score = currentScore;

          cache.splice(i, 2, currentDigit * 2);
        }
      }

      // if row doesn't change then go to the next row

      if (cache.length === 4) {
        continue;
      }

      // here I need to fill cache array with 0 for equality cache.length === 4

      while (cache.length < 4) {
        cache.push(0);
      }

      // here I rewrite current row in the state

      for (let cell = 0; cell < 4; cell++) {
        state[row][cell] = cache[cell];
      }
    }
  }

  moveRight() {
    const state = this.getState();

    // below I update the state if ArrowRight was pressed

    for (let row = 0; row < 4; row++) {
      const cache = [];

      // here I push all digits (except 0) of current row in the state
      // to the cache array

      for (let cell = 0; cell < 4; cell++) {
        const currentDigit = state[row][cell];

        if (!currentDigit) {
          continue;
        }

        cache.push(currentDigit);
      }

      // here I sum equal numbers in the cache array and update the score

      // if we press ArrowRight, digits should sum from right/end to left/start
      // [4, 4, 4] -> [4, 8]
      // but I used the cycle 'for' for inconvenience from start to end
      // and therefore reverse cache array twice

      cache.reverse();

      for (let i = 0; i < cache.length; i++) {
        const currentDigit = cache[i];
        const nextDigit = i + 1 < cache.length ? cache[i + 1] : null;

        if (!nextDigit) {
          break;
        }

        if (currentDigit === nextDigit) {
          const prevScore = this.getScore();
          const currentScore = prevScore + currentDigit * 2;

          this.score = currentScore;

          cache.splice(i, 2, currentDigit * 2);
        }
      }

      cache.reverse();

      // if row doesn't change then go to the next row

      if (cache.length === 4) {
        continue;
      }

      // here I need to fill cache array with 0 for equality cache.length === 4

      while (cache.length < 4) {
        cache.unshift(0);
      }

      // here I rewrite current row in the state

      for (let cell = 0; cell < 4; cell++) {
        state[row][cell] = cache[cell];
      }
    }
  }

  moveUp() {
    const state = this.getState();

    // below I update the state if ArrowUp was pressed

    for (let col = 0; col < 4; col++) {
      const cache = [];

      // here I push all digits (except 0) of current column in the state
      // to the cache array

      for (let row = 0; row < 4; row++) {
        const currentDigit = state[row][col];

        if (!currentDigit) {
          continue;
        }

        cache.push(currentDigit);
      }

      // here I sum equal numbers in the cache array and update the score

      for (let i = 0; i < cache.length; i++) {
        const currentDigit = cache[i];
        const nextDigit = i + 1 < cache.length ? cache[i + 1] : null;

        if (!nextDigit) {
          break;
        }

        if (currentDigit === nextDigit) {
          const prevScore = this.getScore();
          const currentScore = prevScore + currentDigit * 2;

          this.score = currentScore;

          cache.splice(i, 2, currentDigit * 2);
        }
      }

      // if column doesn't change then go to the next column

      if (cache.length === 4) {
        continue;
      }

      // here I need to fill cache array with 0 for equality cache.length === 4

      while (cache.length < 4) {
        cache.push(0);
      }

      // here I rewrite current column in the state

      for (let row = 0; row < 4; row++) {
        state[row][col] = cache[row];
      }
    }
  }

  moveDown() {
    const state = this.getState();

    // below I update the state if ArrowDown was pressed

    for (let col = 0; col < 4; col++) {
      const cache = [];

      // here I push all digits (except 0) of current column in the state
      // to the cache array

      for (let row = 0; row < 4; row++) {
        const currentDigit = state[row][col];

        if (!currentDigit) {
          continue;
        }

        cache.push(currentDigit);
      }

      // here I sum equal numbers in the cache array and update the score

      // if we press ArrowDown, digits should sum from down/end to up/start
      // [4,
      //  4, -> [4,
      //  4]     8]
      // but I used the cycle 'for' for inconvenience from start to end
      // and therefore reverse cache array twice

      cache.reverse();

      for (let i = 0; i < cache.length; i++) {
        const currentDigit = cache[i];
        const nextDigit = i + 1 < cache.length ? cache[i + 1] : null;

        if (!nextDigit) {
          break;
        }

        if (currentDigit === nextDigit) {
          const prevScore = this.getScore();
          const currentScore = prevScore + currentDigit * 2;

          this.score = currentScore;

          cache.splice(i, 2, currentDigit * 2);
        }
      }

      cache.reverse();

      // if column doesn't change then go to the next column

      if (cache.length === 4) {
        continue;
      }

      // here I need to fill cache array with 0 for equality cache.length === 4

      while (cache.length < 4) {
        cache.unshift(0);
      }

      // here I rewrite current column in the state

      for (let row = 0; row < 4; row++) {
        state[row][col] = cache[row];
      }
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
    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.status = 'playing';
    this.score = 0;
    this.addRandomDigitToEmptyCell(2);
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = JSON.parse(JSON.stringify(this.initialState));
    this.status = 'idle';
    this.score = 0;
  }

  // Add your own methods here

  checkIsPlayerWin() {
    const state = this.getState();
    let isPlayerWin = false;

    for (let row = 0; row < 4; row++) {
      if (state[row].includes(2048)) {
        isPlayerWin = true;
      }
    }

    return isPlayerWin;
  }

  checkIsPlayerLose() {
    const state = this.getState();

    let isPlayerLose = false;
    let hasEmptyCell = false;
    let hasPairedDigits = false;

    for (let row = 0; row < 4; row++) {
      if (state[row].includes(0)) {
        hasEmptyCell = true;

        break;
      }
    }

    // here I try to find paired digits in rows

    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 3; cell++) {
        if (state[row][cell] === state[row][cell + 1]) {
          hasPairedDigits = true;

          break;
        }
      }
    }

    // here I try to find paired digits in columns

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (state[row][col] === state[row + 1][col]) {
          hasPairedDigits = true;

          break;
        }
      }
    }

    if (!hasEmptyCell && !hasPairedDigits) {
      isPlayerLose = true;
    }

    return isPlayerLose;
  }

  addRandomDigitToEmptyCell(digitsCount) {
    const state = this.getState();
    let addedDigitsCount = 0;

    while (addedDigitsCount < digitsCount) {
      const [row, cell] = this.getRandomCoordinates();
      const randomDigit = this.getRandomDigit();

      if (state[row][cell]) {
        continue;
      }

      state[row][cell] = randomDigit;

      addedDigitsCount++;
    }
  }

  getRandomCoordinates() {
    const rowCoordinate = Math.floor(Math.random() * 4);
    const cellCoordinate = Math.floor(Math.random() * 4);

    return [rowCoordinate, cellCoordinate];
  }

  getRandomDigit() {
    const randomNumber1To100 = Math.floor(Math.random() * 100) + 1;

    if (randomNumber1To100 > 90) {
      return 4;
    }

    return 2;
  }
}

module.exports = Game;
