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
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.size = 4;
    this.status = 'idle';
    this.score = 0;

    // eslint-disable-next-line no-console
    console.log(this.board);
  }

  moveLeft() {
    const oldBoard = this.board.map((row) => row.slice());

    if (this.checkMove() === false) {
      this.status = 'lose';
      this.gameOverMessage();
    }

    // for (let row = 0; row < this.board.length; row++) {
    //   let currentRow = this.board[row].filter((num) => num !== 0);

    //   for (let i = 0; i < currentRow.length - 1; i++) {
    //     if (currentRow[i] === currentRow[i + 1]) {
    //       currentRow[i] += currentRow[i + 1];
    //       this.score += currentRow[i];
    //       currentRow[i + 1] = 0;
    //       i++;
    //     }
    //   }

    //   currentRow = currentRow.filter((num) => num !== 0);

    //   while (currentRow.length < this.size) {
    //     currentRow.push(0);
    //   }

    //   this.board[row] = currentRow;
    // }

    for (let row = 0; row < this.board.length; row++) {
      this.board[row] = this.mergeX(this.board[row]);
    }

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.addRandomTile();
    }

    this.updateScore();
    this.renderBoard(this.board);

    this.checkWin();
  }

  moveRight() {
    const oldBoard = this.board.map((row) => row.slice());

    if (this.checkMove() === false) {
      this.status = 'lose';
      this.gameOverMessage();
    }

    // for (let row = 0; row < this.board.length; row++) {
    //   const reverseRow = this.board[row].slice().reverse();
    //   let currentRow = reverseRow.filter((num) => num !== 0);

    //   for (let i = 0; i < currentRow.length - 1; i++) {
    //     if (currentRow[i] === currentRow[i + 1]) {
    //       currentRow[i] += currentRow[i + 1];
    //       this.score += currentRow[i];
    //       currentRow[i + 1] = 0;
    //       i++;
    //     }
    //   }

    //   currentRow = currentRow.filter((num) => num !== 0);

    //   while (currentRow.length < this.size) {
    //     currentRow.push(0);
    //   }

    //   this.board[row] = currentRow.reverse();
    // }

    for (let row = 0; row < this.board.length; row++) {
      this.board[row] = this.mergeX(this.board[row], true);
    }

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.addRandomTile();
    }

    this.updateScore();
    this.renderBoard(this.board);

    this.checkWin();
  }

  moveUp() {
    const oldBoard = this.board.map((row) => row.slice());

    if (this.checkMove() === false) {
      this.status = 'lose';
      this.gameOverMessage();
    }

    // for (let col = 0; col < this.board.length; col++) {
    //   let column = [];

    //   for (let row = 0; row < this.board.length; row++) {
    //     column.push(this.board[row][col]);
    //   }

    //   for (let i = 0; i < column.length - 1; i++) {
    //     if (column[i] === column[i + 1]) {
    //       column[i] += column[i + 1];
    //       this.score += column[i];
    //       column[i + 1] = 0;
    //       i++;
    //     }
    //   }

    //   column = column.filter((num) => num !== 0);

    //   while (column.length < this.size) {
    //     column.push(0);
    //   }

    //   for (let row = 0; row < this.size; row++) {
    //     this.board[row][col] = column[row];
    //   }
    // }

    this.mergeY(false);

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.addRandomTile();
    }

    this.updateScore();
    this.renderBoard(this.board);

    this.checkWin();
  }

  moveDown() {
    const oldBoard = this.board.map((row) => row.slice());

    if (this.checkMove() === false) {
      this.status = 'lose';
      this.gameOverMessage();
    }

    // for (let col = 0; col < this.board.length; col++) {
    //   let column = [];

    //   for (let row = 0; row < this.board.length; row++) {
    //     column.push(this.board[row][col]);
    //   }

    //   column = column.reverse();

    //   for (let i = 0; i < column.length - 1; i++) {
    //     if (column[i] === column[i + 1]) {
    //       column[i] += column[i + 1];
    //       this.score += column[i];
    //       column[i + 1] = 0;
    //       i++;
    //     }
    //   }

    //   column = column.filter((num) => num !== 0);

    //   while (column.length < this.size) {
    //     column.push(0);
    //   }

    //   column = column.reverse();

    //   for (let row = 0; row < this.size; row++) {
    //     this.board[row][col] = column[row];
    //   }
    // }

    this.mergeY(true);

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.addRandomTile();
    }

    this.updateScore();
    this.renderBoard(this.board);

    this.checkWin();
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
    this.renderBoard(this.board);
    this.addRandomTile();
    this.addRandomTile();
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

    this.status = 'playing';
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  mergeY(reverse = false) {
    for (let col = 0; col < this.board.length; col++) {
      let column = [];

      for (let row = 0; row < this.board.length; row++) {
        column.push(this.board[row][col]);
      }

      if (reverse) {
        column.reverse();
      }

      column = column.filter((num) => num !== 0);

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] += column[i + 1];
          this.score += column[i];
          column[i + 1] = 0;
          i++;
        }
      }

      column = column.filter((num) => num !== 0);

      while (column.length < this.size) {
        column.push(0);
      }

      if (reverse) {
        column.reverse();
      }

      for (let row = 0; row < this.size; row++) {
        this.board[row][col] = column[row];
      }
    }
  }

  mergeX(arr, reverse = false) {
    let result = reverse ? arr.slice().reverse() : arr.slice();

    result = result.filter((num) => num !== 0);

    for (let i = 0; i < result.length - 1; i++) {
      if (result[i] === result[i + 1]) {
        result[i] += result[i + 1];
        this.score += result[i];
        result[i + 1] = 0;
        i++;
      }
    }

    result = result.filter((num) => num !== 0);

    while (result.length < this.size) {
      result.push(0);
    }

    if (reverse) {
      result.reverse();
    }

    return result;
  }

  renderBoard(state) {
    const cells = document.querySelectorAll('.field-cell');

    for (let row = 0; row < state.length; row++) {
      for (let col = 0; col < state[row].length; col++) {
        const index = row * 4 + col;
        const cell = cells[index];
        const value = state[row][col];

        cell.textContent = value === 0 ? '' : value;
        cell.className = 'field-cell';

        if (value > 0) {
          cell.classList.add(`field-cell--${value}`);
        } else {
          cell.classList = 'field-cell';
        }
      }
    }
  }

  updateScore() {
    const scoreEl = document.querySelector('.game-score');

    scoreEl.textContent = this.score;
  }

  createEmptyBoard() {
    const board = [];

    for (let i = 0; i < this.size; i++) {
      board.push([0, 0, 0, 0]);
    }

    return board;
  }

  addRandomTile() {
    const emptyCell = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCell.push({ row, col });
        }
      }
    }

    if (emptyCell.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCell.length);
      const { row, col } = emptyCell[randomIndex];
      const newTile = Math.random() < 0.9 ? 2 : 4;

      this.board[row][col] = newTile;
    }
  }

  boardsAreEqual(board1, board2) {
    for (let row = 0; row < board1.length; row++) {
      for (let col = 0; col < board1[row].length; col++) {
        if (board1[row][col] !== board2[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  checkWin() {
    for (const row of this.board) {
      for (const cell of row) {
        if (cell === 2048) {
          this.status = 'win';
          this.winMessage();

          return;
        }
      }
    }
  }

  winMessage() {
    document.querySelector('.message-win').classList.remove('hidden');
  }

  checkMove() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (
          col < this.board[row].length - 1 &&
          this.board[row][col] === this.board[row][col + 1]
        ) {
          return true;
        }

        if (
          row < this.board.length - 1 &&
          this.board[row][col] === this.board[row + 1][col]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  gameOverMessage() {
    document.querySelector('.message-lose').classList.remove('hidden');
  }
}

module.exports = Game;
