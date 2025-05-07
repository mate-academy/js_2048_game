'use strict';

class Game {
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.addRandomTile = this.addRandomTile.bind(this);
    this.start = this.start.bind(this);
    this.status = 'idle';
    this.score = 0;
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
  }

  restart() {
    this.status = 'playing';
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.addRandomTile();
  }

  cellMerge() {
    let moved = false;

    for (let row = 0; row < this.board.length; row++) {
      let newRow = this.board[row].filter((value) => value !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          newRow[i + 1] = 0;
          moved = true;
        }
      }

      newRow = newRow.filter((value) => value !== 0);

      while (newRow.length < this.board[row].length) {
        newRow.push(0);
      }

      if (this.board[row].join('') !== newRow.join('')) {
        this.board[row] = newRow;
        moved = true;
      }
    }

    return moved;
  }

  moveLeft() {
    if (this.cellMerge()) {
      this.addRandomTile();
    }

    this.cellMerge();
  }

  moveRight() {
    this.rotateGrid(this.board, true);
    this.rotateGrid(this.board, true);

    const moved = this.cellMerge();

    this.rotateGrid(this.board, false);
    this.rotateGrid(this.board, false);

    if (moved) {
      this.addRandomTile();
    }

    return moved;
  }

  moveUp() {
    this.rotateGrid(this.board, false);

    const moved = this.cellMerge();

    this.rotateGrid(this.board, true);

    if (moved) {
      this.addRandomTile();
    }

    return moved;
  }

  moveDown() {
    this.rotateGrid(this.board, true);

    const moved = this.cellMerge();

    this.rotateGrid(this.board, false);

    if (moved) {
      this.addRandomTile();
    }

    return moved;
  }

  rotateGrid(board, clockwise = true) {
    const size = board.length;
    const newBoard = Array(size)
      .fill(null)
      .map(() => Array(size).fill(0));

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (clockwise) {
          newBoard[col][size - 1 - row] = board[row][col];
        } else {
          newBoard[size - 1 - col][row] = board[row][col];
        }
      }
    }

    this.board = newBoard;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }

    return this.board;
  }

  getState() {
    const table = document.querySelector('tbody');

    table.innerHTML = '';

    this.board.forEach((row) => {
      const tr = document.createElement('tr');

      tr.classList.add('field-row');

      row.forEach((cell) => {
        const td = document.createElement('td');

        td.textContent = cell !== 0 ? cell : '';
        td.classList.add('field-cell');
        td.setAttribute('class', `field-cell field-cell--${cell}`);
        tr.appendChild(td);
      });

      table.appendChild(tr);
    });
  }

  getScore() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] > this.score) {
          this.score = this.board[row][col];
        }
      }
    }

    return this.score;
  }

  canMove() {
    const copyOfBoard = JSON.parse(JSON.stringify(this.board));

    for (let row = 0; row < copyOfBoard.length; row++) {
      for (let col = 0; col < copyOfBoard[row].length - 1; col++) {
        if (
          copyOfBoard[row][col + 1] === 0 ||
          copyOfBoard[row][col] === 0 ||
          copyOfBoard[row][col] === copyOfBoard[row][col + 1]
        ) {
          return true;
        }
      }
    }

    for (let col = 0; col < copyOfBoard[0].length; col++) {
      for (let row = 0; row < copyOfBoard.length - 1; row++) {
        if (
          copyOfBoard[row + 1][col] === 0 ||
          copyOfBoard[row][col] === 0 ||
          copyOfBoard[row][col] === copyOfBoard[row + 1][col]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  getStatus() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';
        }
      }
    }

    if (this.status === 'playing' && !this.canMove()) {
      this.status = 'lose';
    }

    return this.status;
  }
}

module.exports = Game;
