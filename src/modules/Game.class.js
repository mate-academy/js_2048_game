'use strict';

class Game {
  /* static statuses = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  }; */

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    if (!Game.statuses) {
      Game.statuses = {
        IDLE: 'idle',
        PLAYING: 'playing',
        WIN: 'win',
      };

      this.size = 4;
      this.score = 0;
      this.status = Game.statuses.IDLE;
      this.state = initialState.map((row) => [...row]);
    }
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((everyRow, rowIndex) => {
      everyRow.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
    }

    const radomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[radomIndex];
    const tileNewValue = Math.random() < 0.9 ? 2 : 4;

    this.state[row][col] = tileNewValue;
  }

  moveLeft() {
    if (this.status === Game.statuses.PLAYING) {
      const previousState = this.state.map((row) => [...row]);
      const movedBoard = [];
      const mergedBoard = [];

      for (let row = 0; row < this.size; row++) {
        const movedRow = this.state[row].filter((cell) => cell !== 0);

        while (movedRow.length < this.size) {
          movedRow.push(0);
        }

        movedBoard.push(movedRow);
      }

      for (let row = 0; row < this.size; row++) {
        const notZeroRow = movedBoard[row].filter((cell) => cell !== 0);

        for (let i = 0; i < notZeroRow.length; i++) {
          if (notZeroRow[i] === notZeroRow[i + 1]) {
            notZeroRow[i] = notZeroRow[i] * 2;
            notZeroRow[i + 1] = 0;
            this.updateScore(notZeroRow[i]);
          }
        }

        while (notZeroRow.length < this.size) {
          notZeroRow.push(0);
        }

        mergedBoard.push(notZeroRow);
      }

      if (!this.boardsAreEqual(previousState, mergedBoard)) {
        this.state = mergedBoard;
        this.addRandomTile();
        this.checkStatus();
      }
    }
  }

  moveRight() {
    if (this.status === Game.statuses.PLAYING) {
      const previousState = this.state.map((row) => [...row]);
      const movedBoard = [];
      const mergedBoard = [];

      for (let row = 0; row < this.size; row++) {
        const movedRow = this.state[row].filter((cell) => cell !== 0);

        while (movedRow.length < this.size) {
          movedRow.unshift(0);
        }

        movedBoard.push(movedRow);
      }

      for (let row = 0; row < this.size; row++) {
        const notZeroRow = movedBoard[row].filter((cell) => cell !== 0);

        for (let i = notZeroRow.length - 1; i > 0; i--) {
          if (notZeroRow[i] === notZeroRow[i - 1]) {
            notZeroRow[i] *= 2;
            notZeroRow.splice(i - 1, 1);
            notZeroRow.unshift(0);
            this.updateScore(notZeroRow[i]);
          }
        }

        while (notZeroRow.length < this.size) {
          notZeroRow.unshift(0);
        }

        mergedBoard.push(notZeroRow);
      }

      if (!this.boardsAreEqual(previousState, mergedBoard)) {
        this.state = mergedBoard;
        this.addRandomTile();
        this.checkStatus();
      }
    }
  }

  moveUp() {
    if (this.status === Game.statuses.PLAYING) {
      const previousState = this.state.map((row) => [...row]);

      for (let col = 0; col < this.size; col++) {
        const newColumn = [];

        for (let row = 0; row < this.size; row++) {
          if (this.state[row][col] !== 0) {
            newColumn.push(this.state[row][col]);
          }
        }

        while (newColumn.length < this.size) {
          newColumn.push(0);
        }

        for (let row = 0; row < this.size; row++) {
          this.state[row][col] = newColumn[row];
        }
      }

      for (let col = 0; col < this.size; col++) {
        const newColumn = [];
        let row = 0;

        while (row < this.size) {
          if (
            row < this.size - 1 &&
            this.state[row][col] === this.state[row + 1][col]
          ) {
            newColumn.push(this.state[row][col] * 2);
            this.updateScore(this.state[row][col] * 2);
            row += 2;
          } else {
            newColumn.push(this.state[row][col]);
            row++;
          }
        }

        while (newColumn.length < this.size) {
          newColumn.push(0);
        }

        for (let r = 0; r < this.size; r++) {
          this.state[r][col] = newColumn[r];
        }
      }

      if (!this.boardsAreEqual(previousState, this.state)) {
        this.addRandomTile();
        this.checkStatus();
      }
    }
  }

  moveDown() {
    if (this.status === Game.statuses.PLAYING) {
      const previousState = this.state.map((row) => [...row]);

      for (let col = 0; col < this.size; col++) {
        const newColumn = [];

        for (let row = 0; row < this.size; row++) {
          if (this.state[row][col] !== 0) {
            newColumn.push(this.state[row][col]);
          }
        }

        while (newColumn.length < this.size) {
          newColumn.unshift(0);
        }

        for (let row = 0; row < this.size; row++) {
          this.state[row][col] = newColumn[row];
        }
      }

      for (let col = 0; col < this.size; col++) {
        const newColumn = [];
        let row = this.size - 1;

        while (row >= 0) {
          if (row > 0 && this.state[row][col] === this.state[row - 1][col]) {
            newColumn.unshift(this.state[row][col] * 2);
            this.updateScore(this.state[row][col] * 2);
            row -= 2;
          } else {
            newColumn.unshift(this.state[row][col]);
            row--;
          }
        }

        while (newColumn.length < this.size) {
          newColumn.unshift(0);
        }

        for (let r = 0; r < this.size; r++) {
          this.state[r][col] = newColumn[r];
        }
      }

      if (!this.boardsAreEqual(previousState, this.state)) {
        this.addRandomTile();
        this.checkStatus();
      }
    }
  }

  getScore() {
    return this.score;
  }

  updateScore(newScore) {
    this.score = this.score + newScore;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.addRandomTile();
    this.addRandomTile();
    this.status = Game.statuses.PLAYING;
  }

  restart() {
    this.score = 0;
    this.state = this.initialState.map((row) => [...row]);
    this.status = Game.statuses.IDLE;
  }

  boardsAreEqual(previousBoard, newBoard) {
    for (let row = 0; row < previousBoard.length; row++) {
      for (let col = 0; col < previousBoard[row].length; col++) {
        if (previousBoard[row][col] !== newBoard[row][col]) {
          return false;
        }
      }
    }

    return true;
  }

  checkStatus() {
    let hasEmptyCell = false;
    let canMove = false;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 2048) {
          this.status = Game.statuses.WIN;

          return;
        }

        if (this.state[r][c] === 0) {
          hasEmptyCell = true;
        }

        if (
          (r < 3 && this.state[r][c] === this.state[r + 1][c]) ||
          (c < 3 && this.state[r][c] === this.state[r][c + 1])
        ) {
          canMove = true;
        }
      }
    }

    if (!hasEmptyCell && !canMove) {
      this.status = Game.statuses.LOSE;
    }
  }
}

module.exports = Game;
