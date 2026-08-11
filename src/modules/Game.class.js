'use strict';

class Game {
  constructor(initialState, currentScoreElem, startResetElem) {
    this.currentScoreElem = currentScoreElem;
    this.startResetElem = startResetElem;
    this.score = 0;
    this.status = 'idle';

    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.board = this.initialState.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'playing';

    if (this.currentScoreElem) {
      this.currentScoreElem.textContent = this.score;
    }

    if (this.startResetElem) {
      this.startResetElem.textContent = 'Restart';
      // Нужно проверить наличе этого класса у элемента startResetElem
      this.startResetElem.classList.remove('start');
      this.startResetElem.classList.add('restart');
    }

    this.spawnTile();
    this.spawnTile();
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';

    if (this.currentScoreElem) {
      this.currentScoreElem.textContent = this.score;
    }

    if (this.startResetElem) {
      this.startResetElem.textContent = 'Start';
      this.startResetElem.classList.remove('restart');
      this.startResetElem.classList.add('start');
    }
  }

  spawnTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ row: r, col: c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const { row, col } = emptyCells[this.randomIndex(emptyCells.length)];

    this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  slideAndMergeRowLeft(row) {
    const nonZeros = row.filter((val) => val !== 0);
    let points = 0;
    const mergedRow = [];

    for (let i = 0; i < nonZeros.length; i++) {
      if (i < nonZeros.length - 1 && nonZeros[i] === nonZeros[i + 1]) {
        const mergedVal = nonZeros[i] * 2;

        mergedRow.push(mergedVal);
        points += mergedVal;
        i++;
      } else {
        mergedRow.push(nonZeros[i]);
      }
    }

    while (mergedRow.length < 4) {
      mergedRow.push(0);
    }

    return { newRow: mergedRow, points };
  }

  makeMove(direction) {
    if (this.status !== 'playing') {
      return false;
    }

    let turnPoints = 0;
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    if (direction === 'left' || direction === 'right') {
      for (let r = 0; r < 4; r++) {
        const row = [...this.board[r]];

        if (direction === 'right') {
          row.reverse();
        }

        const { newRow, points } = this.slideAndMergeRowLeft(row);

        if (direction === 'right') {
          newRow.reverse();
        }

        newBoard[r] = newRow;
        turnPoints += points;
      }
    } else if (direction === 'up' || direction === 'down') {
      for (let c = 0; c < 4; c++) {
        const col = [
          this.board[0][c],
          this.board[1][c],
          this.board[2][c],
          this.board[3][c],
        ];

        if (direction === 'down') {
          col.reverse();
        }

        const { newRow, points } = this.slideAndMergeRowLeft(col);

        if (direction === 'down') {
          newRow.reverse();
        }

        for (let r = 0; r < 4; r++) {
          newBoard[r][c] = newRow[r];
        }
        turnPoints += points;
      }
    }

    const moved = !this.areBoardsEqual(this.board, newBoard);

    if (moved) {
      this.board = newBoard;
      this.score += turnPoints;

      if (this.currentScoreElem) {
        this.currentScoreElem.textContent = this.score;
      }

      this.spawnTile();

      this.checkGameStatus();
    }

    return moved;
  }

  moveLeft() {
    return this.makeMove('left');
  }

  moveRight() {
    return this.makeMove('right');
  }

  moveUp() {
    return this.makeMove('up');
  }

  moveDown() {
    return this.makeMove('down');
  }

  checkGameStatus() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] >= 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }

        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  areBoardsEqual(b1, b2) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (b1[r][c] !== b2[r][c]) {
          return false;
        }
      }
    }

    return true;
  }

  randomIndex(max) {
    return Math.floor(Math.random() * max);
  }
}

module.exports = Game;
