/* eslint-disable no-shadow */
/* eslint-disable max-len */
/* eslint-disable prefer-const */
'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(initialState = null) {
    this.grid = initialState || this.createEmptyGrid();
    this.score = 0;
    this.status = 'game-start'; // 'game-start', 'game-over', 'game-win'
    this.won = false;
    this.addRandomTile(); // Начинаем с случайной плитки
  }

  // Создание пустого поля 4x4
  createEmptyGrid() {
    return [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
  }

  // Получить состояние игры (поле и счет)
  getState() {
    return this.grid;
  }

  // Получить текущий счет
  getScore() {
    return this.score;
  }

  // Получить статус игры ('game-start', 'game-over', 'game-win')
  getStatus() {
    return this.status;
  }

  // Начать игру заново (сбросить поле и счет)
  start() {
    this.grid = this.createEmptyGrid();
    this.score = 0;
    this.status = 'game-start';
    this.won = false;
    this.addRandomTile();
    this.addRandomTile(); // Две стартовые плитки
  }

  // Перезапуск игры (сброс)
  restart() {
    this.start();
  }

  // Добавить случайную плитку (2 или 4)
  addRandomTile() {
    let emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.grid[row][col] === null) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.grid[row][col] = Math.random() < 0.1 ? 4 : 2;
  }

  // Обработать перемещение клеток в заданном направлении
  move(direction) {
    let moved = false;

    if (direction === 'left') {
      for (let row = 0; row < 4; row++) {
        moved = this.moveRowLeft(row) || moved;
      }
    } else if (direction === 'right') {
      for (let row = 0; row < 4; row++) {
        moved = this.moveRowRight(row) || moved;
      }
    } else if (direction === 'up') {
      for (let col = 0; col < 4; col++) {
        moved = this.moveColumnUp(col) || moved;
      }
    } else if (direction === 'down') {
      for (let col = 0; col < 4; col++) {
        moved = this.moveColumnDown(col) || moved;
      }
    }

    if (moved) {
      this.addRandomTile(); // Добавляем новую случайную плитку после хода
    }

    return moved;
  }

  // Перемещение строки влево
  moveRowLeft(row) {
    let changed = false;
    let newRow = this.grid[row].filter((val) => val !== null); // Убираем пустые значения

    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] = newRow[i] * 2;
        this.score += newRow[i];
        newRow[i + 1] = null;
        changed = true;
      }
    }
    newRow = newRow.filter((val) => val !== null); // Убираем пустые значения

    while (newRow.length < 4) {
      newRow.push(null); // Дополняем до 4 элементов
    }
    this.grid[row] = newRow;

    return changed;
  }

  // Перемещение строки вправо (обратный порядок)
  moveRowRight(row) {
    this.grid[row] = this.grid[row].reverse();

    const changed = this.moveRowLeft(row);

    this.grid[row] = this.grid[row].reverse();

    return changed;
  }

  // Перемещение столбца вверх
  moveColumnUp(col) {
    let column = this.grid.map((row) => row[col]);
    let changed = this.moveRowLeft(column);

    for (let i = 0; i < 4; i++) {
      this.grid[i][col] = column[i];
    }

    return changed;
  }

  // Перемещение столбца вниз (обратный порядок)
  moveColumnDown(col) {
    let column = this.grid.map((row) => row[col]).reverse();
    let changed = this.moveRowLeft(column);

    for (let i = 0; i < 4; i++) {
      this.grid[i][col] = column[3 - i];
    }

    return changed;
  }

  // Проверка на окончание игры (нет доступных ходов)
  checkGameOver() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.grid[row][col] === null) {
          return false;
        }

        if (row < 3 && this.grid[row][col] === this.grid[row + 1][col]) {
          return false;
        }

        if (col < 3 && this.grid[row][col] === this.grid[row][col + 1]) {
          return false;
        }
      }
    }

    return true;
  }

  // Проверка на победу (2048 в любой клетке)
  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.grid[row][col] === 2048) {
          this.status = 'game-win';

          return true;
        }
      }
    }

    return false;
  }

  // Обработка нажатий клавиш
  handleKeyPress(event) {
    let moved = false;

    switch (event.key) {
      case 'ArrowLeft':
        moved = this.move('left');
        break;
      case 'ArrowRight':
        moved = this.move('right');
        break;
      case 'ArrowUp':
        moved = this.move('up');
        break;
      case 'ArrowDown':
        moved = this.move('down');
        break;
    }

    if (moved) {
      if (this.checkWin()) {
        this.status = 'game-win';
      } else if (this.checkGameOver()) {
        this.status = 'game-over';
      }
    }
  }
}

export default Game;
