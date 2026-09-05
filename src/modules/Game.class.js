'use strict';
export default class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.score = 0;
    this.status = 'idle';
    this.board = initialState;
    this.initialState = initialState.map((row) => [...row]);

    this.board = initialState.map((row) => [...row]);
  }

  moveLeft() {
    this.applyMove(() => this.slideLeft());
  }
  moveRight() {
    this.applyMove(() => this.slideRight());
  }
  moveUp() {
    this.applyMove(() => this.slideUp());
  }
  moveDown() {
    this.applyMove(() => this.slideDown());
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.addTiles();
    this.addTiles();
    this.updateStatus();
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  filterZero(row) {
    return row.filter((el) => el !== 0);
  }

  slide(row) {
    let cells = this.filterZero(row);

    let scoreGained = 0;

    for (let i = 0; i < cells.length; i++) {
      if (cells[i] === cells[i + 1]) {
        cells[i] *= 2;
        scoreGained += cells[i];
        cells[i + 1] = 0;
      }
    }

    cells = this.filterZero(cells);

    while (cells.length < 4) {
      cells.push(0);
    }

    return { row: cells, scoreGained };
  }

  slideLeft() {
    let totalScore = 0;

    for (let r = 0; r < 4; r++) {
      const result = this.slide(this.board[r]);
      const row = result.row;
      const scoreGained = result.scoreGained;

      this.board[r] = row;
      totalScore += scoreGained;
    }

    return totalScore;
  }

  slideRight() {
    let totalScore = 0;

    for (let r = 0; r < 4; r++) {
      const result = this.slide(this.board[r].reverse());
      const row = result.row;
      const scoreGained = result.scoreGained;

      row.reverse();
      this.board[r] = row;
      totalScore += scoreGained;
    }

    return totalScore;
  }

  slideUp() {
    let totalScore = 0;

    for (let c = 0; c < 4; c++) {
      const columnArray = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      const result = this.slide(columnArray);

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = result.row[r];
      }

      totalScore += result.scoreGained;
    }

    return totalScore;
  }

  slideDown() {
    let totalScore = 0;

    for (let c = 0; c < 4; c++) {
      const columnArray = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      const result = this.slide(columnArray.reverse());

      result.row.reverse();

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = result.row[r];
      }

      totalScore += result.scoreGained;
    }

    return totalScore;
  }

  hasEmptyTile() {
    return this.board.some((row) => row.some((cell) => cell === 0));
  }

  hasMergeAvailable() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }
      }
    }

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  addTiles() {
    if (!this.hasEmptyTile()) {
      return;
    }

    let found = false;

    while (!found) {
      const r = Math.floor(Math.random() * 4);
      const c = Math.floor(Math.random() * 4);

      if (this.board[r][c] === 0) {
        this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
        found = true;
      }
    }
  }

  applyMove(slideFn) {
    if (this.status !== 'playing') {
      return;
    }

    const arrayBefore = this.board.map((row) => [...row]);

    const scoreGained = slideFn();

    if (this.boardsAreEqual(arrayBefore, this.board)) {
      return;
    }

    this.score += scoreGained;
    this.addTiles();
    this.updateStatus();
  }

  boardsAreEqual(boardA, boardB) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (boardA[r][c] !== boardB[r][c]) {
          return false;
        }
      }
    }

    return true;
  }

  updateStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    if (!this.hasEmptyTile() && !this.hasMergeAvailable()) {
      this.status = 'lose';
    }
  }
}
