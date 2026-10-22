export class Game {
  /**
   * @param {number[][]} [initialState] - опціональний початковий стан поля 4x4
   */
  constructor(initialState) {
    this.size = 4;
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'

    if (initialState && Array.isArray(initialState)) {
      this.board = initialState.map((row) => [...row]);
    } else {
      this.board = this.createEmptyBoard();
    }
  }

  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';

    // Додаємо дві початкові плитки
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.start();
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    // Виправлено: прибрано повторне оголошення let/const для r та c
    ({ r: this.targetR, c: this.targetC } = emptyCells[randomIndex]);

    // 90% шанс для 2, 10% шанс для 4
    this.board[this.targetR][this.targetC] = Math.random() < 0.9 ? 2 : 4;
  }

  // --- Логіка руху ---

  /**
   * Обробляє один рядок вліво з урахуванням
   * обмеження "одне злиття на плитку за хід"
   * @param {number[]} row
   * @returns {{ newRow: number[], scoreGained: number, hasMerged: boolean }}
   */
  slideAndMergeRow(row) {
    // 1. Видаляємо нулі
    const nonZero = row.filter((val) => val !== 0);
    const newRow = [];
    let scoreGained = 0;

    let i = 0;

    while (i < nonZero.length) {
      if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
        // Злиття
        const mergedVal = nonZero[i] * 2;

        newRow.push(mergedVal);
        scoreGained += mergedVal;
        i += 2; // Пропускаємо обидві злиті плитки
      } else {
        newRow.push(nonZero[i]);
        i++;
      }
    }

    // 2. Доповнюємо нулями до розміру 4
    while (newRow.length < this.size) {
      newRow.push(0);
    }

    return { newRow, scoreGained };
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    for (let r = 0; r < this.size; r++) {
      const currentRow = this.board[r];
      const { newRow, scoreGained } = this.slideAndMergeRow(currentRow);

      // Перевіряємо, чи змінився рядок
      if (currentRow.some((val, idx) => val !== newRow[idx])) {
        moved = true;
      }

      this.board[r] = newRow;
      this.score += scoreGained;
    }

    if (moved) {
      this.afterMove();
    }

    return moved;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    for (let r = 0; r < this.size; r++) {
      // Реверсуємо рядок, рухаємо вліво,
      // потім знову реверсуємо
      const reversedRow = [...this.board[r]].reverse();
      const { newRow, scoreGained } = this.slideAndMergeRow(reversedRow);
      const finalRow = newRow.reverse();

      if (this.board[r].some((val, idx) => val !== finalRow[idx])) {
        moved = true;
      }

      this.board[r] = finalRow;
      this.score += scoreGained;
    }

    if (moved) {
      this.afterMove();
    }

    return moved;
  }

  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    for (let c = 0; c < this.size; c++) {
      // Формуємо колонку як масив
      const col = [];

      for (let r = 0; r < this.size; r++) {
        col.push(this.board[r][c]);
      }

      const { newRow: newCol, scoreGained } = this.slideAndMergeRow(col);

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== newCol[r]) {
          moved = true;
        }
        this.board[r][c] = newCol[r];
      }

      this.score += scoreGained;
    }

    if (moved) {
      this.afterMove();
    }

    return moved;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    let moved = false;

    for (let c = 0; c < this.size; c++) {
      const col = [];

      for (let r = 0; r < this.size; r++) {
        col.push(this.board[r][c]);
      }

      const reversedCol = col.reverse();
      const { newRow, scoreGained } = this.slideAndMergeRow(reversedCol);
      const finalCol = newRow.reverse();

      for (let r = 0; r < this.size; r++) {
        if (this.board[r][c] !== finalCol[r]) {
          moved = true;
        }
        this.board[r][c] = finalCol[r];
      }

      this.score += scoreGained;
    }

    if (moved) {
      this.afterMove();
    }

    return moved;
  }

  // --- Перевірки стану після успішного ходу ---

  afterMove() {
    // 1. Додаємо нову плитку
    this.addRandomTile();

    // 2. Перевірка на перемогу (наявність 2048)
    if (this.hasWinTile()) {
      this.status = 'win';

      return;
    }

    // 3. Перевірка на поразку (немає ходів)
    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  hasWinTile() {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] >= 2048) {
          return true;
        }
      }
    }

    return false;
  }

  canMove() {
    // Якщо є хоч одна порожня клітинка — хід можливий
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }
      }
    }

    // Перевірка суміжних клітинок на однакові значення
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const val = this.board[r][c];

        // Сусід праворуч
        if (c + 1 < this.size && this.board[r][c + 1] === val) {
          return true;
        }

        // Сусід знизу
        if (r + 1 < this.size && this.board[r + 1][c] === val) {
          return true;
        }
      }
    }

    return false;
  }
}
