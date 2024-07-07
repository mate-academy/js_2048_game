'use strict';

const { gameStatus } = require('../constants/gameStatus');
const {
  default: addNewNumToState,
} = require('../scripts/components/addNewNum');
const { default: initialState } = require('../scripts/components/initialState');
const { default: moveDown } = require('../scripts/components/moveDown');
const { default: moveLeft } = require('../scripts/components/moveLeft');
const { default: moveRight } = require('../scripts/components/moveRight');
const { default: moveUp } = require('../scripts/components/moveUp');
const { default: renderNums } = require('../scripts/components/renderNums');

class Game {
  state = [];
  status = gameStatus.idle;

  constructor(data) {
    this.state = data;
  }

  moveLeft() {
    if (this.getStatus() !== gameStatus.playing) {
      return;
    }

    const afterMove = moveLeft(this.getState());

    if (this.isFull(afterMove)) {
      this.gameOver();

      return;
    }

    const newState = addNewNumToState(afterMove);

    this.state = newState;
    renderNums(newState);

    if (this.has2048(this.state)) {
      this.winner();
    }
  }

  moveRight() {
    if (this.getStatus() !== gameStatus.playing) {
      return;
    }

    const afterMove = moveRight(this.getState());

    if (this.isFull(afterMove)) {
      this.gameOver();

      return;
    }

    const newState = addNewNumToState(afterMove);

    this.state = newState;
    renderNums(newState);

    if (this.has2048(this.state)) {
      this.winner();
    }
  }

  moveUp() {
    if (this.getStatus() !== gameStatus.playing) {
      return;
    }

    const afterMove = moveUp(this.getState());

    if (this.isFull(afterMove)) {
      this.gameOver();

      return;
    }

    const newState = addNewNumToState(afterMove);

    this.state = newState;
    renderNums(newState);

    if (this.has2048(this.state)) {
      this.winner();
    }
  }

  moveDown() {
    if (this.getStatus() !== gameStatus.playing) {
      return;
    }

    const afterMove = moveDown(this.getState());

    if (this.isFull(afterMove)) {
      this.gameOver();

      return;
    }

    const newState = addNewNumToState(afterMove);

    this.state = newState;
    renderNums(newState);

    if (this.has2048(this.state)) {
      this.winner();
    }
  }

  getScore() {
    if (this.status === gameStatus.idle) {
      return 0;
    }

    return this.state.flat().reduce((acc, elem) => acc + elem, 0);
  }

  getState() {
    return this.state.map((row) => [...row]);
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
    return this.status;
  }

  start() {
    this.status = gameStatus.playing;
    renderNums(this.getState());
  }

  restart() {
    this.state = initialState();
    renderNums(this.getState());
  }

  isFull(afterMove) {
    return afterMove.flat().every((cell) => cell !== 0);
  }

  gameOver() {
    this.status = gameStatus.lose;
    document.querySelector('.message-lose').classList.remove('hidden');
  }

  has2048(afterMove) {
    return afterMove.flat().includes(2048);
  }

  winner() {
    this.status = gameStatus.win;
    document.querySelector('.message-win').classList.remove('hidden');
  }
}

module.exports = Game;
