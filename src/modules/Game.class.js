'use strict';

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

  // private functions

  #handleMove = (e) => {
    switch (e.key) {
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
    }
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
    this.#initialState = initialState.map((row) => [...row]);
    this.state = initialState.map((row) => [...row]);
    this.score = 0;

    document
      .querySelector('.button')
      .addEventListener('click', this.#handleButtonClick);
  }

  moveLeft() {}
  moveRight() {}
  moveUp() {}
  moveDown() {}

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

    const button = document.querySelector('.button');

    if (value === 'idle') {
      document.removeEventListener('keydown', this.#handleMove);
      button.className = 'button start';
      button.textContent = 'Start';
    } else if (value === 'playing') {
      document.addEventListener('keydown', this.#handleMove);
      button.className = 'button restart';
      button.textContent = 'Restart';
    }
  }

  start() {
    this.status = 'playing';
    document.querySelector('.message-start').classList.add('hidden');
    this.spawnNewTile();
  }

  restart() {
    this.status = 'idle';
    this.state = this.#initialState.map((row) => [...row]);
    document.querySelector('.message-start').classList.remove('hidden');
    this.updateField();
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
    this.updateField();
  }

  updateField() {
    [...this.#fieldEl.children].forEach((row, rowIndex) => {
      [...row.children].forEach((el, elIndex) => {
        const tileValue = this.state[rowIndex][elIndex];

        if (tileValue) {
          el.textContent = tileValue;
          el.classList.add(`field-cell--${tileValue}`);
        } else {
          el.textContent = '';
          el.className = 'field-cell';
        }
      });
    });
  }
}

module.exports = Game;
