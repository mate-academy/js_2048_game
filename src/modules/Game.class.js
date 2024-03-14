'use strict';

import { Ceil } from "./Ceil.class";
import { Tile } from "./Tile.class";

const GRID_SIZE = 4;
const CELLS_COUNT = GRID_SIZE * GRID_SIZE;

export class Game {
  constructor(gridElement) {
    this.cells = [];
    for (let i = 0; i < CELLS_COUNT; i++) {
      this.cells.push(
        new Ceil(gridElement, i % GRID_SIZE, Math.floor(i / GRID_SIZE))
      );
    }

    this.score = 0;
    this.cellsGroupedByColumn = this.groupCellsByColumn();
    this.cellsGroupedByReversedColumn = this.cellsGroupedByColumn.map(column => [...column].reverse());
    this.cellsGroupedByRow = this.groupCellsByRow();
    this.cellsGroupedByReversedRow = this.cellsGroupedByRow.map(raw => [...raw].reverse());
  }

  getRandomEmptyCell() {
    const emptyCells = this.cells.filter(cell => cell.isEmpty());
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

  moveUp() {
    this.slideTiles(this.cellsGroupedByColumn);
  }

  moveDown() {
    this.slideTiles(this.cellsGroupedByReversedColumn);
  }

  moveLeft() {
    this.slideTiles(this.cellsGroupedByRow);
  }

  moveRight() {
    this.slideTiles(this.cellsGroupedByReversedRow);
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
    return groupedCells.some(group =>  this.canMoveInGroup(group));
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

  slideTiles(groupedCells) {
    const promises = [];

    groupedCells.forEach(group => this.slideTilesInGroup(group, promises));

    Promise.all(promises);
    this.cells.forEach(cell => {
      cell.hasTileForMerge() && cell.mergeTiles()
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

      promises.push(cellWithTile.linkedTile.waitForTransitionEnd());

      if (targetCell.isEmpty()) {
        targetCell.linkTile(cellWithTile.linkedTile);
      } else {
        targetCell.linkTileForMerge(cellWithTile.linkedTile);
      }

      cellWithTile.unlinkTile();
    }
  }

  start(gridElement) {
    this.getRandomEmptyCell().linkTile(new Tile(gridElement));
    this.getRandomEmptyCell().linkTile(new Tile(gridElement));
  }

  restart() {
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
      tile.remove();
    });

    this.cells.forEach(cell => cell.unlinkTile());
  }
}
