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
    this.board = initialState;
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
      this.render();

      const button = document.querySelector('.button');

      if (button) {
        button.textContent = 'Restart';
      }
    }
  }

  restart() {
    this.hideMessage();

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';

    const scoreElement = document.querySelector('.game-score');

    if (scoreElement) {
      scoreElement.textContent = this.score;
    }

    this.render();
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let totalPoints = 0;
    let boardChanged = false;

    // Этап 1: Сдвиг плиток
    for (let r = 0; r < 4; r++) {
      const { newRow, points, changed } = this.slideAndMerge(this.board[r]);

      if (changed) {
        this.board[r] = newRow;
        totalPoints += points;
        boardChanged = true;
      }
    }

    // Если произошли изменения (сдвиг или объединение), добавляем новую плитку
    if (boardChanged) {
      this.addRandomTile();
      this.render();
      this.updateScore(totalPoints);
      this.checkGameOver();
    }
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let totalPoints = 0;
    let boardChanged = false;

    // Этап 1: Сдвиг плиток
    for (let r = 0; r < 4; r++) {
      const reversedRow = [...this.board[r]].reverse();
      const { newRow, points, changed } = this.slideAndMerge(reversedRow);

      if (changed) {
        this.board[r] = newRow.reverse();
        totalPoints += points;
        boardChanged = true;
      }
    }

    // Если произошли изменения (сдвиг или объединение), добавляем новую плитку
    if (boardChanged) {
      this.addRandomTile();
      this.render();
      this.updateScore(totalPoints);
      this.checkGameOver();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let totalPoints = 0;
    let boardChanged = false;

    // Этап 1: Сдвиг плиток
    for (let col = 0; col < 4; col++) {
      const column = [];

      // Собираем все плитки в колонке, исключая нули
      for (let row = 0; row < 4; row++) {
        column.push(this.board[row][col]);
      }

      // Применяем метод slideAndMerge для этой колонки
      const { newRow, points, changed } = this.slideAndMerge(column);

      // Если произошло изменение (сдвиг или объединение), обновляем колонку
      if (changed) {
        totalPoints += points;
        boardChanged = true;

        for (let row = 0; row < 4; row++) {
          this.board[row][col] = newRow[row];
        }
      }
    }

    // Если произошли изменения, добавляем новую плитку
    if (boardChanged) {
      this.addRandomTile();
      this.render();
      this.updateScore(totalPoints);
      this.checkGameOver();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let totalPoints = 0;
    let boardChanged = false;

    // Этап 1: Сдвиг плиток
    for (let col = 0; col < 4; col++) {
      const column = [];

      // Собираем все плитки в колонке (перевернутый порядок)
      for (let row = 3; row >= 0; row--) {
        column.push(this.board[row][col]);
      }

      // Применяем метод slideAndMerge для этой колонки
      const { newRow, points, changed } = this.slideAndMerge(column);

      if (changed) {
        totalPoints += points;
        boardChanged = true;

        for (let row = 0; row < 4; row++) {
          this.board[3 - row][col] = newRow[row];
        }
      }
    }

    // Если произошли изменения, добавляем новую плитку
    if (boardChanged) {
      this.addRandomTile();
      this.render();
      this.updateScore(totalPoints);
      this.checkGameOver();
    }
  }

  updateScore(points) {
    this.score += points;

    const scoreElement = document.querySelector('.game-score');

    if (scoreElement) {
      scoreElement.textContent = this.score;
    }
  }

  transposeBoard() {
    const newBoard = [];

    for (let col = 0; col < this.board[0].length; col++) {
      const newRow = [];

      for (let row = 0; row < this.board.length; row++) {
        newRow.push(this.board[row][col]);
      }
      newBoard.push(newRow);
    }
    this.board = newBoard;
  }

  addRandomTile() {
    const emptCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          emptCells.push([r, c]);
        }
      }
    }

    if (emptCells.length === 0) {
      return;
    }

    const [row, col] = emptCells[Math.floor(Math.random() * emptCells.length)];

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;

    if (this.board.flat().includes(2048)) {
      this.status = 'win';
      this.showMessage('You won!');
    }
    this.checkGameOver();
  }

  slideAndMerge(row) {
    const newRow = row.filter((val) => val !== 0);
    let points = 0;
    let changed = false; // Флаг для отслеживания изменений

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        points += newRow[i];
        newRow.splice(i + 1, 1);
        changed = true; // Объединение плиток считается изменением
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    if (newRow.join('') !== row.join('')) {
      changed = true;
    }

    return { newRow, points, changed };
  }

  isGameOver() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) {
          return false;
        }

        if (
          (c < 3 && this.board[r][c] === this.board[r][c + 1]) ||
          (r < 3 && this.board[r][c] === this.board[r + 1][c])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  checkGameOver() {
    if (this.isGameOver() === true) {
      this.status = 'lose';
      this.showMessage('Game Over!');
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  render() {
    const cells = document.querySelectorAll('.field-cell');
    let index = 0;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const cell = cells[index];
        const value = this.board[r][c];

        if (cell) {
          cell.innerHTML = value || '';
          cell.className = `field-cell ${value ? `field-cell--${value}` : ''}`;
          index++;
        }
      }
    }
  }

  showMessage(message) {
    const messageElement = document.querySelector('.game-message');

    if (messageElement) {
      messageElement.textContent = message;
      messageElement.style.display = 'block';
    }
  }

  hideMessage() {
    const messageElement = document.querySelector('.game-message');

    if (messageElement) {
      messageElement.style.display = 'none';
    }
  }
}

module.exports = Game;
