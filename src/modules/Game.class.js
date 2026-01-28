'use strict';

'use strict';
class Game {
  constructor(initalState = null) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
    this.field = initalState || Array.from({ length: 4 }, () => [0, 0, 0, 0]);
  }
  getState() {
    return this.field;
  }
  getScore() {
    return this.score;
  }
  getStatus() {
    return this.status;
  }
  moveLeft() {
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      const row = this.field[rowIndex];
      const newRow = this.mergeLeft(row);

      this.field[rowIndex] = newRow;
    }
  }
  mergeLeft(row) {
    let newCells = row.filter((cell) => cell !== 0);

    for (let i = 0; i < newCells.length - 1; i++) {
      if (newCells[i] === newCells[i + 1]) {
        newCells[i] = newCells[i] * 2;
        newCells[i + 1] = 0;
        this.score += newCells[i];
        i++;
      }
    }
    newCells = newCells.filter((cell) => cell !== 0);

    while (newCells.length < 4) {
      newCells.push(0);
    }

    return newCells;
  }
  moveRight() {
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      const row = [...this.field[rowIndex]];

      row.reverse();

      const newRow = this.mergeLeft(row);

      newRow.reverse();
      this.field[rowIndex] = newRow;
    }
  }
  moveUp() {
    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.field[row][col]);
      }

      const newColumn = this.mergeLeft(column);

      for (let row = 0; row < 4; row++) {
        this.field[row][col] = newColumn[row];
      }
    }
  }
  moveDown() {
    for (let col = 0; col < 4; col++) {
      const column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.field[row][col]);
      }
      column.reverse();

      const newColumn = this.mergeLeft(column);

      newColumn.reverse();

      for (let row = 0; row < 4; row++) {
        this.field[row][col] = newColumn[row];
      }
    }
  }
  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.field = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
      this.score = 0;
      this.addRandomTile();
      this.addRandomTile();
    }
  }
  restart() {
    this.status = 'idle';
    this.field = Array.from({ length: 4 }, () => [0, 0, 0, 0]);
    this.score = 0;
  }
  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.field.length; row++) {
      for (let col = 0; col < this.field[row].length; col++) {
        if (this.field[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [randRow, randCol] = emptyCells[randomIndex];

    this.field[randRow][randCol] = Math.random() < 0.9 ? 2 : 4;
  }
  handleMove(direction) {
    const oldField = this.field.map((row) => [...row]);

    switch (direction) {
      case 'left':
        this.moveLeft();
        break;
      case 'right':
        this.moveRight();
        break;
      case 'up':
        this.moveUp();
        break;
      case 'down':
        this.moveDown();
        break;
    }

    let moved = false;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.field[row][col] !== oldField[row][col]) {
          moved = true;
          break;
        }
      }

      if (moved) {
        break;
      }
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkWin();

    return moved;
  }
  checkWin() {
    let noMoves = true;

    for (let row = 0; row < this.field.length; row++) {
      for (let col = 0; col < this.field[row].length; col++) {
        const current = this.field[row][col];

        if (current === 2048) {
          this.status = 'win';

          return;
        }

        if (this.field[row][col] === 0) {
          return;
        }

        if (
          col < this.field[row].length - 1 &&
          current === this.field[row][col + 1]
        ) {
          noMoves = false;
          break;
        }

        if (
          row < this.field.length - 1 &&
          current === this.field[row + 1][col]
        ) {
          noMoves = false;
          break;
        }
      }

      if (!noMoves) {
        break;
      }
    }

    if (noMoves) {
      this.status = 'lose';
    }
  }
}
module.exports = Game;
