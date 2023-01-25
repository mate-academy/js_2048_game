/* eslint-disable */
import Tile from './Tile';

export default class Matrix {
  constructor() {
    this.matrix = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    this.wasMove = false;
    this.maxTileValue = 2048;
    this.wasMerge = false;
    this.mergedTilesSum = 0;
    this.win = false;
    this.addTile();
    this.addTile();
    this.updated();
  }

  coordsEmptyTiles() {
    return this.matrix.map((row,x) =>
      row.map((cell, y) => {
        if (cell == null) {
          return {x: x, y: y}
        }
      })
    ).flat().filter(el => el)
  }

  addTile() {
    const freeTiles = this.coordsEmptyTiles();
    let randomNumber = Math.floor(Math.random() * freeTiles.length)
    let { x, y } = freeTiles[randomNumber];
    this.matrix[x][y] = new Tile(x, y);
    this.matrix[x][y].addTileToView();
  }

  updated() {
    for (let i = 0; i < this.matrix.length; i++) {
      for (let j = 0; j < this.matrix.length; j++) {
        if (this.matrix[i][j]) {
          this.matrix[i][j].setNewPosition(i, j);
          this.matrix[i][j].render();
        }
      }
    }
  }

  clear() {
    this.matrix.flat().filter(el => el).forEach(tile => {
      tile.tileHTML.remove();
    })
  }

  moveLeft() {
    this.cleanMoveMerge();
    this.shift(false);
  }

  moveRight() {
    this.cleanMoveMerge();
    this.shift();
  }

  moveUp() {
    this.cleanMoveMerge();
    this.shiftUpDown(false);
  }

  moveDown() {
    this.cleanMoveMerge();
    this.shiftUpDown();
  }

  swapTiles(x1, y1, x2, y2) {
    let current = this.matrix[x1][y1];
    this.matrix[x1][y1] = this.matrix[x2][y2];
    this.matrix[x2][y2] = current;
    this.wasMove = true;
  }

  shift(moveRight = true) {
    for (let i = 0; i < this.matrix.length; i++) {
      let current = moveRight ? this.matrix.length - 1 : 0;
      let next = moveRight ? current - 1 : 1;
      let increment = moveRight ? -1 : 1;
      while (next < this.matrix.length && next >= 0) {
        if (!this.matrix[i][next]) {
          next += increment;
        } else {
          if (!this.matrix[i][current]) {
            this.swapTiles(i, current, i, next)
            next += increment;
          } else if (this.matrix[i][current].value === this.matrix[i][next].value) {
            this.matrix[i][current].setNewPosition(i, current);
            this.mergeTiles(i, next, i, current);
            current += increment;
            next += increment;
          } else {
            current += increment;
            if (current === next) {
              next += increment;
            }
          }
        }
      }
    }
  }

  shiftUpDown(moveDown = true) {
    for (let i = 0; i < this.matrix.length; i++) {
      let current = moveDown ? this.matrix.length - 1 : 0;
      let next = moveDown ? current - 1 : 1;
      let increment = moveDown ? -1 : 1;
      while (next < this.matrix.length && next >= 0) {
        if (!this.matrix[next][i]) {
          next += increment;
        } else {
          if (!this.matrix[current][i]) {
            this.swapTiles(current, i, next, i)
            next += increment;
          } else if (this.matrix[current][i].value === this.matrix[next][i].value) {
            this.matrix[current][i].setNewPosition(current, i);
            this.mergeTiles(next, i, current, i);
            current += increment;
            next += increment;
          } else {
            current += increment;
            if (current === next) {
              next += increment;
            }
          }
        }
      }
    }
  }

  mergeTiles(x1, y1, x2, y2) {
    this.wasMerge = true;
    let value = this.matrix[x1][y1].value;
    this.mergedTilesSum += value * 2;
    this.matrix[x2][y2].merge(this.matrix[x1][y1]);
    this.matrix[x1][y1] = null;
    if (this.matrix[x2][y2].value === this.maxTileValue) {
      this.win = true;
    }
  }

  cleanMoveMerge() {
    this.wasMove = false;
    this.wasMerge = false;
  }

  isMergePossible() {
    return this.matrix.flat().some((tile, i, arr) => {
      let value = tile.value;
      if (((i + 1) % 4 !== 0) && value === arr[i + 1].value) {
        return true;
      } else if (i + 4 <= arr.length - 1 && value === arr[i + 4].value) {
        return true;
      } else {
        return false;
      }
    })
  }
}
