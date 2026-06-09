'use strict';

class Game {
  constructor(initialState) {
    if (initialState) {
      this.board = initialState.map((row) => [...row]);
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.score = 0;
    this.status = 'idle';
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

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    const newValue = Math.random() < 0.9 ? 2 : 4;

    this.board[randomCell.r][randomCell.c] = newValue;
  }

  checkStatus() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          this.status = 'playing';

          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.board[r][c];

        if (
          (c < 3 && current === this.board[r][c + 1]) ||
          (r < 3 && current === this.board[r + 1][c])
        ) {
          this.status = 'playing';

          return;
        }
      }
    }

    this.status = 'lose';
  }

  slideLine(line) {
    let filtered = line.filter((val) => val !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] !== 0 && filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        this.score += filtered[i];
        filtered[i + 1] = 0;
      }
    }

    filtered = filtered.filter((val) => val !== 0);

    while (filtered.length < 4) {
      filtered.push(0);
    }

    return filtered;
  }

  moveLeft() {
    let hasChanged = false;

    for (let r = 0; r < 4; r++) {
      const currentRow = this.board[r];
      const oldRow = [...currentRow];

      this.board[r] = this.slideLine(currentRow);

      if (oldRow.join(',') !== this.board[r].join(',')) {
        hasChanged = true;
      }
    }

    if (hasChanged) {
      this.addRandomTile();
    }

    this.checkStatus();
  }

  moveRight() {
    let hasChanged = false;

    for (let r = 0; r < 4; r++) {
      const currentRow = this.board[r];

      const oldRow = [...currentRow];

      const reversedRow = [...currentRow].reverse();

      this.board[r] = this.slideLine(reversedRow).reverse();

      if (oldRow.join(',') !== this.board[r].join(',')) {
        hasChanged = true;
      }
    }

    if (hasChanged) {
      this.addRandomTile();
    }

    this.checkStatus();
  }

  moveUp() {
    let hasChanged = false;

    for (let c = 0; c < 4; c++) {
      const currentCol = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      const oldCol = [...currentCol];

      const newCol = this.slideLine(currentCol);

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = newCol[r];
      }

      if (oldCol.join(',') !== newCol.join(',')) {
        hasChanged = true;
      }
    }

    if (hasChanged) {
      this.addRandomTile();
    }

    this.checkStatus();
  }

  moveDown() {
    let hasChanged = false;

    for (let c = 0; c < 4; c++) {
      const currentCol = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      const oldCol = [...currentCol];

      const reversedCol = [...currentCol].reverse();

      const newCol = this.slideLine(reversedCol).reverse();

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = newCol[r];
      }

      if (oldCol.join(',') !== newCol.join(',')) {
        hasChanged = true;
      }
    }

    if (hasChanged) {
      this.addRandomTile();
    }

    this.checkStatus();
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.start();
  }
}

module.exports = Game;
