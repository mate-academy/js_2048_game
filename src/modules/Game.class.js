'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static STATUSES = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };

  status = Game.STATUSES.IDLE;
  score = 0;

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
    if (initialState.length !== 4) {
      throw Error('InitialState should have 4 rows.');
    }

    this.state = [];

    for (let i = 0; i < initialState.length; i++) {
      if (initialState[i].length !== 4) {
        throw Error('InitialState should have 4 columns.');
      }

      this.state.push([...initialState[i]]);
    }
  }

  isStateEqualTo(compareState) {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] !== compareState[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  addNewValue(prevState) {
    if (!this.isStateEqualTo(prevState)) {
      const randomField = this.getRandomField();

      this.state[randomField[0]][randomField[1]] = this.getRandomNumber();
    }
  }

  moveLeft() {
    const prevState = this.state.map((row) => row.slice());

    for (let i = 0; i < this.state.length; i++) {
      const moveLeftWithoutAdding = () => {
        for (let k = 0; k < 3; k++) {
          for (let j = 0; j < this.state[i].length - 1; j++) {
            if (this.state[i][j] === 0 && this.state[i][j + 1] !== 0) {
              this.state[i][j] = this.state[i][j + 1];
              this.state[i][j + 1] = 0;
            }
          }
        }
      };

      const addTwoValuesToLeft = () => {
        for (let j = 0; j < this.state[i].length - 1; j++) {
          if (
            this.state[i][j] === this.state[i][j + 1] &&
            this.state[i][j] !== 0 &&
            this.state[i][j + 1] !== 0
          ) {
            this.state[i][j] = this.state[i][j] + this.state[i][j + 1];
            this.score += this.state[i][j];
            this.state[i][j + 1] = 0;
            j++;
          }
        }
      };

      moveLeftWithoutAdding();
      addTwoValuesToLeft();
      moveLeftWithoutAdding();
    }

    this.addNewValue(prevState);
    this.changeStatusIfGameOver();
  }

  moveRight() {
    const prevState = this.state.map((row) => row.slice());

    for (let i = 0; i < this.state.length; i++) {
      const moveRightWithoutAdding = () => {
        for (let k = 0; k < 3; k++) {
          for (let j = 1; j < this.state[i].length; j++) {
            if (this.state[i][j] === 0 && this.state[i][j - 1] !== 0) {
              this.state[i][j] = this.state[i][j - 1];
              this.state[i][j - 1] = 0;
            }
          }
        }
      };

      const addTwoValuesToRight = () => {
        for (let j = 1; j < this.state[i].length; j++) {
          if (
            this.state[i][j] === this.state[i][j - 1] &&
            this.state[i][j] !== 0 &&
            this.state[i][j - 1] !== 0
          ) {
            this.state[i][j] = this.state[i][j] + this.state[i][j - 1];
            this.score += this.state[i][j];
            this.state[i][j - 1] = 0;
            j++;
          }
        }
      };

      moveRightWithoutAdding();
      addTwoValuesToRight();
      moveRightWithoutAdding();
    }

    this.addNewValue(prevState);
    this.changeStatusIfGameOver();
  }

  moveUp() {
    const prevState = this.state.map((row) => row.slice());

    for (let i = 0; i < this.state.length; i++) {
      const moveUpWithoutAdding = () => {
        for (let k = 0; k < 3; k++) {
          for (let j = 0; j < this.state[i].length - 1; j++) {
            if (this.state[j][i] === 0 && this.state[j + 1][i] !== 0) {
              this.state[j][i] = this.state[j + 1][i];
              this.score += this.state[i][j];
              this.state[j + 1][i] = 0;
            }
          }
        }
      };

      const addTwoValuesToUp = () => {
        for (let j = 0; j < this.state[i].length - 1; j++) {
          if (
            this.state[j][i] === this.state[j + 1][i] &&
            this.state[j][i] !== 0 &&
            this.state[j + 1][i] !== 0
          ) {
            this.state[j][i] = this.state[j][i] + this.state[j + 1][i];
            this.score += this.state[i][j];
            this.state[j + 1][i] = 0;
            j++;
          }
        }
      };

      moveUpWithoutAdding();
      addTwoValuesToUp();
      moveUpWithoutAdding();
    }

    this.addNewValue(prevState);
    this.changeStatusIfGameOver();
  }

  moveDown() {
    const prevState = this.state.map((row) => row.slice());

    for (let i = 0; i < this.state.length; i++) {
      const moveDownWithoutAdding = () => {
        for (let k = 0; k < 3; k++) {
          for (let j = 1; j < this.state[i].length; j++) {
            if (this.state[j][i] === 0 && this.state[j - 1][i] !== 0) {
              this.state[j][i] = this.state[j - 1][i];
              this.state[j - 1][i] = 0;
            }
          }
        }
      };

      const addTwoValuesToDown = () => {
        for (let j = 1; j < this.state[i].length; j++) {
          if (
            this.state[j][i] === this.state[j - 1][i] &&
            this.state[j][i] !== 0 &&
            this.state[j - 1][i] !== 0
          ) {
            this.state[j][i] = this.state[j][i] + this.state[j - 1][i];
            this.score += this.state[j][i];
            this.state[j - 1][i] = 0;
            j++;
          }
        }
      };

      moveDownWithoutAdding();
      addTwoValuesToDown();
      moveDownWithoutAdding();
    }

    this.addNewValue(prevState);
    this.changeStatusIfGameOver();
  }

  changeStatusIfGameOver() {
    if (this.isWin()) {
      this.status = Game.STATUSES.WIN;

      return;
    }

    if (this.isGameOver()) {
      this.status = Game.STATUSES.LOSE;
    }
  }

  isGameOver() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          return false;
        }
      }
    }

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (
          (j < this.state.length - 1 &&
            this.state[i][j] === this.state[i][j + 1]) ||
          (i < this.state.length - 1 &&
            this.state[i][j] === this.state[i + 1][j])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  isWin() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
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
    if (this.status === Game.STATUSES.IDLE) {
      this.score = 0;

      this.status = Game.STATUSES.PLAYING;

      const randomField = this.getRandomField();

      this.state[randomField[0]][randomField[1]] = this.getRandomNumber();
    }
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

    if (this.status !== Game.STATUSES.IDLE) {
      this.status = Game.STATUSES.IDLE;
      this.start();
    }
  }

  getRandomNumber() {
    return Math.random() < 0.1 ? 4 : 2;
  }

  getRandomField() {
    const freePlaces = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((value, columnIndex) => {
        if (value !== 0) {
          return;
        }

        freePlaces.push([rowIndex, columnIndex]);
      });
    });

    return freePlaces[Math.floor(Math.random() * (freePlaces.length - 1 + 1))];
  }
}

module.exports = Game;
