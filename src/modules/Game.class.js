class Game {
  constructor() {
    this.gridSize = 4;
    this.grid = this.createEmptyGrid();
    this.score = 0;
  }

  // Create an empty grid
  createEmptyGrid() {
    return Array.from({ length: this.gridSize }, () =>
      Array(this.gridSize).fill(null),
    );
  }

  // Add a random tile to the grid
  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (this.grid[row][col] === null) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.grid[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  // Check if the grid is full
  isFull() {
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (this.grid[row][col] === null) {
          return false;
        }
      }
    }

    return true;
  }

  // Reset the game
  reset() {
    this.grid = this.createEmptyGrid();
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  // Move and merge tiles in the specified direction
  move(direction) {
    let moved = false;
    const merged = [];

    for (let i = 0; i < this.gridSize; i++) {
      merged[i] = new Array(this.gridSize).fill(false);
    }

    const moveTile = (row, col, newRow, newCol) => {
      if (this.grid[newRow][newCol] === null) {
        this.grid[newRow][newCol] = this.grid[row][col];
        this.grid[row][col] = null;
        moved = true;
      } else if (
        this.grid[newRow][newCol] === this.grid[row][col] &&
        !merged[newRow][newCol]
      ) {
        this.grid[newRow][newCol] *= 2;
        this.score += this.grid[newRow][newCol];
        this.grid[row][col] = null;
        merged[newRow][newCol] = true;
        moved = true;
      }
    };

    const moveRow = (row) => {
      for (let col = 0; col < this.gridSize; col++) {
        if (this.grid[row][col] !== null) {
          let newCol = col;

          while (newCol > 0) {
            if (
              this.grid[row][newCol - 1] === null ||
              this.grid[row][newCol - 1] === this.grid[row][newCol]
            ) {
              moveTile(row, newCol, row, newCol - 1);
            }
            newCol--;
          }
        }
      }
    };

    const moveColumn = (col) => {
      for (let row = 0; row < this.gridSize; row++) {
        if (this.grid[row][col] !== null) {
          let newRow = row;

          while (newRow > 0) {
            if (
              this.grid[newRow - 1][col] === null ||
              this.grid[newRow - 1][col] === this.grid[newRow][col]
            ) {
              moveTile(newRow, col, newRow - 1, col);
            }
            newRow--;
          }
        }
      }
    };

    if (direction === 'up') {
      for (let col = 0; col < this.gridSize; col++) {
        moveColumn(col);
      }
    } else if (direction === 'down') {
      for (let col = 0; col < this.gridSize; col++) {
        for (let row = this.gridSize - 1; row >= 0; row--) {
          if (this.grid[row][col] !== null) {
            let newRow = row;

            while (newRow < this.gridSize - 1) {
              if (
                this.grid[newRow + 1][col] === null ||
                this.grid[newRow + 1][col] === this.grid[newRow][col]
              ) {
                moveTile(newRow, col, newRow + 1, col);
              }
              newRow++;
            }
          }
        }
      }
    } else if (direction === 'left') {
      for (let row = 0; row < this.gridSize; row++) {
        moveRow(row);
      }
    } else if (direction === 'right') {
      for (let row = 0; row < this.gridSize; row++) {
        for (let col = this.gridSize - 1; col >= 0; col--) {
          if (this.grid[row][col] !== null) {
            let newCol = col;

            while (newCol < this.gridSize - 1) {
              if (
                this.grid[row][newCol + 1] === null ||
                this.grid[row][newCol + 1] === this.grid[row][newCol]
              ) {
                moveTile(row, newCol, row, newCol + 1);
              }
              newCol++;
            }
          }
        }
      }
    }

    if (moved) {
      this.addRandomTile();
    }
  }

  // Check if the player has won the game
  hasWon() {
    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (this.grid[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  // Check if there are no more valid moves
  isGameOver() {
    if (!this.isFull()) {
      return false;
    }

    for (let row = 0; row < this.gridSize; row++) {
      for (let col = 0; col < this.gridSize; col++) {
        if (
          col < this.gridSize - 1 &&
          this.grid[row][col] === this.grid[row][col + 1]
        ) {
          return false;
        }

        if (
          row < this.gridSize - 1 &&
          this.grid[row][col] === this.grid[row + 1][col]
        ) {
          return false;
        }
      }
    }

    return true;
  }

  // Get the current grid state
  getGrid() {
    return this.grid;
  }

  // Get the current score
  getScore() {
    return this.score;
  }
}

export default Game;
