import Matrix from './Matrix';

export default class Game {
  constructor() {
    this.score = 0;
    this.table = new Matrix();
    this.listenerArrows = this.handleArrowsButtonPressing.bind(this);
    this.touchStartListener = this.handleTouchStart.bind(this);
    this.touchEndListener = this.handleTouchEnd.bind(this);
    this.gameField = document.querySelector('.game-field');
    this.endGame = document.querySelector('.message-lose');
    this.addScore = document.querySelector('.game-score');
    this.winGame = document.querySelector('.message-win');
    this.arrows = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];
    document.addEventListener('keydown', this.listenerArrows);
    this.x1 = null;
    this.y1 = null;
    this.gameField.addEventListener('touchstart', this.touchStartListener);
    this.gameField.addEventListener('touchmove', this.touchEndListener);
  }
  handleTouchStart(ev) {
    ev.preventDefault();

    const firstTouch = ev.touches[0];

    this.x1 = firstTouch.clientX;
    this.y1 = firstTouch.clientY;
  }
  handleTouchEnd(ev) {
    ev.preventDefault();

    if (!this.x1 || !this.y1) {
      return false;
    }

    const x2 = ev.touches[0].clientX;
    const y2 = ev.touches[0].clientY;
    const diffX = x2 - this.x1;
    const diffY = y2 - this.y1;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        this.table.moveRight();
      } else {
        this.table.moveLeft();
      }
    } else {
      if (diffY > 0) {
        this.table.moveDown();
      } else {
        this.table.moveUp();
      }
    }
    this.x1 = null;
    this.y1 = null;
    this.allChecks();
  }

  handleArrowsButtonPressing(ev) {
    if (!this.arrows.includes(ev.key)) {
      return;
    }
    ev.preventDefault();

    switch (ev.key) {
      case 'ArrowLeft':
        this.table.moveLeft();
        break;
      case 'ArrowUp':
        this.table.moveUp();
        break;
      case 'ArrowRight':
        this.table.moveRight();
        break;
      case 'ArrowDown':
        this.table.moveDown();
        break;
    }
    this.allChecks();
  }

  allChecks() {
    if (this.table.wasMove || this.table.wasMerge) {
      this.table.addTile();
    }
    this.table.updated();

    if (this.table.wasMerge) {
      this.score += this.table.mergedTilesSum;
      this.table.mergedTilesSum = 0;
    }

    this.addScore.textContent = this.score;

    if (this.table.coordsEmptyTiles().length < 1
      && !this.table.isMergePossible()) {
      setTimeout(() => this.endGame.classList.remove('hidden'), 1000);
    } else if (this.table.win) {
      this.winGame.classList.remove('hidden');
    }
  }

  stop() {
    document.removeEventListener('keydown', this.listenerArrows);
    this.gameField.removeEventListener('touchstart', this.touchStartListener);
    this.gameField.removeEventListener('touchmove', this.touchEndListener);
    this.table.clear();
    this.endGame.classList.add('hidden');
    this.winGame.classList.add('hidden');
    this.score = 0;
    this.addScore.textContent = '0';
  }
}
