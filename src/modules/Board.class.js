'use strict';

class BoardService {
  set(boardState) {
    this.board = boardState;
  }

  reset(initialState) {
    this.board = initialState.map((v) => v.map((deepValue) => deepValue));
  }

  get() {
    return this.board;
  }
}

module.exports = BoardService;
