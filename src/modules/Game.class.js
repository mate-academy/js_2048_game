'use strict';
class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? initialState.map((row) => [...row])
      : this.createCleanBord();
  }
  createCleanBord() {
    const board = [];

    for (let i = 0; i < this.size; i++) {
      board.push(Array(this.size).fill(0));
    }

    return board;
  }
  generateRandomElement() {
    const empty = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          empty.push([r, c]);
        }
      }
    }

    if (empty.length > 0) {
      const [r, c] = empty[Math.floor(Math.random() * empty.length)];

      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }

    return empty;
  }
  slide(row) {
    let arr = row.filter((val) => val !== 0);

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        this.score += arr[i];
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter((val) => val !== 0);

    while (arr.length < this.size) {
      arr.push(0);
    }

    return arr;
  }
  rotateClockwise(matrix) {
    const result = this.createCleanBord();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        result[c][this.size - 1 - r] = matrix[r][c];
      }
    }

    return result;
  }
  rotateCounterClockwise(matrix) {
    const result = this.createCleanBord();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        result[this.size - 1 - c][r] = matrix[r][c];
      }
    }

    return result;
  }
  moveLeft() {
    const oldBoard = this.getState();
    const newBoard = this.board.map((row) => this.slide(row));

    if (!this.boardsAreEqual(oldBoard, newBoard)) {
      this.board = newBoard;
      this.generateRandomElement();
      this.updateStatus();
    }
  }

  moveRight() {
    const oldBoard = this.getState();
    const newBoard = this.board.map(
      (row) => this.slide([...row].reverse()).reverse(),
      // eslint-disable-next-line function-paren-newline
    );

    if (!this.boardsAreEqual(oldBoard, newBoard)) {
      this.board = newBoard;
      this.generateRandomElement();
      this.updateStatus();
    }
  }

  moveUp() {
    const oldBoard = this.getState();
    let rotated = this.rotateCounterClockwise(this.board);

    rotated = rotated.map((row) => this.slide(row));

    const newBoard = this.rotateClockwise(rotated);

    if (!this.boardsAreEqual(oldBoard, newBoard)) {
      this.board = newBoard;
      this.generateRandomElement();
      this.updateStatus();
    }
  }

  moveDown() {
    const oldBoard = this.getState();
    let rotated = this.rotateClockwise(this.board);

    rotated = rotated.map((row) => this.slide(row));

    const newBoard = this.rotateCounterClockwise(rotated);

    if (!this.boardsAreEqual(oldBoard, newBoard)) {
      this.board = newBoard;
      this.generateRandomElement();
      this.updateStatus();
    }
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
    if (this.status === 'idle') {
      this.status = 'playing';
      this.generateRandomElement();
      this.generateRandomElement();
    }
  }
  /**
   * Resets the game.
   */
  restart() {
    this.board = this.createCleanBord();
    this.score = 0;
    this.status = 'idle';
  }
  updateStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (this.isGameOver()) {
      this.status = 'lose';
    }
  }
  isGameOver() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          return false;
        }

        if (
          (c < this.size - 1 && this.board[r][c] === this.board[r][c + 1]) ||
          (r < this.size - 1 && this.board[r][c] === this.board[r + 1][c])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  boardsAreEqual(board1, board2) {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (board1[r][c] !== board2[r][c]) {
          return false;
        }
      }
    }

    return true;
  }
}
module.exports = Game;
