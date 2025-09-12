'use strict';

import { resetScore, stopBgMusic } from '../scripts/main';

const loseMsgEl = document.querySelector('.message.message-lose');
const winMsgEl = document.querySelector('.message.message-win');
const scoreColEls = [...document.querySelectorAll('.score-col')];
const rows = [...document.querySelectorAll('.field-row')];

if (!rows.length) {
  throw new Error('Rows are not found!');
}

const cells = rows.map((row) => [...row.querySelectorAll('.field-cell')]);

if (!cells.length) {
  throw new Error('Cells are not found!');
}

const swipeSound = document.getElementById('swipe-sound');
const mergeSound = document.getElementById('merge-sound');
const gameOverSound = document.getElementById('game-over-sound');
const backgroundMusic = document.getElementById('background-music');
const gameVictorySound = document.getElementById('game-victory-sound');

const BOARD_SIZE = 4;
const FOUR_SPAWN_CHANCE = 0.1;

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
  constructor() {
    // Generate an empty dash board
    this.dash = Array.from({ length: BOARD_SIZE }, () => {
      return Array(BOARD_SIZE).fill(0);
    });

    this.score = 0;
  }

  /**
   * Moves cells based on the direction
   * @param {string} direction
   * @param {HTMLAudioElement} swipeAudio
   */
  move(direction) {
    let gameStatus = this.getStatus();

    if (gameStatus !== 'playing') {
      return;
    }

    // Play move sound
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

    gameStatus = this.getStatus();

    // Spawn new cell if the game isn't finished yet
    if (gameStatus === 'playing') {
      this.spawnNumber();
    }

    // Update HTML table state
    this.updateHtmlTable();

    // Update HTML score count
    this.updateHtmlScore();
  }

  moveLeft() {
    for (let row = 0; row < BOARD_SIZE; row++) {
      // Extract the column values
      let rowCells = [];

      for (let col = 0; col < BOARD_SIZE; col++) {
        if (this.dash[row][col] !== 0) {
          rowCells.push(this.dash[row][col]);
        }
      }

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
    for (let row = 0; row < BOARD_SIZE; row++) {
      // Extract the column values
      let rowCells = [];

      for (let col = BOARD_SIZE - 1; col >= 0; col--) {
        if (this.dash[row][col] !== 0) {
          rowCells.push(this.dash[row][col]);
        }
      }

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
   * @returns {number}
   */
  getScore() {}

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
  getStatus() {
    let gameStatus = 'playing';

    if (this.checkLose()) {
      gameStatus = 'lose';
      this.showLoseMsg();
      stopBgMusic(backgroundMusic);
      this.playGameOverSound();
    }

    if (this.checkWin()) {
      gameStatus = 'win';
      this.showWinMsg();
      stopBgMusic(backgroundMusic);
      this.playGameVictorySound();
    }

    return gameStatus;
  }

  /**
   * Checks for win
   * @returns {boolean}
   */
  checkWin() {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (this.dash[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Checks if the game is still playable or returns true if it is lost.
   * @returns {boolean}
   */
  checkLose() {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        // If there's an empty cell, the game isn't lost yet
        if (this.dash[row][col] === 0) {
          return false;
        }

        // Check down (next row, same column)
        if (
          row < BOARD_SIZE - 1 &&
          this.dash[row][col] === this.dash[row + 1][col]
        ) {
          return false;
        }

        // Check right (same row, next column)
        if (
          col < BOARD_SIZE - 1 &&
          this.dash[row][col] === this.dash[row][col + 1]
        ) {
          return false;
        }

        // Check up (previous row, same column)
        if (row > 0 && this.dash[row][col] === this.dash[row - 1][col]) {
          return false;
        }

        // Check left (same row, previous column)
        if (col > 0 && this.dash[row][col] === this.dash[row][col - 1]) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Starts the game.
   */
  start() {
    // Generate two numbers at random positions at the beginning of the game.
    this.spawnNumber();
    this.spawnNumber();
    this.updateHtmlTable();
  }

  /**
   * Resets the game.
   */
  restart() {}

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
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const num = this.dash[row][col];
        const cell = cells[row][col];

        // Clear the cell before updating it's state
        this.clearHtmlCell(cell);

        if (num !== 0) {
          cell.textContent = num;
          cell.classList.add(`field-cell--${num}`);
        }
      }
    }
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

  /**
   * Updates HTML score count
   */
  updateHtmlScore() {
    if (scoreColEls.length) {
      resetScore();

      const score = String(this.score).padStart(4, '0');

      for (let i = 0; i < scoreColEls.length; i++) {
        // Add new class score-col--<i>
        scoreColEls[i].classList.add(`score-col--${score[i]}`);
      }
    }
  }

  /**
   * Shows the lose message by removing the hidden class
   */
  showLoseMsg() {
    if (loseMsgEl) {
      loseMsgEl.classList.remove('hidden');
    }
  }

  /**
   * Shows the win message by removing the hidden class
   */
  showWinMsg() {
    if (winMsgEl) {
      winMsgEl.classList.remove('hidden');
    }
  }

  playMergeSound() {
    if (mergeSound) {
      mergeSound.play();
    }
  }

  playMoveSound() {
    if (swipeSound) {
      swipeSound.play();
    }
  }

  playGameOverSound() {
    if (gameOverSound) {
      gameOverSound.play();
    }
  }

  playGameVictorySound() {
    if (gameVictorySound) {
      gameVictorySound.play();
    }
  }
}

module.exports = Game;
