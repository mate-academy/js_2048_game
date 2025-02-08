'use strict';

class Game {
  static statuses = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.size = 4;
    this.score = 0;
    this.status = Game.statuses.IDLE;
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
  }

  start() {
    this.addRandomTile();
    this.addRandomTile();
    this.status = Game.statuses.PLAYING;
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = Game.statuses.IDLE;
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((eachRow, rowIndex) => {
      eachRow.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    const newTileValue = Math.random() < 0.9 ? 2 : 4;

    this.state[row][col] = newTileValue;
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

  updateScore(value) {
    this.score = this.score + value;
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
    let canMove = false;
    let hasEmptyCells = false;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 2048) {
          this.status = Game.statuses.WIN;

          return;
        }

        if (this.state[r][c] === 0) {
          hasEmptyCells = true;
        }

        if (
          (r < 3 && this.state[r][c] === this.state[r + 1][c]) ||
          (c < 3 && this.state[r][c] === this.state[r][c + 1])
        ) {
          canMove = true;
        }
      }
    }

    if (!canMove && !hasEmptyCells) {
      this.status = Game.statuses.LOSE;
    }
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
        const nonZeroRow = movedBoard[row].filter((cell) => cell !== 0);

        for (let i = 0; i < nonZeroRow.length; i++) {
          if (nonZeroRow[i] === nonZeroRow[i + 1]) {
            nonZeroRow[i] *= 2;
            nonZeroRow.splice(i + 1, 1);
            this.updateScore(nonZeroRow[i]);
          }
        }

        while (nonZeroRow.length < this.size) {
          nonZeroRow.push(0);
        }
        mergedBoard.push(nonZeroRow);
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
        const nonZeroRow = movedBoard[row].filter((cell) => cell !== 0);

        for (let i = nonZeroRow.length - 1; i > 0; i--) {
          if (nonZeroRow[i] === nonZeroRow[i - 1]) {
            nonZeroRow[i] *= 2;
            nonZeroRow.splice(i - 1, 1);
            nonZeroRow.unshift(0);
            this.updateScore(nonZeroRow[i]);
          }
        }

        while (nonZeroRow.length < this.size) {
          nonZeroRow.unshift(0);
        }
        mergedBoard.push(nonZeroRow);
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
}

module.exports = Game;
