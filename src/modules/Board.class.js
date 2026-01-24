'use strict';

class BoardService {
  constructor(initialState) {
    this.initialState = initialState;
    this.board = this.initialState.map((v) => v.map((deepValue) => deepValue));
  }

  resetBoard() {
    this.board = this.initialState.map((v) => v.map((deepValue) => deepValue));
  }
}

module.exports = BoardService;
