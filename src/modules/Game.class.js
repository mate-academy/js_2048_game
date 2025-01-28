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

  static initialTable = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  constructor(pageRows) {
    this.tableState = [...Game.initialTable];
    this.pageRows = pageRows;
    this.status = 'idle';
  }

  moveLeft() {
    this.handleMovement('left');
    this.addNewNumberField(this.generate2or4());
    this.renderCells(this.pageRows);
  }
  moveRight() {
    this.handleMovement('right');
    this.addNewNumberField(this.generate2or4());
    this.renderCells(this.pageRows);
  }
  moveUp() {
    this.handleMovement('up');
    this.addNewNumberField(this.generate2or4());
    this.renderCells(this.pageRows);
  }
  moveDown() {
    this.handleMovement('down');
    this.addNewNumberField(this.generate2or4());
    this.renderCells(this.pageRows);
  }

  handleMovement(direction) {
    function sortZeros(arr) {
      const zeros = arr.filter((el) => el === 0);
      const nonZeros = arr.filter((el) => el !== 0);

      if (direction === 'left' || direction === 'up') {
        return nonZeros.concat(zeros);
      }

      if (direction === 'down' || direction === 'right') {
        return zeros.concat(nonZeros);
      }
    } // Функція для розміщення нулів в кінці

    const flipArray = {
      transpose(matrix) {
        const result = [];

        for (let i = 0; i < matrix[0].length; i++) {
          result[i] = [];

          for (let j = 0; j < matrix.length; j++) {
            result[i][j] = matrix[j][i];
          }
        }

        return result;
      },
      rotateClockwise(matrix) {
        const transposed = this.transpose(matrix);

        for (let i = 0; i < transposed.length; i++) {
          transposed[i] = transposed[i].reverse();
        }

        return transposed;
      },

      rotateCounterClockwise(matrix) {
        for (let i = 0; i < matrix.length; i++) {
          matrix[i] = matrix[i].reverse();
        }

        return this.transpose(matrix);
      },
    };

    let mergedTable = this.tableState;

    // Якщо напрямок 'вгору' чи 'вниз', обертаємо масив
    if (direction === 'up' || direction === 'down') {
      mergedTable = flipArray.rotateCounterClockwise(mergedTable);
    }

    // Тепер сортуємо та об'єднуємо рядки
    mergedTable = mergedTable.map((row) => {
      const sortedRow = sortZeros(row, direction);

      const mergedRow = () => {
        for (let i = 0; i < sortedRow.length; i++) {
          if (sortedRow[i] === sortedRow[i + 1]) {
            sortedRow[i] += sortedRow[i + 1];
            sortedRow[i + 1] = 0;
            i++; // Пропускаємо наступну ітерацію після злиття
          }
        }

        return sortZeros(sortedRow, direction);
      };

      return mergedRow();
    });

    // Якщо напрямок 'вгору' чи 'вниз', обертаємо масив назад
    if (direction === 'up' || direction === 'down') {
      this.tableState = flipArray.rotateClockwise(mergedTable);
    } else {
      this.tableState = mergedTable;
    }
    // Оновлюємо відображення клітин
  }

  /**
   * @returns {number}
   */
  getScore() {}

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.tableState;
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
    const number1 = this.generate2or4();
    const number2 = this.generate2or4();

    this.addNewNumberField(number1);
    this.addNewNumberField(number2);

    this.renderCells(this.pageRows);
    this.status = 'playing';
  }

  /**
   * Resets the game.
   */
  restart(rows) {
    // Скидаємо поле до початкового стану
    this.tableState = [...Game.initialTable];

    // Додаємо нові числа на поле
    this.addNewNumberField(this.generate2or4());
    this.addNewNumberField(this.generate2or4());

    // Оновлюємо відображення клітин
    this.renderCells(rows);

    // Змінюємо статус гри
    this.status = 'playing';
  }

  addNewNumberField(number) {
    const emtpyCells = this.findEmptyCells(this.tableState);
    const randomIndex = Math.floor(Math.random() * emtpyCells.length);
    const [randomRow, randomCol] = emtpyCells[randomIndex];

    this.tableState[randomRow][randomCol] = number;
  }

  generate2or4() {
    return Math.random() < 0.1 ? 4 : 2;
  }

  findEmptyCells(arr) {
    const listOfEmptyCells = [];

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr[i].length; j++) {
        if (arr[i][j] === 0) {
          listOfEmptyCells.push([i, j]);
        }
      }
    }

    return listOfEmptyCells;
  }

  renderCells(pageRows) {
    const fields = this.tableState;

    pageRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('.field-cell');

      cells.forEach((cell, cellIndex) => {
        const value = fields[rowIndex][cellIndex];

        if (value === 0) {
          cell.textContent = '';
        } else {
          cell.textContent = value;
        }
      });
    });
  }
}

module.exports = Game;
