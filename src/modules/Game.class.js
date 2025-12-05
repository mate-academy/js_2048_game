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
  state = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;
  static STATUSES = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };
  status = Game.STATUSES.IDLE;

  constructor(initialState) {
    // eslint-disable-next-line no-console
    console.log(initialState);

    this.initialState = initialState;
    this.keydownHandler = null;
  }

  moveLeft() {
    this.makeShift('left');
  }

  moveRight() {
    this.makeShift('right');
  }

  moveUp() {
    this.makeShift('up');
  }

  moveDown() {
    this.makeShift('down');
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
    this.createInitialState();
    this.status = Game.STATUSES.PLAYING;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = Game.STATUSES.IDLE;

    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  // Add your own methods here
  createInitialState() {
    if (this.initialState) {
      this.state = this.initialState;
    } else {
      let newPosition = this.getNewPosition();

      this.state[newPosition[0]][newPosition[1]] = this.getNewNumber();
      newPosition = this.getNewPosition();
      this.state[newPosition[0]][newPosition[1]] = this.getNewNumber();
    }
  }

  getNewPosition() {
    const positions = this.getFreeCells();
    const randomPosition = Math.floor(Math.random() * positions.length);

    return positions[randomPosition];
  }

  getNewNumber() {
    const randomNumber = Math.random();

    return randomNumber > 0.9 ? 4 : 2;
  }

  getFreeCells() {
    const freeCells = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state.length; j++) {
        if (this.state[i][j] === 0) {
          freeCells.push([i, j]);
        }
      }
    }

    return freeCells;
  }

  isWin() {
    return this.state.some((row) => row.some((cell) => cell === 2048));
  }

  addKeyboardListeners() {
    this.removeKeyboardListeners();

    this.keydownHandler = (evt) => {
      switch (evt.key) {
        case 'ArrowLeft':
          this.moveLeft();
          break;
        case 'ArrowRight':
          this.moveRight();
          break;
        case 'ArrowUp':
          this.moveUp();
          break;
        case 'ArrowDown':
          this.moveDown();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', this.keydownHandler);
  }

  removeKeyboardListeners() {
    if (this.keydownHandler) {
      document.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
  }

  makeShift(direction) {
    let newState = [];
    const mergeMatrix = (matrix) => {
      const newMatrix = [];
      const cleanState = matrix.map((row) => [...row.filter((n) => n !== 0)]);

      for (let i = 0; i < matrix.length; i++) {
        newMatrix.push([]);

        for (let j = 0; j < cleanState[i].length; j++) {
          if (cleanState[i][j] === cleanState[i][j + 1]) {
            const sum = cleanState[i][j] * 2;

            newMatrix[i].push(sum);
            this.score += sum;
            j++;
          } else {
            newMatrix[i].push(cleanState[i][j]);
          }
        }
      }

      newMatrix.forEach((row) => {
        const index = row.length;

        row.length = this.state.length;
        row.fill(0, index);
      });

      return newMatrix;
    };

    if (direction === 'left') {
      newState = mergeMatrix(this.state).map((row) => [...row]);
    }

    if (direction === 'right') {
      const matrix = this.state.map((row) => [...row].reverse());

      mergeMatrix(matrix).forEach((row, i) => (newState[i] = row.reverse()));
    }

    if (direction === 'up') {
      const matrix = this.state.map((row) => row);
      const rotated90CCW = matrix[0].map((_, colIndex) => {
        return matrix.map((row) => row[row.length - 1 - colIndex]);
      });
      const mergedMatrix = mergeMatrix(rotated90CCW);

      newState = mergedMatrix[0].map((_, colIndex) => {
        return mergedMatrix.map((row) => row[colIndex]).reverse();
      });
    }

    if (direction === 'down') {
      const matrix = this.state.map((row) => row);
      const rotated90CW = matrix[0].map((_, colIndex) => {
        return matrix.map((row) => row[colIndex]).reverse();
      });
      const mergedMatrix = mergeMatrix(rotated90CW);

      newState = mergedMatrix[0].map((_, colIndex) => {
        return mergedMatrix.map((row) => row[row.length - 1 - colIndex]);
      });
    }

    if (JSON.stringify(newState) !== JSON.stringify(this.state)) {
      this.state = newState;

      const newPosition = this.getNewPosition();

      this.state[newPosition[0]][newPosition[1]] = this.getNewNumber();
    }

    if (this.getFreeCells().length === 0) {
      if (!this.isAvailableMoves()) {
        this.status = Game.STATUSES.LOSE;
      }
    }

    if (this.isWin()) {
      this.status = Game.STATUSES.WIN;
    }
  }

  isAvailableMoves() {
    const size = this.state.length;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - 1; j++) {
        if (this.state[i][j] === this.state[i][j + 1]) {
          return true;
        }
      }
    }

    for (let i = 0; i < size - 1; i++) {
      for (let j = 0; j < size; j++) {
        if (this.state[i][j] === this.state[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
