'use strict';
import {
  GAME_STATUSES,
  MESSAGES_KEYS,
  FIELD_ROW_LENGTH,
} from '../lib/constants';

import {
  FIELD_HTML_TEMPLATE,
  HEADER_HTML_TEMPLATE,
  MESSAGE_LOSE_HTML_TEMPLATE,
} from '../lib/templates';

import {
  generateCellValue,
  generateRandomPosition,
  horizontalShift,
  rotateFieldForward,
  verticalShift,
} from '../lib/helpers';

class Core {
  field = null;
  score = 0;
  fieldControls = {};

  status = null;
  messages = {};

  #triggerMessage({ key, show }) {
    if (show) {
      this.messages[key].classList.remove('hidden');
    } else {
      this.messages[key].classList.add('hidden');
    }
  }

  #updateField(newField) {
    this.field = newField;
  }

  #updateScore(score) {
    this.score += score;
  }

  #createNewField() {
    const newField = Array.from({ length: FIELD_ROW_LENGTH }, () => [
      0, 0, 0, 0,
    ]);

    this.#updateField(newField);
  }

  #seed() {
    const field = this._getField();

    const [firstCellPosX, firstCellPosY] = generateRandomPosition({ field });
    const [secondCellPosX, secondCellPosY] = generateRandomPosition({
      field,
      exclude: [firstCellPosX, firstCellPosY],
    });

    field[firstCellPosY][firstCellPosX] = generateCellValue();
    field[secondCellPosY][secondCellPosX] = generateCellValue();

    this.#updateField(field);
  }

  #initialRender(rootRef) {
    rootRef.classList.add('container');

    const headerNode = document.createElement('div');
    const fieldNode = document.createElement('table');
    const notificationNode = document.createElement('div');

    headerNode.classList.add('game-header');
    fieldNode.classList.add('game-field');
    notificationNode.classList.add('message-container');

    headerNode.innerHTML = HEADER_HTML_TEMPLATE;
    fieldNode.innerHTML = FIELD_HTML_TEMPLATE;
    notificationNode.innerHTML = MESSAGE_LOSE_HTML_TEMPLATE;

    rootRef.append(headerNode, fieldNode, notificationNode);
  }

  #initializeControls() {
    this.controls = {
      startBtn: document.getElementById('start'),
      restartBtn: document.getElementById('restart'),
    };
  }

  #initializeMessages() {
    this.messages = {
      msgWin: document.getElementById('message-win'),
      msgLose: document.getElementById('message-lose'),
      msgStart: document.getElementById('message-start'),
    };
  }

  #checkIfHasEmptyCells() {
    const field = this._getField();

    return field.some((row) => row.some((cell) => !cell));
  }

  #checkIfHasAvailablePares() {
    const field = this._getField();

    for (let i = 0; i < field.length; i++) {
      const row = field[i];

      for (let y = 0; y < row.length; y++) {
        if (row[y] === row[y + 1]) {
          return true;
        }
      }
    }

    const rotatedBoard = rotateFieldForward(field);

    for (let i = 0; i < rotatedBoard.length; i++) {
      const row = rotatedBoard[i];

      for (let y = 0; y < row.length; y++) {
        if (row[y] === row[y + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  #winTheGame() {
    this._setStatus(GAME_STATUSES.win);
    this._showWinMessage();
  }

  _setStatus(value) {
    this.status = value;
  }

  _getStatus() {
    return this.status;
  }

  _getScore() {
    return this.score;
  }

  _getField() {
    return [...this.field];
  }

  /**
   * Game statuses.
   */
  _setStatusIdle() {
    this._setStatus(GAME_STATUSES.idle);
  }

  _setStatusWin() {
    this._setStatus(GAME_STATUSES.win);
  }

  _setStatusLose() {
    this._setStatus(GAME_STATUSES.lose);
  }

  _setStatusPlaying() {
    this._setStatus(GAME_STATUSES.playing);
  }

  /**
   * Game messages.
   */
  _showStartMessage() {
    this.#triggerMessage({ key: MESSAGES_KEYS.start, show: true });
  }

  _showWinMessage() {
    this.#triggerMessage({ key: MESSAGES_KEYS.win, show: true });
  }

  _showLoseMessage() {
    this.#triggerMessage({ key: MESSAGES_KEYS.lose, show: true });
  }

  _hideMessages() {
    for (const key in MESSAGES_KEYS) {
      this.#triggerMessage({ key: MESSAGES_KEYS[key], show: false });
    }
  }

  _setupNewGame() {
    this.#createNewField();
    this.#seed();
    this._setStatusPlaying();
  }

  _initialize(rootRef) {
    this.#initialRender(rootRef);
    this.#initializeControls();
    this.#initializeMessages();
  }

  _rerender() {
    const fieldCells = document.querySelectorAll('.field-cell');
    const scoreField = document.getElementById('game-score');

    const field = this._getField();
    const score = this._getScore();

    field.forEach((row, rowIdx) => {
      row.forEach((cell, cellIdx) => {
        const currentCellIdx = cellIdx + 4 * rowIdx;
        const cellElement = fieldCells[currentCellIdx];

        if (cell) {
          cellElement.className = 'field-cell';
          cellElement.classList.add(`field-cell--${cell}`);
          cellElement.textContent = cell;
        } else {
          cellElement.textContent = '';
          cellElement.className = 'field-cell';
        }
      });
    });

    scoreField.textContent = score;

    const hasEmptyCells = this.#checkIfHasEmptyCells();
    const hasAvailablePairs = this.#checkIfHasAvailablePares();

    if (!hasEmptyCells && !hasAvailablePairs) {
      this._setStatusLose();
      this._showLoseMessage();
    }
  }

  _createNewCell() {
    const hasEmptyCells = this.#checkIfHasEmptyCells();

    if (hasEmptyCells) {
      const field = this._getField();
      const [cellPosX, cellPosY] = generateRandomPosition({ field });

      field[cellPosY][cellPosX] = generateCellValue();

      this.#updateField(field);
    }
  }

  // Shifting.
  _shiftLeft() {
    const field = this._getField();

    const {
      field: newField,
      score,
      isWinner,
      wasChanged,
    } = horizontalShift({ field });

    this.#updateScore(score);
    this.#updateField(newField);

    if (isWinner) {
      this.#winTheGame();
    }

    return { wasChanged };
  }

  _shiftRight() {
    const field = this._getField();

    const {
      field: newField,
      score,
      isWinner,
      wasChanged,
    } = horizontalShift({ field, rtl: true });

    this.#updateScore(score);
    this.#updateField(newField);

    if (isWinner) {
      this.#winTheGame();
    }

    return { wasChanged };
  }

  _shiftTop() {
    const field = this._getField();

    const {
      field: newField,
      score,
      isWinner,
      wasChanged,
    } = verticalShift({ field });

    this.#updateScore(score);
    this.#updateField(newField);

    if (isWinner) {
      this.#winTheGame();
    }

    return { wasChanged };
  }

  _shiftBottom() {
    const field = this._getField();

    const {
      field: newField,
      score,
      isWinner,
      wasChanged,
    } = verticalShift({ field, rtl: true });

    this.#updateScore(score);
    this.#updateField(newField);

    if (isWinner) {
      this.#winTheGame();
    }

    return { wasChanged };
  }
}

module.exports = Core;
