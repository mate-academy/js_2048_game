'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(initialState) {
    this.initialState = initialState
      ? initialState.map((row) => [...row])
      : Array.from({ length: 4 }, () => Array(4).fill(0));

    this.state = this.initialState.map((row) => [...row]);
    this.size = 4;
    this.score = 0;
    this.status = 'idle';
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells;
  }

  addRandomCell() {
    const emptyCells = this.getEmptyCells();

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];

    const value = Math.random() < 0.9 ? 2 : 4;

    this.state[row][col] = value;
  }

  /**
   * Зсуває та зливає рядок вліво
   * @returns {object} {newRow, gainedScore, moved}
   */
  slideAndMerge(row) {
    // Фільтруємо всі ненульові значення
    const nonZero = row.filter((value) => value !== 0);
    const result = [];
    let gainedScore = 0;
    let i = 0;

    // Обробляємо злиття
    while (i < nonZero.length) {
      // Якщо поточне та наступне значення однакові - зливаємо
      if (i < nonZero.length - 1 && nonZero[i] === nonZero[i + 1]) {
        const mergedValue = nonZero[i] * 2;

        result.push(mergedValue);
        gainedScore += mergedValue;
        i += 2;
      } else {
        result.push(nonZero[i]);
        i++;
      }
    }

    // Заповнюємо решту нулями
    while (result.length < this.size) {
      result.push(0);
    }

    // Перевіряємо чи змінився рядок
    const moved = JSON.stringify(row) !== JSON.stringify(result);

    return {
      newRow: result,
      gainedScore: gainedScore,
      moved: moved,
    };
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return false;
    }

    let movedAny = false;
    let totalGained = 0;
    const newState = [];

    for (let row = 0; row < this.size; row++) {
      const { newRow, gainedScore, moved } = this.slideAndMerge(
        this.state[row],
      );

      newState.push(newRow);

      if (moved) {
        movedAny = true;
      }

      totalGained += gainedScore;
    }

    // Якщо хоча б щось змінилось
    if (movedAny) {
      this.state = newState;
      this.score += totalGained;
      this.addRandomCell();
      this.updateStatus();
    }

    return movedAny;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return false;
    }

    let movedAny = false;
    let totalGained = 0;
    const newState = [];

    // Обробляємо кожен рядок (реверс -> slideAndMerge -> реверс назад)
    for (let row = 0; row < this.size; row++) {
      const reversedRow = [...this.state[row]].reverse();
      const { newRow, gainedScore, moved } = this.slideAndMerge(reversedRow);
      const finalRow = newRow.reverse();

      newState.push(finalRow);

      if (moved) {
        movedAny = true;
      }

      totalGained += gainedScore;
    }

    if (movedAny) {
      this.state = newState;
      this.score += totalGained;
      this.addRandomCell();
      this.updateStatus();
    }

    return movedAny;
  }

  /**
   * Рух вгору
   */
  moveUp() {
    if (this.status !== 'playing') {
      return false;
    }

    let movedAny = false;
    let totalGained = 0;
    const newState = Array.from({ length: 4 }, () => Array(4).fill(0));

    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = 0; row < this.size; row++) {
        column.push(this.state[row][col]);
      }

      const { newRow, gainedScore, moved } = this.slideAndMerge(column);

      // Записуємо колонку назад
      for (let row = 0; row < this.size; row++) {
        newState[row][col] = newRow[row];
      }

      if (moved) {
        movedAny = true;
      }

      totalGained += gainedScore;
    }

    if (movedAny) {
      this.state = newState;
      this.score += totalGained;
      this.addRandomCell();
      this.updateStatus();
    }

    return movedAny;
  }

  moveDown() {
    if (this.status !== 'playing') {
      return false;
    }

    let movedAny = false;
    let totalGained = 0;
    const newState = Array.from({ length: 4 }, () => Array(4).fill(0));

    for (let col = 0; col < this.size; col++) {
      const column = [];

      for (let row = 0; row < this.size; row++) {
        column.push(this.state[row][col]);
      }

      const reversedColumn = column.reverse();
      const { newRow, gainedScore, moved } = this.slideAndMerge(reversedColumn);
      const finalColumn = newRow.reverse();

      // Записуємо колонку назад
      for (let row = 0; row < this.size; row++) {
        newState[row][col] = finalColumn[row];
      }

      if (moved) {
        movedAny = true;
      }

      totalGained += gainedScore;
    }

    if (movedAny) {
      this.state = newState;
      this.score += totalGained;
      this.addRandomCell();
      this.updateStatus();
    }

    return movedAny;
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    // Повертаємо копію, щоб зовнішній код не міг змінити стан
    return this.state.map((row) => [...row]);
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'playing') {
      return;
    }

    this.status = 'playing';

    this.addRandomCell();
    this.addRandomCell();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  checkWin() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.state[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  hasMoves() {
    if (this.getEmptyCells().length > 0) {
      return true;
    }

    // Перевіряємо горизонтальні сусідні клітинки
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size - 1; col++) {
        if (this.state[row][col] === this.state[row][col + 1]) {
          return true;
        }
      }
    }

    // Перевіряємо вертикальні сусідні клітинки
    for (let col = 0; col < this.size; col++) {
      for (let row = 0; row < this.size - 1; row++) {
        if (this.state[row][col] === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    if (this.checkWin() && this.status !== 'win') {
      this.status = 'win';

      return;
    }

    if (!this.hasMoves()) {
      this.status = 'lose';

      return;
    }

    this.status = 'playing';
  }
}

module.exports = Game;
