'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static STATUSES = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };
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
    this.state = initialState.map((row) => [...row]);
    this.status = Game.STATUSES.idle;
    this.score = 0;
  }

  moveLeft() {
    if (this.status !== Game.STATUSES.playing) {
      return;
    }

    let canMoveLeftInGroup = false;

    this.state = this.state.map((row) => {
      if (!this.#canMoveInGroup(row)) {
        return row;
      }

      canMoveLeftInGroup = true;

      return this.#slideTilesInGroup(row);
    });

    if (canMoveLeftInGroup) {
      this.addCell();
    }

    this.#setStatus();
  }

  moveRight() {
    if (this.status !== Game.STATUSES.playing) {
      return;
    }

    let canMoveRightInGroup = false;

    this.state = this.state.map((row) => {
      const rowReversed = [...row].reverse();

      if (!this.#canMoveInGroup(rowReversed)) {
        return row;
      }

      canMoveRightInGroup = true;

      return this.#slideTilesInGroup(rowReversed).reverse();
    });

    if (canMoveRightInGroup) {
      this.addCell();
    }

    this.#setStatus();
  }

  moveUp() {
    if (this.status !== Game.STATUSES.playing) {
      return;
    }

    let canMoveUpInGroup = false;

    const cellsGroupByColumns = this.#transpose(this.state);

    const updatedCellsGroupByColumns = cellsGroupByColumns.map((row) => {
      if (!this.#canMoveInGroup(row)) {
        return row;
      }

      canMoveUpInGroup = true;

      return this.#slideTilesInGroup(row);
    });

    this.state = this.#transpose(updatedCellsGroupByColumns);

    if (canMoveUpInGroup) {
      this.addCell();
    }

    this.#setStatus();
  }

  moveDown() {
    if (this.status !== Game.STATUSES.playing) {
      return;
    }

    let canMoveDownInGroup = false;

    const cellsGroupByColumns = this.#transpose(this.state);

    const updatedCellsGroupByColumns = cellsGroupByColumns.map((row) => {
      const reversedRow = [...row].reverse();

      if (!this.#canMoveInGroup(reversedRow)) {
        return row;
      }

      canMoveDownInGroup = true;

      return this.#slideTilesInGroup(reversedRow).reverse();
    });

    this.state = this.#transpose(updatedCellsGroupByColumns);

    if (canMoveDownInGroup) {
      this.addCell();
    }

    this.#setStatus();
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

  #setStatus() {
    if (!this.#checkCanMove()) {
      this.status = Game.STATUSES.lose;
    }

    if (this.#checkWin()) {
      this.status = Game.STATUSES.win;
    }
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = Game.STATUSES.playing;
    this.addCell();
    this.addCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.status = Game.STATUSES.idle;
    this.score = 0;
  }

  // Add your own methods here
  addCell() {
    const coord = this.#getRandomEmptyCell();

    if (coord !== null) {
      this.state[coord[0]][coord[1]] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  #getRandomEmptyCell() {
    const emptyCells = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[0].length; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length < 1) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }

  #transpose(arr) {
    return arr[0].map((_, colIndex) => arr.map((row) => row[colIndex]));
  }

  #slideTilesInGroup(group) {
    const mergedValues = [0, 0, 0, 0];

    for (let i = 1; i < group.length; i++) {
      if (group[i] === 0) {
        continue;
      }

      const cellWithNumIndex = i;
      let targetCellIndex = null;
      let j = i - 1;

      while (
        j >= 0 &&
        (group[j] === 0 ||
          (group[j] === group[cellWithNumIndex] && mergedValues[j] !== 1))
      ) {
        targetCellIndex = j;
        j--;
      }

      if (targetCellIndex === null) {
        continue;
      }

      if (group[targetCellIndex] === 0) {
        group[targetCellIndex] = group[cellWithNumIndex];
        group[cellWithNumIndex] = 0;
      } else {
        group[targetCellIndex] += group[cellWithNumIndex];
        group[cellWithNumIndex] = 0;

        mergedValues[targetCellIndex] = 1;

        this.score += group[targetCellIndex];
      }
    }

    return group;
  }

  #canMoveInGroup(group) {
    return group.some((cell, index) => {
      if (index === 0) {
        return false;
      }

      if (cell === 0) {
        return false;
      }

      if (group[index - 1] === 0) {
        return true;
      }

      if (group[index] === group[index - 1]) {
        return true;
      }

      return false;
    });
  }

  #checkCanMove() {
    const canMoveHorisontal = this.state.some((row) => {
      const reversedRow = [...row];

      if (this.#canMoveInGroup(row) || this.#canMoveInGroup(reversedRow)) {
        return true;
      }

      return false;
    });

    const canMoveVertical = this.#transpose(this.state).some((row) => {
      const reversedRow = [...row];

      if (this.#canMoveInGroup(row) || this.#canMoveInGroup(reversedRow)) {
        return true;
      }

      return false;
    });

    return canMoveHorisontal || canMoveVertical;
  }

  #checkWin() {
    return this.state.some((row) => {
      return row.some((cell) => cell === 2048);
    });
  }
}

module.exports = Game;
