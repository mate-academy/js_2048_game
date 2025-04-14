import { getRandomNumber } from '../helpers/getRandomNumber.js';

export class Game {
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
    initialState = Array.from({ length: Game.GRID_SIZE }, () => {
      return Array(Game.GRID_SIZE).fill(0);
    }),
  ) {
    this.state = initialState;

    this.score = this.state.reduce((sum, row) => {
      let cellsSum = 0;

      for (const cell of row) {
        cellsSum += cell;
      }

      return sum + cellsSum;
    }, 0);
  }

  static GRID_SIZE = 4;
  static WIN_NUMBER = 2048;
  static STATUS_IDLE = 'idle';
  static STATUS_PLAYING = 'playing';
  static STATUS_WIN = 'win';
  static STATUS_LOSE = 'lose';
  static PUSH_METHOD = 'push';
  static UNSHIFT_METHOD = 'unshift';
  static MOVE_DIRECTIONS = {
    LEFT: 'left',
    RIGHT: 'right',
    UP: 'up',
    DOWN: 'down',
  };

  status = Game.STATUS_IDLE;

  moveCells(matrix, isReverseDirection = false) {
    let sum = 0;

    const result = matrix.map((row) => {
      const filteredRow = row.filter((cell) => cell !== 0);

      if (isReverseDirection) {
        filteredRow.reverse();
      }

      const [mergedCells, mergedSum] = this.mergeNumbers(filteredRow);

      sum += mergedSum;

      while (mergedCells.length < Game.GRID_SIZE) {
        mergedCells.push(0);
      }

      return isReverseDirection ? mergedCells.reverse() : mergedCells;
    });

    return [result, sum];
  }

  moveLeft() {
    const [newState, mergedSum] = this.moveCells(this.state);

    this.updateState(newState, this.score + mergedSum);
  }

  moveRight() {
    const [newState, mergedSum] = this.moveCells(this.state, true);

    this.updateState(newState, this.score + mergedSum);
  }

  moveUp() {
    const rotatedState = this.rotateMatrix(this.state);
    const [movedState, mergedSum] = this.moveCells(rotatedState);
    const newState = this.rotateMatrix(movedState);

    this.updateState(newState, this.score + mergedSum);
  }

  moveDown() {
    const rotatedState = this.rotateMatrix(this.state);
    const [movedState, mergedSum] = this.moveCells(rotatedState, true);
    const newState = this.rotateMatrix(movedState);

    this.updateState(newState, this.score + mergedSum);
  }

  isMoveAvailable() {
    return this.state.some((row, rowIndex) => {
      return row.some((cell, cellIndex) => {
        if (cell === 0) {
          return true;
        }

        if (
          cellIndex !== row.length - 1 &&
          cell === this.state[rowIndex][cellIndex + 1]
        ) {
          return true;
        }

        if (
          rowIndex !== this.state.length - 1 &&
          cell === this.state[rowIndex + 1][cellIndex]
        ) {
          return true;
        }

        return false;
      });
    });
  }

  updateState(newState, newScore) {
    if (this.hasStateChanged(newState) && this.status === Game.STATUS_PLAYING) {
      this.state = newState;
      this.score = newScore;
      this.addRandomCell();
    }

    if (
      this.state.some((row) => row.some((cell) => cell === Game.WIN_NUMBER))
    ) {
      this.status = Game.STATUS_WIN;

      return;
    }

    if (!this.isMoveAvailable()) {
      this.status = Game.STATUS_LOSE;
    }
  }

  rotateMatrix(matrix) {
    const rotatedMatrix = [];

    for (let cellIndex = 0; cellIndex < Game.GRID_SIZE; cellIndex++) {
      const column = [];

      for (let rowIndex = 0; rowIndex < Game.GRID_SIZE; rowIndex++) {
        column.push(matrix[rowIndex][cellIndex]);
      }

      rotatedMatrix.push(column);
    }

    return rotatedMatrix;
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

  start() {
    this.status = Game.STATUS_PLAYING;
    this.addRandomCell();
    this.addRandomCell();
  }

  restart() {
    this.state = Array.from({ length: Game.GRID_SIZE }, () => {
      return Array(Game.GRID_SIZE).fill(0);
    });

    this.status = Game.STATUS_PLAYING;
    this.score = 0;
    this.addRandomCell();
    this.addRandomCell();
  }

  addRandomCell() {
    const availableCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          availableCells.push({ indexRow: rowIndex, indexCell: cellIndex });
        }
      });
    });

    if (!availableCells.length) {
      return;
    }

    const randomIndex = getRandomNumber(0, availableCells.length - 1);
    const { indexRow, indexCell } = availableCells[randomIndex];
    const newCellValue = Math.random() < 0.1 ? 4 : 2;

    this.state[indexRow].splice(indexCell, 1, newCellValue);
  }

  mergeNumbers(array) {
    const result = [];
    let mergedSum = 0;

    for (let i = 0; i < array.length; i++) {
      const cell = array[i];
      const nextCell = array[i + 1];

      if (cell === nextCell) {
        result.push(cell + nextCell);
        mergedSum += cell + nextCell;
        i++;
      } else {
        result.push(cell);
      }
    }

    return [result, mergedSum];
  }

  hasStateChanged(newState) {
    const isChanged = this.state.some((row, rowIndex) => {
      return row.some((cell, cellIndex) => {
        return cell !== newState[rowIndex][cellIndex];
      });
    });

    return isChanged;
  }
}
