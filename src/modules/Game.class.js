'use strict';

/* This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
const cells = [...document.querySelectorAll('.field-cell')];

class Game {
  /* Creates a new game instance.
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
  constructor(initialState = null) {
    // eslint-disable-next-line no-console
    // console.log(initialState);

    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.initialState = this.move(this.initialState, true);
  }

  moveRight() {
    this.initialState = this.move(this.initialState, false);
  }

  moveUp() {
    const change = this.change(this.initialState);
    const moveUp = this.move(change, true);

    this.initialState = this.change(moveUp);
  }
  moveDown() {
    const change = this.change(this.initialState);
    const moveDown = this.move(change, false);

    this.initialState = this.change(moveDown);
  }

  /* @returns {number}
   */
  getScore() {
    return this.score;
  }

  /* @returns {number[][]}
   */
  getState() {
    return this.initialState;
  }

  /* Returns the current game status.
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

  /* Starts the game.
   */
  start() {
    const rRow1 = Math.floor(Math.random() * this.initialState[0].length);
    const rRow2 = Math.floor(Math.random() * this.initialState[0].length);
    const rCol1 = Math.floor(Math.random() * this.initialState.length);
    const rCol2 = Math.floor(Math.random() * this.initialState.length);

    this.status = 'playing';
    this.initialState[rRow1][rCol1] = 2;
    this.initialState[rRow2][rCol2] = 2;

    this.reload();
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
    this.score = 0;
    this.status = 'idle';

    this.reload();
  }

  move(array, zeroToStart) {
    let addScore = 0;
    const result = array.map((item) => {
      const numbers = item.filter((i) => i !== 0);
      const addings = [];

      for (let i = 1; i <= numbers.length; i++) {
        if (numbers[i] === numbers[i - 1] && numbers[i]) {
          const newScore = numbers[i] + numbers[i - 1];

          addScore += newScore;
          addings.push(newScore);
          i++;
        } else {
          addings.push(numbers[i - 1]);
        }
      }

      while (addings.length < item.length) {
        if (zeroToStart) {
          addings.push(0);
        } else {
          addings.unshift(0);
        }
      }

      return addings;
    });

    this.score += addScore;

    return result;
  }

  change(array) {
    const changed = [[], [], [], []];

    array.forEach((item) => {
      item.forEach((number, i) => {
        changed[i].push(item[i]);
      });
    });

    return changed;
  }

  reload() {
    const state = this.getState();

    state.forEach((item, index) => {
      item.forEach((ite, i) => {
        const cell = cells[index * this.initialState.length + i];

        if (ite !== 0) {
          cell.textContent = ite;
        } else {
          cell.textContent = '';
        }

        cell.className = 'field-cell';
        cell.classList.add('field-cell--' + ite);
      });
    });
  }

  addTile() {
    const emptyCells = this.initialState.some((item) => item.includes(0));

    if (!emptyCells) {
      return;
    }

    const random = Math.random();
    const rRow = Math.floor(Math.random() * this.initialState[0].length);
    const rCol = Math.floor(Math.random() * this.initialState.length);

    if (this.initialState[rRow][rCol] === 0) {
      if (random < 0.1) {
        this.initialState[rRow][rCol] = 4;
      } else {
        this.initialState[rRow][rCol] = 2;
      }
    } else {
      this.addTile();
    }
  }

  checkWin() {
    const isWin = this.initialState.some((item) => item.includes(2048));

    if (isWin) {
      this.status = 'win';
    }

    return isWin;
  }

  checkLose() {
    if (this.initialState.some((item) => item.includes(0))) {
      return false;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.initialState[i][j];

        if (j < 3 && current === this.initialState[i][j + 1]) {
          return false;
        }

        if (i < 3 && current === this.initialState[i + 1][j]) {
          return false;
        }
      }
    }
    this.status = 'lose';

    return true;
  }
}

module.exports = Game;
