'use strict';

class Game {
  static get statuses() {
    return {
      IDLE: 'idle',
      PLAYING: 'playing',
      WIN: 'win',
      LOSE: 'lose',
    };
  }

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
    this.initialState = initialState.map((row) => [...row]);
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

    this.state.forEach((everyRow, rowIndex) => {
      everyRow.forEach((cell, colIndex) => {
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
    const tileNewValue = Math.random() < 0.9 ? 2 : 4;

    this.state[row][col] = tileNewValue;
  }

  moveLeft() {
    if (this.status !== Game.statuses.PLAYING) {
      return;
    }

    const previousState = this.state.map((row) => [...row]);
    const newState = [];
    let moveScore = 0;

    for (let r = 0; r < this.size; r++) {
      const row = this.state[r].filter((cell) => cell !== 0);
      const mergedRow = [];

      for (let c = 0; c < row.length; c++) {
        if (c + 1 < row.length && row[c] === row[c + 1]) {
          const mergedValue = row[c] * 2;

          mergedRow.push(mergedValue);
          moveScore += mergedValue;
          c++;
        } else {
          mergedRow.push(row[c]);
        }
      }

      while (mergedRow.length < this.size) {
        mergedRow.push(0);
      }

      newState.push(mergedRow);
    }

    if (!this.boardsAreEqual(previousState, newState)) {
      this.state = newState;
      this.updateScore(moveScore);
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveRight() {
    if (this.status !== Game.statuses.PLAYING) {
      return;
    }

    const previousState = this.state.map((row) => [...row]);
    const newState = [];
    let moveScore = 0;

    for (let r = 0; r < this.size; r++) {
      const row = this.state[r].filter((cell) => cell !== 0);

      const mergedRow = [];

      for (let c = row.length - 1; c >= 0; c--) {
        if (c - 1 >= 0 && row[c] === row[c - 1]) {
          const mergedValue = row[c] * 2;

          mergedRow.unshift(mergedValue);
          moveScore += mergedValue;
          c--;
        } else {
          mergedRow.unshift(row[c]);
        }
      }

      while (mergedRow.length < this.size) {
        mergedRow.unshift(0);
      }

      newState.push(mergedRow);
    }

    if (!this.boardsAreEqual(previousState, newState)) {
      this.state = newState;
      this.updateScore(moveScore);
      this.addRandomTile();
      this.checkStatus();
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
    this.score += newScore;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
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
