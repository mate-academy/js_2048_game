'use strict';
/* eslint-disable comma-dangle, function-paren-newline */

'use strict';

class Game {
  constructor(size = 4, initialState = null) {
    this.size = size;
    this.score = 0;
    this.status = 'idle';
    this.field = this.createEmptyField();

    if (initialState) {
      this.field = initialState.map((row) => [...row]);
      this.status = 'playing';
      this.checkGameStatus();
    }
  }

  createEmptyField() {
    return Array(this.size)
      .fill()
      .map(() => Array(this.size).fill(0));
  }

  start() {
    this.score = 0;
    this.status = 'playing';
    this.field = this.createEmptyField();
    this.addRandomTile();
    this.addRandomTile();

    return this;
  }

  restart() {
    return this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.field[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.field[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    return this.move('left');
  }

  moveRight() {
    return this.move('right');
  }

  moveUp() {
    return this.move('up');
  }

  moveDown() {
    return this.move('down');
  }

  move(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    const oldField = JSON.stringify(this.field);

    switch (direction) {
      case 'left':
        this.moveHorizontal(false);
        break;
      case 'right':
        this.moveHorizontal(true);
        break;
      case 'up':
        this.moveVertical(false);
        break;
      case 'down':
        this.moveVertical(true);
        break;
    }

    const newField = JSON.stringify(this.field);
    const moved = oldField !== newField;

    if (moved) {
      this.addRandomTile();
      this.checkGameStatus();
    }

    return moved;
  }

  moveHorizontal(reverse) {
    for (let i = 0; i < this.size; i++) {
      let row = this.field[i];

      if (reverse) {
        row = row.slice().reverse();
      }

      const mergedRow = this.mergeTiles(row);

      while (mergedRow.length < this.size) {
        mergedRow.push(0);
      }

      if (reverse) {
        mergedRow.reverse();
      }
      this.field[i] = mergedRow;
    }
  }

  moveVertical(reverse) {
    for (let j = 0; j < this.size; j++) {
      let column = [];

      for (let i = 0; i < this.size; i++) {
        column.push(this.field[i][j]);
      }

      if (reverse) {
        column = column.slice().reverse();
      }

      const mergedColumn = this.mergeTiles(column);

      while (mergedColumn.length < this.size) {
        mergedColumn.push(0);
      }

      if (reverse) {
        mergedColumn.reverse();
      }

      for (let i = 0; i < this.size; i++) {
        this.field[i][j] = mergedColumn[i];
      }
    }
  }

  mergeTiles(line) {
    const nonZero = line.filter((tile) => tile !== 0);
    const result = [];
    let idx = 0;

    while (idx < nonZero.length) {
      if (idx + 1 < nonZero.length && nonZero[idx] === nonZero[idx + 1]) {
        const mergedValue = nonZero[idx] * 2;

        result.push(mergedValue);
        this.score += mergedValue;
        idx += 2;
      } else {
        result.push(nonZero[idx]);
        idx += 1;
      }
    }

    return result;
  }

  checkGameStatus() {
    // Check for win
    for (let rowIdx = 0; rowIdx < this.size; rowIdx++) {
      for (let colIdx = 0; colIdx < this.size; colIdx++) {
        if (this.field[rowIdx][colIdx] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    // Check for empty cells
    for (let rowIdx = 0; rowIdx < this.size; rowIdx++) {
      for (let colIdx = 0; colIdx < this.size; colIdx++) {
        if (this.field[rowIdx][colIdx] === 0) {
          this.status = 'playing';

          return;
        }
      }
    }

    // Check for possible merges
    for (let rowIdx = 0; rowIdx < this.size; rowIdx++) {
      for (let colIdx = 0; colIdx < this.size; colIdx++) {
        const current = this.field[rowIdx][colIdx];

        // Check right
        if (
          colIdx < this.size - 1 &&
          current === this.field[rowIdx][colIdx + 1]
        ) {
          this.status = 'playing';

          return;
        }

        // Check down
        if (
          rowIdx < this.size - 1 &&
          current === this.field[rowIdx + 1][colIdx]
        ) {
          this.status = 'playing';

          return;
        }
      }
    }

    this.status = 'lose';
  }

  getState() {
    return this.field.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }
}

export { Game };
