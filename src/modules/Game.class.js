'use strict';

export class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.size = 4;
    this.status = 'idle';
    this.gameField = this.initialState;
    this.score = 0;
  }

  start() {
    this.status = 'playing';
    this.#addNumber();
    this.#addNumber();
  }

  restart() {
    this.status = 'idle';
    this.score = 0;

    this.gameField = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  }

  getStatus() {
    return this.status;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.gameField;
  }

  moveLeft() {
    if (this.status === 'playing') {
      const newState = this.gameField.map((row) => this.#mergeCells(row));

      this.#handleMove(newState);
    }
  }

  moveRight() {
    if (this.status === 'playing') {
      const newState = this.gameField.map((row) => {
        const reversedRow = row.slice().reverse();
        const mergedRow = this.#mergeCells(reversedRow);

        return mergedRow.reverse();
      });

      this.#handleMove(newState);
    }
  }

  moveUp() {
    if (this.status === 'playing') {
      const transposedState = this.#transpose(this.gameField);
      const newState = transposedState.map((row) => this.#mergeCells(row));

      this.#handleMove(this.#transpose(newState));
    }
  }

  moveDown() {
    if (this.status === 'playing') {
      const transposedState = this.#transpose(this.gameField);
      const newState = transposedState.map((row) => {
        const reversedRow = row.slice().reverse();
        const mergedRow = this.#mergeCells(reversedRow);

        return mergedRow.reverse();
      });

      this.#handleMove(this.#transpose(newState));
    }
  }

  #addNumber() {
    const [randomY, randomX] = this.#findEmptyCells();

    this.gameField[randomY][randomX] = Math.random() < 0.8 ? 2 : 4;
  }

  #findEmptyCells() {
    const emptyCells = [];

    this.gameField.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        if (cell === 0) {
          emptyCells.push([rowIndex, columnIndex]);
        }
      });
    });

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  #mergeCells(row) {
    const mergedRow = row.filter((cell) => cell !== 0);
    const newRow = [];
    let i = 0;

    while (i < mergedRow.length) {
      if (mergedRow[i] === mergedRow[i + 1]) {
        newRow.push(mergedRow[i] * 2);
        this.score += mergedRow[i] * 2;
        i += 2;
      } else {
        newRow.push(mergedRow[i]);
        i += 1;
      }
    }
    newRow.push(...Array(4 - newRow.length).fill(0));

    return newRow;
  }

  #transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  #willStateChange(newState) {
    return JSON.stringify(this.gameField) !== JSON.stringify(newState);
  }

  #isWin() {
    this.status = this.gameField.some((row) => row.includes(2048))
      ? 'win'
      : this.status;
  }

  #isLose() {
    for (const row of this.gameField) {
      if (row.some((i) => i === 0)) {
        return false;
      }

      for (let i = 0; i < row.length; i++) {
        if (row[i] === row[i + 1]) {
          return false;
        }
      }
    }

    for (let c = 0; c < 4; c++) {
      const row = [
        this.gameField[0][c],
        this.gameField[1][c],
        this.gameField[2][c],
        this.gameField[3][c],
      ];

      for (let i = 0; i < row.length; i++) {
        if (row[i] === row[i + 1]) {
          return false;
        }
      }
    }

    return true;
  }

  #handleMove(newGameField) {
    if (this.#willStateChange(newGameField)) {
      this.gameField = newGameField;
      this.#addNumber();
      this.#isWin();

      if (this.#isLose()) {
        this.status = 'lose';
      }
    }
  }
}

module.exports = Game;
