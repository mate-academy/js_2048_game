'use strict';

class Game {
  static STATUS = Object.freeze({
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  });

  static BOARD_SIZE = 4;

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
    this.initialState = initialState;
    this.state = structuredClone(initialState);
    this.score = 0;
    this.status = Game.STATUS.IDLE;
  }

  moveLeft() {
    if (this.status !== Game.STATUS.PLAYING) {
      return;
    }

    this.state = this.state.map((row) => this.slideRow(row));

    this.afterMove();
  }

  moveRight() {
    if (this.status !== Game.STATUS.PLAYING) {
      return;
    }

    this.state = this.state.map(
      (row) => this.slideRow(row.toReversed()).reverse(),
      // eslint-disable-next-line function-paren-newline
    );

    this.afterMove();
  }
  moveUp() {
    if (this.status !== Game.STATUS.PLAYING) {
      return;
    }

    this.state = this.transposeBoard(this.state);
    this.moveLeft();
    this.state = this.transposeBoard(this.state);
  }

  moveDown() {
    if (this.status !== Game.STATUS.PLAYING) {
      return;
    }

    this.state = this.transposeBoard(this.state);
    this.moveRight();
    this.state = this.transposeBoard(this.state);
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
    this.status = Game.STATUS.PLAYING;
    this.spawnTile();
    this.spawnTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = Game.STATUS.IDLE;
    this.score = 0;
    this.state = structuredClone(this.initialState);
  }

  spawnTile() {
    const emptyCells = [];

    for (let i = 0; i < Game.BOARD_SIZE; i++) {
      for (let j = 0; j < Game.BOARD_SIZE; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (!emptyCells.length) {
      return;
    }

    const [randRow, randCol] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[randRow][randCol] = Math.random() < 0.9 ? 2 : 4;
  }

  slideRow(row) {
    const skimmed = row.filter((n) => n !== 0);
    const merged = [];

    for (let i = 0; i < skimmed.length; i++) {
      if (skimmed[i] === skimmed[i + 1]) {
        const mergedValue = skimmed[i] * 2;

        merged.push(mergedValue);
        this.score += mergedValue;
        i++;
      } else {
        merged.push(skimmed[i]);
      }
    }

    return merged.concat(Array(Game.BOARD_SIZE - merged.length).fill(0));
  }

  checkMovesLeft() {
    for (let i = 0; i < Game.BOARD_SIZE; i++) {
      for (let j = 0; j < Game.BOARD_SIZE; j++) {
        if (this.state[i][j] === 0) {
          return;
        }

        if (
          (j + 1 < Game.BOARD_SIZE &&
            this.state[i][j] === this.state[i][j + 1]) ||
          (i + 1 < Game.BOARD_SIZE && this.state[i][j] === this.state[i + 1][j])
        ) {
          return;
        }
      }
    }

    this.status = Game.STATUS.LOSE;
  }

  checkWin() {
    if (this.state.some((row) => row.some((cell) => cell === 2048))) {
      this.status = Game.STATUS.WIN;
    }
  }

  afterMove() {
    this.spawnTile();
    this.checkWin();

    if (this.status === Game.STATUS.PLAYING) {
      this.checkMovesLeft();
    }
  }

  /**
   * Returns a new board with the rows and columns transposed.
   *
   * @param {number[][]} board
   * The board to transpose.
   *
   * @returns {number[][]}
   * The transposed board.
   */
  transposeBoard(board) {
    return board[0].map((_, col) => board.map((row) => row[col]));
  }
}

module.exports = Game;
