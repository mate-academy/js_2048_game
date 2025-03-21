'use strict';

export default class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';

    const startButton = document.querySelector('.button.start');

    if (startButton) {
      startButton.classList.add('restart');
    }
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';

    this.addRandomTile();
    this.addRandomTile();

    const restartButton = document.querySelector('.button.restart');

    if (restartButton) {
      restartButton.click();
    }
  }

  addRandomTile() {
    const emptyCells = [];

    this.board.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) {
          emptyCells.push([i, j]);
        }
      });
    });

    if (emptyCells.length > 0) {
      const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
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

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    let boardChanged = false;
    let newBoard = this.board.map((row) => [...row]);
    let totalScoreIncrease = 0;

    if (direction === 'left' || direction === 'right') {
      newBoard = newBoard.map((row) => {
        const { shiftedRow, scoreIncrease } = this.shiftRow(
          row,
          direction === 'right',
        );

        totalScoreIncrease += scoreIncrease;

        return shiftedRow;
      });
    } else {
      newBoard = this.transpose(newBoard);

      newBoard = newBoard.map((row) => {
        const { shiftedRow, scoreIncrease } = this.shiftRow(
          row,
          direction === 'down',
        );

        totalScoreIncrease += scoreIncrease;

        return shiftedRow;
      });
      newBoard = this.transpose(newBoard);
    }

    if (this.boardsAreDifferent(this.board, newBoard)) {
      this.board = newBoard;
      boardChanged = true;
      this.addRandomTile();
      this.checkGameStatus();
    }

    if (boardChanged) {
      this.score += totalScoreIncrease;
    }
  }

  shiftRow(row, reverse) {
    let shiftedRow = row.filter((cell) => cell !== 0);

    if (reverse) {
      shiftedRow.reverse();
    }

    let scoreIncrease = 0;

    for (let i = 0; i < shiftedRow.length - 1; i++) {
      if (shiftedRow[i] === shiftedRow[i + 1]) {
        shiftedRow[i] *= 2;
        scoreIncrease += shiftedRow[i];
        shiftedRow[i + 1] = 0;
      }
    }

    shiftedRow = shiftedRow.filter((cell) => cell !== 0);

    while (shiftedRow.length < 4) {
      shiftedRow.push(0);
    }

    if (reverse) {
      shiftedRow.reverse();
    }

    return { shiftedRow, scoreIncrease };
  }

  transpose(board) {
    return board[0].map((_, i) => board.map((row) => row[i]));
  }

  boardsAreDifferent(board1, board2) {
    return JSON.stringify(board1) !== JSON.stringify(board2);
  }

  checkGameStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (this.isGameOver()) {
      this.status = 'lose';
    }
  }

  isGameOver() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return false;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return false;
        }
      }
    }

    return true;
  }
}
