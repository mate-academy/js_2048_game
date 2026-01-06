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
    this.size = 4;
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';

    if (initialState) {
      this.board = initialState.board;
      this.score = initialState.score || 0;
      this.status = initialState.status || 'playing';
    } else {
      this.board = this.createEmptyBoard();
    }
  }

  compressRow(row) {
    const newRow = [];

    for (let i = 0; i < row.length; i++) {
      if (row[i] !== 0) {
        newRow.push(row[i]);
      }
    }

    if (newRow.length < this.size) {
      for (let i = newRow.length; i < this.size; i++) {
        newRow.push(0);
      }
    }

    return newRow;
  }

  mergeRow(row) {
    const merged = [];

    for (let i = 0; i < row.length; i++) {
      if (row[i] === row[i + 1]) {
        merged.push(row[i] * 2);
        this.score += row[i] * 2;
        i++;
      } else {
        merged.push(row[i]);
      }
    }

    return merged;
  }

  moveRowLeft(row) {
    const compressed = this.compressRow(row);
    const withoutZerosMerged = this.mergeRow(compressed);
    const finalRow = this.compressRow(withoutZerosMerged);

    return finalRow;
  }

  moveRowRight(row) {
    const finalRow = this.moveRowLeft(row.slice().reverse());

    return finalRow.slice().reverse();
  }

  getColumn(colIndex) {
    const column = [];

    for (let i = 0; i < this.board.length; i++) {
      column.push(this.board[i][colIndex]);
    }

    return column;
  }

  setColumn(colIndex, newColumn) {
    for (let i = 0; i < this.size; i++) {
      this.board[i][colIndex] = newColumn[i];
    }
  }

  moveLeft() {
    const newBoard = [];

    for (let i = 0; i < this.board.length; i++) {
      newBoard.push(this.moveRowLeft(this.board[i]));
    }

    if (JSON.stringify(newBoard) !== JSON.stringify(this.board)) {
      this.board = newBoard;
      this.afterMove();
    }
  }
  moveRight() {
    const newBoard = [];

    for (let i = 0; i < this.board.length; i++) {
      newBoard.push(this.moveRowRight(this.board[i]));
    }

    if (JSON.stringify(newBoard) !== JSON.stringify(this.board)) {
      this.board = newBoard;
      this.afterMove();
    }
  }
  moveUp() {
    const oldBoard = JSON.stringify(this.board);

    for (let i = 0; i < this.size; i++) {
      const col = this.getColumn(i);
      const moved = this.moveRowLeft(col);

      this.setColumn(i, moved);
    }

    if (oldBoard !== JSON.stringify(this.board)) {
      this.afterMove();
    }
  }
  moveDown() {
    const oldBoard = JSON.stringify(this.board);

    for (let i = 0; i < this.size; i++) {
      const col = this.getColumn(i);
      const reversedCol = col.slice().reverse();
      const moved = this.moveRowLeft(reversedCol);
      const finalCol = moved.slice().reverse();

      this.setColumn(i, finalCol);
    }

    if (oldBoard !== JSON.stringify(this.board)) {
      this.afterMove();
    }
  }

  checkWin() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  afterMove() {
    this.checkWin();
    this.addRandomTile();
    this.checkLose();
  }

  hasAvailableMoves() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return true;
        } else if (
          (row < this.size - 1 &&
            this.board[row][col] === this.board[row + 1][col]) ||
          (col < this.size - 1 &&
            this.board[row][col] === this.board[row][col + 1])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
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
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return 0;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cell = emptyCells[randomIndex];
    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[cell.row][cell.col] = value;
  }
}

module.exports = Game;
