'use strict';

export default class Game {
  constructor(initialState) {
    // Якщо initial state не передано, створюємо пусту дошку 4x4 (заповнену null або 0)
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing'; // 'playing', 'won', 'game_over'
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(null));
  }

  start() {
    // Додаємо дві початкові плитки, якщо дошка пуста
    if (!this.board.some(row => row.some(cell => cell !== null))) {
      this.addRandomTile();
      this.addRandomTile();
    }
    this.status = 'playing';
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  // --- Внутрішні методи логіки ---

  getEmptyCells() {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!this.board[r][c]) { 
          emptyCells.push({ r, c });
        }
      }
    }
    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();
    if (emptyCells.length === 0) return;
    
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    // З ймовірністю 10% випадає 4, інакше 2
    this.board[randomCell.r][randomCell.c] = Math.random() < 0.1 ? 4 : 2;
  }

  // Зсув одного рядка вліво з об'єднанням однакових чисел
  slideAndMerge(row) {
    // 1. Прибираємо пусті клітинки
    let newRow = row.filter(val => val !== null);
    let scoreIncrease = 0;
    
    // 2. Об'єднуємо сусідні однакові плитки
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] !== null && newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        scoreIncrease += newRow[i];
        newRow.splice(i + 1, 1); // Видаляємо елемент, який злився
      }
    }
    
    // 3. Доповнюємо рядок пустими клітинками до довжини 4
    while (newRow.length < 4) {
      newRow.push(null);
    }
    
    return { row: newRow, score: scoreIncrease };
  }

  // Обертання матриці на 90 градусів проти годинникової стрілки
  rotateLeft(matrix) {
    const n = matrix.length;
    const res = this.createEmptyBoard();
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        res[n - 1 - j][i] = matrix[i][j];
      }
    }
    return res;
  }

  // Універсальний метод руху
  move(direction) {
    if (this.status !== 'playing') return;

    // Створюємо глибоку копію дошки
    let boardCopy = JSON.parse(JSON.stringify(this.board));
    
    // Визначаємо кількість обертів, щоб звести рух до "moveLeft"
    let rotations = 0;
    if (direction === 'Right') rotations = 2;
    else if (direction === 'Up') rotations = 3;
    else if (direction === 'Down') rotations = 1;

    // Обертаємо дошку перед рухом
    for (let i = 0; i < rotations; i++) {
      boardCopy = this.rotateLeft(boardCopy);
    }

    let moved = false;
    let totalScore = 0;

    // Застосовуємо логіку руху вліво для кожного рядка
    for (let i = 0; i < 4; i++) {
      const { row, score } = this.slideAndMerge(boardCopy[i]);
      
      // Перевіряємо, чи змінився рядок (чи був рух)
      if (JSON.stringify(boardCopy[i]) !== JSON.stringify(row)) {
        moved = true;
      }
      boardCopy[i] = row;
      totalScore += score;
    }

    if (moved) {
      this.score += totalScore;
      
      // Повертаємо дошку у вихідне положення
      for (let i = 0; i < (4 - rotations) % 4; i++) {
        boardCopy = this.rotateLeft(boardCopy);
      }
      this.board = boardCopy;

      this.addRandomTile();
      this.updateGameStatus();
    }
  }

  updateGameStatus() {
    let has2048 = false;
    let hasMoves = this.getEmptyCells().length > 0;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 2048) {
          has2048 = true;
        }
        // Якщо пустих клітинок немає, перевіряємо чи є можливі ходи (сусідні однакові клітинки)
        if (!hasMoves) {
          if (c < 3 && this.board[r][c] === this.board[r][c + 1]) hasMoves = true;
          if (r < 3 && this.board[r][c] === this.board[r + 1][c]) hasMoves = true;
        }
      }
    }

    if (has2048) {
      this.status = 'won';
    } else if (!hasMoves) {
      this.status = 'game_over';
    }
  }

  // --- Основні методи руху (використовуються в тестах) ---
  moveLeft() { this.move('Left'); }
  moveRight() { this.move('Right'); }
  moveUp() { this.move('Up'); }
  moveDown() { this.move('Down'); }
}