export class Game {
  constructor() {
    this.grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0; // Поточний рахунок
  }

  addRandomTile() {
    const availableCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.grid[row][col] === 0) {
          availableCells.push({ cellX: row, cellY: col });
        }
      }
    }

    if (availableCells.length === 0) {
      return;
    }

    const { cellX, cellY } =
      availableCells[Math.floor(Math.random() * availableCells.length)];

    this.grid[cellX][cellY] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    let moved = false;

    for (let x = 0; x < 4; x++) {
      const originalRow = [...this.grid[x]]; // Зберігаємо оригінальний рядок
      const row = this.grid[x].filter((value) => value !== 0);

      for (let y = 0; y < row.length - 1; y++) {
        if (row[y] === row[y + 1]) {
          row[y] *= 2;
          this.score += row[y];
          row.splice(y + 1, 1);
        }
      }

      while (row.length < 4) {
        row.push(0);
      }

      if (originalRow.toString() !== row.toString()) {
        moved = true;
      }

      this.grid[x] = row;
    }

    return moved;
  }

  moveRight() {
    this.grid.forEach((row) => row.reverse());

    const moved = this.moveLeft();

    this.grid.forEach((row) => row.reverse());

    return moved;
  }

  moveUp() {
    this.grid = this.transpose(this.grid);

    const moved = this.moveLeft();

    this.grid = this.transpose(this.grid);

    return moved;
  }

  moveDown() {
    this.grid = this.transpose(this.grid);

    const moved = this.moveRight();

    this.grid = this.transpose(this.grid);

    return moved;
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  isGameOver() {
    if (this.grid.flat().includes(0)) {
      return false; // Якщо є порожні клітинки
    }

    for (let x = 0; x < 4; x++) {
      for (let y = 0; y < 4; y++) {
        if (
          (y < 3 && this.grid[x][y] === this.grid[x][y + 1]) ||
          (x < 3 && this.grid[x][y] === this.grid[x + 1][y])
        ) {
          return false; // Якщо є можливість ходу
        }
      }
    }

    return true; // Немає доступних ходів
  }

  getStatus() {
    for (const row of this.grid) {
      if (row.includes(2048)) {
        return 'win';
      }
    }

    return this.isGameOver() ? 'lose' : 'playing';
  }

  start() {
    this.grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  getState() {
    return {
      board: this.grid,
      score: this.score,
    };
  }
}
