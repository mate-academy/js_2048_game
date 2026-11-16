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
    this.field = [];
    this.fieldCopy = [];
    this.score = 0;
    this.status = 'idle';

    if (initialState === undefined) {
      for (let row = 0; row < 4; row++) {
        const addRow = [];

        for (let cell = 0; cell < 4; cell++) {
          addRow.push(0);
        }

        this.field.push(addRow);
      }
    } else {
      this.field = initialState.map((row) => [...row]);
    }

    this.fieldCopy = this.field.map((row) => [...row]);
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const fieldBeforeMove = this.field.map((row) => [...row]);

    this.field.forEach((row, rowIndex) => {
      const newRow = [];

      row.forEach((cell) => {
        if (cell > 0) {
          newRow.push(cell);
        }
      });

      const mergedRow = [];
      let i = 0;

      while (i < newRow.length) {
        if (newRow[i] === newRow[i + 1]) {
          mergedRow.push(newRow[i] * 2);
          this.score += newRow[i] * 2;
          i += 2;
        } else {
          mergedRow.push(newRow[i]);
          i++;
        }
      }

      while (mergedRow.length < 4) {
        mergedRow.push(0);
      }

      this.field[rowIndex] = mergedRow;
    });

    if (this.isFieldChanged(fieldBeforeMove)) {
      this.fillRandomSlot();
    }

    this.winOrLoseAfterMove();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const fieldBeforeMove = this.field.map((row) => [...row]);

    this.field.forEach((row, rowIndex) => {
      const newRow = [];

      row.forEach((cell) => {
        if (cell > 0) {
          newRow.push(cell);
        }
      });

      const mergedRow = [];
      let i = newRow.length - 1;

      while (i >= 0) {
        if (newRow[i] === newRow[i - 1]) {
          mergedRow.unshift(newRow[i] * 2);
          this.score += newRow[i] * 2;
          i -= 2;
        } else {
          mergedRow.unshift(newRow[i]);
          i--;
        }
      }

      while (mergedRow.length < 4) {
        mergedRow.unshift(0);
      }

      this.field[rowIndex] = mergedRow;
    });

    if (this.isFieldChanged(fieldBeforeMove)) {
      this.fillRandomSlot();
    }

    this.winOrLoseAfterMove();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const fieldBeforeMove = this.field.map((row) => [...row]);

    for (let cell = 0; cell < 4; cell++) {
      const newColumn = [];

      this.field.forEach((row) => {
        if (row[cell] > 0) {
          newColumn.push(row[cell]);
        }
      });

      const mergedRow = [];
      let i = 0;

      while (i < newColumn.length) {
        if (newColumn[i] === newColumn[i + 1]) {
          mergedRow.push(newColumn[i] * 2);
          this.score += newColumn[i] * 2;
          i += 2;
        } else {
          mergedRow.push(newColumn[i]);
          i++;
        }
      }

      while (mergedRow.length < 4) {
        mergedRow.push(0);
      }

      this.field.forEach((row, rowIndex) => {
        row[cell] = mergedRow[rowIndex];
      });
    }

    if (this.isFieldChanged(fieldBeforeMove)) {
      this.fillRandomSlot();
    }

    this.winOrLoseAfterMove();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const fieldBeforeMove = this.field.map((row) => [...row]);

    for (let cell = 0; cell < 4; cell++) {
      const newColumn = [];

      this.field.forEach((row) => {
        if (row[cell] > 0) {
          newColumn.push(row[cell]);
        }
      });

      const mergedRow = [];
      let i = newColumn.length - 1;

      while (i >= 0) {
        if (newColumn[i] === newColumn[i - 1]) {
          mergedRow.unshift(newColumn[i] * 2);
          this.score += newColumn[i] * 2;
          i -= 2;
        } else {
          mergedRow.unshift(newColumn[i]);
          i--;
        }
      }

      while (mergedRow.length < 4) {
        mergedRow.unshift(0);
      }

      this.field.forEach((row, rowIndex) => {
        row[cell] = mergedRow[rowIndex];
      });
    }

    if (this.isFieldChanged(fieldBeforeMove)) {
      this.fillRandomSlot();
    }

    this.winOrLoseAfterMove();
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
    return this.field.map((row) => [...row]);
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
    try {
      this.fillRandomSlot(2);
      this.status = 'playing';
    } catch (error) {
      if (
        !(error instanceof Error) ||
        error.message !== 'No enough empty slots'
      ) {
        throw error;
      }
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.field = this.fieldCopy.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  fillRandomSlot(addSlots = 1) {
    const emptyCells = [];

    this.field.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          emptyCells.push([rowIndex, cellIndex]);
        }
      });
    });

    if (emptyCells.length < addSlots) {
      throw new Error('No enough empty slots');
    }

    for (let i = 0; i < addSlots; i++) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, cell] = emptyCells.splice(randomIndex, 1)[0];
      const value = Math.random() < 0.1 ? 4 : 2;

      this.field[row][cell] = value;
    }
  }

  isFieldChanged(beforeMove) {
    return this.field.some((fieldRow, rowIndex) => {
      return fieldRow.some((fieldCell, cellIndex) => {
        return fieldCell !== beforeMove[rowIndex][cellIndex];
      });
    });
  }

  winOrLoseAfterMove() {
    if (
      this.field.some((row) => {
        return row.includes(2048);
      })
    ) {
      this.status = 'win';

      return;
    }

    const checkRowDoubles = this.field.some((row) => {
      return row.some((cell, cellIndex) => {
        return (
          cell !== 0 &&
          cellIndex < row.length - 1 &&
          cell === row[cellIndex + 1]
        );
      });
    });

    let checkColumnDoubles = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (
          this.field[j][i] === this.field[j + 1][i] &&
          this.field[j][i] !== 0
        ) {
          checkColumnDoubles = true;
          break;
        }
      }
    }

    if (
      !checkRowDoubles &&
      !checkColumnDoubles &&
      !this.field.some((row) => {
        return row.some((cell) => {
          return cell === 0;
        });
      })
    ) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }
  }
}

module.exports = Game;
