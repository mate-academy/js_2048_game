'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState) {
    this.board = initialState || this._generateEmptyBoard();
    this.score = 0;
    this.status = 'idle'; // 'idle', 'playing', 'win', 'lose'
  }
  /*
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */

  // генерація первинної пустої дошки для гри
  _generateEmptyBoard() {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  // основний метод для переміщення
  moveLeft() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      const line = this.board[i];
      const newLine = this._slideAndMerge(line);

      // перевірка чи змінилась дошка
      if (newLine.join('') !== line.join('')) {
        moved = true;
      }
      this.board[i] = newLine;
    }

    // якщо була зміщена лінія, то додається
    // рандомна плитка та перевіряється статус гри
    if (moved) {
      this._addRandomTile();
      this._checkGameStatus();
    }
  }

  moveRight() {
    this.board = this.board.map((row) => row.reverse()); // обертаємо дошку
    this.moveLeft();
    this.board = this.board.map((row) => row.reverse());
  }

  moveUp() {
    // eslint-disable-next-line max-len
    this._transposeBoard(); // транспонуємо матрицю, щоб використати метод moveLeft
    this.moveLeft();
    this._transposeBoard();
  }

  moveDown() {
    this._transposeBoard();
    this.board = this.board.map((row) => row.reverse());
    this.moveLeft();
    this.board = this.board.map((row) => row.reverse());
    this._transposeBoard();
  }

  // метод для зсуву і злиття комірок
  _slideAndMerge(line) {
    let newLine = line.filter((val) => val); // видаляємо нулі

    for (let i = 0; i < newLine.length - 1; i++) {
      if (newLine[i] === newLine[i + 1]) {
        newLine[i] *= 2;
        this.score += newLine[i]; // додаємо очки
        newLine[i + 1] = 0;
      }
    }

    newLine = newLine.filter((val) => val); // видаляємо злиті комірки

    while (newLine.length < 4) {
      newLine.push(0); // заповнємо нулями нулями
    }

    return newLine;
  }

  // транспонування
  _transposeBoard() {
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        newBoard[i][j] = this.board[j][i];
      }
    }

    this.board = newBoard;
  }

  // отримання кількості очок
  getScore() {
    return this.score;
  }

  // отримання дошки для гри
  getState() {
    return this.board;
  }

  // отримання статусу гру
  getStatus() {
    return this.status;
  }

  // початок гри
  start() {
    if (
      this.status === 'idle' ||
      this.status === 'lose' ||
      this.status === 'win'
    ) {
      this._addRandomTile(); // добавляє одну дощечку на екран
      this._addRandomTile();
      this.status = 'playing';
    }
  }

  // перезапуск гри
  restart() {
    this.board = this._generateEmptyBoard();
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  // Add your own methods here

  // створення рандомної дощечки
  _addRandomTile() {
    const emptyCells = [];

    // пошук усіх пустих дощечок
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    // добавлення рандомного числа 2/4 в одну з пустих комірок
    if (emptyCells.length > 0) {
      const randomCell =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  // зміна статусу гри win/lose
  _checkGameStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'win';
    }

    if (this._noMoreMoves()) {
      this.status = 'lose';
    }
  }

  // перевірка чи є ще можливі кроки у грі. повертає boolean
  _noMoreMoves() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        // перевіряє наявність порожніх клітинок
        if (this.board[row][col] === 0) {
          return false;
        }

        // перевіряє чи можливо об'єднати дві сусідні дощечки по колонках
        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          return false;
        }

        // перевіряє чи можливо об'єднати дві сусідні дощечки по рядках
        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
