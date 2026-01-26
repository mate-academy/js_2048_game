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

  moveLeft() {}
  moveRight() {}
  moveUp() {}
  moveDown() {}

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

  // Add your own methods here

  getCellsCoordinates() {
    return this.boardService.get();
  }
}

module.exports = Game;
