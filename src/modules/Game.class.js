'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
const IDLE = 'idle';
const PLAYING = 'playing';

export const WIN = 'win';
export const LOSE = 'lose';

export class Game {
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
  constructor(initialState, winCallback, loseCallback) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;

    this.status = IDLE;
    this.isStarted = false;
    this.winCallback = winCallback;
    this.loseCallback = loseCallback;
  }

  moveTile(fromCell, toCell) {
    // Отримуємо координати клітинок
    const fromCellRect = fromCell.getBoundingClientRect();
    const toCellRect = toCell.getBoundingClientRect();

    // Вираховуємо зміщення
    const xOffset = toCellRect.left - fromCellRect.left;
    const yOffset = toCellRect.top - fromCellRect.top;

    // Встановлюємо зміщення через CSS перемінні
    fromCell.style.setProperty('--x-offset', `${xOffset}px`);
    fromCell.style.setProperty('--y-offset', `${yOffset}px`);

    // Додаємо клас для запуску анімації
    fromCell.classList.add('moving');

    // Затримка для застосування анімації збільшення
    setTimeout(() => {
      // Додаємо клас 'merged' для анімації збільшення
      toCell.classList.add('merged');

      // Затримка для видалення класу 'merged' після завершення анімації
      setTimeout(() => {
        toCell.classList.remove('merged');
      }, 300); // Час анімації (300ms)
    }, 120); // Затримка до початку анімації
  }

  updateBoard() {
    const cells = document.querySelectorAll('.field-cell');
    // всі клітинки дошки

    let cellIndex = 0;

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        const cell = cells[cellIndex++];
        const value = this.board[row][col];
        const previousValue = cell.textContent;

        cell.classList.remove(`field-cell--${previousValue}`);

        if (value === 0) {
          cell.textContent = '';
        } else {
          cell.classList.add(`field-cell--${value}`);
          cell.textContent = value; // оновлюємо текст
        }
      }
    }
  }

  addRandomTile() {
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

      if (this.score === 0) {
        this.board[row][col] = 2; // Додаємо плитку 2 лише один раз на старті
      }
      this.updateBoard(); // оновлюємо DOM після додавання плитки
    }
  }

  addRandomCellAfterMoving() {
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
      this.updateBoard(); // оновлюємо DOM після додавання плитки
    }
  }

  createColumn(col) {
    const newColumn = [];

    for (let row = 0; row < this.board.length; row++) {
      if (this.board[row][col] !== 0) {
        newColumn.push(this.board[row][col]);
      }
    }

    return newColumn;
  }

  updateColumn(col, newColumn) {
    let moved = false;

    for (let row = 0; row < this.board.length; row++) {
      if (this.board[row][col] !== newColumn[row]) {
        this.board[row][col] = newColumn[row];
        moved = true;
      }
    }

    return moved;
  }

  resetGameStart() {
    this.score = 0;
    this.status = PLAYING;

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.addRandomTile();
    this.addRandomTile();
  }

  mergeTitles(newRow, canMerge) {
    const mergedThisMove = []; // масив для відслідковування злитих плиток

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow.splice(i + 1, 1);
        canMerge[i] = false; // вказуємо, що плитка вже злилася
        mergedThisMove.push(i); // зберігаємо індекс злитої плитки
      }
    }

    return mergedThisMove;
  }

  moveLeft() {
    let moved = false;

    for (let row = 0; row < this.board.length; row++) {
      const currentRow = this.board[row].filter((val) => val !== 0);
      // Відфільтровуємо нулі для зміщення плиток вліво
      const mergedRow = [];

      let skip = false;

      for (let i = 0; i < currentRow.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        // Якщо плитки однакові, зливаємо їх
        if (currentRow[i] === currentRow[i + 1]) {
          mergedRow.push(currentRow[i] * 2);
          this.getScore(true, currentRow[i] * 2); // Оновлюємо рахунок за злиття
          skip = true;
          moved = true;
        } else {
          mergedRow.push(currentRow[i]);
        }
      }

      // Заповнюємо ряд до повної довжини, додаючи нулі
      while (mergedRow.length < this.board[row].length) {
        mergedRow.push(0);
      }

      // Перевіряємо, чи відбулася зміна в ряду
      if (!moved) {
        for (let i = 0; i < this.board[row].length; i++) {
          if (this.board[row][i] !== mergedRow[i]) {
            moved = true;
            break;
          }
        }
      }

      this.board[row] = mergedRow; // Оновлюємо ряд
    }

    if (moved) {
      this.addRandomCellAfterMoving();
      this.updateBoard();
      this.getStatus();
    }

    return moved;
  }

  moveRight() {
    let moved = false;

    for (let row = 0; row < this.board.length; row++) {
      // Фільтруємо нулі й залишаємо лише ненульові значення
      const currentRow = this.board[row].filter((val) => val !== 0);

      const mergedRow = [];
      let skip = false;

      // Зливаємо плитки, якщо вони однакові
      for (let i = 0; i < currentRow.length; i++) {
        if (skip) {
          skip = false;
          continue;
        }

        if (currentRow[i] === currentRow[i + 1]) {
          mergedRow.push(currentRow[i] * 2); // Зливаємо плитки
          this.getScore(true, currentRow[i] * 2); // Оновлюємо рахунок
          skip = true; // Пропускаємо наступну плитку
          moved = true;
        } else {
          mergedRow.push(currentRow[i]);
        }
      }

      // Додаємо нулі на початок для вирівнювання ряду вправо
      while (mergedRow.length < this.board[row].length) {
        mergedRow.unshift(0);
      }

      // Перевіряємо, чи відбулись зміни в ряду
      for (let i = 0; i < this.board[row].length; i++) {
        if (this.board[row][i] !== mergedRow[i]) {
          moved = true;
          break;
        }
      }

      // Оновлюємо ряд у дошці без додаткового реверсу
      this.board[row] = mergedRow;
    }

    if (moved) {
      this.addRandomCellAfterMoving();
      this.updateBoard();
      this.getStatus();
    }

    return moved;
  }

  moveUp() {
    let moved = false;

    for (let col = 0; col < this.board.length; col++) {
      const newColumn = this.createColumn(col);
      const canMerge = new Array(newColumn.length).fill(true);

      for (let i = 0; i < newColumn.length - 1; i++) {
        if (
          newColumn[i] === newColumn[i + 1] &&
          canMerge[i] &&
          canMerge[i + 1]
        ) {
          newColumn[i] *= 2;
          newColumn.splice(i + 1, 1);
          moved = true;
          canMerge[i] = false;
          this.getScore(moved, newColumn[i]);
        }
      }

      while (newColumn.length < this.board.length) {
        newColumn.push(0);
      }

      moved = this.updateColumn(col, newColumn) || moved;
    }

    if (moved) {
      this.addRandomCellAfterMoving();
      this.updateBoard();
      this.getStatus();
    }

    return moved;
  }

  moveDown() {
    let moved = false;

    for (let col = 0; col < this.board.length; col++) {
      const newColumn = this.createColumn(col);
      const canMerge = new Array(newColumn.length).fill(true);

      for (let i = newColumn.length - 1; i > 0; i--) {
        if (
          newColumn[i] === newColumn[i - 1] &&
          canMerge[i] &&
          canMerge[i - 1]
        ) {
          newColumn[i] *= 2;
          newColumn.splice(i - 1, 1);
          moved = true;
          canMerge[i] = false;
          this.getScore(moved, newColumn[i]);
        }
      }

      while (newColumn.length < this.board.length) {
        newColumn.unshift(0);
      }

      moved = this.updateColumn(col, newColumn) || moved;
    }

    if (moved) {
      this.addRandomCellAfterMoving();
      this.updateBoard();
      this.getStatus();
    }

    return moved;
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
    if (this.score === 0) {
      this.status = IDLE;
    } else {
      let hasEmptyCell = false;
      let has2048Cell = false;
      let canMove = false; // Змінна для перевірки наявності можливих ходів

      for (let row = 0; row < this.board.length; row++) {
        for (let col = 0; col < this.board[row].length; col++) {
          if (this.board[row][col] === 0) {
            hasEmptyCell = true;
          }

          if (this.board[row][col] === 2048) {
            has2048Cell = true;
          }

          // Перевірка на можливість злиття
          if (
            row < this.board.length - 1 &&
            this.board[row][col] === this.board[row + 1][col]
          ) {
            canMove = true; // Якщо клітинки злиті по вертикалі
          }

          if (
            col < this.board[row].length - 1 &&
            this.board[row][col] === this.board[row][col + 1]
          ) {
            canMove = true; // Якщо клітинки злиті по горизонталі
          }
        }
      }

      if (has2048Cell) {
        this.status = WIN;
        this.winCallback();
      } else if (hasEmptyCell || canMove) {
        this.status = PLAYING;
      } else {
        this.status = LOSE;
        this.loseCallback();
      }
    }

    return this.status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.resetGameStart();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.resetGameStart();
  }

  // Add your own methods here
}
