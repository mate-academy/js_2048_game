'use strict';

const rows = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
];
const columns = rows.map((_, col) => rows.map((row) => row[col]));

const linesByDirection = {
  left: rows,
  right: rows.map((row) => [...row].reverse()),
  up: columns,
  down: columns.map((column) => [...column].reverse()),
};

class Game {
  constructor(initialState = Array.from({ length: 4 }, () => [0, 0, 0, 0])) {
    this._initialState = initialState.map((row) => [...row]);
    this.restart();
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

  addRandomTile() {
    const emptyCells = [];

    this._state.forEach((cells, rowIndex) => {
      cells.forEach((value, columnIndex) => {
        if (value === 0) {
          emptyCells.push([rowIndex, columnIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const index = Math.floor(Math.random() * emptyCells.length);
    const [row, column] = emptyCells[index];

    this._state[row][column] = Math.random() < 0.1 ? 4 : 2;
  }

  move(direction) {
    const slides = [];

    if (this._status !== 'playing') {
      return slides;
    }

    const currentCells = this._state.flat();
    const nextCells = Array(16).fill(0);

    for (const line of linesByDirection[direction]) {
      const occupied = line.filter((cell) => currentCells[cell] !== 0);
      let target = 0;

      for (let i = 0; i < occupied.length; i++) {
        const from = occupied[i];
        const to = line[target];
        let value = currentCells[from];

        if (from !== to) {
          slides.push({ from, to });
        }

        const neighbor = occupied[i + 1];

        if (value === currentCells[neighbor]) {
          value *= 2;
          this._score += value;
          slides.push({ from: neighbor, to });
          i++; 
        }

        nextCells[to] = value;
        target++;
      }
    }

    if (slides.length) {
      this._state = rows.map((row) => row.map((cell) => nextCells[cell]));
      this.addRandomTile();
    }

    this.checkGameOver();

    return slides;
  }

  checkGameOver() {
    const board = this._state;

    if (board.some((row) => row.includes(2048))) {
      this._status = 'win';

      return;
    }

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const tile = board[row][col];

        if (tile === 0 || tile === board[row][col + 1]) {
          return;
        }

        if (row + 1 < board.length && tile === board[row + 1][col]) {
          return;
        }
      }
    }

    this._status = 'lose';
  }

  getScore() {
    return this._score;
  }

  getState() {
    return this._state;
  }

  getStatus() {
    return this._status;
  }

  start() {
    if (this._status !== 'idle') {
      return;
    }

    this.addRandomTile();
    this.addRandomTile();
    this._status = 'playing';
    this.checkGameOver();
  }

  restart() {
    this._state = this._initialState.map((row) => [...row]);
    this._score = 0;
    this._status = 'idle';
  }
}

module.exports = Game;
