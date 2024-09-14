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
  ) {
    this.board = initialState;
    this.gameScore = 0;
    this.status = 'idle';
  }

  moveLeft() {
    let movedLeft = false;

    for (let row = 0; row < this.board.length; row++) {
      let newRow = this.board[row].filter((value) => value !== 0);

      const mergedRow = [];

      for (let i = 0; i < newRow.length; i++) {
        if (i < newRow.length - 1 && newRow[i] === newRow[i + 1]) {
          mergedRow.push(newRow[i] * 2);
          this.gameScore += newRow[i] * 2;
          newRow[i + 1] = 0;
          movedLeft = true;
        } else if (newRow[i] !== 0) {
          mergedRow.push(newRow[i]);
        }
      }

      newRow = mergedRow.filter((value) => value !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (!this.arraysEqual(this.board[row], newRow)) {
        this.board[row] = newRow;
        movedLeft = true;
      }
    }

    if (movedLeft) {
      this.addRandomTile();
      this.render();
      this.updateStatus();
    }
  }

  moveRight() {
    let movedRight = false;

    for (let row = 0; row < this.board.length; row++) {
      let newRow = this.board[row].filter((value) => value !== 0);
      const mergedRow = [];

      for (let i = newRow.length - 1; i >= 0; i--) {
        if (i > 0 && newRow[i] === newRow[i - 1]) {
          mergedRow.unshift(newRow[i] * 2);
          this.gameScore += newRow[i] * 2;
          newRow[i - 1] = 0;
          movedRight = true;
        } else if (newRow[i] !== 0) {
          mergedRow.unshift(newRow[i]);
        }
      }
      newRow = mergedRow.filter((value) => value !== 0);

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      if (!this.arraysEqual(this.board[row], newRow)) {
        this.board[row] = newRow;
        movedRight = true;
      }
    }

    if (movedRight) {
      this.addRandomTile();
      this.render();
      this.updateStatus();
    }
  }

  moveUp() {
    let movedUp = false;

    for (let col = 0; col < 4; col++) {
      let newCol = [];

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      const mergedCol = [];

      for (let i = 0; i < newCol.length; i++) {
        if (i < newCol.length - 1 && newCol[i] === newCol[i + 1]) {
          mergedCol.push(newCol[i] * 2);
          this.gameScore += newCol[i] * 2;
          newCol[i + 1] = 0;
          movedUp = true;
        } else if (newCol[i] !== 0) {
          mergedCol.push(newCol[i]);
        }
      }
      newCol = mergedCol.filter((value) => value !== 0);

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newCol[row]) {
          this.board[row][col] = newCol[row];
          movedUp = true;
        }
      }
    }

    if (movedUp) {
      this.addRandomTile();
      this.render();
      this.updateStatus();
    }
  }

  moveDown() {
    let movedDown = false;

    for (let col = 0; col < 4; col++) {
      let newCol = [];

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      const mergedCol = [];

      for (let i = newCol.length - 1; i >= 0; i--) {
        if (i > 0 && newCol[i] === newCol[i - 1]) {
          mergedCol.unshift(newCol[i] * 2);
          this.gameScore += newCol[i] * 2;
          newCol[i - 1] = 0;
          movedDown = true;
        } else if (newCol[i] !== 0) {
          mergedCol.unshift(newCol[i]);
        }
      }
      newCol = mergedCol.filter((value) => value !== 0);

      while (newCol.length < 4) {
        newCol.unshift(0);
      }

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newCol[row]) {
          this.board[row][col] = newCol[row];
          movedDown = true;
        }
      }
    }

    if (movedDown) {
      this.addRandomTile();
      this.render();
      this.updateStatus();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.gameScore;
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

    const loseMessage = document.querySelector('.message-lose');
    const winMessage = document.querySelector('.message-win');
    const startMessage = document.querySelector('.message-start');

    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');

    startMessage.classList.remove('hidden');

    this.status = 'playing';
    this.gameScore = 0;

    const btn = document.querySelector('button');

    btn.classList.remove('start');

    btn.classList.add('restart');

    btn.textContent = 'Restart';

    this.addRandomTile();
    this.addRandomTile();

    this.render();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  render() {
    const cells = document.querySelectorAll('.field-cell');
    let index = 0;

    for (const row of this.board) {
      for (const value of row) {
        const cell = cells[index];

        cell.textContent = value === 0 ? '' : value;
        cell.className = 'field-cell';

        if (value > 0) {
          cell.classList.add(`field-cell--${value}`);
        }
        index++;
      }
    }

    document.querySelector('.game-score').textContent = this.gameScore;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board.length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    const newValue = Math.random() < 0.9 ? 2 : 4;

    this.board[randomCell.row][randomCell.col] = newValue;
  }

  arraysEqual(arr1, arr2) {
    return (
      arr1.length === arr2.length &&
      arr1.every((value, index) => value === arr2[index])
    );
  }

  checkWin() {
    for (const row of this.board) {
      if (row.includes('2048')) {
        return true;
      }
    }

    return false;
  }

  checkLose() {
    for (const row of this.board) {
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          return false;
        }
      }
    }

    for (let col = 0; col < this.board.length; col++) {
      for (let row = 0; row < this.board.length - 1; row++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return false;
        }
      }
    }

    for (const row of this.board) {
      for (const cell of row) {
        if (cell === 0) {
          return false;
        }
      }
    }

    return true;
  }

  updateStatus() {
    const winMessage = document.querySelector('.message-win');
    const loseMessage = document.querySelector('.message-lose');
    const startMessage = document.querySelector('.message-start');

    if (this.checkWin()) {
      this.status = 'win';
      startMessage.classList.add('hidden');
      winMessage.classList.remove('hidden');
    } else if (this.checkLose()) {
      this.status = 'lose';
      startMessage.classList.add('hidden');
      loseMessage.classList.remove('hidden');
    }
  }
}

module.exports = Game;
