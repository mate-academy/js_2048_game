/* eslint-disable prettier/prettier */
'use strict';

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
    const isValid =
      Array.isArray(initialState) &&
      initialState.length === 4 &&
      initialState.every(
        (row) =>
          Array.isArray(row) &&
          row.length === 4 &&
          row.every((cell) => typeof cell === 'number'),
      );

    this.initialState = isValid
      ? initialState.map((row) => [...row])
      : [
        // eslint-disable-next-line prettier/prettier
        [0, 0, 0, 0],
        // eslint-disable-next-line prettier/prettier
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

    this.board = this.initialState.map((row) => [...row]);

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    const newBoard = [];
    let changed = false;
    let totalScore = 0;

    for (let i = 0; i < 4; i++) {
      const { newRow, scoreAdd } = this.moveLeftRow(this.board[i]);

      newBoard.push(newRow);
      totalScore += scoreAdd;

      if (newRow.join('') !== this.board[i].join('')) {
        changed = true;
      }
    }

    if (!changed) {
      return false;
    }

    this.board = newBoard;
    this.score += totalScore;

    // WIN CHECK
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return true;
      }
    }

    this.addRandomTile();

    // LOSE CHECK
    if (this.isGameOver()) {
      this.status = 'lose';
    }

    return true;
  }

  moveRight() {

    if (this.status !== 'playing') {
      return false;
    }

    const original = this.board.map((row) => [...row]);

    this.board = this.board.map((row) => [...row].reverse());

    const moved = this.moveLeft();

    this.board = this.board.map((row) => [...row].reverse());

    if (!moved) {
      this.board = original;
    }

    return moved;
  }
  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    const original = this.board.map((row) => [...row]);

    this.board = this.transpose(this.board);

    const moved = this.moveLeft();

    this.board = this.transpose(this.board);

    if (!moved) {
      this.board = original;
    }

    return moved;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    const original = this.board.map((row) => [...row]);

    this.board = this.transpose(this.board).map((row) => [...row].reverse());

    const moved = this.moveLeft();

    this.board = this.transpose(this.board.map((row) => [...row].reverse()));

    if (!moved) {
      this.board = original;
    }

    return moved;
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
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = value;
  }

  moveLeftRow(row) {
    const filtered = row.filter((v) => v !== 0);
    const newRow = [];
    let scoreAdd = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        newRow.push(merged);
        scoreAdd += merged;
        i++;
      } else {
        newRow.push(filtered[i]);
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return { newRow, scoreAdd };
  }

  transpose(matrix) {
    const result = [];

    for (let col = 0; col < 4; col++) {
      const newRow = [];

      for (let row = 0; row < 4; row++) {
        newRow.push(matrix[row][col]);
      }

      result.push(newRow);
    }

    return result;
  }

  isGameOver() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const cell = this.board[i][j];

        if (cell === 0) {
          return false;
        }

        if (j < 3 && cell === this.board[i][j + 1]) {
          return false;
        }

        if (i < 3 && cell === this.board[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }


}
export default Game;
