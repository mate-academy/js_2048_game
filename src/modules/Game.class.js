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
    const oldBoard = JSON.stringify(this.board);

    for (let row = 0; row < 4; row++) {
      const currentRow = this.board[row];
      const newRow = this.slide(currentRow);

      this.board[row] = newRow;
    }

    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }
  moveRight() {
    const oldBoard = JSON.stringify(this.board);

    for (let row = 0; row < 4; row++) {
      const currentRow = this.board[row].slice().reverse();
      const newRow = this.slide(currentRow);

      this.board[row] = newRow.reverse();
    }

    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }
  moveUp() {
    const oldBoard = JSON.stringify(this.board);

    for (let col = 0; col < 4; col++) {
      const currentCol = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ];

      const newCol = this.slide(currentCol);

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newCol[row];
      }
    }

    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.checkGameStatus();
    }
  }
  moveDown() {
    const oldBoard = JSON.stringify(this.board);

    for (let col = 0; col < 4; col++) {
      const currentCol = [
        this.board[0][col],
        this.board[1][col],
        this.board[2][col],
        this.board[3][col],
      ];

      const reversedCol = currentCol.reverse();
      const newCol = this.slide(reversedCol);
      const finalCol = newCol.reverse();

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = finalCol[row];
      }
    }

    if (oldBoard !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.checkGameStatus();
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
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    emptyCells.sort(() => Math.random() - 0.5);

    const cell1 = emptyCells[0];
    const cell2 = emptyCells[1];

    this.board[cell1.row][cell1.col] = Math.random() < 0.9 ? 2 : 4;
    this.board[cell2.row][cell2.col] = Math.random() < 0.9 ? 2 : 4;

    return (this.status = 'playing');
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
    this.start();
  }

  // Add your own methods here
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

    this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
  }
  slide(row) {
    let filtered = row.filter((num) => num !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        filtered[i + 1] = 0;
        this.score += filtered[i];
      }
    }

    filtered = filtered.filter((num) => num !== 0);

    while (filtered.length < 4) {
      filtered.push(0);
    }

    return filtered;
  }

  checkGameStatus() {
    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.checkLose()) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.board[row][col] === this.board[row][col + 1]) {
          return false;
        }
      }
    }

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (this.board[row][col] === this.board[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }
}

export default Game;
