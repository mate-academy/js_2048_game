'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
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
  constructor(initialState) {
    this.score = 0;

    if (initialState) {
      this.board = initialState;
    } else {
      this.board = [];

      for (let i = 0; i < 4; i++) {
        this.board[i] = [];

        for (let j = 0; j < 4; j++) {
          this.board[i][j] = 0;
        }
      }
    }

    // eslint-disable-next-line no-console
    console.log(this.board);
  }

  moveLeft() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    this.board.forEach((array, index) => {
      let newArray = [...array].filter((e) => {
        return e !== 0;
      });

      newArray.forEach((e, i) => {
        const current = newArray[i];
        const next = newArray[i + 1];

        if (current !== 0 && current === next) {
          newArray[i] = current + next;
          this.score = (this.score || 0) + newArray[i];
          newArray[i + 1] = 0;
        }
      });

      newArray = newArray.filter((e) => e !== 0);

      for (let i = 0; i < 4; i++) {
        if (typeof newArray[i] !== 'number') {
          newArray[i] = 0;
        }
      }

      this.board[index] = newArray;
    });

    if (!this.isEqualForArrays(oldBoard, this.board)) {
      this.createNumAfterMove();
    }
    this.render();
  }
  moveRight() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    this.board.forEach((array, index) => {
      let newArray = this.board[index].filter((element) => element !== 0);

      newArray.forEach((e, i) => {
        const current = newArray[i];
        const next = newArray[i + 1];

        if (current !== 0 && current === next) {
          newArray[i] = current + next;
          this.score += newArray[i];
          newArray[i + 1] = 0;
        }
      });

      newArray = newArray.filter((element) => element !== 0);

      while (newArray.length < 4) {
        newArray.unshift(0);
      }
      this.board[index] = newArray;
    });

    if (!this.isEqualForArrays(oldBoard, this.board)) {
      this.createNumAfterMove();
    }
    this.render();
  }
  moveUp() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let c = 0; c < 4; c++) {
      const column = this.board.map((row) => row[c]);

      const filtered = column.filter((e) => e !== 0);

      for (let i = 0; i < filtered.length; i++) {
        if (filtered[i] !== 0 && filtered[i] === filtered[i + 1]) {
          filtered[i] += filtered[i + 1];
          this.score += filtered[i];
          filtered[i + 1] = 0;
        }
      }

      const finalColumn = filtered.filter((e) => e !== 0);

      while (finalColumn.length < 4) {
        finalColumn.push(0);
      }

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = finalColumn[r];
      }
    }

    if (!this.isEqualForArrays(oldBoard, this.board)) {
      this.createNumAfterMove();
    }
    this.render();
  }

  moveDown() {
    const oldBoard = JSON.parse(JSON.stringify(this.board));

    for (let c = 0; c < 4; c++) {
      const column = this.board.map((row) => row[c]);

      const filtered = column.filter((e) => e !== 0);

      for (let i = filtered.length - 1; i > 0; i--) {
        if (filtered[i] !== 0 && filtered[i] === filtered[i - 1]) {
          filtered[i] *= 2;
          this.score += filtered[i];
          filtered[i - 1] = 0;
        }
      }

      const finalColumn = filtered.filter((num) => num !== 0);

      while (finalColumn.length < 4) {
        finalColumn.unshift(0);
      }

      for (let r = 0; r < 4; r++) {
        this.board[r][c] = finalColumn[r];
      }
    }

    if (!this.isEqualForArrays(oldBoard, this.board)) {
      this.createNumAfterMove();
    }
    this.render();
  }

  isEqualForArrays(firstArray, secondArray) {
    const first = firstArray.flat();
    const second = secondArray.flat();

    return first.every((el, i) => el === second[i]);
  }

  createNumAfterMove() {
    const arrayOfZero = [];

    for (let r = 0; r < this.board.length; r++) {
      for (let c = 0; c < this.board[r].length; c++) {
        if (this.board[r][c] === 0) {
          arrayOfZero.push({ r, c });
        }
      }
    }

    const randomIndex = Math.floor(Math.random() * arrayOfZero.length);

    const randomCord = arrayOfZero[randomIndex];

    this.board[randomCord.r][randomCord.c] = Math.random() < 0.9 ? 2 : 4;
  }

  isFreePlace() {
    return this.board.some((row) => row.includes(0));
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    const boardState = {};

    boardState.board = this.board;
    boardState.score = this.score;
    boardState.status = this.getStatus();

    return boardState;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    const idle = this.board.flat().every((e) => e === 0);
    const win = this.board.flat().some((e) => e === 2048);

    if (idle) {
      return 'idle';
    }

    if (win) {
      return 'win';
    }

    if (this.isFreePlace() || this.isHaveMove()) {
      return `playing`;
    } else {
      return `lose`;
    }
  }

  isHaveMove() {
    const myBoard = this.board;

    for (let i = 0; i < myBoard.length; i++) {
      for (let j = 0; j < myBoard[i].length; j++) {
        if (j < myBoard[i].length - 1 && myBoard[i][j] === myBoard[i][j + 1]) {
          return true;
        }

        if (i < myBoard.length - 1 && myBoard[i][j] === myBoard[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Starts the game.
   */
  start() {
    this.createRandom();
    this.render();
  }
  /**
   * Resets the game.
   */
  restart() {
    this.resetBoard();
    this.createRandom();
    this.render();
    this.score = 0;
    this.getScore();
  }

  createRandom() {
    let isFound = false;

    while (!isFound) {
      const row1 = Math.floor(Math.random() * 4);
      const row2 = Math.floor(Math.random() * 4);

      const coll1 = Math.floor(Math.random() * 4);
      const coll2 = Math.floor(Math.random() * 4);

      if (row1 !== row2 || coll1 !== coll2) {
        this.board[row1][coll1] = Math.random() < 0.9 ? 2 : 4;

        this.board[row2][coll2] = Math.random() < 0.9 ? 2 : 4;
        isFound = true;
        this.render();
      }
    }
  }

  resetBoard() {
    this.board = [];

    for (let i = 0; i < 4; i++) {
      this.board[i] = [];

      for (let j = 0; j < 4; j++) {
        this.board[i][j] = 0;
      }
    }
  }

  render() {
    const colls = document.querySelectorAll('td');
    const flatBoard = this.board.flat();
    const gameScore = document.querySelector('.game-score');

    colls.forEach((el, i) => {
      el.textContent = flatBoard[i] ? flatBoard[i] : '';

      if (flatBoard[i]) {
        el.className = `field-cell field-cell--${flatBoard[i]}`;
      } else {
        el.className = 'field-cell';
      }
    });

    gameScore.textContent = this.score ? this.score : 0;
  }
}
