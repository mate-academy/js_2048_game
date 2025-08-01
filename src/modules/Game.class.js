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
    // eslint-disable-next-line no-console
    console.log(initialState);

    const board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
    this.state = board;
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const state = this.state;
    const oldState = structuredClone(this.state);

    function removeZeros(arr) {
      return arr.filter((el) => el !== 0);
    }

    for (let key = 0; key < state.length; key++) {
      const keyLength = state[key].length;

      state[key] = removeZeros(state[key]);

      for (let num = 0; num < state[key].length; num++) {
        if (state[key][num] === state[key][num + 1]) {
          state[key][num] *= 2;
          state[key][num + 1] = 0;
          this.score += +state[key][num];
          state[key] = removeZeros(state[key]);
        }
      }

      for (let i = state[key].length; i < keyLength; i++) {
        state[key].push(0);
      }
    }

    this.checkChangesState(oldState);

    this.updateUI();
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const state = this.state;
    const oldState = structuredClone(this.state);

    function removeZeros(arr) {
      return arr.filter((el) => el !== 0);
    }

    for (let key = 0; key < state.length; key++) {
      const keyLength = state[key].length;

      state[key] = removeZeros(state[key]);

      for (let num = state[key].length; num > 0; num--) {
        if (state[key][num] === state[key][num - 1]) {
          state[key][num] *= 2;
          state[key][num - 1] = 0;
          this.score += +state[key][num];
          state[key] = removeZeros(state[key]);
          num--;
        }
      }

      for (let i = state[key].length; i < keyLength; i++) {
        state[key].unshift(0);
      }
    }

    this.checkChangesState(oldState);
    this.updateUI();
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const state = this.state;
    const oldState = structuredClone(this.state);

    this.transpose(state);

    function removeZeros(arr) {
      return arr.filter((el) => el !== 0);
    }

    for (let key = 0; key < state.length; key++) {
      const keyLength = state[key].length;

      state[key] = removeZeros(state[key]);

      for (let num = 0; num < state[key].length; num++) {
        if (state[key][num] === state[key][num + 1]) {
          state[key][num] *= 2;
          state[key][num + 1] = 0;
          this.score += +state[key][num];
          state[key] = removeZeros(state[key]);
        }
      }

      for (let i = state[key].length; i < keyLength; i++) {
        state[key].push(0);
      }
    }
    this.transpose(state);

    this.checkChangesState(oldState);
    this.updateUI();
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const state = this.state;
    const oldState = structuredClone(this.state);

    this.transpose(state);

    function removeZeros(arr) {
      return arr.filter((el) => el !== 0);
    }

    for (let key = 0; key < state.length; key++) {
      const keyLength = state[key].length;

      state[key] = removeZeros(state[key]);

      for (let num = state[key].length; num > 0; num--) {
        if (state[key][num] === state[key][num - 1]) {
          state[key][num] *= 2;
          state[key][num - 1] = 0;
          this.score += +state[key][num];
          state[key] = removeZeros(state[key]);
          num--;
        }
      }

      for (let i = state[key].length; i < keyLength; i++) {
        state[key].unshift(0);
      }
    }
    this.transpose(state);

    this.checkChangesState(oldState);
    this.updateUI();
  }

  /**
   * @returns {number}
   */
  getScore() {
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
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    if (this.status === 'idle') {
      document.querySelector('.message-start').classList.add('hidden');
      this.status = 'playing';
    } else if (this.status === 'playing') {
      document.querySelector('.message-lose').classList.add('hidden');
      document.querySelector('.message-win').classList.add('hidden');
      document.querySelector('.message-start').classList.remove('hidden');
      this.status = 'idle';
    } else if (this.status === 'lose') {
      document.querySelector('.message-lose').classList.remove('hidden');
      this.status = 'playing';
    } else if (this.status === 'win') {
      document.querySelector('.message-win').classList.remove('hidden');
      // this.status = 'playing';
    }
  }

  /**
   * Starts the game.
   */
  start() {
    this.addRandomTile();
    this.getStatus();
    this.updateUI();
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

    if (this.status === 'win') {
      this.status = 'playing';
    }

    this.getStatus();
    this.getScore();
    this.updateUI();
  }

  // Add your own methods here

  addRandomTile() {
    const statusCopy = this.status;

    function getRandom(isNumber = false) {
      let randomNumber = Math.floor(Math.random() * 4);

      if (isNumber && statusCopy === 'playing') {
        randomNumber = Math.random();

        if (randomNumber < 0.9) {
          return 2;
        } else {
          return 4;
        }
      } else if (isNumber && statusCopy === 'idle') {
        randomNumber = Math.floor(Math.random() * 2);

        if (randomNumber === 0) {
          return 2;
        } else {
          return 4;
        }
      } else {
        return randomNumber;
      }
    }

    function isClear(board) {
      let isValue = true;

      while (isValue) {
        const randomA = getRandom();
        const randomB = getRandom();
        const randomCell = board[randomA][randomB];

        if (!randomCell) {
          board[randomA][randomB] = getRandom(true);
          isValue = false;
        }
      }
    }

    const stateFlatLength = this.state.flat().filter((el) => el !== 0).length;

    if (stateFlatLength === 0) {
      isClear(this.state);
      isClear(this.state);
    } else {
      isClear(this.state);
    }
  }

  checkChangesState(oldStateArr) {
    const oldArr = oldStateArr.flat().join('');
    const newArr = this.state.flat().join('');
    const stateFlatLength = this.state.flat().filter((el) => el !== 0).length;

    if (oldArr !== newArr) {
      this.addRandomTile(true);
    } else if (stateFlatLength === 16) {
      const grid = this.state;
      let isTrue = false;

      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid.length; j++) {
          const current = grid[i][j];

          if (current === 0) {
            isTrue = true;
            break;
          }

          if (
            (j + 1 < grid.length && current === grid[i][j + 1]) ||
            (i + 1 < grid.length && current === grid[i + 1][j])
          ) {
            isTrue = true;
          }
        }
      }

      if (!isTrue) {
        this.status = 'lose';
        this.getStatus();
      }
    }
  }

  updateUI() {
    const allCells = document.querySelectorAll('.field-cell');

    if (this.state.flat().some((t) => t === 2048)) {
      this.status = 'win';
      this.getStatus();
    }

    for (let key = 0; key < allCells.length; key++) {
      if (this.state.flat()[key]) {
        allCells[key].textContent = this.state.flat()[key];

        allCells[key].classList =
          `field-cell field-cell--${allCells[key].textContent}`;
      } else {
        allCells[key].textContent = '';
        allCells[key].classList = 'field-cell';
      }
    }

    this.getScore();
  }

  transpose(matrix) {
    const n = matrix.length;
    const m = matrix[0].length;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < m; j++) {
        const temp = matrix[i][j];

        matrix[i][j] = matrix[j][i];
        matrix[j][i] = temp;
      }
    }
  }
}

module.exports = Game;
