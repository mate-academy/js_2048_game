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
    this.board = initialState;
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const currentRow = this.board[row];
      const { newRow, gainedScore } = this.compressRow(currentRow);

      if (!this.areRowEqual(currentRow, newRow)) {
        this.board[row] = newRow;
        moved = true;
        this.score += gainedScore;
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveRight() {
    const prevState = JSON.stringify(this.board);

    for (let row = 0; row < 4; row++) {
      const reverseRow = [...this.board[row]].reverse();

      const { newRow, gainedScore } = this.compressRow(reverseRow);

      this.board[row] = newRow.reverse();
      this.score += gainedScore;
    }

    const newState = JSON.stringify(this.board);

    if (newState !== prevState) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveUp() {
    const prevState = JSON.stringify(this.board);

    for (let col = 0; col < 4; col++) {
      const column = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ];

      const { newRow, gainedScore } = this.compressRow(column);

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newRow[row];
      }

      this.score += gainedScore;
    }

    const newState = JSON.stringify(this.board);

    if (newState !== prevState) {
      this.addRandomTile();
    }

    this.updateStatus();
  }

  moveDown() {
    const prevState = JSON.stringify(this.board);

    for (let col = 0; col < 4; col++) {
      const column = [
        this.board[3][col],
        this.board[2][col],
        this.board[1][col],
        this.board[0][col],
      ];

      const { newRow, gainedScore } = this.compressRow(column);

      for (let row = 0; row < 4; row++) {
        this.board[3 - row][col] = newRow[row];
      }

      this.score += gainedScore;
    }

    const newState = JSON.stringify(this.board);

    if (newState !== prevState) {
      this.addRandomTile();
    }

    this.updateStatus();
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
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.board = Array(4)
      .fill()
      .map(() => Array(4).fill(0));

    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  addRandomTile() {
    const cells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          cells.push({ row, col });
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * cells.length);
    const { row: randomRow, col: randomCol } = cells[randomIndex];

    const newValue = Math.random() < 0.9 ? 2 : 4;

    this.board[randomRow][randomCol] = newValue;
  }

  compressRow(row) {
    let filtered = row.filter((num) => num !== 0);
    let score = 0;

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        filtered[i + 1] = 0;
        score += filtered[i];
        i++;
      }
    }

    filtered = filtered.filter((num) => num !== 0);

    const zerosToAdd = 4 - filtered.length;

    for (let i = 0; i < zerosToAdd; i++) {
      filtered.push(0);
    }

    return { newRow: filtered, gainedScore: score };
  }

  areRowEqual(row1, row2) {
    return row1.every((value, index) => value === row2[index]);
  }

  updateStatus() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    for (const row of this.board) {
      if (row.includes(0)) {
        this.status = 'playing';

        return;
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.board[row][col];

        if (
          (col < 3 && current === this.board[row][col + 1]) ||
          (row < 3 && current === this.board[row + 1][col])
        ) {
          this.status = 'playing';

          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
