'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
export default class Game {
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
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState;
    this.score = 0;
    // console.log(initialState);
  }

  moveLeft() {
    // eslint-disable-next-line no-shadow
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') {
        const activeCells = document.querySelectorAll(
          `.field-cell--2, .field-cell--4, .field-cell--8, .field-cell--16, .field-cell--32, .field-cell--64, .field-cell--128, .field-cell--256, .field-cell--512, .field-cell--1024, .field-cell--2048`,
        );
      }
    });
  }
  moveRight() {}
  moveUp() {}
  moveDown() {}

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
    this.score = 0;
    this.createNewCell();
    this.createNewCell();
    // console.log(this.board);
  }

  /**
   * Resets the game.
   */
  restart() {}

  createNewCell() {
    const emptyCell = [];

    this.board.forEach((row, rowIndex) => {
      row.forEach((cell, collIndex) => {
        if (cell === 0) {
          emptyCell.push({ row: rowIndex, col: collIndex });
        }
      });
    });

    if (emptyCell.length === 0) {
      // Если нет пустых ячеек, выход из метода или обработка случая,
      // когда доска заполнена
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCell.length);

    if (emptyCell[randomIndex]) {
      const { row: rowObj, col: colObj } = emptyCell[randomIndex];
      const cellValue = Math.random() < 0.9 ? 2 : 4;

      this.board[rowObj][colObj] = cellValue;

      const table = document.querySelector('.game-field');
      const rowElement = table.querySelectorAll('.field-row')[rowObj];
      const colElement = rowElement.querySelectorAll('.field-cell')[colObj];

      const newCell = document.createElement('div');

      newCell.classList.add(`field-cell--${cellValue}`);

      newCell.style.cssText =
        // eslint-disable-next-line max-len
        'display: flex; justify-content: center; align-items: center; height: 100%';

      newCell.textContent = cellValue;

      colElement.appendChild(newCell);
    }
  }
}
