'use strict';

class Game {
  constructor(initialState) {
    this.board = initialState || this.generateEmptyBoard();
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
    this.firstMove = true;
    this.moved = false;
  }

  generateEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  moveLeft() {
    this.handleFirstMove();

    const originalBoard = JSON.parse(JSON.stringify(this.board));
    const newBoard = this.move(originalBoard);

    if (this.isBoardChanged(this.board, newBoard)) {
      this.board = newBoard;
      this.addRandomCell();
      this.checkWin();
      this.checkGameOver();
      this.moved = true;
    } else {
      this.moved = false;
    }
  }

  moveRight() {
    this.handleFirstMove();

    const reversedBoard = this.board.map((row) => row.reverse());
    const newBoard = this.move(reversedBoard).map((row) => row.reverse());

    if (this.isBoardChanged(this.board, newBoard)) {
      this.board = newBoard;
      this.addRandomCell();
      this.checkWin();
      this.checkGameOver();
      this.moved = true;
    } else {
      this.moved = false;
    }
  }

  moveUp() {
    this.handleFirstMove();

    const transposedBoard = this.transpose(this.board);
    const newBoard = this.move(transposedBoard);
    const finalBoard = this.transpose(newBoard);

    if (this.isBoardChanged(this.board, finalBoard)) {
      this.board = finalBoard;
      this.addRandomCell();
      this.checkWin();
      this.checkGameOver();
      this.moved = true;
    } else {
      this.moved = false;
    }
  }

  moveDown() {
    this.handleFirstMove();

    const transposedBoard = this.transpose(this.board);
    const reversedBoard = transposedBoard.map((row) => row.reverse());
    const newBoard = this.move(reversedBoard).map((row) => row.reverse());
    const finalBoard = this.transpose(newBoard);

    if (this.isBoardChanged(this.board, finalBoard)) {
      this.board = finalBoard;
      this.addRandomCell();
      this.checkWin();
      this.checkGameOver();
      this.moved = true;
    } else {
      this.moved = false;
    }
  }

  start() {
    this.status = 'playing';
    this.score = 0;
    this.board = this.generateEmptyBoard();
    this.firstMove = true;
    document.querySelector('.message-start').classList.add('hidden');
    this.addRandomCell();
    this.addRandomCell();
  }

  restart() {
    this.start();
  }

  addRandomCell() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.1 ? 4 : 2;

      this.board[row][col] = value;
      this.animateCell(row, col);
    }
  }

  handleFirstMove() {
    if (this.firstMove) {
      this.firstMove = false;

      const startButton = document.querySelector('.button.start');

      startButton.textContent = 'Restart';
      startButton.classList.add('restart');
    }
  }

  checkGameOver() {
    if (!this.hasAvailableMoves()) {
      this.status = 'lose';
      document.querySelector('.message-lose').classList.remove('hidden');
    }
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';
          document.querySelector('.message-win').classList.remove('hidden');

          return;
        }
      }
    }
  }

  hasAvailableMoves() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  move(board) {
    for (let row = 0; row < 4; row++) {
      const newRow = board[row].filter((cell) => cell !== 0);

      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2;
          this.score += newRow[col];
          newRow.splice(col + 1, 1);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }
      board[row] = newRow;
    }

    return board;
  }

  transpose(board) {
    return board[0].map((_, col) => board.map((row) => row[col]));
  }

  isBoardChanged(oldBoard, newBoard) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (oldBoard[row][col] !== newBoard[row][col]) {
          return true;
        }
      }
    }

    return false;
  }

  animateCell(row, col) {
    const cell = document.querySelector(
      `.field-row:nth-child(${row + 1}) .field-cell:nth-child(${col + 1})`,
    );

    cell.classList.add('new-cell');
    setTimeout(() => cell.classList.remove('new-cell'), 500);
  }
}

module.exports = Game;
