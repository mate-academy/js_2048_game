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
  constructor(initialState) {
    // eslint-disable-next-line no-console
    console.log(initialState);
    this.initialState = initialState;
  }
  #score = 0;
  static gameTable = document.querySelector('.game-field');

  moveLeft() {
    const rowsFromTable = Array.from(Game.gameTable.rows);

    rowsFromTable.forEach((row) => {
      let firstNum;
      let firstSpace = null;

      Array.from(row.cells).forEach((cell) => {
        if (cell.textContent === '' && firstSpace === null) {
          firstSpace = cell;
        } else if (cell.textContent !== '') {
          // Якщо в клітинці є число і воно співпадає
          // з посліднім числом ми їх з'єднуємо
          if (firstNum && firstNum.textContent === cell.textContent) {
            const newValue = parseFloat(firstNum.textContent) * 2;

            this.#score += newValue;
            firstNum.innerText = newValue;
            firstNum.className = `field-cell field-cell--${newValue}`;

            cell.innerText = '';
            cell.className = 'field-cell';

            firstSpace = firstNum.nextElementSibling;
            firstNum = null;
          } else if (firstSpace) {
            // Якщо в клітинці є число але воно не співпадає з посліднім числом
            // то ми намагаємося перемістити його в порожню клітинку
            firstSpace.innerText = cell.textContent;
            cell.innerText = '';
            cell.className = 'field-cell';
            firstNum = firstSpace;
            firstNum.className = `field-cell field-cell--${firstNum.textContent}`;
            firstSpace = firstNum.nextElementSibling;
          } else {
            // якщо і порожньої клітинки немає, то скоріще за все це перше число
            // в першій клітинці і ми просто його записуємо
            firstNum = cell;
          }
        }
      });
    });
  }
  moveRight() {
    const reverseRowsFromTable = Array.from(Game.gameTable.rows).reverse();

    reverseRowsFromTable.forEach((row) => {
      let firstNum;
      let firstSpace = null;
      const reverseArrayCells = Array.from(row.cells).reverse();

      reverseArrayCells.forEach((cell) => {
        if (cell.textContent === '' && firstSpace === null) {
          firstSpace = cell;
        } else if (cell.textContent !== '') {
          // Якщо в клітинці є число і воно співпадає
          // з посліднім числом ми їх з'єднуємо
          if (firstNum && firstNum.textContent === cell.textContent) {
            const newValue = parseFloat(firstNum.textContent) * 2;

            this.#score += newValue;
            firstNum.innerText = newValue;
            firstNum.className = `field-cell field-cell--${newValue}`;

            cell.innerText = '';
            cell.className = 'field-cell';

            firstSpace = firstNum.previousElementSibling;
            firstNum = null;
          } else if (firstSpace) {
            // Якщо в клітинці є число але воно не співпадає з посліднім числом
            // то ми намагаємося перемістити його в порожню клітинку
            firstSpace.innerText = cell.textContent;

            cell.innerText = '';
            cell.className = 'field-cell';

            firstNum = firstSpace;
            firstNum.className = `field-cell field-cell--${firstNum.textContent}`;

            firstSpace = firstNum.previousElementSibling;
          } else {
            // якщо і порожньої клітинки немає, то скоріще за все це перше число
            // в першій клітинці і ми просто його записуємо
            firstNum = cell;
          }
        }
      });
    });
  }
  moveUp() {
    const rowsFromTable = Array.from(Game.gameTable.rows);

    for (let i = 0; i < rowsFromTable.length; i++) {
      const cells = [
        rowsFromTable[0].cells[i],
        rowsFromTable[1].cells[i],
        rowsFromTable[2].cells[i],
        rowsFromTable[3].cells[i],
      ];
      let firstNum;
      let firstSpace = null;

      cells.forEach((cell) => {
        if (cell.textContent === '' && firstSpace === null) {
          firstSpace = cell;
        } else if (cell.textContent !== '') {
          if (firstNum && firstNum.textContent === cell.textContent) {
            const newValue = parseFloat(firstNum.textContent) * 2;
            const indexForNextCell = cells.indexOf(firstNum);

            this.#score += newValue;
            firstNum.innerText = newValue;
            firstNum.className = `field-cell field-cell--${newValue}`;

            cell.innerText = '';
            cell.className = 'field-cell';

            firstSpace = cells[indexForNextCell + 1];
            firstNum = null;
          } else if (firstSpace) {
            const indexForNextCell = cells.indexOf(firstSpace);

            firstSpace.innerText = cell.textContent;
            cell.innerText = '';
            cell.className = 'field-cell';
            firstNum = firstSpace;
            firstNum.className = `field-cell field-cell--${firstNum.textContent}`;
            firstSpace = cells[indexForNextCell + 1];
          } else {
            firstNum = cell;
          }
        }
      });
    }
  }
  moveDown() {
    const rowsFromTable = Array.from(Game.gameTable.rows);

    for (let i = 0; i < rowsFromTable.length; i++) {
      const cells = [
        rowsFromTable[0].cells[i],
        rowsFromTable[1].cells[i],
        rowsFromTable[2].cells[i],
        rowsFromTable[3].cells[i],
      ].reverse();
      let firstNum;
      let firstSpace = null;

      cells.forEach((cell) => {
        if (cell.textContent === '' && firstSpace === null) {
          firstSpace = cell;
        } else if (cell.textContent !== '') {
          if (firstNum && firstNum.textContent === cell.textContent) {
            const newValue = parseFloat(firstNum.textContent) * 2;
            const indexForNextCell = cells.indexOf(firstNum);

            this.#score += newValue;
            firstNum.innerText = newValue;
            firstNum.className = `field-cell field-cell--${newValue}`;

            cell.innerText = '';
            cell.className = 'field-cell';

            firstSpace = cells[indexForNextCell + 1];
            firstNum = null;
          } else if (firstSpace) {
            const indexForNextCell = cells.indexOf(firstSpace);

            firstSpace.innerText = cell.textContent;
            cell.innerText = '';
            cell.className = 'field-cell';
            firstNum = firstSpace;
            firstNum.className = `field-cell field-cell--${firstNum.textContent}`;
            firstSpace = cells[indexForNextCell + 1];
          } else {
            firstNum = cell;
          }
        }
      });
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.#score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    const rowsFromTable = Array.from(Game.gameTable.rows);
    const result = [];

    rowsFromTable.forEach((row) => {
      const rowValues = [];

      [...row.cells].forEach((cell) => {
        if (cell.textContent === '') {
          rowValues.push(0);
        } else {
          rowValues.push(parseInt(cell.textContent));
        }
      });

      result.push(rowValues);
    });

    return result;
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
  getStatus() {}

  /**
   * Starts the game.
   */
  start() {
    const rowsFromTable = Array.from(Game.gameTable.rows);

    if (this.initialState instanceof Array) {
      this.initialState.forEach((value, indexRow) => {
        const currentRow = rowsFromTable[indexRow];

        value.forEach((number, indexCell) => {
          const currentCell = currentRow.cells[indexCell];

          currentCell.classList.add(`field-cell--${number}`);
          currentCell.innerText = number;
        });
      });
    } else {
      for (let i = 0; i < 2; i++) {
        this.getRandomCell();
      }
    }
  }

  /**
   * Resets the game.
   */
  restart() {}

  getRandomNumber(minNumber, maxNumber) {
    const max = Math.floor(maxNumber);
    const min = Math.ceil(minNumber);

    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getRandomCell() {
    const rowsFromTable = Array.from(Game.gameTable.rows);
    const row = rowsFromTable[this.getRandomNumber(0, 3)];
    const cell = row.cells[this.getRandomNumber(0, 3)];

    if (cell.textContent === '') {
      const valueForCell = Math.random() < 0.1 ? 4 : 2;

      cell.classList.add(`field-cell--${valueForCell}`);
      cell.innerText = valueForCell;
    } else {
      this.getRandomCell();
    }
  }
}

module.exports = Game;
