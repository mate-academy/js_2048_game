// Переміщуємо плитки вправо - працюючий код
for (let row = 0; row < this.gridSize; row++) {
  for (let col = this.gridSize - 2; col >= 0; col--) {
    // Змінили початкове значення col
    if (this.grid[row][col] !== 0) {
      let current = col;

      while (current < this.gridSize - 1 && this.grid[row][current + 1] === 0) {
        this.grid[row][current + 1] = this.grid[row][current];
        this.grid[row][current] = 0;
        current++;
      }
    }
  }
}
