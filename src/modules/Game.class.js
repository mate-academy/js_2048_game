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
  constructor(initialState) {
    const emptyBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.emptyBoard = emptyBoard.slice();

    this.state = initialState ?? emptyBoard.concat();
    this.emptyBoard = emptyBoard.concat();
    this.status = Game.Status.idle;
    this.score = 0;
  }

  // Game has status 'idle' by default
  status = 'idle';

  moveLeft() {}
  moveRight() {}
  moveUp() {}
  moveDown() {}

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
    this.createRandomTile();
    this.createRandomTile();
    this.printTiles();
  }

  /**
   * Resets the game.
   */
  restart() {
    // Clear the state info
    this.clearTheBoard();

    // Clear the board
    this.printTiles();

    // Restart the game status
    this.status = 'idle';

    // LATER --- CHECK WHETHER YOU NEED TO CALCULATE THE SCORE AGAIN
  }

  moveTilesRight() {
    let didTilesMove = false;

    for (let row = 0; row < 4; row++) {
      for (let tile = 2; tile >= 0; tile--) {
        // Check whether the tile we want to move isn't empty
        if (this.state[row][tile] > 0) {
          let moveTileBy = 0;
          let merge = false;

          // Check how far can we move the tile
          while (this.state[row][tile + moveTileBy + 1] === 0) {
            moveTileBy++;
          }

          // Check whether if we go one tile further we can merge
          if (
            this.state[row][tile + moveTileBy + 1] === this.state[row][tile]
          ) {
            moveTileBy++;
            merge = true;
          }

          if (moveTileBy > 0) {
            if (merge) {
              const newNumber = this.state[row][tile + moveTileBy] * 2;

              // Merge current tile to the left
              this.state[row][tile + moveTileBy] = newNumber;

              this.score += newNumber;
            } else {
              // Move the tile to the right
              this.state[row][tile + moveTileBy] = this.state[row][tile];
            }
            // Reset the tile we just moved
            this.state[row][tile] = 0;

            didTilesMove = true;
          }
        }
      }
    }

    return didTilesMove;
  }

  moveTilesLeft() {
    let didTilesMove = false;

    for (let row = 0; row < 4; row++) {
      for (let tile = 1; tile < 4; tile++) {
        // Check whether the tile we want to move isn't empty
        if (this.state[row][tile] > 0) {
          let moveTileBy = 0;
          let merge = false;

          // Check how far can we move the tile
          while (this.state[row][tile - moveTileBy - 1] === 0) {
            moveTileBy++;
          }

          // Check whether if we go one tile further we can merge
          if (
            this.state[row][tile - moveTileBy - 1] === this.state[row][tile]
          ) {
            moveTileBy++;
            merge = true;
          }

          if (moveTileBy > 0) {
            if (merge) {
              const newNumber = this.state[row][tile - moveTileBy] * 2;

              // Merge current tile to the left
              this.state[row][tile - moveTileBy] = newNumber;

              this.score += newNumber;
            } else {
              // Move the tile to the [CHECK DIRECTION] left
              this.state[row][tile - moveTileBy] = this.state[row][tile];
            }
            // Reset the tile we just moved
            this.state[row][tile] = 0;

            didTilesMove = true;
          }
        }
      }
    }

    return didTilesMove;
  }

  moveTilesUp() {
    let didTilesMove = false;

    // Iterate through every column
    for (let column = 0; column < 4; column++) {
      // Iterate through the current column
      for (let tile = 1; tile < 4; tile++) {
        // Iterate through each tile in the current column

        // Check whether the tile we want to move isn't empty
        if (this.state[tile][column] > 0) {
          let moveTileBy = 0;
          let merge = false;

          // Check how far can we move the tile
          while (
            tile - moveTileBy - 1 >= 0 &&
            this.state[tile - moveTileBy - 1][column] === 0
          ) {
            moveTileBy++;
          }

          // Check whether if we go one tile further we can merge
          if (
            tile - moveTileBy - 1 >= 0 &&
            this.state[tile - moveTileBy - 1][column] ===
              this.state[tile][column]
          ) {
            moveTileBy++;
            merge = true;
          }

          if (moveTileBy > 0) {
            if (merge) {
              const newNumber = this.state[tile - moveTileBy][column] * 2;

              // Merge current tile to the right
              this.state[tile - moveTileBy][column] = newNumber;

              this.score += newNumber;
            } else {
              // Move the tile [CHECK DIRECTION] down
              this.state[tile - moveTileBy][column] = this.state[tile][column];
            }
            // Reset the tile we just moved
            this.state[tile][column] = 0;

            didTilesMove = true;
          }
        }
      }
    }

    return didTilesMove;
  }

  moveTilesDown() {
    let didTilesMove = false;

    // Iterate through every column
    for (let column = 0; column < 4; column++) {
      // Iterate through the current column
      for (let tile = 2; tile >= 0; tile--) {
        // Iterate through each tile in the current column

        // Check whether the tile we want to move isn't empty
        if (this.state[tile][column] > 0) {
          let moveTileBy = 0;
          let merge = false;

          // Check how far can we move the tile
          while (
            tile + moveTileBy + 1 < this.state.length &&
            this.state[tile + moveTileBy + 1][column] === 0
          ) {
            moveTileBy++;
          }

          // Check whether if we go one tile further we can merge
          if (
            tile + moveTileBy + 1 < this.state.length &&
            this.state[tile + moveTileBy + 1][column] ===
              this.state[tile][column]
          ) {
            moveTileBy++;
            merge = true;
          }

          if (moveTileBy > 0) {
            if (merge) {
              const newNumber = this.state[tile + moveTileBy][column] * 2;

              // Merge current tile to the right
              this.state[tile + moveTileBy][column] = newNumber;

              this.score += newNumber;
            } else {
              // Move the tile [CHECK DIRECTION] down
              this.state[tile + moveTileBy][column] = this.state[tile][column];
            }
            // Reset the tile we just moved
            this.state[tile][column] = 0;

            didTilesMove = true;
          }
        }
      }
    }

    return didTilesMove;
  }

  // Add your own methods here
  createRandomTile() {
    const rowOptions = [0, 1, 2, 3];
    const cellOptions = [0, 1, 2, 3];

    // Choose random from 0 - 3
    let row = this.randomNumber(3);

    // Keep assigning rows if the current one doesn't contain a 0
    while (!this.state[row].includes(0)) {
      if (rowOptions.length === 0) {
        return;
      }

      // Remove random form the options array so you don't choose it again
      rowOptions.splice(row, 1);

      // Assign the row
      row = this.randomNumber(rowOptions.length - 1);
    }

    let cell = this.randomNumber(3);

    // Keep assigning a cell while the current one is occupied
    while (this.state[row][cell] !== 0) {
      if (cellOptions.length === 0) {
        return;
      }

      // Remove random form the options array so you don't choose it again
      cellOptions.splice(row, 1);

      // Assign the cell
      cell = this.randomNumber(rowOptions.length - 1);
    }

    this.state[row][cell] = this.generateCellValue();
  }

  randomNumber(max) {
    return Math.round(Math.random() * max);
  }

  generateCellValue() {
    const result = Math.random();

    return result > 0.9 ? 4 : 2;
  }

  printTiles() {
    const cells = document.getElementsByClassName('field-cell');

    const flatState = this.state.flat();

    for (let i = 0; i < flatState.length; i++) {
      const currentCell = cells[i];
      const currentState = flatState[i];

      if (currentState > 0) {
        currentCell.textContent = currentState;
        currentCell.className = `field-cell field-cell--${currentState}`;
      } else {
        currentCell.textContent = '';
        currentCell.className = 'field-cell';
      }
    }
  }

  clearTheBoard() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }
}

module.exports = Game;
