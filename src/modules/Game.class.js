'use strict';

const BOARD_SIZE = 4;
const WINNING_TILE = 2048;
const FOUR_TILE_CHANCE = 0.1;
const positions = Array.from({ length: BOARD_SIZE }, (_, index) => index);

class Game {
  constructor(initialState = positions.map(() => Array(BOARD_SIZE).fill(0))) {
    this.initialState = initialState.map((row) => [...row]);
    this.restart();
  }

  moveLeft() {
    return this.move((line, offset) => [line, offset]);
  }

  moveRight() {
    return this.move((line, offset) => [line, BOARD_SIZE - 1 - offset]);
  }

  moveUp() {
    return this.move((line, offset) => [offset, line]);
  }

  moveDown() {
    return this.move((line, offset) => [BOARD_SIZE - 1 - offset, line]);
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.addRandomTile();
    this.addRandomTile();
    this.updateStatus();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  move(getCell) {
    if (this.status !== 'playing') {
      return false;
    }

    let changed = false;

    for (const line of positions) {
      const cells = positions.map((offset) => getCell(line, offset));
      const tiles = cells.map(([row, col]) => this.state[row][col]);
      const occupied = tiles.filter(Boolean);
      const merged = [];

      for (let index = 0; index < occupied.length; index++) {
        const tile = occupied[index];

        if (tile === occupied[index + 1]) {
          const doubled = tile * 2;

          merged.push(doubled);
          this.score += doubled;
          index++;
        } else {
          merged.push(tile);
        }
      }

      cells.forEach(([row, col], index) => {
        const nextTile = merged[index] ?? 0;

        if (tiles[index] !== nextTile) {
          this.state[row][col] = nextTile;
          changed = true;
        }
      });
    }

    if (changed) {
      this.addRandomTile();
      this.updateStatus();
    }

    return changed;
  }

  addRandomTile() {
    const emptyCells = [];

    this.state.forEach((row, rowIndex) => {
      row.forEach((tile, colIndex) => {
        if (tile === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const index = Math.floor(Math.random() * emptyCells.length);
    const [targetRow, targetCol] = emptyCells[index];

    this.state[targetRow][targetCol] = Math.random() < FOUR_TILE_CHANCE ? 4 : 2;
  }

  updateStatus() {
    if (this.state.some((row) => row.includes(WINNING_TILE))) {
      this.status = 'win';

      return;
    }

    const hasMoves = this.state.some((row, rowIndex) => {
      const nextRow = this.state[rowIndex + 1];

      return row.some((tile, colIndex) => {
        return (
          tile === 0 ||
          tile === row[colIndex + 1] ||
          tile === nextRow?.[colIndex]
        );
      });
    });

    this.status = hasMoves ? 'playing' : 'lose';
  }
}

module.exports = Game;
