'use strict';

class Game {
  constructor(initialState) {
    // Встановлюємо розмір динамічно: або з вхідного масиву, або стандартно 4
    this.size = initialState?.[0]?.length ?? 4;
    this.score = 0;
    this.status = 'idle';

    // Використовуємо єдину назву: initialate
    this.initialState = initialState
      ? this.deepCopy(initialState)
      : this.getEmptyBoard();

    this.board = this.deepCopy(this.initialState);
  }

  // --- Публічні методи ---

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = 'playing';
    this.score = 0;

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    // Виправлено: тепер копіюємо саме initialState (як у конструкторі)
    this.board = this.deepCopy(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  // --- Методи руху ---

  moveLeft() {
    return this.handleMove('left');
  }

  moveRight() {
    return this.handleMove('right');
  }

  moveUp() {
    return this.handleMove('up');
  }

  moveDown() {
    return this.handleMove('down');
  }

  // --- Внутрішня логіка ---

  handleMove(direction) {
    if (this.status !== 'playing') {
      // ESLint хоче дужки тут
      return false;
    }

    const oldBoard = JSON.stringify(this.board);
    const iterations =
      direction === 'left' || direction === 'right'
        ? this.board.length
        : this.board[0].length;

    for (let i = 0; i < iterations; i++) {
      const line = this.getLine(i, direction);
      const { processedLine, lineScore } = this.slideAndMerge(line);

      this.setLine(i, direction, processedLine);
      this.score += lineScore;
    }

    if (JSON.stringify(this.board) !== oldBoard) {
      this.addRandomTile();
      this.checkStatus();

      return true;
    }

    return false;
  }

  slideAndMerge(line) {
    // 1. Прибираємо всі нулі, залишаючи тільки цифри
    const filtered = line.filter((val) => val !== 0);
    let lineScore = 0;
    const result = [];

    // 2. Проходимо по цифрах і зливаємо однакові
    for (let i = 0; i < filtered.length; i++) {
      if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
        const newValue = filtered[i] * 2;

        result.push(newValue);
        lineScore += newValue;
        i++; // Пропускаємо наступну плитку, бо вона вже злилася
      } else {
        result.push(filtered[i]);
      }
    }

    // 3. Додаємо нулі в кінець до ОРИГІНАЛЬНОЇ довжини рядка
    // Це гарантує, що якщо зайшло 4 елементи, то 4 і вийде
    while (result.length < line.length) {
      result.push(0);
    }

    return { processedLine: result, lineScore };
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length > 0) {
      const { r, c } =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.board[r][c] = Math.random() < 0.1 ? 4 : 2;
    }
  }

  checkStatus() {
    // Перевірка на перемогу
    if (this.board.flat().includes(2048)) {
      this.status = 'win';

      return;
    }

    // Якщо є нулі — граємо далі
    if (this.board.flat().includes(0)) {
      return;
    }

    // Перевірка можливості ходу (сусіди)
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const current = this.board[r][c];

        // Замість 3 використовуємо (this.size - 1)
        if (
          (c < this.size - 1 && current === this.board[r][c + 1]) ||
          (r < this.size - 1 && current === this.board[r + 1][c])
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }

  getLine(index, direction) {
    const line = [];
    const rows = this.board.length;
    const cols = this.board[0].length;

    const isHorizontal = direction === 'left' || direction === 'right';
    const limit = isHorizontal ? cols : rows;

    // Весь код має бути ВСЕРЕДИНІ цих дужок { }
    for (let i = 0; i < limit; i++) {
      if (direction === 'left') {
        line.push(this.board[index][i]);
      }

      if (direction === 'right') {
        line.push(this.board[index][cols - 1 - i]);
      }

      if (direction === 'up') {
        line.push(this.board[i][index]);
      }

      if (direction === 'down') {
        line.push(this.board[rows - 1 - i][index]);
      }
    }

    return line;
  }

  setLine(index, direction, newLine) {
    const rows = this.board.length;
    const cols = this.board[0].length;

    for (let i = 0; i < newLine.length; i++) {
      if (direction === 'left') {
        this.board[index][i] = newLine[i];
      }

      if (direction === 'right') {
        this.board[index][cols - 1 - i] = newLine[i];
      }

      if (direction === 'up') {
        this.board[i][index] = newLine[i];
      }

      if (direction === 'down') {
        this.board[rows - 1 - i][index] = newLine[i];
      }
    }
  }

  getEmptyBoard() {
    return Array.from({ length: this.size }, () => Array(this.size).fill(0));
  }

  isEmpty() {
    return this.board.flat().every((cell) => cell === 0);
  }

  deepCopy(state) {
    // Додано захист: якщо state раптом undefined, повертаємо порожню дошку
    if (!state) {
      return this.getEmptyBoard();
    }

    return state.map((row) => [...row]);
  }
}

module.exports = Game;
