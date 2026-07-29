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
    // eslint-disable-next-line no-console
    const board = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.initialState = board.map((row) => [...row]);
    this.state = board.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  addRamdomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.state.length; r++) {
      for (let c = 0; c < this.state[r].length; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    const [row, col] = emptyCells[randomIndex];

    const newValue = Math.random() < 0.9 ? 2 : 4;

    this.state[row][col] = newValue;
  }

  mergeRow(row) {
    const filteredRow = row.filter((cell) => cell !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        this.score += filteredRow[i];
        filteredRow.splice(i + 1, 1);
      }
    }

    while (filteredRow.length < 4) {
      filteredRow.push(0);
    }

    return filteredRow;
  }

  endMove(previousState) {
    const hasChanged =
      JSON.stringify(previousState) !== JSON.stringify(this.state);

    if (hasChanged) {
      this.addRamdomTile();
    }

    for (let r = 0; r < this.state.length; r++) {
      for (let c = 0; c < this.state[r].length; c++) {
        if (this.state[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    let hasEmptyCell = false;

    for (let r = 0; r < this.state.length; r++) {
      for (let c = 0; c < this.state[r].length; c++) {
        if (this.state[r][c] === 0) {
          hasEmptyCell = true;
          break;
        }
      }

      if (hasEmptyCell) {
        break;
      }
    }

    let hasPossibleMerge = false;

    for (let r = 0; r < this.state.length; r++) {
      for (let c = 0; c < this.state[r].length - 1; c++) {
        if (this.state[r][c] === this.state[r][c + 1]) {
          hasPossibleMerge = true;
          break;
        }
      }

      if (hasPossibleMerge) {
        break;
      }
    }

    if (!hasPossibleMerge) {
      for (let r = 0; r < this.state.length - 1; r++) {
        for (let c = 0; c < this.state[r].length; c++) {
          if (this.state[r][c] === this.state[r + 1][c]) {
            hasPossibleMerge = true;
            break;
          }
        }

        if (hasPossibleMerge) {
          break;
        }
      }
    }

    if (!hasEmptyCell && !hasPossibleMerge) {
      this.status = 'lose';
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.state.map((row) => [...row]);

    this.state = this.state.map((row) => this.mergeRow(row));

    this.endMove(previousState);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.state.map((row) => [...row]);

    this.state = this.state.map((row) => {
      const reversedRow = [...row].reverse();
      const mergedRow = this.mergeRow(reversedRow);

      return mergedRow.reverse();
    });

    this.endMove(previousState);
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.state.map((row) => [...row]);

    for (let c = 0; c < this.state.length; c++) {
      const column = this.state.map((row) => row[c]);
      const mergedColumn = this.mergeRow(column);

      for (let r = 0; r < this.state.length; r++) {
        this.state[r][c] = mergedColumn[r];
      }
    }

    this.endMove(previousState);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const previousState = this.state.map((row) => [...row]);

    for (let c = 0; c < this.state.length; c++) {
      const column = this.state.map((row) => row[c]);

      const reversedColumn = [...column].reverse();
      const mergedColum = this.mergeRow(reversedColumn);
      const finalColumn = mergedColum.reverse();

      for (let r = 0; r < this.state.length; r++) {
        this.state[r][c] = finalColumn[r];
      }
    }

    this.endMove(previousState);
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

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';

    this.addRamdomTile();
    this.addRamdomTile();
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
