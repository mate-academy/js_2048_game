'use strict';

const Status = {
  IDLE: 'idle',
  WON: 'won',
  LOST: 'lost',
  PLAYING: 'playing',
};

function includesDigit(arr, digit) {
  return arr.some((row) => row.some((cell) => cell === digit));
}

function checkIsGameLost(arr) {
  if (includesDigit(arr, 0)) {
    return false;
  }

  const n = arr.length;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (j + 1 < n && arr[i][j] === arr[i][j + 1]) {
        return false;
      }

      if (i + 1 < n && arr[i][j] === arr[i + 1][j]) {
        return false;
      }
    }
  }

  return true;
}

export default class Game {
  initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  status = Status.IDLE;
  score = 0;

  setScore(score) {
    this.score = score;
  }

  getScore() {
    return this.score;
  }

  setState(state) {
    this.initialState = state;
  }

  getState() {
    return this.initialState;
  }

  setStatus(gameStatus) {
    this.status = gameStatus;
  }

  getStatus() {
    if (includesDigit(this.getState(), 2048)) {
      return Status.WON;
    }

    if (!checkIsGameLost(this.getState())) {
      return Status.PLAYING;
    } else {
      return Status.LOST;
    }
  }

  start() {
    this.setState([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);

    this.generateRandEl();
    this.generateRandEl();
  }

  restart() {
    this.setState([
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ]);

    this.generateRandEl();
    this.generateRandEl();
  }

  transpose(arr) {
    const board = arr;
    const newBoard = [];

    for (let i = 0; i < board.length; i++) {
      newBoard[i] = [];

      for (let j = 0; j < board.length; j++) {
        newBoard[i][j] = board[j][i];
      }
    }

    return newBoard;
  }

  moveLeft() {
    const board = this.initialState;
    const boardLength = board.length;

    for (let i = 0; i < boardLength; i++) {
      let row = board[i].filter((cell) => cell !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;

          this.setScore(this.getScore() + row[j]);

          row[j + 1] = 0;
        }
      }

      row = row.filter((cell) => cell !== 0);

      while (row.length !== boardLength) {
        row.push(0);
      }

      board[i] = row;
    }

    this.initialState = board;
  }

  moveRight() {
    const board = this.initialState;
    const boardLength = board.length;

    for (let i = boardLength - 1; i >= 0; i--) {
      let row = board[i].filter((cell) => cell !== 0);

      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;

          this.setScore(this.getScore() + row[j]);

          row[j - 1] = 0;
        }
      }

      row = row.filter((cell) => cell !== 0);

      while (row.length !== boardLength) {
        row.unshift(0);
      }

      board[i] = row;
    }

    this.initialState = board;
  }
  moveUp() {
    const board = this.transpose(this.getState());
    const boardLength = board.length;

    for (let i = 0; i < boardLength; i++) {
      let row = board[i].filter((cell) => cell !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;

          this.setScore(this.getScore() + row[j]);

          row[j + 1] = 0;
        }
      }

      row = row.filter((cell) => cell !== 0);

      while (row.length !== boardLength) {
        row.push(0);
      }

      board[i] = row;
    }

    this.initialState = this.transpose(board);
  }
  moveDown() {
    const board = this.transpose(this.getState());
    const boardLength = board.length;

    for (let i = boardLength - 1; i >= 0; i--) {
      let row = board[i].filter((cell) => cell !== 0);

      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;

          this.setScore(this.getScore() + row[j]);

          row[j - 1] = 0;
        }
      }

      row = row.filter((cell) => cell !== 0);

      while (row.length !== boardLength) {
        row.unshift(0);
      }

      board[i] = row;
    }

    this.initialState = this.transpose(board);
  }

  generateRandEl() {
    function getRandElFromArr(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function getTwoOrFour() {
      const arr = Array.from({ length: 9 }, () => 2);

      arr.push(4);

      return getRandElFromArr(arr);
    }

    function getZerosArr(arr) {
      const zerosArr = [];

      arr.forEach((rowVal, rowInd) => {
        rowVal.forEach((cellVal, cellInd) => {
          if (cellVal === 0) {
            zerosArr.push([rowInd, cellInd]);
          }
        });
      });

      return zerosArr;
    }

    const zerosCoordsArr = getZerosArr(this.getState());
    const currentCoords = getRandElFromArr(zerosCoordsArr);

    this.getState()[currentCoords[0]][currentCoords[1]] = getTwoOrFour();
  }
}
