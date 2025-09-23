'use strict';

import {
  BOARD_SIZE,
  FOUR_SPAWN_CHANCE,
  ANIMATION_DURATION,
} from '../scripts/main';

class Movement {
  constructor(dash, cells, mergeSound, swipeSound) {
    this.dash = dash;
    this.cells = cells;
    this.mergeSound = mergeSound;
    this.swipeSound = swipeSound;

    this.score = 0;
  }

  /**
   * Moves cells based on the direction
   * @param {string} direction
   * @param {HTMLAudioElement} swipeAudio
   */
  move(direction) {
    this.spawnNumber();
    this.playMoveSound();

    switch (direction) {
      case 'up':
        this.moveUp();
        break;
      case 'down':
        this.moveDown();
        break;
      case 'left':
        this.moveLeft();
        break;
      case 'right':
        this.moveRight();
        break;
    }
  }

  moveLeft() {
    this.prevDashCopy = this.dash.map((row) => row.slice());

    for (let row = 0; row < BOARD_SIZE; row++) {
      // Extract the column values
      let rowCells = this.dash[row].filter((num) => num !== 0);

      // Merge numbers
      this.mergeRow(rowCells);

      // Remove zeroes again after merge
      rowCells = rowCells.filter((num) => num !== 0);

      // Pad with zeroes at the end
      while (rowCells.length < BOARD_SIZE) {
        rowCells.push(0);
      }

      // Put the column back into the board
      this.insertRow(row, rowCells);
    }
  }

  moveRight() {
    this.prevDashCopy = this.dash.map((row) => row.slice());

    for (let row = 0; row < BOARD_SIZE; row++) {
      // Extract the column values
      let rowCells = this.dash[row].filter((num) => num !== 0);

      // Merge numbers
      this.mergeRow(rowCells);

      // Remove zeroes again after merge
      rowCells = rowCells.filter((num) => num !== 0);

      // Pad with zeroes at the end
      while (rowCells.length < BOARD_SIZE) {
        rowCells.unshift(0);
      }

      // Put the column back into the board
      this.insertRow(row, rowCells);
    }
  }

  moveUp() {
    this.prevDashCopy = this.dash.map((row) => row.slice());

    for (let col = 0; col < BOARD_SIZE; col++) {
      // Extract the column values
      let column = [];

      for (let row = 0; row < BOARD_SIZE; row++) {
        if (this.dash[row][col] !== 0) {
          column.push(this.dash[row][col]);
        }
      }

      // Merge numbers
      this.mergeCol(column);

      // Remove zeroes again after merge
      column = column.filter((num) => num !== 0);

      // Pad with zeroes at the end
      while (column.length < BOARD_SIZE) {
        column.push(0);
      }

      // Put the column back into the board
      this.insertCol(col, column);
    }
  }

  moveDown() {
    this.prevDashCopy = this.dash.map((row) => row.slice());

    for (let col = 0; col < BOARD_SIZE; col++) {
      // Extract the column values
      let column = [];

      for (let row = BOARD_SIZE - 1; row >= 0; row--) {
        if (this.dash[row][col] !== 0) {
          column.push(this.dash[row][col]);
        }
      }

      // Merge numbers
      this.mergeCol(column);

      // Remove zeroes again after merge
      column = column.filter((num) => num !== 0);
      column.reverse();

      // Pad with zeroes at the end
      while (column.length < BOARD_SIZE) {
        column.unshift(0);
      }

      // Put the column back into the board
      this.insertCol(col, column);
    }
  }

  /**
   * Inserts merged column into the dash
   */
  insertCol(col, column) {
    for (let row = 0; row < BOARD_SIZE; row++) {
      this.dash[row][col] = column[row];
    }
  }

  /**
   * Inserts merged row into the dash
   */
  insertRow(row, rowCells) {
    for (let col = 0; col < BOARD_SIZE; col++) {
      this.dash[row][col] = rowCells[col];
    }
  }

  /**
   * Merges columns of the dash board
   */
  mergeCol(column) {
    for (let i = 0; i < column.length - 1; i++) {
      if (column[i] === column[i + 1]) {
        column[i] *= 2;
        column[i + 1] = 0;

        // Update score count
        this.score += column[i];

        // Play merge sound
        this.playMergeSound();
      }
    }
  }

  /**
   * Merges rows ofthe dash board
   */
  mergeRow(row) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;

        // Update score count
        this.score += row[i];

        // Play merge sound
        this.playMergeSound();
      }
    }
  }

  /**
   * Spawn 2 or 4 in a random available position
   */
  spawnNumber() {
    if (!this.availableCellsExists()) {
      return;
    }

    const newNum = Math.random() < FOUR_SPAWN_CHANCE ? 4 : 2;

    let randomRowPos;
    let randomColPos;

    // Continue the loop until a free cell is found
    while (true) {
      randomRowPos = Math.floor(Math.random() * BOARD_SIZE);
      randomColPos = Math.floor(Math.random() * BOARD_SIZE);

      if (this.cellIsFree(randomRowPos, randomColPos)) {
        break;
      }
    }

    // Update game dash
    this.dash[randomRowPos][randomColPos] = newNum;
  }

  /**
   * Checks if there are any available slots in the dash
   * @returns {boolean}
   */
  availableCellsExists() {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (this.dash[row][col] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Check if the dash cell is free and returns true
   *
   * @returns {boolean}
   */
  cellIsFree(row, col) {
    return this.dash[row][col] === 0;
  }

  /**
   * Updates HTML table cells
   */
  updateHtmlTable() {
    // Use a setTimeout with a 300ms delay to allow the animation to complete
    setTimeout(() => {
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const num = this.dash[row][col];
          const cell = this.cells[row][col];

          // Clear the cell before updating it's state
          this.clearHtmlCell(cell);

          if (num !== 0) {
            cell.classList.add(`field-cell--${num}`);
          }
        }
      }
    }, ANIMATION_DURATION);
  }

  /**
   * Clears the cell before inserting updated cell into HTML
   */
  clearHtmlCell(cell) {
    // Remove any class that matches the pattern 'field-cell--<num>'
    const classes = Array.from(cell.classList);

    classes.forEach((cls) => {
      if (cls.startsWith('field-cell--')) {
        cell.classList.remove(cls);
      }
    });

    // Clear the text content of the cell
    cell.textContent = '';
  }

  playMergeSound() {
    if (this.mergeSound) {
      this.mergeSound.play();
    }
  }

  playMoveSound() {
    if (this.swipeSound) {
      this.swipeSound.play();
    }
  }
}

module.exports = Movement;
