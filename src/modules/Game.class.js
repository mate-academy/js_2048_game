/* eslint-disable curly */
'use strict';

import {
  filterBoard,
  filterBoardReverse,
  turnBoard,
  amountOfRows,
  checkGameStatus,
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
      [1024, 1024, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    initialGameStatus = 'idle',
    score = 0,
  ) {
    this.initialState = initialState;
    this.gameStatus = initialGameStatus;
    this.scoreService = new ScoreService(score);
    this.boardService = new BoardService(initialState);
    this.cellService = new CellService();
  }

  #slide(filteredRow) {
    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] *= 2;
        this.scoreService.add(filteredRow[i]);
        filteredRow[i + 1] = 0;
      }
    }

    const result = filteredRow.filter((v) => v !== 0);

    while (result.length < amountOfRows) {
      result.push(0);
    }

    return result;
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
      filteredRows[i] = this.#slide(filteredRows[i]);
    }

    const normalizedRowsList = turnBoard(filteredRows);

    this.#checkIfCanAddCell(board, normalizedRowsList);
    this.boardService.set(normalizedRowsList);
    this.gameStatus = checkGameStatus(normalizedRowsList);

    return normalizedRowsList;
  }

  moveDown() {
    if (this.gameStatus === 'win') return;

    const board = this.boardService.get();
    const rotatedRowsList = turnBoard(board);
    const filteredRows = filterBoardReverse(rotatedRowsList);

    for (let i = 0; i < filteredRows.length; i++) {
      filteredRows[i] = this.#slide(filteredRows[i]).reverse();
    }

    const normalizedRowsList = turnBoard(filteredRows);

    this.#checkIfCanAddCell(board, normalizedRowsList);
    this.boardService.set(normalizedRowsList);
    this.gameStatus = checkGameStatus(normalizedRowsList);

    return normalizedRowsList;
  }

  moveLeft() {
    if (this.gameStatus === 'win') return;

    const board = this.boardService.get();
    const filteredRows = filterBoard(board);

    for (let i = 0; i < filteredRows.length; i++) {
      filteredRows[i] = this.#slide(filteredRows[i]);
    }

    this.#checkIfCanAddCell(board, filteredRows);
    this.boardService.set(filteredRows);
    this.gameStatus = checkGameStatus(filteredRows);

    return filteredRows;
  }

  moveRight() {
    if (this.gameStatus === 'win') return;

    const board = this.boardService.get();
    const filteredRows = filterBoardReverse(board);

    for (let i = 0; i < filteredRows.length; i++) {
      filteredRows[i] = this.#slide(filteredRows[i]).reverse();
    }

    this.#checkIfCanAddCell(board, filteredRows);
    this.boardService.set(filteredRows);
    this.gameStatus = checkGameStatus(filteredRows);

    return filteredRows;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.scoreService.get();
  }

  resetScore() {
    this.scoreService.reset();
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.boardService.get();
  }

  // @returns {string} One of: 'idle', 'playing', 'win', 'lose'
  getStatus() {
    return this.gameStatus;
  }

  start() {
    this.boardService.reset(this.initialState);
    // this.gameScore.set(0);
    this.gameStatus = Game.gamePlayingStatus;

    this.cellService.addRandomCell(this.boardService.get(), 2);
  }

  getCellsCoordinates() {
    return this.boardService.get();
  }
}

module.exports = Game;
