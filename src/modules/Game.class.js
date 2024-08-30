'use strict';

class Game {
  static GAME_STATUS = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.status = Game.GAME_STATUS.idle;
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.score = 0;
  }

  moveLeft() {
    if (this.status !== Game.GAME_STATUS.playing) {
      return;
    }

    const newState = [];
    let hasMoved = false;

    for (const row of this.state) {
      let filteredRow = row.filter((num) => num !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          filteredRow[i + 1] = 0;
          this.score += filteredRow[i];
        }
      }

      filteredRow = filteredRow.filter((num) => num !== 0);

      const newRow = [
        ...filteredRow,
        ...Array(row.length - filteredRow.length).fill(0),
      ];

      newState.push(newRow);
    }

    newState.forEach((row, rowIndex) => {
      row.forEach((item, colIndex) => {
        if (item !== this.state[rowIndex][colIndex]) {
          hasMoved = true;
        }
      });
    });

    this.setState(newState);

    if (hasMoved) {
      this.addCell();
    }

    this.updateStatus();
  }
  moveRight() {
    if (this.status !== Game.GAME_STATUS.playing) {
      return;
    }

    const newState = [];
    let hasMoved = false;

    for (const row of this.state) {
      let filteredRow = row.filter((num) => num !== 0);

      for (let i = filteredRow.length - 1; i > 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          filteredRow[i] *= 2;
          filteredRow[i - 1] = 0;
          this.score += filteredRow[i];
        }
      }

      filteredRow = filteredRow.filter((num) => num !== 0);

      const newRow = [
        ...Array(row.length - filteredRow.length).fill(0),
        ...filteredRow,
      ];

      newState.push(newRow);
    }

    newState.forEach((row, rowIndex) => {
      row.forEach((item, colIndex) => {
        if (item !== this.state[rowIndex][colIndex]) {
          hasMoved = true;
        }
      });
    });

    this.setState(newState);

    if (hasMoved) {
      this.addCell();
    }

    this.updateStatus();
  }
  moveUp() {
    if (this.status !== Game.GAME_STATUS.playing) {
      return;
    }

    const newTransposedState = [];
    const transposedState = this.#transposeState(this.state);
    let hasMoved = false;

    for (const row of transposedState) {
      let filteredRow = row.filter((num) => num !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          filteredRow[i + 1] = 0;
          this.score += filteredRow[i];
        }
      }

      filteredRow = filteredRow.filter((num) => num !== 0);

      const newRow = [
        ...filteredRow,
        ...Array(row.length - filteredRow.length).fill(0),
      ];

      newTransposedState.push(newRow);
    }

    const newState = this.#transposeState(newTransposedState);

    newState.forEach((row, rowIndex) => {
      row.forEach((item, colIndex) => {
        if (item !== this.state[rowIndex][colIndex]) {
          hasMoved = true;
        }
      });
    });

    this.setState(newState);

    if (hasMoved) {
      this.addCell();
    }

    this.updateStatus();
  }
  moveDown() {
    if (this.status !== Game.GAME_STATUS.playing) {
      return;
    }

    const newTransposedState = [];
    const transposedState = this.#transposeState(this.state);
    let hasMoved = false;

    for (const row of transposedState) {
      let filteredRow = row.filter((num) => num !== 0);

      for (let i = filteredRow.length - 1; i > 0; i--) {
        if (filteredRow[i] === filteredRow[i - 1]) {
          filteredRow[i] *= 2;
          filteredRow[i - 1] = 0;
          this.score += filteredRow[i];
        }
      }

      filteredRow = filteredRow.filter((num) => num !== 0);

      const newRow = [
        ...Array(row.length - filteredRow.length).fill(0),
        ...filteredRow,
      ];

      newTransposedState.push(newRow);
    }

    const newState = this.#transposeState(newTransposedState);

    newState.forEach((row, rowIndex) => {
      row.forEach((item, colIndex) => {
        if (item !== this.state[rowIndex][colIndex]) {
          hasMoved = true;
        }
      });
    });

    this.setState(newState);

    if (hasMoved) {
      this.addCell();
    }

    this.updateStatus();
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

  setState(newState) {
    this.state = newState.map((row) => [...row]);
  }

  #transposeState(matrix) {
    return matrix[0].map((_, colIndex) => {
      return matrix.map((row) => row[colIndex]);
    });
  }

  updateStatus() {
    let isWin = false;
    let canMerge = false;
    let hasEmptyCell = false;

    this.state.forEach((row, rowIndex) => {
      row.forEach((item, colIndex) => {
        if (item === 2048) {
          isWin = true;
        }

        if (item === 0) {
          hasEmptyCell = true;
        }

        if (
          rowIndex < this.state.length - 1 &&
          item === this.state[rowIndex + 1][colIndex]
        ) {
          canMerge = true;
        }

        if (
          colIndex < row.length - 1 &&
          item === this.state[rowIndex][colIndex + 1]
        ) {
          canMerge = true;
        }
      });
    });

    if (isWin) {
      this.status = Game.GAME_STATUS.win;

      return;
    }

    if (!canMerge && !hasEmptyCell) {
      this.status = Game.GAME_STATUS.lose;
    }
  }

  addCell() {
    const zeroPositions = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          zeroPositions.push({ row: i, col: j });
        }
      }
    }

    if (zeroPositions.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * zeroPositions.length);
    const position = zeroPositions[randomIndex];

    this.state[position.row][position.col] = Math.random() < 0.9 ? 2 : 4;
  }

  start() {
    this.status = Game.GAME_STATUS.playing;

    this.addCell();
    this.addCell();
  }

  restart() {
    this.status = Game.GAME_STATUS.idle;
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
  }
}

module.exports = Game;
