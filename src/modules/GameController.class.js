import { DIRECTION_KEYS, GAME_STATUSES } from '../constants';

class GameController {
  constructor(game) {
    this.game = game;
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.setController();
  }

  setController() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  removeController() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleKeyDown(e) {
    if (this.game.getStatus() === GAME_STATUSES.idle) {
      return;
    }

    const oldBoard = JSON.stringify(this.game.getState());

    this.game.showStatus();

    switch (e.key) {
      case DIRECTION_KEYS.up:
        this.game.moveUp();
        break;
      case DIRECTION_KEYS.down:
        this.game.moveDown();
        break;
      case DIRECTION_KEYS.left:
        this.game.moveLeft();
        break;
      case DIRECTION_KEYS.right:
        this.game.moveRight();
        break;
    }

    const newBoard = JSON.stringify(this.game.getState());

    if (newBoard !== oldBoard) {
      this.game.createNewCell();
    }
  }
}

export default GameController;
