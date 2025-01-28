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
  constructor(initialState, pageRows) {
    // eslint-disable-next-line no-console
    console.log(initialState);

    this.state = initialState;
    this.pageRows = pageRows;
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

    let mergedTable = this.state;

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
      this.state = flipArray.rotateClockwise(mergedTable);
    } else {
      this.state = mergedTable;
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

  /**
   * Starts the game.
   */
  start() {
    const number1 = this.generate2or4();
    const number2 = this.generate2or4();

    this.addNewNumberField(number1);
    this.addNewNumberField(number2);

    this.renderCells(this.pageRows);
  }

  /**
   * Resets the game.
   */
  restart() {}

  addNewNumberField(number) {
    const emtpyCells = this.findEmptyCells(this.state);
    const randomIndex = Math.floor(Math.random() * emtpyCells.length);
    const [randomRow, randomCol] = emtpyCells[randomIndex];

    this.state[randomRow][randomCol] = number;
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
    const fields = this.state;

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
