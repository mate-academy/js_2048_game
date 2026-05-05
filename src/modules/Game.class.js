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
    // Якщо ми передаємо готове поле , використовуємо його.
    // Інакше створюємо порожнє поле 4x4.
    this.score = 0;
    this.status = 'idle';

    this.field = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  // --- МЕТОДИ РУХУ ---

  moveLeft() {
    let moved = false;

    this.field = this.field.map((row) => {
      const filteredRow = row.filter((item) => item !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow.splice(i + 1, 1);

          if (filteredRow[i] === 2048) {
            this.status = 'win'; // Ми виграли! 🏆
          }
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.push(0);
      }

      if (JSON.stringify(row) !== JSON.stringify(filteredRow)) {
        moved = true;
      }

      return filteredRow;
    });

    if (moved) {
      this.addRandomTile();
      this.checkGameOver();
    }

    return moved;
  }

  moveRight() {
    let moved = false;

    this.field = this.field.map((row) => {
      const filteredRow = row.filter((item) => item !== 0);

      for (let i = filteredRow.length - 2; i >= 0; i--) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i + 1] *= 2;
          this.score += filteredRow[i + 1];
          filteredRow.splice(i, 1);

          if (filteredRow[i] === 2048) {
            this.status = 'win';
          }
        }
      }

      while (filteredRow.length < 4) {
        filteredRow.unshift(0);
      }

      if (JSON.stringify(row) !== JSON.stringify(filteredRow)) {
        moved = true;
      }

      return filteredRow;
    });

    if (moved) {
      this.addRandomTile();
      this.checkGameOver();
    }

    return moved;
  }

  moveUp() {
    this.field = this.transpose();

    const moved = this.moveLeft();

    this.field = this.transpose();

    return moved;
  }

  moveDown() {
    this.field = this.transpose();

    const moved = this.moveRight();

    this.field = this.transpose();

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
    return this.field;
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
    this.addRandomTile();
    this.addRandomTile();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.score = 0;

    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.start();
  }
  // --- ДОПОМІЖНІ МЕТОДИ ---

  // Виправляємо помилку function-paren-newline тут 👇
  // transpose() {
  //    return this.field[0].map((_, colIndex) =>
  //      this.field.map((row) => row[colIndex]),
  //    );
  //  }

  transpose() {
    const result = [];

    for (let i = 0; i < this.field.length; i++) {
      const row = [];

      for (let j = 0; j < this.field.length; j++) {
        row.push(this.field[j][i]);
      }
      result.push(row);
    }

    return result;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.field[i][j] === 0) {
          emptyCells.push({ x: i, y: j });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { x, y } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.field[x][y] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  isFieldFull() {
    return this.field.every((row) => row.every((cell) => cell !== 0));
  }

  isHasMoves() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.field[i][j];

        if (j < 3 && current === this.field[i][j + 1]) {
          return true;
        }

        if (i < 3 && current === this.field[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  checkGameOver() {
    if (this.isFieldFull() && !this.isHasMoves()) {
      this.status = 'lose'; // Гра закінчена
    }
  }
}

export { Game };
