'use strict';
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
  constructor(initialState = this.#createEmptyState()) {
    this.initialState = initialState;
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status === 'playing') {
      const newState = this.state.map((row) => this.#mergeCells(row));

      this.#handleMove(newState);
    }
  }
  moveRight() {
    if (this.status === 'playing') {
      const newState = this.state.map((row) => {
        const reversedRow = row.slice().reverse();
        const mergedRow = this.#mergeCells(reversedRow);

        return mergedRow.reverse();
      });

      this.#handleMove(newState);
    }
  }
  moveUp() {
    if (this.status === 'playing') {
      const transposedState = this.#transpose(this.state);
      const newState = transposedState.map((row) => this.#mergeCells(row));

      this.#handleMove(this.#transpose(newState));
    }
  }
  moveDown() {
    if (this.status === 'playing') {
      const transposedState = this.#transpose(this.state);
      const newState = transposedState.map((row) => {
        const reversedRow = row.slice().reverse();
        const mergedRow = this.#mergeCells(reversedRow);

        return mergedRow.reverse();
      });

      this.#handleMove(this.#transpose(newState));
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
    this.status = 'playing';
    this.#addRandomTile();
    this.#addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here

  #createEmptyState() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  #getEmptyCells() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          emptyCells.push({ rowIndex, cellIndex });
        }
      });
    });

    return emptyCells;
  }

  #addRandomTile() {
    const emptyCells = this.#getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() > 0.1 ? 2 : 4;

    this.state[randomCell.rowIndex][randomCell.cellIndex] = value;
  }

  #mergeCells(row) {
    const mergedRow = row.filter((cell) => cell !== 0);
    const newRow = [];
    let i = 0;

    while (i < mergedRow.length) {
      if (mergedRow[i] === mergedRow[i + 1]) {
        newRow.push(mergedRow[i] * 2);
        this.score += mergedRow[i] * 2;
        i += 2;
      } else {
        newRow.push(mergedRow[i]);
        i += 1;
      }
    }
    newRow.push(...Array(4 - newRow.length).fill(0));

    return newRow;
  }

  #transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  #willStateChange(newState) {
    return JSON.stringify(this.state) !== JSON.stringify(newState);
  }

  #isWin() {
    this.status = this.state.some((row) => row.includes(2048))
      ? 'win'
      : this.status;
  }

  #isLose() {
    for (const row of this.state) {
      if (row.some((i) => i === 0)) {
        return false;
      }

      for (let i = 0; i < row.length; i++) {
        if (row[i] === row[i + 1]) {
          return false;
        }
      }
    }

    for (let c = 0; c < 4; c++) {
      const row = [
        this.state[0][c],
        this.state[1][c],
        this.state[2][c],
        this.state[3][c],
      ];

      for (let i = 0; i < row.length; i++) {
        if (row[i] === row[i + 1]) {
          return false;
        }
      }
    }

    return true;
  }

  #handleMove(newState) {
    if (this.#willStateChange(newState)) {
      this.state = newState;
      this.#addRandomTile();
      this.#isWin();

      if (this.#isLose()) {
        this.status = 'lose';
      }
    }
  }
}

module.exports = Game;
