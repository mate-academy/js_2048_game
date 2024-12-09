'use strict';

class Game {
  constructor(size = 4) {
    this.size = size;
    this.board = this.createBoard();
    this.score = 0;
    // this.start();
  }

  createBoard() {
    return Array(this.size)
      .fill()
      .map(() => Array(this.size).fill(0));
  }

  addTile() {
    const emptyTiles = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyTiles.push({ row, col });
        }
      }
    }

    if (emptyTiles.length > 0) {
      const { row, col } =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.size; row++) {
      let newRow = this.board[row].filter((val) => val);

      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2;
          this.score += newRow[col];
          newRow[col + 1] = 0;
          moved = true;
        }
      }
      newRow = newRow.filter((val) => val);

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      if (!moved) {
        moved = this.board[row].toString() !== newRow.toString();
      }
      this.board[row] = newRow;
    }

    return moved;
  }

  moveRight() {
    this.board = this.board.map((row) => row.reverse());

    const moved = this.moveLeft();

    this.board = this.board.map((row) => row.reverse());

    return moved;
  }

  moveUp() {
    this.transpose();

    const moved = this.moveLeft();

    this.transpose();

    return moved;
  }

  moveDown() {
    this.transpose();

    const moved = this.moveRight();

    this.transpose();

    return moved;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    if (this.checkWin()) {
      return 'win';
    }

    if (this.isGameOver()) {
      return 'lose';
    }

    return 'playing';
  }

  start() {
    this.board = this.createBoard();
    this.score = 0;
    this.status = 'playing';

    this.addTile();
    this.addTile();

    this.updateBoard();

    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-lose').classList.add('hidden');
    document.querySelector('.message-start').classList.add('hidden');

    document.querySelector('.start').textContent = 'Restart';
  }

  restart() {
    this.board = this.createBoard();
    this.score = 0;
    this.addTile();
    this.addTile();
    this.updateBoard();
    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-lose').classList.add('hidden');
  }

  updateBoard() {
    const cells = document.querySelectorAll('.field-cell');
    let i = 0;

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        cells[i].textContent =
          this.board[row][col] !== 0 ? this.board[row][col] : '';
        cells[i].className = 'field-cell';

        if (this.board[row][col] !== 0) {
          cells[i].classList.add(`field-cell--${this.board[row][col]}`);
        }
        i++;
      }
    }
    document.querySelector('.game-score').textContent = this.score;
  }

  transpose() {
    this.board = this.board[0].map((_, colIndex) =>
      this.board.map((row) => row[colIndex]),);
  }

  checkWin() {
    return this.board.some((row) => row.includes(2048));
  }

  isGameOver() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }

        if (
          col < this.size - 1 &&
          this.board[row][col] === this.board[row][col + 1]
        ) {
          return false;
        }

        if (
          row < this.size - 1 &&
          this.board[row][col] === this.board[row + 1][col]
        ) {
          return false;
        }
      }
    }

    return true;
  }

  move(direction) {
    let moved = false;

    switch (direction) {
      case 'ArrowLeft':
        moved = this.moveLeft();
        break;
      case 'ArrowRight':
        moved = this.moveRight();
        break;
      case 'ArrowUp':
        moved = this.moveUp();
        break;
      case 'ArrowDown':
        moved = this.moveDown();
        break;
    }

    if (moved) {
      this.addTile();
      this.updateBoard();

      const stat = this.getStatus();

      if (stat === 'win') {
        document.querySelector('.message-win').classList.remove('hidden');
      } else if (stat === 'lose') {
        document.querySelector('.message-lose').classList.remove('hidden');
      }
    }
  }
}

module.exports = Game;
