'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
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
    this.size = 4; // размер игрового поля (4x4)
    this.score = 0; // текущий счёт игрока
    this.status = 'idle'; // статус игры: 'idle', 'playing', 'win', 'lose'

    this.board = initialState || this.createEmptyField();
    // инициализация игрового поля
  }

  // Создаёт пустое игровое поле размером 4x4
  createEmptyField() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  moveLeft() {
    // Проверяем, что игра в процессе, иначе не обрабатываем ход
    if (this.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < this.size; i++) {
      let row = this.board[i].filter((value) => value !== 0); // убираем нули

      // Проходим по ряду и объединяем одинаковые плитки
      for (let j = 0; j < row.length - 1; j++) {
        if (row[j] === row[j + 1]) {
          row[j] *= 2; // удваиваем значение плитки
          this.score += row[j]; // обновляем счёт
          row.splice(j + 1, 1); // удаляем объединённую плитку
          moved = true;
        }
      }

      row = row.filter((value) => value !== 0);
      // убираем нули снова после объединения

      while (row.length < this.size) {
        row.push(0); // добавляем нули в конец ряда
      }

      if (this.board[i].toString() !== row.toString()) {
        moved = true; // проверяем, изменился ли ряд
      }

      this.board[i] = row; // обновляем ряд на игровом поле
    }

    if (moved) {
      this.addRandomTile(); // добавляем новую плитку после успешного хода
      this.updateStatus(); // обновляем статус игры после хода
    }
  }

  moveRight() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    for (let i = 0; i < this.size; i++) {
      let row = this.board[i].filter((value) => value !== 0); // убираем нули

      for (let j = row.length - 1; j > 0; j--) {
        if (row[j] === row[j - 1]) {
          row[j] *= 2; // удваиваем значение плитки
          this.score += row[j]; // обновляем счёт
          row.splice(j - 1, 1); // удаляем левую объединённую плитку
          moved = true;
        }
      }

      row = row.filter((value) => value !== 0);
      // убираем нули снова после объединения

      while (row.length < this.size) {
        row.unshift(0); // добавляем нули в начало ряда
      }

      if (this.board[i].toString() !== row.toString()) {
        moved = true; // проверяем, изменился ли ряд
      }

      this.board[i] = row; // обновляем ряд на игровом поле
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus(); // обновляем статус игры после хода
    }
  }

  moveUp() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    for (let j = 0; j < this.size; j++) {
      // Собираем ненулевые элементы столбца сверху вниз
      let column = [];

      for (let i = 0; i < this.size; i++) {
        if (this.board[i][j] !== 0) {
          column.push(this.board[i][j]); // убираем нули
        }
      }

      // Сливаем соседние одинаковые элементы сверху вниз
      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2; // Удваиваем значение плитки
          this.score += column[i]; // Обновляем счёт
          column.splice(i + 1, 1); // удаляем объединённую плитку
          moved = true;
        }
      }
      column = column.filter((value) => value !== 0);
      // убираем нули снова после объединения

      while (column.length < this.size) {
        column.push(0); // добавляем нули в конец столбца
      }

      for (let i = 0; i < this.size; i++) {
        if (this.board[i][j] !== column[i]) {
          moved = true; // проверяем, изменился ли столбец
        }
        this.board[i][j] = column[i]; // обновляем ряд на игровом поле
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }
  moveDown() {
    if (this.getStatus() !== 'playing') {
      return;
    }

    let moved = false;

    for (let j = 0; j < this.size; j++) {
      let column = [];

      for (let i = this.size - 1; i >= 0; i--) {
        if (this.board[i][j] !== 0) {
          column.push(this.board[i][j]); // убираем нули
        }
      }

      // объединяем одинаковые
      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2; // Удваиваем значение плитки
          this.score += column[i]; // Обновляем счёт
          column.splice(i + 1, 1); // удаляем объединённую плитку
          moved = true;
        }
      }

      column = column.filter((value) => value !== 0);
      // убираем нули снова после объединения

      while (column.length < this.size) {
        column.unshift(0); // добавляем нули в начало столбца
      }

      for (let i = 0; i < this.size; i++) {
        if (this.board[i][j] !== column[i]) {
          moved = true; // проверяем, изменился ли столбец
        }
        this.board[i][j] = column[i];
        // обновляем ряд на игровом поле
      }
    }

    if (moved) {
      this.addRandomTile();
      this.updateStatus();
    }
  }

  /**
   * @returns {number} Текущий счёт
   */

  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]} Текущее состояние игрового поля
   */
  getState() {
    return this.board;
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
   * Стартует игру.
   * Инициализирует игровое поле
   * Устанавливает начальные значения для счёта и статуса игры.
   */
  start() {
    this.board = this.createEmptyField();

    this.score = 0;
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }
  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  /**
   * Добавляет случайную плитку (2 или 4) в случайную пустую ячейку.
   * Вероятность появления 2 — 90%, 4 — 10%.
   * Если пустых ячеек нет — ничего не делает.
   */
  addRandomTile() {
    // Собираем все пустые ячейки
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      // Выбираем случайную пустую ячейку
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      // 90% — плитка 2, 10% — плитка 4
      this.board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  updateStatus() {
    // Победа — есть плитка 2048
    for (const row of this.board) {
      if (row.includes(2048)) {
        this.status = 'win';

        return;
      }
    }

    // Игра продолжается — есть пустые ячейки
    if (this.board.some((row) => row.includes(0))) {
      this.status = 'playing';

      return;
    }

    // проверка соседние плитки с одинаковыми значениями
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        const current = this.board[i][j];

        // проверяем соседа справа
        if (j < this.size - 1 && current === this.board[i][j + 1]) {
          this.status = 'playing';

          return;
        }

        //  проверяем соседа снизу
        if (i < this.size - 1 && current === this.board[i + 1][j]) {
          this.status = 'playing';

          return;
        }
      }
    }
    // ячейки заполнены, нет ходов — проигрыш
    this.status = 'lose';
  }
}
