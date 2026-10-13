'use strict';

export default class Game {
  constructor(initialState) {
    // Якщо initialState передано, робимо його глибоку копію, інакше створюємо пусту дошку
    this.board = initialState ? initialState.map(row => [...row]) : this.createEmptyBoard();
    this.score = 0;
    this.status = 'idle';
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  start() {
    if (this.status === 'playing') {
      return;
    }

    // Додаємо випадкові плитки при запуску, навіть якщо дошка була передана як початковий стан
    if (this.getEmptyCells().length > 0) {
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

  getEmptyCells() {
    const emptyCells = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.board[r][c] === 0) { 
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

  slideAndMerge(row) {
    // 1. Відкидаємо всі пусті клітинки (нулі)
    let newRow = row.filter(val => val !== 0);
    let scoreIncrease = 0;
    
    // 2. Об'єднуємо сусідні однакові
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        scoreIncrease += newRow[i];
        newRow.splice(i + 1, 1);
      }
    }
    
    // 3. Доповнюємо нулями до розміру 4
    while (newRow.length < 4) {
      newRow.push(0);
    }
    
    return { row: newRow, score: scoreIncrease };
  }

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

  move(direction) {
    if (this.status !== 'playing') return;

    let boardCopy = this.board.map(row => [...row]);
    
    let rotations = 0;
    if (direction === 'Right') rotations = 2;
    else if (direction === 'Up') rotations = 3;
    else if (direction === 'Down') rotations = 1;

    for (let i = 0; i < rotations; i++) {
      boardCopy = this.rotateLeft(boardCopy);
    }

    let moved = false;
    let totalScore = 0;

    for (let i = 0; i < 4; i++) {
      const { row, score } = this.slideAndMerge(boardCopy[i]);
      
      if (boardCopy[i].join(',') !== row.join(',')) {
        moved = true;
      }
      boardCopy[i] = row;
      totalScore += score;
    }

    if (moved) {
      this.score += totalScore;
      
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

  moveLeft() { this.move('Left'); }
  moveRight() { this.move('Right'); }
  moveUp() { this.move('Up'); }
  moveDown() { this.move('Down'); }
}