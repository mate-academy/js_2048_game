/* eslint-disable */

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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    // cells,
  ) {
    // eslint-disable-next-line no-console
    this.board = initialState;
    this.score = 0;
    this.status = 'idle';
    this.cells = document.getElementsByClassName('field-row');
    this.scoreElement = document.getElementsByClassName('game-score');
    this.count = 0;
  }

  moveLeft() {
    for (let row = 0; row <= this.board.length - 1; row++) {
      this._compress(this.board[row]);
      this._merge(this.board[row]);
      this._compress(this.board[row]);
    }
    this._renderBoard();
    this._generateNumbers();
  }

  moveRight() {
    for (let row = 0; row <= this.board.length - 1; row++) {
      this._compressDown(this.board[row]);
      this._mergeDown(this.board[row]);
      this._compressDown(this.board[row]);
    }
    this._renderBoard();
    this._generateNumbers();
  }

  moveUp() {
    for (let col = 0; col < this.board[0].length; col++) {
      const column = this.board.map((row) => row[col]);
      this._compress(column);
      this._merge(column);
      this._compress(column);
      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = column[row];
      }
    }
    this._renderBoard();
    this._generateNumbers();
  }

  moveDown() {
    for (let col = 0; col < this.board[0].length; col++) {
      const column = this.board.map((row) => row[col]);
      this._compressDown(column);
      this._mergeDown(column);
      this._compressDown(column);
      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = column[row];
      }
    }
    this._renderBoard();
    this._generateNumbers();
  }

  _merge(column) {
    for (let i = 0; i <= column.length - 1; i++) {
      if (column[i] === column[i + 1] && column[i] > 0) {
        column[i] *= 2;

        column[i + 1] = 0;
        this.score += column[i];
      }
    }
  }

  _mergeDown(column) {
    for (let i = column.length - 1; i > 0; i--) {
      if (column[i] === column[i - 1] && column[i] > 0) {
        column[i] *= 2;
        column[i - 1] = 0;
        this.score += column[i];
      }
    }
  }

  _compress(col) {
    const compressedColumn = col.filter((cell) => cell !== 0);

    while (compressedColumn.length < 4) {
      compressedColumn.push(0);
    }
    col.forEach(function (part, index, array) {
      array[index] = compressedColumn[index];
    });
  }

  _compressDown(col) {
    const compressedColumn = col.filter((cell) => cell !== 0);

    while (compressedColumn.length < 4) {
      compressedColumn.unshift(0);
    }
    col.forEach(function (part, index, array) {
      array[index] = compressedColumn[index];
    });
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
    return this.board;
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
    // eslint-disable-next-line no-console
    this.board[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] =
      2;
    this.board[Math.floor(Math.random() * 4)][Math.floor(Math.random() * 4)] =
      2;
    this.status = 'playing';

    this._renderBoard();
  }

  /**
   * Resets the game.
   */
  restart() { }

  // Add your own methods here

  _generateNumbers() {
    const empty = [];
    for (let line = 0; line <= this.board.length - 1; line++) {
      for (let col = 0; col <= this.board[line].length - 1; col++) {
        if (this.board[line][col] === 0) {
          empty.push([line, col]);
        }
      }
    }
    const coords = Math.floor(Math.random() * empty.length);

    const emptyCell = empty[coords];
    if (emptyCell !== undefined) {
      this.board[emptyCell[0]][emptyCell[1]] = this._getNumber();
    }
    // if (!this._checkLoose()) {
    //   console.log('game is ended');
    // }
    // console.log(empty, emptyCell, 'detect when there is no space to move');
    setTimeout(() => {
      this._renderBoard();
    }, 500);
  }

  _renderBoard() {
    const startButton = document.getElementById('start-button');
    const messageContainer = document.getElementById("message-container");
    console.log(messageContainer.children[0].className);
    this.count++;
    for (let line = 0; line <= this.board.length - 1; line++) {
      for (let col = 0; col <= this.board[line].length - 1; col++) {
        this.cells[line].cells[col].innerText = this.board[line][col];
        this.cells[line].cells[col].classList.value =
          `field-cell field-cell--${this.cells[line].cells[col].innerText}`;
        if (this.board[line][col] === 0) {
          this.cells[line].cells[col].innerText = '';
        }
      }
    }
    if (this.status === 'playing' && this.count > 1) {
      startButton.innerText = 'Restart';
      messageContainer.children[2].classList.add('hidden');
    } else {
      startButton.innerText = 'Start';
    }
    if (this.score >= 2048) {
      messageContainer.children[1].classList.remove('hidden')
    } 
    if (!this._checkLoose()) {
      console.log('game is ended');
      messageContainer.children[0].classList.remove('hidden');
    }
    this.scoreElement[0].innerText = this.score;
    console.log(this._checkLoose(), 'check whether the game is not finished');
  }

  _getNumber() {
    const numbers = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
    const index = Math.floor(Math.random() * numbers.length);
    return numbers[index];
  }

  _checkLoose() {
    if (this.board.some(row => row.some(cell => cell === 0))) {
      return true;
    }

    for (let x = 0; x < this.board.length; x++) {
      for (let i = 0; i < this.board[x].length; i++) {
        if (i < this.board[x].length - 1
          && this.board[x][i] === this.board[x][i + 1]) {
          return true;
        }
        if (x < this.board[x].length - 1 && this.board[x][i] === this.board[x + 1][i]) {
          return true;
        }
      }
    }
    return false;
  }
}

module.exports = Game;
