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
    this.state = initialState;
    this.score = 0;
    this.getStatus();
  }

  move(direction) {
    let hadMove = false;
    let hadMerge = false;
    let scoreIncrease = 0;

    const isHorizontal = direction === 'left' || direction === 'right';
    const isReverse = direction === 'right' || direction === 'down';

    const outerLength = isHorizontal ? this.state.length : this.state[0].length;
    const innerLength = isHorizontal ? this.state[0].length : this.state.length;

    for (let outer = 0; outer < outerLength; outer++) {
      const values = [];

      for (let inner = 0; inner < innerLength; inner++) {
        const value = isHorizontal
          ? this.state[outer][inner]
          : this.state[inner][outer];

        if (value !== 0) {
          values.push(value);
        }
      }

      if (isReverse) {
        values.reverse();
      }

      const merged = [];
      const newValues = [];

      for (let i = 0; i < values.length; i++) {
        if (values[i] === values[i + 1] && !merged.includes(i)) {
          newValues.push(values[i] * 2);
          scoreIncrease += values[i] * 2;
          merged.push(i + 1);
          hadMerge = true;
          i++;
        } else {
          newValues.push(values[i]);
        }
      }

      while (newValues.length < innerLength) {
        newValues.push(0);
      }

      if (isReverse) {
        newValues.reverse();
      }

      for (let inner = 0; inner < innerLength; inner++) {
        const oldValue = isHorizontal
          ? this.state[outer][inner]
          : this.state[inner][outer];

        if (oldValue !== newValues[inner]) {
          hadMove = true;
        }

        if (isHorizontal) {
          this.state[outer][inner] = newValues[inner];
        } else {
          this.state[inner][outer] = newValues[inner];
        }
      }
    }

    if (hadMove || hadMerge) {
      this.addNumber(this.state);
      this.getScore(scoreIncrease);
    }

    this.getStatus();
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }
  moveUp() {
    this.move('up');
  }
  moveDown() {
    this.move('down');
  }

  /**
   * @returns {number}
   */
  getScore(number) {
    this.score += number;
    document.querySelector('.game-score').textContent = this.score;
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
   * idle - the game has not started yet (the initial state);
   * playing - the game is in progress;
   * win - the game is won;
   * lose - the game is lost
   */
  getStatus() {
    const size = this.state.length;
    let hasEmptyCell = false;
    let hasMove = false;

    this.status = 'idle';

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (this.state[row][col] === 2048) {
          this.status = 'win';

          return;
        }

        if (this.state[row][col] === 0) {
          hasEmptyCell = true;
        }

        if (
          (col < size - 1 &&
            this.state[row][col] !== 0 &&
            this.state[row][col] === this.state[row][col + 1]) ||
          (row < size - 1 && this.state[row][col] === this.state[row + 1][col])
        ) {
          hasMove = true;
        }
      }
    }

    if (hasEmptyCell || hasMove) {
      this.status = 'playing';
    } else {
      this.status = 'lose';
    }
  }

  /**
   * Starts the game.
   */
  start() {
    const tdItems = document.querySelectorAll('td');
    const places = this.randomPlace();
    const numbers = this.randomNumberTwoOrFour();

    const arrayTdItems = Array.from(tdItems);

    arrayTdItems[places[0]].classList.add(`field-cell--${numbers[0]}`);
    arrayTdItems[places[1]].classList.add(`field-cell--${numbers[1]}`);

    arrayTdItems[places[0]].textContent = numbers[0];
    arrayTdItems[places[1]].textContent = numbers[1];

    this.state[Math.floor(places[0] / 4)][places[0] % 4] = numbers[0];
    this.state[Math.floor(places[1] / 4)][places[1] % 4] = numbers[1];
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

    this.score = 0;
    this.status = 'idle';
  }

  randomNumberTwoOrFour() {
    const result = [];

    while (result.length !== 2) {
      const number = Math.random();

      if (result.length === 2) {
        return result;
      }

      if (number < 0.9) {
        result.push(2);
      } else {
        result.push(4);
      }
    }

    return result;
  }

  randomPlace(min = 0, max = 15) {
    const result = [];

    while (result.length !== 2) {
      const number = Math.floor(Math.random() * (max - min + 1)) + min;

      if (result[0] !== number) {
        result.push(number);
      }
    }

    return result.sort((a, b) => a - b);
  }

  // Add your own methods here

  addNumber() {
    const number = Math.random();
    let randomNumber = 0;

    if (number < 0.9) {
      randomNumber = 2;
    } else {
      randomNumber = 4;
    }

    const freePlace = this.countFreePlaces();

    if (freePlace !== -1) {
      const row = freePlace[0];
      const column = freePlace[1];

      this.state[row][column] = randomNumber;
    }
  }

  countFreePlaces() {
    const indexes = [];

    for (let row = 0; row < this.state.length; row++) {
      for (let column = 0; column < this.state[0].length; column++) {
        if (this.state[row][column] === 0) {
          indexes.push([row, column]);
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * indexes.length);

    return indexes.length > 0 ? indexes[randomIndex] : -1;
  }
}

module.exports = Game;
