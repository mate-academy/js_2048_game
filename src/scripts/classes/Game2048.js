/* eslint-disable no-shadow */
'use strict';

const Cell = require('./Cell');

class Game2048 {
  static _keyboardHandler(event) {
    const activeGame = window.game2048
      && window.game2048.games.find(game => game.active);

    if (!activeGame) {
      return;
    }

    switch (event.code) {
      case 'ArrowLeft':
      case 'Numpad4':
        activeGame.moveLeft();
        break;
      case 'ArrowRight':
      case 'Numpad6':
        activeGame.moveRight();
        break;
      case 'ArrowUp':
      case 'Numpad8':
        activeGame.moveUp();
        break;
      case 'ArrowDown':
      case 'Numpad2':
        activeGame.moveDown();
        break;
      case 'Enter':
      case 'NumpadEnter':
        activeGame.start();
        break;
      case 'KeyR':
        activeGame.restart();
        break;
    };
  }

  static _deactivateGames() {
    if (!window.game2048) {
      return;
    }

    window.game2048.games.forEach(game => (game.active = false));
  }

  constructor(container, fieldSize) {
    this._fieldSize = !fieldSize || fieldSize < 4
      ? 4
      : fieldSize > 8
        ? 8
        : fieldSize;

    this._container = container || 'body';
    this._isPlaying = false;
    this._isActive = true;
    this._score = 0;
    this._field = [];

    this._dom = {};

    window.game2048 = window.game2048 || {
      games: [],
      keyboardHandler: null,
    };
    window.game2048.games.push(this);

    this._initGame();
  }

  get score() {
    return this._score;
  }

  set score(value) {
    this._score = value || 0;
    this._dom.score.innerText = this._score;
  }

  get active() {
    return this._isActive;
  }

  set active(state) {
    this._isActive = state;
    this._dom.game.classList.toggle('active', state);
  }

  _initGame() {
    this._renderGame();
    this._initField();
    this._initHandlers();
  }

  _renderGame() {
    if (this._container instanceof Element) {
      this._dom.container = this._container;
    } else if (typeof this._container === 'string') {
      this._dom.container = document
        .querySelector(this._container);
    } else {
      throw new TypeError(
        'Game container must be a DOM Element or string!'
      );
    }

    if (!this._dom.container) {
      throw new Error(
        'Game container not found!'
      );
    }

    this._dom.container.innerHTML = `
      <div class="game active">
        <div class="game__container">
          <div class="game__header">
            <h1 class="game__title">2048</h1>
            <div class="game__controls">
              <p class="game__controls-info">
                Score: <span class="game-score">0</span>
              </p>
              <button class="
                game__controls-button-start
                button start"
              >Start</button>
            </div>
          </div>
          <table class="game__field field">
            <tbody>
              ${`
                  <tr class="field__row">
                    ${`<td class="field__cell"></td>`.repeat(this._fieldSize)}
                  </tr>
                `.repeat(this._fieldSize)}
            </tbody>
          </table>
          <div class="game__messages">
            <p class="message message-lose hidden">
              You lose! Restart the game?
            </p>
            <p class="message message-win hidden">
              Winner! Congrats! You did it!
            </p>
            <p class="message message-start">
              Press "Start" to begin game. Good luck!
            </p>
          </div>
        </div>
      </div>
    `;

    this._dom.game = this._dom.container.querySelector('.game');
    this._dom.gameContainer = this._dom.game.querySelector('.game__container');
    this._dom.field = this._dom.game.querySelector('.field');
    this._dom.score = this._dom.game.querySelector('.game-score');

    this._dom.controls = {
      start: this._dom.game.querySelector('.game__controls-button-start'),
    };

    this._dom.rows = this._dom.field.querySelectorAll('.field__row');

    this._dom.messages = {
      start: this._dom.game.querySelector('.message-start'),
      win: this._dom.game.querySelector('.message-win'),
      lose: this._dom.game.querySelector('.message-lose'),
    };
  }

  _initField() {
    this._field = [];

    if (!this._dom.field) {
      return;
    }

    [...this._dom.rows].forEach(row => {
      const cellsRow = [];
      const cells = row.querySelectorAll('.field__cell');

      [...cells].forEach(cell => cellsRow.push(new Cell(cell)));

      this._field.push(cellsRow);
    });
  }

  _clearField() {
    this._field.forEach(row => {
      row.forEach(cell => (cell.value = 0));
    });
  }

  _initHandlers() {
    if (!window.game2048.keyboardHandler) {
      // Global event
      // Prevents miltiple keyboard handlers to be attached to the document
      window.game2048.keyboardHandler = Game2048._keyboardHandler;
    }

    document.body
      .addEventListener('keydown', window.game2048.keyboardHandler);

    const startClickHandler = (event) => {
      this._isPlaying
        ? this.restart()
        : this.start();
    };

    this._dom.controls.start
      .addEventListener('click', startClickHandler.bind(this));

    this._dom.gameContainer
      .addEventListener('click', this._activateGame.bind(this));
  }

  _insertRandomCell() {
    const getRandomInt = max => {
      return Math.floor(Math.random() * max);
    };

    const freeCells = this._field
      .flat()
      .filter(cell => cell.value === 0);
    const randomIndex = getRandomInt(freeCells.length);
    const randomValue = Math.random() < 0.1 ? 4 : 2;

    freeCells[randomIndex].value = randomValue;
  }

  _activateGame() {
    if (this.active) {
      return;
    }

    Game2048._deactivateGames();
    this.active = true;
  }

  start() {
    if (this._isPlaying) {
      return;
    }

    this._activateGame();

    this._dom.controls.start.classList.remove('start');
    this._dom.controls.start.classList.add('restart');
    this._dom.controls.start.innerText = 'Reset';

    this._dom.messages.start.classList.toggle('hidden');

    this._isPlaying = true;

    this._insertRandomCell();
  }

  restart() {
    if (!this._isPlaying) {
      return;
    }

    this._clearField();
    this._activateGame();

    this._dom.controls.start.classList.remove('restart');
    this._dom.controls.start.classList.add('start');
    this._dom.controls.start.innerText = 'Start';

    this._dom.messages.start.classList.toggle('hidden');
    this._dom.messages.win.classList.toggle('hidden', true);
    this._dom.messages.lose.classList.toggle('hidden', true);

    this._isPlaying = false;
    this.score = 0;
  }
}

module.exports = Game2048;
