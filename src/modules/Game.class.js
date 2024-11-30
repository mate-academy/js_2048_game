'use strict';

import getRandomFreeCell from './utils/getRandomFreeCell';
import shiftRow from './utils/shiftRow';
import transposeState from './utils/transposeState';

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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.state = initialState.map((row) => row.slice());
    this.status = 'idle';
    this.score = 0;
  }

  /**
   * Moves tiles in provided direction
   *
   * @param {string} callback
   * Name of corresponding method with an axis
   * @param {boolean} direction
   * Reflects the positive or negative direction of the axis
   */
  move(callback, direction) {
    if (this.getStatus() === 'playing') {
      if (this[callback](direction)) {
        this.setCell(getRandomFreeCell(this.getFreeCells()));
      }
    }
  }

  moveLeft() {
    this.move('collapseRow', true);
  }

  moveRight() {
    this.move('collapseRow', false);
  }

  moveUp() {
    this.move('collapseColumn', true);
  }

  moveDown() {
    this.move('collapseColumn', false);
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
   * Returns array of free cells coords.
   *
   * @returns {number[][]} [[rowIndex, colIndex]...]
   */
  getFreeCells() {
    const field = this.getState();
    const freeCells = [];

    for (const row of field) {
      row.forEach((cell, index) => {
        if (cell === 0) {
          freeCells.push([field.indexOf(row), index]);
        }
      });
    }

    return freeCells;
  }

  /**
   * Fills free cell with "2" or "4" value.
   *
   * @param {number[]} cellCoords
   * Coords of free cell
   */
  setCell(cellCoords) {
    if (!cellCoords) {
      return;
    }

    const [rowIndex, columnIndex] = cellCoords;

    let cellValue;

    if (Math.random() < 0.9) {
      cellValue = 2;
    } else {
      cellValue = 4;
    }

    this.state[rowIndex][columnIndex] = cellValue;
  }

  /**
   * @param {HTMLTableSectionElement} field
   * Table tbody object
   */
  updateField(field) {
    const currentState = this.getState();

    for (const row of field.children) {
      const rowIndex = [...field.children].indexOf(row);

      for (const cell of row.cells) {
        const columnIndex = [...row.cells].indexOf(cell);
        const cellValue = currentState[rowIndex][columnIndex];

        cell.textContent = cellValue || '';
        cell.classList = `field-cell field-cell--${cellValue || ''}`;
      }
    }
  }

  collapse(array, collapseLeft) {
    const result = [];
    let score = 0;

    if (collapseLeft) {
      for (let i = 0; i < array.length; i++) {
        if (array[i] === array[i + 1]) {
          result.push(array[i] * 2);
          score += array[i] * 2;
          i++;
        } else {
          result.push(array[i]);
        }
      }
    } else {
      for (let i = array.length - 1; i >= 0; i--) {
        if (array[i] === array[i - 1]) {
          result.unshift(array[i] * 2);
          score += array[i] * 2;
          i--;
        } else {
          result.unshift(array[i]);
        }
      }
    }

    while (result.length < array.length) {
      if (collapseLeft) {
        result.push(0);
      } else {
        result.unshift(0);
      }
    }

    this.score += score;

    return result;
  }

  /**
   * @returns {boolean}
   */
  collapseRow(collapseLeft = true) {
    const state = this.getState();
    const newState = [];

    for (const row of state) {
      const shiftedRow = shiftRow(row, collapseLeft);
      const collapsedRow = this.collapse(shiftedRow, collapseLeft);

      newState.push(collapsedRow);
    }

    if (JSON.stringify(state) === JSON.stringify(newState)) {
      return false;
    }

    this.state = newState;

    return true;
  }

  /**
   * @returns {boolean}
   */
  collapseColumn(collapseUp = true) {
    const state = transposeState(this.getState());
    const newState = [];

    for (const row of state) {
      const shiftedRow = shiftRow(row, collapseUp);
      const collapsedRow = this.collapse(shiftedRow, collapseUp);

      newState.push(collapsedRow);
    }

    if (JSON.stringify(state) === JSON.stringify(newState)) {
      return false;
    }

    this.state = transposeState(newState);

    return true;
  }

  /**
   * @returns {boolean}
   */
  isMovesPossible() {
    const stateRows = this.getState();
    const stateColumns = transposeState(this.getState());
    const freeCells = this.getFreeCells().length;

    if (freeCells) {
      return true;
    }

    for (let i = 0; i < stateRows.length; i++) {
      const row = stateRows[i];
      const column = stateColumns[i];

      const colsMovePossible = column.some((cell, number) => {
        return cell === column[number + 1];
      });

      const rowsMovePossible = row.some((cell, number) => {
        return cell === row[number + 1];
      });

      if (rowsMovePossible || colsMovePossible) {
        return true;
      }
    }

    return false;
  }

  /**
   * @returns {boolean}
   */
  isWinning() {
    const state = this.getState();

    return state.some((row) => {
      return row.some((cell) => cell === 2048);
    });
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = 'playing';
    this.setCell(getRandomFreeCell(this.getFreeCells()));
    this.setCell(getRandomFreeCell(this.getFreeCells()));
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.score = 0;

    this.state = this.initialState.map((row) => row.slice());
  }
}

module.exports = Game;
