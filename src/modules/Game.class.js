'use strict';

class Game {
  constructor(initialState) {
    this.cells = Array.from(document.querySelectorAll('td'));
    this.container = document.querySelector('.container');
    this.messageStart = document.querySelector('.message-start');

    this.scoreElem = this.container.querySelector('.game-score');
    this.scoreValue = 0;

    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.gameField = this.initialState.map((row) => [...row]);

    this.button = this.container.querySelector('button');

    this.button.addEventListener('click', () => {
      if (this.button.classList.contains('restart')) {
        this.getReset();
        this.getStart();
      } else {
        this.checkTheButton();
        this.updateScore();
        this.getStatus();
        this.createField();
      }
    });

    window.addEventListener('keydown', (e) => {
      const success = this.controlArrow(e);

      if (success) {
        this.checkTheButton();
      }
    });

    this.getStart();
  }

  createField() {
    const flatField = this.gameField.flat();

    this.cells.forEach((cell, i) => {
      const value = flatField[i];

      // Очищуємо всі старі класи кольорів
      cell.className = 'field-cell';

      cell.textContent = value === 0 ? '' : value;

      if (value > 0) {
        cell.classList.add(`field-cell--${value}`);
      }
    });
  }

  checkTheButton() {
    if (this.button.classList.contains('start')) {
      this.button.textContent = 'Restart';
      this.button.classList.remove('start');
      this.button.classList.add('restart');
      this.messageStart.classList.add('hidden');
    }
  }

  getReset() {
    this.scoreValue = 0;
    this.updateScore();
    this.gameField = this.initialState.map((row) => [...row]);

    this.cells.forEach((cell) => {
      cell.textContent = '';
      cell.className = 'field-cell';
    });

    this.createField();
  }

  getStart() {
    this.generateNumber();
    this.generateNumber();
    this.createField();
  }

  generateNumber() {
    const emptyCoords = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.gameField[r][c] === 0) {
          emptyCoords.push({ r, c });
        }
      }
    }

    if (emptyCoords.length === 0) {
      return null;
    }

    const randomCoord =
      emptyCoords[Math.floor(Math.random() * emptyCoords.length)];

    this.gameField[randomCoord.r][randomCoord.c] = Math.random() < 0.9 ? 2 : 4;

    // ПОВЕРТАЄМО об'єкт {r, c}, щоб controlArrow знав, де з'явилася плитка
    return randomCoord;
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
    // this.getStatus();
  }

  controlArrow(e) {
    const previousState = JSON.stringify(this.gameField);

    if (e.key === 'ArrowRight') {
      this.moveRight();
    } else if (e.key === 'ArrowLeft') {
      this.moveLeft();
    } else if (e.key === 'ArrowUp') {
      this.moveUp();
    } else if (e.key === 'ArrowDown') {
      this.moveDown();
    }

    // ПЕРЕВІРКА: Якщо масив змінився, значить хід відбувся
    if (previousState !== JSON.stringify(this.gameField)) {
      const newTileCoord = this.generateNumber();

      this.checkTheButton();
      this.updateScore();
      this.createField();
      this.getStatus();

      if (newTileCoord) {
        this.animateNewTile(newTileCoord.r, newTileCoord.c);
      }
    }
  }

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
  }

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
  }

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
  }

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
  }

  updateScore() {
    if (this.scoreElem) {
      this.scoreElem.textContent = this.scoreValue;
    }
  }

  getStatus() {
    const messageStart = document.querySelector('.message-start');
    const messageWin = document.querySelector('.message-win');
    const messageLose = document.querySelector('.message-lose');

    if (this.gameField.flat().includes(2048)) {
      messageStart.classList.add('hidden');
      messageWin.classList.remove('hidden');

      return;
    }

    const hasEmptyCells = this.gameField.flat().includes(0);

    if (hasEmptyCells) {
      return;
    }

    let canMerge = false;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.gameField[r][c];

        if (c < 3 && current === this.gameField[r][c + 1]) {
          canMerge = true;
          break;
        }

        if (r < 3 && current === this.gameField[r + 1][c]) {
          canMerge = true;
          break;
        }
      }

      if (canMerge) {
        break;
      }
    }

    if (!canMerge) {
      messageStart.classList.add('hidden');
      messageLose.classList.remove('hidden');
    }
  }

  animate({ duration, draw, timing }) {
    const start = performance.now();

    const step = (time) => {
      let timeFraction = (time - start) / duration;

      if (timeFraction > 1) {
        timeFraction = 1;
      }

      const progress = timing(timeFraction);

      draw(progress);

      if (timeFraction < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  animateNewTile(row, col) {
    const index = row * 4 + col;
    const cell = this.cells[index];

    if (!cell) {
      return;
    }

    this.animate({
      duration: 200,
      timing: (tf) => tf,
      draw: (progress) => {
        cell.style.transform = `scale(${progress})`;
        cell.style.opacity = progress;
      },
    });
  }
}

module.exports = Game;
