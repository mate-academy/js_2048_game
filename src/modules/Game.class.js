'use strict';

class Game {
  constructor(initialState) {
    this.score = 0;
    this.gameActive = false;
  }

  getScore(value) {
    this.score += value;
    document.querySelector('.game-score').textContent = this.score;
  }

  start(button, hideMessages, spawnNumbers) {
    this.score = 0;
    this.gameActive = true;
    this.getScore(0);
    hideMessages();
    button.textContent = 'Restart';
    button.classList.remove('start');
    button.classList.add('restart');
    spawnNumbers();
  }

  restart(button, hideMessages, spawnNumbers) {
    const cells = document.querySelectorAll('.field-cell');

    cells.forEach((cell) => {
      cell.textContent = '';
      cell.className = 'field-cell';
    });

    this.score = 0;
    this.getScore(0);
    button.classList.remove('restart');
    button.classList.add('start');
    this.start(button, hideMessages, spawnNumbers);
  }

  moveLeft(hideMessages) {
    const rows = document.querySelectorAll('.field-row');

    rows.forEach((row) => {
      const merged = [false, false, false, false];

      for (let col = 1; col < 4; col++) {
        let cell = row.children[col];

        if (cell.textContent !== '') {
          let currentCol = col;

          while (currentCol > 0) {
            const targetCell = row.children[currentCol - 1];

            if (targetCell.textContent === '') {
              targetCell.textContent = cell.textContent;
              targetCell.className = cell.className;
              cell.textContent = '';
              cell.className = 'field-cell';
              cell = targetCell;
            } else if (
              targetCell.textContent === cell.textContent &&
              !merged[currentCol - 1]
            ) {
              const newValue = parseInt(targetCell.textContent) * 2;

              targetCell.textContent = newValue.toString();
              targetCell.className = `field-cell field-cell--${newValue}`;
              cell.textContent = '';
              cell.className = 'field-cell';
              merged[currentCol - 1] = true;
              this.getScore(newValue);

              if (newValue === 2048) {
                hideMessages();

                document
                  .querySelector('.message-win')
                  .classList.remove('hidden');
                this.gameActive = false;
              }
              break;
            } else {
              break;
            }
            currentCol--;
          }
        }
      }
    });
  }

  moveRight(hideMessages) {
    const rows = document.querySelectorAll('.field-row');

    rows.forEach((row) => {
      const merged = [false, false, false, false];

      for (let col = 2; col >= 0; col--) {
        let cell = row.children[col];

        if (cell.textContent !== '') {
          let currentCol = col;

          while (currentCol < 3) {
            const targetCell = row.children[currentCol + 1];

            if (targetCell.textContent === '') {
              targetCell.textContent = cell.textContent;
              targetCell.className = cell.className;
              cell.textContent = '';
              cell.className = 'field-cell';
              cell = targetCell;
            } else if (
              targetCell.textContent === cell.textContent &&
              !merged[currentCol + 1]
            ) {
              const newValue = parseInt(targetCell.textContent) * 2;

              targetCell.textContent = newValue.toString();
              targetCell.className = `field-cell field-cell--${newValue}`;
              cell.textContent = '';
              cell.className = 'field-cell';
              merged[currentCol + 1] = true;
              this.getScore(newValue);

              if (newValue === 2048) {
                hideMessages();

                document
                  .querySelector('.message-win')
                  .classList.remove('hidden');
                this.gameActive = false;
              }
              break;
            } else {
              break;
            }
            currentCol++;
          }
        }
      }
    });
  }

  moveUp(hideMessages) {
    const rows = document.querySelectorAll('.field-row');

    for (let col = 0; col < 4; col++) {
      const merged = [false, false, false, false];

      for (let row = 1; row < 4; row++) {
        let cell = rows[row].children[col];

        if (cell.textContent !== '') {
          let currentRow = row;

          while (currentRow > 0) {
            const targetCell = rows[currentRow - 1].children[col];

            if (targetCell.textContent === '') {
              targetCell.textContent = cell.textContent;
              targetCell.className = cell.className;
              cell.textContent = '';
              cell.className = 'field-cell';
              cell = targetCell;
            } else if (
              targetCell.textContent === cell.textContent &&
              !merged[currentRow - 1]
            ) {
              const newValue = parseInt(targetCell.textContent) * 2;

              targetCell.textContent = newValue.toString();
              targetCell.className = `field-cell field-cell--${newValue}`;
              cell.textContent = '';
              cell.className = 'field-cell';
              merged[currentRow - 1] = true;
              this.getScore(newValue);

              if (newValue === 2048) {
                hideMessages();

                document
                  .querySelector('.message-win')
                  .classList.remove('hidden');
                this.gameActive = false;
              }
              break;
            } else {
              break;
            }
            currentRow--;
          }
        }
      }
    }
  }

  moveDown(hideMessages) {
    const rows = document.querySelectorAll('.field-row');

    for (let col = 0; col < 4; col++) {
      const merged = [false, false, false, false];

      for (let row = 2; row >= 0; row--) {
        let cell = rows[row].children[col];

        if (cell.textContent !== '') {
          let currentRow = row;

          while (currentRow < 3) {
            const targetCell = rows[currentRow + 1].children[col];

            if (targetCell.textContent === '') {
              targetCell.textContent = cell.textContent;
              targetCell.className = cell.className;
              cell.textContent = '';
              cell.className = 'field-cell';
              cell = targetCell;
            } else if (
              targetCell.textContent === cell.textContent &&
              !merged[currentRow + 1]
            ) {
              const newValue = parseInt(targetCell.textContent) * 2;

              targetCell.textContent = newValue.toString();
              targetCell.className = `field-cell field-cell--${newValue}`;
              cell.textContent = '';
              cell.className = 'field-cell';
              merged[currentRow + 1] = true;
              this.getScore(newValue);

              if (newValue === 2048) {
                hideMessages();

                document
                  .querySelector('.message-win')
                  .classList.remove('hidden');
                this.gameActive = false;
              }
              break;
            } else {
              break;
            }
            currentRow++;
          }
        }
      }
    }
  }
}

module.exports = Game;
