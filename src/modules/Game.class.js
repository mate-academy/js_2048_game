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
  statuses = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(initialState) {
    this.board = initialState
      ? JSON.parse(JSON.stringify(initialState))
      : this.getEmptyBoard();
    this.score = 0;
    this.status = this.statuses.idle;
  }

  moveLeft() {
    const oldState = JSON.stringify(this.board);

    for (let i = 0; i < this.board.length; i++) {
      const result = this.slideMerge(this.board[i]);

      this.board[i] = result.mergedArray;

      this.score += result.points;
    }

    const newState = JSON.stringify(this.board);

    if (oldState !== newState) {
      this.addRandomTile();
    }
  }

  moveRight() {
    const oldState = JSON.stringify(this.board);

    for (let i = 0; i < this.board.length; i++) {
      const result = this.slideMerge([...this.board[i]].reverse());

      this.board[i] = result.mergedArray.reverse();

      this.score += result.points;
    }

    const newState = JSON.stringify(this.board);

    if (oldState !== newState) {
      this.addRandomTile();
    }
  }

  moveUp() {
    const oldState = JSON.stringify(this.board);

    for (let i = 0; i < this.board.length; i++) {
      const tempArr = [];

      for (let j = 0; j < this.board.length; j++) {
        tempArr.push(this.board[j][i]);
      }

      const result = this.slideMerge(tempArr);

      for (let j = 0; j < this.board.length; j++) {
        this.board[j][i] = result.mergedArray[j];
      }

      this.score += result.points;
    }

    const newState = JSON.stringify(this.board);

    if (oldState !== newState) {
      this.addRandomTile();
    }
  }

  moveDown() {
    const oldState = JSON.stringify(this.board);

    for (let i = 0; i < this.board.length; i++) {
      const tempArr = [];

      for (let j = 0; j < this.board.length; j++) {
        tempArr.push(this.board[j][i]);
      }

      const result = this.slideMerge(tempArr.reverse());

      result.mergedArray.reverse();

      for (let j = 0; j < this.board.length; j++) {
        this.board[j][i] = result.mergedArray[j];
      }

      this.score += result.points;
    }

    const newState = JSON.stringify(this.board);

    if (oldState !== newState) {
      this.addRandomTile();
    }
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
    return this.board;
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
    if (this.status === this.statuses.playing) {
      if (this.hasWon()) {
        this.status = this.statuses.win;
      }

      if (this.hasLost()) {
        this.status = this.statuses.lose;
      }
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.status = this.statuses.playing;
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = this.getEmptyBoard();
    this.status = this.statuses.playing;
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  getEmptyBoard() {
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    return newBoard;
  }

  slideMerge(data) {
    let pointsEarned = 0;

    const filteredArr = data.filter((el) => el > 0);

    for (let i = 0; i < filteredArr.length; i++) {
      if (filteredArr[i] === filteredArr[i + 1]) {
        filteredArr[i] += filteredArr[i + 1];

        pointsEarned += filteredArr[i];

        filteredArr[i + 1] = 0;
      }
    }

    const finalFilter = filteredArr.filter((el) => el > 0);

    while (finalFilter.length !== data.length) {
      finalFilter.push(0);
    }

    return { mergedArray: finalFilter, points: pointsEarned };
  }

  addRandomTile() {
    const listEmptyCoordinates = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          listEmptyCoordinates.push({ r: i, c: j });
        }
      }
    }

    if (listEmptyCoordinates.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * listEmptyCoordinates.length);

    const randomCell = listEmptyCoordinates[randomIndex];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[randomCell.r][randomCell.c] = value;
  }

  hasWon() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  hasLost() {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }

        if (j < this.board.length - 1) {
          if (this.board[i][j] === this.board[i][j + 1]) {
            return false;
          }
        }

        if (i < this.board.length - 1) {
          if (this.board[i][j] === this.board[i + 1][j]) {
            return false;
          }
        }
      }
    }

    return true;
  }
}

export default Game;
