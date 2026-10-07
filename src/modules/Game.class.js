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
    console.log(initialState);

    this.score = 0;
    this.status = 'idle';

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
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const oldRow = [...this.board[row]];
      const currentRow = this.board[row];
      const filtered = currentRow.filter((x) => x !== 0);

      const merged = [];

      for (let i = 0; i < filtered.length; i++) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          this.score += filtered[i] * 2;
          i++;
        } else {
          merged.push(filtered[i]);
        }
      }

      while (merged.length < 4) {
        merged.push(0);
      }
      this.board[row] = merged;

      for (let i = 0; i < 4; i++) {
        if (this.board[row][i] !== oldRow[i]) {
          moved = true;
        }
      }
    }

    if (moved) {
      this.addRandomTile();

      const startButton = document.querySelector('button');

      startButton.className = 'button';

      startButton.classList.add('restart');

      startButton.textContent = 'Restart';
    }
    this.getScore();
    this.updateView();
    this.checkWin();
    this.checkLose();
  }
  moveRight() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const oldRow = [...this.board[row]];

      const currentRow = this.board[row];
      const filtered = currentRow.filter((x) => x !== 0);

      const merged = [];

      for (let i = 0; i < filtered.length; i++) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          merged.push(filtered[i] * 2);
          this.score += filtered[i] * 2;
          i++;
        } else {
          merged.push(filtered[i]);
        }
      }

      while (merged.length < 4) {
        merged.unshift(0);
      }

      this.board[row] = merged;

      for (let i = 0; i < 4; i++) {
        if (this.board[row][i] !== oldRow[i]) {
          moved = true;
          break;
        }
      }
    }

    if (moved) {
      this.addRandomTile();

      const startButton = document.querySelector('button');

      startButton.className = 'button';

      startButton.classList.add('restart');

      startButton.textContent = 'Restart';
    }
    this.updateView();
    this.checkWin();
    this.checkLose();
    this.getScore();
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      const column = [];

      const oldColumn = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const merged = [];

      const filtered = column.filter((x) => x !== 0);

      let i = 0;

      while (i < filtered.length) {
        if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
          this.score += filtered[i] * 2;
          merged.push(filtered[i] * 2);
          i += 2;
        } else {
          merged.push(filtered[i]);
          i++;
        }
      }

      while (merged.length < 4) {
        merged.push(0);
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = merged[row];

        if (this.board[row][col] !== oldColumn[row]) {
          moved = true;
        }
      }
    }

    if (moved) {
      this.addRandomTile();

      const startButton = document.querySelector('button');

      startButton.className = 'button';

      startButton.classList.add('restart');

      startButton.textContent = 'Restart';
    }
    this.getScore();
    this.updateView();
    this.checkWin();
    this.checkLose();
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      const column = [];

      const oldColumn = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const merged = [];

      const filtered = column.filter((x) => x !== 0);

      let i = filtered.length - 1;

      while (i >= 0) {
        if (i > 0 && filtered[i] === filtered[i - 1]) {
          this.score += filtered[i] * 2;
          merged.unshift(filtered[i] * 2);
          i -= 2;
        } else {
          merged.unshift(filtered[i]);
          i--;
        }
      }

      while (merged.length < 4) {
        merged.unshift(0);
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = merged[row];

        if (this.board[row][col] !== oldColumn[row]) {
          moved = true;
        }
      }
    }

    if (moved) {
      this.addRandomTile();

      const startButton = document.querySelector('button');

      startButton.className = 'button';

      startButton.classList.add('restart');

      startButton.textContent = 'Restart';
    }
    this.getScore();
    this.updateView();
    this.checkWin();
    this.checkLose();
  }

  /**
   * @returns {number}
   */
  getScore() {
    const score = document.querySelector('.game-score');

    score.textContent = this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return {
      status: this.status,
      score: this.score,
      board: this.board,
    };
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
    const startMessage = document.querySelector('.message-start');

    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
      this.updateView();
      this.getScore();

      if (startMessage) {
        startMessage.classList.add('hidden');
      }
    }
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

    this.addRandomTile();
    this.addRandomTile();

    this.score = 0;
    this.status = 'playing';

    this.updateView();
    this.getScore();

    const winMessage = document.querySelector('.message-win');

    const loseMessage = document.querySelector('.message-lose');

    if (winMessage) {
      winMessage.className = 'message-win hidden';
    }

    if (loseMessage) {
      loseMessage.className = 'message-lose hidden';
    }
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[randomCell.row][randomCell.col] = value;
  }

  updateView() {
    const cells = document.querySelectorAll('.field-cell');

    for (let i = 0; i < 16; i++) {
      const row = Math.floor(i / 4);
      const col = i % 4;
      const value = this.board[row][col];

      const cell = cells[i];

      cell.textContent = value || '';

      cell.className = 'field-cell';

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  checkWin() {
    for (let i = 0; i < 16; i++) {
      const row = Math.floor(i / 4);
      const col = i % 4;

      const value = this.board[row][col];

      if (value === 2048) {
        const winMessage = document.querySelector('.message-win');

        this.status = 'win';

        if (winMessage) {
          winMessage.className = 'message-win';
        }

        return;
      }
    }
  }

  checkLose() {
    for (const row of this.board) {
      if (row.includes(0)) {
        return;
      }
    }

    for (const row of this.board) {
      for (let i = 0; i < 3; i++) {
        if (row[i] === row[i + 1]) {
          return;
        }
      }
    }

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return;
        }
      }
    }

    const loseMessage = document.querySelector('.message-lose');

    this.status = 'lose';

    if (loseMessage) {
      loseMessage.className = 'message-lose';
    }
  }
}

module.exports = Game;
