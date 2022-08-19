'use strict';

const Cell = require('./Cell');

class Game2048 {
  constructor(container, fieldSize) {
    this._fieldSize = !fieldSize || fieldSize < 4
      ? 4
      : fieldSize > 8
        ? 8
        : fieldSize;

    this._container = container || 'body';
    this._isPlaying = false;
    this._score = 0;
    this._field = [];

    this.dom = {};
  }

  _initGame() {
    this._renderGame();
    this._initField();
  }

  _renderGame() {
    if (this._container instanceof Element) {
      this.dom.container = this._container;
    } else if (typeof this._container === 'string') {
      this.dom.container = document
        .querySelector(this._container);
    } else {
      throw new TypeError(
        'Game container must be a DOM Element or string!'
      );
    }

    if (!this.dom.container) {
      throw new Error(
        'Game container not found!'
      );
    }

    this.dom.container.insertAdjacentHTML('afterbegin', `
      <div class="game">
        <div class="game__container">
          <div class="game__header">
            <h1 class="game__title">2048</h1>
            <div class="game__controls">
              <p class="game__controls-info">
                Score: <span class="game-score">0</span>
              </p>
              <button class="game__controls-button button start">Start</button>
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
    `);

    this.dom.field = this.dom.container.querySelector('.field');
  }

  _initField() {
    this._field = [];

    if (!this.dom.field) {
      return;
    }

    const rows = this.dom.field.querySelectorAll('.field__row');

    [...rows].forEach(row => {
      const cellsRow = [];
      const cells = row.querySelectorAll('.field__cell');

      [...cells].forEach(cell => cellsRow.push(new Cell(cell)));

      this._field.push(cellsRow);
    });
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

  start() {
    if (this._isPlaying) {
      return;
    }

    this._activateGame();

    this._dom.controls.start.classList.remove('start');
    this._dom.controls.start.classList.add('restart');
    this._dom.controls.start.innerText = 'Reset';

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

    this._isPlaying = false;
    this.score = 0;
  }
}

module.exports = Game2048;
