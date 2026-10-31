'use strict';

class Game {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  score = 0;

  constructor(initialState) {
    this.board = initialState ?? this.board;
  }

  // Клавіша вліво
  moveLeft() {
    this.board.forEach((row, rowIndex) => {
      const filteredRow = row.filter((element) => element !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow.splice(i + 1, 1);
        }
      }

      while (filteredRow.length !== 4) {
        filteredRow.push(0);
      }

      this.board[rowIndex] = filteredRow;
    });
  }

  // Клавіша вправо
  moveRight() {
    this.board.forEach((row, rowIndex) => {
      const reverseRow = row.reverse();
      const filteredRow = reverseRow.filter((element) => element !== 0);

      for (let i = 0; i < filteredRow.length - 1; i++) {
        if (filteredRow[i] === filteredRow[i + 1]) {
          filteredRow[i] *= 2;
          this.score += filteredRow[i];
          filteredRow.splice(i + 1, 1);
        }
      }

      while (filteredRow.length !== 4) {
        filteredRow.push(0);
      }

      this.board[rowIndex] = filteredRow.reverse();
    });
  }

  // Клавіша вверх
  moveUp() {
    for (let colIndex = 0; colIndex < 4; colIndex++) {
      const column = [];

      this.board.forEach((row) => {
        column.push(row[colIndex]);
      });

      const filteredCol = column.filter((element) => element !== 0);

      for (let i = 0; i < filteredCol.length - 1; i++) {
        if (filteredCol[i] === filteredCol[i + 1]) {
          filteredCol[i] *= 2;
          this.score += filteredCol[i];
          filteredCol.splice(i + 1, 1);
        }
      }

      while (filteredCol.length !== 4) {
        filteredCol.push(0);
      }

      for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
        this.board[rowIndex][colIndex] = filteredCol[rowIndex];
      }
    }
  }

  // Клавіша вниз
  moveDown() {
    for (let colIndex = 0; colIndex < 4; colIndex++) {
      const column = [];

      this.board.forEach((row) => {
        column.push(row[colIndex]);
      });

      const reverseCol = column.reverse();
      const filteredCol = reverseCol.filter((element) => element !== 0);

      for (let i = 0; i < filteredCol.length - 1; i++) {
        if (filteredCol[i] === filteredCol[i + 1]) {
          filteredCol[i] *= 2;
          this.score += filteredCol[i];
          filteredCol.splice(i + 1, 1);
        }
      }

      while (filteredCol.length !== 4) {
        filteredCol.push(0);
      }

      filteredCol.reverse();

      for (let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
        this.board[rowIndex][colIndex] = filteredCol[rowIndex];
      }
    }
  }

  /**
   * @returns {number}
   */
  getScore() {}

  /**
   * @returns {number[][]}
   */
  getState() {}

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
  getStatus() {}

  // Старт
  start() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;

    this.addRandomTile();
    this.addRandomTile();
  }

  // Рестарт
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
  }

  // Пошук вільних клітинок
  getFreeCells() {
    const blankElementsArr = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((element, elementIndex) => {
        if (element === 0) {
          const elementCoords = [rowIndex, elementIndex];

          blankElementsArr.push(elementCoords);
        }
      });
    });

    return blankElementsArr;
  }

  // Пошук вільної клітинки
  getRandomFreeCell() {
    const coords = this.getFreeCells();
    const maxValue = coords.length;
    const randomIndex = Math.floor(Math.random() * maxValue);
    const randomElement = coords[randomIndex];

    return randomElement;
  }

  // Додавання випадкової 2 або 4 у вільну клітинку
  addRandomTile() {
    const [row, column] = this.getRandomFreeCell();
    const number = Math.random() < 0.1 ? 4 : 2;

    this.board[row][column] = number;
  }
}

module.exports = Game;
