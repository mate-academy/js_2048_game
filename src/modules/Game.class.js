'use strict';

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
    this.initialBoard = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.board = this.initialBoard.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = this.board.map((row) => [...row]);
    let moved = false;
    let scoreIncrease = 0;

    for (let row = 0; row < 4; row++) {
      const newRow = this.board[row].filter((val) => val !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      const mergedRow = [...newRow];

      for (let col = 0; col < 3; col++) {
        if (mergedRow[col] !== 0 && mergedRow[col] === mergedRow[col + 1]) {
          mergedRow[col] *= 2;
          scoreIncrease += mergedRow[col];
          mergedRow[col + 1] = 0;
        }
      }

      const finalRow = mergedRow.filter((val) => val !== 0);

      while (finalRow.length < 4) {
        finalRow.push(0);
      }

      this.board[row] = finalRow;
    }

    moved = this.boardChanged(previousBoard, this.board);

    if (moved) {
      this.score += scoreIncrease;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = this.board.map((row) => [...row]);
    let moved = false;
    let scoreIncrease = 0;

    for (let row = 0; row < 4; row++) {
      const newRow = this.board[row].filter((val) => val !== 0);

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      const mergedRow = [...newRow];

      for (let col = 3; col > 0; col--) {
        if (mergedRow[col] !== 0 && mergedRow[col] === mergedRow[col - 1]) {
          mergedRow[col] *= 2;
          scoreIncrease += mergedRow[col];
          mergedRow[col - 1] = 0;
        }
      }

      const finalRow = mergedRow.filter((val) => val !== 0);

      while (finalRow.length < 4) {
        finalRow.unshift(0);
      }

      this.board[row] = finalRow;
    }

    moved = this.boardChanged(previousBoard, this.board);

    if (moved) {
      this.score += scoreIncrease;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = this.board.map((row) => [...row]);
    let moved = false;
    let scoreIncrease = 0;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const newColumn = column.filter((val) => val !== 0);

      while (newColumn.length < 4) {
        newColumn.push(0);
      }

      const mergedColumn = [...newColumn];

      for (let row = 0; row < 3; row++) {
        if (
          mergedColumn[row] !== 0 &&
          mergedColumn[row] === mergedColumn[row + 1]
        ) {
          mergedColumn[row] *= 2;
          scoreIncrease += mergedColumn[row];
          mergedColumn[row + 1] = 0;
        }
      }

      const finalColumn = mergedColumn.filter((val) => val !== 0);

      while (finalColumn.length < 4) {
        finalColumn.push(0);
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = finalColumn[row];
      }
    }

    moved = this.boardChanged(previousBoard, this.board);

    if (moved) {
      this.score += scoreIncrease;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const previousBoard = this.board.map((row) => [...row]);
    let moved = false;
    let scoreIncrease = 0;

    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      const newColumn = column.filter((val) => val !== 0);

      while (newColumn.length < 4) {
        newColumn.unshift(0);
      }

      const mergedColumn = [...newColumn];

      for (let row = 3; row > 0; row--) {
        if (
          mergedColumn[row] !== 0 &&
          mergedColumn[row] === mergedColumn[row - 1]
        ) {
          mergedColumn[row] *= 2;
          scoreIncrease += mergedColumn[row];
          mergedColumn[row - 1] = 0;
        }
      }

      const finalColumn = mergedColumn.filter((val) => val !== 0);

      while (finalColumn.length < 4) {
        finalColumn.unshift(0);
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = finalColumn[row];
      }
    }

    moved = this.boardChanged(previousBoard, this.board);

    if (moved) {
      this.score += scoreIncrease;
      this.addRandomTile();
      this.updateStatus();
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
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.initialBoard.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let outerRow = 0; outerRow < 4; outerRow++) {
      for (let outerCol = 0; outerCol < 4; outerCol++) {
        if (this.board[outerRow][outerCol] === 0) {
          emptyCells.push({ row: outerRow, col: outerCol });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  boardChanged(oldBoard, newBoard) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (oldBoard[row][col] !== newBoard[row][col]) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (!this.hasAvailableMoves()) {
      this.status = 'lose';

      return;
    }

    this.status = 'playing';
  }

  hasAvailableMoves() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }
      }
    }

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
