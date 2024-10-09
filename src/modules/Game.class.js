'use strict';

class Game {
  constructor(initialState = null) {
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.isGameOver = false;
    this.isWin = false;
  }

  createEmptyBoard() {
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
    if (this.isWin) {
      return 'Congratulations, you are winner!';
    }

    if (this.isGameOver) {
      return 'Game Over!';
    }

    if (this.checkGameOver()) {
      alert('Game Over! Ваші очки: ' + this.score);
    }

    return 'Playing';
  }
  start() {
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
    this.score = 0;
    this.isGameOver = false;
    this.isWin = false;
  }

  restart() {
    this.start();
  }

  combine(row) {
    let newRow = [...row];

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow[i + 1] = 0; // обнуляємо об'єднану плитку

        if (newRow[i] === 2048) {
          this.isWin = true;
        }
      }
    }
    newRow = newRow.filter((val) => val !== 0);

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  updateBoard() {
    const cells = document.querySelectorAll('.field-cell');

    cells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = this.board[row][col];

      cell.textContent = value === 0 ? '' : value;
      cell.className = `field-cell ${value === 0 ? '' : 'value-' + value}`;
    });
  }

  moveLeft() {
    this.board = this.board.map((row) => this.combine(row));
    this.addRandomTile();
    this.updateBoard();
  }

  moveRight() {
    // перевертаємо масив, щоб працювати з ним, так ніби ліворуч
    this.board = this.board.map((row) => this.combine(row.reverse()).reverse());
    this.addRandomTile();
    this.updateBoard();
  }

  moveUp() {
    this.board = this.transpose(this.board); // Міняємо рядки зі стовпцями
    this.board = this.board.map((row) => this.combine(row));
    this.board = this.transpose(this.board); // Міняємо рядки зі стовпцями
    this.addRandomTile();
    this.updateBoard();
  }

  moveDown() {
    this.board = this.transpose(this.board);
    this.board = this.board.map((row) => this.combine(row.reverse()).reverse());
    this.board = this.transpose(this.board);
    this.addRandomTile();
    this.updateBoard();
  }

  transpose(board) {
    const newBoard = [];

    for (let col = 0; col < board[0].length; col++) {
      const newElementRow = [];

      for (let row = 0; row < board.length; row++) {
        newElementRow.push(board[row][col]);
      }

      newBoard.push(newElementRow);
    }

    return newBoard;
  }

  checkGameOver() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
        // Перевіряємо сусідні клітинки для можливих комбінацій

        if (
          col < this.board[row].length - 1 &&
          this.board[row][col] === this.board[row][col + 1]
        ) {
          return false;
        }

        if (
          row < this.board.length - 1 &&
          this.board[row][col] === this.board[row + 1][col]
        ) {
          return false;
        }
      }
    }
    this.isGameOver = true;

    return true;
  }

  addRandomTile() {
    const emptyCells = [];

    this.board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) {
          emptyCells.push({ i, j });
        }
      });
    });

    if (emptyCells.length > 0) {
      const { i, j } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
    this.checkGameOver();
  }
}

module.exports = Game;
