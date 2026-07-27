'use strict';

class Game {
  constructor(initialState) {
    const board = initialState
      ? this.cloneBoard(initialState)
      : this.generateEmptyBoard();

    this.initialBoard = this.cloneBoard(board);
    this.board = this.cloneBoard(board);

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let totalGainedScore = 0;
    const boardBeforeMove = this.cloneBoard(this.board);

    for (let row = 0; row < this.board.length; row++) {
      const { newRow, gainedScore } = this.transformRow(this.board[row]);

      this.board[row] = newRow;
      totalGainedScore += gainedScore;
    }

    if (JSON.stringify(boardBeforeMove) !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.score += totalGainedScore;
      this.updateStatus();
    }
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let totalGainedScore = 0;
    const boardBeforeMove = this.cloneBoard(this.board);

    for (let row = 0; row < this.board.length; row++) {
      const reversedRow = [...this.board[row]].reverse();
      const { newRow, gainedScore } = this.transformRow(reversedRow);

      this.board[row] = newRow.reverse();
      totalGainedScore += gainedScore;
    }

    if (JSON.stringify(boardBeforeMove) !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.score += totalGainedScore;
      this.updateStatus();
    }
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const transposedBoard = this.transposeBoard(this.board);
    let totalGainedScore = 0;
    const boardBeforeMove = this.cloneBoard(this.board);

    for (let row = 0; row < transposedBoard.length; row++) {
      const { newRow, gainedScore } = this.transformRow(transposedBoard[row]);

      transposedBoard[row] = newRow;
      totalGainedScore += gainedScore;
    }

    this.board = this.transposeBoard(transposedBoard);

    if (JSON.stringify(boardBeforeMove) !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.score += totalGainedScore;
      this.updateStatus();
    }
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const transposedBoard = this.transposeBoard(this.board);
    let totalGainedScore = 0;
    const boardBeforeMove = this.cloneBoard(this.board);

    for (let row = 0; row < transposedBoard.length; row++) {
      const reversedRow = [...transposedBoard[row]].reverse();
      const { newRow, gainedScore } = this.transformRow(reversedRow);

      transposedBoard[row] = newRow.reverse();
      totalGainedScore += gainedScore;
    }

    this.board = this.transposeBoard(transposedBoard);

    if (JSON.stringify(boardBeforeMove) !== JSON.stringify(this.board)) {
      this.addRandomTile();
      this.score += totalGainedScore;
      this.updateStatus();
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.cloneBoard(this.board);
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = this.cloneBoard(this.initialBoard);

    this.score = 0;
    this.status = 'idle';
  }

  generateEmptyBoard() {
    const size = 4;
    const result = [];

    for (let i = 0; i < size; i++) {
      const innerArray = [];

      for (let j = 0; j < size; j++) {
        innerArray.push(0);
      }

      result.push(innerArray);
    }

    return result;
  }

  cloneBoard(board) {
    const clonedBoard = structuredClone(board);

    return clonedBoard;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (!emptyCells.length) {
      return;
    }

    const randomCell = Math.floor(Math.random() * emptyCells.length);
    const chosenCell = emptyCells[randomCell];

    const { row: chosenRow, col: chosenCol } = chosenCell;

    const randomNum = Math.random();

    if (randomNum < 0.1) {
      this.board[chosenRow][chosenCol] = 4;
    } else {
      this.board[chosenRow][chosenCol] = 2;
    }
  }

  transformRow(row) {
    const filteredRow = row.filter((num) => num !== 0);
    const missingZeros = row.length - filteredRow.length;

    let gainedScore = 0;

    for (let i = 0; i < missingZeros; i++) {
      filteredRow.push(0);
    }

    for (let j = 0; j < filteredRow.length - 1; j++) {
      if (filteredRow[j] === filteredRow[j + 1]) {
        const cellSum = filteredRow[j] + filteredRow[j + 1];

        filteredRow[j] = cellSum;
        filteredRow[j + 1] = 0;
        gainedScore += cellSum;
        j++;
      }
    }

    const newRow = filteredRow.filter((num) => num !== 0);
    const missZero = row.length - newRow.length;

    for (let i = 0; i < missZero; i++) {
      newRow.push(0);
    }

    return { newRow, gainedScore };
  }

  transposeBoard(board) {
    const rows = board.length;
    const cols = board[0].length;
    const result = [];

    for (let c = 0; c < cols; c++) {
      result[c] = [];

      for (let r = 0; r < rows; r++) {
        result[c][r] = board[r][c];
      }
    }

    return result;
  }

  hasWinningTile() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  hasEmptyCell() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  hasAvailableMoves() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (col < this.board[row].length - 1) {
          if (this.board[row][col] === this.board[row][col + 1]) {
            return true;
          }
        }

        if (row < this.board.length - 1) {
          if (this.board[row][col] === this.board[row + 1][col]) {
            return true;
          }
        }
      }
    }

    return false;
  }

  updateStatus() {
    if (this.hasWinningTile()) {
      this.status = 'win';
    } else if (!this.hasEmptyCell() && !this.hasAvailableMoves()) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
    }
  }
}

module.exports = Game;
