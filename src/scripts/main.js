'use strict';

/* =========CLASSES=========== */
class Game {
  constructor(gameField, scoreContainer, gameSize, winValue) {
    this.gameField = gameField;
    this.gameSize = gameSize;
    this.cellsCount = gameSize ** 2;
    this.cells = [];

    this.scoreContainer = scoreContainer;
    this.score = 0;
    this.winValue = winValue;
    this.gameOver = false;

    this.refreshGameCells();

    this.tilesMoving = [];

    this.groupedCellsByRow = [];
    this.groupedCellsByColumn = [];
    this.groupedCellsByReversedRow = [];
    this.groupedCellsByReversedColumn = [];
  }

  /* ================================ */
  refreshGameCells() {
    this.cells.length = 0;
    this.gameField.innerHTML = '';
    this.score = 0;
    this.gameOver = false;
    this.scoreContainer.textContent = this.score;

    for (let i = 0; i < this.cellsCount; i++) {
      const x = i % this.gameSize;
      const y = Math.floor(i / this.gameSize);

      const cell = new Cell(this.gameField, x, y);

      this.cells.push(cell);
    }
  }

  startGame() {
    this.refreshGameCells();
    this.createNewTile();

    this.groupedCellsByColumn = this.groupCellsByColumn();
    this.groupedCellsByRow = this.groupCellsByRow();

    this.groupedCellsByReversedColumn = this.groupedCellsByColumn
      .map(column => {
        return [...column].reverse();
      });

    this.groupedCellsByReversedRow = this.groupedCellsByRow.map(row => {
      return [...row].reverse();
    });
  }

  createNewTile() {
    this.getRandomEmptyCell().linkTile(new Tile(this.gameField));
  }

  gameIsOver() {
    return this.gameOver;
  }

  /* ================================ */
  moveTilesUp() {
    const canCreateNewTail = this.canMoveTilesUp();

    this.moveGroupTiles(this.groupedCellsByColumn, canCreateNewTail);
  }

  moveTilesDown() {
    const canCreateNewTail = this.canMoveTilesDown();

    this.moveGroupTiles(this.groupedCellsByReversedColumn, canCreateNewTail);
  }

  moveTilesLeft() {
    const canCreateNewTail = this.canMoveTilesLeft();

    this.moveGroupTiles(this.groupedCellsByRow, canCreateNewTail);
  }

  moveTilesRight() {
    const canCreateNewTail = this.canMoveTilesRight();

    this.moveGroupTiles(this.groupedCellsByReversedRow, canCreateNewTail);
  }

  moveGroupTiles(groupedCells, canCreateNewTail) {
    groupedCells.forEach(group => {
      this.moveTilesInGroup(group);
    });

    Promise.all(this.tilesMoving)
      .then(() => {
        this.cells.forEach(cell => {
          cell.hasTileForMerge()
            && cell.mergeTiles(this.increaseScore.bind(this));
        });

        if (canCreateNewTail) {
          this.createNewTile();
        }
      });
  }

  moveTilesInGroup(groupOfCells) {
    for (let i = 1; i < groupOfCells.length; i++) {
      if (groupOfCells[i].isEmpty()) {
        continue;
      }

      const cellWithTile = groupOfCells[i];

      let targetCell;
      let j = i - 1;

      while (j >= 0 && groupOfCells[j].canAccept(cellWithTile.linkedTile)) {
        targetCell = groupOfCells[j];
        j--;
      }

      if (!targetCell) {
        continue;
      }

      this.tilesMoving.push(cellWithTile.linkedTile.waitForMovingEnd());

      if (targetCell.isEmpty()) {
        targetCell.linkTile(cellWithTile.linkedTile);
      } else {
        targetCell.linkTileForMerge(cellWithTile.linkedTile);
      }

      cellWithTile.unlinkTile();
    }
  }

  cantMoveTiles() {
    return (
      !this.canMoveTilesUp()
      && !this.canMoveTilesDown()
      && !this.canMoveTilesLeft()
      && !this.canMoveTilesRight()
    );
  }

  canMoveTilesUp() {
    return this.canMoveGroupTiles(this.groupedCellsByColumn);
  }

  canMoveTilesDown() {
    return this.canMoveGroupTiles(this.groupedCellsByReversedColumn);
  }

  canMoveTilesLeft() {
    return this.canMoveGroupTiles(this.groupedCellsByRow);
  }

  canMoveTilesRight() {
    return this.canMoveGroupTiles(this.groupedCellsByReversedRow);
  }

  canMoveGroupTiles(groupedCells) {
    return groupedCells.some(group => {
      return this.canMoveTilesInGroup(group);
    });
  }

  canMoveTilesInGroup(groupOfCells) {
    return groupOfCells.some((cell, idx) => {
      if (idx === 0 || cell.isEmpty()) {
        return false;
      }

      const targetCell = groupOfCells[idx - 1];

      return targetCell.canAccept(cell.linkedTile);
    });
  }

