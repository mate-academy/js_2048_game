'use strict';

class Game {
  constructor(initialState = []) {
    this.field = initialState.length
      ? JSON.parse(JSON.stringify(initialState))
      : [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];

    this.score = 0;
    this.status = 'idle';
    this.firstMove = true;
  }

  moveLeft() {
    const oldField = JSON.stringify(this.field);

    for (let row = 0; row < 4; row++) {
      const currentRow = this.field[row];
      const filtered = currentRow.filter((num) => num !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          this.score += filtered[i];
          filtered.splice(i + 1, 1);
        }
      }

      while (filtered.length < 4) {
        filtered.push(0);
      }

      this.field[row] = filtered;
    }

    if (JSON.stringify(this.field) !== oldField) {
      this.addRandomTile();
      this.firstMove = false;
    }
  }

  moveRight() {
    const oldField = JSON.stringify(this.field);

    this.field = this.field.map((row) => row.reverse());
    this.moveLeft();
    this.field = this.field.map((row) => row.reverse());

    if (JSON.stringify(this.field) !== oldField) {
      this.addRandomTile();
      this.firstMove = false;
    }
  }
  moveUp() {
    const oldField = JSON.stringify(this.field);

    for (let col = 0; col < 4; col++) {
      const currentRow = [
        this.field[0][col],
        this.field[1][col],
        this.field[2][col],
        this.field[3][col],
      ];
      const filtered = currentRow.filter((num) => num !== 0);

      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          this.score += filtered[i];
          filtered.splice(i + 1, 1);
        }
      }

      while (filtered.length < 4) {
        filtered.push(0);
      }

      this.field[0][col] = filtered[0];
      this.field[1][col] = filtered[1];
      this.field[2][col] = filtered[2];
      this.field[3][col] = filtered[3];
    }

    if (JSON.stringify(this.field) !== oldField) {
      this.addRandomTile();
      this.firstMove = false;
    }
  }
  moveDown() {
    const oldField = JSON.stringify(this.field);

    this.field.reverse();
    this.moveUp();
    this.field.reverse();

    if (JSON.stringify(this.field) !== oldField) {
      this.addRandomTile();
      this.firstMove = false;
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.field;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
    this.updateBoard();
  }

  restart() {
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
    this.firstMove = true;
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.field[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
  }

  updateBoard() {
    const field = this.field;
    const cells = document.querySelectorAll('.field-cell');

    cells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const value = field[row][col];

      cell.textContent = value || '';
      cell.className = 'field-cell' + (value ? ` field-cell--${value}` : '');
    });
    document.querySelector('.game-score').textContent = this.score;
  }

  isGameWon() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === 2048) {
          this.status = 'won';

          return true;
        }
      }
    }

    return false;
  }

  checkGameOver() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.field[row][col];

        if (col < 3 && current === this.field[row][col + 1]) {
          return false;
        }

        if (row < 3 && current === this.field[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }
}

export default Game;
