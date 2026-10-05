'use strict';

const SIZE = 4;

function createEmptyBoard() {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}

function copyBoard(board) {
  return board.map((row) => [...row]);
}
class Game {
  constructor(initialState) {
    this.initialState = initialState
      ? copyBoard(initialState)
      : createEmptyBoard();

    this.board = copyBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    return this.applyMove(() => {
      for (let row = 0; row < SIZE; row++) {
        this.board[row] = this.processRow(this.board[row]);
      }
    });
  }

  moveRight() {
    return this.applyMove(() => {
      for (let row = 0; row < SIZE; row++) {
        const reversedRow = [...this.board[row]].reverse();
        const processedRow = this.processRow(reversedRow);

        this.board[row] = processedRow.reverse();
      }
    });
  }

  moveUp() {
    return this.applyMove(() => {
      for (let col = 0; col < SIZE; col++) {
        const column = [];

        for (let row = 0; row < SIZE; row++) {
          column.push(this.board[row][col]);
        }

        const processedColumn = this.processRow(column);

        for (let row = 0; row < SIZE; row++) {
          this.board[row][col] = processedColumn[row];
        }
      }
    });
  }

  moveDown() {
    return this.applyMove(() => {
      for (let col = 0; col < SIZE; col++) {
        const column = [];

        for (let row = 0; row < SIZE; row++) {
          column.push(this.board[row][col]);
        }

        const reversedColumn = [...column].reverse();
        const processedColumn = this.processRow(reversedColumn).reverse();

        for (let row = 0; row < SIZE; row++) {
          this.board[row][col] = processedColumn[row];
        }
      }
    });
  }

  applyMove(slide) {
    if (this.status !== 'playing') {
      return false;
    }

    const previousBoard = copyBoard(this.board);

    slide();

    const moved = !this.boardsEqual(previousBoard, this.board);

    if (moved) {
      if (this.hasWinningTile()) {
        this.status = 'win';
      }

      this.addRandomTile();
    }

    if (this.status !== 'win' && !this.hasAvailableMoves()) {
      this.status = 'lose';
    }

    return moved;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return copyBoard(this.board);
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
    this.board = copyBoard(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  processRow(row) {
    let filteredRow = row.filter((cell) => cell !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] = filteredRow[i] * 2;
        filteredRow[i + 1] = 0;

        this.score += filteredRow[i];
      }
    }

    filteredRow = filteredRow.filter((cell) => cell !== 0);

    while (filteredRow.length < SIZE) {
      filteredRow.push(0);
    }

    return filteredRow;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    let value;

    if (Math.random() < 0.9) {
      value = 2;
    } else {
      value = 4;
    }

    this.board[randomCell.row][randomCell.col] = value;
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells;
  }

  boardsEqual(board1, board2) {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (board1[row][col] !== board2[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  hasWinningTile() {
    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (this.board[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  hasAvailableMoves() {
    if (this.getEmptyCells().length > 0) {
      return true;
    }

    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (
          col < SIZE - 1 &&
          this.board[row][col] === this.board[row][col + 1]
        ) {
          return true;
        }

        if (
          row < SIZE - 1 &&
          this.board[row][col] === this.board[row + 1][col]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
