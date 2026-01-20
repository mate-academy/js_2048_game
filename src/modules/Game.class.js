'use strict';

class Game {
  constructor(initialState) {
    this.cells = Array.from(document.querySelectorAll('td'));
    this.container = document.querySelector('.container');

    this.scoreElem = this.container.querySelector('.game-score');
    this.scoreValue = 0;

    this.gameField = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.createField();
    this.getState();
    this.updateScore();
    this.getStatus();
    this.getStart();

    window.addEventListener('keydown', (e) => {
      this.controlArrow(e);
    });
  }

  // Create field
  createField() {
    const flatField = this.gameField.flat();

    this.cells.forEach((cell, i) => {
      const value = flatField[i];

      // Очищуємо всі старі класи кольорів
      cell.className = 'field-cell';

      // Відображаємо число (або пусту клітинку, якщо 0)
      cell.textContent = value === 0 ? '' : value;

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });

    this.generateNumber();
    this.getStatus();
  }
  // Generate Number
  generateNumber() {
    const emptyCells = this.cells.filter((cell) => {
      return !Number(cell.textContent.trim());
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomNumber = Math.floor(Math.random() * emptyCells.length);

    emptyCells[randomNumber].textContent = Math.random() < 0.9 ? 2 : 4;
  }

  // Get State (refresh data)
  getState() {
    const data = this.cells.map((cell) => {
      return Number(cell.textContent) || 0;
    });

    this.gameField = [
      data.slice(0, 4),
      data.slice(4, 8),
      data.slice(8, 12),
      data.slice(12, 16),
    ];
    this.getStatus();
  }
  // Control Arrow
  controlArrow(e) {
    this.getState();
    this.updateScore();

    if (e.key === 'ArrowRight') {
      this.moveRight();
    } else if (e.key === 'ArrowLeft') {
      this.moveLeft();
    } else if (e.key === 'ArrowUp') {
      this.moveUp();
    } else if (e.key === 'ArrowDown') {
      this.moveDown();
    }
  }
  // Move Right
  moveRight() {
    this.gameField.forEach((row, index) => {
      const filterZero = row.filter((num) => num !== 0);

      for (let i = 0; i < filterZero.length - 1; i++) {
        if (filterZero[i] === filterZero[i + 1]) {
          filterZero[i] = filterZero[i] * 2;
          this.scoreValue += filterZero[i];
          filterZero[i + 1] = 0;
          i++;
        }
      }

      const filterZeroNew = filterZero.filter((num) => num !== 0);

      const missingZero = 4 - filterZeroNew.length;
      const zeros = Array(missingZero).fill(0);
      const concatRow = zeros.concat(filterZeroNew);

      this.gameField[index] = concatRow;
    });
    this.updateScore();
    this.createField();
    this.getState();
  }
  // Move Left
  moveLeft() {
    this.gameField.forEach((row, index) => {
      const filterZero = row.filter((num) => num !== 0);

      for (let i = 0; i < filterZero.length - 1; i++) {
        if (filterZero[i] === filterZero[i + 1]) {
          filterZero[i] = filterZero[i] * 2;
          this.scoreValue += filterZero[i];
          filterZero[i + 1] = 0;
          i++;
        }
      }

      const filterZeroNew = filterZero.filter((num) => num !== 0);

      const missingZero = Math.max(0, 4 - filterZeroNew.length);
      const zeros = Array(missingZero).fill(0);
      const concatRow = filterZeroNew.concat(zeros);

      this.gameField[index] = concatRow;
    });
    this.updateScore();
    this.createField();
    this.getState();
  }
  // Move Up
  moveUp() {
    const newVerticalField = [];

    for (let j = 0; j < this.gameField.length; j++) {
      // j - column, i -row
      const column = [];

      for (let i = 0; i < this.gameField.length; i++) {
        column.push(this.gameField[i][j]);
      }
      newVerticalField.push(column);
    }

    newVerticalField.forEach((row, index) => {
      const filterZero = row.filter((num) => num !== 0);

      for (let i = 0; i < filterZero.length - 1; i++) {
        // Merge neighbors
        if (filterZero[i] === filterZero[i + 1]) {
          filterZero[i] = filterZero[i] * 2;
          this.scoreValue += filterZero[i];
          filterZero[i + 1] = 0;
          i++;
        }
      }

      const filterZeroNew = filterZero.filter((num) => num !== 0);

      const missingZero = Math.max(0, 4 - filterZeroNew.length);
      const zeros = Array(missingZero).fill(0);
      const concatRow = filterZeroNew.concat(zeros);

      concatRow.forEach((value, rows) => {
        this.gameField[rows][index] = value;
      });
    });
    this.updateScore();
    this.createField();
    this.getState();
  }
  // Move Down
  moveDown() {
    const newVerticalField = [];

    for (let j = 0; j < this.gameField.length; j++) {
      const column = [];

      for (let i = 0; i < this.gameField.length; i++) {
        column.push(this.gameField[i][j]);
      }

      newVerticalField.push(column);
    }

    newVerticalField.forEach((row, index) => {
      const filterZero = row.filter((num) => num !== 0);

      for (let i = 0; i < filterZero.length - 1; i++) {
        /// / Merge neighbors
        if (filterZero[i] === filterZero[i + 1]) {
          filterZero[i] = filterZero[i] * 2;
          this.scoreValue += filterZero[i];
          filterZero[i + 1] = 0;
          i++;
        }
      }

      const filterZeroNew = filterZero.filter((num) => num !== 0);

      const missingZero = Math.max(0, 4 - filterZeroNew.length);
      const zeros = Array(missingZero).fill(0);
      const concatRow = zeros.concat(filterZeroNew);

      concatRow.forEach((value, rows) => {
        this.gameField[rows][index] = value;
      });
    });

    this.createField();
    this.getState();
    this.updateScore();
  }
  // Update score
  updateScore() {
    if (this.scoreElem) {
      this.scoreElem.textContent = this.scoreValue;
      // eslint-disable-next-line no-console
      console.log(this.scoreValue);
    }
  }
  // Get status
  getStatus() {
    const messageStart = document.querySelector('.message-start');
    const messageWin = document.querySelector('.message-win');
    const messageLose = document.querySelector('.message-lose');

    const isOccupied = this.gameField.flat().every((value) => {
      return value !== 0;
    });

    if (this.scoreValue >= 2048) {
      messageStart.classList.add('hidden');
      messageWin.className = 'message message-win';
    } else if (isOccupied) {
      messageStart.classList.add('hidden');
      messageLose.className = 'message message-lose';
    }
  }
  // Get Start
  getStart() {
    const buttonStart = this.container.querySelector('.start');
    const buttonRestart = this.container.querySelector('.restart');
    const messageStart = document.querySelector('.message-start');

    buttonStart.addEventListener('click', (e) => {
      if (e.target === buttonStart) {
        buttonStart.textContent = 'Restart';
        buttonStart.classList.remove('start');
        buttonStart.classList.add('restart');
        messageStart.classList.add('hidden');
        this.createField();
      } else if (e.target === buttonRestart) {
        buttonStart.classList.remove('restart');
        buttonStart.classList.add('start');
        // eslint-disable-next-line no-console
        console.log('after else if', buttonStart);
      }
    });
  }
}

//   /**
//    * @returns {number[][]}
//    */
//   getState() {}

//   /**
//    * Returns the current game status.
//    *
//    * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
//    } *
//    * `idle` - the game has not started yet (the initial state);
//    * `playing` - the game is in progress;
//    * `win` - the game is won;
//    * `lose` - the game is lost
//    */

//   /**
//    * Starts the game.
//    */
//   start() {}

//   /**
//    * Resets the game.
//    */
//   restart() {}

//   // Add your own methods here
// }

module.exports = Game;
