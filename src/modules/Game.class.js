'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);

    for (let r = 0; r < 4; r++) {
      this.board[r] = this.moveRowLeft(this.board[r]);
    }

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
    }

    this.checkWin();
    this.checkLose();
    this.render();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);

    for (let r = 0; r < 4; r++) {
      this.board[r].reverse();
      this.board[r] = this.moveRowLeft(this.board[r]);
      this.board[r].reverse();
    }

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
    }

    this.checkWin();
    this.checkLose();
    this.render();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);

    this.board = this.transpose(this.board);

    for (let r = 0; r < 4; r++) {
      this.board[r] = this.moveRowLeft(this.board[r]);
    }

    this.board = this.transpose(this.board);

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
    }

    this.checkWin();
    this.checkLose();
    this.render();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = JSON.stringify(this.board);

    this.board = this.transpose(this.board);

    for (let r = 0; r < 4; r++) {
      this.board[r].reverse();
      this.board[r] = this.moveRowLeft(this.board[r]);
      this.board[r].reverse();
    }

    this.board = this.transpose(this.board);

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
    }

    this.checkWin();
    this.checkLose();
    this.render();
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
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'playing';

    document.querySelector('.message-start').classList.add('hidden');
    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-lose').classList.add('hidden');

    this.addRandomTile(true);
    this.addRandomTile(true);

    this.render();
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

    this.score = 0;
    this.status = 'idle';

    document.querySelector('.message-start').classList.add('hidden');
    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-lose').classList.add('hidden');

    this.render();
  }

  render() {
    const state = this.board.flat();
    const cells = document.getElementsByClassName('field-cell');

    state.forEach((item, index) => {
      const cell = cells[index];

      cell.className = 'field-cell';

      if (item === 0) {
        cell.textContent = '';
      } else {
        cell.textContent = item;
        cell.classList.add(`field-cell--${item}`);
      }
    });

    document.querySelector('.game-score').textContent = this.score;

    const winMessage = document.querySelector('.message-win');
    const loseMessage = document.querySelector('.message-lose');

    if (this.status === 'win') {
      winMessage.classList.remove('hidden');
    }

    if (this.status === 'lose') {
      loseMessage.classList.remove('hidden');
    }
  }

  addRandomTile(isStart = false) {
    const empty = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          empty.push({ r, c });
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const random = empty[Math.floor(Math.random() * empty.length)];

    if (isStart) {
      this.board[random.r][random.c] = 2;
    } else {
      this.board[random.r][random.c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveRowLeft(originalRow) {
    let row = originalRow.filter((num) => num !== 0);

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;

        this.score += row[i];
        row[i + 1] = 0;
      }
    }

    row = row.filter((num) => num !== 0);

    while (row.length < 4) {
      row.push(0);
    }

    return row;
  }

  transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map((row) => row[i]));
  }

  checkWin() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';
      }
    }
  }

  checkLose() {
    if (this.board.flat().includes(0)) {
      return;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          return;
        }
      }
    }

    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 3; r++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
