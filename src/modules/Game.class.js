'use strict';

const SIZE = 4;
const WIN_VALUE = 2048;

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
    this.initialState = initialState
      ? initialState.map((line) => [...line])
      : Game.createEmptyBoard();

    this.board = this.initialState.map((line) => [...line]);
    this.score = 0;
    this.gainedScore = 0;
    this.status = 'idle';
  }

  static createEmptyBoard() {
    return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  }

  moveLeft() {
    this.move(this.board.map((line) => this.slide(line)));
  }

  moveRight() {
    this.move(this.board.map((line) => this.slide([...line].reverse(), true)));
  }

  moveUp() {
    this.moveVertically(false);
  }

  moveDown() {
    this.moveVertically(true);
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
    return this.board.map((line) => [...line]);
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

    const isEmpty = this.board.every((line) => line.every((n) => n === 0));

    if (isEmpty) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((line) => [...line]);
    this.score = 0;
    this.gainedScore = 0;
    this.status = 'idle';
  }

  // Add your own methods here

  /**
   * Slides and merges one line towards its start.
   * If `reversed` is true, the result is reversed back.
   *
   * @param {number[]} line
   * @param {boolean} reversed
   * @returns {number[]}
   */
  slide(line, reversed = false) {
    const numbers = line.filter((value) => value !== 0);
    const result = [];

    for (let i = 0; i < numbers.length; i++) {
      if (numbers[i] === numbers[i + 1]) {
        const merged = numbers[i] * 2;

        result.push(merged);
        this.gainedScore += merged;
        i++;
      } else {
        result.push(numbers[i]);
      }
    }

    while (result.length < SIZE) {
      result.push(0);
    }

    return reversed ? result.reverse() : result;
  }

  moveVertically(down) {
    const newBoard = Game.createEmptyBoard();

    for (let col = 0; col < SIZE; col++) {
      const column = this.board.map((line) => line[col]);
      let result;

      if (down) {
        result = this.slide([...column].reverse(), true);
      } else {
        result = this.slide(column);
      }

      for (let row = 0; row < SIZE; row++) {
        newBoard[row][col] = result[row];
      }
    }

    this.move(newBoard);
  }

  /**
   * Applies the new board if the move changed anything.
   *
   * @param {number[][]} newBoard
   */
  move(newBoard) {
    const gained = this.gainedScore;

    this.gainedScore = 0;

    if (this.status !== 'playing') {
      return;
    }

    const changed = JSON.stringify(newBoard) !== JSON.stringify(this.board);

    if (!changed) {
      return;
    }

    this.board = newBoard;
    this.score += gained;

    if (this.board.some((line) => line.includes(WIN_VALUE))) {
      this.status = 'win';

      return;
    }

    this.addRandomTile();

    if (!this.hasMoves()) {
      this.status = 'lose';
    }
  }

  addRandomTile() {
    const empty = [];

    this.board.forEach((line, rowIndex) => {
      line.forEach((value, colIndex) => {
        if (value === 0) {
          empty.push([rowIndex, colIndex]);
        }
      });
    });

    if (empty.length === 0) {
      return;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];

    this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  hasMoves() {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        const value = this.board[row][col];

        if (value === 0) {
          return true;
        }

        if (col + 1 < SIZE && this.board[row][col + 1] === value) {
          return true;
        }

        if (row + 1 < SIZE && this.board[row + 1][col] === value) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
