'use strict';
class Game {
  constructor(initialState) {
    this.board =
      initialState || Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft(check = '') {
    const stateBeforeMove = this.board.map((row) => [...row]);
    const stateAfterMove = this.board.map((row) => [...row]);

    for (let i = 0; i < stateAfterMove.length; i++) {
      for (let j = 0; j < stateAfterMove.length; j++) {
        if (stateAfterMove[i][j] === 0 && stateAfterMove[i][j + 1] > 0) {
          stateAfterMove[i][j] = stateAfterMove[i][j + 1];
          stateAfterMove[i][j + 1] = 0;
        } else if (stateAfterMove[i][j] === 0 && stateAfterMove[i][j + 2] > 0) {
          stateAfterMove[i][j] = stateAfterMove[i][j + 2];
          stateAfterMove[i][j + 2] = 0;
        } else if (stateAfterMove[i][j] === 0 && stateAfterMove[i][j + 3] > 0) {
          stateAfterMove[i][j] = stateAfterMove[i][j + 3];
          stateAfterMove[i][j + 3] = 0;
        }

        if (stateAfterMove[i][j] === stateAfterMove[i][j + 1]) {
          stateAfterMove[i][j] = 2 * stateAfterMove[i][j];
          stateAfterMove[i][j + 1] = 0;

          if (check) {
            this.setScore(this.score + stateAfterMove[i][j]);
          }
        } else if (
          stateAfterMove[i][j] === stateAfterMove[i][j + 2] &&
          stateAfterMove[i][j + 1] === 0
        ) {
          stateAfterMove[i][j] = 2 * stateAfterMove[i][j];
          stateAfterMove[i][j + 2] = 0;

          if (check) {
            this.setScore(this.score + stateAfterMove[i][j]);
          }
        } else if (
          stateAfterMove[i][j] === stateAfterMove[i][j + 3] &&
          stateAfterMove[i][j + 1] === 0 &&
          stateAfterMove[i][j + 2] === 0
        ) {
          stateAfterMove[i][j] = 2 * stateAfterMove[i][j];
          stateAfterMove[i][j + 3] = 0;

          if (check) {
            this.setScore(this.score + stateAfterMove[i][j]);
          }
        }
      }
    }

    if (check) {
      return this.boardsEqual(stateBeforeMove, stateAfterMove);
    }

    if (!this.boardsEqual(stateBeforeMove, stateAfterMove)) {
      this.board = stateAfterMove;
      this.generateTile();
    }

    if (this.lose()) {
      this.setStatus('lose');
    }

    if (this.win()) {
      this.setStatus('win');
    }
  }

  canMoveLeft() {
    return this.moveLeft('check');
  }

  moveRight(check = '') {
    const stateBeforeMove = this.board.map((row) => [...row]);
    const stateAfterMove = this.board.map((row) => [...row]);

    for (let i = 0; i < stateAfterMove.length; i++) {
      for (let j = stateAfterMove.length - 1; j >= 0; j--) {
        if (stateAfterMove[i][j] === 0 && stateAfterMove[i][j - 1] > 0) {
          stateAfterMove[i][j] = stateAfterMove[i][j - 1];
          stateAfterMove[i][j - 1] = 0;
        } else if (stateAfterMove[i][j] === 0 && stateAfterMove[i][j - 2] > 0) {
          stateAfterMove[i][j] = stateAfterMove[i][j - 2];
          stateAfterMove[i][j - 2] = 0;
        } else if (stateAfterMove[i][j] === 0 && stateAfterMove[i][j - 3] > 0) {
          stateAfterMove[i][j] = stateAfterMove[i][j - 3];
          stateAfterMove[i][j - 3] = 0;
        }

        if (stateAfterMove[i][j] === stateAfterMove[i][j - 1]) {
          stateAfterMove[i][j] = 2 * stateAfterMove[i][j];
          stateAfterMove[i][j - 1] = 0;

          if (check) {
            this.setScore(this.score + stateAfterMove[i][j]);
          }
        } else if (
          stateAfterMove[i][j] === stateAfterMove[i][j - 2] &&
          stateAfterMove[i][j - 1] === 0
        ) {
          stateAfterMove[i][j] = 2 * stateAfterMove[i][j];
          stateAfterMove[i][j - 2] = 0;

          if (check) {
            this.setScore(this.score + stateAfterMove[i][j]);
          }
        } else if (
          stateAfterMove[i][j] === stateAfterMove[i][j - 3] &&
          stateAfterMove[i][j - 1] === 0 &&
          stateAfterMove[i][j - 2] === 0
        ) {
          stateAfterMove[i][j] = 2 * stateAfterMove[i][j];
          stateAfterMove[i][j - 3] = 0;

          if (check) {
            this.setScore(this.score + stateAfterMove[i][j]);
          }
        }
      }
    }

    if (check) {
      return this.boardsEqual(stateBeforeMove, stateAfterMove);
    }

    if (!this.boardsEqual(stateBeforeMove, stateAfterMove)) {
      this.board = stateAfterMove;
      this.generateTile();
    }

    if (this.lose()) {
      this.setStatus('lose');
    }

    if (this.win()) {
      this.setStatus('win');
    }
  }

  canMoveRight() {
    return this.moveRight('check');
  }

  moveUp(check = '') {
    const stateBeforeMove = this.board.map((row) => [...row]);
    const stateAfterMove = this.board.map((row) => [...row]);

    for (let i = 0; i < stateAfterMove.length; i++) {
      for (let j = 0; j < stateAfterMove.length; j++) {
        if (
          j < stateAfterMove.length - 1 &&
          stateAfterMove[j][i] === 0 &&
          stateAfterMove[j + 1][i] > 0
        ) {
          stateAfterMove[j][i] = stateAfterMove[j + 1][i];
          stateAfterMove[j + 1][i] = 0;
        } else if (
          j < stateAfterMove.length - 2 &&
          stateAfterMove[j][i] === 0 &&
          stateAfterMove[j + 2][i] > 0
        ) {
          stateAfterMove[j][i] = stateAfterMove[j + 2][i];
          stateAfterMove[j + 2][i] = 0;
        } else if (
          j < stateAfterMove.length - 3 &&
          stateAfterMove[j][i] === 0 &&
          stateAfterMove[j + 3][i] > 0
        ) {
          stateAfterMove[j][i] = stateAfterMove[j + 3][i];
          stateAfterMove[j + 3][i] = 0;
        }

        if (
          j < stateAfterMove.length - 1 &&
          stateAfterMove[j][i] === stateAfterMove[j + 1][i]
        ) {
          stateAfterMove[j][i] = 2 * stateAfterMove[j][i];
          stateAfterMove[j + 1][i] = 0;

          if (check) {
            this.setScore(this.score + stateAfterMove[j][i]);
          }
        } else if (
          j < stateAfterMove.length - 2 &&
          stateAfterMove[j][i] === stateAfterMove[j + 2][i] &&
          stateAfterMove[j + 1][i] === 0
        ) {
          stateAfterMove[j][i] = 2 * stateAfterMove[j][i];
          stateAfterMove[j + 2][i] = 0;

          if (check) {
            this.setScore(this.score + stateAfterMove[j][i]);
          }
        } else if (
          j < stateAfterMove.length - 3 &&
          stateAfterMove[j][i] === stateAfterMove[j + 3][i] &&
          stateAfterMove[j + 2][i] === 0 &&
          stateAfterMove[j + 1][i] === 0
        ) {
          stateAfterMove[j][i] = 2 * stateAfterMove[j][i];
          stateAfterMove[j + 3][i] = 0;

          if (check) {
            this.setScore(this.score + stateAfterMove[j][i]);
          }
        }
      }
    }

    if (check) {
      return this.boardsEqual(stateBeforeMove, stateAfterMove);
    }

    if (!this.boardsEqual(stateBeforeMove, stateAfterMove)) {
      this.board = stateAfterMove;
      this.generateTile();
    }

    if (this.lose()) {
      this.setStatus('lose');
    }

    if (this.win()) {
      this.setStatus('win');
    }
  }

  canMoveUp() {
    return this.moveUp('check');
  }

  moveDown(check = '') {
    const stateBeforeMove = this.board.map((row) => [...row]);
    const stateAfterMove = this.board.map((row) => [...row]);

    for (let i = 0; i < stateAfterMove.length; i++) {
      for (let j = stateAfterMove.length - 1; j >= 0; j--) {
        if (
          j > 0 &&
          stateAfterMove[j][i] === 0 &&
          stateAfterMove[j - 1][i] > 0
        ) {
          stateAfterMove[j][i] = stateAfterMove[j - 1][i];
          stateAfterMove[j - 1][i] = 0;
        } else if (
          j > 1 &&
          stateAfterMove[j][i] === 0 &&
          stateAfterMove[j - 2][i] > 0
        ) {
          stateAfterMove[j][i] = stateAfterMove[j - 2][i];
          stateAfterMove[j - 2][i] = 0;
        } else if (
          j > 2 &&
          stateAfterMove[j][i] === 0 &&
          stateAfterMove[j - 3][i] > 0
        ) {
          stateAfterMove[j][i] = stateAfterMove[j - 3][i];
          stateAfterMove[j - 3][i] = 0;
        }

        if (j > 0 && stateAfterMove[j][i] === stateAfterMove[j - 1][i]) {
          stateAfterMove[j][i] = 2 * stateAfterMove[j][i];
          stateAfterMove[j - 1][i] = 0;

          if (check) {
            this.setScore(this.score + stateAfterMove[j][i]);
          }
        } else if (
          j > 1 &&
          stateAfterMove[j][i] === stateAfterMove[j - 2][i] &&
          stateAfterMove[j - 1][i] === 0
        ) {
          stateAfterMove[j][i] = 2 * stateAfterMove[j][i];
          stateAfterMove[j - 2][i] = 0;

          if (check) {
            this.setScore(this.score + stateAfterMove[j][i]);
          }
        } else if (
          j > 2 &&
          stateAfterMove[j][i] === stateAfterMove[j - 3][i] &&
          stateAfterMove[j - 2][i] === 0 &&
          stateAfterMove[j - 1][i] === 0
        ) {
          stateAfterMove[j][i] = 2 * stateAfterMove[j][i];
          stateAfterMove[j - 3][i] = 0;

          if (check) {
            this.setScore(this.score + stateAfterMove[j][i]);
          }
        }
      }
    }

    if (check) {
      return this.boardsEqual(stateBeforeMove, stateAfterMove);
    }

    if (!this.boardsEqual(stateBeforeMove, stateAfterMove)) {
      this.board = stateAfterMove;
      this.generateTile();
    }

    if (this.lose()) {
      this.setStatus('lose');
    }

    if (this.win()) {
      this.setStatus('win');
    }
  }

  canMoveDown() {
    return this.moveDown('check');
  }

  getScore() {
    return this.score;
  }

  setScore(value) {
    this.score = value;
  }

  getState() {
    return this.board;
  }

  setStatus(value) {
    this.status = value;
  }

  generateTile() {
    let count = 0;

    while (count < 1) {
      const chanceArray = [2, 2, 2, 2, 4, 2, 2, 2, 2, 2];
      const randomRow = this.getRandomNum(0, 3);
      const randomColumn = this.getRandomNum(0, 3);

      if (this.board[randomRow][randomColumn] === 0) {
        this.board[randomRow][randomColumn] =
          chanceArray[this.getRandomNum(0, 9)];
        count++;
      }
    }
  }

  boardsEqual(a, b) {
    return a.every((row, i) => row.every((val, j) => val === b[i][j]));
  }

  lose() {
    return (
      this.canMoveLeft() &&
      this.canMoveRight() &&
      this.canMoveUp() &&
      this.canMoveDown()
    );
  }

  win() {
    return this.board.flat().some((item) => item === 2048);
  }

  getStatus() {
    return this.status;
  }

  getRandomNum(minNum, maxNum) {
    return Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  }

  start() {
    this.setStatus('playing');
    this.generateTile();
    this.generateTile();
  }

  restart() {
    this.setStatus('idle');

    const resetedBoard = Array.from({ length: 4 }, () => Array(4).fill(0));

    this.board = resetedBoard;
  }
}

module.exports = Game;
