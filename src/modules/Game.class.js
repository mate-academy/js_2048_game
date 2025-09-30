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
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
    this.score = 0;

    this.board = initialState
      ? initialState.map((row) => [...row]) // копія переданого стану
      : Array.from({ length: 4 }, () => Array(4).fill(0)); // порожнє поле
  }

  moveLeft() {
    this.horizontalMove('left');
  }

  moveRight() {
    this.horizontalMove('right');
  }
  moveUp() {
    this.verticalMove('up');
  }
  moveDown() {
    this.verticalMove('down');
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
    return this.board.map((row) => [...row]); // повертаємо копію стану
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
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomCube();
      this.addRandomCube();
    }
  }

  /**
   * Resets the game.
   */
  restart() {
    this.status = 'idle';
    this.score = 0;
    this.board = Array.from({ length: 4 }, () => Array(4).fill(0));
    this.start();
  }

  // Add your own methods here

  addRandomCube() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
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

  verticalMove(direction) {
    if (this.status === 'playing') {
      let moved = false;

      for (let col = 0; col < 4; col++) {
        let column = []; // збираємо колонку

        for (let row = 0; row < 4; row++) {
          column.push(this.board[row][col]);
        }

        // видаляємо нулі
        column = column.filter((num) => num !== 0);

        if (direction === 'up') {
          for (let row = 0; row < column.length - 1; row++) {
            if (column[row] === column[row + 1]) {
              column[row] *= 2; // об'єднуємо кубики
              this.score += column[row]; // оновлюємо рахунок
              column[row + 1] = 0; // видаляємо об'єднаний кубик
            }
          }
        } else if (direction === 'down') {
          for (let row = column.length - 1; row > 0; row--) {
            if (column[row] === column[row - 1]) {
              column[row] *= 2;
              this.score += column[row];
              column[row - 1] = 0;
            }
          }
        }

        // видаляємо нулі після об'єднання
        column = column.filter((num) => num !== 0);

        if (direction === 'up') {
          while (column.length < 4) {
            column.push(0); // додаємо нулі в кінець колонки
          }
        } else if (direction === 'down') {
          while (column.length < 4) {
            column.unshift(0); // додаємо нулі на початок колонки
          }
        }

        for (let row = 0; row < 4; row++) {
          if (!moved && this.board[row][col] !== column[row]) {
            moved = true; // перевіряємо, чи були зміни
          }
          this.board[row][col] = column[row]; // оновлюємо колонку на дошці
        }
      }

      if (moved) {
        this.addRandomCube(); // додаємо новий кубик, якщо були зміни
      }

      // Перевірка на виграш
      if (this.board.some((row) => row.includes(2048))) {
        this.status = 'win';
      }

      // Перевірка на поразку
      if (this.isGameOver()) {
        this.status = 'lose';
      }
    }
  }

  horizontalMove(direction) {
    if (this.status === 'playing') {
      let moved = false;

      for (let row = 0; row < 4; row++) {
        // видаляємо нулі
        let newRow = this.board[row].filter((num) => num !== 0);

        if (direction === 'left') {
          for (let col = 0; col < newRow.length - 1; col++) {
            if (newRow[col] === newRow[col + 1]) {
              newRow[col] *= 2; // об'єднуємо кубики
              this.score += newRow[col]; // оновлюємо рахунок
              newRow[col + 1] = 0; // видаляємо об'єднаний кубик
            }
          }
        } else if (direction === 'right') {
          for (let col = newRow.length - 1; col > 0; col--) {
            if (newRow[col] === newRow[col - 1]) {
              newRow[col] *= 2;
              this.score += newRow[col];
              newRow[col - 1] = 0;
            }
          }
        }

        // видаляємо нулі після об'єднання
        newRow = newRow.filter((num) => num !== 0);

        if (direction === 'left') {
          while (newRow.length < 4) {
            newRow.push(0); // додаємо нулі в кінець рядка
          }
        } else if (direction === 'right') {
          while (newRow.length < 4) {
            newRow.unshift(0); // додаємо нулі на початок рядка
          }
        }

        if (
          !moved &&
          !this.board[row].every((val, idx) => val === newRow[idx])
        ) {
          moved = true; // перевіряємо, чи були зміни
        }

        this.board[row] = newRow; // оновлюємо рядок на дошці
      }

      if (moved) {
        this.addRandomCube(); // додаємо новий кубик, якщо були зміни
      }

      // Перевірка на виграш
      if (this.board.some((row) => row.includes(2048))) {
        this.status = 'win';
      }

      // Перевірка на поразку
      if (this.isGameOver()) {
        this.status = 'lose';
      }
    }
  }

  isGameOver() {
    // Перевірка на наявність порожніх клітинок
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }

        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return false;
        }

        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return false;
        }
      }
    }

    return true; // немає ходів
  }
}

module.exports = Game;
// export default Game;
