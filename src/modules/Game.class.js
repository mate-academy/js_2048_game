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
   *
   * @default
   */
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = this.board.map((row) => [...row]);

    this.status = 'idle';
    this.score = 0;

    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const boardBefore = this.board.map((row) => [...row]);

    for (let columnIndex = 0; columnIndex < this.board.length; columnIndex++) {
      const nonZero = this.board[columnIndex].filter((number) => number !== 0);
      const merged = [];

      for (let rowIndex = 0; rowIndex < nonZero.length; rowIndex++) {
        if (rowIndex === nonZero.length - 1) {
          merged.push(nonZero[rowIndex]);
        } else {
          if (nonZero[rowIndex] === nonZero[rowIndex + 1]) {
            merged.push(nonZero[rowIndex] + nonZero[rowIndex + 1]);
            this.score += nonZero[rowIndex] + nonZero[rowIndex + 1];
            rowIndex++;
          } else {
            merged.push(nonZero[rowIndex]);
          }
        }
      }

      const newColumn = [
        ...merged,
        ...Array(this.board[columnIndex].length - merged.length).fill(0),
      ];

      this.board[columnIndex] = newColumn;
    }

    const boardChanged = this.board.some((row, rowIndex) => {
      return row.some((cell, cellIndex) => {
        return cell !== boardBefore[rowIndex][cellIndex];
      });
    });

    if (boardChanged) {
      this.fillCellByNumber();
    }
  }

  moveRight() {
    for (let columnIndex = 0; columnIndex < this.board.length; columnIndex++) {
      this.board[columnIndex].reverse();
    }
    this.moveLeft();

    for (let columnIndex = 0; columnIndex < this.board.length; columnIndex++) {
      this.board[columnIndex].reverse();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const boardBefore = this.board.map((row) => [...row]);

    for (let columnIndex = 0; columnIndex < this.board.length; columnIndex++) {
      const column = [];

      for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
        column.push(this.board[rowIndex][columnIndex]);
      }

      const nonZero = column.filter((number) => number !== 0);
      const merged = [];

      for (let i = 0; i < nonZero.length; i++) {
        if (i === nonZero.length - 1) {
          merged.push(nonZero[i]);
        } else {
          if (nonZero[i] === nonZero[i + 1]) {
            merged.push(nonZero[i] + nonZero[i + 1]);
            this.score += nonZero[i] + nonZero[i + 1];
            i++;
          } else {
            merged.push(nonZero[i]);
          }
        }
      }

      const newColumn = [
        ...merged,
        ...Array(this.board.length - merged.length).fill(0),
      ];

      for (let i = 0; i < newColumn.length; i++) {
        this.board[i][columnIndex] = newColumn[i];
      }
    }

    const boardChanged = this.board.some((row, rowIndex) => {
      return row.some((cell, cellIndex) => {
        return cell !== boardBefore[rowIndex][cellIndex];
      });
    });

    if (boardChanged) {
      this.fillCellByNumber();
    }
  }

  moveDown() {
    this.board.reverse();
    this.moveUp();
    this.board.reverse();
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    if (
      this.board.some((row) => {
        return row.some((cell) => {
          return cell === 2048;
        });
      })
    ) {
      this.status = 'win';

      return this.status;
    }

    if (this.status === 'idle') {
      return this.status;
    }

    if (
      this.board.some((row) => {
        return row.some((cell) => {
          return cell === 0;
        });
      })
    ) {
      this.status = 'playing';

      return this.status;
    }

    if (
      this.board.some((row, rowIndex) => {
        return row.some((cell, cellIndex) => {
          if (cellIndex === row.length - 1) {
            return false;
          }

          return row[cellIndex] === row[cellIndex + 1];
        });
      })
    ) {
      this.status = 'playing';

      return this.status;
    }

    for (let rowIndex = 0; rowIndex < this.board.length - 1; rowIndex++) {
      for (
        let columnIndex = 0;
        columnIndex < this.board.length;
        columnIndex++
      ) {
        if (
          this.board[rowIndex][columnIndex] ===
            this.board[rowIndex + 1][columnIndex] &&
          this.board[rowIndex][columnIndex] !== 0
        ) {
          this.status = 'playing';

          return this.status;
        }
      }
    }

    this.status = 'lose';

    return this.status;
  }

  start() {
    this.status = 'playing';
    this.fillCellByNumber();
    this.fillCellByNumber();
  }

  restart() {
    this.status = 'idle';
    this.score = 0;
    this.board = this.initialState.map((row) => [...row]);
  }

  getEmptyCell() {
    const emptyCells = [];

    for (let columnIndex = 0; columnIndex < this.board.length; columnIndex++) {
      for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
        if (this.board[columnIndex][rowIndex] === 0) {
          emptyCells.push([columnIndex, rowIndex]);
        }
      }
    }

    const randomCellIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomCellIndex];
  }

  fillCellByNumber() {
    const cell = this.getEmptyCell();

    if (!cell) {
      return;
    }

    const randomNumber = Math.random();

    if (randomNumber < 0.1) {
      this.board[cell[0]][cell[1]] = 4;
    } else {
      this.board[cell[0]][cell[1]] = 2;
    }
  }
}

module.exports = Game;
