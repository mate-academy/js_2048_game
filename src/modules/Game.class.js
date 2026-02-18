// @ts-nocheck
'use strict';

export class Game {
  constructor(initialState = null) {
    this.matrixSize = 4;
    this.score = 0;
    this.status = 'idle';

    this.initialState = initialState ? this.copy(initialState) : null;

    if (this.initialState) {
      this.matrix = this.copy(this.initialState);
    } else {
      this.matrix = this.createEmptyMatrix();
    }
  }
  copy(matrix) {
    return matrix.map((row) => row.slice());
  }
  createEmptyMatrix() {
    return Array.from({ length: this.matrixSize }, () =>
      // eslint-disable-next-line prettier/prettier
      Array(this.matrixSize).fill(0));
  }
  addRandomNum() {
    const emptyCells = [];

    for (let row = 0; row < this.matrixSize; row++) {
      for (let collumn = 0; collumn < this.matrixSize; collumn++) {
        if (this.matrix[row][collumn] === 0) {
          emptyCells.push({ row, collumn });
        }
      }
    }

    if (emptyCells.length === 0) {
      return false;
    }

    const { row: rowIndex, collumn: colIndex } =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.matrix[rowIndex][colIndex] = Math.random() < 0.9 ? 2 : 4;

    return true;
  }
  equal(first, seccond) {
    if (first.length !== seccond.length) {
      return false;
    }

    for (let i = 0; i < first.length; i++) {
      if (first[i] !== seccond[i]) {
        return false;
      }
    }

    return true;
  }
  processLine(line) {
    const tiles = line.filter((el) => el !== 0);
    const result = [];
    let gained = 0;
    let i = 0;

    while (i < tiles.length) {
      if (tiles[i] === tiles[i + 1]) {
        result.push(tiles[i] * 2);
        gained += tiles[i] * 2;
        i += 2;
      } else {
        result.push(tiles[i]);
        i += 1;
      }
    }

    while (result.length < this.matrixSize) {
      result.push(0);
    }

    const changed = !this.equal(result, line);

    return { line: result, gained, changed };
  }
  hasMove() {
    // Перевіряє чи є куди рухатись, чи є ще можливість сполучити клітинки
    for (let row = 0; row < this.matrixSize; row++) {
      for (let col = 0; col < this.matrixSize; col++) {
        const el = this.matrix[row][col];
        // Якщо хоч одна клітинка пустує гра не завершена

        if (el === 0) {
          return true;
        }
        // Якщо в колонці і даному ряді і наступний елемент
        // колонки і даний ряд є однакові елементи гра продовжується

        if (col < this.matrixSize - 1 && el === this.matrix[row][col + 1]) {
          return true;
        }
        // Якщо в ряду і даному колонці і наступний елемент
        // ряду і даний колонки є однакові елементи гра продовжується

        if (row < this.matrixSize - 1 && el === this.matrix[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }
  updateStatus() {
    if (this.matrix.some((row) => row.includes(2048))) {
      this.status = 'win';

      return;
    }
    this.status = this.hasMove() ? 'playing' : 'lose';
  }
  moveLeft() {
    let moveGained = 0;
    let move = false;

    for (let row = 0; row < this.matrixSize; row++) {
      const { line, gained, changed } = this.processLine(this.matrix[row]);

      if (changed) {
        this.matrix[row] = line;
        moveGained += gained;
        move = true;
      }
    }

    if (move) {
      this.score += moveGained;
      this.addRandomNum();
      this.updateStatus();
    }
  }
  moveRight() {
    let moveGained = 0;
    let move = false;

    for (let row = 0; row < this.matrixSize; row++) {
      const reverse = this.matrix[row].slice().reverse();
      const { line, gained, changed } = this.processLine(reverse);
      const result = line.slice().reverse();

      if (changed) {
        this.matrix[row] = result;
        moveGained += gained;
        move = true;
      }
    }

    if (move) {
      this.score += moveGained;
      this.addRandomNum();
      this.updateStatus();
    }
  }
  moveUp() {
    let moveGained = 0;
    let move = false;

    for (let col = 0; col < this.matrixSize; col++) {
      const column = this.matrix.map((row) => row[col]);
      const { line, gained, changed } = this.processLine(column);

      if (changed) {
        for (let row = 0; row < this.matrixSize; row++) {
          this.matrix[row][col] = line[row];
        }
        moveGained += gained;
        move = true;
      }
    }

    if (move) {
      this.score += moveGained;
      this.addRandomNum();
      this.updateStatus();
    }
  }
  moveDown() {
    let moveGained = 0;
    let move = false;

    for (let col = 0; col < this.matrixSize; col++) {
      const column = this.matrix.map((row) => row[col]).reverse();
      const { line, gained, changed } = this.processLine(column);
      const result = line.slice().reverse();

      if (changed) {
        for (let row = 0; row < this.matrixSize; row++) {
          this.matrix[row][col] = result[row];
        }
        moveGained += gained;
        move = true;
      }
    }

    if (move) {
      this.score += moveGained;
      this.addRandomNum();
      this.updateStatus();
    }
  }
  getScore() {
    return this.score;
  }
  getState() {
    return this.copy(this.matrix);
  }
  getStatus() {
    return this.status;
  }
  start() {
    this.score = 0;
    this.status = 'playing';

    if (this.initialState) {
      this.matrix = this.copy(this.initialState);
    } else {
      this.matrix = this.createEmptyMatrix();
    }
    this.addRandomNum();
    this.addRandomNum();
  }
  restart() {
    this.start();
  }
}
