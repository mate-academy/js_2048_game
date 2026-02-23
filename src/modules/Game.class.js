'use strict';

class Game {
  constructor(initialState) {
    if (initialState) {
      this.board = initialState.map((row) => [...row]);
    } else {
      // Usando matriz explícita para o Prettier não reclamar dos espaços
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.board;
  }
  getScore() {
    return this.score;
  }
  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';

      if (this.board.flat().every((cell) => cell === 0)) {
        this.addRandomTile();
        this.addRandomTile();
      }
    }
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    this.board.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === 0) {
          emptyCells.push({ r, c });
        }
      });
    });

    if (emptyCells.length > 0) {
      const { r, c } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  slideAndMerge(row) {
    const newRow = row.filter((val) => val !== 0);
    let changed = false;

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] !== 0 && newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        this.score += newRow[i];
        newRow.splice(i + 1, 1);
        changed = true;
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    const isChanged = row.some((val, i) => val !== newRow[i]);

    return { row: newRow, isChanged: isChanged || changed };
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  processMove(direction) {
    if (this.status !== 'playing') {
      return;
    }

    let boardChanged = false;
    let tempBoard = this.board.map((row) => [...row]);

    if (direction === 'up' || direction === 'down') {
      tempBoard = this.transpose(tempBoard);
    }

    tempBoard = tempBoard.map((row) => {
      if (direction === 'right' || direction === 'down') {
        row.reverse();
      }

      const { row: newRow, isChanged } = this.slideAndMerge(row);

      if (isChanged) {
        boardChanged = true;
      }

      if (direction === 'right' || direction === 'down') {
        newRow.reverse();
      }

      return newRow;
    });

    if (direction === 'up' || direction === 'down') {
      tempBoard = this.transpose(tempBoard);
    }

    if (boardChanged) {
      this.board = tempBoard;
      this.addRandomTile();
      this.updateStatus();
    }
  }

  moveLeft() {
    this.processMove('left');
  }
  moveRight() {
    this.processMove('right');
  }
  moveUp() {
    this.processMove('up');
  }
  moveDown() {
    this.processMove('down');
  }

  updateStatus() {
    const flatBoard = this.board.flat();

    if (flatBoard.includes(2048)) {
      this.status = 'win';

      return;
    }

    if (!flatBoard.includes(0)) {
      let canMove = false;

      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
          const current = this.board[r][c];

          if (
            (r < 3 && current === this.board[r + 1][c]) ||
            (c < 3 && current === this.board[r][c + 1])
          ) {
            canMove = true;
          }
        }
      }

      if (!canMove) {
        this.status = 'lose';
      }
    }
  }
}

module.exports = Game;
