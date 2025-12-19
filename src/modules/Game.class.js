export class Game {
  constructor(initialState) {
    this.grid = initialState
      ? JSON.parse(JSON.stringify(initialState))
      : this.generateEmptyGrid();
    this.score = 0;
    this.status = 'playing';
  }

  generateEmptyGrid() {
    return Array(4)
      .fill(null)
      .map(() => Array(4).fill(0));
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

  slide(row) {
    let filteredRow = row.filter((val) => val !== 0);

    for (let i = 0; i < filteredRow.length - 1; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        filteredRow[i] = filteredRow[i] * 2;
        this.score += filteredRow[i];
        filteredRow[i + 1] = 0;
        i++;
      }
    }
    filteredRow = filteredRow.filter((val) => val !== 0);

    while (filteredRow.length < 4) {
      filteredRow.push(0);
    }

    return filteredRow;
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  moveLeft() {
    const previousState = JSON.stringify(this.grid);

    this.grid = this.grid.map((row) => this.slide(row));
    this.afterMove(previousState);
  }

  moveRight() {
    const previousState = JSON.stringify(this.grid);

    this.grid = this.grid.map((row) => {
      const reversed = [...row].reverse();

      return this.slide(reversed).reverse();
    });
    this.afterMove(previousState);
  }

  moveUp() {
    const previousState = JSON.stringify(this.grid);

    this.grid = this.transpose(this.grid);
    this.grid = this.grid.map((row) => this.slide(row));
    this.grid = this.transpose(this.grid);
    this.afterMove(previousState);
  }

  moveDown() {
    const previousState = JSON.stringify(this.grid);

    this.grid = this.transpose(this.grid);

    this.grid = this.grid.map((row) => {
      const reversed = [...row].reverse();

      return this.slide(reversed).reverse();
    });
    this.grid = this.transpose(this.grid);
    this.afterMove(previousState);
  }

  afterMove(previousState) {
    if (previousState !== JSON.stringify(this.grid)) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  addRandomTile() {
    const emptyCells = [];

    this.grid.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell === 0) {
          emptyCells.push({ r, c });
        }
      });
    });

    if (emptyCells.length > 0) {
      const { r, c } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  canMove() {
    if (this.grid.flat().includes(0)) {
      return true;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.grid[r][c];

        if (c < 3 && current === this.grid[r][c + 1]) {
          return true;
        }

        if (r < 3 && current === this.grid[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  checkStatus() {
    if (this.grid.flat().includes(2048)) {
      this.status = 'won';
    } else if (!this.canMove()) {
      this.status = 'lost';
    }
  }

  start() {
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.grid = this.generateEmptyGrid();
    this.score = 0;
    this.status = 'playing';
    this.start();
  }
}
