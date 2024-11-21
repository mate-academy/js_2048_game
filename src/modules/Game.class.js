'use strict';

class Game {
  constructor(initialState = null) {
    // Якщо початковий стан не передано, створюємо порожню дошку
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'playing'; // Статус гри: playing, win, lose
  }

  createEmptyBoard() {
    const board = [];

    for (let i = 0; i < 4; i++) {
      board.push([0, 0, 0, 0]);
    }

    return board;
  }

  getState() {
    return this.board;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    // Перевірка на перемогу (2048)
    for (const row of this.board) {
      for (const tile of row) {
        if (tile === 2048) {
          this.status = 'win';

          return 'win';
        }
      }
    }

    // Перевірка на програш (немає доступних ходів)
    if (!this.hasAvailableMoves()) {
      this.status = 'lose';

      return 'lose';
    }

    // Гра ще триває
    return 'playing';
  }

  hasEmptyCells() {
    for (const row of this.board) {
      for (const tile of row) {
        if (tile === 0) {
          return true;
        }
      }
    }

    return false;
  }

  canMerge() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return true;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  hasAvailableMoves() {
    return this.hasEmptyCells() || this.canMerge();
  }

  moveLeft() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = this.board[i];
      const newRow = this.mergeRow(row);

      if (newRow.some((tile, index) => tile !== row[index])) {
        moved = true;
      }
      this.board[i] = newRow;
    }

    if (moved) {
      this.addRandomTile(); // Додаємо нову плитку
    }
    this.updateUI(); // Оновлюємо інтерфейс після руху
  }

  moveRight() {
    let moved = false;

    for (let i = 0; i < 4; i++) {
      const row = this.board[i];
      const reversedRow = [...row].reverse(); // Перевертаємо рядок
      const newRow = this.mergeRow(reversedRow); // Мерджимо рядок

      if (newRow.some((tile, index) => tile !== reversedRow[index])) {
        moved = true;
      }
      this.board[i] = newRow.reverse(); // Перевертаємо рядок назад
    }

    if (moved) {
      this.addRandomTile();
    }
    this.updateUI();
  }

  moveUp() {
    let moved = false;

    for (let j = 0; j < 4; j++) {
      const column = this.board.map((row) => row[j]);
      const newColumn = this.mergeRow(column);

      for (let i = 0; i < 4; i++) {
        this.board[i][j] = newColumn[i];
      }

      if (newColumn.some((tile, index) => tile !== column[index])) {
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
    }
    this.updateUI();
  }

  moveDown() {
    let moved = false;

    for (let j = 0; j < 4; j++) {
      // Перевертаємо стовпець
      const column = this.board.map((row) => row[j]).reverse();
      const newColumn = this.mergeRow(column);

      for (let i = 0; i < 4; i++) {
        this.board[i][j] = newColumn[3 - i]; // Перевертаємо стовпець назад
      }

      if (newColumn.some((tile, index) => tile !== column[index])) {
        moved = true;
      }
    }

    if (moved) {
      this.addRandomTile();
    }
    this.updateUI();
  }

  mergeRow(row) {
    // Видаляємо всі нулі
    const newRow = row.filter((tile) => tile !== 0);

    // Об'єднуємо плитки з однаковими значеннями
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2; // Подвоюємо плитку
        this.score += newRow[i]; // Додаємо до рахунку
        newRow.splice(i + 1, 1); // Видаляємо плитку після об'єднання
      }
    }

    // Додаємо нулі в кінець
    while (newRow.length < 4) {
      newRow.push(0);
    }

    return newRow;
  }

  start() {
    this.board = this.createEmptyBoard(); // Створюємо нову дошку
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile(); // Додаємо першу плитку
    this.addRandomTile(); // Додаємо ще одну плитку
    this.updateUI(); // Оновлюємо інтерфейс
  }

  restart() {
    this.start(); // Викликаємо start() для перезапуску гри
  }

  addRandomTile() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    } // Якщо немає порожніх клітинок, нічого не робимо

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const randomValue = Math.random() < 0.1 ? 4 : 2; // 10% шанс на плитку з 4

    this.board[randomCell[0]][randomCell[1]] = randomValue;
  }

  updateUI() {
    const gameStatus = this.getStatus();
    const startMessage = document.querySelector('.message-start');
    const winMessage = document.querySelector('.message-win');
    const loseMessage = document.querySelector('.message-lose');

    // Приховуємо повідомлення про старт
    startMessage.classList.add('hidden');

    // Показуємо повідомлення про перемогу або програш
    if (gameStatus === 'win') {
      winMessage.classList.remove('hidden');
      loseMessage.classList.add('hidden');
    } else if (gameStatus === 'lose') {
      loseMessage.classList.remove('hidden');
      winMessage.classList.add('hidden');
    } else {
      winMessage.classList.add('hidden');
      loseMessage.classList.add('hidden');
    }

    // Оновлення рахунку на інтерфейсі
    document.querySelector('.game-score').textContent = this.score;

    // Оновлення класів для клітинок
    // Отримуємо всі клітинки
    const cells = document.querySelectorAll('.field-cell');

    let cellIndex = 0; // Лічильник для перебору клітинок

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const tileValue = this.board[i][j]; // Значення плитки на дошці
        const cell = cells[cellIndex]; // Одержуємо поточну клітинку

        // Спочатку видаляємо всі старі класи
        cell.classList.remove(
          'field-cell--2',
          'field-cell--4',
          'field-cell--8',
          'field-cell--16',
          'field-cell--32',
          'field-cell--64',
          'field-cell--128',
          'field-cell--256',
          'field-cell--512',
          'field-cell--1024',
          'field-cell--2048',
        );

        // Якщо плитка не порожня, додаємо клас для цього значення
        if (tileValue !== 0) {
          cell.classList.add(`field-cell--${tileValue}`);
          cell.textContent = tileValue; // Встановлюємо текст плитки
        } else {
          cell.textContent = ''; // Якщо плитка порожня, очищаємо текст
        }

        cellIndex++; // Переходимо до наступної клітинки
      }
    }
  }

  updateScoreDisplay() {
    const scoreElement = document.querySelector('.score');

    scoreElement.textContent = this.score;
  }

  checkGameStatus() {
    const statuses = this.getStatus();
    const messageElement = document.querySelector('.game-status');

    if (statuses === 'win') {
      messageElement.textContent = 'You Win!';
    } else if (statuses === 'lose') {
      messageElement.textContent = 'Game Over!';
    } else {
      messageElement.textContent = 'Keep Going!';
    }
  }
}

module.exports = Game;
