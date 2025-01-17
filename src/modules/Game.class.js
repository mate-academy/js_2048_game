'use strict';

class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState.map((row) => [...row]);
    // Зберігаємо копію initialState
    this.grid = initialState.map((row) => [...row]); // Глибока копія
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.grid);

    this.grid = this.grid.map((row) => this._slideAndMerge(row));
    this._postMoveHandler(prevState);
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.grid);

    // Переміщаємо клітинки вправо без об'єднання
    this.grid = this.grid.map((row) => this._slideRight(row));

    // Тепер об'єднуємо клітинки з однаковими значеннями
    this.grid = this.grid.map((row) => this._mergeRight(row));

    this._postMoveHandler(prevState);
  }

  // Функція для переміщення вправо без об'єднання
  _slideRight(row) {
    const filtered = row.filter((cell) => cell !== 0); // Фільтруємо всі нулі
    const merged = new Array(4).fill(0); // Масив, в якому всі елементи рівні 0

    let emptyIndex = 3; // Позиція, куди вставляти елементи

    for (let i = filtered.length - 1; i >= 0; i--) {
      merged[emptyIndex--] = filtered[i]; // Переміщаємо елементи вправо
    }

    return merged; // Повертаємо новий відсортований масив
  }

  // Функція для об'єднання клітинок вправо
  _mergeRight(row) {
    const merged = row.slice();
    // Створюємо копію масиву, щоб не змінювати оригінальний

    for (let i = 3; i > 0; i--) {
      if (merged[i] === merged[i - 1] && merged[i] !== 0) {
        // Перевіряємо на однакові значення
        merged[i] *= 2; // Об'єднуємо клітинки
        this.score += merged[i]; // Додаємо до рахунку
        merged[i - 1] = 0; // Очищаємо клітинку, яка була об'єднана
      }
    }

    return this._slideRight(merged);
    // Повторно переміщаємо клітинки після об'єднання
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.grid);

    this._transposeGrid();
    this.grid = this.grid.map((row) => this._slideAndMerge(row));
    this._transposeGrid();
    this._postMoveHandler(prevState);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = JSON.stringify(this.grid);

    this._transposeGrid();

    this.grid = this.grid.map(
      (row) => this._slideAndMerge(row.reverse()).reverse(),
      // eslint-disable-next-line function-paren-newline
    );
    this._transposeGrid();
    this._postMoveHandler(prevState);
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.grid;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return; // Забороняємо старт, якщо гра вже активна
    }

    this.status = 'playing'; // Змінюємо статус на "playing"
    this._addRandomCell(); // Додаємо випадкову клітинку
    this._addRandomCell(); // Додаємо ще одну випадкову клітинку
  }

  restart() {
    this.score = 0;
    this.grid = this.initialState;
    this.status = 'idle';
  }

  reset() {
    this.grid = this.initialState.map((row) => [...row]);
    // Повертаємося до initialState
    this.score = 0;
    this.status = 'idle';
  }

  _slideAndMerge(row) {
    const filtered = row.filter((cell) => cell !== 0);
    const merged = [];

    let skipNext = false; // Позначка, щоб уникнути подвійного об'єднання

    for (let i = 0; i < filtered.length; i++) {
      if (skipNext) {
        skipNext = false; // Пропускаємо поточний елемент
        continue;
      }

      if (filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        this.score += filtered[i] * 2;
        skipNext = true; // Позначаємо, щоб пропустити наступне
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return merged;
  }

  _transposeGrid() {
    this.grid = this.grid[0].map(
      (_, colIndex) => this.grid.map((row) => row[colIndex]),
      // eslint-disable-next-line function-paren-newline
    );
  }

  _addRandomCell() {
    // Ensure you add a random value (e.g., 2 or 4) in an empty spot
    const emptyCells = [];

    for (let row = 0; row < this.grid.length; row++) {
      for (let col = 0; col < this.grid[row].length; col++) {
        if (this.grid[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      this.grid[row][col] = Math.random() < 0.9 ? 2 : 4;
      // 90% chance for 2, 10% for 4
    }
  }

  _postMoveHandler(prevState) {
    if (JSON.stringify(this.grid) !== prevState) {
      this._addRandomCell();

      if (this._checkWin()) {
        this.status = 'win';
      } else if (!this._hasAvailableMoves()) {
        this.status = 'lose';
      }
    }
  }

  _checkWin() {
    return this.grid.some((row) => row.some((cell) => cell === 2048));
  }

  _hasAvailableMoves() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.grid[r][c] === 0) {
          return true;
        }

        if (c < 3 && this.grid[r][c] === this.grid[r][c + 1]) {
          return true;
        }

        if (r < 3 && this.grid[r][c] === this.grid[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
