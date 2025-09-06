'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState) {
    this.rows = 4;
    this.columns = 4;
    this.score = 0;

    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.renderBoard();
    this.status = 'idle';
    this.initControls();

    document.addEventListener('keyup', (e) => {
      if (this.status !== 'playing') {
        return;
      }

      let moved = false;

      switch (e.code) {
        case 'ArrowLeft':
          moved = this.moveLeft();
          break;
        case 'ArrowRight':
          moved = this.moveRight();
          break;
        case 'ArrowUp':
          moved = this.moveUp();
          break;
        case 'ArrowDown':
          moved = this.moveDown();
          break;
      }

      if (moved) {
        this.afterMove();
      }
    });
  }

  renderBoard() {
    const rows = document.querySelectorAll('.field-row');

    for (let r = 0; r < this.rows; r++) {
      const cells = rows[r].querySelectorAll('.field-cell');

      for (let c = 0; c < this.columns; c++) {
        const tile = cells[c];

        tile.id = `${r}-${c}`;

        const num = this.board[r][c];

        this.updateTile(tile, num);
      }
    }
  }

  updateTile(tile, num) {
    tile.innerText = '';
    tile.className = 'field-cell';

    if (num > 0) {
      tile.innerText = num.toString();
      tile.classList.add(`field-cell--${num}`);
    }
  }

  filterZero(row) {
    return row.filter((num) => num !== 0);
  }

  slide(row) {
    let newRow = this.filterZero(row);

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;
        this.score += newRow[i];
      }
    }

    newRow = this.filterZero(newRow);

    while (newRow.length < this.columns) {
      newRow.push(0);
    }

    return newRow;
  }

  moveLeft() {
    let moved = false;

    for (let r = 0; r < this.rows; r++) {
      const oldRow = [...this.board[r]];
      const newRow = this.slide(oldRow);

      this.board[r] = newRow;

      if (!moved && newRow.some((num, i) => num !== oldRow[i])) {
        moved = true;
      }

      for (let c = 0; c < this.columns; c++) {
        const tile = document.getElementById(`${r}-${c}`);

        this.updateTile(tile, newRow[c]);
      }
    }

    return moved;
  }

  moveRight() {
    let moved = false;

    for (let r = 0; r < this.rows; r++) {
      const oldRow = [...this.board[r]];
      const reversed = [...oldRow].reverse();
      const newRow = this.slide(reversed).reverse();

      this.board[r] = newRow;

      if (!moved && newRow.some((num, i) => num !== oldRow[i])) {
        moved = true;
      }

      for (let c = 0; c < this.columns; c++) {
        const tile = document.getElementById(`${r}-${c}`);

        this.updateTile(tile, newRow[c]);
      }
    }

    return moved;
  }

  moveUp() {
    let moved = false;

    for (let c = 0; c < this.columns; c++) {
      const oldCol = [];

      for (let r = 0; r < this.rows; r++) {
        oldCol.push(this.board[r][c]);
      }

      const newCol = this.slide(oldCol);

      for (let r = 0; r < this.rows; r++) {
        if (!moved && this.board[r][c] !== newCol[r]) {
          moved = true;
        }
        this.board[r][c] = newCol[r];

        const tile = document.getElementById(`${r}-${c}`);

        this.updateTile(tile, newCol[r]);
      }
    }

    return moved;
  }

  moveDown() {
    let moved = false;

    for (let c = 0; c < this.columns; c++) {
      const oldCol = [];

      for (let r = 0; r < this.rows; r++) {
        oldCol.push(this.board[r][c]);
      }

      const reversed = [...oldCol].reverse();
      const newCol = this.slide(reversed).reverse();

      for (let r = 0; r < this.rows; r++) {
        if (!moved && this.board[r][c] !== newCol[r]) {
          moved = true;
        }
        this.board[r][c] = newCol[r];

        const tile = document.getElementById(`${r}-${c}`);

        this.updateTile(tile, newCol[r]);
      }
    }

    return moved;
  }

  afterMove() {
    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-lose').classList.add('hidden');

    this.setTwo();
    this.getScore();
    this.getStatus();
  }

  /**
   * @returns {number}
   */
  getScore() {
    document.querySelector('.game-score').innerText = this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.board.map((row) => [...row]);
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
    const messageWin = document.querySelector('.message-win');
    const messageLose = document.querySelector('.message-lose');

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.board[r][c] === 2048) {
          messageWin.classList.remove('hidden');
          this.status = 'win';

          return;
        }
      }
    }

    let movesAvailable = false;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.board[r][c] === 0) {
          movesAvailable = true;
        }

        if (c < this.columns - 1 && this.board[r][c] === this.board[r][c + 1]) {
          movesAvailable = true;
        }

        if (r < this.rows - 1 && this.board[r][c] === this.board[r + 1][c]) {
          movesAvailable = true;
        }
      }
    }

    if (!movesAvailable) {
      messageLose.classList.remove('hidden');
      this.status = 'lose';
    }
  }

  /**
   * Starts the game.
   */

  initControls() {
    const button = document.querySelector('.button');
    const message = document.querySelector('.message-start');

    button.addEventListener('click', () => {
      if (button.classList.contains('start')) {
        button.textContent = 'Restart';
        button.classList.replace('start', 'restart');
        this.start();
        message.classList.add('hidden');
      } else if (button.classList.contains('restart')) {
        button.textContent = 'Start';
        button.classList.replace('restart', 'start');
        this.restart();
        message.classList.remove('hidden');
      }
    });
  }

  start() {
    this.status = 'playing';
    this.setTwo();
    this.renderBoard();
    this.getScore();
  }
  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'idle';

    const messageWin = document.querySelector('.message-win');
    const messageLose = document.querySelector('.message-lose');

    messageWin.classList.add('hidden');
    messageLose.classList.add('hidden');

    this.renderBoard();

    this.getScore();
  }

  setTwo() {
    if (!this.hasEmptyTile()) {
      return;
    }

    let found = false;

    while (!found) {
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.columns);

      if (this.board[r][c] === 0) {
        const value = Math.random() < 0.1 ? 4 : 2;

        this.board[r][c] = value;

        const tile = document.getElementById(`${r}-${c}`);

        tile.innerText = value;
        tile.className = 'field-cell';
        tile.classList.add(`field-cell--${value}`);

        found = true;
      }
    }
  }

  hasEmptyTile() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }
      }
    }

    return false;
  }
}

export default Game;

// [8, 16, 2, 8],
// [16, 2, 32, 16],
// [2, 8, 16, 8],
// [4, 32, 8, 16],
// sssssss
