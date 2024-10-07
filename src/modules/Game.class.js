'use strict';
import Core from './Core.class';

import { GAME_STATUSES, KEY_BINDS } from '../lib/constants';

class Game extends Core {
  #hydrate() {
    this.controls.startBtn.addEventListener('click', this.start.bind(this));
    this.controls.restartBtn.addEventListener('click', this.restart.bind(this));

    document.addEventListener('keyup', ({ key }) => {
      switch (key) {
        case KEY_BINDS.w:
        case KEY_BINDS.ArrowUp:
          this.moveUp();
          break;

        case KEY_BINDS.a:
        case KEY_BINDS.ArrowLeft:
          this.moveLeft();
          break;

        case KEY_BINDS.s:
        case KEY_BINDS.ArrowDown:
          this.moveDown();
          break;

        case KEY_BINDS.d:
        case KEY_BINDS.ArrowRight:
          this.moveRight();
          break;
      }
    });
  }

  /**
   * Initialize the game.
   */
  initialize(rootRef) {
    super._initialize(rootRef);

    this.#hydrate();
    this._setStatusIdle();
    this._showStartMessage();
  }

  getScore() {
    return this._getScore();
  }

  getState() {
    return this._getState();
  }

  getStatus() {
    return this._getStatus();
  }

  /**
   * Start the game.
   */
  start() {
    this._setupNewGame();

    this.controls.startBtn.removeEventListener('click', this.start.bind(this));
    this.controls.startBtn.classList.add('hidden');
    this.controls.restartBtn.classList.remove('hidden');

    this._hideMessages();
    this._rerender();
  }

  /**
   * Reset the game.
   */
  restart() {
    this._hideMessages();

    this._setupNewGame();

    this._rerender();
  }

  /**
   * Controls.
   */
  moveLeft() {
    const gameStatus = this._getStatus();

    if (gameStatus !== GAME_STATUSES.playing) {
      return;
    }

    const { wasChanged } = this._shiftLeft();

    if (wasChanged) {
      this._createNewCell();
    }

    this._rerender();
  }

  moveRight() {
    const gameStatus = this._getStatus();

    if (gameStatus !== GAME_STATUSES.playing) {
      return;
    }

    const { wasChanged } = this._shiftRight();

    if (wasChanged) {
      this._createNewCell();
    }

    this._rerender();
  }

  moveUp() {
    const gameStatus = this._getStatus();

    if (gameStatus !== GAME_STATUSES.playing) {
      return;
    }

    const { wasChanged } = this._shiftTop();

    if (wasChanged) {
      this._createNewCell();
    }

    this._rerender();
  }

  moveDown() {
    const gameStatus = this._getStatus();

    if (gameStatus !== GAME_STATUSES.playing) {
      return;
    }

    const { wasChanged } = this._shiftBottom();

    if (wasChanged) {
      this._createNewCell();
    }

    this._rerender();
  }
}

module.exports = Game;
