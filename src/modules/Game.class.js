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
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.currentState = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.isIdle = true;
    this.status = 'idle';
  }

  moveLeft(gameBoard) {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const addedTiles = [];
    let isChanged = false;

    for (let i = 1; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 1; k < 4; k++) {
          if (
            this.currentState[j][k - 1] === 0 &&
            this.currentState[j][k] !== 0
          ) {
            isChanged = true;

            if (
              addedTiles.some(
                (tile) =>
                  tile[0] === j &&
                  tile[1] === k &&
                  tile[2] === this.currentState[j][k],
              )
            ) {
              addedTiles.push([j, k - 1, this.currentState[j][k]]);

              addedTiles.filter((tile) => {
                return tile[0] !== j && tile[1] !== k;
              });
            }

            this.currentState[j][k - 1] = this.currentState[j][k];
            this.currentState[j][k] = 0;
          } else if (
            this.currentState[j][k - 1] === this.currentState[j][k] &&
            this.currentState[j][k] !== 0
          ) {
            isChanged = true;

            if (
              !addedTiles.some(
                (tile) =>
                  tile[0] === j &&
                  tile[1] === k &&
                  tile[2] === this.currentState[j][k],
              ) &&
              !addedTiles.some(
                (tile) =>
                  tile[0] === j &&
                  tile[1] === k - 1 &&
                  tile[2] === this.currentState[j][k - 1],
              )
            ) {
              const result = this.currentState[j][k] * 2;

              this.score += result;
              this.currentState[j][k - 1] = result;
              this.currentState[j][k] = 0;
              addedTiles.push([j, k - 1, result]);
            }
          }
        }
      }
    }

    if (isChanged) {
      isChanged = false;
      this.addRandomTile();
    }
  }
  moveRight() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const addedTiles = [];
    let isChanged = false;

    for (let i = 1; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 2; k >= 0; k--) {
          if (
            this.currentState[j][k + 1] === 0 &&
            this.currentState[j][k] !== 0
          ) {
            isChanged = true;

            if (
              addedTiles.some(
                (tile) =>
                  tile[0] === j &&
                  tile[1] === k &&
                  tile[2] === this.currentState[j][k],
              )
            ) {
              addedTiles.push([j, k + 1, this.currentState[j][k]]);

              addedTiles.filter((tile) => {
                return tile[0] !== j && tile[1] !== k;
              });
            }

            this.currentState[j][k + 1] = this.currentState[j][k];
            this.currentState[j][k] = 0;
          } else if (
            this.currentState[j][k + 1] === this.currentState[j][k] &&
            this.currentState[j][k] !== 0
          ) {
            isChanged = true;

            if (
              !addedTiles.some(
                (tile) =>
                  tile[0] === j &&
                  tile[1] === k &&
                  tile[2] === this.currentState[j][k],
              ) &&
              !addedTiles.some(
                (tile) =>
                  tile[0] === j &&
                  tile[1] === k + 1 &&
                  tile[2] === this.currentState[j][k + 1],
              )
            ) {
              const result = this.currentState[j][k] * 2;

              this.score += result;
              this.currentState[j][k + 1] = result;
              this.currentState[j][k] = 0;
              addedTiles.push([j, k + 1, result]);
            }
          }
        }
      }
    }

    if (isChanged) {
      isChanged = false;
      this.addRandomTile();
    }
  }
  moveUp() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const addedTiles = [];
    let isChanged = false;

    for (let i = 1; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 1; k < 4; k++) {
          if (
            this.currentState[k - 1][j] === 0 &&
            this.currentState[k][j] !== 0
          ) {
            isChanged = true;

            if (
              addedTiles.some(
                (tile) =>
                  tile[0] === k &&
                  tile[1] === j &&
                  tile[2] === this.currentState[k][j],
              )
            ) {
              addedTiles.push([k - 1, j, this.currentState[k][j]]);

              addedTiles.filter((tile) => {
                return tile[0] !== k && tile[1] !== j;
              });
            }

            this.currentState[k - 1][j] = this.currentState[k][j];
            this.currentState[k][j] = 0;
          } else if (
            this.currentState[k - 1][j] === this.currentState[k][j] &&
            this.currentState[k][j] !== 0
          ) {
            isChanged = true;

            if (
              !addedTiles.some(
                (tile) =>
                  tile[0] === k &&
                  tile[1] === j &&
                  tile[2] === this.currentState[k][j],
              ) &&
              !addedTiles.some(
                (tile) =>
                  tile[0] === k - 1 &&
                  tile[1] === j &&
                  tile[2] === this.currentState[k - 1][j],
              )
            ) {
              const result = this.currentState[k][j] * 2;

              this.score += result;
              this.currentState[k - 1][j] = result;
              this.currentState[k][j] = 0;
              addedTiles.push([k - 1, j, result]);
            }
          }
        }
      }
    }

    if (isChanged) {
      isChanged = false;
      this.addRandomTile();
    }
  }
  moveDown() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    const addedTiles = [];
    let isChanged = false;

    for (let i = 1; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 2; k >= 0; k--) {
          if (
            this.currentState[k + 1][j] === 0 &&
            this.currentState[k][j] !== 0
          ) {
            isChanged = true;

            if (
              addedTiles.some(
                (tile) =>
                  tile[0] === k &&
                  tile[1] === j &&
                  tile[2] === this.currentState[k][j],
              )
            ) {
              addedTiles.push([k + 1, j, this.currentState[k][j]]);

              addedTiles.filter((tile) => {
                return tile[0] !== k && tile[1] !== j;
              });
            }

            this.currentState[k + 1][j] = this.currentState[k][j];
            this.currentState[k][j] = 0;
          } else if (
            this.currentState[k + 1][j] === this.currentState[k][j] &&
            this.currentState[k][j] !== 0
          ) {
            isChanged = true;

            if (
              !addedTiles.some(
                (tile) =>
                  tile[0] === k &&
                  tile[1] === j &&
                  tile[2] === this.currentState[k][j],
              ) &&
              !addedTiles.some(
                (tile) =>
                  tile[0] === k + 1 &&
                  tile[1] === j &&
                  tile[2] === this.currentState[k + 1][j],
              )
            ) {
              const result = this.currentState[k][j] * 2;

              this.score += result;
              this.currentState[k + 1][j] = result;
              this.currentState[k][j] = 0;
              addedTiles.push([k + 1, j, result]);
            }
          }
        }
      }
    }

    if (isChanged) {
      isChanged = false;
      this.addRandomTile();
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
    return this.currentState;
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
    if (this.isIdle) {
      this.status = 'idle';

      return this.status;
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.currentState[i][j] === 2048) {
          this.status = 'win';

          return this.status;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.currentState[i][j];

        if (
          current === 0 ||
          (i > 0 && current === this.currentState[i - 1][j]) ||
          (i < 3 && current === this.currentState[i + 1][j]) ||
          (j > 0 && current === this.currentState[i][j - 1]) ||
          (j < 3 && current === this.currentState[i][j + 1])
        ) {
          this.status = 'playing';

          return this.status;
        }
      }
    }
    this.status = 'lose';

    return this.status;
  }

  addRandomTile() {
    while (true) {
      const row = Math.round(Math.random() * 3);
      const cell = Math.round(Math.random() * 3);

      if (this.currentState[row][cell] === 0) {
        this.currentState[row][cell] = Math.random() * 10 > 1 ? 2 : 4;

        return;
      }
    }
  }
  /**
   * Starts the game.
   */
  start() {
    this.isIdle = false;
    this.score = 0;

    for (let i = 0; i < 2; i++) {
      this.addRandomTile();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.isIdle = true;
    this.status = 'idle';

    this.currentState = this.initialState.map((row) => [...row]);
    this.score = 0;
  }

  // Add your own methods here
}

module.exports = Game;
