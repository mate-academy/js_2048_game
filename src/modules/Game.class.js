'use strict';
class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.state = initialState;
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';

    const initialValue = 2;
    const randomFirstCell = this.createRandomValue();

    this.state[randomFirstCell[0]][randomFirstCell[1]] = initialValue;

    let randomSecondCell;

    do {
      randomSecondCell = this.createRandomValue();
    } while (
      randomFirstCell[0] === randomSecondCell[0] &&
      randomFirstCell[1] === randomSecondCell[1]
    );

    this.state[randomSecondCell[0]][randomSecondCell[1]] = initialValue;
  }

  move(direction) {
    const isVertical = direction === 'up' || direction === 'down';
    let moved = false;

    const lines = isVertical
      ? this.switchRowsToColumns(this.state)
      : [...this.state];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (this.canMove(line)) {
        const { row: newLine, score } = this.shiftRows(line, direction);

        lines[i] = newLine;
        this.score += score;
        moved = true;
      }
    }

    if (moved) {
      this.state = isVertical ? this.switchRowsToColumns(lines) : lines;
      this.addNewValue();
      this.checkForWin();
      this.checkForGameOver();
    }
  }

  restart() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'idle';
    this.score = 0;
  }

  createRandomValue() {
    const randomRow = Math.floor(Math.random() * 4);
    const randomCol = Math.floor(Math.random() * 4);

    return [randomRow, randomCol];
  }

  shiftRows(row, direction) {
    const noneZero = row.filter((item) => item !== 0);
    const merge = Array(this.state.length).fill(false);
    const result = [];
    let newScore = 0;

    for (let i = 0; i < noneZero.length; i++) {
      const current = noneZero[i];

      if (
        i < noneZero.length - 1 &&
        current === noneZero[i + 1] &&
        !merge[i] &&
        !merge[i + 1]
      ) {
        result.push(current * 2);
        merge[i] = merge[i + 1] = true;
        newScore += current * 2;
        i++;
      } else {
        result.push(current);
      }
    }

    while (result.length < this.state.length) {
      result.push(0);
    }

    if (direction === 'right' || direction === 'down') {
      result.reverse();
    }

    return { row: result, score: newScore };
  }

  canMove(row) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === 0 || row[i] === row[i + 1]) {
        return true;
      }
    }

    return false;
  }

  canMoveInAnyDirection() {
    for (const row of this.state) {
      if (this.canMove(row)) {
        return true;
      }
    }

    for (let col = 0; col < this.state[0].length; col++) {
      const column = this.state.map((row) => row[col]);

      if (this.canMove(column)) {
        return true;
      }
    }

    return false;
  }

  addNewValue() {
    const emptyCells = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    const value = Math.random() < 0.1 ? 4 : 2;

    this.state[row][col] = value;
  }

  checkForWin() {
    for (const row of this.state) {
      for (const cell of row) {
        if (cell === 2048) {
          this.status = 'win';
        }
      }
    }
  }

  checkForGameOver() {
    if (!this.canMoveInAnyDirection()) {
      this.status = 'lose';
    }
  }

  switchRowsToColumns(boards) {
    return boards[0].map((_, index) => {
      return boards.map((item) => item[index]);
    });
  }
}

module.exports = Game;
