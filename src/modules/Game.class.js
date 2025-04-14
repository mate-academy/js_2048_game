/* eslint-disable function-paren-newline */
import { gameStatus } from '../utils/const';
import { Cell } from './Cell.class';
import { Tile } from './Tile.class';

const FIEL_DSIZE = 4;
const CELLS_COUNT = FIEL_DSIZE * FIEL_DSIZE;

export class GameField {
  constructor(gameField) {
    this.gameField = gameField;
    this.cells = [];
    this.status = gameStatus.idle;
    this.score = 0;

    for (let i = 0; i < CELLS_COUNT; i++) {
      this.cells.push(
        new Cell(gameField, i % FIEL_DSIZE, Math.floor(i / FIEL_DSIZE)),
      );
    }

    this.cellsGroupedByColumn = this.groupCellsByColumn();

    this.cellsGroupedByReversColumn = this.cellsGroupedByColumn.map((column) =>
      [...column].reverse(),
    );

    this.cellsGroupByRow = this.groupCellsByRow();

    this.cellsGroupByReversRow = this.cellsGroupByRow.map((row) =>
      [...row].reverse(),
    );
  }

  /**
   * Start the game.
   */
  start() {
    this.status = gameStatus.playing;
    this.getRandomEmptyCell().linkTile(new Tile(this.gameField));
    this.getRandomEmptyCell().linkTile(new Tile(this.gameField));
  }

  /**
   * Resets the game.
   */
  restart() {
    this.cells.forEach((cell) => {
      if (cell.linkedTile) {
        cell.linkedTile.removeFromDom();
        cell.unlinkTile();
      }
    });
    this.status = gameStatus.idle;
    this.score = 0;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  getRandomEmptyCell() {
    const emptyCells = this.cells.filter((cell) => cell.isEmpty());
    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
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

  async slideTiles(groupedCells) {
    const transitionPromises = [];

    groupedCells.forEach((group) =>
      this.slideTilesInGroup(group, transitionPromises),
    );

    await Promise.all(transitionPromises);

    this.cells.forEach((cell) => {
      if (cell.hasTileForMerge()) {
        this.score += cell.mergeTiles();
      }
    });
  }

  slideTilesInGroup(group, promises) {
    for (let i = 1; i < group.length; i++) {
      if (group[i].isEmpty()) {
        continue;
      }

      const cellWithTile = group[i];
      let targetCell;
      let j = i - 1;

      while (j >= 0 && group[j].canAccept(cellWithTile.linkedTile)) {
        targetCell = group[j];
        j--;
      }

      if (!targetCell) {
        continue;
      }

      promises.push(cellWithTile.linkTile.waitForTransitionEnd);

      if (targetCell.isEmpty()) {
        targetCell.linkTile(cellWithTile.linkedTile);
      } else {
        targetCell.linkTileForMerge(cellWithTile.linkedTile);
      }

      cellWithTile.unlinkTile();
    }
  }

  canMove(groupedCells) {
    return groupedCells.some((group) => this.canMoveInGroup(group));
  }

  canMoveInGroup(group) {
    return group.some((cell, index) => {
      if (index === 0 || cell.isEmpty()) {
        return false;
      }

      return group[index - 1].canAccept(cell.linkedTile);
    });
  }

  canPlay() {
    if (
      !this.canMove(this.cellsGroupedByColumn) &&
      !this.canMove(this.cellsGroupedByReversColumn) &&
      !this.canMove(this.cellsGroupByRow) &&
      !this.canMove(this.cellsGroupByReversRow)
    ) {
      this.status = gameStatus.lose;
    }
  }

  async moveUp() {
    await this.move(this.cellsGroupedByColumn);
  }
  async moveDown() {
    await this.move(this.cellsGroupedByReversColumn);
  }
  async moveLeft() {
    await this.move(this.cellsGroupByRow);
  }
  async moveRight() {
    await this.move(this.cellsGroupByReversRow);
  }

  async move(direction) {
    if (this.canMove(direction)) {
      const newTile = new Tile(this.gameField);

      await this.slideTiles(direction);

      this.getRandomEmptyCell().linkTile(newTile);
    }

    this.canPlay();
  }
}
