'use strict';

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
    this.state = initialState;
    this.status = 'idle';
    this.score = 0;

    if (this.state === undefined) {
      this.state = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.size = this.state.length;
  }

  moveLeft() {
    let isMoved = false;
    let isAdded = false;

    for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
      const row = this.state[rowIndex];

      for (let cellIndex = 1; cellIndex < this.size; cellIndex++) {
        const cell = row[cellIndex];

        if (cell > 0) {
          let cellPosition = cellIndex;

          // checking for available cell by
          // traversal in opposite direction of current move
          // and finding the most far empty cell to move
          for (let availCell = 0; availCell < this.size; availCell++) {
            // check if available cell is empty
            // and it's placed before cell which has to be moved
            if (row[availCell] === 0 && availCell < cellIndex) {
              // if so move cell to available cell
              // and mark that it moved
              row[availCell] = cell;
              row[cellIndex] = 0;
              cellPosition = availCell;
              isMoved = true;
              break;
            }
          }

          // check for cell matches with previous cell
          // if the same - sum to the left
          // mark is added and change the score
          if (row[cellPosition] === row[cellPosition - 1]) {
            row[cellPosition - 1] += row[cellPosition];
            this.score += row[cellPosition - 1];
            row[cellPosition] = 0;
            isAdded = true;
          }
        }
      }
    }

    if (isMoved || isAdded) {
      this.setRandomCell();
      this.status = 'playing';
    }
    this.checkForWinn();
    this.checkForLose();
  }

  moveRight() {
    let isMoved = false;
    let isAdded = false;

    for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
      const row = this.state[rowIndex];

      for (let cellIndex = 2; cellIndex >= 0; cellIndex--) {
        const cell = row[cellIndex];

        if (cell > 0) {
          let cellPosition = cellIndex;

          // checking for available cell by
          // traversal in opposite direction of current move
          // and finding the most far empty cell to move
          for (let availCell = this.size - 1; availCell > 0; availCell--) {
            // check if available cell is empty
            // and it's placed before cell which has to be moved
            if (row[availCell] === 0 && availCell > cellIndex) {
              // if so move cell to available cell
              // and mark that it moved
              row[availCell] = cell;
              row[cellIndex] = 0;
              cellPosition = availCell;
              isMoved = true;
              break;
            }
          }

          // check for cell matches with next cell
          // if the same - sum to the right
          // mark is added and change the score
          if (row[cellPosition] === row[cellPosition + 1]) {
            row[cellPosition + 1] += row[cellPosition];
            row[cellPosition] = 0;
            this.score += row[cellPosition + 1];
            isAdded = true;
          }
        }
      }
    }

    if (isMoved || isAdded) {
      this.setRandomCell();
      this.status = 'playing';
    }
    this.checkForWinn();
    this.checkForLose();
  }

  moveUp() {
    let isMoved = false;
    let isAdded = false;

    for (let columnIndex = 0; columnIndex < this.size; columnIndex++) {
      for (let rowIndex = 1; rowIndex < this.size; rowIndex++) {
        const cell = this.state[rowIndex][columnIndex];

        if (cell > 0) {
          let cellPosition = rowIndex;

          // checking for available cell by
          // traversal in opposite direction of current move
          // and finding the most far empty cell to move
          for (let availCell = 0; availCell < this.size; availCell++) {
            const availPlace = this.state[availCell][columnIndex];

            // check if available cell is empty
            // and it's placed before cell which has to be move
            if (availPlace === 0 && availCell < rowIndex) {
              // if so move cell to available cell
              // and mark that it moved
              this.state[availCell][columnIndex] = cell;
              this.state[rowIndex][columnIndex] = 0;
              cellPosition = availCell;
              isMoved = true;
              break;
            }
          }

          const current = this.state[cellPosition][columnIndex];
          const next = this.state[cellPosition - 1];

          // check for cell matches with the cell abowe
          // if the same - sum to the up,
          // mark is added and change the score
          if (next !== undefined && current === next[columnIndex]) {
            next[columnIndex] += current;
            this.state[cellPosition][columnIndex] = 0;
            this.score += next[columnIndex];
            isAdded = true;
          }
        }
      }
    }

    if (isMoved || isAdded) {
      this.setRandomCell();
      this.status = 'playing';
    }
    this.checkForWinn();
    this.checkForLose();
  }

  moveDown() {
    let isMoved = false;
    let isAdded = false;

    for (let columnIndex = 0; columnIndex < this.size; columnIndex++) {
      for (let rowIndex = 2; rowIndex >= 0; rowIndex--) {
        const cell = this.state[rowIndex][columnIndex];

        if (cell > 0) {
          let cellPosition = rowIndex;

          // checking for available cell by
          // traversal in opposite direction of current move
          // and finding the most far empty cell to move
          for (let availCell = this.size - 1; availCell > 0; availCell--) {
            const availPlace = this.state[availCell][columnIndex];

            // check if available cell is empty
            // and it's placed before cell which has to be move
            if (availPlace === 0 && availCell > rowIndex) {
              // if so move cell to available cell
              // and mark that it moved
              this.state[availCell][columnIndex] = cell;
              this.state[rowIndex][columnIndex] = 0;
              cellPosition = availCell;
              isMoved = true;
              break;
            }
          }

          const current = this.state[cellPosition][columnIndex];
          const next = this.state[cellPosition + 1];

          // check for cell matches with the next cell under
          // if the same - sum to the down,
          // mark is added and change the score
          if (next !== undefined && current === next[columnIndex]) {
            next[columnIndex] += current;
            this.state[cellPosition][columnIndex] = 0;
            this.score += next[columnIndex];
            isAdded = true;
          }
        }
      }
    }

    if (isMoved || isAdded) {
      this.setRandomCell();
      this.status = 'playing';
    }
    this.checkForWinn();
    this.checkForLose();
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

  /**
   * Starts the game.
   */
  start() {
    this.setRandomCell();
    this.setRandomCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
  }

  setRandomCell() {
    // create rundom number that's greater than or equal to 0 and less than 1
    const randomNum = Math.random();

    const maped = [];

    // find all empty cells
    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          maped.push([rowIndex, cellIndex]);
        }
      });
    });

    if (maped.length > 0) {
      const randomCellIndx = Math.floor(Math.random() * maped.length);
      // assigning random values to the future row and cell index
      const [row, cell] = maped[randomCellIndx];

      if (randomNum <= 0.1) {
        // create 4 with 10% probability
        this.state[row][cell] = 4;
      } else {
        this.state[row][cell] = 2;
      }
    }
  }

  /**
   * Scan all the cells to find 2048.
   */
  checkForWinn() {
    for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
      const row = this.state[rowIndex];

      for (let cellIndex = 1; cellIndex < this.size; cellIndex++) {
        const cell = row[cellIndex];

        if (cell === 2048) {
          this.status = 'win';
        }
      }
    }
  }

  /**
   * Scan all the neighbours for each cell to check for available move.
   */
  checkForLose() {
    for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
      const row = this.state[rowIndex];

      for (let cellIndex = 0; cellIndex < this.size; cellIndex++) {
        const cell = row[cellIndex];

        if (cell === 0) {
          return;
        }

        if (cell === row[cellIndex + 1]) {
          return;
        }

        if (cell === row[cellIndex - 1]) {
          return;
        }

        const nextRow = this.state[rowIndex + 1];

        if (nextRow !== undefined && cell === nextRow[cellIndex]) {
          return;
        }

        const prevRow = this.state[rowIndex - 1];

        if (prevRow !== undefined && cell === prevRow[cellIndex]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

export default Game;
