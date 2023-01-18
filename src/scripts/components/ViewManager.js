import { Tile } from './Tile';
import tryAgain from '../../images/try-again.gif';

export class ViewManager {
  constructor(size) {
    this.gameSize = size;
    this.gameGrid = document.querySelector('.game-body__grid');
    this.gameTiles = document.querySelector('.game-body__tiles');
    this.gameMessage = document.querySelector('.game-body__message');
    this.gameCurrentScore = document.querySelector('.game-score__current');
    this.gameCells = [];

    this.initialize();
  }

  initialize() {
    this.createGameGridCells();
  }

  createGameGridCells() {
    for (let i = 0; i < this.gameSize * this.gameSize; i++) {
      const gameCell = this.createElement('div', 'game-body__cell');

      this.gameGrid.append(gameCell);
      this.gameCells.push(gameCell);
    }
  }

  createTileElement() {
    return this.createElement('div', 'tile');
  }

  updateGameState(matrix, won, over) {
    if (won || over) {
      this.hiddenTiles(matrix);
    }

    if (won) {
      this.gameMessage.classList.add('game-body__message--won');
    }

    if (over) {
      this.resetNoLoopGif('.game-body__try-again');
      this.gameMessage.classList.add('game-body__message--over');
    }
  }

  updateScoreState(score, addition) {
    this.gameCurrentScore.textContent = `${score}`;

    if (addition) {
      const gameAdditionScore = this.createElement(
        'div',
        'game-score__addition',
        `+${addition}`);

      this.gameCurrentScore.append(gameAdditionScore);

      setTimeout(() => {
        gameAdditionScore.remove();
      }, 800);
    }
  }

  updateTilesState(grid) {
    grid.checkEachCell((rowIndex, cellIndex, tile) => {
      if (tile instanceof Tile) {
        this.setTileClassName(tile);
        this.setTilePositionRelativeToCell(tile);
      }
    });
  }

  setTileClassName(tile) {
    if (tile.isNew) {
      tile.htmlTileElement.className = `tile tile--${tile.value} tile--new`;
    } else if (tile.isMerged) {
      tile.htmlTileElement.className = `tile tile--${tile.value} tile--merged`;
    } else {
      tile.htmlTileElement.className = `tile tile--${tile.value}`;
    }
  }

  setTilePositionRelativeToCell(tile) {
    // eslint-disable-next-line no-shadow
    const { left, top } = this.getTilePositionRelativeToCell(tile);

    tile.htmlTileElement.style.left = `${left}%`;
    tile.htmlTileElement.style.top = `${top}%`;
  }

  getTilePositionRelativeToCell(tile) {
    const { offsetLeft, offsetTop } = this.gameCells[tile.coords.index];

    return {
      left: offsetLeft / this.gameGrid.offsetWidth * 100,
      top: offsetTop / this.gameGrid.offsetHeight * 100,
    };
  }

  hiddenTiles(matrix) {
    matrix.flat().filter(tile => tile).sort((tileX, tileY) => {
      return tileX.coords.index - tileY.coords.index;
    }).forEach((tile, i, tiles) => {
      setTimeout(() => {
        tile.htmlTileElement.classList.add('tile--hidden');
      }, (1200 / tiles.length) * i);
    });
  }

  createElement(type, className, innerText = '') {
    const element = document.createElement(type);

    element.className = className;
    element.innerText = innerText;

    return element;
  }

  resetNoLoopGif(className) {
    const element = document.querySelector(className);

    element.style.background = `url(${tryAgain}?${new Date().getTime()})`;
    element.style.backgroundSize = '107%';
    element.style.backgroundPosition = 'center';
    element.style.backgroundRepeat = 'no-repeat';
  }

  clear() {
    this.gameMessage.className = 'game-body__message';

    this.gameGrid.replaceChildren();
    this.gameTiles.replaceChildren();
  }
}
