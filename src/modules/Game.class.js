'use strict';

class Game {
  static INITIAL_STATE = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  constructor(initialState = Game.INITIAL_STATE.map((row) => [...row])) {
    this.board = initialState;
    this.score = 0;
  }

  render() {
    const rows = document.querySelectorAll('.field-row');

    this.board.forEach((row, rowIndex) => {
      const cells = rows[rowIndex].querySelectorAll('.field-cell');

      row.forEach((cellValue, colIndex) => {
        const cell = cells[colIndex];

        cell.className = 'field-cell';

        if (cellValue !== 0) {
          cell.textContent = cellValue;
          cell.classList.add(`field-cell--${cellValue}`);
        } else {
          cell.textContent = '';
        }
      });
    });

    const score = document.querySelector('.game-score');

    score.textContent = this.getScore();
  }

  moveLeft() {
    this.board.forEach((row) => {
      let newRow = row.filter((n) => n !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
        }
      }

      newRow = newRow.filter((n) => n !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      for (let i = 0; i < 4; i++) {
        row[i] = newRow[i];
      }
    });
  }

  moveRight() {
    this.board.forEach((row) => {
      let newRow = row.reverse().filter((n) => n !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow[i + 1] = 0;
        }
      }

      newRow = newRow.filter((n) => n !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      newRow = newRow.reverse();

      for (let i = 0; i < 4; i++) {
        row[i] = newRow[i];
      }
    });
  }

  moveUp() {
    for (let i = 0; i < 4; i++) {
      const column = [];

      for (let j = 0; j < 4; j++) {
        column.push(this.board[j][i]);
      }

      let newCol = column.filter((n) => n !== 0);

      for (let ind = 0; ind < newCol.length - 1; ind++) {
        if (newCol[ind] === newCol[ind + 1]) {
          newCol[ind] *= 2;
          this.score += newCol[ind];
          newCol[ind + 1] = 0;
        }
      }

      newCol = newCol.filter((n) => n !== 0);

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let n = 0; n < 4; n++) {
        this.board[n][i] = newCol[n];
      }
    }
  }

  moveDown() {
    for (let i = 0; i < 4; i++) {
      const column = [];

      for (let j = 0; j < 4; j++) {
        column.push(this.board[j][i]);
      }

      let newCol = column.reverse().filter((n) => n !== 0);

      for (let ind = 0; ind < newCol.length - 1; ind++) {
        if (newCol[ind] === newCol[ind + 1]) {
          newCol[ind] *= 2;
          this.score += newCol[ind];
          newCol[ind + 1] = 0;
        }
      }

      newCol = newCol.filter((n) => n !== 0);

      while (newCol.length < 4) {
        newCol.push(0);
      }

      newCol = newCol.reverse();

      for (let n = 0; n < 4; n++) {
        this.board[n][i] = newCol[n];
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
    const isEmpty = this.board.every((row) => row.every((cell) => cell === 0));
    if (isEmpty) return 'idle';

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = this.board[row][col];

        if (value === 2048) return 'win';
        if (value === 0) return 'playing';

        // Check if a move is possible
        if (col < 3 && value === this.board[row][col + 1]) return 'playing';
        if (row < 3 && value === this.board[row + 1][col]) return 'playing';
      }
    }

    // No empty cells a nd no moves possible
    return 'lose';
  }

  start() {
    const rowInd1 = Math.floor(Math.random() * 4);
    const colInd1 = Math.floor(Math.random() * 4);

    const rowInd2 = Math.floor(Math.random() * 4);
    let colInd2 = Math.floor(Math.random() * 4);

    if (rowInd1 === rowInd2) {
      while (colInd1 === colInd2) {
        colInd2 = Math.floor(Math.random() * 4);
      }
    }

    this.board[rowInd1][colInd1] = 2;
    this.board[rowInd2][colInd2] = 2;
    document.querySelector('.message-start').classList.add('hidden');
    this.render();
  }

  restart() {
    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-lose').classList.add('hidden');
    this.board = Game.INITIAL_STATE.map((row) => [...row]);
    this.score = 0;
    this.render();
    this.start();
  }

  addNumber() {
    const emptyCells = [];

    this.board.forEach((r, rowIndex) => {
      r.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ row: rowIndex, col: colIndex });
        }
      });
    });

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];
      const newValue = Math.random() < 0.1 ? 4 : 2;

      this.board[row][col] = newValue;
      this.render();
    }
  }
}

module.exports = Game;
