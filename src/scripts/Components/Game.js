import { Grid } from './Grid';
import { View } from './View';

export class Game {
  constructor() {
    this.score = 0;
    this.winValue = 2048;
    this.view = new View();
    this.grid = new Grid(this.view);
    this.handleEvent = this.handleKey.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.initEvents();
  }

  reset() {
    this.view.resetTiles(this.grid.matrix);
    this.score = 0;
    this.view.updateGameScore(this.score);
    this.view.messageContainer.innerHTML = '';
    this.removeEvents();
  }

  initEvents() {
    document.addEventListener('keyup', this.handleEvent);
    document.addEventListener('touchstart', this.handleTouchStart, false);
    document.addEventListener('touchmove', this.handleTouchMove, false);
  }
  removeEvents() {
    document.removeEventListener('keyup', this.handleEvent);
    document.removeEventListener('touchstart', this.handleTouchStart, false);
    document.removeEventListener('touchmove', this.handleTouchMove, false);
  }

  handleTouchStart(e) {
    this.firstTouch = e.touches[0];
    this.x1 = this.firstTouch.clientX;
    this.y1 = this.firstTouch.clientY;
  }

  handleTouchMove(e) {
    if (!this.x1 || !this.y1) {
      return false;
    }

    this.x2 = e.touches[0].clientX;
    this.y2 = e.touches[0].clientY;

    this.xDiff = this.x2 - this.x1;
    this.yDiff = this.y2 - this.y1;

    if (Math.abs(this.xDiff) > Math.abs(this.yDiff)) {
      if (this.xDiff > 0) {
        this.grid.moveRight();
      } else {
        this.grid.moveLeft();
      }
    } else {
      if (this.yDiff > 0) {
        this.grid.moveDown();
      } else {
        this.grid.moveUp();
      }
    }

    this.x1 = null;
    this.y1 = null;

    this.score = this.grid.currentScore;
    this.view.updateGameScore(this.grid.currentScore);
    this.view.update(this.grid.matrix);

    if (this.winValue === this.grid.currentMargeTile) {
      this.removeEvents();

      this.view.printMessage('win', `
        Winner! Congrats! You did it!
      `);
    }

    if (!this.grid.getAllEmptyCells().length && this.grid.isGameOver()) {
      this.removeEvents();

      this.view.printMessage('lose', `
        You lose! Restart the game?
      `);
    }
  }

  handleKey(e) {
    const target = e.key;

    switch (target) {
      case 'ArrowLeft':
        this.grid.moveLeft();
        break;
      case 'ArrowRight':
        this.grid.moveRight();

        break;
      case 'ArrowUp':
        this.grid.moveUp();
        break;
      case 'ArrowDown':
        this.grid.moveDown();
        break;
      default:
        break;
    }

    this.score = this.grid.currentScore;
    this.view.updateGameScore(this.grid.currentScore);
    this.view.update(this.grid.matrix);

    if (this.winValue === this.grid.currentMargeTile) {
      this.removeEvents();

      this.view.printMessage('win', `
        Winner! Congrats! You did it!
      `);
    }

    if (!this.grid.getAllEmptyCells().length && this.grid.isGameOver()) {
      this.removeEvents();

      this.view.printMessage('lose', `
        You lose! Restart the game?
      `);
    }
  };
}
