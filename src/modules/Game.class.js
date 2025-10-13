'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState) {
    this.score = 0;
    this.status = 'idle';
    this.board = [];

    if (Array.isArray(initialState)) {
      this.board = initialState.map((row) => [...row]);
    } else {
      this.board = this.createEmptyBoard();
    }

    this.initialState = this.board.map((r) => [...r]);
  }

  moveLeft(board = this.board, update = true) {
    if (this.status !== 'playing') {
      return;
    }

    const newBoard = [];

    let score = 0;

    for (const row of board) {
      const [operatedRow, gainedScore] = this.operateRow(row);

      score += gainedScore;
      newBoard.push(operatedRow);
    }

    if (update) {
      this.updateAfterMove(newBoard, score);
    }

    return { newBoard, score };
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const reversedBoard = this.board.map((row) => [...row].reverse());
    const { newBoard, score } = this.moveLeft(reversedBoard, false);
    const finalBoard = newBoard.map((row) => row.reverse());

    this.updateAfterMove(finalBoard, score);
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const transposed = this.transpose(this.board);
    const { newBoard, score } = this.moveLeft(transposed, false);
    const finalBoard = this.transpose(newBoard);

    this.updateAfterMove(finalBoard, score);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const transposed = this.transpose(this.board);
    const reversed = transposed.map((row) => [...row].reverse());
    const { newBoard, score } = this.moveLeft(reversed, false);
    const finalBoard = this.transpose(newBoard.map((row) => row.reverse()));

    this.updateAfterMove(finalBoard, score);
  }

  getScore() {
    return this.score;
  }

  getState() {
    const copyOfState = this.board.map((row) => [...row]);

    return copyOfState;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.score = 0;
    this.status = 'playing';

    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    for (let i = emptyCells.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [emptyCells[i], emptyCells[j]] = [emptyCells[j], emptyCells[i]];
    }

    const [value1, value2] = this.createValues();

    this.board[emptyCells[0].row][emptyCells[0].col] = value1;

    if (emptyCells.length > 1) {
      this.board[emptyCells[1].row][emptyCells[1].col] = value2;
    }
  }

  restart() {
    this.score = 0;
    this.status = 'idle';
    this.board = this.initialState.map((r) => [...r]);
  }

  createEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  createValues() {
    const value1 = Math.random() < 0.9 ? 2 : 4;
    const value2 = Math.random() < 0.9 ? 2 : 4;

    return [value1, value2];
  }

  createSingleValue() {
    const value = Math.random() < 0.9 ? 2 : 4;

    return value;
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    return emptyCells;
  }

  insertRandomTile(value) {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length > 0) {
      const cell = emptyCells.splice(
        Math.floor(Math.random() * emptyCells.length),
        1,
      )[0];

      this.board[cell.row][cell.col] = value;
    }
  }

  boardsEqual(a, b) {
    if (a.length !== b.length) {
      return false;
    }

    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a[i].length; j++) {
        if (a[i][j] !== b[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  compressRow(row) {
    const newRow = row.filter((el) => el !== 0);

    while (newRow.length !== row.length) {
      newRow.push(0);
    }

    return newRow;
  }

  mergeRow(row) {
    const res = [...row];
    let gainedScore = 0;

    for (let i = 0; i < res.length - 1; i++) {
      if (res[i] !== 0 && res[i] === res[i + 1]) {
        res[i] *= 2;
        res[i + 1] = 0;

        gainedScore += res[i];
      }
    }

    return [res, gainedScore];
  }

  operateRow(row) {
    const compressedRow = this.compressRow(row);
    const [mergedRow, gainedScore] = this.mergeRow(compressedRow);
    const finalRow = this.compressRow(mergedRow);

    return [finalRow, gainedScore];
  }

  transpose(board) {
    const newBoard = [];
    const size = board.length;

    for (let i = 0; i < size; i++) {
      newBoard[i] = [];

      for (let j = 0; j < size; j++) {
        newBoard[i][j] = board[j][i];
      }
    }

    return newBoard;
  }

  checkWin() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return true;
      }
    }

    return false;
  }

  checkLose() {
    if (this.getEmptyCells().length > 0) {
      return false;
    }

    for (const row of this.board) {
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          return false;
        }
      }
    }

    for (let c = 0; c < this.board.length; c++) {
      for (let r = 0; r < this.board.length - 1; r++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          return false;
        }
      }
    }

    this.status = 'lose';

    return true;
  }

  updateAfterMove(newBoard, gainedScore) {
    if (this.status !== 'playing') {
      return;
    }

    if (!this.boardsEqual(this.board, newBoard)) {
      this.board = newBoard;
      this.score += gainedScore;

      if (this.checkWin()) {
        return;
      }

      const value = this.createSingleValue();

      this.insertRandomTile(value);
      this.checkLose();
    }
  }
}

module.exports = Game;
