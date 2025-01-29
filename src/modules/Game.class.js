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
  }

  moveLeft() {
    this.handleMovement('left');
    this.addNewTile();

    setTimeout(() => {
      this.renderCells();
    }, 2000);
  }
  moveRight() {
    this.handleMovement('right');
    this.addNewTile();
    this.renderCells();
  }
  moveUp() {
    this.handleMovement('up');
    this.addNewTile();
    this.renderCells();
  }
  moveDown() {
    this.handleMovement('down');
    this.addNewTile();
    this.renderCells();
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

    // Якщо напрямок 'вгору' чи 'вниз' обертаю масив
    if (direction === 'up' || direction === 'down') {
      mergedTable = flipArray.rotateCounterClockwise(mergedTable);
    }

    // Тепер сортуємо та об'єдную рядки
    mergedTable = mergedTable.map((row) => {
      // function getCountOfShifts() {
      //   let countOfShifts = 0;

      //   if (direction === 'right' || direction === 'down') {
      //     const reversedRow = row.slice().reverse();

      //     reversedRow.forEach((el, index) => {

      //     });
      //   }

      //   if (direction === 'left' || direction === 'up') {
      //   }
      // }

      const sortedRow = sortZeros(row, direction);

      const mergedRow = () => {
        let countOfMerges = sortedRow.filter((el) => el === 0).length;

        for (let i = 0; i < sortedRow.length; i++) {
          if (sortedRow[i] === sortedRow[i + 1]) {
            countOfMerges++;

            sortedRow[i] += sortedRow[i + 1];
            this.score += sortedRow[i];

            if (sortedRow[i] === 2048) {
              this.endGame('win');
            }

            sortedRow[i + 1] = 0;
            i++; // Пропускаємо наступну ітерацію після злиття
          }
        }

        this.moveTileCSS(direction, countOfMerges);

        return sortZeros(sortedRow, direction);
      };

      return mergedRow();
    });

    // Якщо напрямок 'вгору' чи 'вниз' обертаю масив назад
    if (direction === 'up' || direction === 'down') {
      this.tableState = flipArray.rotateClockwise(mergedTable);
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
    this.addNewTile();
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

        if (value !== 0) {
          cell.style.transform = 'scale(1.05)';
        }

        if (value === 0) {
          cell.textContent = '';
        } else {
          cell.textContent = value;
        }

        cell.className = `field-cell field-cell${this.setColorOfCell(value)}`;

        // cell.style.transition = 'transform 0.2s ease';
        // cell.style.transform = 'translateX(-200px)';
      });
    });
  }

  setColorOfCell(cell) {
    switch (cell) {
      case 2:
        return '--2';
      case 4:
        return '--4';
      case 8:
        return '--8';
      case 16:
        return '--16';
      case 32:
        return '--32';
      case 64:
        return '--64';
      case 128:
        return '--128';
      case 256:
        return '--256';
      case 512:
        return '--512';
      case 1024:
        return '--1024';
      case 2048:
        return '--2048';
      default:
        return '--0';
    }
  }

  getShiftIndex(i, row, direction) {
    let shiftIndex = 0;
    let newRow = [...row];

    if (direction === 'right' || direction === 'down') {
      newRow = newRow.reverse();
    }

    if (i === 1) {
      switch (true) {
        case newRow[0] === 0:
        case newRow[0] === newRow[i]:
          shiftIndex++;

          break;
      }
    }

    if (i === 2) {
      switch (true) {
        case newRow[0] === 0:
        case newRow[1] === 0:
        case newRow[0] === newRow[i] && newRow[1] === 0:
        case newRow[1] === newRow[i]:
        case newRow[0] === newRow[1]:
      }
    }

    if (i === 3) {
      switch (true) {
        case newRow[0] === 0:
        case newRow[1] === 0:
        case newRow[2] === 0:
        case newRow[0] === newRow[i] && newRow[1] === 0 && newRow[2] === 0:
        case newRow[1] === newRow[i] &&
          newRow[2] === 0 &&
          newRow[0] !== newRow[1]:
        case newRow[2] === newRow[i] &&
          newRow[0] !== newRow[1] &&
          newRow[1] !== newRow[2]:
      }
    }

    return shiftIndex;
  }

  moveTileCSS(direction, shiftIndex) {
    const shift = shiftIndex * 90;

    this.pageRows.forEach((row) => {
      const cells = row.querySelectorAll('.field-cell');

      cells.forEach((cell) => {
        cell.style.transform = `translate(
          ${direction === 'left' || direction === 'right' ? `${shift}px` : 0}px,
          ${direction === 'up' || direction === 'down' ? `${shift}px` : 0}px
        )`;
      });
    });
  }
}

module.exports = Game;
