'use strict';

class Game {
  constructor(initialState = this.generateEmptyBoard()) {
    this.initialState = initialState;
    this.state = this.copyState(this.initialState);
    this.board = this.state;
    this.score = 0;
    this.status = 'idle';
    this.firstMove = true;
    this.moved = false;
  }

  copyState(state) {
    return state.map((row) => [...row]);
  }

  generateEmptyBoard() {
    return Array(4)
      .fill()
      .map(() => Array(4).fill(0));
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

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }
    this.handleFirstMove();

    const newBoard = this.board.map((row) => this.processRow(row));

    this.handleMove(newBoard);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }
    this.handleFirstMove();

    const newBoard = this.board.map((row) => this.processRowRight(row));

    this.handleMove(newBoard);
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }
    this.handleFirstMove();

    const transposedBoard = this.transpose(this.board);
    const newBoard = transposedBoard.map((row) => this.processRow(row));

    this.handleMove(this.transpose(newBoard));
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }
    this.handleFirstMove();

    const transposedBoard = this.transpose(this.board);
    const newBoard = transposedBoard.map((row) => this.processRowRight(row));

    this.handleMove(this.transpose(newBoard));
  }

  handleMove(newBoard) {
    if (this.isBoardChanged(this.board, newBoard)) {
      this.board = newBoard;
      this.addRandomCell();
      this.checkWin();
      this.checkGameOver();
      this.moved = true;
    } else {
      this.moved = false;
    }
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomCell();
      this.addRandomCell();

      const startMessage = document.querySelector('.message-start');

      if (startMessage) {
        startMessage.classList.add('hidden');
      }
    }
  }

  restart() {
    this.board = this.initialState;
    this.score = 0;
    this.status = 'idle';
  }

  addRandomCell() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
      this.animateCell(row, col);
    }
  }

  processRow(row) {
    const filteredRow = row.filter((cell) => cell !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        this.score += filteredRow[i];
        filteredRow.splice(i + 1, 1);
      }
    }

    while (filteredRow.length < 4) {
      filteredRow.push(0);
    }

    return filteredRow;
  }

  processRowRight(row) {
    const reversedRow = [...row].reverse();
    const processedRow = this.processRow(reversedRow);

    return processedRow.reverse();
  }

  handleFirstMove() {
    if (this.firstMove) {
      this.firstMove = false;

      const startButton = document.querySelector('.button.start');

      if (startButton) {
        startButton.textContent = 'Restart';
        startButton.classList.add('restart');
      }
    }
  }

  checkGameOver() {
    if (!this.hasAvailableMoves()) {
      this.status = 'lose';

      const messageLose = document.querySelector('.message-lose');

      if (messageLose) {
        messageLose.classList.remove('hidden');
      }
    }
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          const messageWin = document.querySelector('.message-win');

          if (messageWin) {
            messageWin.classList.remove('hidden');
          }

          return;
        }
      }
    }
  }

  hasAvailableMoves() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return true;
        }

        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return true;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  isBoardChanged(oldBoard, newBoard) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (oldBoard[row][col] !== newBoard[row][col]) {
          return true;
        }
      }
    }

    return false;
  }

  transpose(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  animateCell(row, col) {
    const cell = document.querySelector(
      `.field-row:nth-child(${row + 1}) .field-cell:nth-child(${col + 1})`,
    );

    if (cell) {
      cell.classList.add('new-cell');
      setTimeout(() => cell.classList.remove('new-cell'), 500);
    }
  }
}

module.exports = Game;
