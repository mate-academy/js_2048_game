'use strict';

class Game {
  constructor(initialState) {
    this.initialState = initialState || this.generateNewBoard();
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.firstState = JSON.parse(JSON.stringify(this.board));
    this.score = 0;
    this.status = 'idle';
    this.checkLeft = true;
    this.checkRight = true;
    this.checkUp = true;
    this.checkDown = true;
    this.checkStart = false;
  }

  // #region get states

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  // #endregion

  // #region navigation

  moveLeft() {
    if (this.checkStart) {
      const currentState = [...this.getState()];

      this.board = this.board.map((row) => {
        let newRow = row.filter((el) => el !== 0);

        for (let i = 0; i < newRow.length; i++) {
          if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            this.score += newRow[i];
            newRow[i + 1] = 0;
          }
        }

        newRow = newRow.filter((el) => el !== 0);

        while (newRow.length < 4) {
          newRow.push(0);
        }

        return newRow;
      });

      if (this.checkWin()) {
        this.status = 'win';
      }

      this.checkLeft = this.differenceArrays(currentState, this.getState());

      if (this.checkLeft) {
        this.addRandomTile(this.board);
      }

      if (this.checkLose() && !this.checkWin()) {
        this.status = 'lose';
      }
    }
  }

  moveRight() {
    if (this.checkStart) {
      const currentState = [...this.getState()];

      this.board = this.board.map((row) => {
        let newRow = row.filter((el) => el !== 0).reverse();

        for (let i = 0; i < newRow.length; i++) {
          if (newRow[i] === newRow[i + 1]) {
            newRow[i] *= 2;
            this.score += newRow[i];
            newRow[i + 1] = 0;
          }
        }

        newRow = newRow.filter((el) => el !== 0);

        while (newRow.length < 4) {
          newRow.push(0);
        }

        return newRow.reverse();
      });

      if (this.checkWin()) {
        this.status = 'win';
      }

      this.checkRight = this.differenceArrays(currentState, this.getState());

      if (this.checkRight) {
        this.addRandomTile(this.board);
      }

      if (this.checkLose() && !this.checkWin()) {
        this.status = 'lose';
      }
    }
  }

  moveUp() {
    if (this.checkStart) {
      const currentState = [...this.getState()];

      this.board = this.transpose(this.board);
      this.moveLeft();
      this.board = this.transpose(this.board);

      if (this.checkWin()) {
        this.status = 'win';
      }

      this.checkUp = this.differenceArrays(currentState, this.getState());

      if (this.checkLose() && !this.checkWin()) {
        this.status = 'lose';
      }
    }
  }

  moveDown() {
    if (this.checkStart) {
      const currentState = [...this.getState()];

      this.board = this.transpose(this.board);
      this.moveRight();
      this.board = this.transpose(this.board);

      if (this.checkWin()) {
        this.status = 'win';
      }
      this.checkDown = this.differenceArrays(currentState, this.getState());

      if (this.checkLose() && !this.checkWin()) {
        this.status = 'lose';
      }
    }
  }

  // #endregion

  // #region checking and changing state

  differenceArrays(arr1, arr2) {
    const firstArr = arr1.flat().join('');
    const secondArr = arr2.flat().join('');

    return firstArr !== secondArr;
  }

  start() {
    this.board = this.generateNewBoard();
    this.board = JSON.parse(JSON.stringify([...this.firstState]));
    this.score = 0;
    this.status = this.getStatus() !== 'win' && 'playing';
    this.checkStart = true;

    for (let i = 0; i < 2; i++) {
      this.addRandomTile(this.board);
    }
  }

  restart() {
    this.board = JSON.parse(JSON.stringify([...this.firstState]));
    this.score = 0;
    this.status = 'idle';
    this.checkStart = false;
  }

  // #endregion

  // #region array manipulation
  generateNewBoard() {
    const newBoard = [[], [], [], []];

    newBoard.forEach((row) => {
      for (let i = 0; i < 4; i++) {
        row.push(0);
      }
    });

    return newBoard;
  }

  addRandomTile(currentBoard) {
    const emptyCells = [];

    for (let i = 0; i < currentBoard.length; i++) {
      for (let j = 0; j < currentBoard[i].length; j++) {
        if (currentBoard[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells[randomIndex];
      const randomValue = Math.random() < 0.9 ? 2 : 4;

      currentBoard[row][col] = randomValue;
    }

    return currentBoard;
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  // #endregion

  // #region check moves
  checkWin() {
    const result = [...this.board].flat().filter((el) => el >= 2048).length;

    return result > 0;
  }

  checkLose() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return false;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }
  // #endregion
}

module.exports = Game;
