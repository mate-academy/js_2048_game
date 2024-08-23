/* eslint-disable function-paren-newline */
'use strict';

class Game {
  /**
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
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
    this.emptyfields = [];
    this.status = 'idle';
    this.score = 0;
    this.rows = document.querySelectorAll('.field-row');
    this.setEmptyfields();
  }

  isWin() {
    return this.initialState.some((row) => row.some((col) => col === 2048));
  }

  isGameOver() {
    if (this.emptyfields.length > 0) {
      return false;
    }

    for (let row = 0; row < this.initialState.length; row++) {
      for (let col = 0; col < this.initialState[row].length; col++) {
        const current = this.initialState[row][col];

        if (
          col < this.initialState[row].length - 1 &&
          current === this.initialState[row][col + 1]
        ) {
          return false;
        }

        if (
          row < this.initialState.length - 1 &&
          current === this.initialState[row + 1][col]
        ) {
          return false;
        }
      }
    }

    return true;
  }

  stateChanged(prevState) {
    return this.initialState.some((row, i) =>
      row.some((cell, j) => cell !== prevState[i][j]),
    );
  }

  moveLeft() {
    this.initialState.forEach((row, index) => {
      this.initialState[index] = this.merge(row);
    });
  }

  moveRight() {
    this.initialState.forEach((row, index) => {
      const lal = this.merge(row.reverse());

      this.initialState[index] = lal.reverse();
    });
  }
  moveUp() {
    this.initialState = this.transpose(this.initialState);

    this.initialState.forEach((row, index) => {
      const lal = this.merge(row);

      this.initialState[index] = lal;
    });

    this.initialState = this.transpose(this.initialState);
  }

  moveDown() {
    this.initialState = this.transpose(this.initialState);

    this.initialState.forEach((row, index) => {
      const lal = this.merge(row.reverse());

      this.initialState[index] = lal.reverse();
    });

    this.initialState = this.transpose(this.initialState);
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
  getState() {}

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
  getStatus() {}

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';

      this.createPlate();
      this.createPlate();
    }
  }

  setEmptyfields() {
    this.emptyfields = [];

    for (let row = 0; row < this.initialState.length; row++) {
      for (let col = 0; col < this.initialState[row].length; col++) {
        if (this.initialState[row][col] === 0) {
          this.emptyfields.push({ row, col });
        }
      }
    }
  }

  setRandomField() {
    if (this.emptyfields.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * this.emptyfields.length);
    const field = this.emptyfields[randomIndex];

    this.initialState[field.row][field.col] = Math.random() < 0.1 ? 4 : 2;

    this.emptyfields.splice(randomIndex, 1);

    return field;
  }

  createTeableArray() {
    const tableArray = this.initialState.map((row) =>
      row.map((cell) => ({
        content: cell,
        classes: cell > 0 ? [`field-cell--${cell}`] : [],
      })),
    );

    return tableArray;
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  merge(row) {
    const rowForMerge = row.filter((x) => x !== 0);

    for (let i = 0; i < rowForMerge.length - 1; i++) {
      if (rowForMerge[i] === rowForMerge[i + 1]) {
        rowForMerge[i] *= 2;
        rowForMerge[i + 1] = 0;
        this.score += rowForMerge[i];
        i++;
      }
    }

    const mergedRow = rowForMerge.filter((x) => x !== 0);

    return [...mergedRow, ...Array(4 - mergedRow.length).fill(0)];
  }

  createPlate() {
    const tableArray = this.createTeableArray();

    this.updateTable(tableArray);

    const newPlate = this.setRandomField();

    if (newPlate !== null) {
      tableArray[newPlate.row][newPlate.col].content =
        this.initialState[newPlate.row][newPlate.col];

      tableArray[newPlate.row][newPlate.col].classes.push(
        `field-cell--${tableArray[newPlate.row][newPlate.col].content}`,
      );

      this.updateTable(tableArray);
    }
  }

  updateTable(tableArray) {
    this.rows.forEach((row, rowIndex) => {
      Array.from(row.children).forEach((cell, colIndex) => {
        const cellData = tableArray[rowIndex][colIndex];

        if (cellData.content !== 0) {
          cell.textContent = cellData.content;
          cell.classList = ['field-cell'];
          cell.classList.add(cellData.classes);
        } else {
          cell.textContent = '';
          cell.classList = ['field-cell'];
        }
      });
    });

    this.setEmptyfields();
  }

  restart() {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.emptyfields = [];
    this.status = 'idle';
    this.score = 0;
    this.setEmptyfields();

    const tableArray = this.createTeableArray();

    this.updateTable(tableArray);
    this.score = 0;
  }
}

module.exports = Game;
