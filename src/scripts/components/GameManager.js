import { Grid } from './Grid';
import { ViewManager } from './ViewManager';

export class GameManager {
  constructor(size, winValue) {
    this.size = size;
    this.winValue = winValue;
    this.score = 0;
    this.over = false;
    this.won = false;

    this.view = new ViewManager(this.size);
    this.grid = new Grid(this.size, this.view);

    this.eventDirection = {
      'ArrowLeft': this.grid.moveTilesLeft,
      'ArrowUp': this.grid.moveTilesUp,
      'ArrowRight': this.grid.moveTilesRight,
      'ArrowDown': this.grid.moveTilesDown,
    };

    this.keydownListener = this.handleKeyDown.bind(this);
    this.initialize();
  }

  initialize() {
    this.initKeyDownEvent();
    this.grid.insertTileToGame();
    this.grid.insertTileToGame();

    this.updateState();
  }

  isPossibleToContinue() {
    return this.grid.emptyCellsAvailable() || this.grid.mergerTilesPossible();
  }

  updateState() {
    this.score += this.grid.addition;

    if (this.isPossibleToContinue()) {
      if (this.grid.maxValue === this.winValue) {
        this.won = true;
      }
    } else {
      this.over = true;
    }

    if (this.won || this.over) {
      this.removeKeyDownEvent();
    }

    this.view.updateGameState(this.grid.matrix, this.won, this.over);
    this.view.updateScoreState(this.score, this.grid.addition);
    this.view.updateTilesState(this.grid);
  }

  handleKeyDown(e) {
    const { key } = e;

    if (this.eventDirection[key]) {
      e.preventDefault();
      this.eventDirection[key].bind(this.grid)();

      if (this.grid.matrixWasChanged()) {
        this.grid.insertTileToGame();
      }

      this.updateState();
    }
  };

  initKeyDownEvent() {
    document.addEventListener('keydown', this.keydownListener);
  }

  removeKeyDownEvent() {
    document.removeEventListener('keydown', this.keydownListener);
  }

  reload() {
    this.removeKeyDownEvent();
    this.view.clear();
  }
}
