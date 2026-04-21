'use strict';

export default class Game {
  constructor(initialState) {
    this.board = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.score = 0;
    this.status = 'idle';
  }

  processRow(row) {
    const newRow = row.filter((num) => num !== 0);
    const result = [];

    for (let i = 0; i < newRow.length; i++) {
      if (newRow[i] === newRow[i + 1]) {
        const mergedValue = newRow[i] * 2;

        result.push(mergedValue);
        i += 1;
        this.score += mergedValue;
      } else {
        result.push(newRow[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  checkWin() {
    const winCell = this.board.some((row) => row.includes(2048));

    if (winCell) {
      this.status = 'win';
    }
  }

  checkLose() {
    const hasEmpty = this.board.some((row) => row.includes(0));

    if (hasEmpty) {
      return;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.board[row][col];

        if (col < 3 && current === this.board[row][col + 1]) {
          return;
        }

        if (row < 3 && current === this.board[row + 1][col]) {
          return;
        }
      }
    }
    this.status = 'lose';
  }

  applyMove(newBoard) {
    const changed = JSON.stringify(newBoard) !== JSON.stringify(this.board);

    if (changed) {
      this.board = newBoard;
      this.addRandomTile();
      this.checkWin();
      this.checkLose();
    }
  }

  moveLeft() {
    const newBoard = [];

    for (const row of this.board) {
      const processedRow = this.processRow(row);

      newBoard.push(processedRow);
    }

    this.applyMove(newBoard);
  }

  moveRight() {
    const newBoard = [];

    this.board.forEach((row) => {
      const copyRow = [...row];
      const reversed = copyRow.reverse();
      const processed = this.processRow(reversed);
      const final = processed.reverse();

      newBoard.push(final);
    });

    this.applyMove(newBoard);
  }

  transpose(matrix) {
    const newBoard = [];

    for (let col = 0; col < matrix[0].length; col++) {
      newBoard[col] = [];

      for (let row = 0; row < matrix.length; row++) {
        newBoard[col][row] = matrix[row][col];
      }
    }

    return newBoard;
  }

  moveUp() {
    const transposedBoard = this.transpose(this.board);
    const newBoard = [];

    transposedBoard.forEach((row) => {
      const newRow = this.processRow(row);

      newBoard.push(newRow);
    });

    const finalBoard = this.transpose(newBoard);

    this.applyMove(finalBoard);
  }

  moveDown() {
    const transposedBoard = this.transpose(this.board);
    const newBoard = [];

    transposedBoard.forEach((row) => {
      const reversedRow = [...row].reverse();
      const processed = this.processRow(reversedRow);
      const finalRow = processed.reverse();

      newBoard.push(finalRow);
    });

    const finalBoard = this.transpose(newBoard);

    this.applyMove(finalBoard);
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  addRandomTile() {
    const emptyCells = [];

    // eslint-disable-next-line no-shadow
    for (let row = 0; row < this.board.length; row++) {
      // eslint-disable-next-line no-shadow
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row: row, col: col });
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  start() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }
}
