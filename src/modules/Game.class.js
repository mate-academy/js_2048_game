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
    this.tableState = JSON.parse(JSON.stringify(Game.initialTable));
    this.pageRows = pageRows;
    this.score = 0;
    this.status = 'idle';
    this.isAnimating = false; // Змінна для контролю анімацій
  }

  moveLeft() {
    this.executeMove('left');
  }

  moveRight() {
    this.executeMove('right');
  }

  moveUp() {
    this.executeMove('up');
  }

  moveDown() {
    this.executeMove('down');
  }

  async executeMove(direction) {
    setTimeout(() => {
      this.isAnimating = false; // Анімація завершена
    }, 400);

    if (this.isAnimating) {
      return;
    }

    this.isAnimating = true; // Починається анімація

    this.renderTileCSS(direction); // Очікуємо завершення анімації плиток

    this.handleMovement(direction); // Виконуємо рух на полі

    setTimeout(() => {
      this.renderCells();
    }, 400);

    this.addNewTile();
  }

  transpose(matrix) {
    const result = [];

    for (let i = 0; i < matrix[0].length; i++) {
      result[i] = [];

      for (let j = 0; j < matrix.length; j++) {
        result[i][j] = matrix[j][i];
      }
    }

    return result;
  }

  rotateClockwise(matrix) {
    const transposed = this.transpose(matrix);

    for (let i = 0; i < transposed.length; i++) {
      transposed[i] = transposed[i].reverse();
    }

    return transposed;
  }

  rotateCounterClockwise(matrix) {
    for (let i = 0; i < matrix.length; i++) {
      matrix[i] = matrix[i].reverse();
    }

    return this.transpose(matrix);
  }

  sortZeros(arr, direction) {
    const zeros = arr.filter((el) => el === 0);
    const nonZeros = arr.filter((el) => el !== 0);

    if (direction === 'left' || direction === 'up') {
      return nonZeros.concat(zeros);
    }

    if (direction === 'down' || direction === 'right') {
      return zeros.concat(nonZeros);
    }
  }

  handleMovement(direction) {
    let mergedTable = JSON.parse(JSON.stringify(this.tableState));

    // Якщо напрямок 'вгору' чи 'вниз' обертаю масив
    if (direction === 'up' || direction === 'down') {
      mergedTable = this.rotateCounterClockwise(mergedTable);
    }

    // Тепер сортуємо та об'єдную рядки
    mergedTable = mergedTable.map((row, rowIndex) => {
      const sortedRow = this.sortZeros(row, direction);

      const mergedRow = () => {
        for (let i = 0; i < sortedRow.length; i++) {
          if (sortedRow[i] === sortedRow[i + 1]) {
            sortedRow[i] += sortedRow[i + 1];
            this.score += sortedRow[i];

            if (sortedRow[i] === 2048) {
              this.endGame('win');
            }

            sortedRow[i + 1] = 0;
            i++; // Пропускаємо наступну ітерацію після злиття
          }
        }

        return this.sortZeros(sortedRow, direction);
      };

      return mergedRow();
    });

    // Якщо напрямок 'вгору' чи 'вниз' обертаю масив назад
    if (direction === 'up' || direction === 'down') {
      this.tableState = this.rotateClockwise(mergedTable);
    } else {
      this.tableState = mergedTable;
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.tableState;
  }

  getStatus() {
    return this.status;
  }

  start() {
    // this.addNewTile();
    this.addNewTile();
    this.renderCells();

    this.status = 'playing';
  }

  restart() {
    this.clearTable();
    this.addNewTile();
    this.addNewTile();
    this.renderCells();

    this.score = 0;
    this.status = 'playing';

    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-lose').classList.add('hidden');
  }

  endGame(gameStatus) {
    if (gameStatus === 'win') {
      this.status = 'win';
      document.querySelector('.message-win').classList.remove('hidden');
    } else {
      document.querySelector('.message-lose').classList.remove('hidden');
      this.status = 'lose';
    }
  }

  clearTable() {
    this.tableState = JSON.parse(JSON.stringify(Game.initialTable));

    this.pageRows.forEach((row) => {
      row.querySelectorAll('.field-cell').forEach((cell) => {
        cell.textContent = '';
        // cell.classList.remove('field-cell--some-class');
      });
    });
  }

  addNewTile() {
    function findEmptyCells(arr) {
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

    const emtpyCells = findEmptyCells(this.tableState);

    if (emtpyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emtpyCells.length);
      const [randomRow, randomCol] = emtpyCells[randomIndex];

      this.tableState[randomRow][randomCol] = Math.random() < 0.1 ? 4 : 2;
    } else {
      this.endGame('lose');
    }
  }

  renderCells() {
    const fields = this.tableState;

    this.pageRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('.field-cell');

      cells.forEach((cell, cellIndex) => {
        const value = fields[rowIndex][cellIndex];

        if (value === 0) {
          cell.textContent = '';
        } else {
          cell.textContent = value;
        }

        if (value === 0) {
          cell.classList.add('hidden-tile');
          cell.style.backgroundColor = '';
        } else {
          cell.classList.remove('hidden-tile');
        }

        const colorOfCell = this.setColorOfCell(value);

        cell.style.backgroundColor = colorOfCell;
      });
    });
  }

  setColorOfCell(cell) {
    const colors = {
      2: '#eee4da',
      4: '#ede0c8',
      8: '#f2b179',
      16: '#f59563',
      32: '#f67c5f',
      64: '#f65e3b',
      128: '#edcf72',
      256: '#edcc61',
      512: '#edc850',
      1024: '#edc53f',
      2048: '#edc22e',
    };

    return colors[cell];
  }

  // Додаємо таймер для плавності анімації
  renderTileCSS(direction) {
    let copyTable = JSON.parse(JSON.stringify(this.tableState));

    if (direction === 'up' || direction === 'down') {
      copyTable = this.rotateCounterClockwise(copyTable);
    }

    copyTable = copyTable.map((row, rowIndex) => {
      const workingRow = [...row]; // Створюємо копію рядка для роботи з нею

      let i = 0;

      while (i < workingRow.length) {
        if (workingRow[i] === 0) {
          i++;
          continue;
        }

        let sortedWorkingRow = workingRow.slice(i).filter((el) => el !== 0);
        let cellCountOfShifts = workingRow
          .slice(i + 1)
          .filter((el) => el === 0).length;

        if (direction === 'left' || direction === 'up') {
          sortedWorkingRow = workingRow
            .slice(0, i + 1)
            .filter((el) => el !== 0);

          cellCountOfShifts = workingRow
            .slice(0, i)
            .filter((el) => el === 0).length;
        }

        for (let j = 0; j < sortedWorkingRow.length; j++) {
          if (sortedWorkingRow[j] === sortedWorkingRow[j + 1]) {
            cellCountOfShifts++;
            j++;
          }
        }

        row[i] = cellCountOfShifts;
        i++;
      }

      return row;
    });

    if (direction === 'up' || direction === 'down') {
      copyTable = this.rotateClockwise(copyTable);
    }

    this.pageRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('.field-cell');

      cells.forEach((cell, cellIndex) => {
        const tableCell = copyTable[rowIndex][cellIndex];

        let shift = tableCell * 92.5;

        if (direction === 'left' || direction === 'up') {
          shift = shift * -1;
        }

        if (tableCell !== 0) {
          const X = direction === 'left' || direction === 'right' ? shift : 0;
          const Y = direction === 'up' || direction === 'down' ? shift : 0;

          cell.style.transition = 'transform 0.3s'; // Додаємо анімацію
          cell.style.transform = `translate(${X}px, ${Y}px)`; // Переміщуємо клітинку

          // Повертаємо клітинку на місце після завершення анімації
          setTimeout(() => {
            requestAnimationFrame(() => {
              cell.classList.add('hidden-tile');
              cell.style.transition = 'none'; // Прибираєм анімацію
              cell.style.transform = 'none'; // Повертаємо клітинку на місце
            });
          }, 420); // Враховуємо час анімації
        }
      });
    });
  }
}

module.exports = Game;
