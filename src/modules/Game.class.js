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
    this.initialState = this.normalizeState(initialState);
    this.state = this.cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
    this.bestScoreKey = '2048-best-score';
    this.bestScore = this.loadBestScore();
  }

  moveLeft() {
    return this.makeMove((row) => this.processLine(row));
  }

  moveRight() {
    return this.makeMove((row) => this.processReversedLine(row));
  }

  moveUp() {
    return this.moveByColumns((column) => this.processLine(column));
  }

  moveDown() {
    return this.moveByColumns((column) => this.processReversedLine(column));
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
    return this.cloneState(this.state);
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

    this.addRandomTile();
    this.addRandomTile();
    this.status = 'playing';
    this.updateStatus();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.cloneState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here
  getBestScore() {
    return this.bestScore;
  }

  normalizeState(state) {
    const emptyState = this.createEmptyState();

    if (!Array.isArray(state)) {
      return emptyState;
    }

    return emptyState.map((row, rowIndex) => {
      return row.map((cell, colIndex) => state[rowIndex]?.[colIndex] || cell);
    });
  }

  createEmptyState() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  cloneState(state) {
    return state.map((row) => [...row]);
  }

  reverseLine(line) {
    return [...line].reverse();
  }

  getRandomTileValue() {
    return Math.random() < 0.1 ? 4 : 2;
  }

  getEmptyCells() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (!emptyCells.length) {
      return false;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    this.state[row][col] = this.getRandomTileValue();

    return true;
  }

  processLine(line) {
    const values = line.filter(Boolean);
    const mergedLine = [];
    let lineScore = 0;

    for (let index = 0; index < values.length; index++) {
      const current = values[index];
      const next = values[index + 1];

      if (current === next) {
        const mergedValue = current * 2;

        mergedLine.push(mergedValue);
        lineScore += mergedValue;
        index++;
      } else {
        mergedLine.push(current);
      }
    }

    while (mergedLine.length < 4) {
      mergedLine.push(0);
    }

    return {
      line: mergedLine,
      score: lineScore,
    };
  }

  processReversedLine(line) {
    const { line: processedLine, score } = this.processLine(
      this.reverseLine(line),
    );

    return {
      line: this.reverseLine(processedLine),
      score,
    };
  }

  makeMove(lineProcessor) {
    if (this.status !== 'playing') {
      return false;
    }

    const nextState = [];
    let moveScore = 0;

    for (const row of this.state) {
      const { line, score } = lineProcessor(row);

      nextState.push(line);
      moveScore += score;
    }

    if (!this.hasStateChanged(nextState)) {
      return false;
    }

    this.state = nextState;
    this.finishMove(moveScore);

    return true;
  }

  moveByColumns(columnProcessor) {
    if (this.status !== 'playing') {
      return false;
    }

    const nextState = this.createEmptyState();
    let moveScore = 0;

    for (let col = 0; col < 4; col++) {
      const column = this.state.map((row) => row[col]);
      const { line, score } = columnProcessor(column);

      moveScore += score;

      for (let row = 0; row < 4; row++) {
        nextState[row][col] = line[row];
      }
    }

    if (!this.hasStateChanged(nextState)) {
      return false;
    }

    this.state = nextState;
    this.finishMove(moveScore);

    return true;
  }

  finishMove(moveScore) {
    this.score += moveScore;
    this.saveBestScore();
    this.addRandomTile();
    this.updateStatus();
  }

  hasStateChanged(nextState) {
    return nextState.some((row, rowIndex) => {
      return row.some((cell, colIndex) => {
        return cell !== this.state[rowIndex][colIndex];
      });
    });
  }

  updateStatus() {
    if (this.hasWinningTile()) {
      this.status = 'win';

      return;
    }

    if (this.canMakeAnyMove()) {
      this.status = 'playing';

      return;
    }

    this.status = 'lose';
  }

  hasWinningTile() {
    return this.state.some((row) => row.some((cell) => cell >= 2048));
  }

  canMakeAnyMove() {
    if (this.getEmptyCells().length > 0) {
      return true;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.state[row][col];
        const right = this.state[row][col + 1];
        const down = this.state[row + 1]?.[col];

        if (current === right || current === down) {
          return true;
        }
      }
    }

    return false;
  }

  loadBestScore() {
    if (typeof localStorage === 'undefined') {
      return 0;
    }

    const savedScore = Number(localStorage.getItem(this.bestScoreKey));

    return Number.isNaN(savedScore) ? 0 : savedScore;
  }

  saveBestScore() {
    if (this.score <= this.bestScore) {
      return;
    }

    this.bestScore = this.score;

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.bestScoreKey, String(this.bestScore));
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports = Game;
}

if (typeof window !== 'undefined') {
  window.Game = Game;
}
