'use strict';

import {
  settingMessage,
  creativeGameField,
  creativeElement,
  send,
  toLeftRight,
  toUpDown,
  checkInline,
  checkUpDown,
  checkEmptyCell,
  cleanScore,
} from '../modules/gameEngine.js';

export const button = document.querySelector('button');

export const scoreTag = document.querySelector('.game-score');

export const field = document.querySelector('tbody');

class Game1 {
  constructor() {
    this.field = creativeGameField();
    this.status = 'wait';
    this.score = 0;
    this.currnetBigestNumber = 0;
  }

  getStatus() {
    if (this.status === 'lose') {
      settingMessage('message-lose');
    }

    if (this.status === 'playing') {
      this.restart();
    }
  }

  start() {
    this.status = 'wait';
    scoreTag.textContent = 0;

    cleanScore(this.status);

    this.field = creativeGameField();

    settingMessage('message-rule');

    creativeElement(this.field, this.status);
    creativeElement(this.field, this.status);

    this.status = 'playing';

    send(this.field, this.status);

    return this.field;
  }

  restart() {
    button.removeAttribute('style');
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }

  moveRight() {
    if (checkInline(this.field, 'right')) {
      toLeftRight(this.field, 'right');

      creativeElement(this.field);
    }

    this.moveEngine();
  }

  moveLeft() {
    if (checkInline(this.field, 'left')) {
      toLeftRight(this.field, 'left');

      creativeElement(this.field);
    }

    this.moveEngine();
  }

  moveUp() {
    if (checkUpDown(this.field, 'up')) {
      toUpDown(this.field, 'up');

      creativeElement(this.field);
    }

    this.moveEngine();
  }

  moveDown() {
    if (checkUpDown(this.field, 'down')) {
      toUpDown(this.field, 'down');

      creativeElement(this.field);
    }

    this.moveEngine();
  }

  moveEngine() {
    send(this.field);

    if (
      checkEmptyCell(this.field) === false &&
      checkInline(this.field, 'right') === false &&
      checkInline(this.field, 'left') === false &&
      checkUpDown(this.field, 'up') === false &&
      checkUpDown(this.field, 'down') === false
    ) {
      this.status = 'lose';
    }

    this.getStatus();
  }
}

const currentGameData = new Game1();

button.addEventListener('click', () => {
  currentGameData.start();
});

const tagRule = document.querySelector('.message-rule');

document.addEventListener('keyup', (e) => {
  if (currentGameData.status !== 'playing') {
    return false;
  }

  if (tagRule.classList.contains('hidden')) {
    return false;
  }

  switch (e.code) {
    case 'ArrowRight':
      currentGameData.moveRight();
      break;
    case 'ArrowLeft':
      currentGameData.moveLeft();
      break;
    case 'ArrowUp':
      currentGameData.moveUp();
      break;
    case 'ArrowDown':
      currentGameData.moveDown();
      break;
  }
});
