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
    this.initialState = initialState.map((row) => [...row]);
    this.board = initialState.map((row) => [...row]);

    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    this.addRandomCell();
    this.addRandomCell();

    this.updateStatus();
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  addRandomCell() {
    const empty = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (!empty.length) {
      return;
    }

    const [row, col] = empty[Math.floor(Math.random() * empty.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  transpose(board) {
    return board[0].map((_, i) => board.map((row) => row[i]));
  }

  reverse(board) {
    return board.map((row) => [...row].reverse());
  }
  mergeLine(line) {
    const filtered = line.filter((value) => value !== 0);
    const result = [];

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const merged = filtered[i] * 2;

        result.push(merged);
        this.score += merged;

        i++;
      } else {
        result.push(filtered[i]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  slideLeft(board) {
    let moved = false;

    const newBoard = board.map((row) => {
      const merged = this.mergeLine(row);

      if (merged.join(',') !== row.join(',')) {
        moved = true;
      }

      return merged;
    });

    return {
      board: newBoard,
      moved,
    };
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return true;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  makeMove(transform, restore) {
    if (this.status !== 'playing') {
      return;
    }

    const transformed = transform(this.board);

    const { board, moved } = this.slideLeft(transformed);

    if (!moved) {
      return;
    }

    this.board = restore(board);

    this.addRandomCell();
    this.updateStatus();
  }
  moveLeft() {
    this.makeMove(
      (board) => board.map((row) => [...row]),
      (board) => board,
    );
  }

  moveRight() {
    this.makeMove(
      (board) => this.reverse(board),
      (board) => this.reverse(board),
    );
  }

  moveUp() {
    this.makeMove(
      (board) => this.transpose(board),
      (board) => this.transpose(board),
    );
  }

  moveDown() {
    this.makeMove(
      (board) => this.reverse(this.transpose(board)),
      (board) => this.transpose(this.reverse(board)),
    );
  }
}

export default Game;
