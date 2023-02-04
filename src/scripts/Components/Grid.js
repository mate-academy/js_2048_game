import { Tile } from './Tile';

export class Grid {
  constructor(view) {
    this.view = view;
    this.currentScore = 0;
    this.currentMargeTile = 0;
    this.checkedToAddTile = true;

    this.matrix = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];

    this.init();
  }

  init() {
    this.addTile();
    this.addTile();
    this.view.update(this.matrix);
  }

  getAllEmptyCells() {
    const emptyCells = [];

    this.matrix.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        if (cell === null) {
          emptyCells.push({
            row: rowIndex,
            cell: cellIndex,
            index: cellIndex + rowIndex * 4,
          });
        }
      });
    });

    return emptyCells;
  }

  getRandomEmptyCell() {
    const emptyCells = this.getAllEmptyCells();

    if (emptyCells.length) {
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
  }

  addTile() {
    const tile = new Tile(this.getRandomEmptyCell());

    tile.setHtmlElement(this.view.createTileElement());
    tile.addTileToPage(this.view.tileContainer);
    this.matrix[tile.coords.row][tile.coords.cell] = tile;
  }

  isGameOver() {
    for (let i = 0; i < this.matrix.length - 1; i++) {
      for (let j = 0; j < this.matrix.length - 1; j++) {
        if ((this.matrix[i][j] && this.matrix[i][j + 1])
          && (this.matrix[i][j].value === this.matrix[i][j + 1].value)) {
          return false;
        }

        if ((this.matrix[j][i] && this.matrix[j + 1][i])
          && (this.matrix[j][i].value === this.matrix[j + 1][i].value)) {
          return false;
        }
      }
    }

    if (this.getAllEmptyCells().length > 0) {
      return false;
    }

    return true;
  }

  moveTilesOnXAxis(reverse = false) {
    for (let r = 0; r < this.matrix.length; r++) {
      let start = reverse ? this.matrix.length - 1 : 0;
      let next = reverse ? start - 1 : 1;
      const increment = reverse ? -1 : 1;

      while (next < this.matrix.length && next >= 0) {
        if (!this.matrix[r][next]) {
          next += increment;
        } else {
          if (!this.matrix[r][start]) {
            this.checkedToAddTile = true;
            this.matrix[r][start] = this.matrix[r][next];
            this.matrix[r][start].setNewCoords(r, start);
            this.matrix[r][next] = null;
            next += increment;
            this.checkedToAddTile = true;
          } else if (this.matrix[r][start].value
              === this.matrix[r][next].value) {
            this.matrix[r][start].value *= 2;
            this.checkedToAddTile = true;
            this.currentScore += this.matrix[r][start].value;
            this.currentMargeTile = this.matrix[r][start].value;
            this.matrix[r][next].setNewCoords(r, start);
            this.view.setTilePosition(this.matrix[r][start]);
            this.view.setTilePosition(this.matrix[r][next]);
            // setTimeout(() => this.matrix[r][next].removeHtmlElement(), 500);
            this.matrix[r][next].removeHtmlElement();
            this.matrix[r][next] = null;
            start += increment;
            next += increment;
          } else {
            start += increment;

            if (start === next) {
              next += increment;
            }
          }
        }
      }
    }
  }

  moveTilesOnYAxis(reverse = false) {
    for (let r = 0; r < this.matrix.length; r++) {
      let start = reverse ? this.matrix.length - 1 : 0;
      let next = reverse ? start - 1 : 1;
      const increment = reverse ? -1 : 1;

      while (next < this.matrix.length && next >= 0) {
        if (!this.matrix[next][r]) {
          next += increment;
        } else {
          if (!this.matrix[start][r]) {
            this.checkedToAddTile = true;
            this.matrix[start][r] = this.matrix[next][r];
            this.matrix[start][r].setNewCoords(start, r);
            this.matrix[next][r] = null;
            next += increment;
            this.checkedToAddTile = true;
          } else if (this.matrix[start][r].value
              === this.matrix[next][r].value) {
            this.matrix[start][r].value *= 2;
            this.checkedToAddTile = true;
            this.currentScore += this.matrix[start][r].value;
            this.currentMargeTile = this.matrix[start][r].value;
            this.view.setTilePosition(this.matrix[start][r]);
            this.view.setTilePosition(this.matrix[next][r]);
            // setTimeout(() => this.matrix[next][r].removeHtmlElement(), 500);
            this.matrix[next][r].removeHtmlElement();
            this.matrix[next][r] = null;
            start += increment;
            next += increment;
          } else {
            start += increment;

            if (start === next) {
              next += increment;
            }
          }
        }
      }
    }
  }

  moveLeft() {
    this.moveTilesOnXAxis();

    if (this.checkedToAddTile) {
      this.addTile();
    }

    this.checkedToAddTile = false;
  }

  moveRight() {
    this.moveTilesOnXAxis(true);

    if (this.checkedToAddTile) {
      this.addTile();
    }

    this.checkedToAddTile = false;
  }

  moveUp() {
    this.moveTilesOnYAxis();

    if (this.checkedToAddTile) {
      this.addTile();
    }

    this.checkedToAddTile = false;
  }

  moveDown() {
    this.moveTilesOnYAxis(true);

    if (this.checkedToAddTile) {
      this.addTile();
    }

    this.checkedToAddTile = false;
  }
}
