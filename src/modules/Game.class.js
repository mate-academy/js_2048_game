'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static Status = {
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
    this.initialState = [...initialState.concat()];
    this.state = [...initialState.concat()];
    this.status = Game.Status.idle;
    this.score = 0;
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
    this.updateStatus();

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = Game.Status.playing;
    this.state = this.initialState.concat();

    this.createRandomTile();
    this.createRandomTile();

    this.printTiles();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.clearTheBoard();

    this.printTiles();

    this.status = Game.Status.idle;

    this.score = 0;
  }

  moveRight() {
    if (this.status !== Game.Status.playing) {
      return;
    }

    let didTilesMove = false;

    for (let row = 0; row < 4; row++) {
      let didJustMerged = false;

      for (let tile = 2; tile >= 0; tile--) {
        if (this.state[row][tile] > 0) {
          let moveTileBy = 0;
          let merge = false;

          while (this.state[row][tile + moveTileBy + 1] === 0) {
            moveTileBy++;
          }

          if (
            !didJustMerged &&
            this.state[row][tile + moveTileBy + 1] === this.state[row][tile]
          ) {
            moveTileBy++;
            merge = true;
          }

          if (moveTileBy > 0) {
            if (!didJustMerged && merge) {
              didJustMerged = true;

              const newNumber = this.state[row][tile + moveTileBy] * 2;

              this.state[row][tile + moveTileBy] = newNumber;

              this.score += newNumber;
            } else {
              didJustMerged = false;

              this.state[row][tile + moveTileBy] = this.state[row][tile];
            }
            this.state[row][tile] = 0;

            didTilesMove = true;
          }
        }
      }
    }

    if (didTilesMove) {
      this.createRandomTile();
    }

    return didTilesMove;
  }

  moveLeft() {
    if (this.status !== Game.Status.playing) {
      return;
    }

    let didTilesMove = false;

    for (let row = 0; row < 4; row++) {
      let didJustMerged = false;

      for (let tile = 1; tile < 4; tile++) {
        if (this.state[row][tile] > 0) {
          let moveTileBy = 0;
          let merge = false;

          while (this.state[row][tile - moveTileBy - 1] === 0) {
            moveTileBy++;
          }

          if (
            !didJustMerged &&
            this.state[row][tile - moveTileBy - 1] === this.state[row][tile]
          ) {
            moveTileBy++;
            merge = true;
          }

          if (moveTileBy > 0) {
            if (!didJustMerged && merge) {
              didJustMerged = true;

              const newNumber = this.state[row][tile - moveTileBy] * 2;

              this.state[row][tile - moveTileBy] = newNumber;

              this.score += newNumber;
            } else {
              didJustMerged = false;

              this.state[row][tile - moveTileBy] = this.state[row][tile];
            }

            this.state[row][tile] = 0;

            didTilesMove = true;
          }
        }
      }
    }

    if (didTilesMove) {
      this.createRandomTile();
    }

    return didTilesMove;
  }

  moveUp() {
    if (this.status !== Game.Status.playing) {
      return;
    }

    let didTilesMove = false;

    for (let column = 0; column < 4; column++) {
      let didJustMerged = false;

      for (let tile = 1; tile < 4; tile++) {
        if (this.state[tile][column] > 0) {
          let moveTileBy = 0;
          let merge = false;

          while (
            tile - moveTileBy - 1 >= 0 &&
            this.state[tile - moveTileBy - 1][column] === 0
          ) {
            moveTileBy++;
          }

          if (
            !didJustMerged &&
            tile - moveTileBy - 1 >= 0 &&
            this.state[tile - moveTileBy - 1][column] ===
              this.state[tile][column]
          ) {
            moveTileBy++;
            merge = true;
          }

          if (moveTileBy > 0) {
            if (!didJustMerged && merge) {
              didJustMerged = true;

              const newNumber = this.state[tile - moveTileBy][column] * 2;

              this.state[tile - moveTileBy][column] = newNumber;

              this.score += newNumber;
            } else {
              didJustMerged = false;

              this.state[tile - moveTileBy][column] = this.state[tile][column];
            }

            this.state[tile][column] = 0;

            didTilesMove = true;
          }
        }
      }
    }

    if (didTilesMove) {
      this.createRandomTile();
    }

    return didTilesMove;
  }

  moveDown() {
    if (this.status !== Game.Status.playing) {
      return;
    }

    let didTilesMove = false;

    for (let column = 0; column < 4; column++) {
      let didJustMerged = false;

      for (let tile = 2; tile >= 0; tile--) {
        if (this.state[tile][column] > 0) {
          let moveTileBy = 0;
          let merge = false;

          while (
            tile + moveTileBy + 1 < this.state.length &&
            this.state[tile + moveTileBy + 1][column] === 0
          ) {
            moveTileBy++;
          }

          if (
            !didJustMerged &&
            tile + moveTileBy + 1 < this.state.length &&
            this.state[tile + moveTileBy + 1][column] ===
              this.state[tile][column]
          ) {
            moveTileBy++;
            merge = true;
          }

          if (moveTileBy > 0) {
            if (!didJustMerged && merge) {
              didJustMerged = true;

              const newNumber = this.state[tile + moveTileBy][column] * 2;

              this.state[tile + moveTileBy][column] = newNumber;

              this.score += newNumber;
            } else {
              didJustMerged = false;

              this.state[tile + moveTileBy][column] = this.state[tile][column];
            }

            this.state[tile][column] = 0;

            didTilesMove = true;
          }
        }
      }
    }

    if (didTilesMove) {
      this.createRandomTile();
    }

    return didTilesMove;
  }

  isPlaying() {
    return this.getStatus() === Game.Status.playing;
  }

  createRandomTile() {
    let row = this.randomNumber(3);

    while (!this.state[row].includes(0)) {
      row = this.randomNumber(3);
    }

    let cellIndex = this.randomNumber(3);

    while (this.state[row][cellIndex] !== 0) {
      cellIndex = this.randomNumber(3);
    }

    const newState = this.state.map((currentRow) => currentRow.slice());

    newState[row][cellIndex] = this.generateCellValue();
    this.state = newState;

    this.printTiles();
  }

  randomNumber(max) {
    return Math.round(Math.random() * max);
  }

  generateCellValue() {
    const result = Math.random();

    return result > 0.9 ? 4 : 2;
  }

  updateStatus() {
    if (this.didPlayerWin()) {
      this.status = Game.Status.win;
    } else if (this.didPlayerLose()) {
      this.status = Game.Status.lose;
    }
  }

  didPlayerWin() {
    for (const tile of this.state.flat()) {
      if (tile === 2048) {
        return true;
      }
    }

    return false;
  }

  didPlayerLose() {
    for (const tile of this.state.flat()) {
      if (tile === 0) {
        return false;
      }
    }

    for (let row = 0; row <= 3; row++) {
      for (let tile = 0; tile <= 2; tile++) {
        if (this.state[row][tile] === this.state[row][tile + 1]) {
          return false;
        }
      }
    }

    for (let column = 0; column <= 3; column++) {
      for (let tile = 0; tile <= 2; tile++) {
        if (this.state[tile][column] === this.state[tile + 1][column]) {
          return false;
        }
      }
    }

    return true;
  }

  printTiles() {
    const cells = document.getElementsByClassName('field-cell');

    const flatState = this.state.flat();

    for (let i = 0; i < flatState.length; i++) {
      const currentCell = cells[i];
      const currentState = flatState[i];

      if (currentState > 0) {
        if (currentCell !== undefined) {
          currentCell.textContent = currentState;
          currentCell.className = `field-cell field-cell--${currentState}`;
        }
      } else {
        if (currentCell !== undefined) {
          currentCell.textContent = '';
          currentCell.className = 'field-cell';
        }
      }
    }
  }

  clearTheBoard() {
    this.state = this.initialState.concat();
  }
}

module.exports = Game;
