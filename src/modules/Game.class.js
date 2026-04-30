'use strict';

class Game {
  constructor(initialState) {
    this.initialBoard = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.resetState();
  }

  resetState() {
    this.board = this.initialBoard.map((row) => [...row]);
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
    this.status = 'playing';

    if (this.board.flat().every((cell) => cell === 0)) {
      this.addRandomTile();
      this.addRandomTile();
    } else {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.resetState();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { r, c } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  slideAndMerge(row) {
    const arr = row.filter((val) => val !== 0);
    let rowScore = 0;

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        rowScore += arr[i];
        arr.splice(i + 1, 1);
      }
    }

    while (arr.length < 4) {
      arr.push(0);
    }

    return { newRow: arr, rowScore };
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    let changed = false;
    let turnScore = 0;
    const size = 4;

    for (let i = 0; i < size; i++) {
      let current;

      if (direction === 'left' || direction === 'right') {
        current = [...this.board[i]];
      } else {
        current = [
          this.board[0][i],
          this.board[1][i],
          this.board[2][i],
          this.board[3][i],
        ];
      }

      if (direction === 'right' || direction === 'down') {
        current.reverse();
      }

      const { newRow, rowScore } = this.slideAndMerge(current);

      if (direction === 'right' || direction === 'down') {
        newRow.reverse();
      }

      if (
        JSON.stringify(current) !==
        JSON.stringify(
          direction === 'right' || direction === 'down'
            ? [...newRow].reverse()
            : newRow,
        )
      ) {
        changed = true;
      }

      turnScore += rowScore;

      for (let j = 0; j < size; j++) {
        if (direction === 'left' || direction === 'right') {
          this.board[i][j] = newRow[j];
        } else {
          this.board[j][i] = newRow[j];
        }
      }
    }

    if (changed) {
      this.score += turnScore;
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveLeft() {
    this.move('left');
  }
  moveRight() {
    this.move('right');
  }
  moveUp() {
    this.move('up');
  }
  moveDown() {
    this.move('down');
  }

  checkStatus() {
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    if (this.board.flat().includes(0)) {
      return;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = this.board[r][c];

        if (
          (c < 3 && val === this.board[r][c + 1]) ||
          (r < 3 && val === this.board[r + 1][c])
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

export default Game;
