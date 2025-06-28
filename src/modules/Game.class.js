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

    // this.cells = cells;
    this.score = 0;
    this.status = 'idle'; // 'idle' | 'playing' | 'win' | 'lose'

    // console.log(initialState);
  }

  moveLeft() {
    for (let row = 0; row < 4; row++) {
      const values = [];

      // Зібрати всі ненульові значення зліва направо
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] !== 0) {
          values.push(this.board[row][col]);
        }
      }

      // Об'єднати однакові значення
      let i = 0;

      while (i < values.length - 1) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          this.score += values[i];
          values.splice(i + 1, 1);
        } else {
          i++;
        }
      }

      // Записати назад у рядок зліва направо
      for (let col = 0; col < 4; col++) {
        this.board[row][col] = values[col] || 0;
      }
    }

    this.updateScoreDisplay();
  }
  moveRight() {
    for (let row = 0; row < 4; row++) {
      const values = [];

      // Зібрати всі ненульові значення справа наліво
      for (let col = 3; col >= 0; col--) {
        if (this.board[row][col] !== 0) {
          values.push(this.board[row][col]);
        }
      }

      // Об'єднати однакові значення
      let i = 0;

      while (i < values.length - 1) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          this.score += values[i];
          values.splice(i + 1, 1); // видаляємо об'єднаний дубль
        } else {
          i++;
        }
      }

      // Записати назад у рядок справа наліво
      for (let col = 3; col >= 0; col--) {
        this.board[row][col] = values[3 - col] || 0;
      }
    }

    this.updateScoreDisplay();
  }
  moveUp() {
    for (let col = 0; col < 4; col++) {
      const values = [];

      // Зібрати всі ненульові значення згори вниз
      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          values.push(this.board[row][col]);
        }
      }

      // Об'єднати однакові значення
      let i = 0;

      while (i < values.length - 1) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          values.splice(i + 1, 1);
          this.score += values[i];
          // не інкрементуємо i
        } else {
          i++;
        }
      }

      // Записати назад у стовпець згори вниз
      for (let row = 0; row < 4; row++) {
        this.board[row][col] = values[row] || 0;
      }
    }
  }
  moveDown() {
    for (let col = 0; col < 4; col++) {
      const values = [];

      // Зібрати всі ненульові значення знизу вгору
      for (let row = 3; row >= 0; row--) {
        if (this.board[row][col] !== 0) {
          values.push(this.board[row][col]);
        }
      }

      // Об'єднати однакові значення
      let i = 0;

      while (i < values.length - 1) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          this.score += values[i];
          this.updateScoreDisplay(); // ← додано
          values.splice(i + 1, 1);
          // не інкрементуємо i, бо треба перевірити новий values[i + 1]
        } else {
          i++;
        }
      }

      // Записати назад у стовпець (знизу вгору)
      for (let row = 0; row <= 3; row++) {
        this.board[row][col] = values[3 - row] || 0;
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
    const cells = document.querySelectorAll('.field-cell');

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'playing';
    this.score = 0;
    this.generateTwoRandomCells(cells);
  }
  /**
   * Resets the game.
   */
  restart() {
    // this.board = [
    //   [0, 0, 0, 0],
    //   [0, 0, 0, 0],
    //   [0, 0, 0, 0],
    //   [0, 0, 0, 0],
    // ];
    // this.score = 0;
    // this.status = 'playing';
    // this.start(); // або відразу змінити статус на 'playing'
  }

  // Add your own methods here

  generateTwoRandomCells(cells) {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const shuffle = (array) => array.sort(() => Math.random() - 0.5);
    const selected = shuffle(emptyCells).slice(0, 2);

    selected.forEach(({ row, col }) => {
      this.board[row][col] = Math.random() < 0.1 ? 4 : 2;
    });
  }

  updateScoreDisplay() {
    const scoreElement = document.querySelector('.game-score');

    if (scoreElement) {
      scoreElement.innerText = this.score;
    }
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';

          return true;
        }
      }
    }

    return false;
  }

  isGameOver() {
    // Якщо є хоча б один 0 — ще можна грати
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 0) {
          return false;
        }

        // Перевірка на можливість об'єднання праворуч
        if (col < 3 && this.board[row][col] === this.board[row][col + 1]) {
          // {
          return false;
        }

        // Перевірка на можливість об'єднання вниз
        if (row < 3 && this.board[row][col] === this.board[row + 1][col]) {
          return false;
        }
      }
    }

    return true; // Немає ходів — гра закінчена
  }

  handleMove(direction) {
    const oldBoard = this.board.map((row) => [...row]); // Глибока копія

    switch (direction) {
      case 'ArrowLeft':
        this.moveLeft();
        break;
      case 'ArrowRight':
        this.moveRight();
        break;
      case 'ArrowUp':
        this.moveUp();
        break;
      case 'ArrowDown':
        this.moveDown();
        break;
    }

    if (!this.boardsAreEqual(oldBoard, this.board)) {
      this.generateTwoRandomCells(document.querySelectorAll('.field-cell'));
    }
  }

  boardsAreEqual(board1, board2) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (board1[row][col] !== board2[row][col]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
