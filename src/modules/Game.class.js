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
    // eslint-disable-next-line no-console
    this.initializeBoard();
    this.renderBoard();
    this.addKeyboardListeners();
  }

  initializeBoard() {
    this.rows = 4;
    this.columns = 4;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;

    const findEmptyCells = () => {
      const isEmpty = [];

      for (let i = 0; i < this.rows; i++) {
        for (let j = 0; j < this.columns; j++) {
          if (this.board[i][j] === 0) {
            isEmpty.push({ row: i, column: j });
          }
        }
      }

      return isEmpty;
    };

    const generateRandomNumber = () => {
      return Math.random() < 0.5 ? 2 : 4;
    };

    const emptyCells = findEmptyCells();

    for (let i = 0; i < 2; i++) {
      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const randomCell = emptyCells[randomIndex];

        const randomNumber = generateRandomNumber();

        this.board[randomCell.row][randomCell.column] = randomNumber;

        emptyCells.splice(emptyCells.indexOf(randomCell), 1);
      }
    }
    // console.log(initialState);
  }

  renderBoard() {
    const boardElement = document.querySelector('.game-field tbody');

    boardElement.innerHTML = '';

    for (let i = 0; i < this.rows; i++) {
      const row = document.createElement('tr');

      for (let j = 0; j < this.columns; j++) {
        const tile = document.createElement('td');

        tile.classList.add('field-cell');

        const value = this.board[i][j];

        tile.innerText = value || '';

        if (value) {
          tile.classList.add(`field-cell--${value}`);
        }

        tile.class = i.toString() + '-' + j.toString();
        row.appendChild(tile);
      }
      boardElement.appendChild(row);
    }
  }

  addKeyboardListeners() {
    document.addEventListener('keyup', (press) => {
      if (press.key === 'ArrowLeft') {
        this.moveLeft();
      }

      if (press.key === 'ArrowRight') {
        this.moveRight();
      }

      if (press.key === 'ArrowUp') {
        this.moveUp();
      }
    });
  }

  filterZeroRow(row) {
    return row.filter((num) => num !== 0);
  }

  slideLeft(row) {
    let filteredRow = this.filterZeroRow(row);

    for (let i = 0; i < filteredRow.length; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        filteredRow[i + 1] = 0;
        this.score += filteredRow[i];
      }
    }

    filteredRow = this.filterZeroRow(filteredRow);

    while (filteredRow < this.columns) {
      filteredRow.push(0);
    }

    return filteredRow;
  }

  moveLeft() {
    for (let i = 0; i < this.rows; i++) {
      let row = this.board[i];

      row = this.slideLeft(row);
      this.board[i] = row;
    }
    this.renderBoard();
  }

  slideRight(row) {
    let filteredRow = this.filterZeroRow(row);

    for (let j = filteredRow.length - 1; j > 0; j--) {
      if (filteredRow[j] === filteredRow[j - 1]) {
        filteredRow[j] *= 2;
        filteredRow[j - 1] = 0;
        this.score += filteredRow[j];
      }
    }

    filteredRow = this.filterZeroRow(filteredRow);

    while (filteredRow.length < this.columns) {
      filteredRow.unshift(0);
    }

    return filteredRow;
  }

  moveRight() {
    for (let j = 0; j < this.rows; j++) {
      let row = this.board[j];

      row = this.slideRight(row);

      this.board[j] = row;
    }
    this.renderBoard();
  }

  filterZeroColunms(columns) {
    return columns.filter((num) => num !== 0);
  }

  slideUp(columns) {
    let filteredColumns = this.filterZeroColunms(columns);

    for (let i = 0; i < filteredColumns.length; i++) {
      if (filteredColumns[i] === filteredColumns[i + 1]) {
        filteredColumns[i] *= 2;
        filteredColumns[i + 1] = 0;
        this.score += filteredColumns[i];
      }
    }

    filteredColumns = this.filterZeroColunms(filteredColumns);

    while (filteredColumns.length < this.rows) {
      filteredColumns.push(0);
    }

    return filteredColumns;
  }

  moveUp() {
    for (let j = 0; j < this.columns; j++) {
      let column = [];

      for (let i = 0; i < this.rows; i++) {
        column.push(this.board[i][j]);
      }

      column = this.slideUp(column);

      for (let i = 0; i < this.rows; i++) {
        this.board[i][j] = column[i];
      }
    }
    this.renderBoard();
  }
  // moveUp() {
  //   for (let j = 0; j < this.columns; j++) {
  //     let row = [
  //       this.board[0][j],
  //       this.board[1][j],
  //       this.board[2][j],
  //       this.board[3][j],
  //     ];

  //     row = this.slideUp(row);
  //     this.board[0][j] = row[0];
  //     this.board[1][j] = row[1];
  //     this.board[2][j] = row[2];
  //     this.board[3][j] = row[3];
  //   }
  //   this.renderBoard();
  // }
  moveDown() {}

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
  getStatus() {}

  /**
   * Starts the game.
   */
  start() {}

  /**
   * Resets the game.
   */
  restart() {}

  // Add your own methods here
}

module.exports = Game;