  /* ================================ */
  increaseScore(tile) {
    this.score += tile.tileValue;
    this.scoreContainer.textContent = this.score;

    if (tile.tileValue === this.winValue) {
      this.gameOver = true;
    }
  }

  getRandomEmptyCell() {
    const emptyCells = this.cells.filter(cell => cell.isEmpty());
    const randomIdx = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIdx];
  }

  groupCellsByColumn() {
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.x] = groupedCells[cell.x] || [];
      groupedCells[cell.x][cell.y] = cell;

      return groupedCells;
    }, []);
  }

  groupCellsByRow() {
    return this.cells.reduce((groupedCells, cell) => {
      groupedCells[cell.y] = groupedCells[cell.y] || [];
      groupedCells[cell.y][cell.x] = cell;

      return groupedCells;
    }, []);
  }
}

class Cell {
  constructor(gameField, x, y) {
    this.x = x;
    this.y = y;
    this.linkedTile = null;
    this.linkedTileInner = null;

    const cell = document.createElement('div');

    cell.classList.add('game-cell');
    gameField.appendChild(cell);
  }

  linkTile(tile) {
    tile.setTilePosition(this.x, this.y);
    this.linkedTile = tile;
    this.linkedTileInner = tile.tileInner;
  }

  unlinkTile() {
    this.linkedTile = null;
    this.linkedTileInner = null;
  }

  unlinkTileForMerge() {
    this.linkedTileForMerge = null;
  }

  isEmpty() {
    return !this.linkedTile;
  }

  linkTileForMerge(tile) {
    tile.setTilePosition(this.x, this.y);
    this.linkedTileForMerge = tile;
  }

  hasTileForMerge() {
    return !!this.linkedTileForMerge;
  }

  canAccept(newTile) {
    return (
      this.isEmpty()
      || (!this.hasTileForMerge()
        && (+this.linkedTileInner.textContent) === newTile.tileValue
      )
    );
  }

  mergeTiles(increaseScore) {
    this.linkedTile.setValue(
      (+this.linkedTile.tileValue) + (+this.linkedTileForMerge.tileValue)
    );

    increaseScore(this.linkedTile);

    this.linkedTileForMerge.tile.remove();
    this.unlinkTileForMerge();
  }
}

class Tile {
  constructor(gameField) {
    let tileContainer = gameField.querySelector('.tile-container');

    if (!tileContainer) {
      tileContainer = document.createElement('div');
      tileContainer.classList.add('tile-container');

      gameField.appendChild(tileContainer);
    }

    this.tile = document.createElement('div');
    this.tileInner = document.createElement('div');
    this.tileInner.classList.add('tile-inner');

    this.setValue(Math.random() < 0.9 ? 2 : 4);

    this.tile.classList.add(
      'tile',
      'game-cell',
    );

    this.tile.appendChild(this.tileInner);
    tileContainer.appendChild(this.tile);
  }

  setTilePosition(x, y) {
    this.removeClassName(this.tile, '--position--');
    this.tile.classList.add(`tile--position--${y}-${x}`);
  }

  removeClassName(elem, targetClassName) {
    const classNames = [...elem.classList];
    const modifierClass = classNames.find(className => {
      return className.includes(targetClassName);
    });

    elem.classList.remove(modifierClass);
  }

  setValue(value) {
    this.tileValue = value;
    this.tileInner.textContent = this.tileValue;

    this.removeClassName(this.tileInner, 'tile-inner--');

    this.tileInner.classList.add(`tile-inner--${this.tileValue}`);
  }

  waitForMovingEnd() {
    return new Promise(resolve => {
      this.tile.addEventListener('transitionend', resolve, { once: true });
    });
  }
}

/* ==========START GAME=============== */
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

const gameBoard = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const startButton = document.querySelector('.button');

const game = new Game(gameBoard, gameScore, 4, 2048);

startButton.addEventListener('click', (e) => {
  const button = e.target;

  if (button.classList.contains('start')) {
    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';

    messageStart.classList.add('hidden');
  }

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');

  game.startGame();
  addKeyPressListener();
});

function addKeyPressListener() {
  document.addEventListener('keydown', handleKeyPress, { once: true });
}

function handleKeyPress(e) {
  if (game.cantMoveTiles()) {
    messageLose.classList.remove('hidden');
  }

  const direction = e.key;

  const ARROW_UP = 'ArrowUp';
  const ARROW_DOWN = 'ArrowDown';
  const ARROW_LEFT = 'ArrowLeft';
  const ARROW_RIGHT = 'ArrowRight';

  switch (direction) {
    case ARROW_UP:
      game.moveTilesUp();
      break;

    case ARROW_DOWN:
      game.moveTilesDown();
      break;

    case ARROW_LEFT:
      game.moveTilesLeft();
      break;

    case ARROW_RIGHT:
      game.moveTilesRight();
      break;

    default:
      break;
  }

  setTimeout(() => {
    if (game.gameIsOver()) {
      messageWin.classList.remove('hidden');
    } else {
      addKeyPressListener();
    }
  }, 300);
}
