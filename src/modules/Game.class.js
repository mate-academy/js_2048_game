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
    this.size = 4;
    this.status = 'idle';
    this.score = 0;

    this.board = initialState || this.createEmptyBoard();
  }

  moveLeft() {
    return this.makeMoveLeft();
  }

  moveRight() {
    this.makeReverseBoard();

    const moved = this.makeMoveLeft();

    this.makeReverseBoard();

    return moved;
  }

  moveUp() {
    this.makeTranspose();

    const moved = this.makeMoveLeft();

    this.makeTranspose();

    return moved;
  }

  moveDown() {
    this.makeTranspose();

    const moved = this.moveRight();

    this.makeTranspose();

    return moved;
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
    this.status = 'playing';
    this.makeRandomCell();
    this.makeRandomCell();
    this.renderCells();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'playing';
    this.score = 0;
    this.updateScore();
    this.board = this.createEmptyBoard();
    this.renderCells();
    this.updateMessage();
    this.start();
  }

  // Add your own methods here
  /* eslint-disable */
  createEmptyBoard() {
    return Array.from({ length: this.size }, () =>
      Array.from({ length: this.size }, () => 0),
    );
  }
  /* eslint-enable */

  updateScore(numToAdd = 0) {
    this.score += numToAdd;

    document.querySelector('.game-score').textContent = `${this.score}`;
  }

  makeMoveLeft() {
    let moved = false;

    for (let i = 0; i < this.board.length; i++) {
      const originalRow = [...this.board[i]];

      let row = this.board[i].filter((cell) => cell !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          row[j + 1] = 0;
          this.updateScore(row[j]);
          j++;
        }
      }

      row = row.filter((cell) => cell !== 0);

      while (row.length < 4) {
        row.push(0);
      }

      this.board[i] = row;

      if (originalRow.join() !== row.join()) {
        moved = true;
      }
    }

    return moved;
  }

  makeReverseBoard() {
    this.board = this.board.map((row) => [...row].reverse());
  }

  makeTranspose() {
    this.board = this.board[0].map((_, i) => this.board.map((row) => row[i]));
  }

  findEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ row: i, cell: j });
        }
      }
    }

    return emptyCells;
  }

  makeRandomCell() {
    const emptyCells = this.findEmptyCells();

    if (emptyCells.length === 0) {
      return this.board;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, cell } = emptyCells[randomIndex];

    this.board[row][cell] = Math.random() < 0.9 ? 2 : 4;

    return this.board;
  }

  renderCells() {
    const table = document.querySelector('.game-field');
    const tbody = table.querySelector('tbody');

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const value = this.board[i][j];

        tbody.rows[i].cells[j].textContent =
          this.board[i][j] !== 0 ? value : '';

        tbody.rows[i].cells[j].className =
          `field-cell field-cell--${tbody.rows[i].cells[j].textContent}`;
      }
    }
  }

  checkStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    }

    const isEmptyCells = this.findEmptyCells().length > 0;

    let canMove = false;

    /* eslint-disable */

    outer: for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        const current = this.board[i][j];

        if (
          (j > 0 && current === this.board[i][j - 1]) ||
          (i > 0 && current === this.board[i - 1][j])
        ) {
          canMove = true;

          break outer;
        }
      }
    }

    /* eslint-enable */

    if (!isEmptyCells && !canMove) {
      this.status = 'lose';
    }
  }

  updateMessage() {
    this.checkStatus();

    const messageStart = document.querySelector('.message-start');
    const messageWin = document.querySelector('.message-win');
    const messageLose = document.querySelector('.message-lose');

    switch (this.status) {
      case 'idle':
        messageStart.classList.remove('hidden');
        break;

      case 'playing':
        messageStart.classList.add('hidden');
        messageWin.classList.add('hidden');
        messageLose.classList.add('hidden');
        break;

      case 'win':
        messageWin.classList.remove('hidden');
        break;

      case 'lose':
        messageLose.classList.remove('hidden');
        break;

      default:
        return 0;
    }
  }
}

module.exports = Game;
