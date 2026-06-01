'use strict';

function copyGrid(grid) {
  return grid.map((row) => [...row]);
}

class Game {
  // constants

  static #spawnValues = [2, 4]; // only 2 values are supported
  static #winValue = 2048;

  // private values

  #status = 'idle';
  #initialState;

  // DOM elements

  #buttonEl = document.querySelector('.button');
  #messageStartEl = document.querySelector('.message-start');
  #fieldEl = document.querySelector('.game-field tbody');

  // private methods

  #handleMove = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        if (this.moveLeft()) {
          this.spawnNewTile();
        }
        break;
      case 'ArrowRight':
        if (this.moveRight()) {
          this.spawnNewTile();
        }
        break;
      case 'ArrowUp':
        if (this.moveUp()) {
          this.spawnNewTile();
        }
        break;
      case 'ArrowDown':
        if (this.moveDown()) {
          this.spawnNewTile();
        }
        break;
    }
    this.updateGrid();
  };

  #handleButtonClick = () => {
    if (this.status === 'idle') {
      this.start();
    } else {
      this.restart();
    }
  };

  /**
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   */
  constructor(initialState) {
    this.#initialState = copyGrid(initialState);
    this.state = copyGrid(initialState);
    this.score = 0;

    this.#buttonEl.addEventListener('click', this.#handleButtonClick);
  }

  /**
   * @returns {boolean}
   * */
  moveLeft() {
    // shows if at least one tile was merged or moved
    let actionFlag = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 1; col < 4; col++) {
        // if tile is empty => move on
        if (!this.state[row][col]) {
          continue;
        }

        // row, col - position where started
        // currCol - current column of tile
        let currCol = col;

        // until left tile empty => move left
        while (currCol > 0 && !this.state[row][currCol - 1]) {
          this.state[row][currCol - 1] = this.state[row][currCol];
          this.state[row][currCol] = 0;

          currCol--;
          actionFlag = true;
        }

        if (
          currCol > 0 &&
          this.state[row][currCol] === this.state[row][currCol - 1]
        ) {
          this.state[row][currCol - 1] *= 2;
          this.state[row][currCol] = 0;

          actionFlag = true;
        }
      }
    }

    return actionFlag;
  }

  moveRight() {
    let actionFlag = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 2; col >= 0; col--) {
        // if tile is empty => move on
        if (!this.state[row][col]) {
          continue;
        }

        let currCol = col;

        while (currCol < 3 && !this.state[row][currCol + 1]) {
          this.state[row][currCol + 1] = this.state[row][currCol];
          this.state[row][currCol] = 0;

          currCol++;
          actionFlag = true;
        }

        if (
          currCol < 3 &&
          this.state[row][currCol] === this.state[row][currCol + 1]
        ) {
          this.state[row][currCol + 1] *= 2;
          this.state[row][currCol] = 0;

          actionFlag = true;
        }
      }
    }

    return actionFlag;
  }
  moveUp() {
    let actionFlag = false;

    for (let col = 0; col < 4; col++) {
      for (let row = 1; row < 4; row++) {
        if (!this.state[row][col]) {
          continue;
        }

        let currRow = row;

        while (currRow > 0 && !this.state[currRow - 1][col]) {
          this.state[currRow - 1][col] = this.state[currRow][col];
          this.state[currRow][col] = 0;

          currRow--;
          actionFlag = true;
        }

        if (
          currRow > 0 &&
          this.state[currRow][col] === this.state[currRow - 1][col]
        ) {
          this.state[currRow - 1][col] *= 2;
          this.state[currRow][col] = 0;

          actionFlag = true;
        }
      }
    }

    return actionFlag;
  }
  moveDown() {
    let actionFlag = false;

    for (let col = 0; col < 4; col++) {
      for (let row = 2; row >= 0; row--) {
        if (!this.state[row][col]) {
          continue;
        }

        let currRow = row;

        while (currRow < 3 && !this.state[currRow + 1][col]) {
          this.state[currRow + 1][col] = this.state[currRow][col];
          this.state[currRow][col] = 0;

          currRow++;
          actionFlag = true;
        }

        if (
          currRow < 3 &&
          this.state[currRow][col] === this.state[currRow + 1][col]
        ) {
          this.state[currRow + 1][col] *= 2;
          this.state[currRow][col] = 0;

          actionFlag = true;
        }
      }
    }

    return actionFlag;
  }

  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.#initialState;
  }

  /**
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  get status() {
    return this.#status;
  }

  set status(value) {
    this.#status = value;

    if (value === 'idle') {
      document.removeEventListener('keydown', this.#handleMove);
      this.#buttonEl.className = 'button start';
      this.#buttonEl.textContent = 'Start';
    } else if (value === 'playing') {
      document.addEventListener('keydown', this.#handleMove);
      this.#buttonEl.className = 'button restart';
      this.#buttonEl.textContent = 'Restart';
    }
  }

  start() {
    this.status = 'playing';
    this.#messageStartEl.classList.add('hidden');
    this.spawnNewTile();
  }

  restart() {
    this.status = 'idle';
    this.state = copyGrid(this.#initialState);
    this.#messageStartEl.classList.remove('hidden');
    this.updateGrid();
  }

  spawnNewTile() {
    const emptyTileIndexes = this.state
      .flat()
      .map((tile, index) => (tile ? -1 : index))
      .filter((el) => el !== -1);

    if (!emptyTileIndexes.length) {
      throw new Error(`No free tile index found`);
    }

    const spawnValue =
      Math.random() < 0.9 ? Game.#spawnValues[0] : Game.#spawnValues[1];
    const spawnIndex =
      emptyTileIndexes[Math.floor(Math.random() * emptyTileIndexes.length)];

    this.state[Math.floor(spawnIndex / 4)][spawnIndex % 4] = spawnValue;
    this.updateGrid();
  }

  updateGrid() {
    [...this.#fieldEl.children].forEach((row, rowIndex) => {
      [...row.children].forEach((el, elIndex) => {
        const tileValue = this.state[rowIndex][elIndex];

        if (tileValue) {
          el.textContent = tileValue;
          el.className = `field-cell field-cell--${tileValue}`;
        } else {
          el.textContent = '';
          el.className = 'field-cell';
        }
      });
    });
  }
}

module.exports = Game;
