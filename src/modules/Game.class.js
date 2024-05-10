'use strict';

class Game {
  static Status = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(
    initialState = Array.from({ length: 4 }, () => Array(4).fill(0)),
  ) {
    this.state = [...initialState];
    this.status = Game.Status.idle;
    this.score = 0;
    this.initialState = [...initialState];
    this.undoStack = []; // Stack to store previous game states
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    this.updateStatus();

    return this.status;
  }

  start() {
    this.status = Game.Status.playing;
    this.state = this.initialState.concat();
    this.createRandomTile();
    this.createRandomTile();
    this.printTiles();
  }

  restart() {
    this.clearTheBoard();
    this.printTiles();
    this.status = Game.Status.idle;
    this.score = 0;
    this.undoStack = []; // Clear undo stack on restart
  }

  moveRight() {
    if (this.status !== Game.Status.playing) {
      return;
    }

    this.saveState();

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
    // Check whether we can move
    if (this.status !== Game.Status.playing) {
      return;
    }

    this.saveState();

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

    this.saveState();

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

    this.saveState();

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

  saveState() {
    const currentState = this.state.map((row) => row.slice());

    this.undoStack.push(currentState);
  }

  undo() {
    if (this.undoStack.length > 0) {
      this.state = this.undoStack.pop(); // Restore previous state
      this.printTiles();

      return true;
    }

    return false;
  }

  createRandomTile() {
    let row = this.randomNumber(3);

    while (!this.state[row].includes(0)) {
      row = this.randomNumber(3);
    }

    let cell = this.randomNumber(3);

    while (this.state[row][cell] !== 0) {
      cell = this.randomNumber(3);
    }

    const newState = this.state.map((currentRow) => currentRow.slice());

    newState[row][cell] = this.generateCellValue();
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

