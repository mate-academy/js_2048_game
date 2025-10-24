'use strict';

class Game {
  constructor(initialState) {
    this.size = 4;
    this.startTiles = 2;
    this.score = 0;
    this.WINSCORE = 2048;
    this.status = 'idle';
    this.field = initialState || this.createEmptyField();
  }

  createEmptyField() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  getState() {
    return this.field;
  }

  start(initialState) {
    this.status = 'playing';
    this.score = 0;

    if (initialState && Array.isArray(initialState)) {
      this.field = initialState;
    } else {
      this.field = this.createEmptyField();
      this.addStartTiles();
    }
  }

  restart(initialState) {
    this.start(initialState);
  }

  addStartTiles() {
    for (let i = 0; i < this.startTiles; i++) {
      this.addRandomTile();
    }
  }

  getAvailableCells() {
    const emptyCells = [];

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (this.field[x][y] === 0) {
          emptyCells.push({ x, y });
        }
      }
    }

    return emptyCells;
  }

  getRandomAvailableCell() {
    const emptyCells = this.getAvailableCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }

  addRandomTile() {
    const position = this.getRandomAvailableCell();

    if (position) {
      const tileValue = Math.random() < 0.9 ? 2 : 4;

      this.field[position.x][position.y] = tileValue;

      return true;
    }

    return false;
  }

  saveUnmergedCells() {
    const unmerged = Array(this.size)
      .fill()
      .map(() => Array(this.size).fill(false));

    return unmerged;
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    let cell;
    let tile;
    const vector = this.getVector(direction);
    const traversals = this.buildTraversals(vector);
    let isChanged = false;

    const unmerged = this.saveUnmergedCells();

    traversals.x.forEach((x) => {
      traversals.y.forEach((y) => {
        cell = { x, y };
        tile = this.field[x][y];

        if (!tile) {
          return;
        }

        if (tile) {
          const position = this.findNextCell(cell, vector);
          const next = position.nextCell;

          if (
            next &&
            this.field[next.x][next.y] === tile &&
            !unmerged[next.x][next.y]
          ) {
            this.field[cell.x][cell.y] = 0;
            this.field[next.x][next.y] = tile * 2;

            unmerged[next.x][next.y] = true;
            this.score += tile * 2;

            if (this.checkChange(cell, next)) {
              isChanged = true;
            }
          } else {
            this.field[cell.x][cell.y] = 0;
            this.field[position.farthestCell.x][position.farthestCell.y] = tile;

            if (this.checkChange(cell, position.farthestCell)) {
              isChanged = true;
            }
          }
        }
      });
    });

    if (
      isChanged ||
      (isChanged === false && this.getAvailableCells().length === 0)
    ) {
      this.addRandomTile();
      this.checkWin();
      this.checkLose();
    }

    return isChanged;
  }

  checkChange(from, to) {
    if (from.x !== to.x || from.y !== to.y) {
      return true;
    }

    return false;
  }

  getVector(direction) {
    const vector = {
      left: { x: 0, y: -1 },
      right: { x: 0, y: 1 },
      up: { x: -1, y: 0 },
      down: { x: 1, y: 0 },
    };

    return vector[direction];
  }

  buildTraversals(vector) {
    const traversals = { x: [], y: [] };

    for (let position = 0; position < this.size; position++) {
      traversals.x.push(position);
      traversals.y.push(position);
    }

    if (vector.x === 1) {
      traversals.x = traversals.x.reverse();
    }

    if (vector.y === 1) {
      traversals.y = traversals.y.reverse();
    }

    return traversals;
  }

  findNextCell(currentCell, vector) {
    let cell = currentCell;
    let previousCell;

    do {
      previousCell = cell;

      cell = {
        x: previousCell.x + vector.x,
        y: previousCell.y + vector.y,
      };
    } while (this.withinBounds(cell) && this.field[cell.x][cell.y] === 0);

    return {
      farthestCell: previousCell,
      nextCell: this.withinBounds(cell) ? cell : null,
    };
  }

  withinBounds(position) {
    return (
      position.x >= 0 &&
      position.x < this.size &&
      position.y >= 0 &&
      position.y < this.size
    );
  }

  checkWin() {
    const field = this.getState().flat();

    field.forEach((tile) => {
      if (tile === this.WINSCORE) {
        this.status = 'win';

        return true;
      }
    });

    return false;
  }

  checkLose() {
    if (this.getAvailableCells().length > 0) {
      return false;
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const tile = this.field[i][j];

        if (j + 1 < this.size) {
          const right = this.field[i][j + 1];

          if (right === tile) {
            return false;
          }
        }

        if (i + 1 < this.size) {
          const down = this.field[i + 1][j];

          if (down === tile) {
            return false;
          }
        }
      }
    }

    this.status = 'lose';

    return true;
  }

  moveLeft() {
    return this.move('left');
  }
  moveRight() {
    return this.move('right');
  }
  moveUp() {
    return this.move('up');
  }
  moveDown() {
    return this.move('down');
  }
}

module.exports = Game;
