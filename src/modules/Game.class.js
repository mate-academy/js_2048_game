'use strict';

class Game {
  constructor(initialState) {
    this.initialState = (
      initialState || [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]
    ).map((row) => [...row]);

    this.board = this.initialState.map((row) => [...row]);

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;
    const newBoard = [];

    for (let i = 0; i < this.board.length; i++) {
      const currentRow = this.board[i];
      const { newRow, scoreGained } = this.slideRow(currentRow);

      if (JSON.stringify(currentRow) !== JSON.stringify(newRow)) {
        moved = true;
      }

      this.score += scoreGained;
      newBoard.push(newRow);
    }

    if (moved) {
      this.board = newBoard;
      this.spawnTile();
    }

    return moved;
  }

  moveRight() {
    this.board = this.board.map((row) => [...row].reverse());

    const moved = this.moveLeft();

    this.board = this.board.map((row) => [...row].reverse());

    return moved;
  }

  moveUp() {
    this.board = this.transpose(this.board);

    const moved = this.moveLeft();

    this.board = this.transpose(this.board);

    return moved;
  }

  moveDown() {
    this.board = this.transpose(this.board);
    this.board = this.board.map((row) => [...row].reverse());

    const moved = this.moveLeft();

    this.board = this.board.map((row) => [...row].reverse());
    this.board = this.transpose(this.board);

    return moved;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    this.spawnTile();
    this.spawnTile();
    this.checkWin();

    if (this.status !== 'win') {
      this.checkLose();
    }
  }

  spawnTile() {
    const emptyCells = [];

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[row][col] = value;

    this.checkWin();

    if (this.status !== 'win') {
      this.checkLose();
    }
  }

  slideRow(row) {
    let filtered = row.filter((num) => num !== 0);
    let scoreGained = 0;

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        scoreGained += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    filtered = filtered.filter((num) => num !== 0);

    while (filtered.length < 4) {
      filtered.push(0);
    }

    return { newRow: filtered, scoreGained };
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  checkWin() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';
        }
      }
    }
  }

  checkLose() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        const current = this.board[row][col];

        if (col < 3 && this.board[row][col + 1] === current) {
          return false;
        }

        if (row < 3 && this.board[row + 1][col] === current) {
          return false;
        }
      }
    }

    this.status = 'lose';

    return true;
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);

    this.score = 0;
    this.status = 'idle';
  }
}

module.exports = Game;
