'use strict';

const SIZE = 4;
const WIN_VALUE = 2048;
const FOUR_PROBABILITY = 0.1;

const EMPTY_STATE = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

function copyState(state) {
  return state.map((row) => [...row]);
}

/**
 * This class represents the game.
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
  constructor(initialState = EMPTY_STATE) {
    this.initialState = copyState(initialState);
    this.state = copyState(initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.move((rows) => rows);
  }

  moveRight() {
    this.move(
      (rows) => rows.map((row) => [...row].reverse()),
      (rows) => rows.map((row) => [...row].reverse()),
    );
  }

  moveUp() {
    this.move(Game.transpose, Game.transpose);
  }

  moveDown() {
    this.move(
      (rows) => Game.transpose(rows).map((row) => [...row].reverse()),
      (rows) => Game.transpose(rows.map((row) => [...row].reverse())),
    );
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
    return copyState(this.state);
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomCell();
    this.addRandomCell();
    this.updateStatus();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  /**
   * Moves the board. All directions are reduced to "move left":
   * the board is turned so the needed direction becomes "left",
   * the rows are slid to the left and the board is turned back.
   *
   * @param {Function} toLeft - turns the board so the move is "left"
   * @param {Function} fromLeft - turns the board back
   */
  move(toLeft, fromLeft = toLeft) {
    if (this.status !== 'playing') {
      return;
    }

    let gained = 0;
    const rows = toLeft(copyState(this.state)).map((row) => {
      const { line, points } = Game.slideRow(row);

      gained += points;

      return line;
    });

    const newState = fromLeft(rows);

    if (Game.isSameState(newState, this.state)) {
      return;
    }

    this.state = newState;
    this.score += gained;
    this.addRandomCell();
    this.updateStatus();
  }

  /**
   * Slides one row to the left and merges equal neighbours.
   * A merged cell can't be merged again during the same move.
   *
   * @param {number[]} row
   * @returns {{ line: number[], points: number }}
   */
  static slideRow(row) {
    const cells = row.filter(Boolean);
    const line = [];
    let points = 0;

    for (let i = 0; i < cells.length; i++) {
      if (cells[i] === cells[i + 1]) {
        const merged = cells[i] * 2;

        line.push(merged);
        points += merged;
        i++;
      } else {
        line.push(cells[i]);
      }
    }

    while (line.length < SIZE) {
      line.push(0);
    }

    return { line, points };
  }

  static transpose(state) {
    return state[0].map((_, col) => state.map((row) => row[col]));
  }

  static isSameState(a, b) {
    return a.every((row, r) => row.every((cell, c) => cell === b[r][c]));
  }

  getEmptyCells() {
    const empty = [];

    this.state.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === 0) {
          empty.push([r, c]);
        }
      });
    });

    return empty;
  }

  addRandomCell() {
    const empty = this.getEmptyCells();

    if (empty.length === 0) {
      return;
    }

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.state[r][c] = Math.random() < FOUR_PROBABILITY ? 4 : 2;
  }

  canMove() {
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const cell = this.state[r][c];

        if (cell === 0) {
          return true;
        }

        if (c < SIZE - 1 && cell === this.state[r][c + 1]) {
          return true;
        }

        if (r < SIZE - 1 && cell === this.state[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    if (this.state.some((row) => row.includes(WIN_VALUE))) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
