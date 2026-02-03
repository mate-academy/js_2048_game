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
    if (initialState !== undefined) {
      this.initialState = initialState;
    } else {
      this.initialState = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  updateCell(row, col, value) {
    const cell = document.querySelectorAll('.field-row')[row].children[col];

    cell.textContent = value === 0 ? '' : value;
    cell.className = 'field-cell';

    if (value !== 0) {
      cell.classList.add(`field-cell--${value}`);
    }
  }

  updateDOM() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = this.board[row][col];

        this.updateCell(row, col, value);
      }
    }

    // updating score
    this.updateScore();
  }

  updateScore() {
    const scoreEl = document.querySelector('.game-score');

    if (scoreEl) {
      scoreEl.textContent = this.score;
    }
  }

  merge(cells) {
    const merged = new Array(cells.length).fill(false);

    for (let i = 0; i < cells.length - 1; i++) {
      if (cells[i] === cells[i + 1] && !merged[i] && !merged[i + 1]) {
        cells[i] *= 2;
        this.score += cells[i];
        cells.splice(i + 1, 1);
        merged.splice(i + 1, 1);
        merged[i] = true;
      }
    }

    return cells;
  }

  getNonZeroRow(row) {
    return this.board[row].filter((v) => v !== 0);
  }

  getNonZeroCol(col) {
    return this.board.map((r) => r[col]).filter((v) => v !== 0);
  }

  padCells(cells) {
    while (cells.length < 4) {
      cells.push(0);
    }
  }

  move(direction) {
    const isRow = direction === 'left' || direction === 'right';
    const reverse = direction === 'right' || direction === 'down';

    for (let i = 0; i < 4; i++) {
      let cells = isRow ? this.getNonZeroRow(i) : this.getNonZeroCol(i);

      if (reverse) {
        cells.reverse();
      }

      cells = this.merge(cells);
      this.padCells(cells);

      if (reverse) {
        cells.reverse();
      }

      for (let j = 0; j < 4; j++) {
        if (isRow) {
          this.board[i][j] = cells[j];
        } else {
          this.board[j][i] = cells[j];
        }
      }
    }

    this.updateDOM();
  }

  showMessage(type) {
    const messages = {
      win: document.querySelector('.message-win'),
      lose: document.querySelector('.message-lose'),
      start: document.querySelector('.message-start'),
    };

    Object.keys(messages).forEach((key) => {
      if (key === type) {
        messages[key].classList.remove('hidden');
      } else {
        messages[key].classList.add('hidden');
      }
    });
  }

  checkWin() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';
        this.showMessage('win');

        return true;
      }
    }

    return false;
  }

  checkLose() {
    // checking empty cells
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return false;
        }
      }
    }

    // horizontal check
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          return false;
        }
      }
    }

    // vertical check
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 3; r++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          return false;
        }
      }
    }

    this.status = 'lose';
    this.showMessage('lose');

    return true;
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
   * Returns the current game  status.
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

  addNewCell() {
    // finding all empty cells
    const emptyCells = [];

    for (let a = 0; a < this.board.length; a++) {
      for (let b = 0; b < this.board[a].length; b++) {
        if (this.board[a][b] === 0) {
          emptyCells.push([a, b]);
        }
      }
    }

    // adding cell
    const randInd = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randInd];
    const newTile = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = newTile;

    this.updateCell(row, col, newTile);
  }

  start() {
    // changing game status
    this.status = 'playing';

    const messageWin = document.querySelector(
      '.message-container .message-win',
    );
    const messageStart = document.querySelector(
      '.message-container .message-start',
    );
    const messageLose = document.querySelector(
      '.message-container .message-lose',
    );

    messageStart.classList.add('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');

    const button = document.querySelector('button.start');

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';

    this.addNewCell();
    this.addNewCell();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';

    const rows = document.querySelectorAll('.field-row');

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = rows[row].children[col];

        cell.textContent = '';
        cell.className = 'field-cell';
      }
    }

    this.showMessage('start');

    const button = document.querySelector('button.restart');

    if (button) {
      button.classList.remove('restart');
      button.classList.add('start');
      button.textContent = 'Start';
    }
  }

  // Add your own methods here
}

// module.exports = Game;
export default Game;
