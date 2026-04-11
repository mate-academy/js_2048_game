import { CSS_CLASSES } from '../constants';

export class Controller {
  constructor(game, view, startBtn) {
    this.game = game;
    this.view = view;
    this.startBtn = startBtn;
  }

  init() {
    this.startBtn.addEventListener('click', this.handleButtonClick);
    window.addEventListener('keydown', this.handleKeydown);
  }

  handleButtonClick = () => {
    if (this.game.isPlaying || this.game.isLost) {
      this.game.restart();
      this.updateStartButton();
    } else {
      this.game.start();
    }
    this.syncUI();
  };

  handleKeydown = (e) => {
    if (this.game.isLost || this.game.isWon) {
      return;
    }

    if (!this.game.hasContent) {
      // eslint-disable-next-line no-console
      console.warn('Game has no tiles. Please press Start first.');

      return;
    }

    const moves = {
      ArrowLeft: () => this.game.moveLeft(),
      ArrowRight: () => this.game.moveRight(),
      ArrowUp: () => this.game.moveUp(),
      ArrowDown: () => this.game.moveDown(),
    };

    if (moves[e.key]) {
      if (!this.game.isPlaying) {
        this.updateStartButton();
      }

      moves[e.key]();
      this.syncUI();
    }
  };

  syncUI() {
    this.view.render(
      this.game.getState(),
      this.game.getScore(),
      this.game.getStatus(),
    );
  }

  updateStartButton() {
    if (this.startBtn.classList.contains(CSS_CLASSES.START)) {
      this.startBtn.classList.replace(CSS_CLASSES.START, CSS_CLASSES.RESTART);
      this.startBtn.textContent = 'Restart';
    } else {
      this.startBtn.classList.replace(CSS_CLASSES.RESTART, CSS_CLASSES.START);
      this.startBtn.textContent = 'Start';
    }
  }
}
