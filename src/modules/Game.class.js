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
  constructor(initialState = {}) {
    this.size = 4;
    this.field = initialState.field || this.createBoard();
    this.score = initialState.score || 0;
    this.status = initialState.status || 'notStarted';
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      const originalRow = [...this.field[row]];
      const mergedRow = Array(this.size).fill(false);
      let newRow = this.field[row].filter((cell) => cell !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1] && !mergedRow[i]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
          mergedRow[i] = true;
          i++;
          moved = true;
        }
      }

      newRow = newRow.filter((cell) => cell !== 0);

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      this.field[row] = newRow;

      if (JSON.stringify(originalRow) !== JSON.stringify(this.field[row])) {
        moved = true;
      }
    }

    if (moved) {
      this.addTile();
    }

    this.updateUI();

    if (this.field.some((row) => row.includes(2048))) {
      this.status = 'win';
      this.updateUI();
    }

    if (!this.hasValidMoves()) {
      this.status = 'lose';
      this.updateUI();
    }
  }

  moveRight() {
    this.field.forEach((row) => row.reverse());
    this.moveLeft();
    this.field.forEach((row) => row.reverse());
  }
  moveUp() {
    this.field = this.transposeBoard(this.field);
    this.moveLeft();
    this.field = this.transposeBoard(this.field);
  }
  moveDown() {
    this.field = this.transposeBoard(this.field);
    this.moveRight();
    this.field = this.transposeBoard(this.field);
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
    if (this.status === 'playing') {
      this.restart();
    } else {
      this.field = this.createBoard();
      this.score = 0;
      this.status = 'playing';
      this.addTile();
      this.addTile();
    }
    this.updateUI();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.field = this.createBoard();
    this.score = 0;
    this.status = 'playing';
    this.addTile();
    this.addTile();
    this.updateUI();
  }

  // Add your own methods here
  addTile() {
    const empty = [];

    for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
      for (let coll = 0; coll < this.size; coll++) {
        if (this.field[rowIndex][coll] === 0) {
          empty.push([rowIndex, coll]);
        }
      }
    }

    if (empty.length === 0) {
      return false;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.field[row][col] = value;

    return { row, col, value };
  }

  createBoard() {
    const board = [];

    for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
      board.push([0, 0, 0, 0]);
    }

    return board;
  }

  transposeBoard(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  hasValidMoves() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.field[row][col] === 0) {
          return true;
        }

        if (
          row < this.size - 1 &&
          this.field[row][col] === this.field[row + 1][col]
        ) {
          return true;
        }

        if (
          col < this.size - 1 &&
          this.field[row][col] === this.field[row][col + 1]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  updateUI() {
    const gameField = document.querySelector('.game-field');
    const scoreElement = document.querySelector('.game-score');
    const messageWin = document.querySelector('.message-win');
    const messageLose = document.querySelector('.message-lose');
    const messageStart = document.querySelector('.message-start');

    gameField.innerHTML = '';

    for (let row = 0; row < this.size; row++) {
      let rowHTML = '<tr class="field-row">';

      for (let col = 0; col < this.size; col++) {
        const tileValue = this.field[row][col] || '';

        rowHTML += `<td class="field-cell field-cell--${tileValue}">${tileValue}</td>`;
      }
      rowHTML += '</tr>';
      gameField.innerHTML += rowHTML;
    }

    scoreElement.innerText = this.score;

    if (this.status === 'win') {
      messageWin.classList.remove('hidden');
      messageLose.classList.add('hidden');
    } else if (this.status === 'lose') {
      messageLose.classList.remove('hidden');
      messageWin.classList.add('hidden');
    } else {
      messageStart.classList.add('hidden');
    }
  }
}

module.exports = Game;
