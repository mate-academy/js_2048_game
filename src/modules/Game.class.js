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
    this.initialState = initialState
      ? this.copyState(initialState)
      : this.createEmptyState();
    this.state = this.copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
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
    return this.copyState(this.state);
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
    this.addRandomCell();
    this.addRandomCell();
    this.updateStatus();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  createEmptyState() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  copyState(state) {
    return state.map((row) => [...row]);
  }

  addRandomCell() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let colIndex = 0; colIndex < 4; colIndex++) {
        if (this.state[rowIndex][colIndex] === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.copyState(this.state);
    const result = this.getMovedState(direction);

    if (!this.areStatesEqual(previousState, result.state)) {
      this.state = result.state;
      this.score += result.score;

      if (this.hasWinningCell()) {
        this.status = 'win';

        return;
      }

      this.addRandomCell();
      this.updateStatus();
    }
  }

  getMovedState(direction) {
    const state = this.createEmptyState();
    let score = 0;

    for (let index = 0; index < 4; index++) {
      const line = this.getLine(index, direction);
      const mergedLine = this.mergeLine(line);

      score += mergedLine.score;
      this.setLine(state, index, direction, mergedLine.line);
    }

    return { state, score };
  }

  getLine(index, direction) {
    switch (direction) {
      case 'left':
        return [...this.state[index]];

      case 'right':
        return [...this.state[index]].reverse();

      case 'up':
        return this.state.map((row) => row[index]);

      case 'down':
        return this.state.map((row) => row[index]).reverse();

      default:
        return [];
    }
  }

  setLine(state, index, direction, line) {
    const resultLine = ['right', 'down'].includes(direction)
      ? [...line].reverse()
      : line;

    for (let cell = 0; cell < 4; cell++) {
      if (['left', 'right'].includes(direction)) {
        state[index][cell] = resultLine[cell];
      } else {
        state[cell][index] = resultLine[cell];
      }
    }
  }

  mergeLine(line) {
    const cells = line.filter(Boolean);
    const result = [];
    let score = 0;

    for (let i = 0; i < cells.length; i++) {
      if (cells[i] === cells[i + 1]) {
        const mergedCell = cells[i] * 2;

        result.push(mergedCell);
        score += mergedCell;
        i++;
      } else {
        result.push(cells[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return { line: result, score };
  }

  areStatesEqual(firstState, secondState) {
    return firstState.every((row, rowIndex) => {
      return row.every((cell, colIndex) => {
        return cell === secondState[rowIndex][colIndex];
      });
    });
  }

  hasWinningCell() {
    return this.state.some((row) => row.includes(2048));
  }

  hasEmptyCell() {
    return this.state.some((row) => row.includes(0));
  }

  hasAvailableMoves() {
    if (this.hasEmptyCell()) {
      return true;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = this.state[row][col];

        if (
          (row < 3 && this.state[row + 1][col] === cell) ||
          (col < 3 && this.state[row][col + 1] === cell)
        ) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    if (this.hasWinningCell()) {
      this.status = 'win';

      return;
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
