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
    this.initialState = initialState;

    if (initialState) {
      this.board = initialState.map((row) => [...row]);
    } else {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.score = 0;
    this.isGame = false;
  }

  moveLeft() {
    const beforeArray = this.board.map((row) => [...row]);

    for (let i = 0; i < this.board.length; i++) {
      let row = this.board[i].filter((val) => val !== 0);

      for (let j = 0; j < row.length; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          row[j + 1] = 0;
          this.score += row[j];
          j++;
        }
      }
      row = row.filter((val) => val !== 0);

      while (row.length < 4) {
        row.push(0);
      }

      this.board[i] = row;
    }

    this.hasChanged(beforeArray);

    if (this.isGameLose() || this.isGameWin()) {
      this.isGame = false;
    }
  }

  moveRight() {
    const beforeArray = this.board.map((row) => [...row]);

    for (let i = 0; i < this.board.length; i++) {
      let row = this.board[i].filter((val) => val !== 0);

      for (let j = row.length - 1; j >= 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2;
          row[j - 1] = 0;
          this.score += row[j];
          j--;
        }
      }
      row = row.filter((val) => val !== 0);

      while (row.length < 4) {
        row.unshift(0);
      }
      this.board[i] = row;
    }

    this.hasChanged(beforeArray);

    if (this.isGameLose() || this.isGameWin()) {
      this.isGame = false;
    }
  }

  moveUp() {
    const beforeArray = this.board.map((row) => [...row]);

    for (let col = 0; col < 4; col++) {
      let column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }
      column = column.filter((val) => val !== 0);

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          column[i + 1] = 0;
          this.score += column[i];
          i++;
        }
      }

      column = column.filter((val) => val !== 0);

      while (column.length < 4) {
        column.push(0);
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = column[row];
      }
    }

    this.hasChanged(beforeArray);

    if (this.isGameLose() || this.isGameWin()) {
      this.isGame = false;
    }
  }

  moveDown() {
    const beforeArray = this.board.map((row) => [...row]);

    for (let col = 0; col < 4; col++) {
      let column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }
      column = column.filter((val) => val !== 0);

      for (let i = column.length - 1; i >= 0; i--) {
        if (column[i] === column[i - 1]) {
          column[i] *= 2;
          column[i - 1] = 0;
          this.score += column[i];
          i--;
        }
      }

      column = column.filter((val) => val !== 0);

      while (column.length < 4) {
        column.unshift(0);
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = column[row];
      }
    }

    this.hasChanged(beforeArray);

    if (this.isGameLose() || this.isGameWin()) {
      this.isGame = false;
    }
  }

  hasChanged(beforeArray) {
    let hasChanged = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] !== beforeArray[i][j]) {
          hasChanged = true;
          break;
        }
      }

      if (hasChanged) {
        break;
      }
    }

    if (!hasChanged) {
      return;
    }

    this.createNewBlock();
  }

  createNewBlock() {
    const empty = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (empty.length > 0) {
      const [x, y] = empty[Math.floor(Math.random() * empty.length)];

      if (Math.random() < 0.1) {
        this.board[x][y] = 4;
      } else {
        this.board[x][y] = 2;
      }
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    if (this.isGame) {
      return 'playing';
    } else if (this.isGameLose()) {
      return 'lose';
    } else if (this.isGameWin()) {
      return 'win';
    } else {
      return 'idle';
    }
  }

  isGameLose() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return false;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }

  isGameWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  start() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.createNewBlock();
    this.createNewBlock();
    this.score = 0;
    this.isGame = true;
  }

  restart() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.board[i][j] = this.initialState[i][j];
      }
    }
    this.isGame = false;
    this.score = 0;
  }

  // Add your own methods here
}

export default Game;
