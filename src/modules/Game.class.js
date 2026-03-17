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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState.map((row) => [...row]);
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    let moved = false; // чи змінився рядок

    for (let i = 0; i < this.board.length; i++) {
      const result = this.mergeRow(this.board[i]);

      // перевіряємо, чи рядок змінився
      if (this.board[i].toString() !== result.newRow.toString()) {
        moved = true;
      }

      this.board[i] = result.newRow; // оновлюємо рядок
      this.score += result.score; // додаємо очки
    }

    // якщо був рух, додаємо випадкову плитку
    if (moved) {
      this.addRandomTile();
    }

    // перевірка на виграш
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    }

    // перевірка на поразку (немає ходів і порожніх клітин)
    if (!this.board.flat().includes(0) && !this.canMove()) {
      this.status = 'lose';
    }
  }
  moveRight() {
    let moved = false;

    for (let i = 0; i < this.board.length; i++) {
      const reversedRow = [...this.board[i]].reverse();
      const result = this.mergeRow(reversedRow);
      const newRow = result.newRow.reverse();

      if (this.board[i].toString() !== newRow.toString()) {
        moved = true;
      }

      this.board[i] = newRow;
      this.score += result.score;
    }

    if (moved) {
      this.addRandomTile();
    }

    // перевірка на виграш
    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    }

    // перевірка на поразку (немає ходів і порожніх клітин)
    if (!this.board.flat().includes(0) && !this.canMove()) {
      this.status = 'lose';
    }
  }
  moveUp() {
    let moved = false;

    for (let j = 0; j < 4; j++) {
      // перебираємо колонки
      const column = [];

      for (let i = 0; i < 4; i++) {
        column.push(this.board[i][j]);
      }

      const result = this.mergeRow(column);

      // перевірка, чи змінилася колонка
      if (column.toString() !== result.newRow.toString()) {
        moved = true;
      }

      for (let i = 0; i < 4; i++) {
        this.board[i][j] = result.newRow[i];
      }
      this.score += result.score;
    }

    if (moved) {
      this.addRandomTile();
    }

    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    }

    if (!this.board.flat().includes(0) && !this.canMove()) {
      this.status = 'lose';
    }
  }
  moveDown() {
    let moved = false;

    for (let j = 0; j < 4; j++) {
      // перебираємо колонки
      const column = [];

      for (let i = 0; i < 4; i++) {
        column.push(this.board[i][j]);
      }

      column.reverse(); // перевертаємо для руху вниз

      const result = this.mergeRow(column);

      result.newRow.reverse(); // повертаємо назад

      // перевірка, чи змінилася колонка
      if (column.reverse().toString() !== result.newRow.toString()) {
        moved = true;
      }

      for (let i = 0; i < 4; i++) {
        this.board[i][j] = result.newRow[i];
      }
      this.score += result.score;
    }

    if (moved) {
      this.addRandomTile();
    }

    if (this.board.flat().includes(2048)) {
      this.status = 'win';
    }

    if (!this.board.flat().includes(0) && !this.canMove()) {
      this.status = 'lose';
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
    this.score = 0;
    this.board = this.initialState.map((row) => [...row]);
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;
    this.board = this.initialState.map((row) => [...row]);
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return false;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    const [row, col] = randomCell;

    const value = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = value;
  }

  mergeRow(row) {
    let newRow = row.filter((n) => n !== 0); // непорожні
    let score = 0;

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2; // об’єднуємо
        score += newRow[i]; // додаємо до рахунку
        newRow[i + 1] = 0; // наступний стає 0, щоб не об’єднувати двічі
      }
    }

    newRow = newRow.filter((n) => n !== 0); // зрушуємо після об’єднання

    while (newRow.length < 4) {
      newRow.push(0);
    } // додаємо нулі справа

    return { newRow, score };
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      // рядки
      for (let j = 0; j < 3; j++) {
        // горизонтально

        if (this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    for (let j = 0; j < 4; j++) {
      // колонки
      for (let i = 0; i < 3; i++) {
        if (this.board[i][j] === this.board[i + 1][j]) {
          return true;
        } // вертикально
      }
    }

    return false; // ходів немає
  }

  // canMove() {
  //   for (let i = 0; i < 4; i++) {
  //     // рядки
  //     for (let j = 0; j < 3; j++) {
  //       // горизонтально

  //       if (this.board[i][j] === this.board[i][j + 1]) {
  //         return true;
  //       }
  //     }
  //   }

  //   for (let j = 0; j < 4; j++) {
  //     // колонки
  //     for (let i = 0; i < 3; i++) {
  //       if (this.board[i][j] === this.board[i + 1][j]) {
  //         return true;
  //       } // вертикально
  //     }
  //   }

  //   return false; // ходів немає
  // }
}

module.exports = Game;
