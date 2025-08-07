export default class Game {
  constructor(initialState) {
    this.size = 4;
    this.grid = initialState || this.createEmptyGrid();
    this.score = 0;
    this.status = 'start';
  }

  createEmptyGrid() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  getState() {
    return this.grid;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.grid = this.createEmptyGrid();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    // eslint-disable-next-line no-shadow
    this.grid.forEach((row, r) => {
      // eslint-disable-next-line no-shadow
      row.forEach((cell, c) => {
        if (cell === 0) {
          emptyCells.push([r, c]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  move(direction) {
    let needAddTile = false;
    let rotated = false;
    let flipped = false;

    let newGrid = this.grid.map((row) => [...row]); // create deep copy

    switch (direction) {
      case 'up':
        newGrid = this.rotateLeft(newGrid);
        rotated = true;
        break;
      case 'down':
        newGrid = this.rotateRight(newGrid);
        rotated = true;
        break;
      case 'right':
        newGrid = this.flip(newGrid);
        flipped = true;
        break;
    }

    const oldGridStr = JSON.stringify(newGrid);

    newGrid = newGrid.map((row) => this.slideAndCombineRow(row));

    const newGridStr = JSON.stringify(newGrid);

    if (oldGridStr !== newGridStr) {
      needAddTile = true;
    }

    if (flipped) {
      newGrid = this.flip(newGrid);
    }

    if (rotated && direction === 'up') {
      newGrid = this.rotateRight(newGrid);
    }

    if (rotated && direction === 'down') {
      newGrid = this.rotateLeft(newGrid);
    }

    this.grid = newGrid;

    if (needAddTile) {
      this.addRandomTile();
    }

    if (this.isWin()) {
      this.status = 'win';
    } else if (this.isGameOver()) {
      this.status = 'lose';
    }
  }

  slideAndCombineRow(row) {
    // eslint-disable-next-line no-param-reassign
    row = row.filter((val) => val !== 0);

    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        this.score += row[i];
        row[i + 1] = 0;
      }
    }

    // eslint-disable-next-line no-param-reassign
    row = row.filter((val) => val !== 0);

    while (row.length < this.size) {
      row.push(0);
    }

    return row;
  }

  rotateLeft(matrix) {
    const result = this.createEmptyGrid();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        result[this.size - 1 - c][r] = matrix[r][c];
      }
    }

    return result;
  }

  rotateRight(matrix) {
    const result = this.createEmptyGrid();

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        result[c][this.size - 1 - r] = matrix[r][c];
      }
    }

    return result;
  }

  flip(matrix) {
    return matrix.map((row) => [...row].reverse());
  }

  isGameOver() {
    if (this.grid.flat().includes(0)) {
      return false;
    }

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size - 1; c++) {
        if (this.grid[r][c] === this.grid[r][c + 1]) {
          return false;
        }
      }
    }

    for (let c = 0; c < this.size; c++) {
      for (let r = 0; r < this.size - 1; r++) {
        if (this.grid[r][c] === this.grid[r + 1][c]) {
          return false;
        }
      }
    }

    return true;
  }

  isWin() {
    return this.grid.flat().includes(2048);
  }
}
