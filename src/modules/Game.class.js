'use strict';

class Game {
  constructor() {
    this.state = this.getState();
    this.gameStatus = 'idle';
    this.score = 0;
  }

  updateScore(newScore = 0) {
    this.score += newScore;

    const gameScore = document.querySelector('.game-score');

    gameScore.innerText = String(this.score);
  }

  getState() {
    const fieldRows = document.querySelectorAll('.field-row');

    return Array.from(fieldRows).map((row) => {
      return Array.from(row.children).map((cell) => {
        const cellContent = cell.textContent.trim();

        return isNaN(+cellContent) ? 0 : +cellContent;
      });
    });
  }

  messageController(msgClassName = null) {
    document.querySelectorAll('.message').forEach((el) => {
      if (msgClassName && el.classList.contains(msgClassName)) {
        el.classList.remove('hidden');
      } else {
        el.classList.add('hidden');
      }
    });
  }

  start() {
    this.reset();
    this.messageController();
    this.gameStatus = 'playing';
    this.addNewCell();
    this.updateField();
  }

  reset() {
    this.gameStatus = 'idle';
    this.score = 0;
    this.updateScore();
    this.messageController('message-start');
    this.updateField(true);
    this.state = this.getState();
  }

  addNewCell() {
    const newCellValue = Math.random() < 0.9 ? 2 : 4;
    const getEmptyCells = () => {
      return this.state.reduce((emptyCellsArr, row, rowIndex) => {
        row.forEach((cell, cellIndex) => {
          if (cell === 0) {
            emptyCellsArr.push([rowIndex, cellIndex]);
          }
        });

        return emptyCellsArr;
      }, []);
    };
    const emptyCells = getEmptyCells();

    if (!emptyCells.length) {
      return;
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[randomCell[0]][randomCell[1]] = newCellValue;
  }

  updateState(reverse = false, transform = false) {
    const transformField = (field) => {
      return field[0].map((_, colIndex) => field.map((row) => row[colIndex]));
    };

    let scoreCounter = 0;
    let stateCopy = this.state.map((row) => [...row]);

    if (transform) {
      stateCopy = transformField(stateCopy);
    }

    stateCopy = stateCopy.map((row) => {
      const filteredRow = [...row].filter((cell) => cell !== 0);

      if (reverse) {
        filteredRow.reverse();
      }

      for (let col = filteredRow.length - 1; col > 0; col--) {
        if (filteredRow[col] === filteredRow[col - 1]) {
          scoreCounter += filteredRow[col] * 2;
          filteredRow[col] *= 2;
          filteredRow.splice(col - 1, 1);
          col--;
        }
      }

      while (filteredRow.length < this.state[0].length) {
        filteredRow.unshift(0);
      }

      if (reverse) {
        filteredRow.reverse();
      }

      return filteredRow;
    });

    if (transform) {
      stateCopy = transformField(stateCopy);
    }

    const stateChanged =
      JSON.stringify(this.state) !== JSON.stringify(stateCopy);

    if (stateChanged) {
      this.state = stateCopy;
      this.addNewCell();
      this.updateField();
      this.updateScore(scoreCounter);
    }

    this.isGameOver();
  }

  moveUp() {
    this.updateState(true, true);
  }

  moveDown() {
    this.updateState(false, true);
  }

  moveRight() {
    this.updateState();
  }

  moveLeft() {
    this.updateState(true);
  }

  updateField(reset = false) {
    const fieldRows = document.querySelectorAll('.field-row');

    fieldRows.forEach((row, rowIndex) => {
      Array.from(row.children).forEach((cell, colIndex) => {
        let cellValue;

        if (!reset) {
          cellValue = this.state[rowIndex][colIndex];
        }

        cell.className = 'field-cell';

        if (cellValue !== 0 && !reset) {
          cell.innerText = cellValue;
          cell.classList.add(`field-cell--${cellValue}`);
        } else {
          cell.innerText = '';
        }
      });
    });

    if (this.state.flat(Infinity).includes(2048)) {
      this.gameStatus = 'win';
      this.messageController('message-win');
    }
  }

  isGameOver() {
    const size = this.state.length;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const current = this.state[row][col];

        if (current === 0) {
          return false;
        }

        if (col < size - 1 && current === this.state[row][col + 1]) {
          return false;
        }

        if (row < size - 1 && current === this.state[row + 1][col]) {
          return false;
        }
      }
    }

    this.gameStatus = 'lose';
    this.messageController('message-lose');

    return true;
  }
}

module.exports = Game;
