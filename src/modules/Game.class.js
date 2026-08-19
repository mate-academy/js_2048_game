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
    if (initialState) {
      this.initialState = initialState.map((row) => [...row]);
    } else {
      this.initialState = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
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
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.state.map((row) => [...row]);
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
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    this.addStartingTile();
    this.addStartingTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = JSON.stringify(this.state);

    if (direction === 'left' || direction === 'right') {
      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        let line = [...this.state[rowIndex]];

        if (direction === 'right') {
          line.reverse();
        }

        line = this.mergeLine(line);

        if (direction === 'right') {
          line.reverse();
        }

        this.state[rowIndex] = line;
      }
    } else if (direction === 'up' || direction === 'down') {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        let line = [];

        for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
          line.push(this.state[rowIndex][colIndex]);
        }

        if (direction === 'down') {
          line.reverse();
        }

        line = this.mergeLine(line);

        if (direction === 'down') {
          line.reverse();
        }

        for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
          this.state[rowIndex][colIndex] = line[rowIndex];
        }
      }
    }

    const newState = JSON.stringify(this.state);

    if (oldState === newState) {
      return;
    }

    this.addRandomTile();

    if (this.has2048()) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  mergeLine(line) {
    const numbers = line.filter((value) => value !== 0);
    const result = [];

    let index = 0;

    while (index < numbers.length) {
      if (index + 1 < numbers.length && numbers[index] === numbers[index + 1]) {
        const mergedValue = numbers[index] * 2;

        result.push(mergedValue);
        this.score += mergedValue;

        index += 2;
      } else {
        result.push(numbers[index]);
        index += 1;
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  addStartingTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        if (this.state[rowIndex][colIndex] === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cell = emptyCells[randomIndex];

    this.state[cell[0]][cell[1]] = 2;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        if (this.state[rowIndex][colIndex] === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const [row, col] = emptyCells[randomIndex];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  has2048() {
    return this.state.some((row) => row.includes(2048));
  }

  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.state[row][col] === this.state[row][col + 1]) {
          return true;
        }
      }
    }

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

export default Game;
