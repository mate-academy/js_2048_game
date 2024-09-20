'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  static gameStatus = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.grid = initialState;
    this.score = 0;
    this.status = Game.gameStatus.idle;
  }

  getState() {
    return this.grid;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = Game.gameStatus.playing;
    this.addRandomTile();
    this.addRandomTile();
    this.renderBoard();
  }

  restart() {
    this.grid = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = Game.gameStatus.idle;
    this.renderBoard();
  }

  addRandomTile() {
    let row, col;

    do {
      row = Math.floor(Math.random() * 4);
      col = Math.floor(Math.random() * 4);
    } while (this.grid[row][col] !== 0);

    const randomValue = Math.random();

    if (randomValue < 0.9) {
      this.grid[row][col] = 2;
    } else {
      this.grid[row][col] = 4;
    }
  }

  renderBoard() {
    const cells = document.querySelectorAll('.field-cell');
    let index = 0;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = cells[index];

        cell.classList = 'field-cell';

        const value = this.grid[row][col];

        if (value !== 0) {
          cell.classList.add(`field-cell--${value}`);
          cell.textContent = value;
        } else {
          cell.textContent = '';
        }

        index++;
      }
    }
  }

  filterZero(row) {
    return row.filter((num) => num !== 0); // create a new array without zeroes
  }

  move(row) {
    let newRow = this.filterZero([...row]);

    // Обробляємо злиття плиток
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2; // Об'єднуємо плитки
        newRow[i + 1] = 0; // Очищаємо наступну плитку
        this.score += newRow[i]; // Додаємо значення до рахунку
      }
    }

    // Після злиття знову позбавляємось нулів
    newRow = this.filterZero(newRow);

    // Заповнюємо нулями до 4 елементів
    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  moveLeft() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
      let row = this.grid[r];
      const originalRow = [...row];

      row = this.move(row);

      if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
        moved = true;
      }

      this.grid[r] = row;
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkWin();
    this.checkLose();
    this.renderBoard();
    this.updateScore();
  }

  moveRight() {
    let moved = false;

    for (let r = 0; r < 4; r++) {
      let row = this.grid[r];
      const originalRow = [...row];

      row.reverse();
      row = this.move(row);
      row.reverse();

      if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
        moved = true;
      }

      this.grid[r] = row;
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkWin();
    this.checkLose();
    this.renderBoard();
    this.updateScore();
  }

  moveUp() {
    let moved = false;

    for (let c = 0; c < 4; c++) {
      let row = [
        this.grid[0][c],
        this.grid[1][c],
        this.grid[2][c],
        this.grid[3][c],
      ];
      const originalRow = [...row];

      row = this.move(row);

      if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
        moved = true;
      }
      this.grid[0][c] = row[0];
      this.grid[1][c] = row[1];
      this.grid[2][c] = row[2];
      this.grid[3][c] = row[3];
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkWin();
    this.checkLose();
    this.renderBoard();
    this.updateScore();
  }

  moveDown() {
    let moved = false;

    for (let c = 0; c < 4; c++) {
      let row = [
        this.grid[0][c],
        this.grid[1][c],
        this.grid[2][c],
        this.grid[3][c],
      ];
      const originalRow = [...row];

      row.reverse();
      row = this.move(row);
      row.reverse();

      if (JSON.stringify(originalRow) !== JSON.stringify(row)) {
        moved = true;
      }
      this.grid[0][c] = row[0];
      this.grid[1][c] = row[1];
      this.grid[2][c] = row[2];
      this.grid[3][c] = row[3];
    }

    if (moved) {
      this.addRandomTile();
    }
    this.checkWin();
    this.checkLose();
    this.renderBoard();
    this.updateScore();
  }

  updateScore() {
    const score = document.querySelector('.game-score');

    score.textContent = this.score;
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.grid[row][col] === 2048) {
          document
            .querySelector('.message.message-win')
            .classList.remove('hidden');
          this.status = Game.gameStatus.win;

          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.grid[row][col] === 0) {
          return false;
        }

        if (col < 3 && this.grid[row][col] === this.grid[row][col + 1]) {
          return false;
        }

        if (row < 3 && this.grid[row][col] === this.grid[row + 1][col]) {
          return false;
        }
      }
    }

    document.querySelector('.message.message-lose').classList.remove('hidden');
    this.status = Game.gameStatus.lose;

    return true;
  }
}

module.exports = Game;
