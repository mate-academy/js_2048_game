'use strict';

const DEFAULT_STATE = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

class Game {
  constructor(initialState = DEFAULT_STATE) {
    this.initialState = initialState.map((row) => [...row]);
    this.state = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  checkGameOver() {
    // 1. Якщо є хоча б одна вільна клітинка — гра триває
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          return;
        }
      }
    }

    // 2. Перевіряємо можливість злиття по горизонталі
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (this.state[r][c] === this.state[r][c + 1]) {
          return;
        }
      }
    }

    // 3. Перевіряємо возможность злиття по вертикалі
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === this.state[r + 1][c]) {
          return;
        }
      }
    }

    // Якщо вільних клітинок немає і ходів більше немає — це програш
    this.status = 'lose';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.state.map((row) => [...row]);

    for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
      const row = this.state[rowIndex];
      const rowNumber = row.filter((cell) => cell !== 0);
      const newRow = [];
      let cellIndex = 0;

      while (cellIndex < rowNumber.length) {
        const currentCell = rowNumber[cellIndex];
        const nextCell = rowNumber[cellIndex + 1];

        if (currentCell === nextCell) {
          const mergedCell = currentCell + nextCell;

          newRow.push(mergedCell);
          this.score += mergedCell;

          if (mergedCell === 2048) {
            this.status = 'win';
          }
          cellIndex += 2;
        } else {
          newRow.push(currentCell);
          cellIndex++;
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }
      this.state[rowIndex] = newRow;
    }

    const isChanged = JSON.stringify(prevState) !== JSON.stringify(this.state);

    if (!isChanged || this.status === 'win') {
      return;
    }

    this.addNewTile();
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.state.map((row) => [...row]);

    for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
      const row = this.state[rowIndex];
      const rowNumber = row.filter((cell) => cell !== 0).reverse();
      const newRow = [];
      let cellIndex = 0;

      while (cellIndex < rowNumber.length) {
        const currentCell = rowNumber[cellIndex];
        const nextCell = rowNumber[cellIndex + 1];

        if (currentCell === nextCell) {
          const mergedCell = currentCell + nextCell;

          newRow.push(mergedCell);
          this.score += mergedCell;

          if (mergedCell === 2048) {
            this.status = 'win';
          }
          cellIndex += 2;
        } else {
          newRow.push(currentCell);
          cellIndex++;
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }
      this.state[rowIndex] = newRow.reverse();
    }

    const isChanged = JSON.stringify(prevState) !== JSON.stringify(this.state);

    if (!isChanged || this.status === 'win') {
      return;
    }

    this.addNewTile();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.state.map((row) => [...row]);

    for (let cellIndex = 0; cellIndex < 4; cellIndex++) {
      const column = [];

      for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
        const currentCell = this.state[rowIndex][cellIndex];

        if (currentCell !== 0) {
          column.push(currentCell);
        }
      }

      const newColumn = [];
      let numberIndex = 0;

      while (numberIndex < column.length) {
        const currentNumber = column[numberIndex];
        const nextNumber = column[numberIndex + 1];

        if (currentNumber === nextNumber) {
          const mergedNumber = currentNumber + nextNumber;

          newColumn.push(mergedNumber);
          this.score += mergedNumber;

          if (mergedNumber === 2048) {
            this.status = 'win';
          }
          numberIndex += 2;
        } else {
          newColumn.push(currentNumber);
          numberIndex++;
        }
      }

      while (newColumn.length < 4) {
        newColumn.push(0);
      }

      for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
        this.state[rowIndex][cellIndex] = newColumn[rowIndex];
      }
    }

    const isChanged = JSON.stringify(prevState) !== JSON.stringify(this.state);

    if (!isChanged || this.status === 'win') {
      return;
    }

    this.addNewTile();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = this.state.map((row) => [...row]);

    for (let cellIndex = 0; cellIndex < 4; cellIndex++) {
      const column = [];

      // Збираємо елементи знизу вгору
      for (let rowIndex = 3; rowIndex >= 0; rowIndex--) {
        const currentCell = this.state[rowIndex][cellIndex];

        if (currentCell !== 0) {
          column.push(currentCell);
        }
      }

      const newColumn = [];
      let numberIndex = 0;

      while (numberIndex < column.length) {
        const currentNumber = column[numberIndex];
        const nextNumber = column[numberIndex + 1];

        if (currentNumber === nextNumber) {
          const mergedNumber = currentNumber + nextNumber;

          newColumn.push(mergedNumber);
          this.score += mergedNumber;

          if (mergedNumber === 2048) {
            this.status = 'win';
          }
          numberIndex += 2;
        } else {
          newColumn.push(currentNumber);
          numberIndex++;
        }
      }

      while (newColumn.length < 4) {
        newColumn.push(0);
      }

      for (let rowIndex = 3; rowIndex >= 0; rowIndex--) {
        this.state[rowIndex][cellIndex] = newColumn[3 - rowIndex];
      }
    }

    const isChanged = JSON.stringify(prevState) !== JSON.stringify(this.state);

    if (!isChanged || this.status === 'win') {
      return;
    }

    this.addNewTile();
  }

  addNewTile() {
    const emptyCells = [];

    for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
      for (
        let cellIndex = 0;
        cellIndex < this.state[rowIndex].length;
        cellIndex++
      ) {
        if (this.state[rowIndex][cellIndex] === 0) {
          emptyCells.push({ rowIndex, cellIndex });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    const newCell = Math.random() < 0.9 ? 2 : 4;

    this.state[randomCell.rowIndex][randomCell.cellIndex] = newCell;

    // Перевіряємо стан гри на програш після появи кожної нової плитки
    this.checkGameOver();
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }
    this.status = 'playing';

    for (let i = 0; i < 2; i++) {
      const zeroCells = [];

      for (let rowIndex = 0; rowIndex < this.state.length; rowIndex++) {
        for (
          let cellIndex = 0;
          cellIndex < this.state[rowIndex].length;
          cellIndex++
        ) {
          if (this.state[rowIndex][cellIndex] === 0) {
            zeroCells.push({ rowIndex, cellIndex });
          }
        }
      }

      if (zeroCells.length === 0) {
        return;
      }

      const randomIndex = Math.floor(Math.random() * zeroCells.length);
      const randomCell = zeroCells[randomIndex];
      const newCell = Math.random() < 0.9 ? 2 : 4;

      this.state[randomCell.rowIndex][randomCell.cellIndex] = newCell;
    }
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
    this.start();
  }
}

module.exports = Game;
