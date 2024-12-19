'use strict';

class Game {
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

  renderBoard() {
    const cells = document.querySelectorAll('.field-cell');
    const flattenedBoard = this.board.flat();

    cells.forEach((cell, index) => {
      const value = flattenedBoard[index];

      cell.textContent = value === 0 ? '' : value;

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.classList = 'field-cell';
      }
    });
  }

  canMove() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (col > 0 && this.board[row][col] === this.board[row][col - 1]) {
          return true;
        }

        if (
          col < this.board[row].length - 1 &&
          this.board[row][col] === this.board[row][col + 1]
        ) {
          return true;
        }

        if (row > 0 && this.board[row][col] === this.board[row - 1][col]) {
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
    this.lose();

    return false;
  }

  moveLeft() {
    if (!this.canMove()) {
      return;
    }

    const copyBoard = this.board.map((row) => row.slice());

    for (let row = 0; row < this.board.length; row++) {
      const compacted = this.board[row].filter((cell) => cell !== 0);

      for (let i = 0; i < compacted.length - 1; i++) {
        if (compacted[i] === compacted[i + 1]) {
          compacted[i] *= 2;
          this.score += compacted[i];
          compacted[i + 1] = 0;
        }
      }

      const newRow = compacted.filter((cell) => cell !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      this.board[row] = newRow;

      if (newRow.includes(2048)) {
        this.status = 'win';
        this.displayWinMessage();

        return;
      }
    }

    if (!this.boardsAreEqual(copyBoard, this.board)) {
      this.addRandomTile();
    }

    this.updateScore();
    this.renderBoard();
  }

  moveRight() {
    if (!this.canMove()) {
      return;
    }

    const copyBoard = this.board.map((row) => row.slice());

    for (let row = 0; row < this.board.length; row++) {
      const compacted = this.board[row].filter((cell) => cell !== 0).reverse();

      for (let i = 0; i < compacted.length - 1; i++) {
        if (compacted[i] === compacted[i + 1]) {
          compacted[i] *= 2;
          this.score += compacted[i];
          compacted[i + 1] = 0;
        }
      }

      const newRow = compacted.filter((cell) => cell !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      this.board[row] = newRow.reverse();

      if (newRow.includes(2048)) {
        this.status = 'win';
        this.displayWinMessage();

        return;
      }
    }

    if (!this.boardsAreEqual(copyBoard, this.board)) {
      this.addRandomTile();
    }

    this.updateScore();
    this.renderBoard();
  }

  moveUp() {
    if (!this.canMove()) {
      return;
    }

    const copyBoard = this.board.map((row) => row.slice());

    for (let col = 0; col < this.board[0].length; col++) {
      const column = [];

      for (let row = 0; row < this.board.length; row++) {
        column.push(this.board[row][col]);
      }

      const compacted = column.filter((cell) => cell !== 0);

      for (let i = 0; i < compacted.length - 1; i++) {
        if (compacted[i] === compacted[i + 1]) {
          compacted[i] *= 2;
          this.score += compacted[i];
          compacted[i + 1] = 0;
        }
      }

      const newColumn = compacted.filter((cell) => cell !== 0);

      while (newColumn.length < 4) {
        newColumn.push(0);
      }

      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = newColumn[row];
      }

      if (newColumn.includes(2048)) {
        this.status = 'win';
        this.displayWinMessage();

        return;
      }
    }

    if (!this.boardsAreEqual(copyBoard, this.board)) {
      this.addRandomTile();
    }

    this.updateScore();
    this.renderBoard();
  }

  moveDown() {
    if (!this.canMove()) {
      return;
    }

    const copyBoard = this.board.map((row) => row.slice());

    for (let col = 0; col < this.board[0].length; col++) {
      const column = [];

      for (let row = 0; row < this.board.length; row++) {
        column.push(this.board[row][col]);
      }

      column.reverse();

      const compacted = column.filter((cell) => cell !== 0);

      for (let i = 0; i < compacted.length - 1; i++) {
        if (compacted[i] === compacted[i + 1]) {
          compacted[i] *= 2;
          this.score += compacted[i];
          compacted[i + 1] = 0;
        }
      }

      const newColumn = compacted.filter((cell) => cell !== 0);

      while (newColumn.length < 4) {
        newColumn.push(0);
      }

      newColumn.reverse();

      for (let row = 0; row < this.board.length; row++) {
        this.board[row][col] = newColumn[row];
      }

      if (newColumn.includes(2048)) {
        this.status = 'win';
        this.displayWinMessage();

        return;
      }
    }

    if (!this.boardsAreEqual(copyBoard, this.board)) {
      this.addRandomTile();
    }

    this.updateScore();
    this.renderBoard();
  }

  boardsAreEqual(board1, board2) {
    if (board1.length !== board2.length) {
      return false;
    }

    for (let row = 0; row < board1.length; row++) {
      for (let col = 0; col < board1[row].length; col++) {
        if (board1[row][col] !== board2[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  getScore() {
    return this.score;
  }

  updateScore() {
    const scoreElement = document.querySelector('.game-score');

    scoreElement.textContent = this.score;
  }

  getState() {
    return {
      board: this.board,
      score: this.score,
      status: this.status,
    };
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.updateScore();
    this.renderBoard();
  }

  resetBoard() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
  }

  addRandomTile() {
    const emptyCell = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
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
      this.score += newTile;
    }
  }

  restart() {
    this.status = 'idle';
    this.resetBoard();
    this.score = 0;
    this.updateScore();
    this.renderBoard();
  }

  lose() {
    this.status = 'lose';
    document.querySelector('.message-restart').classList.add('hidden');
    document.querySelector('.message-start').classList.add('hidden');
    document.querySelector('.message-lose').classList.remove('hidden');
  }

  displayWinMessage() {
    const winMessage = document.querySelector('.message-win');

    document.querySelector('.message-restart').classList.add('hidden');
    document.querySelector('.message-start').classList.add('hidden');
    winMessage.classList.remove('hidden');
  }
}

module.exports = Game;
window.Game = Game;
