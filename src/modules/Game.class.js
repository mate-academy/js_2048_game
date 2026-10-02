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
  constructor(initialState = null) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';

    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    const rows = this.getState(); // метод getState() вертає поле гри
    const oldBoard = this.board.map((row) => [...row]);

    for (let i = 0; i < this.getState().length; i++) {
      const row = rows[i]; // отримуємо поточний рядок
      let newRow = row.filter((cell) => cell !== 0); // видаляємо нулі з рядка

      for (let j = 0; j < newRow.length - 1; j++) {
        if (newRow[j] === newRow[j + 1]) {
          newRow[j] *= 2; // подвоюємо значення клітинки
          newRow[j + 1] = 0; // встановлюємо наступну клітинку в 0
          this.score += newRow[j];
          // додаємо до рахунку значення об'єднаної клітинки
          j++; // пропускаємо клітинку бо вона = 0
        }
      }

      newRow = newRow.filter((cell) => cell !== 0);
      // видаляємо нулі після об'єднання клітинок

      while (newRow.length < row.length) {
        newRow.push(0); // додаємо нулі в кінець рядка, щоб зберегти довжину
      }
      rows[i] = newRow; // оновлюємо рядок у масиві rows
    }

    if (this.hasBoardChanged(oldBoard)) {
      this.board = rows;
      this.addRandomCell();
      this.render();
    }

    this.isWinning();
  }

  moveRight() {
    const rows = this.getState();
    const oldBoard = this.board.map((row) => [...row]);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      let newRow = row.filter((cell) => cell !== 0);

      for (let j = newRow.length - 1; j >= 0; j--) {
        if (newRow[j] === newRow[j - 1]) {
          newRow[j] *= 2;
          newRow[j - 1] = 0;
          this.score += newRow[j];
          j--;
        }
      }

      newRow = newRow.filter((cell) => cell !== 0);

      while (newRow.length < row.length) {
        newRow.unshift(0);
      }
      rows[i] = newRow;
    }

    if (this.hasBoardChanged(oldBoard)) {
      this.board = rows;
      this.addRandomCell();
      this.render();
    }

    this.isWinning();
  }

  moveUp() {
    const rows = this.getState();
    const oldBoard = this.board.map((row) => [...row]);

    for (let j = 0; j < rows[0].length; j++) {
      const col = rows.map((row) => row[j]);
      let newCol = col.filter((cell) => cell !== 0);

      for (let i = 0; i < newCol.length - 1; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          newCol[i + 1] = 0;
          this.score += newCol[i];
          i++;
        }
      }

      newCol = newCol.filter((cell) => cell !== 0);

      while (newCol.length < rows.length) {
        newCol.push(0);
      }

      for (let i = 0; i < rows.length; i++) {
        rows[i][j] = newCol[i];
      }
    }

    if (this.hasBoardChanged(oldBoard)) {
      this.board = rows;
      this.addRandomCell();
      this.render();
    }

    this.isWinning();
  }

  moveDown() {
    const rows = this.getState();
    const oldBoard = this.board.map((row) => [...row]);

    for (let j = 0; j < rows[0].length; j++) {
      const col = rows.map((row) => row[j]);
      let newCol = col.filter((cell) => cell !== 0);

      for (let i = newCol.length - 1; i >= 0; i--) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] *= 2;
          newCol[i + 1] = 0;
          this.score += newCol[i];
          i--;
        }
      }

      newCol = newCol.filter((cell) => cell !== 0);

      while (newCol.length < rows.length) {
        newCol.unshift(0);
      }

      for (let i = 0; i < rows.length; i++) {
        rows[i][j] = newCol[i];
      }
    }

    if (this.hasBoardChanged(oldBoard)) {
      this.board = rows;
      this.addRandomCell();
      this.render();
    }

    this.isWinning();
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
    this.status = 'playing';
    this.addRandomCell();
    this.addRandomCell();
    this.render();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.start();
  }

  // Add your own methods here
  addRandomCell() {
    const emptyCells = [];

    for (let mainRow = 0; mainRow < this.board.length; mainRow++) {
      for (let mainCol = 0; mainCol < this.board[mainRow].length; mainCol++) {
        if (this.board[mainRow][mainCol] === 0) {
          emptyCells.push([mainRow, mainCol]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomCell = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomCell];

    const randomValue = Math.random() < 0.9 ? 2 : 4;

    this.board[row][col] = randomValue;
  }

  render() {
    const field = [...document.querySelectorAll('.field-row')].map((row) => {
      return [...row.querySelectorAll('.field-cell')];
    });

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        const value = this.board[row][col];
        // тут змінюєш відповідну DOM-клітинку
        const cell = field[row][col];

        cell.textContent = '';
        cell.className = 'field-cell';

        if (value !== 0) {
          cell.textContent = value;
          cell.classList.add(`field-cell--${value}`);
        }
      }
    }
  }

  isWinning() {
    const allValues = [];

    for (const row of this.board) {
      for (const value of row) {
        allValues.push(value);
      }
    }

    if (allValues.includes(2048)) {
      this.status = 'win';
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  hasBoardChanged(oldBoard) {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (oldBoard[row][col] !== this.board[row][col]) {
          return true;
        }
      }
    }

    return false;
  }

  canMove() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        const current = this.board[row][col];

        if (current === 0) {
          return true;
        }

        if (
          col < this.board[row].length - 1 &&
          current === this.board[row][col + 1]
        ) {
          return true;
        }

        if (
          row < this.board.length - 1 &&
          current === this.board[row + 1][col]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
