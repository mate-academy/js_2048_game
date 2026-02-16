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
    const emptyBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    const startBoard = initialState ?? emptyBoard;

    this.initialState = startBoard.map((row) => [...row]);
    this.state = startBoard.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  isBoardChanged(prevState, newState) {
    for (let r = 0; r < prevState.length; r++) {
      for (let c = 0; c < prevState[r].length; c++) {
        if (prevState[r][c] !== newState[r][c]) {
          return true;
        }
      }
    }

    return false;
  }

  /* Moves the tiles to the left. */

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.getState();

    let totalScore = 0;

    for (let row = 0; row < this.state.length; row++) {
      const { mergedLine, gainedScore } = this.slideAndMerge(this.state[row]);

      this.state[row] = mergedLine;
      totalScore += gainedScore;
    }

    if (!this.isBoardChanged(prevState, this.state)) {
      return;
    }

    this.score += totalScore;
    this.spawnTile();
    this.updateGameStatus();
  }

  /* Moves the tiles to the right. */
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.getState();

    let totalScore = 0;

    for (let row = 0; row < this.state.length; row++) {
      const reversedRow = [...this.state[row]].reverse();
      const { mergedLine, gainedScore } = this.slideAndMerge(reversedRow);

      this.state[row] = [...mergedLine].reverse();
      totalScore += gainedScore;
    }

    if (!this.isBoardChanged(prevState, this.state)) {
      return;
    }

    this.score += totalScore;
    this.spawnTile();
    this.updateGameStatus();
  }

  /* Moves the tiles up. */
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.getState();

    let totalScore = 0;

    for (let col = 0; col < this.state[0].length; col++) {
      const column = this.state.map((row) => row[col]);
      const { mergedLine, gainedScore } = this.slideAndMerge(column);

      for (let row = 0; row < this.state.length; row++) {
        this.state[row][col] = mergedLine[row];
      }

      totalScore += gainedScore;
    }

    if (!this.isBoardChanged(prevState, this.state)) {
      return;
    }

    this.score += totalScore;
    this.spawnTile();
    this.updateGameStatus();
  }

  /* Moves the tiles down. */
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.getState();
    let totalScore = 0;

    for (let col = 0; col < this.state[0].length; col++) {
      const column = this.state.map((row) => row[col]).reverse();
      const { mergedLine, gainedScore } = this.slideAndMerge(column);

      const reversedMergedLine = [...mergedLine].reverse();

      for (let row = 0; row < this.state.length; row++) {
        this.state[row][col] = reversedMergedLine[row];
      }

      totalScore += gainedScore;
    }

    if (!this.isBoardChanged(prevState, this.state)) {
      return;
    }

    this.score += totalScore;
    this.spawnTile();
    this.updateGameStatus();
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
    return this.state.map((row) => [...row]);
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
  /* Checks if the board has a tile with the value of 2048. */
  has2048() {
    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }
  /* Checks if there are no valid moves. */
  hasNoValidMoves() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      return false;
    }

    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        const currentTile = this.state[row][col];

        if (
          (row < this.state.length - 1 &&
            this.state[row + 1][col] === currentTile) ||
          (col < this.state[row].length - 1 &&
            this.state[row][col + 1] === currentTile)
        ) {
          return false;
        }
      }
    }

    return true;
  }

  /* Checks if the game is won or lost and updates the status accordingly. */
  updateGameStatus() {
    if (this.has2048()) {
      this.status = 'win';
    } else if (this.hasNoValidMoves()) {
      this.status = 'lose';
    }
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    this.spawnTile();
    this.spawnTile();
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < this.state.length; row++) {
      for (let col = 0; col < this.state[row].length; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells;
  }

  spawnTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    this.state[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  slideAndMerge(line) {
    const nonZeroTiles = line.filter((tile) => tile !== 0);

    const mergedLine = [];
    let gainedScore = 0;

    for (let i = 0; i < nonZeroTiles.length; i++) {
      if (
        i < nonZeroTiles.length - 1 &&
        nonZeroTiles[i] === nonZeroTiles[i + 1]
      ) {
        const mergedValue = nonZeroTiles[i] * 2;

        mergedLine.push(mergedValue);
        gainedScore += mergedValue;
        i++; // Skip the next tile since it's merged
      } else {
        mergedLine.push(nonZeroTiles[i]);
      }
    }

    // Pad the merged line with zeros to maintain the same length
    while (mergedLine.length < line.length) {
      mergedLine.push(0);
    }

    return { mergedLine, gainedScore };
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
}

module.exports = Game;
