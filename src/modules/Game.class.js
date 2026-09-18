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

  static initState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  constructor(initialState = Game.initState) {
    // eslint-disable-next-line no-console
    this.initialState = structuredClone(initialState);
    this.score = 0;
    this.countSteps = 0;
  }

  moveLeft() {
    this.initialState = this.initialState.map((row) => {
      // Remove all zeros from the row
      // Use merge method with row arguement without zeros
      const rowFiltered = row.filter((cell) => cell !== 0);
      const mergedCells = this.mergeCells(rowFiltered);

      // Adding zeros back to an array untill we have the original length

      // do {
      //   mergedCells.push(0);
      // } while (mergedCells.length < 4);
      while (mergedCells.length < 4) {
        mergedCells.push(0);
      }

      return mergedCells;
    });
  }

  moveRight() {
    // Copy, reverse and save every row from the original array of arrays
    // Remove all zeros from the row
    // Use merge method with row arguement without zeros
    // Use reverse again
    this.initialState = this.initialState.map((row) => {
      const rowReversed = [...row].reverse();
      const rowFiltered = rowReversed.filter((cell) => cell !== 0);
      const mergedCells = this.mergeCells(rowFiltered);

      while (mergedCells.length < 4) {
        mergedCells.push(0);
      }

      return mergedCells.reverse();
    });
  }

  moveUp() {
    // Create 4 arrays as 4 columns, save them in the columns var
    // Use forEach method for initialState arrays, itarating every cell
    // Push every cell from a certain row to columns var to have 4 full columns
    const columns = [[], [], [], []];

    this.initialState.forEach((row) => {
      row.forEach((cell, indexCell) => {
        columns[indexCell].push(cell);
      });
    });

    // For columns we itarate every cell and remove all zeros
    // Merge same 2 cells
    // Save the result in the variable processedColumns
    const processedColumns = columns.map((column) => {
      const columnFiltered = column.filter((cell) => cell !== 0);
      const mergedCells = this.mergeCells(columnFiltered);

      // add zeros untill having the original array`s length
      while (mergedCells.length < 4) {
        mergedCells.push(0);
      }

      return mergedCells;
    });

    // shift columns back into rows to change the original initialState
    const newRows = [[], [], [], []];

    processedColumns.forEach((column) => {
      column.forEach((cell, index) => {
        newRows[index].push(cell);
      });
    });

    //  change the original initialState
    this.initialState = newRows;
  }

  moveDown() {
    // same proceduse as in moveUp() method, but with reverse()
    const columns = [[], [], [], []];

    this.initialState.forEach((row) => {
      row.forEach((cell, indexCell) => {
        columns[indexCell].push(cell);
      });
    });

    const processedColumns = columns.map((row) => {
      const rowReversed = [...row].reverse();
      const rowFiltered = rowReversed.filter((cell) => cell !== 0);
      const mergedCells = this.mergeCells(rowFiltered);

      while (mergedCells.length < 4) {
        mergedCells.push(0);
      }

      return mergedCells.reverse();
    });

    const newRows = [[], [], [], []];

    processedColumns.forEach((column) => {
      column.forEach((cell, index) => {
        newRows[index].push(cell);
      });
    });

    this.initialState = newRows;
  }

  stepsIncrement() {
    this.countSteps++;
  }

  getCountSteps() {
    return this.countSteps;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  canMerge() {
    const board = this.initialState;

    // first check if there are same numbers IN ONE LINE
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === board[i][j + 1]) {
          return true;
        }
      }
    }

    // second check if there are same numbers IN ONE COLUMN
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === board[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    // making copy of initialState and return it as currentStte
    const currentState = this.initialState.map((row) => [...row]);

    return currentState;
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
    const currentState = JSON.stringify(this.initialState);
    const intState = JSON.stringify(Game.initState);
    const hasWon = this.initialState.some((row) => row.includes(2048));
    const boardHasEmptyCells = this.initialState.some((row) => row.includes(0));

    if (currentState === intState) {
      return 'idle';
    }

    if (hasWon) {
      return 'win';
    }

    if (!boardHasEmptyCells && !this.canMerge()) {
      return 'lose';
    }

    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    // refresh initialState
    this.score = 0;
    this.countSteps = 0;
    this.initialState = structuredClone(Game.initState);

    const [rowIndex1, cellIndex1] = this.getIndex();

    let rowIndex2;
    let cellIndex2;

    // getting second random index
    // get the second index untill its different from the first one
    do {
      [rowIndex2, cellIndex2] = this.getIndex();
    } while (rowIndex1 === rowIndex2 && cellIndex1 === cellIndex2);

    // set 2 by default
    this.initialState[rowIndex1][cellIndex1] = 2;
    this.initialState[rowIndex2][cellIndex2] = 2;

    return [
      [rowIndex1, cellIndex1],
      [rowIndex2, cellIndex2],
    ];
  }

  /**
   * Resets the game.
   */
  restart() {
    return this.start();
  }

  getIndex() {
    // Getting 2 random indexes of row and cell to be appeared
    const randomRowIndex = Math.floor(Math.random() * this.initialState.length);
    const randomCellIndex = Math.floor(
      Math.random() * this.initialState[randomRowIndex].length,
    );

    return [randomRowIndex, randomCellIndex];
  }

  mergeCells(row) {
    // Merging 2 same cells while moving them to each other
    const result = [];

    for (let i = 0; i < row.length; i++) {
      if (row[i] === row[i + 1]) {
        this.score += row[i] * 2;
        result.push(row[i] * 2);
        i += 1;
      } else {
        result.push(row[i]);
      }
    }

    return result;
  }

  getTwoOrFour() {
    // random 2 or 4 cell
    const value = Math.random() > 0.9 ? 4 : 2;

    return value;
  }

  createNewCell() {
    // 1. get random (2 or 4) number 90%-10%
    // 2. check all the empty cells
    // 3. push indexes of all empty cells in the new array;
    const allEmptyCells = [];
    const randomValue = this.getTwoOrFour();

    this.initialState.forEach((currentRow, indexRow) => {
      currentRow.forEach((currentCell, indexCell) => {
        if (currentCell === 0) {
          allEmptyCells.push([indexRow, indexCell]);
        }
      });
    });

    // 1. check if there are some free cells
    if (allEmptyCells.length === 0) {
      return [];
    }

    // 1. find random element from the array of indexes
    const randomIndex = Math.floor(Math.random() * allEmptyCells.length);
    const randomCellIndexes = allEmptyCells[randomIndex];

    // destructurizing
    const [row, cell] = randomCellIndexes;

    // 1. find appropriate element from initialState
    // 2. change it with 2/4 (depends on random)
    this.initialState[row][cell] = randomValue;

    return [[row, cell]];
  }
}

module.exports = Game;
