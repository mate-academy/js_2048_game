import { GAME_STATUS, CSS_CLASSES } from '../constants';

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
    if (this.game.isStarted) {
      this.game.restart();
    } else {
      this.game.start();
      this.updateStartButton();
    }
    this.syncUI();
  };

  handleKeydown = (e) => {
    if (this.game.getStatus() !== GAME_STATUS.PLAYING) {
      return;
    }

    const moves = {
      ArrowLeft: () => this.game.moveLeft(),
      ArrowRight: () => this.game.moveRight(),
      ArrowUp: () => this.game.moveUp(),
      ArrowDown: () => this.game.moveDown(),
    };

    if (moves[e.key]) {
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
    this.startBtn.classList.replace(CSS_CLASSES.START, CSS_CLASSES.RESTART);
    this.startBtn.textContent = 'Restart';
  }
}
