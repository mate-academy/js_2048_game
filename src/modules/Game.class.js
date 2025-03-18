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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.state = this.initialState.map((row) => [...row]);
    this.isStarted = false;
    this.score = 0;
    this.status = 'idle';
  }

  move(state) {
    const newState = state.map((row) => {
      const rowWithoutZeros = row.filter((n) => n !== 0);

      for (let i = 1; i < rowWithoutZeros.length; i++) {
        if (rowWithoutZeros[i] === rowWithoutZeros[i - 1]) {
          rowWithoutZeros[i - 1] = rowWithoutZeros[i - 1] * 2;
          rowWithoutZeros[i] = 0;
          this.score += rowWithoutZeros[i - 1];
          i++;
        }
      }

      const compacted = rowWithoutZeros.filter((n) => n !== 0);

      while (compacted.length <= 3) {
        compacted.push(0);
      }

      return compacted;
    });

    return newState;
  }

  moveLeft() {
    if (!this.isStarted) {
      return;
    }

    const newState = this.move(this.state);

    if (!this.checkState(this.state, newState)) {
      const updateState = this.setCell(newState);

      this.isWinner(updateState);

      if (this.isLoser(updateState) === false) {
        this.status = 'lose';
      }

      return updateState;
    }

    return newState;
  }
  moveRight() {
    if (!this.isStarted) {
      return;
    }

    const state = this.state.map((row) => [...row]);

    state.map((row) => row.reverse());

    const newState = this.move(state).map((row) => row.reverse());

    if (!this.checkState(this.state, newState)) {
      const updateState = this.setCell(newState);

      this.isWinner(updateState);

      if (this.isLoser(updateState) === false) {
        this.status = 'lose';
      }

      return updateState;
    }

    return newState;
  }

  moveUp() {
    if (!this.isStarted) {
      return;
    }

    const state = this.state.map((row) => [...row]);
    const transposedState = this.transpose(state, 'up');
    const newState = this.transpose(this.move(transposedState), 'up');

    if (!this.checkState(this.state, newState)) {
      const updateState = this.setCell(newState);

      this.isWinner(updateState);

      if (this.isLoser(updateState) === false) {
        this.status = 'lose';
      }

      return updateState;
    }

    return newState;
  }

  moveDown() {
    if (!this.isStarted) {
      return;
    }

    const state = this.state.map((row) => [...row]);
    const transposedState = this.transpose(state).map((row) => {
      return row.reverse();
    });

    const newState = this.transpose(
      this.move(transposedState).map((row) => row.reverse()),
    );

    if (!this.checkState(this.state, newState)) {
      const updateState = this.setCell(newState);

      this.isWinner(updateState);

      if (this.isLoser(updateState) === false) {
        this.status = 'lose';
      }

      return updateState;
    }

    return newState;
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
    this.isStarted = true;
    this.status = 'playing';

    for (let i = 0; i < 2; i++) {
      this.setCell();
    }

    return this.state;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  excludedIndex(index = false) {
    const excludedIndex = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell !== 0) {
          excludedIndex.push(rowIndex * 4 + colIndex);
        }
      });
    });

    if (index !== false) {
      excludedIndex.push(index);
    }

    return excludedIndex;
  }

  setCell(newState = null) {
    if (newState) {
      this.state = newState;
    }

    const emptyCells = Array.from({ length: 16 }, (_, i) => i).filter(
      (i) => !this.excludedIndex().includes(i),
    );

    if (!emptyCells.length) {
      return this.state;
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const row = Math.floor(randomCell / 4);
    const col = randomCell % 4;

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;

    return this.state;
  }

  checkState(oldState, newState) {
    return oldState.every(
      (row, i) =>
        row.length === newState[i].length &&
        row.every((num, j) => num === newState[i][j]),
    );
  }

  transpose(state) {
    const result = [];

    for (let col = 0; col < state.length; col++) {
      result[col] = [];

      for (let row = 0; row < state[col].length; row++) {
        result[col].push(state[row][col]);
      }
    }

    return result;
  }

  isWinner() {
    if (this.state.flat().includes(2048)) {
      this.status = 'win';
    }
  }

  isLoser() {
    let canMove = false;
    let hasEmptyCells = false;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          hasEmptyCells = true;
        }

        if (
          (r < 3 && this.state[r][c] === this.state[r + 1][c]) ||
          (c < 3 && this.state[r][c] === this.state[r][c + 1])
        ) {
          canMove = true;
        }
      }
    }

    if (!canMove && !hasEmptyCells) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
