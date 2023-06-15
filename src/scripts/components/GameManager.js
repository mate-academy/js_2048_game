import { Grid } from './Grid';
import { ViewManager } from './ViewManager';
import { InputManager } from './InputManager';

export class GameManager {
  constructor(size, winValue) {
    this.size = size;
    this.winValue = winValue;
    this.score = 0;
    this.over = false;
    this.won = false;

    this.view = new ViewManager(this.size);
    this.grid = new Grid(this.size, this.view);
    this.input = new InputManager(this.view.gameBody);

    this.initialize();
  }

  initialize() {
    this.grid.insertTileToGame();
    this.grid.insertTileToGame();

    this.input.setEventCallbacks(
      this.grid.moveTiles.bind(this.grid),
      this.updateState.bind(this)
    );

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
      this.input.removeEvents();
    }

    this.view.updateGameState(this.grid.matrix, this.won, this.over);
    this.view.updateScoreState(this.score, this.grid.addition);
    this.view.updateTilesState(this.grid);
  }

  reload() {
    this.input.removeEvents();
    this.view.clear();
  }
}
