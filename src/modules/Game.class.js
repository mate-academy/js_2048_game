'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static STATUS_IDLE = 'idle';
  static STATUS_PLAYING = 'playing';
  static STATUS_WIN = 'win';
  static STATUS_LOSE = 'lose';

  static WIN_NUMBER = 2048;

  static BUTTON_RESTART = 'Restart';
  static BUTTON_START = 'Start';

  #score = 0;
  get score() {
    return this.#score;
  }

  #state = 0;
  get state() {
    return this.#state;
  }

  #status = Game.STATUS_IDLE;
  get status() {
    return this.#status;
  }

  #moveCounter = 0;
  get moveCounter() {
    return this.#moveCounter;
  }

  #incrementMove() {
    this.#moveCounter++;
  }

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
    this.#status = Game.STATUS_IDLE;

    this.board = initialState
      ? Game.validateBoard(initialState)
      : Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  static validateBoard(board) {
    if (
      !Array.isArray(board) ||
      board.length !== 4 ||
      board.some((row) => !Array.isArray(row) || row.length !== 4)
    ) {
      throw new Error('Invalid initial board');
    }

    return board.map((row) => [...row]);
  }

  clearBoard() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  #getStateCopy() {
    return this.board.map((row) => row.slice());
  }

  #boardsEqual(a, b) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (a[i][j] !== b[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  #fillRandomTile() {
    const boradLength = this.board.length;
    const emptyCells = [];

    for (let i = 0; i < boradLength; i++) {
      for (let j = 0; j < boradLength; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  #getRow(i) {
    return this.board[i].slice();
  }

  #setRow(i, line) {
    for (let k = 0; k < line.length; k++) {
      this.board[i][k] = line[k];
    }
  }

  #getColumn(j) {
    return this.board.map((row) => row[j]);
  }

  #setColumn(j, line) {
    for (let k = 0; k < line.length; k++) {
      this.board[k][j] = line[k];
    }
  }

  #hasMoves() {
    const boradLength = this.board.length;

    for (let i = 0; i < boradLength; i++) {
      for (let j = 0; j < boradLength - 1; j++) {
        if (
          this.board[i][j] === 0 ||
          this.board[i][j] === this.board[i][j + 1] ||
          this.board[j][i] === this.board[j + 1][i]
        ) {
          return true;
        }
      }

      if (this.board[i][boradLength - 1] === 0) {
        return true;
      }
    }

    return false;
  }

  #moveLine(line) {
    const newLine = [];

    if (!Array.isArray(line)) {
      return newLine;
    }

    const filtered = line.filter((v) => v !== 0);

    for (let fIndex = 0, i = 0; i < line.length; i++) {
      if (fIndex < filtered.length) {
        if (filtered[fIndex] === filtered[fIndex + 1]) {
          const merged = filtered[fIndex] * 2;

          newLine.push(merged);
          this.#score += merged;
          fIndex += 2;

          if (merged === Game.WIN_NUMBER) {
            this.#status = Game.STATUS_WIN;
          }
        } else {
          newLine.push(filtered[fIndex]);
          fIndex++;
        }
      } else {
        newLine.push(0);
      }
    }

    return newLine;
  }

  #move(direction) {
    if (this.#status !== Game.STATUS_PLAYING) {
      return false;
    }

    const stateBeforeMove = this.#getStateCopy();

    const isHorizontal = direction === 'left' || direction === 'right';
    const isReverse = direction === 'right' || direction === 'down';

    for (let i = 0; i < this.board.length; i++) {
      let line = isHorizontal ? this.#getRow(i) : this.#getColumn(i);

      if (isReverse) {
        line = line.slice().reverse();
      }

      let movedLine = this.#moveLine(line);

      if (isReverse) {
        movedLine = movedLine.slice().reverse();
      }

      if (isHorizontal) {
        this.#setRow(i, movedLine);
      } else {
        this.#setColumn(i, movedLine);
      }
    }

    if (this.#boardsEqual(stateBeforeMove, this.board)) {
      return false;
    }

    this.#incrementMove();
    this.#fillRandomTile();

    if (!this.#hasMoves() && this.#status !== Game.STATUS_WIN) {
      this.#status = Game.STATUS_LOSE;
    }

    return true;
  }

  moveLeft() {
    if (this.#status !== Game.STATUS_PLAYING) {
      return false;
    }

    const stateBeforeMove = this.#getStateCopy();

    for (let i = 0; i < this.board.length; i++) {
      const row = this.#getRow(i);

      this.#setRow(i, this.#moveLine(row));
    }

    if (this.#boardsEqual(stateBeforeMove, this.board)) {
      return false;
    }

    this.#incrementMove();
    this.#fillRandomTile();

    if (!this.#hasMoves() && this.#status !== Game.STATUS_WIN) {
      this.#status = Game.STATUS_LOSE;
    }

    return true;
  }

  moveRight() {
    if (this.#status !== Game.STATUS_PLAYING) {
      return false;
    }

    const stateBeforeMove = this.#getStateCopy();

    for (let i = 0; i < this.board.length; i++) {
      const row = this.#getRow(i);

      this.#setRow(i, this.#moveLine(row.reverse()).reverse());
    }

    if (this.#boardsEqual(stateBeforeMove, this.board)) {
      return false;
    }

    this.#incrementMove();
    this.#fillRandomTile();

    if (!this.#hasMoves() && this.#status !== Game.STATUS_WIN) {
      this.#status = Game.STATUS_LOSE;
    }

    return true;
  }

  moveUp() {
    if (this.#status !== Game.STATUS_PLAYING) {
      return false;
    }

    const stateBeforeMove = this.#getStateCopy();

    for (let i = 0; i < this.board.length; i++) {
      const column = this.#getColumn(i);

      this.#setColumn(i, this.#moveLine(column));
    }

    if (this.#boardsEqual(stateBeforeMove, this.board)) {
      return false;
    }

    this.#incrementMove();
    this.#fillRandomTile();

    if (!this.#hasMoves() && this.#status !== Game.STATUS_WIN) {
      this.#status = Game.STATUS_LOSE;
    }

    return true;
  }

  moveDown() {
    if (this.#status !== Game.STATUS_PLAYING) {
      return false;
    }

    const stateBeforeMove = this.#getStateCopy();

    for (let i = 0; i < this.board.length; i++) {
      const column = this.#getColumn(i);

      this.#setColumn(i, this.#moveLine(column.reverse()).reverse());
    }

    if (this.#boardsEqual(stateBeforeMove, this.board)) {
      return false;
    }

    this.#incrementMove();
    this.#fillRandomTile();

    if (!this.#hasMoves() && this.#status !== Game.STATUS_WIN) {
      this.#status = Game.STATUS_LOSE;
    }

    return true;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board;
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
    return this.#status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.#fillRandomTile();
    this.#fillRandomTile();

    this.#moveCounter = 0;
    this.#status = Game.STATUS_PLAYING;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.clearBoard();
    this.#score = 0;
    this.#moveCounter = 0;
    this.#status = Game.STATUS_IDLE;
    // this.start();
  }

  // Add your own methods here
}

module.exports = Game;
