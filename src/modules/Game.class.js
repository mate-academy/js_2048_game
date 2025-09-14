'use strict';

class Game {
  constructor(initialState) {
    this.SIZE = 4;
    this.score = 0;
    this.status = 'playing';

    this.board = Array.from({ length: this.SIZE }, () => {
      return Array(this.SIZE).fill(0);
    });
  }

  _addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.SIZE; r++) {
      for (let c = 0; c < this.SIZE; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    const newValue = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = newValue;
  }

  moveLeft() {
    let ifChanged = false;

    this.board.forEach((row, index) => {
      const beforeRes = [...row];
      const withoutZeros = row.filter((num) => num !== 0);

      for (let i = 0; i < withoutZeros.length - 1; i++) {
        if (withoutZeros[i] === withoutZeros[i + 1]) {
          withoutZeros[i] = withoutZeros[i] + withoutZeros[i + 1];
          this.score += withoutZeros[i];
          withoutZeros[i + 1] = 0;
          i++;
        }
      }

      const withoutZerosFinal = withoutZeros.filter((num) => num !== 0);

      while (withoutZerosFinal.length < 4) {
        withoutZerosFinal.push(0);
      }

      const changed = beforeRes.some(
        (val, indx) => val !== withoutZerosFinal[indx],
      );

      if (changed) {
        ifChanged = true;
      }

      this.board[index] = withoutZerosFinal;
    });

    if (ifChanged) {
      this._addRandomTile();
    }
  }

  moveRight() {
    let ifChanged = false;

    this.board.forEach((row, index) => {
      const beforeRes = [...row];
      const reversed = [...row].reverse();
      const withoutZeros = reversed.filter((num) => num !== 0);

      for (let i = 0; i < withoutZeros.length - 1; i++) {
        if (withoutZeros[i] === withoutZeros[i + 1]) {
          withoutZeros[i] = withoutZeros[i] + withoutZeros[i + 1];
          this.score += withoutZeros[i];
          withoutZeros[i + 1] = 0;
          i++;
        }
      }

      let withoutZerosFinal = withoutZeros.filter((num) => num !== 0);

      while (withoutZerosFinal.length < 4) {
        withoutZerosFinal.push(0);
      }

      withoutZerosFinal = withoutZerosFinal.reverse();

      const changed = beforeRes.some(
        (val, indx) => val !== withoutZerosFinal[indx],
      );

      if (changed) {
        ifChanged = true;
      }

      this.board[index] = withoutZerosFinal;
    });

    if (ifChanged) {
      this._addRandomTile();
    }
  }

  moveUp() {
    let ifChanged = false;
    const transposed = [[], [], [], []];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        transposed[j][i] = this.board[i][j];
      }
    }

    transposed.forEach((row, index) => {
      const beforeRes = [...row];
      const withoutZeros = row.filter((num) => num !== 0);

      for (let i = 0; i < withoutZeros.length - 1; i++) {
        if (withoutZeros[i] === withoutZeros[i + 1]) {
          withoutZeros[i] = withoutZeros[i] + withoutZeros[i + 1];
          this.score += withoutZeros[i];
          withoutZeros[i + 1] = 0;
          i++;
        }
      }

      const withoutZerosFinal = withoutZeros.filter((num) => num !== 0);

      while (withoutZerosFinal.length < 4) {
        withoutZerosFinal.push(0);
      }

      const changed = beforeRes.some(
        (val, indx) => val !== withoutZerosFinal[indx],
      );

      if (changed) {
        ifChanged = true;
      }

      transposed[index] = withoutZerosFinal;
    });

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.board[i][j] = transposed[j][i];
      }
    }

    if (ifChanged) {
      this._addRandomTile();
    }
  }

  moveDown() {
    let ifChanged = false;
    const transposed = [[], [], [], []];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        transposed[j][i] = this.board[i][j];
      }
    }

    transposed.forEach((row, index) => {
      const beforeRes = [...row];
      const reversed = [...row].reverse();
      const withoutZeros = reversed.filter((num) => num !== 0);

      for (let i = 0; i < withoutZeros.length - 1; i++) {
        if (withoutZeros[i] === withoutZeros[i + 1]) {
          withoutZeros[i] = withoutZeros[i] + withoutZeros[i + 1];
          this.score += withoutZeros[i];
          withoutZeros[i + 1] = 0;
          i++;
        }
      }

      let withoutZerosFinal = withoutZeros.filter((num) => num !== 0);

      while (withoutZerosFinal.length < 4) {
        withoutZerosFinal.push(0);
      }

      withoutZerosFinal = withoutZerosFinal.reverse();

      const changed = beforeRes.some(
        (val, indx) => val !== withoutZerosFinal[indx],
      );

      if (changed) {
        ifChanged = true;
      }

      transposed[index] = withoutZerosFinal;
    });

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        this.board[i][j] = transposed[j][i];
      }
    }

    if (ifChanged) {
      this._addRandomTile();
    }
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

    this.status = 'lose';

    return true;
  }

  checkWin() {
    for (const row of this.board) {
      for (const cell of row) {
        if (cell === 2048) {
          this.status = 'win';
          document.querySelector('.message-win').classList.remove('hidden');

          return;
        }
      }
    }
  }

  getScore() {
    return this.score;
  }

  updateScore() {
    const uiScore = document.querySelector('.game-score');

    uiScore.textContent = this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.score = 0;
    this.status = 'playing';

    this.board = Array.from({ length: this.SIZE }, () => {
      return Array(this.SIZE).fill(0);
    });
    this._addRandomTile();
    this._addRandomTile();

    const start = document.querySelector('.start');
    const startMessage = document.querySelector('.message-start');

    start.classList.remove('start');
    start.classList.add('restart');
    start.textContent = 'Restart';

    startMessage.classList.add('hidden');
  }

  restart() {
    this.score = 0;
    this.status = 'playing';

    this.board = Array.from({ length: this.SIZE }, () => {
      return Array(this.SIZE).fill(0);
    });

    const restart = document.querySelector('.restart');
    const startMessage = document.querySelector('.message-start');
    const loseMessage = document.querySelector('.message-lose');
    const winMessage = document.querySelector('.message-win');

    loseMessage.classList.add('hidden');
    startMessage.classList.remove('hidden');
    winMessage.classList.add('hidden');

    restart.classList.add('start');
    restart.classList.remove('restart');
    restart.textContent = 'Start';
  }
}

module.exports = Game;
