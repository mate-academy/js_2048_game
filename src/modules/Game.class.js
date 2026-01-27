/* eslint-disable curly */
'use strict';

import { filterBoard, filterBoardReverse, slide, turnBoard } from './constraints';

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

  moveUp() {
    const board = this.boardService.get();
    const rowsList = turnBoard(board);

    const filteredRows = filterBoard(rowsList);

    for (let i = 0; i < filteredRows.length; i++) {
      filteredRows[i] = slide(filteredRows[i]);
    }

    // TODO: create function for this, DRY
    const result = [];

    for (let i = 0; i < filteredRows.length; i++) {
      result.push([]);

      for (let j = 0; j < filteredRows[i].length; j++) {
        result[i][j] = filteredRows[j][i];
      }
    }

    // create function
    if (JSON.stringify(board) !== JSON.stringify(result)) {
      this.cellService.addRandomCell(result);
    }
    this.boardService.set(result);

    return result;
  }

  // break your head to find the way to fix issue with adding cell
  // if there no move
  // maybe logic to copy matrix(not detaching the origin matrix to variable)
  // and at the end compare it and if it equals, do not add cell
  // and check if im not implement this logic by the way
  // IMPLEMENTED: check at the morning how it implemented
  // all of the code, fix dirty code!!
  // add score service, won and loose events and its ready!
  moveDown() {
    const board = this.boardService.get();
    const rowsList = turnBoard(board);
    const filteredRows = filterBoardReverse(rowsList);

    for (let i = 0; i < filteredRows.length; i++) {
      filteredRows[i] = slide(filteredRows[i]).reverse();
    }

    // TODO: create function for this, DRY
    const result = [];

    for (let i = 0; i < filteredRows.length; i++) {
      result.push([]);

      for (let j = 0; j < filteredRows[i].length; j++) {
        result[i][j] = filteredRows[j][i];
      }
    }

    // issue when there no steps to play its add cell anyway
    // check comment at the top
    if (JSON.stringify(board) !== JSON.stringify(result)) {
      this.cellService.addRandomCell(result);
    }

    this.boardService.set(result);

    return result;
  }
  moveLeft() {
    const board = this.boardService.get();
    const filteredRows = filterBoard(board);

    for (let i = 0; i < filteredRows.length; i++) {
      filteredRows[i] = slide(filteredRows[i]);
    }

    if (JSON.stringify(board) !== JSON.stringify(filteredRows)) {
      this.cellService.addRandomCell(filteredRows);
    }

    this.boardService.set(filteredRows);

    return filteredRows;
  }

  moveRight() {
    const board = this.boardService.get();
    const filteredRows = filterBoardReverse(board);

    for (let i = 0; i < filteredRows.length; i++) {
      filteredRows[i] = slide(filteredRows[i]).reverse();
    }

    if (JSON.stringify(board) !== JSON.stringify(filteredRows)) {
      this.cellService.addRandomCell(filteredRows);
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
