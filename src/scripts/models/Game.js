'use strict';

import * as matrix from '../utils/matrix-utils';
import {
  addRandomTile as addTileHelper,
  isAnyPositionEmpty,
} from '../services/tile-service';
import { GAME_STATUS } from '../constants';
import {
  moveLeft as moveLeftHelper,
  moveUp as moveUpHelper,
  moveRight as moveRightHelper,
  moveDown as moveDownHelper,
} from '../services/move-service';

export class Game {
  constructor(initialState) {
    this.initialState = initialState
      ? matrix.cloneMatrix(initialState)
      : matrix.createEmptyMatrix();

    this.state = matrix.cloneMatrix(this.initialState);
    this.score = 0;
    this.status = GAME_STATUS.IDLE;
  }

  get hasContent() {
    return matrix.hasTiles(this.state);
  }

  get isPlaying() {
    return this.status === GAME_STATUS.PLAYING;
  }

  get isReady() {
    return (
      this.status !== GAME_STATUS.PLAYING && this.status !== GAME_STATUS.IDLE
    );
  }

  get isIdle() {
    return this.status === GAME_STATUS.IDLE;
  }

  get isLost() {
    return this.status === GAME_STATUS.LOST;
  }

  get isWon() {
    return this.status === GAME_STATUS.WON;
  }

  restart() {
    this.status = GAME_STATUS.IDLE;
    this.state = matrix.cloneMatrix(this.initialState);
    this.score = 0;
  }

  start() {
    if (this.isIdle) {
      this.restart();
    }

    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    this.state = addTileHelper(matrix.cloneMatrix(this.state));
  }

  moveLeft() {
    this.makeMove(moveLeftHelper);
  }

  moveUp() {
    this.makeMove(moveUpHelper);
  }

  moveRight() {
    this.makeMove(moveRightHelper);
  }

  moveDown() {
    this.makeMove(moveDownHelper);
  }

  makeMove(moveFn) {
    if (this.isLost || (!this.isPlaying && !this.isIdle)) {
      return;
    }

    if (!this.isPlaying) {
      this.status = GAME_STATUS.PLAYING;
    }

    const oldState = this.state;
    const { newState, totalGained } = moveFn(this.state);
    const hasChanged = !matrix.isMatrixEqual(oldState, newState);

    if (hasChanged) {
      this.state = newState;
      this.score += totalGained;
      this.addRandomTile();
    }

    this.checkGameStatus();
  }

  checkGameStatus() {
    if (
      this.status === GAME_STATUS.PLAYING &&
      matrix.flatten(this.state).includes(2048)
    ) {
      this.status = GAME_STATUS.WON;
    }

    if (isAnyPositionEmpty(this.state)) {
      return;
    }

    if (!this.canMove()) {
      this.status = GAME_STATUS.LOST;
    }
  }

  canMove() {
    const hasHorizontalMerge = this.state.some((row) => {
      return row.some((val, i) => val === row[i + 1]);
    });
    const transposed = matrix.transpose(this.state);
    const hasVerticalMerge = transposed.some((row) => {
      return row.some((val, i) => val === row[i + 1]);
    });

    return hasHorizontalMerge || hasVerticalMerge;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return matrix.cloneMatrix(this.state);
  }

  getStatus() {
    return this.status;
  }
}
