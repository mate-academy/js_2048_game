'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  static Status = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.status = Game.Status.idle;
    this.initialState = initialState;
    this.state = JSON.parse(JSON.stringify(initialState));
    this.score = 0;
  }

  moveLeft() {
    if (this.getStatus() === Game.Status.playing) {
      const newState = [];

      for (let r = 0; r < this.state.length; r++) {
        let row = this.state[r];

        row = this.move(row);
        newState[r] = row;
      }

      if (this.checkPossibilityOfMerging(newState)) {
        this.state = [...newState];
        this.checkIsWin();
        this.putNewGameNumber();
      }

      this.checkStatusLose(newState);
    }
  }

  moveRight() {
    if (this.getStatus() === Game.Status.playing) {
      const newState = [];

      for (let r = 0; r < this.state.length; r++) {
        let row = [...this.state[r]];

        row.reverse();

        row = this.move(row);

        row.reverse();

        newState[r] = row;
      }

      if (this.checkPossibilityOfMerging(newState)) {
        this.state = [...newState];
        this.checkIsWin();
        this.putNewGameNumber();
      }

      this.checkStatusLose(newState);
    }
  }

  moveUp() {
    if (this.getStatus() === Game.Status.playing) {
      const newState = [...Array(4)].map(() => Array(4).fill(0));

      for (let c = 0; c < this.state.length; c++) {
        let row = [
          this.state[0][c],
          this.state[1][c],
          this.state[2][c],
          this.state[3][c],
        ];

        row = this.move(row);

        for (let r = 0; r < this.state.length; r++) {
          newState[r][c] = row[r];
        }
      }

      if (this.checkPossibilityOfMerging(newState)) {
        this.state = [...newState];
        this.checkIsWin();
        this.putNewGameNumber();
      }

      this.checkStatusLose(newState);
    }
  }

  moveDown() {
    if (this.getStatus() === Game.Status.playing) {
      const newState = [...Array(4)].map(() => Array(4).fill(0));

      for (let c = 0; c < this.state.length; c++) {
        let row = [
          this.state[0][c],
          this.state[1][c],
          this.state[2][c],
          this.state[3][c],
        ].reverse();

        row = this.move(row);
        row = row.reverse();

        for (let r = 0; r < this.state.length; r++) {
          newState[r][c] = row[r];
        }
      }

      if (this.checkPossibilityOfMerging(newState)) {
        this.state = [...newState];
        this.checkIsWin();
        this.putNewGameNumber();
      }

      this.checkStatusLose(newState);
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = Game.Status.playing;
    this.putNewGameNumber();
    this.putNewGameNumber();
  }

  restart() {
    this.score = 0;
    this.status = Game.Status.idle;
    this.state = JSON.parse(JSON.stringify(this.initialState));
  }

  checkIsWin() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 2048) {
          this.status = Game.Status.win;

          return;
        }
      }
    }
  }

  checkPossibilityOfMerging(newState) {
    return JSON.stringify(this.state) !== JSON.stringify(newState);
  }

  checkPossibilityOfMoving() {
    const lengthOfArray = this.state.length;

    for (let i = 0; i < lengthOfArray; i++) {
      for (let j = 0; j < lengthOfArray; j++) {
        if (
          j < lengthOfArray - 1 &&
          this.state[i][j] === this.state[i][j + 1]
        ) {
          return true;
        }

        if (
          i < lengthOfArray - 1 &&
          this.state[i][j] === this.state[i + 1][j]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  checkStatusLose() {
    if (this.getEmptyCells().length === 0 && !this.checkPossibilityOfMoving()) {
      this.status = Game.Status.lose;
    }
  }

  move(row) {
    const fillRow = row.filter((num) => num !== 0);

    for (let i = 0; i < fillRow.length - 1; i++) {
      if (fillRow[i] === fillRow[i + 1]) {
        fillRow[i] *= 2;
        fillRow[i + 1] = 0;
        this.score += fillRow[i];
      }
    }

    const newFillRow = fillRow.filter((num) => num !== 0);

    while (newFillRow.length < 4) {
      newFillRow.push(0);
    }

    return newFillRow;
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    return emptyCells;
  }

  putNewGameNumber() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length !== 0) {
      const getRandomEmptyCell = Math.floor(Math.random() * emptyCells.length);
      const row = emptyCells[getRandomEmptyCell][0];
      const column = emptyCells[getRandomEmptyCell][1];

      this.state[row][column] = Math.random() >= 0.9 ? 4 : 2;
    }
  }
}

module.exports = Game;
