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
   * [[0, 0, 0, 4],
   *  [0, 0, 0, 0],
   *  [0, 2, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(size = 4, initialState = null) {
    // eslint-disable-next-line no-console
    this.size = size;
    this.score = 0;
    this.board = initialState || this.createEmptyBoard();
    this.status = 'idle';
    this.tr = document.querySelectorAll('.game-field tbody tr');
    this.assignIdToCell();
  }

  sideMovement(e) {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => row.slice());

    switch (e.code) {
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
      case 'ArrowUp':
        this.moveUp();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;

      default:
        return;
    }

    if (this.isNewBoard(oldBoard, this.board)) {
      this.setTwo();
      this.checkLose();
      this.checkWin();
    }
  }

  createEmptyBoard() {
    return Array(this.size)
      .fill(0)
      .map(() => Array(this.size).fill(0));
  }

  slideZero(row) {
    return row.filter((num) => num !== 0);
  }

  slide(row) {
    let newRow = this.slideZero(row);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] = newRow[i] * 2;
        this.score += newRow[i];
        newRow[i + 1] = 0;
      }
    }
    newRow = this.slideZero(newRow);

    while (newRow.length !== this.size) {
      newRow.push(0);
    }

    return newRow;
  }

  setTwo() {
    if (!this.hasEmptyTile()) {
      return;
    }

    let found = false;

    while (!found) {
      const r = Math.floor(Math.random() * this.size);
      const c = Math.floor(Math.random() * this.size);

      if (this.board[r][c] === 0) {
        this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
        found = true;
      }
    }
  }

  hasEmptyTile() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  assignIdToCell() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const cell = this.tr[r].children[c];

        cell.id = r + '-' + c;
      }
    }
  }

  showMessage(type) {
    const messages = ['message-start', 'message-lose', 'message-win'];

    for (const msg of messages) {
      const element = document.querySelector(`.message.${msg}`);

      if (!element) {
        continue;
      }

      if (msg === type) {
        element.classList.remove('hidden');
      } else {
        element.classList.add('hidden');
      }
    }
  }

  checkWin() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';
          this.showMessage('message-win');

          return;
        }
      }
    }
  }

  checkLose() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const cell = this.board[r][c];

        if (cell === 0) {
          return false;
        }

        if (c < this.size - 1 && cell === this.board[r][c + 1]) {
          return false;
        }

        if (r < this.size - 1 && cell === this.board[r + 1][c]) {
          return false;
        }
      }
    }

    this.status = 'lose';
    this.showMessage('message-lose');
  }

  isNewBoard(oldBoard, newBoard) {
    return JSON.stringify(oldBoard) !== JSON.stringify(newBoard);
  }

  moveLeft() {
    for (let r = 0; r < this.size; r++) {
      let row = [...this.board[r]];

      row = this.slide(row);
      this.board[r] = row;
    }
  }

  moveRight() {
    for (let r = 0; r < this.size; r++) {
      let reversedRow = [...this.board[r]].reverse();

      reversedRow = this.slide(reversedRow);
      this.board[r] = reversedRow.reverse();
    }
  }

  moveUp() {
    for (let c = 0; c < this.size; c++) {
      let col = [];

      for (let r = 0; r < this.size; r++) {
        col.push(this.board[r][c]);
      }

      col = this.slide(col);

      for (let r = 0; r < this.size; r++) {
        this.board[r][c] = col[r];
      }
    }
  }

  moveDown() {
    for (let c = 0; c < this.size; c++) {
      let col = [];

      for (let r = this.size - 1; r >= 0; r--) {
        col.push(this.board[r][c]);
      }

      col = this.slide(col);

      for (let r = 0; r < this.size; r++) {
        this.board[this.size - 1 - r][c] = col[r];
      }
    }
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
    return this.board.map((row) => row.slice());
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
    this.score = 0;
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.setTwo();
    this.setTwo();

    const button = document.querySelector('button.start, button.restart');

    button.classList.remove('start');
    button.classList.add('restart');
    button.innerText = 'Restart';

    this.showMessage(null);
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.status = 'idle';
    this.board = this.createEmptyBoard();
    this.showMessage = 'message-start';

    const button = document.querySelector('button.start, button.restart');

    button.classList.remove('restart');
    button.classList.add('start');
    button.innerText = 'Start';
  }

  // Add your own methods here
}

module.exports = Game;
