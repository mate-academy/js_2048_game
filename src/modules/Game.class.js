'use strict';

class Game {
  movedCells = [];
  #NUMBER_OF_ROWS_CELLS = 4;
  initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  constructor() {
    this.gameState = structuredClone(this.initialState);
    this.gameStatus = 'idle';
    this.gameScore = 0;
  }

  moveLeft() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    this.resetMovedCells();

    const mergeLeft = (i, j, k) => {
      if (this.gameState[i][k] !== 0) {
        for (const movedCell of this.movedCells) {
          if (movedCell.y === i && movedCell.x === j) {
            movedCell.newX = j;
            movedCell.changed = true;
          }

          if (movedCell.y === i && movedCell.x === k) {
            movedCell.newX = j;
            movedCell.changed = true;
          }
        }
        this.gameState[i][j] *= 2;
        this.gameScore += this.gameState[i][j];
        this.gameState[i][k] = 0;
      }
    };

    for (let i = 0; i < this.#NUMBER_OF_ROWS_CELLS; i++) {
      for (let j = 0; j < this.#NUMBER_OF_ROWS_CELLS - 1; j++) {
        if (this.gameState[i][j] === this.gameState[i][j + 1]) {
          mergeLeft(i, j, j + 1);
        } else if (
          j < this.#NUMBER_OF_ROWS_CELLS - 2 &&
          this.gameState[i][j] === this.gameState[i][j + 2] &&
          this.gameState[i][j + 1] === 0
        ) {
          mergeLeft(i, j, j + 2);
        } else if (
          j < this.#NUMBER_OF_ROWS_CELLS - 3 &&
          this.gameState[i][j] === this.gameState[i][j + 3] &&
          this.gameState[i][j + 1] === 0 &&
          this.gameState[i][j + 2] === 0
        ) {
          mergeLeft(i, j, j + 3);
        }
      }
    }

    for (let num = 1; num <= this.#NUMBER_OF_ROWS_CELLS - 1; num++) {
      for (let i = 0; i < this.#NUMBER_OF_ROWS_CELLS; i++) {
        for (let j = 0; j < this.#NUMBER_OF_ROWS_CELLS - 1; j++) {
          if (this.gameState[i][j] === 0 && this.gameState[i][j + 1] !== 0) {
            for (const movedCell of this.movedCells) {
              if (
                movedCell.changed &&
                movedCell.y === i &&
                movedCell.newX === j + 1
              ) {
                movedCell.newX = j;
              }

              if (
                !movedCell.changed &&
                movedCell.y === i &&
                movedCell.x === j + 1
              ) {
                movedCell.newX = j;
                movedCell.changed = true;
              }
            }
            this.gameState[i][j] = this.gameState[i][j + 1];
            this.gameState[i][j + 1] = 0;
          }
        }
      }
    }

