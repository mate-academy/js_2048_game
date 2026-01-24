/* eslint-disable curly */
'use strict';

const CellService = require('./Cell.class');
const BoardService = require('./Board.class');

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
    initialScore = 0,
  ) {
    this.gameStatus = initialGameStatus;
    this.gameScore = initialScore;
    this.boardService = new BoardService(initialState);
    this.cellService = new CellService();
  }

  moveLeft() {}
  moveRight() {}
  moveUp() {}
  moveDown() {}

  /**
   * @returns {number}
   */
  getScore() {
    return this.gameScore;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.boardService.board;
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
    return this.gameStatus;
  }

  /**
   * Starts the game.
   */
  start() {
    this.boardService.resetBoard();
    this.gameScore = 0;
    this.gameStatus = Game.gamePlayingStatus;

    // logic for adding score

    this.cellService.addRandomCell(this.boardService.board);

    return this.boardService.board;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here
}

module.exports = Game;
