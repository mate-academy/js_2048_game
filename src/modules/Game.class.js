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
    this.defaultState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.currentState = structuredClone(this.defaultState);

    if (this.isValidInitialState(initialState)) {
      this.defaultState = initialState;
      this.currentState = initialState;
    }

    this.gameStatus = 'idle';
    this.score = 0;
  }

  isValidInitialState(value) {
    // Check if main variable is a 4-item array
    if (!Array.isArray(value) || value.length !== 4) {
      return false;
    }

    return value.every((row) => {
      // Check if each row is a 4-item array
      if (!Array.isArray(row) || row.length !== 4) {
        return false;
      }

      // Check if every cell in the row meets the criteria
      return row.every(
        (cell) =>
          cell === 0 ||
          (typeof cell === 'number' &&
            cell >= 2 &&
            cell <= 2048 &&
            Number.isInteger(Math.log2(cell))),
      );
    });
  }

  checkForLose() {
    // Implementation for checking lose condition
    const state = this.getState();

    // Check if there same number in neighboring cells
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const currentCell = state[row][col];

        // Check right neighbor
        if (col < 3 && state[row][col + 1] === currentCell) {
          return;
        }

        // check left neighbor
        if (col > 0 && state[row][col - 1] === currentCell) {
          return;
        }

        // check top neighbor
        if (row > 0 && state[row - 1][col] === currentCell) {
          return;
        }

        // check bottom neighbor
        if (row < 3 && state[row + 1][col] === currentCell) {
          return;
        }
      }
    }
    this.gameStatus = 'lose';
  }

  moveLeft() {
    const state = this.getState();

    state.forEach((row, rowIndex) => {
      if (row[0] === 0 && row[1] === 0 && row[2] === 0 && row[3] === 0) {
        return; // Skip empty rows
      }

      const newRow = row.filter((cell) => cell !== 0);

      newRow.forEach((cell, colIndex) => {
        if (cell === newRow[colIndex + 1] && cell !== 0) {
          newRow[colIndex] *= 2;
          newRow[colIndex + 1] = 0;
          this.addScore(newRow[colIndex]);

          if (newRow[colIndex] === 2048) {
            this.gameStatus = 'win';
          }
        } // Merge cells with the same value
      });

      // Shift non-zero cells to the left
      while (newRow.length < 4) {
        newRow.push(0);
      }
      state[rowIndex] = newRow;
    });
  }

  moveRight() {
    const state = this.getState();

    state.forEach((row, rowIndex) => {
      if (row[0] === 0 && row[1] === 0 && row[2] === 0 && row[3] === 0) {
        return; // Skip empty rows
      }

      let newRow = row.filter((cell) => cell !== 0).reverse();

      newRow.forEach((cell, colIndex) => {
        if (cell === newRow[colIndex + 1] && cell !== 0) {
          newRow[colIndex] *= 2;
          newRow[colIndex + 1] = 0;
          this.addScore(newRow[colIndex]);

          if (newRow[colIndex] === 2048) {
            this.gameStatus = 'win';
          }
        } // Merge cells with the same value
      });

      newRow = newRow.filter((cell) => cell !== 0).reverse();

      // Shift non-zero cells to the left
      while (newRow.length < 4) {
        newRow.unshift(0);
      }
      state[rowIndex] = newRow;
    });
  }

  moveUp() {
    const state = this.getState();

    for (let colIndex = 0; colIndex < 4; colIndex++) {
      const column = state
        .map((row) => row[colIndex])
        .filter((cell) => cell !== 0);

      let newColumn = column;

      newColumn.forEach((cell, cellIndex) => {
        if (cell === newColumn[cellIndex + 1] && cell !== 0) {
          newColumn[cellIndex] *= 2;
          newColumn[cellIndex + 1] = 0;
          this.addScore(newColumn[cellIndex]);

          if (newColumn[cellIndex] === 2048) {
            this.gameStatus = 'win';
          }
        } // Merge cells with the same value
      });

      newColumn = newColumn.filter((cell) => cell !== 0);

      // Shift non-zero cells to the left
      while (newColumn.length < 4) {
        newColumn.push(0);
      }

      // Update the column in the state
      state.forEach((row, rowIndex) => {
        row[colIndex] = newColumn[rowIndex];
      });
    }
  }

  moveDown() {
    const state = this.getState();

    for (let colIndex = 0; colIndex < 4; colIndex++) {
      const column = state
        .map((row) => row[colIndex])
        .filter((cell) => cell !== 0)
        .reverse();

      let newColumn = column;

      newColumn.forEach((cell, cellIndex) => {
        if (cell === newColumn[cellIndex + 1] && cell !== 0) {
          newColumn[cellIndex] *= 2;
          newColumn[cellIndex + 1] = 0;
          this.addScore(newColumn[cellIndex]);

          if (newColumn[cellIndex] === 2048) {
            this.gameStatus = 'win';
          }
        } // Merge cells with the same value
      });

      newColumn = newColumn.filter((cell) => cell !== 0).reverse();

      // Shift non-zero cells to the left
      while (newColumn.length < 4) {
        newColumn.unshift(0);
      }

      // Update the column in the state
      state.forEach((row, rowIndex) => {
        row[colIndex] = newColumn[rowIndex];
      });
    }
  }

  addRandomTile() {
    const emptyPlaces = [];

    // check for empty places in the current state
    this.getState().forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyPlaces.push({ rowIndex, colIndex });
        }
      });
    });

    if (emptyPlaces.length !== 0) {
      for (let i = 0; i < 2; i++) {
        const randomIndex = Math.floor(Math.random() * emptyPlaces.length);
        const { rowIndex, colIndex } = emptyPlaces[randomIndex];

        this.currentState[rowIndex][colIndex] = Math.random() < 0.9 ? 2 : 4;
      }
    } else {
      this.checkForLose();
    }
  }

  addScore(value) {
    this.score += value;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  resetScore() {
    this.score = 0;
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
    return this.gameStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    this.currentState = structuredClone(this.defaultState);
    this.gameStatus = 'playing';
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here
}

export default Game;
