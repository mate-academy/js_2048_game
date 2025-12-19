export class Game {
  constructor() {
    this.restart();
  }

  restart() {
    this.grid = Array(4)
      .fill()
      .map(() => Array(4).fill(0));
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { r, c } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  // MÉTODO CRUCIAL: Retorna true se o tabuleiro mudou, false se não.
  afterMove(previousState) {
    if (previousState !== JSON.stringify(this.grid)) {
      this.addRandomTile();
      this.checkStatus();

      return true; // Movimento válido
    }

    return false; // Movimento inválido (nada mudou)
  }

  moveLeft() {
    const previousState = JSON.stringify(this.grid);

    this.grid = this.grid.map((row) => this.slide(row));

    return this.afterMove(previousState);
  }

  moveRight() {
    const previousState = JSON.stringify(this.grid);

    this.grid = this.grid.map((row) => {
      const reversed = [...row].reverse();

      return this.slide(reversed).reverse();
    });

    return this.afterMove(previousState);
  }

  moveUp() {
    const previousState = JSON.stringify(this.grid);

    this.grid = this.transpose(this.grid);
    this.grid = this.grid.map((row) => this.slide(row));
    this.grid = this.transpose(this.grid);

    return this.afterMove(previousState);
  }

  moveDown() {
    const previousState = JSON.stringify(this.grid);

    this.grid = this.transpose(this.grid);

    this.grid = this.grid.map((row) => {
      const reversed = [...row].reverse();

      return this.slide(reversed).reverse();
    });
    this.grid = this.transpose(this.grid);

    return this.afterMove(previousState);
  }

  slide(row) {
    const arr = row.filter((val) => val);

    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        this.score += arr[i];
        arr.splice(i + 1, 1);
      }
    }

    while (arr.length < 4) {
      arr.push(0);
    }

    return arr;
  }

  transpose(grid) {
    return grid[0].map((_, i) => grid.map((row) => row[i]));
  }

  checkStatus() {
    // Verificar vitória (2048)
    if (this.grid.flat().includes(2048)) {
      this.status = 'won';

      return;
    }

    // Verificar se ainda há espaços vazios
    if (this.grid.flat().includes(0)) {
      this.status = 'playing';

      return;
    }

    // Verificar se há movimentos possíveis (fusões vizinhas)
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const val = this.grid[r][c];

        if (
          (c < 3 && val === this.grid[r][c + 1]) ||
          (r < 3 && val === this.grid[r + 1][c])
        ) {
          this.status = 'playing';

          return;
        }
      }
    }

    this.status = 'lost';
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
}
