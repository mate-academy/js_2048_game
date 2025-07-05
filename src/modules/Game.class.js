'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export class Game {
  constructor(initialState = []) {
    this.initialState = initialState;
    this.score = 0;
    this.status = 'idle';
  }

  arraysEqual(a, b) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
  }

  moveLeft() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      let row = this.initialState[i].filter((n) => n !== 0);

      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row[j + 1] = 0;
          j++;
        }
      }

      row = row.filter((n) => n !== 0);

      while (row.length < 4) {
        row.push(0);
      }

      if (!this.arraysEqual(this.initialState[i], row)) {
        moved = true;
        this.initialState[i] = row;
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    return moved;
  }
  moveRight() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      // 1. Отримуємо рядок і розвертаємо його
      let row = [...this.initialState[i]].reverse().filter((n) => n !== 0);

      // 2. Зливаємо однакові значення
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2;
          this.score += row[j];
          row[j + 1] = 0;
          j++; // пропустити наступну, бо вже з'єднано
        }
      }

      // 3. Видаляємо нулі і знову розвертаємо назад
      row = row.filter((n) => n !== 0);

      while (row.length < 4) {
        row.push(0);
      }
      row = row.reverse();

      // 4. Перевіряємо, чи змінилась лінія
      if (!this.arraysEqual(this.initialState[i], row)) {
        moved = true;
        this.initialState[i] = row;
      }
    }

    // 5. Якщо щось змінилось — додаємо нову плитку
    if (moved) {
      this.addRandomTile();
    }

    return moved;
  }
  moveUp() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      // 1. Зібрати колонку
      let column = [];

      for (let row = 0; row < 4; row++) {
        if (this.initialState[row][col] !== 0) {
          column.push(this.initialState[row][col]);
        }
      }

      // 2. Злиття однакових плиток
      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column[i + 1] = 0;
          i++;
        }
      }

      // 3. Видалити нулі, заповнити 0 до 4-х
      column = column.filter((n) => n !== 0);

      while (column.length < 4) {
        column.push(0);
      }

      // 4. Записати колонку назад в initialState
      for (let row = 0; row < 4; row++) {
        if (this.initialState[row][col] !== column[row]) {
          moved = true;
          this.initialState[row][col] = column[row];
        }
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    return moved;
  }
  moveDown() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      // 1. Зібрати колонку у зворотному порядку
      let column = [];

      for (let row = 3; row >= 0; row--) {
        if (this.initialState[row][col] !== 0) {
          column.push(this.initialState[row][col]);
        }
      }

      // 2. Злиття однакових плиток
      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column[i + 1] = 0;
          i++;
        }
      }

      // 3. Видалити нулі, заповнити 0 до 4-х
      column = column.filter((n) => n !== 0);

      while (column.length < 4) {
        column.push(0);
      }

      // 4. Записати назад у правильному порядку
      for (let row = 3; row >= 0; row--) {
        const idx = 3 - row; // індекс у колонці

        if (this.initialState[row][col] !== column[idx]) {
          moved = true;
          this.initialState[row][col] = column[idx];
        }
      }
    }

    if (moved) {
      this.addRandomTile();
    }

    return moved;
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
    return this.initialState;
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

  /**
   * Starts the game.
   */
  start() {
    this.initialState = Array.from({ length: 4 }, () => Array(4).fill(0));

    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.initialState = [];
    this.start();
    this.score = 0;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let roww = 0; roww < 4; roww++) {
      for (let coll = 0; coll < 4; coll++) {
        if (this.initialState[roww][coll] === 0) {
          emptyCells.push({ row: roww, col: coll });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const index = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[index];

    this.initialState[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  generateEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  checkWin() {
    for (const row of this.initialState) {
      if (row.includes(2048)) {
        this.status = 'win';

        return true;
      }
    }

    return false;
  }

  checkLose() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.initialState[row][col] === 0) {
          return false;
        }

        if (
          col < 3 &&
          this.initialState[row][col] === this.initialState[row][col + 1]
        ) {
          return false;
        }

        if (
          row < 3 &&
          this.initialState[row][col] === this.initialState[row + 1][col]
        ) {
          return false;
        }
      }
    }
    this.status = 'lose';

    return true;
  }
}
