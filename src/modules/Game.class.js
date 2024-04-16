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
    this.state = initialState.concat();
    this.status = Game.Status.idle;
    this.score = 0;

    // Set the initial state for tests
    this.initialState = initialState.concat();
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
    // Check whether we can move
    if (this.status !== Game.Status.playing) {
      return;
    }

    // Store info whether we moved anything on the board - we return it
    let didTilesMove = false;

    // Iterate through each row
    for (let row = 0; row < 4; row++) {
      // Info from last iteration - cannot merge twice in a row
      let didJustMerged = false;

      // Iterate through each tile in current row
      for (let tile = 2; tile >= 0; tile--) {
        // Check whether the current tile is occupied
        if (this.state[row][tile] > 0) {
          // How far we can move this tile
          let moveTileBy = 0;

          // Will me merge this tile
          let merge = false;

          // Check how far we can move this tile
          while (this.state[row][tile + moveTileBy + 1] === 0) {
            moveTileBy++;
          }

          // Check if we can move 1 tile more & merge
          if (
            !didJustMerged &&
            this.state[row][tile + moveTileBy + 1] === this.state[row][tile]
          ) {
            // Increase distance by 1 and store merge info
            moveTileBy++;
            merge = true;
          }

          // If we are moving the tile
          if (moveTileBy > 0) {
            // If we merge at the end
            if (!didJustMerged && merge) {
              // Save the merge info for the next iteration
              didJustMerged = true;

              // Get new bigger tile value after merging
              const newNumber = this.state[row][tile + moveTileBy] * 2;

              // Set new tile value
              this.state[row][tile + moveTileBy] = newNumber;

              // Update game score
              this.score += newNumber;
            } else {
              // Have not merged - remember for next iteration
              didJustMerged = false;

              // Move the tile
              this.state[row][tile + moveTileBy] = this.state[row][tile];
            }

            // Reset current tile value - We moved it
            this.state[row][tile] = 0;

            // Store info that we moved tiles
            didTilesMove = true;
          }
        }
      }
    }

    // If we moved anything, create random tile on board
    if (didTilesMove) {
      this.createRandomTile();
    }

    // Return whether we moved anything
    return didTilesMove;
  }

  moveLeft() {
    // Check whether we can move
    if (this.status !== Game.Status.playing) {
      return;
    }

    // Store info whether we moved anything on the board - we return it
    let didTilesMove = false;

    // Iterate through each row
    for (let row = 0; row < 4; row++) {
      // Info from last iteration - cannot merge twice in a row
      let didJustMerged = false;

      // Iterate through each tile in current row
      for (let tile = 1; tile < 4; tile++) {
        // Check whether the current tile is occupied
        if (this.state[row][tile] > 0) {
          // How far we can move this tile
          let moveTileBy = 0;

          // Will me merge this tile
          let merge = false;

          // Check how far we can move this tile
          while (this.state[row][tile - moveTileBy - 1] === 0) {
            moveTileBy++;
          }

          // Check if we can move 1 tile more & merge
          if (
            !didJustMerged &&
            this.state[row][tile - moveTileBy - 1] === this.state[row][tile]
          ) {
            // Increase distance by 1 and store merge info
            moveTileBy++;
            merge = true;
          }

          // If we are moving the tile
          if (moveTileBy > 0) {
            // If we merge at the end
            if (!didJustMerged && merge) {
              // Save the merge info for the next iteration
              didJustMerged = true;

              // Get new bigger tile value after merging
              const newNumber = this.state[row][tile - moveTileBy] * 2;

              // Change the tile value in the game state
              this.state[row][tile - moveTileBy] = newNumber;

              // Update game score
              this.score += newNumber;
            } else {
              // Have not merged - remember for next iteration
              didJustMerged = false;

              // Move the tile
              this.state[row][tile - moveTileBy] = this.state[row][tile];
            }

            // Reset current tile value - We moved it
            this.state[row][tile] = 0;

            // Store info that we moved tiles
            didTilesMove = true;
          }
        }
      }
    }

    // If we moved anything, create random tile on board
    if (didTilesMove) {
      this.createRandomTile();
    }

    // Return whether we moved anything
    return didTilesMove;
  }

  moveUp() {
    // Check whether we can move
    if (this.status !== Game.Status.playing) {
      return;
    }

    // Store info whether we moved anything on the board - we return it
    let didTilesMove = false;

    // Iterate through each column
    for (let column = 0; column < 4; column++) {
      // Info from last iteration - cannot merge twice in a row
      let didJustMerged = false;

      // Iterate through each tile in current column
      for (let tile = 1; tile < 4; tile++) {
        // Check whether the current tile is occupied
        if (this.state[tile][column] > 0) {
          // How far we can move this tile
          let moveTileBy = 0;

          // Will me merge this tile
          let merge = false;

          // Check how far we can move this tile
          while (
            tile - moveTileBy - 1 >= 0 &&
            this.state[tile - moveTileBy - 1][column] === 0
          ) {
            moveTileBy++;
          }

          // Check if we can move 1 tile more & merge
          if (
            !didJustMerged &&
            tile - moveTileBy - 1 >= 0 &&
            this.state[tile - moveTileBy - 1][column] ===
              this.state[tile][column]
          ) {
            // Increase distance by 1 and store merge info
            moveTileBy++;
            merge = true;
          }

          // If we are moving the tile
          if (moveTileBy > 0) {
            // If we merge at the end
            if (!didJustMerged && merge) {
              // Save the merge info for the next iteration
              didJustMerged = true;

              // Get new bigger tile value after merging
              const newNumber = this.state[tile - moveTileBy][column] * 2;

              // Update the tile value in the game state
              this.state[tile - moveTileBy][column] = newNumber;

              // Update game score
              this.score += newNumber;
            } else {
              // Have not merged - remember for next iteration
              didJustMerged = false;

              // Move the tile
              this.state[tile - moveTileBy][column] = this.state[tile][column];
            }

            // Reset current tile value - We moved it
            this.state[tile][column] = 0;

            // Store info that we moved tiles
            didTilesMove = true;
          }
        }
      }
    }

    // If we moved anything, create random tile on board
    if (didTilesMove) {
      this.createRandomTile();
    }

    // Return whether we moved anything
    return didTilesMove;
  }

  moveDown() {
    // Check whether we can move
    if (this.status !== Game.Status.playing) {
      return;
    }

    // Store info whether we moved anything on the board - we return it
    let didTilesMove = false;

    // Iterate through each column
    for (let column = 0; column < 4; column++) {
      // Info from last iteration - cannot merge twice in a row
      let didJustMerged = false;

      // Iterate through each tile in current column
      for (let tile = 2; tile >= 0; tile--) {
        // Check whether the current tile is occupied
        if (this.state[tile][column] > 0) {
          // How far we can move this tile
          let moveTileBy = 0;

          // Will me merge this tile
          let merge = false;

          // Check how far we can move this tile
          while (
            tile + moveTileBy + 1 < this.state.length &&
            this.state[tile + moveTileBy + 1][column] === 0
          ) {
            moveTileBy++;
          }

          // Check if we can move 1 tile more & merge
          if (
            !didJustMerged &&
            tile + moveTileBy + 1 < this.state.length &&
            this.state[tile + moveTileBy + 1][column] ===
              this.state[tile][column]
          ) {
            // Increase distance by 1 and store merge info
            moveTileBy++;
            merge = true;
          }

          // If we are moving the tile
          if (moveTileBy > 0) {
            // If we merge at the end
            if (!didJustMerged && merge) {
              // Save the merge info for the next iteration
              didJustMerged = true;

              // Get new bigger tile value after merging
              const newNumber = this.state[tile + moveTileBy][column] * 2;

              // Update the tile value in the game state
              this.state[tile + moveTileBy][column] = newNumber;

              // Update game score
              this.score += newNumber;
            } else {
              // Have not merged - remember for next iteration
              didJustMerged = false;

              // Move the tile
              this.state[tile + moveTileBy][column] = this.state[tile][column];
            }

            // Reset current tile value - We moved it
            this.state[tile][column] = 0;

            // Store info that we moved tiles
            didTilesMove = true;
          }
        }
      }
    }

    // If we moved anything, create random tile on board
    if (didTilesMove) {
      this.createRandomTile();
    }

    // Return whether we moved anything
    return didTilesMove;
  }

  isPlaying() {
    return this.getStatus() === Game.Status.playing;
  }

  createRandomTile() {
    // Assign a random row
    let row = this.randomNumber(3);

    // If the row doesn't contain a 0
    while (!this.state[row].includes(0)) {
      // Keep re-assigning a new row until it has a 0
      row = this.randomNumber(3);
    }

    // Assign a random tile
    let cell = this.randomNumber(3);

    // If the tile's value is 0
    while (this.state[row][cell] !== 0) {
      // Keep re-assigning a new cell until it has a 0
      cell = this.randomNumber(3);
    }

    // Get a copy of the current state so we don't change the initialState
    const newState = this.state.map((currentRow) => currentRow.slice());

    // Update new cell value
    newState[row][cell] = this.generateCellValue();

    // Update the state
    this.state = newState;

    // Print the tiles on the board
    this.printTiles();
  }

  // Get a number between 0-max
  randomNumber(max) {
    return Math.round(Math.random() * max);
  }

  // Get a cell value: 2 or 4
  generateCellValue() {
    const result = Math.random();

    return result > 0.9 ? 4 : 2;
  }

  // Check the current game state and update game status
  updateStatus() {
    if (this.didPlayerWin()) {
      this.status = Game.Status.win;
    } else if (this.didPlayerLose()) {
      this.status = Game.Status.lose;
    }
  }

  didPlayerWin() {
    // Check whether there is a tile with 2048 value in the state
    for (const tile of this.state.flat()) {
      if (tile === 2048) {
        return true;
      }
    }

    return false;
  }

  didPlayerLose() {
    // If there is a 0 in the state - still playing
    for (const tile of this.state.flat()) {
      if (tile === 0) {
        return false;
      }
    }

    // Check for possible horizontal merges
    for (let row = 0; row <= 3; row++) {
      for (let tile = 0; tile <= 2; tile++) {
        if (this.state[row][tile] === this.state[row][tile + 1]) {
          return false;
        }
      }
    }

    // Check for possible vertical merges
    for (let column = 0; column <= 3; column++) {
      for (let tile = 0; tile <= 2; tile++) {
        if (this.state[tile][column] === this.state[tile + 1][column]) {
          return false;
        }
      }
    }

    // No moves left - game lost
    return true;
  }

  printTiles() {
    // Get an array of cells
    const cells = document.getElementsByClassName('field-cell');

    // Get a state as an array of numbers
    const flatState = this.state.flat();

    // Iterate through each cell and state
    for (let i = 0; i < flatState.length; i++) {
      const currentCell = cells[i];
      const currentState = flatState[i];

      // If current tile is occupied
      if (currentState > 0) {
        // If current cell exists
        if (currentCell !== undefined) {
          // Update the cell's html info
          currentCell.textContent = currentState;
          currentCell.className = `field-cell field-cell--${currentState}`;
        }
      } else {
        // Cell is empty
        if (currentCell !== undefined) {
          // Update the cell's html info
          currentCell.textContent = '';
          currentCell.className = 'field-cell';
        }
      }
    }
  }

  clearTheBoard() {
    // Set the state to the initialState (passed or empty)
    this.state = this.initialState.concat();
  }
}

module.exports = Game;
