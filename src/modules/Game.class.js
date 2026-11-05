'use strict';

class Game {
  constructor(
    initialState = Array.from({ length: 4 }, () => Array(4).fill(0)),
  ) {
    this.initialState = initialState.map((row) => [...row]);
    this.restart();
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';
    this.addTile();
    this.addTile();
    this.updateStatus();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
  }

  mergeLine(line) {
    const tiles = line.filter(Boolean);
    const result = [];

    for (let index = 0; index < tiles.length; index++) {
      if (tiles[index] === tiles[index + 1]) {
        const merged = tiles[index] * 2;

        result.push(merged);
        this.score += merged;
        index++;
      } else {
        result.push(tiles[index]);
      }
    }

    return result.concat(Array(4 - result.length).fill(0));
  }

  move(direction) {
    if (this.status !== 'playing') {
      return;
    }

    const vertical = direction === 'up' || direction === 'down';
    const reverse = direction === 'right' || direction === 'down';
    const nextState = this.getState();
    let changed = false;

    for (let lineIndex = 0; lineIndex < 4; lineIndex++) {
      const coordinates = Array.from({ length: 4 }, (_, index) => {
        const position = reverse ? 3 - index : index;

        return vertical ? [position, lineIndex] : [lineIndex, position];
      });
      const line = coordinates.map(([row, col]) => this.state[row][col]);
      const merged = this.mergeLine(line);

      coordinates.forEach(([row, col], index) => {
        nextState[row][col] = merged[index];
        changed = changed || merged[index] !== line[index];
      });
    }

    if (changed) {
      this.state = nextState;
      this.addTile();
    }

    this.updateStatus();
  }

  addTile() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (value === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const [tileRow, tileCol] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[tileRow][tileCol] = Math.random() < 0.1 ? 4 : 2;
  }

  updateStatus() {
    if (this.state.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }

    const canMove = this.state.some((row, rowIndex) => {
      return row.some((value, colIndex) => {
        return (
          value === 0 ||
          value === row[colIndex + 1] ||
          value === this.state[rowIndex + 1]?.[colIndex]
        );
      });
    });

    this.status = canMove ? 'playing' : 'lose';
  }
}

module.exports = Game;
