'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle'; // idle | playing | win | lose
    this.board = this.createEmptyBoard();

    if (initialState) {
      this.board = initialState.map((row) => [...row]);
    } else {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
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
    if (this.status === 'idle') {
      this.status = 'playing';
    }
  }

  restart() {
    this.score = 0;
    this.status = 'playing';
    this.board = this.createEmptyBoard();
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const empty = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
empty.push([r, c]);
}
      }
    }

    if (empty.length === 0) {
return false;
}

    const [r, c] = empty[Math.floor(Math.random() * empty.length)];

    this.board[r][c] = Math.random() < 0.1 ? 4 : 2;

    return true;
  }

  slideRow(row) {
    let arr = row.filter((v) => v !== 0);
    let scoreAdd = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        scoreAdd += arr[i];
        arr[i + 1] = 0;
      }
    }

    arr = arr.filter((v) => v !== 0);

    while (arr.length < this.size) {
arr.push(0);
}

    return { row: arr, scoreAdd };
  }

  moveLeft() {
    return this.move('left');
  }

  moveRight() {
    return this.move('right');
  }

  moveUp() {
    return this.move('up');
  }

  moveDown() {
    return this.move('down');
  }

  move(direction) {
    if (this.status !== 'playing') {
return false;
}

    let rotated = this.board.map((row) => [...row]);
    let moved = false;
    let scoreAdd = 0;

    const rotateRight = (b) =>
      b[0].map((_, i) => b.map((row) => row[i]).reverse());
    const rotateLeft = (b) =>
      b[0].map((_, i) => b.map((row) => row[row.length - 1 - i]));
    const rotate180 = (b) => b.map((row) => [...row].reverse()).reverse();

    if (direction === 'up') {
rotated = rotateLeft(rotated);
}

    if (direction === 'down') {
rotated = rotateRight(rotated);
}

    if (direction === 'right') {
rotated = rotate180(rotated);
}

    const newBoard = [];

    for (let r = 0; r < this.size; r++) {
      const { row, scoreAdd: rowScore } = this.slideRow(rotated[r]);

      if (row.toString() !== rotated[r].toString()) {
moved = true;
}
      newBoard.push(row);
      scoreAdd += rowScore;
    }

    let unrotated = newBoard;

    if (direction === 'up') {
unrotated = rotateRight(unrotated);
}

    if (direction === 'down') {
unrotated = rotateLeft(unrotated);
}

    if (direction === 'right') {
unrotated = rotate180(unrotated);
}

    if (moved) {
      this.board = unrotated;
      this.score += scoreAdd;
      this.addRandomTile();
      this.checkGameStatus();
    }

    return moved;
  }

  checkGameStatus() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
return;
}

        if (c < this.size - 1 && this.board[r][c] === this.board[r][c + 1]) {
        {
return;
}

        if (r < this.size - 1 && this.board[r][c] === this.board[r + 1][c]) {
        {
return;
}
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;