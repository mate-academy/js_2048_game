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
    this.state = {
      newTiles: [],
      isAnimationTriggered: true,
      tableState: JSON.parse(JSON.stringify(Game.initialTable)),
      pageRows: pageRows,
      score: 0,
      best: 0,
      status: 'idle',
      isAnimating: false,
    };

    this.config = {
      transitionTime: 90, // ms
      renderTime: 100, // ms
    };
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

  checkGameOver(arr) {
    const copyArr = JSON.parse(JSON.stringify(arr));

    const isNoHorizontalMerges = copyArr.every((row) => {
      return row.every((cell, cellIndex) => {
        if (cell === 0) {
          return false;
        }

        if (cellIndex < row.length - 1) {
          return cell !== row[cellIndex + 1];
        }

        return true;
      });
    });

    const isNoVerticalMerges = this.rotateCounterClockwise(copyArr).every(
      (row) => {
        return row.every((cell, cellIndex) => {
          if (cell === 0) {
            return false;
          }

          if (cellIndex < row.length - 1) {
            return cell !== row[cellIndex + 1];
          }

          return true;
        });
      },
    );

    if (isNoHorizontalMerges && isNoVerticalMerges) {
      this.endGame();
    }
  }

  async executeMove(direction) {
    setTimeout(() => {
      this.state.isAnimating = false; // Анімація завершена
    }, this.config.renderTime + 20);

    if (this.state.isAnimating) {
      return;
    }

    this.state.isAnimating = true;

    this.renderTileCSS(direction); // Очікуємо завершення анімації плиток

    this.handleMovement(direction); // Виконуємо рух на полі

    setTimeout(() => {
      this.renderCells();
    }, this.config.renderTime);

    if (this.state.isAnimationTriggered) {
      this.addNewTile();
    }

    this.checkGameOver(this.state.tableState);
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
    let mergedTable = JSON.parse(JSON.stringify(this.state.tableState));

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
            this.state.score += sortedRow[i];

            if (sortedRow[i] === 137156) {
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

    if (this.isEqual(this.state.tableState, mergedTable)) {
      this.state.isAnimationTriggered = false;
    } else {
      this.state.isAnimationTriggered = true;
    }

    // Якщо напрямок 'вгору' чи 'вниз' обертаю масив назад
    if (direction === 'up' || direction === 'down') {
      mergedTable = this.rotateClockwise(mergedTable);
    }

    if (this.isEqual(this.state.tableState, mergedTable)) {
      this.state.isAnimationTriggered = false;
    } else {
      this.state.isAnimationTriggered = true;
    }

    this.state.tableState = mergedTable;
  }

  isEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) {
      return false;
    }

    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i].length !== arr2[i].length) {
        return false;
      }

      for (let j = 0; j < arr1[i].length; j++) {
        if (arr1[i][j] !== arr2[i][j]) {
          return false;
        }
      }
    }

    return true;
  }

  getScore() {
    return this.state.score;
  }

  getState() {
    return this.state.tableState;
  }

  getStatus() {
    return this.state.status;
  }

  start() {
    this.addNewTile();
    this.addNewTile();
    this.renderCells();

    this.state.status = 'playing';
  }

  restart() {
    this.clearTable();
    this.addNewTile();
    this.addNewTile();
    this.renderCells();

    if (this.state.score > this.state.best) {
      this.state.best = this.state.score;
      document.querySelector('.game-best').textContent = this.state.best;
    }

    this.state.score = 0;
    this.state.status = 'playing';

    document.querySelector('.message-win').classList.add('hidden');
    document.querySelector('.message-lose').classList.add('hidden');
  }

  endGame(gameStatus) {
    if (gameStatus === 'win') {
      this.state.status = 'win';
      document.querySelector('.message-win').classList.remove('hidden');
    } else {
      document.querySelector('.message-lose').classList.remove('hidden');
      this.state.status = 'lose';
    }

    if (this.state.score > this.state.best) {
      this.state.best = this.state.score;
      document.querySelector('.game-best').textContent = this.state.best;
    }
  }

  clearTable() {
    this.state.tableState = JSON.parse(JSON.stringify(Game.initialTable));

    this.state.pageRows.forEach((row) => {
      row.querySelectorAll('.field-cell').forEach((cell) => {
        cell.textContent = '';
        // cell.classList.remove('field-cell--some-class');
      });
    });
  }

  findEmptyCells() {
    const mainTable = this.state.tableState;
    const listOfEmptyCells = [];

    for (let i = 0; i < mainTable.length; i++) {
      for (let j = 0; j < mainTable[i].length; j++) {
        if (mainTable[i][j] === 0) {
          listOfEmptyCells.push([i, j]);
        }
      }
    }

    return listOfEmptyCells;
  }

  addNewTile() {
    const emtpyCells = this.findEmptyCells();

    if (emtpyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emtpyCells.length);
      const [randomRow, randomCol] = emtpyCells[randomIndex];
      const newTileValue = Math.random() < 0.1 ? 4 : 2;

      this.state.newTiles.push({
        newTileValue,
        rowIndex: randomRow,
        colIndex: randomCol,
      });

      this.state.tableState[randomRow][randomCol] = newTileValue;
    }
  }

  renderCells() {
    const fields = this.state.tableState;

    this.state.pageRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('.field-cell');

      cells.forEach((cell, cellIndex) => {
        const value = fields[rowIndex][cellIndex];
        const newTiles = this.state.newTiles;

        if (newTiles.length > 0) {
          newTiles.forEach((newTile) => {
            if (
              rowIndex === newTile.rowIndex &&
              cellIndex === newTile.colIndex
            ) {
              cell.classList.add('tile-popping');

              setTimeout(() => {
                cell.classList.remove('tile-popping');
                this.state.newTiles = [];
              }, this.config.renderTime);
            }
          });
        }

        if (value === 0) {
          cell.textContent = '';
          cell.classList.add('hidden-tile');
          cell.style.backgroundColor = '';
        } else {
          cell.textContent = value;
          cell.classList.remove('hidden-tile');
        }
        window.console.log(value);

        if (value !== 0) {
          const cellColors = this.getColorOfCell(value);

          cell.style.background = cellColors.backgroundColor;
          cell.style.color = cellColors.color;
        }
      });
    });
  }

  getColorOfCell(cell) {
    const colors = {
      2: { backgroundColor: '#eee4da', color: '#755e47' },
      4: { backgroundColor: '#ede0c8', color: '#755e47' },
      8: { backgroundColor: '#f2b179', color: '#ffffff' },
      16: { backgroundColor: '#f59563', color: '#ffffff' },
      32: { backgroundColor: '#f67c5f', color: '#ffffff' },
      64: { backgroundColor: '#f65e3b', color: '#ffffff' },
      128: { backgroundColor: '#edcf72', color: '#755e47' },
      256: { backgroundColor: '#edcc61', color: '#755e47' },
      512: { backgroundColor: '#edc850', color: '#755e47' },
      1024: { backgroundColor: '#edc53f', color: '#755e47' },
      2048: { backgroundColor: '#edc22e', color: '#755e47' },
    };

    return colors[cell];
  }

  // Додаємо таймер для плавності анімації
  renderTileCSS(direction) {
    let copyTable = JSON.parse(JSON.stringify(this.state.tableState));

    if (direction === 'up' || direction === 'down') {
      copyTable = this.rotateCounterClockwise(copyTable);
    }

    copyTable = copyTable.map((row) => {
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

    this.state.pageRows.forEach((row, rowIndex) => {
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

          cell.style.transition = `transform ${this.config.transitionTime}ms cubic-bezier(0.75, 0.65, 0.8, 1.12)`;
          cell.style.transform = `translate(${X}px, ${Y}px)`;

          // Повертаємо клітинку на місце після завершення анімації
          setTimeout(() => {
            requestAnimationFrame(() => {
              cell.style.transition = '';
              cell.style.transform = '';
            });
          }, this.config.renderTime); // Враховуємо час анімації
        }
      });
    });

    return copyTable.flat().every((el) => el === 0);
  }
}

module.exports = Game;
