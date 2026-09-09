'use strict';

const SIZE = 4;
const WIN_VALUE = 2048;

function createEmptyBoard() {
  return Array.from({ length: SIZE }, () => new Array(SIZE).fill(0));
}

function copyBoard(board) {
  return board.map((row) => [...row]);
}

function reverseRows(board) {
  return board.map((row) => [...row].reverse());
}

function transpose(board) {
  return board[0].map((_, col) => board.map((row) => row[col]));
}

function isSameBoard(a, b) {
  return a.every((row, r) => row.every((value, c) => value === b[r][c]));
}

/**
 * Moves one row to the left: squeezes zeros out, merges equal neighbours
 * once, pads with zeros. Returns the new row and the score gained.
 */
function slideRowLeft(row) {
  const cells = row.filter((value) => value !== 0);
  const result = [];
  let gained = 0;

  for (let i = 0; i < cells.length; i += 1) {
    if (cells[i] === cells[i + 1]) {
      result.push(cells[i] * 2);
      gained += cells[i] * 2;
      i += 1;
    } else {
      result.push(cells[i]);
    }
  }

  while (result.length < SIZE) {
    result.push(0);
  }

  return { row: result, gained };
}

class Game {
  constructor(initialState = createEmptyBoard()) {
    this.initialState = copyBoard(initialState);
    this.state = copyBoard(initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.makeMove(
      (board) => board,
      (board) => board,
    );
  }

  moveRight() {
    this.makeMove(reverseRows, reverseRows);
  }

  moveUp() {
    this.makeMove(transpose, transpose);
  }

  moveDown() {
    this.makeMove(
      (board) => reverseRows(transpose(board)),
      (board) => transpose(reverseRows(board)),
    );
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
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.state = copyBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  /**
   * Turns the board so that the wanted direction becomes "left",
   * slides every row, turns the board back.
   */
  makeMove(toLeft, fromLeft) {
    if (this.status !== 'playing') {
      return;
    }

    let gainedTotal = 0;

    const slidRows = toLeft(this.state).map((row) => {
      const { row: newRow, gained } = slideRowLeft(row);

      gainedTotal += gained;

      return newRow;
    });

    const nextState = fromLeft(slidRows);

    if (isSameBoard(this.state, nextState)) {
      return;
    }

    this.state = nextState;
    this.score += gainedTotal;
    this.addRandomTile();
    this.updateStatus();
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const index = Math.floor(Math.random() * emptyCells.length);
    const [targetRow, targetCol] = emptyCells[index];

    this.state[targetRow][targetCol] = Math.random() < 0.1 ? 4 : 2;
  }

  updateStatus() {
    if (this.state.flat().includes(WIN_VALUE)) {
      this.status = 'win';

      return;
    }

    if (!this.hasMoves()) {
      this.status = 'lose';
    }
  }

  hasMoves() {
    for (let r = 0; r < SIZE; r += 1) {
      for (let c = 0; c < SIZE; c += 1) {
        const value = this.state[r][c];

        if (value === 0) {
          return true;
        }

        if (c < SIZE - 1 && value === this.state[r][c + 1]) {
          return true;
        }

        if (r < SIZE - 1 && value === this.state[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
