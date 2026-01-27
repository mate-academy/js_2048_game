/* eslint-disable curly */
'use strict';

import {
  filterBoard,
  filterBoardReverse,
  slide,
  turnBoard,
} from './utils/modules.constraints';

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

  // TODO: separate all function from this file

  #checkGameStatus(board) {
    let win = false;
    let playing = false;

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 2048) {
          win = true;
        }

        if (
          board[i][j] === board[i][j + 1] ||
          board[i][j] === board[i + 1]?.[j] ||
          board[i][j] === 0
        ) {
          playing = true;
        }
      }
    }

    if (win) return 'win';
    if (playing) return 'playing';

    return 'loose';
  }

  #checkIfCanAddCell(board, comparativeBoard) {
    if (JSON.stringify(board) !== JSON.stringify(comparativeBoard)) {
      this.cellService.addRandomCell(comparativeBoard);
    }
  }

  moveUp() {
    if (this.gameStatus === 'win') return;

    const board = this.boardService.get();
    const rotatedRowsList = turnBoard(board);
    const filteredRows = filterBoard(rotatedRowsList);

    for (let i = 0; i < filteredRows.length; i++) {
      filteredRows[i] = slide(filteredRows[i]);
    }

    const normalizedRowsList = turnBoard(filteredRows);

    this.#checkIfCanAddCell(board, normalizedRowsList);
    this.boardService.set(normalizedRowsList);
    this.gameStatus = this.#checkGameStatus(normalizedRowsList);

    return normalizedRowsList;
  }

  // fix dirty code!!
  // add score service, won and loose events and its ready!
  moveDown() {
    if (this.gameStatus === 'win') return;

    const board = this.boardService.get();
    const rotatedRowsList = turnBoard(board);
    const filteredRows = filterBoardReverse(rotatedRowsList);

    for (let i = 0; i < filteredRows.length; i++) {
      filteredRows[i] = slide(filteredRows[i]).reverse();
    }

    const normalizedRowsList = turnBoard(filteredRows);

    this.#checkIfCanAddCell(board, normalizedRowsList);
    this.boardService.set(normalizedRowsList);
    this.gameStatus = this.#checkGameStatus(normalizedRowsList);

    return normalizedRowsList;
  }

  moveLeft() {
    if (this.gameStatus === 'win') return;

    const board = this.boardService.get();
    const filteredRows = filterBoard(board);

    for (let i = 0; i < filteredRows.length; i++) {
      filteredRows[i] = slide(filteredRows[i]);
    }

    this.#checkIfCanAddCell(board, filteredRows);
    this.boardService.set(filteredRows);
    this.gameStatus = this.#checkGameStatus(filteredRows);

    return filteredRows;
  }

  moveRight() {
    if (this.gameStatus === 'win') return;

    const board = this.boardService.get();
    const filteredRows = filterBoardReverse(board);

    for (let i = 0; i < filteredRows.length; i++) {
      filteredRows[i] = slide(filteredRows[i]).reverse();
    }

    this.#checkIfCanAddCell(board, filteredRows);
    this.boardService.set(filteredRows);
    this.gameStatus = this.#checkGameStatus(filteredRows);

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
    return this.boardService.get();
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

  getCellsCoordinates() {
    return this.boardService.get();
  }
}

module.exports = Game;
