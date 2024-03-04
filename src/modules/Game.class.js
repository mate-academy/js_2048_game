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
    this.initialBoard = initialState;

    this.board = JSON.parse(JSON.stringify(initialState));

    this.boardScore = 0;

    this.currentStatus = 'idle';

    this.isAbleToMove = true;
    this.isGameActive = false;
    this.isGameWon = false;
    this.isGameLost = false;
  }

  moveLeft() {
    if (this.isGameActive) {
      this.moveTo('left');
    }
  }
  moveRight() {
    if (this.isGameActive) {
      this.moveTo('right');
    }
  }
  moveUp() {
    if (this.isGameActive) {
      this.moveTo('up');
    }
  }
  moveDown() {
    if (this.isGameActive) {
      this.moveTo('down');
    }
  }

  getScore() {
    return this.boardScore;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    switch (true) {
      case this.isGameWon:
        this.currentStatus = 'win';
        break;
      case this.isGameLost:
        this.currentStatus = 'lose';
        break;
      case this.isGameActive:
        this.currentStatus = 'playing';
        break;
      default:
        this.currentStatus = 'idle';
        break;
    }

    return this.currentStatus;
  }

  start() {
    this.board = JSON.parse(JSON.stringify(this.initialBoard));

    this.isGameActive = true;
    this.placeNewCell();
    this.placeNewCell();
  }

  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialBoard));
    this.boardScore = 0;

    this.currentStatus = 'idle';
    this.isGameActive = false;
    this.isGameWon = false;
    this.isGameLost = false;
  }

  placeNewCell() {
    let randomRow, randomColumn;

    do {
      randomRow = Math.floor(Math.random() * 4);
      randomColumn = Math.floor(Math.random() * 4);
    } while (this.board[randomRow][randomColumn] !== 0);

    this.board[randomRow][randomColumn] = this.createCell();
  }

  createCell() {
    const randomValue = Math.random();

    return randomValue < 0.1 ? 4 : 2;
  }

  moveTo(direction) {
    if (!this.isGameActive) {
      return;
    }

    const numCols = this.board[0].length;
    let currentTable = JSON.parse(JSON.stringify(this.board));
    let addScore = 0;

    const transpose = (table) => {
      return table[0].map((_, colIndex) => table.map((row) => row[colIndex]));
    };

    const reverseRow = (table) => {
      return table.map((row) => row.slice().reverse());
    };

    const moveTable = (table) => {
      const newTable = table.map((row) => {
        let newRow = row.filter((num) => num !== 0);
        const zerosToAdd = numCols - newRow.length;

        newRow = [...Array(zerosToAdd).fill(0), ...newRow];

        for (let i = newRow.length; i >= 0; i--) {
          if (newRow[i - 1] === newRow[i]) {
            newRow[i - 1] *= 2;
            newRow[i] = 0;
            addScore += newRow[i - 1];
            i--;
          }
        }
        newRow = newRow.filter((num) => num !== 0);

        const zerosToAddEnd = numCols - newRow.length;

        newRow = [...Array(zerosToAddEnd).fill(0), ...newRow];

        return newRow;
      });

      return newTable;
    };

    const isGameOver = () => {
      const GAME_FIELD = 4;

      for (let i = 0; i < GAME_FIELD; i++) {
        for (let j = 0; j < GAME_FIELD; j++) {
          if (this.board[i][j] === 0) {
            return false;
          }
        }
      }

      for (let i = 0; i < GAME_FIELD; i++) {
        for (let j = 0; j < GAME_FIELD; j++) {
          if (j < GAME_FIELD - 1 && this.board[i][j] === this.board[i][j + 1]) {
            return false;
          }

          if (i < GAME_FIELD - 1 && this.board[i][j] === this.board[i + 1][j]) {
            return false;
          }
        }
      }

      this.isGameActive = false;
      this.isGameLost = true;

      return true;
    };

    const makeMove = (moveToSide) => {
      if (JSON.stringify(moveToSide) === JSON.stringify(currentTable)) {
        return;
      }

      this.board = moveToSide;
      currentTable = moveToSide;

      if (this.board.flat().includes(2048)) {
        this.isGameActive = false;
        this.isGameWon = true;

        this.getStatus();

        return;
      }

      this.placeNewCell();

      if (!isGameOver()) {
        this.isAbleToMove = false;
      }
    };

    switch (direction) {
      case 'up':
        const moveUp = transpose(
          reverseRow(moveTable(reverseRow(transpose(currentTable)))),
        );

        makeMove(moveUp);

        this.boardScore += addScore;
        break;
      case 'down':
        const moveDown = transpose(moveTable(transpose(currentTable)));

        makeMove(moveDown);

        this.boardScore += addScore;
        break;
      case 'right':
        const moveRight = moveTable(currentTable);

        makeMove(moveRight);

        this.boardScore += addScore;
        break;
      case 'left':
        const moveLeft = reverseRow(moveTable(reverseRow(currentTable)));

        makeMove(moveLeft);

        this.boardScore += addScore;
        break;
    }
  }
}

module.exports = Game;
