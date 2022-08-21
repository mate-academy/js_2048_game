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

    if (activeGame._isPlaying) {
      event.preventDefault();
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
    this._isActive = false;
    this._score = 0;
    this._maxValue = 0;
    this._field = [];

    this._dom = {};

    window.game2048 = window.game2048 || {
      games: [],
      keyboardHandler: null,
    };
    window.game2048.games.push(this);
  }

  get score() {
    return this._score;
  }

  set score(value) {
    this._score = value || 0;
    this._dom.score.innerText = this._score;
  }

  get maxValue() {
    return this._maxValue;
  }

  set maxValue(value) {
    if (this._maxValue >= value) {
      return;
    }

    this._maxValue = value;
  }

  get active() {
    return this._isActive;
  }

  set active(state) {
    if (!this._dom.game) {
      return;
    }

    this._isActive = state;
    this._dom.game.classList.toggle('active', state);
  }

  _initGame() {
    this._renderGame();
    this._initField();
    this._initHandlers();
    this._activateGame();
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
      <div class="game">
        <div class="game__container">
          <div class="game__header">
            <h1 class="game__title">2048</h1>

            <div class="game__controls">
              <div class="game__controls-size">
                <span
                  class="game__controls-size-smaller"
                  ${this._fieldSize === 4 ? 'disabled' : ''}
                >-</span>

                <div class="game__controls-size-block">
                  <span>Size:</span>

                  <span class="game__controls-size-value">
                    ${this._fieldSize}
                  </span>
                </div>

                <span
                  class="game__controls-size-bigger"
                  ${this._fieldSize === 10 ? 'disabled' : ''}
                >+</span>
              </div>

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
    this._dom.size = this._dom.game.querySelector('.game__controls-size');

    this._dom.controls = {
      start: this._dom.game.querySelector('.game__controls-button-start'),
      smaller: this._dom.game.querySelector('.game__controls-size-smaller'),
      bigger: this._dom.game.querySelector('.game__controls-size-bigger'),
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

  _fillField(fieldData) {
    let hasBeenChanged = false;

    for (let i = 0; i < this._fieldSize; i++) {
      for (let j = 0; j < this._fieldSize; j++) {
        if (this._field[i][j].value === fieldData[i][j].value) {
          continue;
        }

        this._field[i][j].value = fieldData[i][j].value;
        this._field[i][j].state = fieldData[i][j].isMerged ? 'merged' : '';
        this.maxValue = fieldData[i][j].value;
        hasBeenChanged = true;
      }
    }

    return hasBeenChanged;
  }

  _initHandlers() {
    if (!window.game2048.keyboardHandler) {
      // Global event
      // Prevents miltiple keyboard handlers to be attached to the document
      window.game2048.keyboardHandler = Game2048._keyboardHandler;

      document.body
        .addEventListener('keydown', window.game2048.keyboardHandler);
    }

    const startClickHandler = () => {
      this._isPlaying
        ? this.restart()
        : this.start();
    };

    const sizeSmallerClickHandler = () => {
      if (this._isPlaying || this._fieldSize === 4) {
        return;
      }

      this._fieldSize--;
      this._initGame();
    };

    const sizeBiggerClickHandler = () => {
      if (this._isPlaying || this._fieldSize === 10) {
        return;
      }

      this._fieldSize++;
      this._initGame();
    };

    this._dom.controls.start
      .addEventListener('click', startClickHandler);

    this._dom.controls.smaller
      .addEventListener('click', sizeSmallerClickHandler.bind(this));

    this._dom.controls.bigger
      .addEventListener('click', sizeBiggerClickHandler.bind(this));

    this._dom.gameContainer
      .addEventListener('click', this._activateGame.bind(this));
  }

  _insertRandomCell() {
    if (!this._isPlaying) {
      return;
    }

    const getRandomInt = max => {
      return Math.floor(Math.random() * max);
    };

    const freeCells = this._getFreeCells();
    const randomIndex = getRandomInt(freeCells.length);
    const randomValue = Math.random() < 0.1 ? 4 : 2;

    freeCells[randomIndex].value = randomValue;
    freeCells[randomIndex].state = 'new';
    this.maxValue = randomValue;
  }

  _getFreeCells() {
    return this._field
      .flat()
      .filter(cell => cell.value === 0);
  }

  _activateGame() {
    Game2048._deactivateGames();
    this.active = true;

    this._dom.game.scrollIntoView();
  }

  _moveCells(direction) {
    if (!this._isPlaying) {
      return;
    }

    const newFieldData = [];

    switch (direction) {
      case 'left': {
        for (let i = 0; i < this._fieldSize; i++) {
          const row = this._field[i];
          const rowData = [];

          for (let j = 0; j < this._fieldSize; j++) {
            const cell = row[j];

            if (!cell.value) {
              continue;
            }

            const previousCell = rowData.length
              && rowData[rowData.length - 1];

            if (
              previousCell
              && !previousCell.isMerged
              && previousCell.value === cell.value
            ) {
              previousCell.value += cell.value;
              previousCell.isMerged = true;
              this.score += previousCell.value;

              continue;
            }

            rowData.push({
              value: cell.value,
              isMerged: false,
            });
          }

          const cellsCount = rowData.length;

          if (cellsCount < this._fieldSize) {
            for (let i = 1; i <= this._fieldSize - cellsCount; i++) {
              rowData.push({
                value: 0,
              });
            }
          }

          newFieldData.push(rowData);
        }

        break;
      }

      case 'right': {
        for (let i = 0; i < this._fieldSize; i++) {
          const row = this._field[i];
          const rowData = [];

          for (let j = this._fieldSize - 1; j >= 0; j--) {
            const cell = row[j];

            if (!cell.value) {
              continue;
            }

            const previousCell = rowData.length
              && rowData[0];

            if (
              previousCell
              && !previousCell.isMerged
              && previousCell.value === cell.value
            ) {
              previousCell.value += cell.value;
              previousCell.isMerged = true;
              this.score += previousCell.value;

              continue;
            }

            rowData.unshift({
              value: cell.value,
              isMerged: false,
            });
          }

          const cellsCount = rowData.length;

          if (cellsCount < this._fieldSize) {
            for (let i = 1; i <= this._fieldSize - cellsCount; i++) {
              rowData.unshift({
                value: 0,
              });
            }
          }

          newFieldData.push(rowData);
        }

        break;
      }

      case 'up': {
        const colsData = [];

        for (let i = 0; i < this._fieldSize; i++) {
          const colData = [];

          for (let j = 0; j < this._fieldSize; j++) {
            const cell = this._field[j][i];

            if (!cell.value) {
              continue;
            }

            const previousCell = colData.length
              && colData[colData.length - 1];

            if (
              previousCell
              && !previousCell.isMerged
              && previousCell.value === cell.value
            ) {
              previousCell.value += cell.value;
              previousCell.isMerged = true;
              this.score += previousCell.value;

              continue;
            }

            colData.push({
              value: cell.value,
              isMerged: false,
            });
          }

          const cellsCount = colData.length;

          if (cellsCount < this._fieldSize) {
            for (let i = 1; i <= this._fieldSize - cellsCount; i++) {
              colData.push({
                value: 0,
              });
            }
          }

          colsData.push(colData);
        }

        for (let i = 0; i < this._fieldSize; i++) {
          for (let j = 0; j < this._fieldSize; j++) {
            newFieldData[j] = newFieldData[j] || [];
            newFieldData[j].push(colsData[i][j]);
          }
        }

        break;
      }

      case 'down': {
        const colsData = [];

        for (let i = 0; i < this._fieldSize; i++) {
          const colData = [];

          for (let j = this._fieldSize - 1; j >= 0; j--) {
            const cell = this._field[j][i];

            if (!cell.value) {
              continue;
            }

            const previousCell = colData.length
              && colData[0];

            if (
              previousCell
              && !previousCell.isMerged
              && previousCell.value === cell.value
            ) {
              previousCell.value += cell.value;
              previousCell.isMerged = true;
              this.score += previousCell.value;

              continue;
            }

            colData.unshift({
              value: cell.value,
              isMerged: false,
            });
          }

          const cellsCount = colData.length;

          if (cellsCount < this._fieldSize) {
            for (let i = 1; i <= this._fieldSize - cellsCount; i++) {
              colData.unshift({
                value: 0,
              });
            }
          }

          colsData.push(colData);
        }

        for (let i = 0; i < this._fieldSize; i++) {
          for (let j = 0; j < this._fieldSize; j++) {
            newFieldData[j] = newFieldData[j] || [];
            newFieldData[j].push(colsData[i][j]);
          }
        }

        break;
      }
    }

    const hasBeenChanged = this._fillField(newFieldData);

    if (hasBeenChanged) {
      this._checkGameWin();
      this._insertRandomCell();
      this._checkGameLose();
    }
  }

  _isNextMovementPossible() {
    if (this._getFreeCells().length > 0) {
      return true;
    }

    const hasTwoSameCellsInARow = this._field.some(row => {
      for (let i = 0; i < this._fieldSize - 1; i++) {
        if (row[i].value === row[i + 1].value) {
          return true;
        }
      }

      return false;
    });

    let hasTwoSameCellsInACol = false;

    for (let i = 0; i < this._fieldSize; i++) {
      if (hasTwoSameCellsInACol) {
        break;
      }

      for (let j = 0; j < this._fieldSize - 1; j++) {
        if (this._field[j][i].value === this._field[j + 1][i].value) {
          hasTwoSameCellsInACol = true;
          break;
        }
      }
    }

    return hasTwoSameCellsInARow || hasTwoSameCellsInACol;
  }

  _checkGameWin() {
    if (this.maxValue === 2048) {
      this._userHasWon();
    }
  }

  _checkGameLose() {
    if (!this._isNextMovementPossible()) {
      this._userHasLost();
    }
  }

  _userHasWon() {
    this._isPlaying = false;

    this._dom.controls.start.classList.remove('restart');
    this._dom.controls.start.classList.add('start');
    this._dom.controls.start.innerText = 'Start';

    this._dom.messages.start.classList.toggle('hidden', true);
    this._dom.messages.win.classList.toggle('hidden', false);
    this._dom.messages.lose.classList.toggle('hidden', true);
  }

  _userHasLost() {
    this._isPlaying = false;

    this._dom.controls.start.classList.remove('restart');
    this._dom.controls.start.classList.add('start');
    this._dom.controls.start.innerText = 'Start';

    this._dom.messages.start.classList.toggle('hidden', true);
    this._dom.messages.win.classList.toggle('hidden', true);
    this._dom.messages.lose.classList.toggle('hidden', false);
  }

  create() {
    this._initGame();
  }

  start() {
    if (this._isPlaying) {
      return;
    }

    this._activateGame();

    this._dom.controls.start.classList.remove('start');
    this._dom.controls.start.classList.add('restart');
    this._dom.controls.start.innerText = 'Reset';

    this._dom.messages.start.classList.toggle('hidden', true);

    this._dom.size.setAttribute('disabled', true);

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

    this._dom.messages.start.classList.toggle('hidden', false);
    this._dom.messages.win.classList.toggle('hidden', true);
    this._dom.messages.lose.classList.toggle('hidden', true);

    this._dom.size.removeAttribute('disabled');

    this._isPlaying = false;
    this.score = 0;
    this._maxValue = 0;
  }

  moveLeft() {
    this._moveCells('left');
  }

  moveRight() {
    this._moveCells('right');
  }

  moveUp() {
    this._moveCells('up');
  }

  moveDown() {
    this._moveCells('down');
  }
}

module.exports = Game2048;
