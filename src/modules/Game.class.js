'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

function copyState(state) {
  return state.map((row) => [...row]);
}

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
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.button = document.querySelector('.button.start');
    this.gameScore = document.querySelector('.game-score');
    this.messageStart = document.querySelector('.message-start');
    this.messageLose = document.querySelector('.message-lose');
    this.messageWin = document.querySelector('.message-win');

    this.initialState = copyState(initialState);
    this.initialStateDefault = copyState(initialState);
  }

  checkVictory() {
    const isVictory = !!this.initialState.flat().find((item) => item === 2048);

    if (isVictory && this.messageWin && this.button) {
      this.status = 'win';
      this.messageWin.classList.remove('hidden');
      this.button.classList.remove('start');
      this.button.classList.add('restart');
      this.button.innerHTML = 'Restart';
    }
  }

  checkLose() {
    // eslint-disable-next-line max-len
    const isFull = this.initialState.every((row) =>
      // eslint-disable-next-line
      row.every((cell) => cell !== 0),);

    if (!isFull) {
      return;
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        // eslint-disable-next-line max-len
        if (
          col < this.size - 1 &&
          this.initialState[row][col] === this.initialState[row][col + 1]
        ) {
          return;
        }

        // eslint-disable-next-line max-len
        if (
          row < this.size - 1 &&
          this.initialState[row][col] === this.initialState[row + 1][col]
        ) {
          return;
        }
      }
    }

    this.status = 'lose';

    // eslint-disable-next-line max-len
    if (this.messageLose) {
      this.messageLose.classList.remove('hidden');
    }
  }

  moveLeft() {
    if (!this.isStatusPlaying()) {
      return;
    }

    let isUpdated = false;

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        // eslint-disable-next-line max-len
        for (
          let innerColumn = col + 1;
          innerColumn < this.size;
          innerColumn++
        ) {
          const currentItem = this.initialState[row][col];
          const nextItem = this.initialState[row][innerColumn];

          if (currentItem === 0 && nextItem !== 0) {
            this.initialState[row][col] = nextItem;
            this.initialState[row][innerColumn] = 0;
            isUpdated = true;
            continue;
          }

          if (currentItem !== 0 && nextItem === currentItem) {
            const mergedValue = currentItem * 2;

            this.initialState[row][col] = mergedValue;
            this.initialState[row][innerColumn] = 0;
            this.score += mergedValue;
            isUpdated = true;
            break;
          }

          if (currentItem !== 0 && nextItem === 0) {
            continue;
          }

          if (currentItem !== 0 && nextItem !== currentItem) {
            break;
          }
        }
      }
    }

    if (isUpdated) {
      this.transposeState();
      this.checkVictory();
      this.checkLose();
    }
  }

  moveRight() {
    if (!this.isStatusPlaying()) {
      return;
    }
    this.changeTextButton();

    let isUpdated = false;

    for (let row = 0; row < this.size; row++) {
      for (let col = this.size - 1; col >= 0; col--) {
        for (let innerColumn = col - 1; innerColumn >= 0; innerColumn--) {
          const currentItem = this.initialState[row][col];
          const nextItem = this.initialState[row][innerColumn];

          if (currentItem === 0 && nextItem !== 0) {
            this.initialState[row][col] = nextItem;
            this.initialState[row][innerColumn] = 0;
            isUpdated = true;
            continue;
          }

          if (currentItem !== 0 && nextItem === currentItem) {
            const mergedValue = currentItem * 2;

            this.initialState[row][col] = mergedValue;
            this.initialState[row][innerColumn] = 0;
            this.score += mergedValue;
            isUpdated = true;
            break;
          }

          if (currentItem !== 0 && nextItem === 0) {
            break;
          }

          if (currentItem !== 0 && nextItem !== currentItem) {
            break;
          }
        }
      }
    }

    if (isUpdated) {
      this.transposeState();
      this.checkVictory();
      this.checkLose();
    }
  }

  moveUp() {
    if (!this.isStatusPlaying()) {
      return;
    }
    this.changeTextButton();

    let isUpdated = false;

    for (let col = 0; col < this.size; col++) {
      for (let row = 0; row < this.size; row++) {
        for (let innerRow = row + 1; innerRow < this.size; innerRow++) {
          const currentItem = this.initialState[row][col];
          const nextItem = this.initialState[innerRow][col];

          if (currentItem === 0 && nextItem !== 0) {
            this.initialState[row][col] = nextItem;
            this.initialState[innerRow][col] = 0;
            isUpdated = true;
            continue;
          }

          if (currentItem !== 0 && nextItem === currentItem) {
            const mergedValue = currentItem * 2;

            this.initialState[row][col] = mergedValue;
            this.initialState[innerRow][col] = 0;
            this.score += mergedValue;
            isUpdated = true;
            break;
          }

          if (currentItem !== 0 && nextItem === 0) {
            continue;
          }

          if (currentItem !== 0 && nextItem !== currentItem) {
            break;
          }
        }
      }
    }

    if (isUpdated) {
      this.transposeState();
      this.checkVictory();
      this.checkLose();
    }
  }

  moveDown() {
    if (!this.isStatusPlaying()) {
      return;
    }
    this.changeTextButton();

    let isUpdated = false;

    for (let col = 0; col < this.size; col++) {
      for (let row = this.size - 1; row >= 0; row--) {
        for (let innerRow = row - 1; innerRow >= 0; innerRow--) {
          const currentItem = this.initialState[row][col];
          const nextItem = this.initialState[innerRow][col];

          if (currentItem === 0 && nextItem !== 0) {
            this.initialState[row][col] = nextItem;
            this.initialState[innerRow][col] = 0;
            isUpdated = true;
            continue;
          }

          if (currentItem !== 0 && nextItem === currentItem) {
            const mergedValue = currentItem * 2;

            this.initialState[row][col] = mergedValue;
            this.initialState[innerRow][col] = 0;
            this.score += mergedValue;
            isUpdated = true;
            break;
          }

          if (currentItem !== 0 && nextItem === 0) {
            continue;
          }

          if (currentItem !== 0 && nextItem !== currentItem) {
            break;
          }
        }
      }
    }

    if (isUpdated) {
      this.transposeState();
      this.checkVictory();
      this.checkLose();
    }
  }

  changeTextButton() {
    if (this.button) {
      this.button.classList.remove('start');
      this.button.classList.add('restart');
      this.button.innerHTML = 'Restart';
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  isStatusPlaying() {
    return this.status === 'playing';
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.initialState;
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
    if (this.status === 'playing') {
      return;
    }
    this.transposeState();
    this.transposeState();
    this.status = 'playing';

    if (this.messageStart) {
      this.messageStart.classList.add('hidden');
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'idle';
    this.score = 0;

    if (this.button) {
      this.button.classList.remove('restart');
      this.button.classList.add('start');
      this.button.innerHTML = 'Start';
      this.messageWin.classList.add('hidden');
    }

    if (this.gameScore) {
      this.gameScore.innerHTML = '0';
    }

    if (this.messageStart) {
      this.messageStart.classList.remove('hidden');
    }

    if (this.messageLose) {
      this.messageLose.classList.add('hidden');
    }
  }

  generateNewNumber() {
    return Math.random() < 0.9 ? 2 : 4;
  }

  transposeState() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.initialState[row][col] === 0) {
          emptyCells.push({
            row,
            col,
          });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      this.initialState[row][col] = this.generateNewNumber();
    }
  }
}

module.exports = Game;
