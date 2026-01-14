'use strict';
class Game {
  initialBoard = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  constructor(initialState) {
    this.state = initialState;
    this.score = 0;
    this.status = 'idle';

    if (initialState === undefined) {
      const cloneBoard = structuredClone(this.initialBoard);

      this.state = cloneBoard;
    }
  }

  moveLeft() {
    let hasMoved = false;

    for (let i = 0; i < 4; i++) {
      const currentRow = this.state[i];
      const reversedRow = [...currentRow].reverse();
      const newReversedRow = this.processRow(reversedRow);
      const newRow = newReversedRow.reverse();

      // перевірка чи є можливість пересувати клітинки

      if (currentRow.toString() !== newRow.toString()) {
        hasMoved = true;
      }

      this.state[i] = newRow;
    }

    if (hasMoved) {
      this.spawnNewCell();
    }
    this.getScore();
  }
  moveRight() {
    let hasMoved = false;

    for (let i = 0; i < 4; i++) {
      const currentRow = this.state[i];
      const newRow = this.processRow(currentRow);

      if (currentRow.toString() !== newRow.toString()) {
        hasMoved = true;
      }

      this.state[i] = newRow;
    }

    if (hasMoved) {
      this.spawnNewCell();
    }
    this.getScore();
  }
  moveUp() {
    this.state = this.transpose(this.state);
    this.moveLeft();
    this.state = this.transpose(this.state);
    this.getScore();
  }
  moveDown() {
    this.state = this.transpose(this.state);
    this.moveRight();
    this.state = this.transpose(this.state);
    this.getScore();
  }

  getScore() {
    return this.score;
  }

  getState() {
    return structuredClone(this.state);
  }

  getStatus() {
    return this.status;
  }
  start() {
    this.status = 'playing';
    this.spawnNewCell();
    this.spawnNewCell();
  }
  restart() {
    this.score = 0;
    this.status = 'idle';
    this.state = structuredClone(this.initialBoard);
  }
  // Add your own methods here
  spawnNewCell() {
    const emptyBoard = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          emptyBoard.push([i, j]);
        }
      }
    }

    if (emptyBoard.length === 0) {
      return;
    }

    const [row, col] =
      emptyBoard[Math.floor(Math.random() * emptyBoard.length)];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;

    this.updateStatus();
  }
  processRow(row) {
    let nums = row.filter((n) => n > 0);

    for (let i = nums.length - 1; i > 0; i--) {
      if (nums[i] === nums[i - 1]) {
        nums[i] *= 2;
        nums[i - 1] = 0;
        this.score += nums[i];
        i--;
      }
    }
    nums = nums.filter((n) => n > 0);

    while (nums.length < 4) {
      nums.unshift(0);
    }

    return nums;
  }

  transpose(matrix) {
    const result = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i][j] = matrix[j][i];
      }
    }

    return result;
  }

  updateStatus() {
    for (const row of this.state) {
      for (const cell of row) {
        if (cell === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (const row of this.state) {
      for (const cell of row) {
        if (cell === 0) {
          return;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.state[i][j] === this.state[i][j + 1]) {
          return;
        }
      }
    }

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === this.state[i + 1][j]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}
export default Game;
