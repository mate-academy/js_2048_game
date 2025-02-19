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

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.addRandomTile();
      this.addRandomTile();
      this.status = 'playing';
    }
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
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

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    for (let row = 0; row < 4; row++) {
      let newRow = this.board[row].filter((num) => num !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          newRow[i + 1] = 0;
          this.score += newRow[i];
          moved = true; // Помічаємо, що була зміна
        }
      }

      newRow = newRow.filter((num) => num !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (JSON.stringify(this.board[row]) !== JSON.stringify(newRow)) {
        moved = true;
      }

      this.board[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
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
    this.transposeBoard();

    const moved = this.moveLeft();

    this.transposeBoard();

    return moved;
  }

  moveDown() {
    this.transposeBoard();

    const moved = this.moveRight();

    this.transposeBoard();

    return moved;
  }

  transposeBoard() {
    const newBoard = [];

    for (let col = 0; col < 4; col++) {
      const newRow = [];

      for (let row = 0; row < 4; row++) {
        newRow.push(this.board[row][col]);
      }
      newBoard.push(newRow);
    }

    this.board = newBoard;
  }

  checkGameStatus() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return;
        }

        if (this.board[row][col] === 0) {
          return; // Гра ще не закінчена
        }

        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return; // Можливий хід
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return; // Можливий хід
        }
      }
    }
    this.status = 'lose'; // Гра програна
  }
}

export default Game;
