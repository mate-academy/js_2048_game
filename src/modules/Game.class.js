'use strict';

const WIN_VALUE = 2048;
const FOUR_PROBABILITY = 0.1;

function transpose(board) {
  return board[0].map((_, col) => board.map((row) => row[col]));
}

function reverseRows(board) {
  return board.map((row) => [...row].reverse());
}

function slideLine(line) {
  const tiles = line.filter((value) => value !== 0);
  const result = [];
  let points = 0;
  let i = 0;

  while (i < tiles.length) {
    if (tiles[i] === tiles[i + 1]) {
      const value = tiles[i] * 2;

      result.push(value);
      points += value;
      i += 2;
    } else {
      result.push(tiles[i]);
      i += 1;
    }
  }

  while (result.length < line.length) {
    result.push(0);
  }

  return { line: result, points };
}

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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState.map((row) => [...row]);
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.move(
      (board) => board,
      (board) => board,
    );
  }

  moveRight() {
    this.move(reverseRows, reverseRows);
  }

  moveUp() {
    this.move(transpose, transpose);
  }

  moveDown() {
    this.move(
      (board) => reverseRows(transpose(board)),
      (board) => transpose(reverseRows(board)),
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
    return this.board.map((row) => [...row]);
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
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  move(toLeft, fromLeft) {
    if (this.status !== 'playing') {
      return;
    }

    let moved = false;

    const lines = toLeft(this.board).map((line) => {
      const { line: slid, points } = slideLine(line);

      this.score += points;

      if (slid.some((value, i) => value !== line[i])) {
        moved = true;
      }

      return slid;
    });

    this.board = fromLeft(lines);
    this.finishMove(moved);
  }

  finishMove(moved) {
    if (!moved) {
      return;
    }

    if (this.board.some((row) => row.includes(WIN_VALUE))) {
      this.status = 'win';

      return;
    }

    this.addRandomTile();

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  getEmptyCells() {
    const emptyCells = [];

    this.board.forEach((row, i) => {
      row.forEach((value, j) => {
        if (value === 0) {
          emptyCells.push([i, j]);
        }
      });
    });

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[i][j] = Math.random() < FOUR_PROBABILITY ? 4 : 2;
  }

  canMove() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const value = this.board[i][j];

        if (value === 0) {
          return true;
        }

        if (j + 1 < this.board[i].length && value === this.board[i][j + 1]) {
          return true;
        }

        if (i + 1 < this.board.length && value === this.board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
