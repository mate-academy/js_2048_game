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
    this.initialState = initialState;
    // eslint-disable-next-line no-console
    // console.log(initialState);
    this.table = document.querySelector('.game-field');
    this.items = this.table.querySelectorAll('.field-cell');
    this.score = document.querySelector('.game-score');
    this.loseM = document.querySelector('.message-lose');
    this.startM = document.querySelector('.message-start');
    this.winM = document.querySelector('.message-win');
    this.sum = 0;
  }

  numToAdd() {
    const newNum = Math.ceil(Math.random() * 10);

    if (newNum === 1) {
      return 4;
    } else {
      return 2;
    }
  }

  addNum() {
    let zeros = 0;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.initialState[i][j] === 0) {
          zeros++;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.initialState[i][j] === 0) {
          if (Math.ceil(Math.random() * zeros) === 1) {
            this.initialState[i][j] = this.numToAdd();

            this.setNums();
            this.getScore();

            return;
          }

          zeros--;
        }
      }
    }

    if (zeros === 0) {
      this.getStatus();
    }
  }

  start() {
    this.addNum();
    this.addNum();
    this.startM.classList.add('hidden');
  }

  setNums() {
    let currentList = 0;
    let currentItem = 0;

    for (let i = 0; i < 16; i++) {
      this.items[i].textContent = this.initialState[currentList][currentItem];
      currentItem++;

      if (this.items[i].textContent === '0') {
        this.items[i].textContent = '';
      }

      if (this.items[i].textContent === '2048') {
        this.startM.classList.add('hidden');
        this.winM.classList.remove('hidden');
      }

      if (this.items[i].classList.length === 2) {
        this.items[i].classList.remove(this.items[i].classList[1]);
        this.items[i].classList.add(`field-cell--${this.items[i].textContent}`);
      } else {
        this.items[i].classList.add(`field-cell--${this.items[i].textContent}`);
      }

      if (currentItem === 4) {
        currentList++;
        currentItem = 0;
      }
    }
  }

  moveLeft() {
    const arr = [[...this.initialState[0]],
      [...this.initialState[1]],
      [...this.initialState[2]],
      [...this.initialState[3]]];

    for (let j = 0; j < 4; j++) {
      const currentArray = this.initialState[j];

      for (let i = 3; i >= 0; i--) {
        if (currentArray[i] === 0) {
          currentArray.splice(i, 1);
        }
      }

      for (let i = 0; i < 4; i++) {
        if (currentArray[i] === undefined) {
          currentArray.push(0);
        };
      }

      for (let i = 0; i < 4; i++) {
        if (currentArray[i] === currentArray[i + 1]) {
          currentArray[i] *= 2;
          this.sum += currentArray[i];
          currentArray.splice(i + 1, 1);
          currentArray.push(0);
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (arr[i][j] !== this.initialState[i][j]) {
          this.addNum();

          return;
        }
      }
    }
  }

  moveRight() {
    const arr = [[...this.initialState[0]],
      [...this.initialState[1]],
      [...this.initialState[2]],
      [...this.initialState[3]]];

    for (let j = 0; j < 4; j++) {
      const currentArray = this.initialState[j];

      for (let i = 3; i >= 0; i--) {
        if (currentArray[i] === 0) {
          currentArray.splice(i, 1);
        }
      }

      for (let i = 0; i < 4; i++) {
        if (currentArray[i] === undefined) {
          currentArray.unshift(0);
        }
      }

      for (let i = 3; i >= 0; i--) {
        if (currentArray[i] === currentArray[i - 1]) {
          currentArray[i] *= 2;
          this.sum += currentArray[i];
          currentArray.splice(i - 1, 1);
          currentArray.unshift(0);
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (arr[i][j] !== this.initialState[i][j]) {
          this.addNum();

          return;
        }
      }
    }
  }

  moveUp() {
    const arr = [[...this.initialState[0]],
      [...this.initialState[1]],
      [...this.initialState[2]],
      [...this.initialState[3]]];

    for (let j = 0; j < 4; j++) {
      const subArr = [];

      for (let i = 0; i < 4; i++) {
        subArr.push(this.initialState[i][j]);
      }

      const filtred = subArr.filter((item) => item !== 0);

      while (filtred.length < 4) {
        filtred.push(0);
      }

      for (let i = 0; i < 4; i++) {
        if (filtred[i] === filtred[i + 1]) {
          filtred[i] *= 2;
          this.sum += filtred[i];
          filtred.splice(i + 1, 1);
          filtred.push(0);
        }
      }

      for (let i = 0; i < 4; i++) {
        this.initialState[i][j] = filtred[i];
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (arr[i][j] !== this.initialState[i][j]) {
          this.addNum();

          return;
        }
      }
    }
  }

  moveDown() {
    const arr = [[...this.initialState[0]],
      [...this.initialState[1]],
      [...this.initialState[2]],
      [...this.initialState[3]]];

    for (let j = 0; j < 4; j++) {
      const subArr = [];

      for (let i = 0; i < 4; i++) {
        subArr.push(this.initialState[i][j]);
      }

      const filtred = subArr.filter((item) => item !== 0);

      while (filtred.length < 4) {
        filtred.unshift(0);
      }

      for (let i = 3; i >= 0; i--) {
        if (filtred[i] === filtred[i - 1]) {
          filtred[i] *= 2;
          this.sum += filtred[i];
          filtred.splice(i - 1, 1);
          filtred.unshift(0);
        }
      }

      for (let i = 0; i < 4; i++) {
        this.initialState[i][j] = filtred[i];
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (arr[i][j] !== this.initialState[i][j]) {
          this.addNum();

          return;
        }
      }
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    this.score.textContent = this.sum;
  }

  /**
   * @returns {number[][]}
   */
  getState() { }

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
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.initialState[i][j] === this.initialState[i][j + 1]) {
          return;
        }
      }
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.initialState[i][j] === this.initialState[i + 1][j]) {
          return;
        }
      }
    }

    this.loseM.classList.remove('hidden');
    this.startM.classList.add('hidden');
  }

  /**
   * Resets the game.
   */
  restart() {
    for (const arrays of this.initialState) {
      for (let i = 0; i < 4; i++) {
        arrays[i] = 0;
      }
    }

    if (this.loseM.classList.contains('hidden') === false) {
      this.loseM.classList.add('hidden');
      this.startM.classList.remove('hidden');
    }

    if (this.winM.classList.contains('hidden') === false) {
      this.winM.classList.add('hidden');
      this.startM.classList.remove('hidden');
    }

    this.start();
  }

  // Add your own methods here
}

module.exports = Game;