    this.spawnNumber();
    this.checkStatus();
  }
  moveRight() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    this.resetMovedCells();

    const mergeRight = (i, j, k) => {
      if (this.gameState[i][k] !== 0) {
        for (const movedCell of this.movedCells) {
          if (movedCell.y === i && movedCell.x === j) {
            movedCell.newX = j;
            movedCell.changed = true;
          }

          if (movedCell.y === i && movedCell.x === k) {
            movedCell.newX = j;
            movedCell.changed = true;
          }
        }
        this.gameState[i][j] *= 2;
        this.gameScore += this.gameState[i][j];
        this.gameState[i][k] = 0;
      }
    };

    for (let i = this.#NUMBER_OF_ROWS_CELLS - 1; i >= 0; i--) {
      for (let j = this.#NUMBER_OF_ROWS_CELLS - 1; j > 0; j--) {
        if (this.gameState[i][j] === this.gameState[i][j - 1]) {
          mergeRight(i, j, j - 1);
        } else if (
          j > 1 &&
          this.gameState[i][j] === this.gameState[i][j - 2] &&
          this.gameState[i][j - 1] === 0
        ) {
          mergeRight(i, j, j - 2);
        } else if (
          j > 2 &&
          this.gameState[i][j] === this.gameState[i][j - 3] &&
          this.gameState[i][j - 1] === 0 &&
          this.gameState[i][j - 2] === 0
        ) {
          mergeRight(i, j, j - 3);
        }
      }
    }

    for (let num = 1; num <= this.#NUMBER_OF_ROWS_CELLS - 1; num++) {
      for (let i = this.#NUMBER_OF_ROWS_CELLS - 1; i >= 0; i--) {
        for (let j = this.#NUMBER_OF_ROWS_CELLS - 1; j > 0; j--) {
          if (this.gameState[i][j] === 0 && this.gameState[i][j - 1] !== 0) {
            for (const movedCell of this.movedCells) {
              if (
                movedCell.changed &&
                movedCell.y === i &&
                movedCell.newX === j - 1
              ) {
                movedCell.newX = j;
              }

              if (
                !movedCell.changed &&
                movedCell.y === i &&
                movedCell.x === j - 1
              ) {
                movedCell.newX = j;
                movedCell.changed = true;
              }
            }
            this.gameState[i][j] = this.gameState[i][j - 1];
            this.gameState[i][j - 1] = 0;
          }
        }
      }
    }

    this.spawnNumber();
    this.checkStatus();
  }
  moveUp() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    this.resetMovedCells();

    const mergeUp = (i, j, k) => {
      if (this.gameState[k][j] !== 0) {
        for (const movedCell of this.movedCells) {
          if (movedCell.x === j && movedCell.y === i) {
            movedCell.newY = i;
            movedCell.changed = true;
          }

          if (movedCell.x === j && movedCell.y === k) {
            movedCell.newY = i;
            movedCell.changed = true;
          }
        }
        this.gameState[i][j] *= 2;
        this.gameScore += this.gameState[i][j];
        this.gameState[k][j] = 0;
      }
    };

    for (let j = 0; j < this.#NUMBER_OF_ROWS_CELLS; j++) {
      for (let i = 0; i < this.#NUMBER_OF_ROWS_CELLS - 1; i++) {
        if (this.gameState[i][j] === this.gameState[i + 1][j]) {
          mergeUp(i, j, i + 1);
        } else if (
          i < this.#NUMBER_OF_ROWS_CELLS - 2 &&
          this.gameState[i][j] === this.gameState[i + 2][j] &&
          this.gameState[i + 1][j] === 0
        ) {
          mergeUp(i, j, i + 2);
        } else if (
          i < this.#NUMBER_OF_ROWS_CELLS - 3 &&
          this.gameState[i][j] === this.gameState[i + 3][j] &&
          this.gameState[i + 1][j] === 0 &&
          this.gameState[i + 2][j] === 0
        ) {
          mergeUp(i, j, i + 3);
        }
      }
    }

    for (let num = 1; num <= this.#NUMBER_OF_ROWS_CELLS - 1; num++) {
      for (let j = 0; j < this.#NUMBER_OF_ROWS_CELLS; j++) {
        for (let i = 0; i < this.#NUMBER_OF_ROWS_CELLS - 1; i++) {
          if (this.gameState[i][j] === 0 && this.gameState[i + 1][j] !== 0) {
            for (const movedCell of this.movedCells) {
              if (
                movedCell.changed &&
                movedCell.newY === i + 1 &&
                movedCell.x === j
              ) {
                movedCell.newY = i;
              }

              if (
                !movedCell.changed &&
                movedCell.y === i + 1 &&
                movedCell.x === j
              ) {
                movedCell.newY = i;
                movedCell.changed = true;
              }
            }
            this.gameState[i][j] = this.gameState[i + 1][j];
            this.gameState[i + 1][j] = 0;
          }
        }
      }
    }

    this.spawnNumber();
    this.checkStatus();
  }
  moveDown() {
    if (this.gameStatus !== 'playing') {
      return;
    }

    this.resetMovedCells();

    const mergeDown = (i, j, k) => {
      if (this.gameState[k][j] !== 0) {
        for (const movedCell of this.movedCells) {
          if (movedCell.x === j && movedCell.y === i) {
            movedCell.newY = i;
            movedCell.changed = true;
          }

          if (movedCell.x === j && movedCell.y === k) {
            movedCell.newY = i;
            movedCell.changed = true;
          }
        }
        this.gameState[i][j] *= 2;
        this.gameScore += this.gameState[i][j];
        this.gameState[k][j] = 0;
      }
    };

    for (let j = this.#NUMBER_OF_ROWS_CELLS - 1; j >= 0; j--) {
      for (let i = this.#NUMBER_OF_ROWS_CELLS - 1; i > 0; i--) {
        if (this.gameState[i][j] === this.gameState[i - 1][j]) {
          mergeDown(i, j, i - 1);
        } else if (
          i > 1 &&
          this.gameState[i][j] === this.gameState[i - 2][j] &&
          this.gameState[i - 1][j] === 0
        ) {
          mergeDown(i, j, i - 2);
        } else if (
          i > 2 &&
          this.gameState[i][j] === this.gameState[i - 3][j] &&
          this.gameState[i - 1][j] === 0 &&
          this.gameState[i - 2][j] === 0
        ) {
          mergeDown(i, j, i - 3);
        }
      }
    }

    for (let num = 1; num <= this.#NUMBER_OF_ROWS_CELLS - 1; num++) {
      for (let j = this.#NUMBER_OF_ROWS_CELLS - 1; j >= 0; j--) {
        for (let i = this.#NUMBER_OF_ROWS_CELLS - 1; i > 0; i--) {
          if (this.gameState[i][j] === 0 && this.gameState[i - 1][j] !== 0) {
            for (const movedCell of this.movedCells) {
              if (
                movedCell.changed &&
                movedCell.newY === i - 1 &&
                movedCell.x === j
              ) {
                movedCell.newY = i;
              }

              if (
                !movedCell.changed &&
                movedCell.y === i - 1 &&
                movedCell.x === j
              ) {
                movedCell.newY = i;
                movedCell.changed = true;
              }
            }
            this.gameState[i][j] = this.gameState[i - 1][j];
            this.gameState[i - 1][j] = 0;
          }
        }
      }
    }

    this.spawnNumber();
    this.checkStatus();
  }

  getScore() {
    return this.gameScore;
  }

  getState() {
    return this.gameState;
  }

  resetMovedCells() {
    this.movedCells = [];

    for (let i = 0; i < this.#NUMBER_OF_ROWS_CELLS; i++) {
      for (let j = 0; j < this.#NUMBER_OF_ROWS_CELLS; j++) {
        if (this.gameState[i][j] !== 0) {
          this.movedCells.push({ x: j, y: i, changed: false });
        }
      }
    }
  }

  getMovedCells() {
    return this.movedCells;
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
    return this.gameStatus;
  }

  start() {
    if (this.gameStatus === 'idle') {
      this.gameStatus = 'playing';
      this.gameScore = 0;
      this.spawnNumber();
      this.spawnNumber();
    }
  }

  restart() {
    this.gameState = structuredClone(this.initialState);
    this.gameStatus = 'idle';
    this.gameScore = 0;
  }

  spawnNumber() {
    const freeCell = [];

    for (let i = 0; i < this.#NUMBER_OF_ROWS_CELLS; i++) {
      for (let j = 0; j < this.#NUMBER_OF_ROWS_CELLS; j++) {
        if (this.gameState[i][j] === 0) {
          freeCell.push({ x: i, y: j });
        }
      }
    }

    if (freeCell.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * freeCell.length);
    const PROBABILITY_FOR_FOUR = 10;
    const randomNumber =
      Math.random() * 100 + 1 <= PROBABILITY_FOR_FOUR ? 4 : 2;

    this.gameState[freeCell[randomIndex].x][freeCell[randomIndex].y] =
      randomNumber;
  }

  checkStatus() {
    if (this.gameState.some((row) => row.includes(2048))) {
      this.gameStatus = 'win';
    } else if (!this.canMove()) {
      this.gameStatus = 'lose';
    }
  }

  canMove() {
    if (this.gameState.some((row) => row.includes(0))) {
      return true;
    }

    for (let i = 0; i < this.#NUMBER_OF_ROWS_CELLS - 1; i++) {
      for (let j = 0; j < this.#NUMBER_OF_ROWS_CELLS - 1; j++) {
        if (this.gameState[i][j] === this.gameState[i + 1][j]) {
          return true;
        } else if (this.gameState[i][j] === this.gameState[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
