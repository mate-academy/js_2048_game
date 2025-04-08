import { GAME_STATUS } from '../constants';

export default class Game {
  constructor() {
    this.gridSize = 4;
    this.winningValue = 2048;
    this.reset();
  }

  reset() {
    this.grid = this.createEmptyGrid();
    this.score = 0;
    this.status = GAME_STATUS.IDLE;
  }

  start() {
    this.status = GAME_STATUS.PLAYING;
    this.addNewTile();
    this.addNewTile();
  }

  restart() {
    this.reset();
  }

  moveLeft() {
    this.processMove('left');
  }
  moveRight() {
    this.processMove('right');
  }
  moveUp() {
    this.processMove('up');
  }
  moveDown() {
    this.processMove('down');
  }

  processMove(direction) {
    const newGrid = this.calculateNewGrid(direction);

    if (!this.gridsAreEqual(this.grid, newGrid)) {
      this.grid = newGrid;
      this.addNewTile();
      this.updateGameStatus();
    }
  }

  calculateNewGrid(direction) {
    switch (direction) {
      case 'left':
        return this.moveHorizontal(false);
      case 'right':
        return this.moveHorizontal(true);
      case 'up':
        return this.moveVertical(false);
      case 'down':
        return this.moveVertical(true);
      default:
        return this.copyGrid();
    }
  }

  moveHorizontal(reverse) {
    return this.grid.map((row) => {
      let processed = [...row];

      if (reverse) {
        processed.reverse();
      }

      processed = this.mergeLine(processed);

      if (reverse) {
        processed.reverse();
      }

      return processed;
    });
  }

  moveVertical(reverse) {
    const newGrid = this.createEmptyGrid();

    for (let col = 0; col < this.gridSize; col++) {
      let column = this.grid.map((row) => row[col]);

      if (reverse) {
        column = column.reverse();
      }

      const merged = this.mergeLine(column);

      if (reverse) {
        merged.reverse();
      }

      this.setColumn(newGrid, col, merged);
    }

    return newGrid;
  }

  mergeLine(tiles) {
    const merged = tiles.filter((tile) => tile !== 0);
    let newScore = 0;

    for (let i = 0; i < merged.length - 1; i++) {
      if (merged[i] === merged[i + 1]) {
        merged[i] *= 2;
        newScore += merged[i];
        merged.splice(i + 1, 1);
      }
    }

    this.score += newScore;

    while (merged.length < this.gridSize) {
      merged.push(0);
    }

    return merged;
  }

  createEmptyGrid() {
    return Array.from({ length: this.gridSize }, () => {
      return Array(this.gridSize).fill(0);
    });
  }

  copyGrid() {
    return this.grid.map((row) => [...row]);
  }

  setColumn(targetGrid, col, values) {
    values.forEach((value, row) => {
      targetGrid[row][col] = value;
    });
  }

  gridsAreEqual(gridA, gridB) {
    return gridA.every((row, i) => {
      return row.every((cell, j) => cell === gridB[i][j]);
    });
  }

  addNewTile() {
    const emptyCells = [];

    this.grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) {
          emptyCells.push([i, j]);
        }
      });
    });

    if (emptyCells.length > 0) {
      const [i, j] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.grid[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  updateGameStatus() {
    if (this.hasWinningTile()) {
      this.status = GAME_STATUS.WIN;
    } else if (!this.hasPossibleMoves()) {
      this.status = GAME_STATUS.LOSE;
    }
  }

  hasWinningTile() {
    return this.grid.some((row) => row.includes(this.winningValue));
  }

  hasPossibleMoves() {
    // Check for empty cells
    if (this.grid.some((row) => row.includes(0))) {
      return true;
    }

    // Check for possible merges
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        const current = this.grid[row][col];
        const canMergeRight =
          col < this.gridSize - 1 && current === this.grid[row][col + 1];
        const canMergeDown =
          row < this.gridSize - 1 && current === this.grid[row + 1][col];

        if (canMergeRight || canMergeDown) {
          return true;
        }
      }
    }

    return false;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.copyGrid();
  }

  getStatus() {
    return this.status;
  }
}
