export class Game {
  constructor(initialState) {
    this.board =
      initialState || Array.from({ length: 4 }, () => Array(4).fill(0));
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
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    let moved = false;

    for (const row of this.board) {
      const compacted = row.filter((v) => v !== 0);

      for (let i = 0; i < compacted.length - 1; i++) {
        if (compacted[i] === compacted[i + 1]) {
          compacted[i] *= 2;
          this.score += compacted[i];
          compacted[i + 1] = 0;

          if (compacted[i] === 2048) {
            this.status = 'win';
          }
        }
      }

      const newRow = compacted.filter((v) => v !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      if (newRow.join() !== row.join()) {
        moved = true;
      }
      row.splice(0, 4, ...newRow);
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkGameOver();
  }

  moveRight() {
    this.board.forEach((row) => row.reverse());
    this.moveLeft();
    this.board.forEach((row) => row.reverse());
  }

  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
  }

  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();
  }

  transpose() {
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        [this.board[i][j], this.board[j][i]] = [
          this.board[j][i],
          this.board[i][j],
        ];
      }
    }
  }

  checkGameOver() {
    const hasZero = this.board.flat().some((v) => v === 0);

    if (hasZero) {
      return;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = this.board[r][c];

        if (this.board[r + 1]?.[c] === val || this.board[r]?.[c + 1] === val) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}
