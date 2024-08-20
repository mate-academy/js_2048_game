/* eslint-disable prettier/prettier */
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
    this.startValue = 2;
    this.status = 'idle';
    this.score = 0;
    this.rows = document.querySelectorAll('.field-row');
    this.setEmptyfields();
  }

  setEmptyfields() {
    for (let row = 0; row < this.initialState.length; row++) {
      for (let col = 0; col < this.initialState[row].length; col++) {
        if (this.initialState[row][col] === 0) {
          this.emptyfields.push({ row, col });
        }
      }
    }
  }

  setRandomField( seconsVal = 0) {
    if (this.emptyfields.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * this.emptyfields.length);
    const field = this.emptyfields[randomIndex];

    this.initialState[field.row][field.col] = this.startValue += seconsVal;

    this.emptyfields.splice(randomIndex, 1);

    return field;
  }

  createTeableArray() {
    const tableArray = this.initialState.map((row) =>
      row.map((cell) => ({
        content: cell,
        classes: cell > 0 ? [`field-cell--${cell}`] : [],
      })));

    return tableArray;
  }

  moveLeft() {
    this.initialState.forEach((row, index) => {
      const lal = this.shiftLeft(row);

      this.initialState[index] = lal;
    });

    const tableArray = this.createTeableArray();

    this.updateTable(tableArray);


  }
  shiftLeft(row) {
    const filteredRow = row.filter(num => num !== 0);

    while (filteredRow.length < row.length) {
      filteredRow.push(0);
    }

    return filteredRow;
  }
  moveRight() {
    this.initialState.forEach((row, index) => {
      const lal = this.shiftLeft(row.reverse());

      this.initialState[index] = lal.reverse();
    });

    const tableArray = this.createTeableArray();

    this.updateTable(tableArray);
   }
  moveUp() { }
  moveDown() { }

  /**
   * @returns {number}
   */
  getScore() { }

  /**
   * @returns {number[][]}
   */
  getState() { }

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
  getStatus() { }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';

      const tableArray = this.createTeableArray();


      this.createPlate(tableArray);
      this.createPlate(tableArray, 2);
    }
  }

  createPlate(tableArray, secondWalue = 0) {
    const newPlate = this.setRandomField(secondWalue);


    if (newPlate !== null) {
      tableArray[newPlate.row][newPlate.col].content =
        this.startValue;

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

          cell.classList.add(cellData.classes);
        } else {
          cell.textContent = '';
          cell.classList = ['field-cell'];
        }

      });
    });
  }
  restart() { }

  // Add your own methods here
}

module.exports = Game;
