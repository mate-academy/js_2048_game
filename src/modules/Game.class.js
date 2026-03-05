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
    // eslint-disable-next-line no-console
    const defaultBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.initialState = initialState
      ? initialState.map((row) => row.slice())
      : defaultBoard.map((row) => row.slice());

    this.board = this.initialState.map((row) => row.slice());

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    // 1️⃣ Копія дошки для перевірки, чи змінилася
    const oldBoard = this.board.map((row) => [...row]);

    // 2️⃣ Пройтись по кожному рядку
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      const row = this.board[rowIndex];

      // Зсунути числа вліво (видалити нулі)
      let newRow = row.filter((num) => num !== 0);

      // Об'єднати сусідні числа
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i]; // додати до рахунку
          newRow[i + 1] = 0;
          i++; // пропускаємо наступну плитку, щоб не зливати двічі
        }
      }

      // Знову зсунути числа вліво після об'єднання
      newRow = newRow.filter((num) => num !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      // Оновити рядок у дошці
      this.board[rowIndex] = newRow;
    }

    // 3️⃣ Перевірка: чи змінилася дошка
    let boardChanged = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] !== oldBoard[i][j]) {
          boardChanged = true;
          break;
        }
      }

      if (boardChanged) {
        break;
      }
    }

    // 4️⃣ Якщо змінилася — вставка нової плитки (2 або 4)
    if (boardChanged) {
      const emptyCells = [];

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (this.board[i][j] === 0) {
            emptyCells.push([i, j]);
          }
        }
      }

      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const [row, col] = emptyCells[randomIndex];

        this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
      }
    }

    // 5️⃣ Перевірка на перемогу (2048)
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    // 6️⃣ Перевірка на доступність ходів
    if (!this.hasMoves()) {
      this.status = 'lose';
    } else if (this.status !== 'win') {
      this.status = 'playing';
    }
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    // 1️⃣ Копія дошки для перевірки змін
    const oldBoard = this.board.map((row) => [...row]);

    // 2️⃣ Проходимо по кожному рядку
    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      let row = this.board[rowIndex];

      row.reverse(); // розгортаємо рядок вправо
      row = row.filter((num) => num !== 0); // видаляємо нулі

      // 3️⃣ Об'єднуємо сусідні плитки
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
          row[i] *= 2;
          this.score += row[i];
          row[i + 1] = 0;
          i++; // пропускаємо наступну плитку
        }
      }

      // 4️⃣ Знову зсуваємо числа після об'єднання
      row = row.filter((num) => num !== 0);

      while (row.length < 4) {
        row.push(0);
      }

      row.reverse(); // повертаємо початковий порядок
      this.board[rowIndex] = row;
    }

    // 5️⃣ Перевірка, чи змінилася дошка
    let boardChanged = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] !== oldBoard[i][j]) {
          boardChanged = true;
          break;
        }
      }

      if (boardChanged) {
        break;
      }
    }

    // 6️⃣ Вставка нової плитки, якщо були зміни
    if (boardChanged) {
      const emptyCells = [];

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (this.board[i][j] === 0) {
            emptyCells.push([i, j]);
          }
        }
      }

      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const [row, col] = emptyCells[randomIndex];

        this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
      }
    }

    // 7️⃣ Перевірка на перемогу або програш
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (!this.hasMoves()) {
      this.status = 'lose';
    } else if (this.status !== 'win') {
      this.status = 'playing';
    }
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    this.board = this.transpose(this.board);
    this.moveLeft();
    this.board = this.transpose(this.board);
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldBoard = this.board.map((row) => [...row]);

    for (let col = 0; col < 4; col++) {
      let column = [];

      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      column.reverse();
      column = column.filter((num) => num !== 0);

      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= 2;
          this.score += column[i];
          column[i + 1] = 0;
          i++;
        }
      }

      column = column.filter((num) => num !== 0);

      while (column.length < 4) {
        column.push(0);
      }

      column.reverse();

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = column[row];
      }
    }

    this.afterMove(oldBoard);
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
    return this.board.map((row) => [...row]);
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
    this.status = 'playing';
    this.score = 0;

    this.board = this.initialState.map((row) => row.slice());

    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);

      let random = Math.random();

      if (random < 0.1) {
        random = 4;
      } else {
        random = 2;
      }

      const [row, col] = emptyCells[randomIndex];

      this.board[row][col] = random;
      emptyCells.splice(randomIndex, 1);
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.score = 0;

    this.board = this.initialState.map((row) => row.slice());
  }

  // Add your own methods here
  hasMoves() {
    // Якщо є порожня клітинка — можна ходити
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }
      }
    }

    // Перевірка горизонтальних злиттів
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (this.board[r][c] === this.board[r][c + 1]) {
          return true;
        }
      }
    }

    // Перевірка вертикальних злиттів
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 3; r++) {
        if (this.board[r][c] === this.board[r + 1][c]) {
          return true;
        }
      }
    }

    return false;
  }

  transpose(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  afterMove(oldBoard) {
    let boardChanged = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] !== oldBoard[i][j]) {
          boardChanged = true;
        }
      }
    }

    if (!boardChanged) {
      return;
    }

    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
    }

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (!this.hasMoves()) {
      this.status = 'lose';
    }
  }
}

module.exports = Game;
