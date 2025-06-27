'use strict';

class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   * [0, 0, 0, 0],
   * [0, 0, 0, 0],
   * [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    if (initialState) {
      this.board = initialState;
    } else {
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

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let boardChanged = false;
    let moveScore = 0;

    for (let r = 0; r < 4; r++) {
      const row = this.board[r];
      const { newLine, score, change } = this.slideAndMerge(row);

      this.board[r] = newLine;
      moveScore += score;

      if (change) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.score += moveScore;
      this.addNewTile();
      this.checkWin();
    }

    this.checkLose();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let boardChanged = false;
    let moveScore = 0;

    for (let r = 0; r < 4; r++) {
      const row = [...this.board[r]].reverse();
      const { newLine, score, change } = this.slideAndMerge(row);

      this.board[r] = [...newLine].reverse();
      moveScore += score;

      if (change) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.score += moveScore;
      this.addNewTile();
      this.checkWin();
    }

    this.checkLose();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let boardChanged = false;
    let moveScore = 0;

    for (let c = 0; c < 4; c++) {
      const collumn = [];

      for (let row = 0; row < 4; row++) {
        collumn.push(this.board[row][c]);
      }

      const { newLine, score, change } = this.slideAndMerge(collumn);

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = newLine[r];
      }
      moveScore += score;

      if (change) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.score += moveScore;
      this.addNewTile();
      this.checkWin();
    }

    this.checkLose();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let boardChanged = false;
    let moveScore = 0;

    for (let c = 0; c < 4; c++) {
      const column = [];

      for (let r = 0; r < 4; r++) {
        column.push(this.board[r][c]);
      }

      const revColumn = [...column].reverse();
      const { newLine, score, change } = this.slideAndMerge(revColumn);

      const finalColumn = [...newLine].reverse();

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = finalColumn[r];
      }

      moveScore += score;

      if (change) {
        boardChanged = true;
      }
    }

    if (boardChanged) {
      this.score += moveScore;
      this.addNewTile();
      this.checkWin();
    }

    this.checkLose();
  }

  start() {
    if (
      this.status === 'idle' ||
      this.status === 'win' ||
      this.status === 'lose' ||
      this.status === 'playing'
    ) {
      this.board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      this.score = 0;
      this.status = 'playing';
      this.addNewTile();
      this.addNewTile();
    }
  }

  addNewTile() {
    const emptyCell = [];

    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 4; cell++) {
        if (this.board[row][cell] === 0) {
          emptyCell.push({ row, cell });
        }
      }
    }

    if (emptyCell.length > 0) {
      const randomNumber = Math.floor(Math.random() * emptyCell.length);
      const { row, cell } = emptyCell[randomNumber];

      this.board[row][cell] = Math.random() < 0.1 ? 4 : 2;

      return true;
    }

    return false;
  }

  slideAndMerge(line) {
    let score = 0;
    let change = false;
    const initialLine = [...line];

    const filteredLine = line.filter((cell) => cell !== 0);
    const newLine = [];
    const mergedThisMove = new Array(4).fill(false);

    for (let i = 0; i < filteredLine.length; i++) {
      if (
        i + 1 < filteredLine.length &&
        filteredLine[i] === filteredLine[i + 1] &&
        !mergedThisMove[i] &&
        !mergedThisMove[i + 1]
      ) {
        newLine.push(filteredLine[i] * 2);

        score += filteredLine[i] * 2;

        mergedThisMove[i + 1] = true;
        i++;
      } else {
        newLine.push(filteredLine[i]);
      }
    }

    while (newLine.length < 4) {
      newLine.push(0);
    }

    if (JSON.stringify(initialLine) !== JSON.stringify(newLine)) {
      change = true;
    }

    return {
      newLine,
      score,
      change,
    };
  }

  restart() {
    this.start();
  }

  getStatus() {
    return this.status;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  hasAbilityMove() {
    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 4; cell++) {
        if (this.board[row][cell] === 0) {
          return true;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 4; cell++) {
        if (cell < 3 && this.board[row][cell] === this.board[row][cell + 1]) {
          return true;
        }

        if (row < 3 && this.board[row][cell] === this.board[row + 1][cell]) {
          return true;
        }
      }
    }

    return false;
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 4; cell++) {
        if (this.board[row][cell] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    if (!this.hasAbilityMove()) {
      this.status = 'lose';

      return true;
    }

    return false;
  }
}

export default Game;
