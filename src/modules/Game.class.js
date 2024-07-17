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
    this.board = initialState
      || [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]];

    this.starting = false;
    this.table = document.querySelector('.game-field');
    this.score = 0;
    this.block = false;
  }

  copyBoard(board) {
    return board.map((bor) => bor.slice());
  }

  boardsAreEqual(board1, board2) {
    for (let i = 0; i < board1.length; i++) {
      for (let j = 0; j < board1[i].length; j++) {
        if (board1[i][j] !== board2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  checkForLoss() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }

        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return false;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }

  moveLeft() {
    if (this.starting && !this.block) {
      const prevBoard = this.copyBoard(this.board);

      this.board.forEach((row) => {
        const newRow = row.filter(item => item !== 0);

        for (let i = 0; i < newRow.length; i++) {
          if (newRow[i] === newRow[i + 1]) {
            const newValue = newRow[i] *= 2;

            newRow[i] = newValue;
            newRow.splice(i + 1, 1);

            this.score += newValue;
          }
        }

        while (newRow.length < row.length) {
          newRow.push(0);
        }

        row.splice(0, row.length, ...newRow);
      });

      const check = this.boardsAreEqual(prevBoard, this.board);

      if (!check) {
        this.spawn();
      }

      this.updateTable();
      this.getScore();
      this.getState();
    }
  }

  moveRight() {
    if (this.starting && !this.block) {
      const prevBoard = this.copyBoard(this.board);

      this.board.forEach((row) => {
        const newRow = row.filter(value => value !== 0);

        for (let i = newRow.length - 1; i > 0; i--) {
          if (newRow[i] === newRow[i - 1]) {
            const newValue = newRow[i] *= 2;

            newRow[i] = newValue;
            newRow.splice(i - 1, 1);

            this.score += newValue;
          }
        }

        while (newRow.length < row.length) {
          newRow.unshift(0);
        }

        row.splice(0, row.length, ...newRow);
      });

      const check = this.boardsAreEqual(prevBoard, this.board);

      if (!check) {
        this.spawn();
      }

      this.updateTable();
      this.getScore();
      this.getState();
    }
  }

  moveUp() {
    if (this.starting && !this.block) {
      const prevBoard = this.copyBoard(this.board);

      for (let col = 0; col < 4; col++) {
        const newRow = [];

        for (let row = 0; row < 4; row++) {
          const value = this.board[row][col];

          if (value > 0) {
            newRow.push(value);
          }
        }

        for (let i = 0; i < newRow.length; i++) {
          if (newRow[i] === newRow[i + 1]) {
            const newValue = newRow[i] *= 2;

            newRow[i] = newValue;
            newRow.splice(i + 1, 1);

            this.score += newValue;
          }
        }

        while (newRow.length < 4) {
          newRow.push(0);
        }

        for (let row = 0; row < 4; row++) {
          this.board[row][col] = newRow[row];
        }
      }

      const check = this.boardsAreEqual(prevBoard, this.board);

      if (!check) {
        this.spawn();
      }

      this.updateTable();
      this.getScore();
      this.getState();
    }
  }

  moveDown() {
    if (this.starting && !this.block) {
      const prevBoard = this.copyBoard(this.board);

      for (let col = 0; col < 4; col++) {
        const newRow = [];

        for (let row = 0; row < 4; row++) {
          const value = this.board[row][col];

          if (value > 0) {
            newRow.push(value);
          }
        }

        for (let i = newRow.length - 1; i > 0; i--) {
          if (newRow[i] === newRow[i - 1]) {
            const newValue = newRow[i] *= 2;

            newRow[i] = newValue;
            newRow.splice(i - 1, 1);

            this.score += newValue;
          }
        }

        while (newRow.length < 4) {
          newRow.unshift(0);
        }

        for (let row = 0; row < 4; row++) {
          this.board[row][col] = newRow[row];
        }
      }

      const check = this.boardsAreEqual(prevBoard, this.board);

      if (!check) {
        this.spawn();
      }

      this.updateTable();
      this.getScore();
      this.getState();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    const setScore = document.querySelector('.game-score');

    setScore.innerHTML = this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    this.board.forEach((row) => {
      row.forEach((column) => {
        if (column === 2048) {
          const message = document.querySelector('.message-win');

          message.classList.remove('hidden');
          this.block = true;
        }
      });
    });

    if (this.checkForLoss()) {
      const message = document.querySelector('.message-lose');

      message.classList.remove('hidden');
      this.block = true;
    } else {
      const message = document.querySelector('.message-lose');

      message.classList.add('hidden');
      this.block = false;
    }
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
    if (this.starting) {
      const message = document.querySelector('.message-start');
      const start = document.querySelector('.button');

      message.style.visibility = 'hidden';
      start.textContent = 'Restart';
      start.classList.remove('start');
      start.classList.add('restart');
    } else {
      const message = document.querySelector('.message-start');
      const start = document.querySelector('.button');

      message.style.visibility = 'visible';
      start.classList.remove('restart');
      start.classList.add('start');
      start.textContent = 'Start';
    }
  }

  random() {
    const array = Array.from({ length: 16 }, (_, i) => i);
    const shuffled = array.sort(() => 0.5 - Math.random());

    return shuffled.slice(0, 2);
  }

  /**
   * Starts the game.
   */
  start() {
    if (!this.starting) {
      const randomNumbers = this.random();

      this.board.map((item, index) => {
        item.map((item2, index2) => {
          const currentIndex = index * 4 + index2;

          if (randomNumbers.includes(currentIndex)) {
            this.board[index][index2] = Math.random() > 0.1 ? 2 : 4;
          }
        });
      });

      this.starting = true;
      this.updateTable();
      this.getStatus();
    } else {
      this.restart();
    }
  }

  updateTable() {
    const rows = document.querySelectorAll('.field-row');

    this.board.forEach((row, rowIndex) => {
      if (rows[rowIndex]) {
        row.forEach((cell, colIndex) => {
          const cellElement = rows[rowIndex].children[colIndex];

          if (cellElement && cell > 0) {
            cellElement.textContent = cell;

            for (let i = 1; i < 2048; i *= 2) {
              cellElement.classList.remove(`field-cell--${i}`);
            }
            cellElement.classList.add(`field-cell`, `field-cell--${cell}`);
          } else {
            cellElement.textContent = '';

            for (let i = 1; i <= 2048; i *= 2) {
              cellElement.classList.remove(`field-cell--${i}`);
            }
          }
        });
      }
    });
  }

  /**
   * Resets the game.
   */
  restart() {
    const rows = document.querySelectorAll('.field-row');

    this.board
      = [[0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]];

    this.starting = false;
    this.getStatus();
    this.score = 0;
    this.getScore();
    this.getState();

    this.board.forEach((row, index) => {
      row.forEach((cell, index2) => {
        const cellElement = rows[index].children[index2];

        cellElement.innerHTML = '';

        for (let i = 1; i <= 2048; i *= 2) {
          cellElement.classList.remove(`field-cell--${i}`);
        }
      });
    });

    const message = document.querySelector('.message-win');

    message.classList.add('hidden');
    this.block = false;
  }

  spawn() {
    const emptyCells = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          emptyCells.push({
            rowIndex, cellIndex,
          });
        }
      });
    });

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { rowIndex, cellIndex } = emptyCells[randomIndex];

      this.board[rowIndex][cellIndex] = Math.random() > 0.1 ? 2 : 4;

      this.updateTable();
    }
  }
}

module.exports = Game;
