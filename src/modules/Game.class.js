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
    if (initialState) {
      this.initialBoard = JSON.parse(JSON.stringify(initialState));
    } else {
      this.initialBoard = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.board = JSON.parse(JSON.stringify(this.initialBoard));
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const randomCell = emptyCells[randomIndex];

      this.board[randomCell.r][randomCell.c] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  moveLeft() {
    this.makeMove('left');
  }

  moveRight() {
    this.makeMove('right');
  }

  moveUp() {
    this.makeMove('up');
  }

  moveDown() {
    this.makeMove('down');
  }

  makeMove(direction) {
    if (this.status !== 'playing' && this.status !== 'win') {
      return;
    }

    let moved = false;

    switch (direction) {
      case 'left':
        moved = this.executeLeft();
        break;
      case 'right':
        moved = this.executeRight();
        break;
      case 'up':
        moved = this.executeUp();
        break;
      case 'down':
        moved = this.executeDown();
        break;
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameState();
    }
  }

  executeLeft() {
    const boardBefore = JSON.stringify(this.board);

    for (let i = 0; i < this.board.length; i++) {
      this.board[i] = this.slide(this.board[i]);
    }

    return JSON.stringify(this.board) !== boardBefore;
  }

  executeRight() {
    const boardBefore = JSON.stringify(this.board);

    for (let i = 0; i < this.board.length; i++) {
      this.board[i].reverse();
      this.board[i] = this.slide(this.board[i]);
      this.board[i].reverse();
    }

    return JSON.stringify(this.board) !== boardBefore;
  }

  executeUp() {
    const boardBefore = JSON.stringify(this.board);

    for (let c = 0; c < 4; c++) {
      const column = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];
      const slidColumn = this.slide(column);

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = slidColumn[r];
      }
    }

    return JSON.stringify(this.board) !== boardBefore;
  }

  executeDown() {
    const boardBefore = JSON.stringify(this.board);

    for (let c = 0; c < 4; c++) {
      const column = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      column.reverse();

      const slidColumn = this.slide(column);

      slidColumn.reverse();

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = slidColumn[r];
      }
    }

    return JSON.stringify(this.board) !== boardBefore;
  }

  slide(row) {
    let filteredRow = row.filter((num) => num > 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        this.score += filteredRow[i];
        filteredRow[i + 1] = 0;
      }
    }
    filteredRow = filteredRow.filter((num) => num > 0);

    while (filteredRow.length < 4) {
      filteredRow.push(0);
    }

    return filteredRow;
  }

  canMove() {
    if (this.board.flat().includes(0)) {
      return true;
    }

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        const current = this.board[r][c];
        const canMoveRight =
          c < this.board.length - 1 && current === this.board[r][c + 1];
        const canMoveDown =
          r < this.board.length - 1 && current === this.board[r + 1][c];

        if (canMoveDown || canMoveRight) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameState() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return JSON.parse(JSON.stringify(this.board));
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialBoard));
    this.score = 0;
    this.status = 'idle';
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Game;
}

if (typeof window !== 'undefined') {
  window.Game = Game;
}
