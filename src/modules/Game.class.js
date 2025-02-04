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
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.addRandomTile = this.addRandomTile.bind(this);
    this.start = this.start.bind(this);
    this.status = 'idle';
    this.score = 0;
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
  }

  restart() {
    this.status = 'playing';
    this.score = 0;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.addRandomTile();
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.board.length; row++) {
      // Видаляємо нулі (пусті комірки)
      let newRow = this.board[row].filter((value) => value !== 0);

      // Об'єднуємо сусідні плитки з однаковими значеннями
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2; // Подвоюємо значення плитки
          newRow[i + 1] = 0; // Очищаємо наступну плитку
          moved = true; // Позначаємо, що був рух
        }
      }

      // Видаляємо нові нулі, створені після об'єднання
      newRow = newRow.filter((value) => value !== 0);

      // Додаємо нулі до кінця, щоб рядок був розміром board.length
      while (newRow.length < this.board[row].length) {
        newRow.push(0);
      }

      // Якщо рядок змінився, оновлюємо сітку
      if (this.board[row].join('') !== newRow.join('')) {
        this.board[row] = newRow;
        moved = true;
      }
    }

    return moved; // Повертаємо true, якщо плитки змістили
  }

  moveRight() {
    this.rotateGrid(this.board, true); // Обертаємо на 180 градусів
    this.rotateGrid(this.board, true);

    const moved = this.moveLeft();

    this.rotateGrid(this.board, false);
    this.rotateGrid(this.board, false); // Повертаємо назад

    return moved;
  }

  moveUp() {
    this.rotateGrid(this.board, false);

    const moved = this.moveLeft();

    this.rotateGrid(this.board, true);

    return moved;
  }

  moveDown() {
    this.rotateGrid(this.board, true);

    const moved = this.moveLeft();

    this.rotateGrid(this.board, false);

    return moved;
  }

  rotateGrid(board, clockwise = true) {
    const size = board.length; // Розмір сітки
    const newBoard = Array(size)
      .fill(null)
      .map(() => Array(size).fill(0)); // порожня сітка

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (clockwise) {
          // Обертання на 90 градусів за годинниковою стрілкою
          newBoard[col][size - 1 - row] = board[row][col];
        } else {
          // Обертання на 90 градусів проти годинникової стрілки
          newBoard[size - 1 - col][row] = board[row][col];
        }
      }
    }

    this.board = newBoard; // Замінюємо сітку
  }

  addRandomTile() {
    const emptyCells = [];

    // Знаходимо всі порожні клітинки
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col }); // Додаємо до масиву порожніх клітинок
        }
      }
    }

    // Вибираємо випадкову клітинку
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col } = emptyCells[randomIndex];

      // Додаємо 2 або 4 у випадкову клітинку
      this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }

    return this.board; // Повертаємо оновлену дошку
  }

  getState() {
    const table = document.querySelector('tbody');

    table.innerHTML = '';

    this.board.forEach((row) => {
      const tr = document.createElement('tr');

      tr.classList.add('field-row');

      row.forEach((cell) => {
        const td = document.createElement('td');

        td.textContent = cell !== 0 ? cell : '';
        td.classList.add('field-cell');
        td.setAttribute('class', `field-cell field-cell--${cell}`);
        tr.appendChild(td);
      });

      table.appendChild(tr);
    });
  }

  getScore() {
    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] > this.score) {
          this.score = this.board[row][col];
        }
      }
    }

    return this.score;
  }

  canMove() {
    const copyOfBoard = JSON.parse(JSON.stringify(this.board));

    for (let row = 0; row < copyOfBoard.length; row++) {
      for (let col = 0; col < copyOfBoard[row].length - 1; col++) {
        if (
          copyOfBoard[row][col + 1] === 0 ||
          copyOfBoard[row][col] === 0 ||
          copyOfBoard[row][col] === copyOfBoard[row][col + 1]
        ) {
          return true;
        }
      }
    }

    for (let col = 0; col < copyOfBoard[0].length; col++) {
      for (let row = 0; row < copyOfBoard.length - 1; row++) {
        if (
          copyOfBoard[row + 1][col] === 0 ||
          copyOfBoard[row][col] === 0 ||
          copyOfBoard[row][col] === copyOfBoard[row + 1][col]
        ) {
          return true;
        }
      }
    }

    return false;
  }

  getStatus() {
    // `idle` - the game has not started yet (the initial state);
    // * `playing` - the game is in progress;
    // * `win` - the game is won;
    // * `lose` - the game is lost

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 2048) {
          this.status = 'win';
        }
      }
    }

    if (this.status === 'playing' && !this.canMove()) {
      this.status = 'lose';
    }

    return this.status;
  }
}

module.exports = Game;
