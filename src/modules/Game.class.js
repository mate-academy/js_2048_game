/* eslint-disable function-paren-newline */
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
  constructor(initialState = null) {
    if (initialState) {
      this.board = initialState;
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }
    // eslint-disable-next-line no-console
    console.log(initialState);

    this.score = 0;
    this.isStarted = false;
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const originalRow = [...this.board[row]];
      const newRow = this.board[row].filter((cell) => cell !== 0);

      for (let cell = 0; cell < newRow.length - 1; cell++) {
        if (newRow[cell] === newRow[cell + 1]) {
          newRow[cell] = newRow[cell] + newRow[cell + 1];
          this.score += Number(newRow[cell]);
          newRow[cell + 1] = 0;
          cell++;
        }
      }

      const compressedRow = newRow.filter((cell) => cell !== 0);

      while (compressedRow.length < 4) {
        compressedRow.push(0);
      }

      if (originalRow.toString() !== compressedRow.toString()) {
        moved = true;
      }

      this.board[row] = compressedRow;
    }

    if (moved) {
      this.randomPlace();
    }

    this.renderBoard();
    this.updateCellColor();
  }

  moveRight() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const originalRow = [...this.board[row]];

      let newRow = this.board[row].filter((cell) => cell !== 0).reverse();

      for (let cell = 0; cell < newRow.length - 1; cell++) {
        if (newRow[cell] === newRow[cell + 1]) {
          newRow[cell] = newRow[cell] + newRow[cell + 1];
          this.score += Number(newRow[cell]);
          newRow[cell + 1] = 0;
          cell++;
        }
      }

      newRow = newRow.filter((cell) => cell !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      newRow.reverse();

      if (originalRow.toString() !== newRow.toString()) {
        moved = true;
      }

      this.board[row] = newRow;
    }

    if (moved) {
      this.randomPlace();
    }

    this.renderBoard();
    this.updateCellColor();
  }

  moveUp() {
    this.board = this.transpose(this.board);

    this.moveLeft();

    this.board = this.transpose(this.board);

    this.renderBoard();
    this.updateCellColor();
  }
  moveDown() {
    this.board = this.transpose(this.board);

    this.moveRight();

    this.board = this.transpose(this.board);

    this.renderBoard();
    this.updateCellColor();
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
    // when you started play
    // if (!this.isStarted) {
    //   return 'idle';
    // }

    // check for win
    if (this.board.some((row) => row.some((cell) => cell === 2048))) {
      return 'win';
    }

    // check for lose
    const emptyCells = this.board.some((row) => row.some((cell) => cell === 0));

    const canMerge = this.board.some((row, rowIndex) =>
      row.some((cell, cellINdex) => {
        const right =
          cellINdex < 3 && this.board[rowIndex][cellINdex + 1] === cell;
        const down =
          rowIndex < 3 && this.board[rowIndex + 1][cellINdex] === cell;

        return right || down;
      }),
    );

    if (!emptyCells && !canMerge) {
      return 'lose';
    }

    // for playing
    return 'playing';
  }

  /**
   * Starts the game.
   */
  start() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';

    this.randomPlace();
    this.randomPlace();

    this.renderBoard();
    this.updateCellColor();
    this.getScore();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.randomPlace();
    this.randomPlace();

    this.score = 0;

    this.status = 'playing';

    this.renderBoard();
    this.updateCellColor();
  }

  // Add your own methods here

  transpose(matrix) {
    return matrix[0].map((_, index) => matrix.map((row) => row[index]));
  }

  isBoardFull() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }

    return true;
  }

  randomPlace() {
    if (this.isBoardFull()) {
      return;
    }

    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.board[row][column] === 0) {
          emptyCells.push([row, column]);
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [randomRow, randomColumn] = emptyCells[randomIndex];

    this.board[randomRow][randomColumn] = Math.random() < 0.9 ? 2 : 4;
  }

  renderBoard() {
    const boardElement = document.querySelector('.game-field');

    const rows = boardElement.querySelectorAll('tr');

    const rowsArray = Array.from(rows);

    const cells = rowsArray.flatMap((row) =>
      Array.from(row.querySelectorAll('td')),
    );

    cells.forEach((cell, index) => {
      const value = this.board[Math.floor(index / 4)][index % 4];

      cell.textContent = value === 0 ? '' : value;
    });
  }

  updateCellColor() {
    const boardElement = document.querySelector('.game-field');

    const rows = boardElement.querySelectorAll('tr');

    const rowsArray = Array.from(rows);

    const cells = rowsArray.flatMap((row) =>
      Array.from(row.querySelectorAll('td')),
    );

    cells.forEach((cell) => {
      const value = cell.textContent.trim();

      cell.classList.remove(
        'field-cell--2',
        'field-cell--4',
        'field-cell--8',
        'field-cell--16',
        'field-cell--32',
        'field-cell--64',
        'field-cell--128',
        'field-cell--256',
        'field-cell--512',
        'field-cell--1024',
        'field-cell--2048',
      );

      if (value !== '' && !isNaN(value)) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  }
}

module.exports = Game;
