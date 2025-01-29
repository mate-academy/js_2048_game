'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  size = 4;

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.defoltBoard = initialState.map((row) => [...row]);
    this.board = initialState.map((row) => [...row]);
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    if (this.status === 'playing') {
      // eslint-disable-next-line max-len
      const prevBoard = this.board.map((row) => [...row]);

      for (let i = 0; i < this.size; i++) {
        const row = this.board[i];
        // eslint-disable-next-line max-len
        const filteredRow = row.filter((num) => num !== 0);
        const mergedRow = [];

        for (let j = 0; j < filteredRow.length; j++) {
          if (filteredRow[j] === filteredRow[j + 1]) {
            mergedRow.push(filteredRow[j] * 2); // Об'єднуємо два однакові числа
            this.score += filteredRow[j] * 2; // Збільшуємо рахунок
            j++; // Пропускаємо наступне число, оскільки воно вже об'єднане
          } else {
            mergedRow.push(filteredRow[j]);
          }
        }

        // Додаємо нулі, щоб заповнити рядок
        while (mergedRow.length < this.size) {
          mergedRow.push(0);
        }

        this.board[i] = mergedRow; // Оновлюємо рядок у дошці
      }

      // Перевіряємо, чи змінилася дошка
      if (!this.isBoardEqual(prevBoard, this.board)) {
        this.addRandomNumber(); // Додаємо нове число, якщо дошка змінилася
      }
      this.getStatus();
    }
  }
  moveRight() {
    if (this.status === 'playing') {
      const prevBoard = this.board.map((row) => [...row]);

      for (let i = 0; i < this.size; i++) {
        const row = this.board[i];
        const filteredRow = row.filter((num) => num !== 0);
        const mergedRow = [];

        for (let j = filteredRow.length - 1; j >= 0; j--) {
          if (filteredRow[j] === filteredRow[j - 1]) {
            mergedRow.unshift(filteredRow[j] * 2);
            this.score += filteredRow[j] * 2;
            j--;
          } else {
            mergedRow.unshift(filteredRow[j]);
          }
        }

        while (mergedRow.length < this.size) {
          mergedRow.unshift(0);
        }

        this.board[i] = mergedRow;
      }

      if (!this.isBoardEqual(prevBoard, this.board)) {
        this.addRandomNumber();
      }
      this.getStatus();
    }
  }

  moveUp() {
    if (this.status === 'playing') {
      const prevBoard = this.board.map((row) => [...row]);

      for (let col = 0; col < this.size; col++) {
        const filteredColumn = [];

        // Формуємо колону без нулів
        for (let row = 0; row < this.size; row++) {
          if (this.board[row][col] !== 0) {
            filteredColumn.push(this.board[row][col]);
          }
        }

        const mergedColumn = [];

        // Об'єднуємо однакові числа
        for (let i = 0; i < filteredColumn.length; i++) {
          if (filteredColumn[i] === filteredColumn[i + 1]) {
            mergedColumn.push(filteredColumn[i] * 2); // Об'єднання
            this.score += filteredColumn[i] * 2; // Оновлюємо рахунок
            i++; // Пропускаємо наступне число
          } else {
            mergedColumn.push(filteredColumn[i]);
          }
        }

        // Додаємо нулі в кінець колони
        while (mergedColumn.length < this.size) {
          mergedColumn.push(0);
        }

        // Оновлюємо значення в дошці
        for (let row = 0; row < this.size; row++) {
          this.board[row][col] = mergedColumn[row];
        }
      }

      // Перевіряємо, чи змінилася дошка
      if (!this.isBoardEqual(prevBoard, this.board)) {
        this.addRandomNumber();
      }
      this.getStatus();
    }
  }

  moveDown() {
    if (this.status === 'playing') {
      // eslint-disable-next-line max-len
      const prevBoard = this.board.map((row) => [...row]); // Копіюємо дошку перед змінами

      for (let col = 0; col < this.size; col++) {
        const filteredColumn = [];

        // Формуємо колону без нулів
        for (let row = this.size - 1; row >= 0; row--) {
          if (this.board[row][col] !== 0) {
            filteredColumn.unshift(this.board[row][col]);
          }
        }

        const mergedColumn = [];

        // Об'єднуємо однакові числа
        for (let i = filteredColumn.length - 1; i >= 0; i--) {
          if (filteredColumn[i] === filteredColumn[i - 1]) {
            mergedColumn.unshift(filteredColumn[i] * 2); // Об'єднання
            this.score += filteredColumn[i] * 2; // Оновлюємо рахунок
            i--; // Пропускаємо наступне число
          } else {
            mergedColumn.unshift(filteredColumn[i]);
          }
        }

        // Додаємо нулі на початок колони
        while (mergedColumn.length < this.size) {
          mergedColumn.unshift(0);
        }

        // Оновлюємо значення в дошці
        for (let row = 0; row < this.size; row++) {
          this.board[row][col] = mergedColumn[row];
        }
      }

      // Перевіряємо, чи змінилася дошка
      if (!this.isBoardEqual(prevBoard, this.board)) {
        this.addRandomNumber(); // Додаємо нове число, якщо дошка змінилася
      }
      this.getStatus();
    }
  }
  isBoardEqual(board1, board2) {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (board1[i][j] !== board2[i][j]) {
          return false; // Якщо знайдено відмінність, дошки різні
        }
      }
    }

    return true; // Якщо жодної відмінності немає, дошки однакові
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
   */
  getStatus() {
    if (this.status === 'playing') {
      this.canmoves();
    }

    return this.status;
  }

  canmoves() {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 2048) {
          this.status = 'win';

          return this.status;
        }
      }
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          this.status = 'playing';

          return this.status;
        }
      }
    }

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size - 1; j++) {
        if (this.board[i][j] === this.board[i][j + 1]) {
          this.status = 'playing'; // Є можливість об'єднання по горизонталі

          return this.status;
        }
      }
    }

    for (let i = 0; i < this.size - 1; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === this.board[i + 1][j]) {
          this.status = 'playing';

          return this.status;
        }
      }
    }

    this.status = 'lose';

    return this.status;
  }

  /**
   * Starts the game.
   */
  start(elements) {
    this.status = 'playing';
    this.addRandomNumber();
    this.addRandomNumber();
    this.updateBoard(elements);
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle'; // Ставимо статус гри в "idle".
    // eslint-disable-next-line max-len
    this.board = this.defoltBoard.map((row) => [...row]); // Відновлюємо початковий стан.
    this.score = 0; // Скидаємо рахунок.

    return this.board;
  }

  addRandomNumber() {
    const emptyCells = [];

    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [x, y] = emptyCells[randomIndex];

      this.board[x][y] = this.generateRandomNumber();
    }
  }

  generateRandomNumber() {
    return Math.random() < 0.1 ? 4 : 2;
  }

  updateBoard(elements) {
    if (elements) {
      Array.from(elements).forEach((el, index) => {
        const row = Math.floor(index / this.size);
        const col = index % this.size;

        this.board[row][col] = parseInt(el.textContent) || 0;
      });
    }
  }
}

module.exports = Game;
