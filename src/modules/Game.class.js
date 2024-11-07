'use strict';

class Game {
  static gameStatuses = {
    idle: 'idle',
    playing: 'playing',
    lose: 'lose',
    win: 'win',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = Game.gameStatuses.idle;
  }

  saveBoardState() {
    return JSON.parse(JSON.stringify(this.board));
  }

  hasBoardChanged(oldBoard, newBoard) {
    for (let i = 0; i < oldBoard.length; i++) {
      for (let j = 0; j < oldBoard[i].length; j++) {
        if (oldBoard[i][j] !== newBoard[i][j]) {
          return true;
        }
      }
    }

    return false;
  }

  addCells(count = 1) {
    for (let i = 0; i < count; i++) {
      this.addRandomTitle();
    }
  }

  saveBoardState() {
    return structuredClone(this.board);
  }

  hasBoardChanged(oldBoard, newBoard) {
    for (let i = 0; i < oldBoard.length; i++) {
      for (let j = 0; j < oldBoard[i].length; j++) {
        if (oldBoard[i][j] !== newBoard[i][j]) {
          return true;
        }
      }
    }

    return false;
  }

  initializeGame(message = '') {
    this.board = this.createEmptyBoard();
    this.score = 0;

    this.addCells(2);

    this.updateScoreDisplay();
    this.showMessage(message);
  }

  updateScoreDisplay() {
    const scoreElement = document.querySelector('.game-score');

    if (scoreElement) {
      scoreElement.textContent = this.score;
    }
  }

  createEmptyBoard() {
    return Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
  }

  updateBoardDisplay() {
    const { board } = this;

    const cells = document.querySelectorAll('.field-cell');

    cells.forEach((cell, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;

      cell.textContent = board[row][col] === 0 ? '' : board[row][col];
      cell.className = 'field-cell';

      if (board[row][col] !== 0) {
        cell.classList.add(`tile-${board[row][col]}`);
      }
    });
  }

  addRandomTitle() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [randomRow, randomCol] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[randomRow][randomCol] = Math.random() < 0.9 ? 2 : 4;

    this.updateBoardDisplay();
  }

  moveLeft() {
    const { board } = this;
    const oldBoard = this.saveBoardState();
    const newBoard = Array.from({ length: 4 }, () => Array(4).fill(0));
    let score = 0;

    for (let i = 0; i < 4; i++) {
      let position = 0;

      for (let j = 0; j < 4; j++) {
        if (board[i][j] !== 0) {
          if (newBoard[i][position] === board[i][j]) {
            newBoard[i][position] *= 2;
            score += newBoard[i][position];

            position++;
          } else if (newBoard[i][position] === 0) {
            newBoard[i][position] = board[i][j];
          } else {
            position++;
            newBoard[i][position] = board[i][j];
          }
        }
      }
    }

    this.score += score;

    this.board = newBoard;

    if (this.hasBoardChanged(oldBoard, this.board)) {
      this.addRandomTitle();
    }

    this.updateBoardDisplay();
    this.updateScoreDisplay();

    return this.score;
  }

  moveRight() {
    const { board } = this;
    const oldBoard = this.saveBoardState();
    const newBoard = Array.from({ length: 4 }, () => Array(4).fill(0));
    let score = 0;

    for (let i = 0; i < 4; i++) {
      let position = 3;

      for (let j = 3; j >= 0; j--) {
        if (board[i][j] !== 0) {
          if (newBoard[i][position] === board[i][j]) {
            newBoard[i][position] *= 2;
            score += newBoard[i][position];
            position--;
          } else if (newBoard[i][position] === 0) {
            newBoard[i][position] = board[i][j];
          } else {
            position--;
            newBoard[i][position] = board[i][j];
          }
        }
      }
    }

    this.score += score;
    this.board = newBoard;

    if (this.hasBoardChanged(oldBoard, this.board)) {
      this.addRandomTitle();
    }

    this.updateScoreDisplay();

    return this.score;
  }

  moveUp() {
    const { board } = this;
    const oldBoard = this.saveBoardState();
    const newBoard = Array.from({ length: 4 }, () => Array(4).fill(0));
    let score = 0;

    for (let j = 0; j < 4; j++) {
      let position = 0;

      for (let i = 0; i < 4; i++) {
        if (board[i][j] !== 0) {
          if (newBoard[position][j] === board[i][j]) {
            newBoard[position][j] *= 2;
            score += newBoard[position][j];
            position++;
          } else if (newBoard[position][j] === 0) {
            newBoard[position][j] = board[i][j];
          } else {
            position++;
            newBoard[position][j] = board[i][j];
          }
        }
      }
    }

    this.score += score;
    this.board = newBoard;

    if (this.hasBoardChanged(oldBoard, this.board)) {
      this.addRandomTitle();
    }

    this.updateScoreDisplay();

    return this.score;
  }

  moveDown() {
    const { board } = this;
    const oldBoard = this.saveBoardState();
    const newBoard = Array.from({ length: 4 }, () => Array(4).fill(0));
    let score = 0;

    for (let j = 0; j < 4; j++) {
      let position = 3;

      for (let i = 3; i >= 0; i--) {
        if (board[i][j] !== 0) {
          if (newBoard[position][j] === board[i][j]) {
            newBoard[position][j] *= 2;
            score += newBoard[position][j];
            position--;
          } else if (newBoard[position][j] === 0) {
            newBoard[position][j] = board[i][j];
          } else {
            position--;
            newBoard[position][j] = board[i][j];
          }
        }
      }
    }

    this.score += score;
    this.board = newBoard;

    if (this.hasBoardChanged(oldBoard, this.board)) {
      this.addRandomTitle();
    }

    this.updateScoreDisplay();

    return this.score;
  }

  checkWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 2048) {
          this.showMessage(Game.gameStatuses.win);

          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          (i < 3 && this.board[i][j] === this.board[i + 1][j]) ||
          (j < 3 && this.board[i][j] === this.board[i][j + 1])
        ) {
          return false;
        }
      }
    }

    this.showMessage(Game.gameStatuses.lose);

    return true;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    if (this.checkWin()) {
      return Game.gameStatuses.win;
    } else if (this.checkLose()) {
      return Game.gameStatuses.lose;
    } else {
      return this.status;
    }
  }

  start() {
    this.status = Game.gameStatuses.playing;
    this.initializeGame('start');
  }

  restart() {
    this.status = Game.gameStatuses.idle;
    this.initializeGame('Game restarted');
  }

  showMessage(message) {
    const messageContainer = document.querySelector('.message-container');

    if (messageContainer) {
      messageContainer.querySelector('.message-start').classList.add('hidden');
      messageContainer.querySelector('.message-lose').classList.add('hidden');
      messageContainer.querySelector('.message-win').classList.add('hidden');
    }

    if (message === Game.gameStatuses.win) {
      messageContainer.querySelector('.message-win').classList.remove('hidden');
    } else if (message === Game.gameStatuses.lose) {
      messageContainer
        .querySelector('.message-lose')
        .classList.remove('hidden');
    }
  }
}

module.exports = Game;
