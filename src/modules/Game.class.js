/* eslint-disable max-len */
/* eslint-disable no-console */
'use strict';

import { fillRandomEmptyPlaces } from '../scripts/randomAddCellToEmpty';
// eslint-disable-next-line max-len
import { fillRandomEmptyPlacesStart } from '../scripts/fillRandomEmptyPlacesStart';
import { moveTiles } from '../scripts/moveTile';
import { Arrow } from './constants';

const { STATUS_RUN } = require('./constants');

class Game {
  initialState;

  constructor(initialState) {
    this.initialState = initialState;

    console.log(this.initialState);
  }

  moveUp() {
    const { tileField } = this.initialState;
    const size = tileField.length;

    const { mergeOccurred, tileField: newTileField } = moveTiles(
      tileField,
      size,
      Arrow.UP,
    );

    if (mergeOccurred) {
      moveTiles(newTileField, size, Arrow.UP); // Compact tiles again after merging
    }

    fillRandomEmptyPlaces(this.initialState.tileField);
    console.log(newTileField); // Log the updated tileField after moving up
  }

  moveLeft() {
    const { tileField } = this.initialState;
    const size = tileField.length;

    const { mergeOccurred, tileField: newTileField } = moveTiles(
      tileField,
      size,
      Arrow.LEFT,
    );

    if (mergeOccurred) {
      moveTiles(newTileField, size, Arrow.LEFT);
    }

    fillRandomEmptyPlaces(this.initialState.tileField);
  }

  moveRight() {
    const { tileField } = this.initialState;
    const size = tileField.length;

    const { mergeOccurred, tileField: newTileField } = moveTiles(
      tileField,
      size,
      Arrow.RIGHT,
    );

    if (mergeOccurred) {
      moveTiles(newTileField, size, Arrow.RIGHT); // Compact tiles again after merging
    }

    fillRandomEmptyPlaces(this.initialState.tileField);
  }

  moveDown() {
    const { tileField } = this.initialState;
    const size = tileField.length;

    const { mergeOccurred, tileField: newTileField } = moveTiles(
      tileField,
      size,
      Arrow.DOWN,
    );

    if (mergeOccurred) {
      moveTiles(newTileField, size, Arrow.DOWN); // Compact tiles again after merging
    }

    fillRandomEmptyPlaces(this.initialState.tileField);
  }

  getScore() {
    let score = 0;

    for (let i = 0; i < this.initialState.tileField.length; i++) {
      for (let j = 0; j < this.initialState.tileField[i].length; j++) {
        score += this.initialState.tileField[i][j];
      }
    }

    this.initialState.score = score;
  }

  getState() {
    return this.initialState;
  }

  getStatus() {
    // eslint-disable-next-line no-console
    console.log('Current status:', this.initialState.status);
  }

  start() {
    fillRandomEmptyPlacesStart(this.initialState.tileField);
    this.initialState.status = STATUS_RUN;
  }

  restart() {
    this.initialState.score = 0;

    this.initialState.tileField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  setTile() {
    // eslint-disable-next-line max-len
    const table = document.querySelector('.game-field');

    if (table) {
      const rows = table.querySelectorAll('.field-row');

      for (let i = 0; i < this.initialState.tileField.length; i++) {
        const cells = rows[i].querySelectorAll('.field-cell');

        for (let j = 0; j < this.initialState.tileField[i].length; j++) {
          const cell = cells[j];
          const cellValue = this.initialState.tileField[i][j];

          const currentClass = `field-cell--${cellValue}`;

          cell.className = 'field-cell';

          if (cellValue !== 0) {
            cell.classList.add(currentClass);
            cell.textContent = `${cellValue}`;
          } else {
            cell.textContent = '';
          }
        }
      }
    }
  }
}

module.exports = Game;
