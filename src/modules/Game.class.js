/* eslint-disable function-paren-newline */
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
    this.size = 4;
    this.score = 0;
    this.status = 'idle';

    if (initialState) {
      this.board = initialState;
    } else {
      this.board = this.createEmptyBoard();
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  // створення порожнього поля 4x4
  createEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  // додавання випадкового числа 2/4
  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { row, col } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  // Функція для руху плиток в один напрямок
  moveLeft() {
    const newBoard = this.createEmptyBoard();

    // eslint-disable-next-line function-paren-newline
    const merged = Array.from({ length: this.size }, () =>
      Array(this.size).fill(false),
    );

    const moveRow = (row, rowIndex) => {
      const tiles = row.filter((value) => value !== 0);
      const newRow = [];
      let i = 0;

      while (i < tiles.length) {
        if (
          i + 1 < tiles.length &&
          tiles[i] === tiles[i + 1] &&
          !merged[rowIndex][i] &&
          !merged[rowIndex][i + 1]
        ) {
          newRow.push(tiles[i] * 2);
          this.score += tiles[i] * 2;
          merged[rowIndex][i] = true;
          merged[rowIndex][i + 1] = true;
          i += 2;
        } else {
          newRow.push(tiles[i]);
          i++;
        }
      }

      while (newRow.length < this.size) {
        newRow.push(0);
      }

      return newRow;
    };

    for (let rowIndex = 0; rowIndex < this.size; rowIndex++) {
      newBoard[rowIndex] = moveRow(this.board[rowIndex], rowIndex);
    }

    this.board = newBoard;
    this.addRandomTile();
  }

  moveRight() {
    this.board = this.board.map((row) => row.reverse()); // Перевертаємо рядки
    this.moveLeft();
    this.board = this.board.map((row) => row.reverse()); // Перевертаємо назад
  }

  moveUp() {
    // Трансформуємо стовпці в рядки
    this.board = this.transposeBoard();
    this.moveLeft();
    this.board = this.transposeBoard(); // Трансформуємо назад
  }

  moveDown() {
    // Трансформуємо стовпці в рядки, перевертаємо, рухаємо, перевертаємо назад
    this.board = this.transposeBoard().map((row) => row.reverse());
    this.moveLeft();
    this.board = this.transposeBoard().map((row) => row.reverse());
  }

  // Трансформуємо стовпці в рядки
  transposeBoard() {
    return this.board[0].map((_, colIndex) =>
      this.board.map((row) => row[colIndex]),
    );
  }

  // Перевірка, чи є можливість рухатися
  canMove() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 0) {
          return true; // Є порожнє місце, можна рухатись
        }

        // Перевірка на злиття плиток
        if (
          row + 1 < this.size &&
          this.board[row][col] === this.board[row + 1][col]
        ) {
          return true;
        }

        if (
          col + 1 < this.size &&
          this.board[row][col] === this.board[row][col + 1]
        ) {
          return true;
        }
      }
    }

    return false; // Якщо немає можливості рухатися
  }

  // Перевірка, чи програна гра
  checkLose() {
    return !this.canMove(); // Якщо немає можливості рухатися, гра програна
  }

  // Оновлення статусу гри
  updateStatus() {
    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.checkLose()) {
      this.status = 'lose';
    } else {
      this.status = 'playing';
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
    this.status = 'playing'; // Оновлюємо статус гри на 'playing'
    this.score = 0; // Скидаємо рахунок на початок гри
    this.board = this.createEmptyBoard(); // Створюємо нову порожню дошку
    this.addRandomTile(); // Додаємо першу плитку
    this.addRandomTile(); // Додаємо другу плитку}
  }
  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle'; // Оновлюємо статус гри на 'idle' (гра не почалась)
    this.score = 0; // Скидаємо рахунок
    this.board = this.createEmptyBoard(); // Створюємо нову порожню дошку
    this.addRandomTile(); // Додаємо першу плитку
    this.addRandomTile(); // Додаємо другу плитку
  }

  getTileClass(value) {
    switch (value) {
      case 2:
        return 'field-cell--2';
      case 4:
        return 'field-cell--4';
      case 8:
        return 'field-cell--8';
      case 16:
        return 'field-cell--16';
      case 32:
        return 'field-cell--32';
      case 64:
        return 'field-cell--64';
      case 128:
        return 'field-cell--128';
      case 256:
        return 'field-cell--256';
      case 512:
        return 'field-cell--512';
      case 1024:
        return 'field-cell--1024';
      case 2048:
        return 'field-cell--2048';
      default:
        return 'field-cell'; // Для значень, що не входять в перелік
    }
  }

  checkWin() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        if (this.board[row][col] === 2048) {
          return true;
        }
      }
    }

    return false;
  }
}
