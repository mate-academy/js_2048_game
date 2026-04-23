'use strict';

class Game {
  constructor() {
    this.gameBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.bestScore = 0;
  }

  moveLeft() {
    let hasMoved = false;
    const originalBoard = this.gameBoard.map((row) => row.slice());

    for (let i = 0; i < this.gameBoard.length; i++) {
      this.gameBoard[i] = leftShift(this.gameBoard[i]);

      const mergeResult = leftMerge(this.gameBoard[i], this.score);

      this.gameBoard[i] = mergeResult.result;
      this.score = mergeResult.score;
      this.gameBoard[i] = leftShift(this.gameBoard[i]);

      if (
        originalBoard[i].some(
          (value, index) => value !== this.gameBoard[i][index],
        )
      ) {
        hasMoved = true;
      }
    }

    return hasMoved;
  }
  moveRight() {
    let hasMoved = false;
    const originalBoard = this.gameBoard.map((row) => row.slice());
    const reversedBoard = this.gameBoard.map((row) => row.slice().reverse());

    for (let i = 0; i < reversedBoard.length; i++) {
      reversedBoard[i] = leftShift(reversedBoard[i]);

      const mergeResult = leftMerge(reversedBoard[i], this.score);

      reversedBoard[i] = mergeResult.result;
      this.score = mergeResult.score;
      reversedBoard[i] = leftShift(reversedBoard[i]);
    }
    this.gameBoard = reversedBoard.map((row) => row.slice().reverse());

    for (let i = 0; i < this.gameBoard.length; i++) {
      if (
        originalBoard[i].some(
          (value, index) => value !== this.gameBoard[i][index],
        )
      ) {
        hasMoved = true;
      }
    }

    return hasMoved;
  }
  moveUp() {
    let hasMoved = false;
    const originalBoard = this.gameBoard.map((row) => row.slice());
    const transposedBoard = this.gameBoard[0].map((_, colIndex) => {
      return this.gameBoard.map((row) => row[colIndex]);
    });

    for (let i = 0; i < transposedBoard.length; i++) {
      transposedBoard[i] = leftShift(transposedBoard[i]);

      const mergeResult = leftMerge(transposedBoard[i], this.score);

      transposedBoard[i] = mergeResult.result;
      this.score = mergeResult.score;
      transposedBoard[i] = leftShift(transposedBoard[i]);
    }

    this.gameBoard = transposedBoard[0].map((_, colIndex) => {
      return transposedBoard.map((row) => row[colIndex]);
    });

    for (let i = 0; i < this.gameBoard.length; i++) {
      if (
        this.gameBoard[i].some(
          (value, index) => value !== originalBoard[i][index],
        )
      ) {
        hasMoved = true;
      }
    }

    return hasMoved;
  }
  moveDown() {
    let hasMoved = false;
    const originalBoard = this.gameBoard.map((row) => row.slice());
    const transposedBoard = this.gameBoard[0].map((_, colIndex) => {
      return this.gameBoard.map((row) => row[colIndex]);
    });
    const reversedBoard = transposedBoard.map((row) => row.slice().reverse());

    for (let i = 0; i < reversedBoard.length; i++) {
      reversedBoard[i] = leftShift(reversedBoard[i]);

      const mergeResult = leftMerge(reversedBoard[i], this.score);

      reversedBoard[i] = mergeResult.result;
      this.score = mergeResult.score;
      reversedBoard[i] = leftShift(reversedBoard[i]);
    }
    this.gameBoard = reversedBoard.map((row) => row.slice().reverse());

    this.gameBoard = this.gameBoard[0].map((_, colIndex) => {
      return this.gameBoard.map((row) => row[colIndex]);
    });

    for (let i = 0; i < this.gameBoard.length; i++) {
      if (
        this.gameBoard[i].some(
          (value, index) => value !== originalBoard[i][index],
        )
      ) {
        hasMoved = true;
      }
    }

    return hasMoved;
  }

  getBestScore() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
    }

    return this.bestScore;
  }

  RadomGeneration() {
    let isEmpty = false;

    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard[i].length; j++) {
        if (this.gameBoard[i][j] === 0) {
          isEmpty = true;
        }
      }
    }

    if (!isEmpty && this.isGameOver()) {
      // console.log('No empty place and no moves left');

      return;
    }

    if (isEmpty) {
      let emptyPlace = false;
      let randomNum;

      while (!emptyPlace) {
        randomNum = Math.floor(Math.random() * 16);

        if (this.gameBoard[Math.floor(randomNum / 4)][randomNum % 4] === 0) {
          emptyPlace = true;
        }
      }

      if (Math.random() < 0.1) {
        this.gameBoard[Math.floor(randomNum / 4)][randomNum % 4] = 2;
      } else {
        this.gameBoard[Math.floor(randomNum / 4)][randomNum % 4] = 1;
      }
    }
  }

  getState() {}

  getStatus() {}

  start() {}

  restart() {
    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard[i].length; j++) {
        this.gameBoard[i][j] = 0;
      }
    }
    this.score = 0;
  }

  isGameOver() {
    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard[i].length; j++) {
        if (this.gameBoard[i][j] === 0) {
          return false;
        }

        if (
          j < this.gameBoard[i].length - 1 &&
          this.gameBoard[i][j + 1] === this.gameBoard[i][j] &&
          this.gameBoard[i][j] !== 0
        ) {
          return false;
        }

        if (
          i < this.gameBoard.length - 1 &&
          this.gameBoard[i + 1][j] === this.gameBoard[i][j] &&
          this.gameBoard[i][j] !== 0
        ) {
          return false;
        }
      }
    }

    return true;
  }

  isWin() {
    for (let i = 0; i < this.gameBoard.length; i++) {
      for (let j = 0; j < this.gameBoard[i].length; j++) {
        if (this.gameBoard[i][j] === 11) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;

function leftShift(array) {
  if (array.length !== 4) {
    // console.error('Array length must be 4');

    return;
  }

  const result = [];

  for (let i = 0; i < array.length; i++) {
    if (array[i] !== 0) {
      result.push(array[i]);
    }
  }

  while (result.length < 4) {
    result.push(0);
  }

  return result;
}

function leftMerge(array, score) {
  if (array.length !== 4) {
    // console.error('Array length must be 4');
    return;
  }

  const result = [...array];
  let localScore = score;

  for (let i = 0; i < array.length - 1; i++) {
    if (array[i] === array[i + 1] && array[i] !== 0) {
      result[i] = array[i] + 1;
      localScore += Math.pow(2, result[i]);
      // console.log(score);
      result[i + 1] = 0;
      i++;
    }
  }

  return { result, score: localScore };
}
