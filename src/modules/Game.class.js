'use strict';

const gameStatus = {
  IDLE: 'idle',
  PLAYING: 'playing',
  WIN: 'win',
  LOSE: 'lose',
};

const defIniState = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

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
    this.state = null;
    this.score = 0;
    this.status = gameStatus.IDLE;
    this.initialState = initialState || defIniState;
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  selectRandomField() {
    const emptyCells = [];

    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (this.state[x][y] === 0) {
          emptyCells.push({ x, y });
        }
      }
    }

    if (emptyCells.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }

  addRandom() {
    const cell = this.selectRandomField();

    if (cell === null) {
      return;
    }

    const val = Math.random() < 0.1 ? 4 : 2;

    this.state[cell.x][cell.y] = val;
  }

  processLine(array) {
    const filtered = array.filter((el) => el !== 0);
    const res = [];

    let i = 0;

    while (i < filtered.length) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        res.push(filtered[i] * 2);
        this.score += filtered[i] * 2;
        i += 2;
      } else {
        res.push(filtered[i]);
        i += 1;
      }
    }

    while (res.length < 4) {
      res.push(0);
    }

    return res;
  }

  moveLeft() {
    this.state = this.state.map((el) => this.processLine(el));
  }

  moveRight() {
    const lines = [...this.state].map((el) => el.reverse());

    this.state = lines
      .map((el) => this.processLine(el))
      .map((el) => el.reverse());
  }

  moveUp() {
    const lines = [[], [], [], []];

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        lines[col].push(this.state[row][col]);
      }
    }

    const res = lines.map((el) => this.processLine(el));

    const newState = [[], [], [], []];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        newState[row][col] = res[col][row];
      }
    }
    this.state = newState;
  }

  moveDown() {
    const lines = [[], [], [], []];

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        lines[col].push(this.state[row][col]);
      }
    }

    const res = lines
      .map((el) => el.reverse())
      .map((el) => this.processLine(el))
      .map((el) => el.reverse());

    const newState = [[], [], [], []];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        newState[row][col] = res[col][row];
      }
    }
    this.state = newState;
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

  checkWin() {
    const win = this.state.some((el) => el.some((sub) => sub === 2 ** 11));

    if (win) {
      this.status = gameStatus.WIN;

      return true;
    }

    return false;
  }

  checkLose() {
    if (this.state.some((el) => el.some((sub) => sub === 0))) {
      return false;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.state[row][col];

        if (col < 3 && this.state[row][col + 1] === current) {
          return false;
        }

        if (row < 3 && this.state[row + 1][col] === current) {
          return false;
        }
      }
    }

    this.status = gameStatus.LOSE;

    return true;
  }

  start() {
    this.state = this.initialState.map((row) => [...row]);
    this.status = gameStatus.PLAYING;
    this.addRandom();
    this.addRandom();
  }

  restart() {
    this.start();
    this.score = 0;
  }
  /**
   * Resets the game.
   */
}

export default Game;
