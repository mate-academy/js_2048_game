'use strict';

export class Game {
  constructor(initialState = null) {
    this.initialState = initialState;
    this.reset();
  }

  reset() {
    if (this.initialState) {
      this.board = this.initialState.map((row) => [...row]);
    } else {
      this.board = Array(4)
        .fill(null)
        .map(() => Array(4).fill(0));
    }
    this.score = 0;
    this.status = 'playing';
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
    if (!this.initialState && this.isEmptyBoard()) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.reset();
    this.start();
  }

  isEmptyBoard() {
    return this.board.every((row) => row.every((cell) => cell === 0));
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

      this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  slideAndMergeRow(row) {
    let filtered = row.filter((val) => val !== 0);
    let rowScore = 0;

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        rowScore += filtered[i];
        filtered[i + 1] = 0;
        i++;
      }
    }

    filtered = filtered.filter((val) => val !== 0);

    while (filtered.length < 4) {
      filtered.push(0);
    }

    return { newRow: filtered, rowScore };
  }

  processMove(moveFunction) {
    if (this.status !== 'playing') {
      return false;
    }

    const previousStateStr = JSON.stringify(this.board);

    moveFunction();

    const currentStateStr = JSON.stringify(this.board);

    if (previousStateStr !== currentStateStr) {
      this.addRandomTile();
      this.checkGameStatus();

      return true;
    }

    return false;
  }

  moveLeft() {
    return this.processMove(() => {
      for (let r = 0; r < 4; r++) {
        const { newRow, rowScore } = this.slideAndMergeRow(this.board[r]);

        this.board[r] = newRow;
        this.score += rowScore;
      }
    });
  }

  moveRight() {
    return this.processMove(() => {
      for (let r = 0; r < 4; r++) {
        const reversed = [...this.board[r]].reverse();
        const { newRow, rowScore } = this.slideAndMergeRow(reversed);

        this.board[r] = newRow.reverse();
        this.score += rowScore;
      }
    });
  }

  moveUp() {
    return this.processMove(() => {
      for (let c = 0; c < 4; c++) {
        const column = [
          this.board[0][c],
          this.board[1][c],
          this.board[2][c],
          this.board[3][c],
        ];
        const { newRow, rowScore } = this.slideAndMergeRow(column);

        for (let r = 0; r < 4; r++) {
          this.board[r][c] = newRow[r];
        }
        this.score += rowScore;
      }
    });
  }

  moveDown() {
    return this.processMove(() => {
      for (let c = 0; c < 4; c++) {
        const column = [
          this.board[0][c],
          this.board[1][c],
          this.board[2][c],
          this.board[3][c],
        ].reverse();
        const { newRow, rowScore } = this.slideAndMergeRow(column);
        const finalColumn = newRow.reverse();

        for (let r = 0; r < 4; r++) {
          this.board[r][c] = finalColumn[r];
        }
        this.score += rowScore;
      }
    });
  }

  checkGameStatus() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return;
        }
      }
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (c < 3 && this.board[r][c] === this.board[r][c + 1]) {
          return;
        }

        if (r < 3 && this.board[r][c] === this.board[r + 1][c]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}
