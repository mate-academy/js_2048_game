/* eslint-disable curly */
'use strict';

const CellService = require('./Cell.class');
const BoardService = require('./Board.class');
const ScoreService = require('./Score.class');

class Game {
  static gameLoseStatus = 'lose';
  static gameWinStatus = 'win';
  static gamePlayingStatus = 'playing';
  static gameIdleStatus = 'idle';

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    initialGameStatus = 'idle',
  ) {
    this.initialState = initialState;
    this.gameStatus = initialGameStatus;
    this.gameScore = new ScoreService(); // TODO: create score service
    this.boardService = new BoardService(initialState);
    this.cellService = new CellService();
  }

  eventHandler() {
    // there will be logic for event handler
    this.gameFunctions.onStart();
  }

  moveUp() {}
  // moveDown() {
  //   const board = this.boardService.get();

  //   const rowsList = [];

  //   for (let i = 0; i < board.length; i++) {
  //     rowsList.push([]);

  //     for (let j = 0; j < board[i].length; j++) {
  //       rowsList[i][j] = board[j][i];
  //     }
  //   }

  //   const filteredRows = rowsList.map((v) => v.filter((dv) => dv !== 0));

  //   for (let i = 0; i < filteredRows.length; i++) {
  //     this.slide(filteredRows[i]);
  //   }

  //   this.boardService.set(filteredRows);

  //   return filteredRows;

  // }
  moveLeft() {
    const board = this.boardService.get();

    // TODO: make a reusable function
    const filteredRows = board.map((v) => v.filter((dv) => dv !== 0));

    for (let i = 0; i < filteredRows.length; i++) {
      this.slide(filteredRows[i]);
    }

    this.boardService.set(filteredRows);

    return filteredRows;
  }

  slide(filteredRow) {
    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        filteredRow[i + 1] = 0;
      }
    }
    filteredRow.filter((v) => v !== 0);

    // TODO: make constant for row length or find the way to extract it
    while (filteredRow.length < 4) {
      filteredRow.push(0);
    }

    return filteredRow;
  }

  moveRight() {
    const board = this.boardService.get();

    // TODO: make a reusable function
    const filteredRows = board.map((v) => v.filter((dv) => dv !== 0).reverse());

    for (let i = 0; i < filteredRows.length; i++) {
      this.slide(filteredRows[i]);
      filteredRows[i] = filteredRows[i].reverse();
    }

    this.boardService.set(filteredRows);

    return filteredRows;
  }

  /**
   * @returns {number}
   */
  getScore() {
    // return this.scoreService.getScore();
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.boardService.getBoard();
  }

  // @returns {string} One of: 'idle', 'playing', 'win', 'lose'
  getStatus() {
    // logic for checking status
    return this.gameStatus;
  }

  start() {
    this.boardService.reset(this.initialState);
    // this.gameScore.set(0);
    this.gameStatus = Game.gamePlayingStatus;

    this.cellService.addRandomCell(this.boardService.get(), 2);
  }

  // restart() {
  //   this.start();
  // }

  // won the game
  win() {}

  getCellsCoordinates() {
    return this.boardService.get();
  }
}

module.exports = Game;
