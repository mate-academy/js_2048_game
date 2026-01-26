/* eslint-disable prettier/prettier */
'use strict';

class BoardService {
  constructor(initialBoardState) {
    this.initialBoardState = initialBoardState;
  }
  set(boardState) {
    this.board = boardState;
  }

  reset() {
    this.board = this.initialBoardState.map((v) =>
      v.map((deepValue) => deepValue));
  }

  get() {
    return this.board;
  }
}

module.exports = BoardService;
