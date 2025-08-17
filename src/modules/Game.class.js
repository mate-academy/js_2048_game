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
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle'; // 'playing', 'win', 'lose'
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const original = this.board[row];
      const compressed = original.filter((v) => v !== 0); // прибираємо нулі
      const newRow = [];

      for (let i = 0; i < compressed.length; i++) {
        if (compressed[i] === compressed[i + 1]) {
          const merged = compressed[i] * 2;

          this.score += merged;
          newRow.push(merged);
          i++; // пропускаємо наступний, бо вже злився
          moved = true;
        } else {
          newRow.push(compressed[i]);
        }
      }

      // додаємо нулі справа
      while (newRow.length < 4) {
        newRow.push(0);
      }

      // перевіряємо, чи рядок змінився
      for (let col = 0; col < 4; col++) {
        if (newRow[col] !== original[col]) {
          moved = true;
        }
      }

      this.board[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
      this.renderBoard();

      if (!this.checkWin()) {
        this.checkGameOver();
      }
    }
  }

  moveRight() {
    let moved = false;

    for (let row = 0; row < 4; row++) {
      const original = this.board[row];
      const compressed = original.filter((v) => v !== 0); // без нулів
      const newRow = [];

      // йдемо справа наліво
      for (let i = compressed.length - 1; i >= 0; i--) {
        if (compressed[i] === compressed[i - 1]) {
          const merged = compressed[i] * 2;

          this.score += merged;
          newRow.unshift(merged); // додаємо зліва в новий ряд
          i--; // пропускаємо вже злитий
          moved = true;
        } else {
          newRow.unshift(compressed[i]);
        }
      }

      // добиваємо нулями зліва
      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      // перевіряємо, чи змінилось поле
      for (let col = 0; col < 4; col++) {
        if (newRow[col] !== original[col]) {
          moved = true;
        }
      }

      this.board[row] = newRow;
    }

    if (moved) {
      this.addRandomTile();
      this.renderBoard();

      if (!this.checkWin()) {
        this.checkGameOver();
      }
    }
  }
  moveUp() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      // зібрати колонку
      const original = [];

      for (let row = 0; row < 4; row++) {
        original.push(this.board[row][col]);
      }

      // прибрати нулі
      const compressed = original.filter((v) => v !== 0);
      const newCol = [];

      // обробка злиття
      for (let i = 0; i < compressed.length; i++) {
        if (compressed[i] === compressed[i + 1]) {
          const merged = compressed[i] * 2;

          this.score += merged;
          newCol.push(merged);
          i++; // пропустили вже злитий
          moved = true;
        } else {
          newCol.push(compressed[i]);
        }
      }

      // додаємо нулі вниз
      while (newCol.length < 4) {
        newCol.push(0);
      }

      // записуємо назад у board + перевірка змін
      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newCol[row]) {
          moved = true;
        }
        this.board[row][col] = newCol[row];
      }
    }

    if (moved) {
      this.addRandomTile();
      this.renderBoard();

      if (!this.checkWin()) {
        this.checkGameOver();
      }
    }
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < 4; col++) {
      // зібрати колонку (зверху вниз)
      const original = [];

      for (let row = 0; row < 4; row++) {
        original.push(this.board[row][col]);
      }

      // прибрати нулі
      const compressed = original.filter((v) => v !== 0);
      const newCol = [];

      // обробка злиття — йдемо знизу вгору
      for (let i = compressed.length - 1; i >= 0; i--) {
        if (compressed[i] === compressed[i - 1]) {
          const merged = compressed[i] * 2;

          this.score += merged;
          newCol.unshift(merged); // вставляємо вниз
          i--; // пропустили вже злитий
          moved = true;
        } else {
          newCol.unshift(compressed[i]);
        }
      }

      // додаємо нулі зверху
      while (newCol.length < 4) {
        newCol.unshift(0);
      }

      // записуємо назад у board + перевіряємо зміни
      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== newCol[row]) {
          moved = true;
        }
        this.board[row][col] = newCol[row];
      }
    }

    if (moved) {
      this.addRandomTile();
      this.renderBoard();

      if (!this.checkWin()) {
        this.checkGameOver();
      }
    }
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
   * Starts the game.
   */
  start() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'playing';

    for (let i = 0; i < 2; i++) {
      const emptyCells = [];

      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          if (this.board[row][col] === 0) {
            emptyCells.push([row, col]);
          }
        }
      }

      if (emptyCells.length === 0) {
        return;
      }

      const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
    this.renderBoard();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  renderBoard() {
    const cells = document.querySelectorAll('.field-cell');

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const index = row * 4 + col;
        const value = this.board[row][col];
        const cell = cells[index];

        cell.textContent = value === 0 ? '' : value;

        cell.className = 'field-cell';

        if (value) {
          cell.classList.add(`field-cell--${value}`);
        }
      }
    }

    document.querySelector('.game-score').textContent = this.score;
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';
          document.querySelector('.message-win').classList.remove('hidden');

          return true;
        }
      }
    }

    return false;
  }

  checkGameOver() {
    // якщо є хоча б одна порожня клітинка → ще не кінець
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }
      }
    }

    // якщо можна зробити злиття → ще не кінець
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const value = this.board[row][col];

        if (
          (col < 3 && this.board[row][col + 1] === value) ||
          (row < 3 && this.board[row + 1][col] === value)
        ) {
          return false;
        }
      }
    }

    // інакше — поразка
    this.status = 'lose';
    document.querySelector('.message-lose').classList.remove('hidden');

    return true;
  }

  // Add your own methods here
}

module.exports = Game;
