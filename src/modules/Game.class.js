'use strict';
class Game {
  constructor(initialState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    this.board = initialState
      ? initialState.map((row) => [...row])
      : this.createEmptyBoard();
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      let newRow = this.board[row].filter((tile) => tile !== 0);

      for (let col = 0; col < newRow.length - 1; col++) {
        if (newRow[col] !== 0 && newRow[col] === newRow[col + 1]) {
          newRow[col] *= 2;
          newRow[col + 1] = 0;

          this.score += newRow[col];
          moved = true;
        }
      }

      newRow = newRow.filter((tile) => tile !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (JSON.stringify(this.board[row]) !== JSON.stringify(newRow)) {
        moved = true;
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

  transpose() {
    this.board = this.board[0].map((_, colIndex) =>
      // eslint-disable-next-line prettier/prettier
      this.board.map((row) => row[colIndex]));
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.createRandomTile();
    this.createRandomTile();
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.start();
    document.querySelector('.game-score').textContent = this.score;
    this.updateMessage();
  }

  createRandomTile() {
    const emptyTiles = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === 0) {
          emptyTiles.push({ rowIndex, cellIndex });
        }
      });
    });

    if (emptyTiles.length > 0) {
      const { rowIndex, cellIndex } =
        emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

      this.board[rowIndex][cellIndex] = Math.random() < 0.9 ? 2 : 4;

      this.printTiles();
    }
  }

  printTiles() {
    const cells = document.querySelectorAll('.field-cell');

    cells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = this.board[row][col];

      cell.className = 'field-cell';
      cell.textContent = value !== 0 ? value : '';
      cell.classList.add(`field-cell--${cell.textContent}`);
    });
  }

  checkStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    }

    let hasEmptyTile = false;
    let canMove = false;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          hasEmptyTile = true;
        }

        if (
          (r < 3 && this.board[r][c] === this.board[r + 1][c]) ||
          (c < 3 && this.board[r][c] === this.board[r][c + 1])
        ) {
          canMove = true;
        }
      }
    }

    if (!hasEmptyTile && !canMove) {
      this.status = 'lose';
    }
  }

  updateMessage() {
    switch (this.status) {
      case 'idle':
        document.querySelector('.message-lose').classList.add('hidden');
        document.querySelector('.message-win').classList.add('hidden');
        break;

      case 'playing':
        document.querySelector('.message-start').classList.add('hidden');
        document.querySelector('.message-lose').classList.add('hidden');
        document.querySelector('.message-win').classList.add('hidden');
        break;

      case 'win':
        document.querySelector('.message-win').classList.remove('hidden');
        break;

      case 'lose':
        document.querySelector('.message-lose').classList.remove('hidden');
    }
  }
}

module.exports = Game;
