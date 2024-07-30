'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
import { Cell } from './Cell.class';
import { FullCell } from './FullCell.class';

const GRID_SIZE = 4;
const CELLS_COUNT = GRID_SIZE * GRID_SIZE;

export default class Game {
  constructor(gridElement) {
    this.gridElement = gridElement;
    this.cells = [];
    this.score = 0;
    this.status = 'idle';

    for (let i = 0; i < CELLS_COUNT; i++) {
      this.cells.push(
        new Cell(gridElement, i % GRID_SIZE, Math.floor(i / GRID_SIZE)),
      );
    }

    this.cellsGroupedByColumn = this.groupCellsByColumn();

    this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map(
      (column) => [...column].reverse(),
    );

    this.cellsGroupedByRow = this.groupCellsByRow();

    this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map(
      (row) => [...row].reverse(),
      // eslint-disable-next-line function-paren-newline
    );
  }

  init() {
    this.createNewTile();
    this.createNewTile();
    this.status = 'playing';
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

  moveLeft() {
    this.slideTiles(this.cellsGroupedByRow);
    this.checkGameOver();
  }

  moveRight() {
    this.slideTiles(this.cellsGroupedByReversedRow);
    this.checkGameOver();
  }

  moveUp() {
    this.slideTiles(this.cellsGroupedByColumn);
    this.checkGameOver();
  }

  moveDown() {
    this.slideTiles(this.cellsGroupedByReversedColumn);
    this.checkGameOver();
  }

  slideTiles(groupedCells) {
    groupedCells.forEach((group) => this.slideTilesInGroup(group));

    this.cells.forEach((cell) => {
      // eslint-disable-next-line no-unused-expressions
      cell.hasTileForMerge() && cell.mergeTiles();
    });

    this.createNewTile();
    this.updateScore();
  }

  slideTilesInGroup(group) {
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

      if (targetCell.isEmpty()) {
        targetCell.linkTile(cellWithTile.linkedTile);
      } else if (
        targetCell.linkedTile.value === cellWithTile.linkedTile.value
      ) {
        const points = targetCell.linkedTile.value * 2;

        this.score += points;

        targetCell.linkTileForMerge(cellWithTile.linkedTile);
        cellWithTile.unlinkedTile();
      }

      cellWithTile.unlinkedTile();
    }
  }

  canMoveUp() {
    return this.canMove(this.cellsGroupedByColumn);
  }

  canMoveDown() {
    return this.canMove(this.cellsGroupedByReversedColumn);
  }

  canMoveLeft() {
    return this.canMove(this.cellsGroupedByRow);
  }

  canMoveRight() {
    return this.canMove(this.cellsGroupedByReversedRow);
  }

  canMove(groupedCells) {
    return groupedCells.some((group) => this.canMoveInGroup(group));
  }

  canMoveInGroup(group) {
    return group.some((cell, index) => {
      if (index === 0) {
        return false;
      }

      if (cell.isEmpty()) {
        return false;
      }

      const targetCell = group[index - 1];

      return targetCell.canAccept(cell.linkedTile);
    });
  }

  /**
   * @returns {number}
   */
  getScore() {
    const scoreElement = document.querySelector('.game-score');

    scoreElement.textContent = this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.cells.map((cell) => ({
      x: cell.x,
      y: cell.y,
      value: cell.linkedTile ? cell.linkedTile.value : null,
    }));
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.score = 0;
    this.updateScore();
    this.clearGrid();

    this.init();
    this.status = 'playing';
    this.checkGameOver();
  }

  updateScore() {
    const scoreElement = document.querySelector('.game-score');

    if (scoreElement) {
      scoreElement.textContent = this.score;
    }
  }

  clearGrid() {
    const FullCells = document.querySelectorAll('.full-cell');

    FullCells.forEach((cell) => cell.remove());

    this.cells.forEach((cell) => {
      cell.linkedTile = null;
      cell.linkedTileForMerge = null;
    });
  }

  createNewTile() {
    const cell = this.getRandomEmptyCell();

    if (cell) {
      // eslint-disable-next-line new-cap
      const tile = new FullCell(this.gridElement);

      cell.linkTile(tile);

      tile.setXY(cell.x, cell.y);
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.clearGrid();
    this.score = 0;
    this.updateScore();
    this.status = 'playing';
  }

  checkForWin() {
    return (
      this.cells.find(
        (cell) => cell.linkedTile && cell.linkedTile.value === 2048,
      ) !== undefined
    );
  }

  checkGameOver() {
    if (
      !this.canMoveUp() &&
      !this.canMoveDown() &&
      !this.canMoveLeft() &&
      !this.canMoveRight()
    ) {
      const messageLose = document.querySelector('p.message-lose');

      this.status = 'lose';
      messageLose.classList.remove('hidden');
    }
  }
}
