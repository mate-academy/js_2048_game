'use strict';

const BOARD_SIZE = 4;

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
  constructor(initialState = []) {
    if (initialState.length === 0) {
      const emptyRow = Array(BOARD_SIZE).fill(0);

      this.field = Array.from({ length: BOARD_SIZE }, () => [...emptyRow]);
    } else {
      this.field = structuredClone(initialState);
    }
    this.previousState = null;

    this.startField = structuredClone(this.field);

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    const newField = this.field.map((row) => {
      return this.processRow(row);
    });

    this.updateField(newField);
  }

  moveRight() {
    const newField = this.field.map((row) => {
      const reversedRow = [...row].reverse();
      const processedRow = this.processRow(reversedRow);

      return processedRow.reverse();
    });

    this.updateField(newField);
  }

  moveUp() {
    const transposedField = this.transposeField(this.field);
    const newTransposedField = transposedField.map((row) => {
      return this.processRow(row);
    });

    this.updateField(this.transposeField(newTransposedField));
  }

  moveDown() {
    const transposedField = this.transposeField(this.field);
    const newTransposedField = transposedField.map((row) => {
      const reversedRow = [...row].reverse();
      const processedRow = this.processRow(reversedRow);

      return processedRow.reverse();
    });

    this.updateField(this.transposeField(newTransposedField));
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
    return this.field;
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
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.score = 0;

    // Add two random tiles to start the game
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.field = structuredClone(this.startField);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here

  addRandomTile() {
    const emptyCells = [];

    this.field.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    const newValue = Math.random() < 0.9 ? 2 : 4;

    this.field[randomCell.row][randomCell.col] = newValue;
  }

  processRow(row) {
    let newRow = row.filter((cell) => cell !== 0);

    // [2,0,2,4] => [2,2,4]
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
      }
    }

    newRow = newRow.filter((cell) => cell !== 0);

    while (newRow.length < BOARD_SIZE) {
      newRow.push(0);
    }

    return newRow;
  }

  transposeField(field) {
    const result = [];

    for (let col = 0; col < BOARD_SIZE; col++) {
      const column = [];

      field.forEach((row) => {
        column.push(row[col]);
      });

      result.push(column);
    }

    return result;
  }

  checkCellsUpdated(updatedField, previousField = this.field) {
    // Check if any cells have been updated
    return updatedField.some((row, rowIndex) => {
      return row.some((cell, colIndex) => {
        return cell !== previousField[rowIndex][colIndex];
      });
    });
  }

  updateField(newField) {
    if (this.checkCellsUpdated(newField)) {
      if (this.status !== 'playing') {
        return;
      }

      this.previousState = {
        field: structuredClone(this.field),
        score: this.score,
      };

      this.field = newField;

      this.checkWin();

      if (this.status !== 'win') {
        this.addRandomTile();
        this.checkLose();
      }
    }
  }

  checkWin() {
    if (this.field.some((row) => row.some((cell) => cell === 2048))) {
      this.status = 'win';
    }
  }

  checkLose() {
    const result = this.field.some((row, rowIndex) => {
      return row.some((cell, colIndex) => {
        const canCheckRight = colIndex < row.length - 1;
        const canCheckDown = rowIndex < this.field.length - 1;

        return (
          (canCheckRight && cell === row[colIndex + 1]) ||
          (canCheckDown && cell === this.field[rowIndex + 1][colIndex])
        );
      });
    });

    if (!result && this.field.every((row) => row.every((cell) => cell !== 0))) {
      this.status = 'lose';
    }
  }

  undo() {
    if (this.previousState && this.status === 'playing') {
      this.field = structuredClone(this.previousState.field);
      this.score = this.previousState.score;
      this.previousState = null;
    }
  }

  canUndo() {
    return this.previousState !== null && this.status === 'playing';
  }
}

module.exports = Game;
