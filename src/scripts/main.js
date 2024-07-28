'use strict';
// cell - DOM элемент создается или выбирается по ID (ячейка/плиточка)
// field-cell - плитка

// Получение элементов DOM для работы с ними
const gameField = document.querySelector('.game-field');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');
const startMessage = document.querySelector('.message-start');
const buttonStart = document.querySelector('.start');

class Game {
  constructor(initialState) {
    // Установка начального состояния игрового поля
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.gameScore = 0; // Начальный счет
    this.rows = 4; // Количество строк на игровом поле
    this.columns = 4; // Количество столбцов на игровом поле

    // Инициализация отображения игрового поля
    this.initBoard();
  }

  // Метод для инициализации отображения игрового поля
  initBoard() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        const num = this.board[r][c]; // Получаем текущее значение клетки
        const cell = document.getElementById(`${r}-${c}`); // Находим ячейку по ID

        // Проверяем, существует ли клетка
        if (cell) {
          this.updateField(cell, num); // Обновляем отображение клетки
        }
      }
    }
  }

  // Метод для обновления конкретной клетки
  updateField(field, num) {
    field.innerText = num === 0 ? '' : num; // Устанав текст в завис от значения
    field.className = 'field-cell'; // Сбрасыв классы и устанав базовый класс

    if (num > 0) {
      // Добавляем класс в зависимости от значения клетки
      field.classList.add(`field-cell--${num}`);
    }
  }

  // Пример метода для обновления всей доски
  updateBoard(newBoard) {
    this.board = newBoard;
    this.initBoard(); // Обновляем отображение после изменения
  }

  // Метод для проверки наличия пустых клеток на поле
  hasEmptyCell() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if (this.board[r][c] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  // Метод для добавления "двойки" на случайную позицию
  setTwo() {
    if (!this.hasEmptyCell()) {
      return;
    }

    let found = false;

    while (!found) {
      // Случайное положение для добавления "двойки"
      const r = Math.floor(Math.random() * this.rows);
      const c = Math.floor(Math.random() * this.columns);

      if (this.board[r][c] === 0) {
        this.board[r][c] = 2;

        const cell = document.getElementById(`${r}-${c}`);

        cell.innerText = '2';
        cell.classList.add('field-cell--2');
        found = true;
      }
    }
  }

  // Метод для фильтрации нулевых значений из строки
  filterZero(row) {
    return row.filter((num) => num !== 0);
  }

  // Метод для перемещения плиток и объединения одинаковых
  move(row) {
    row = this.filterZero(row); // Удаление нулевых значений из строки

    // Объединение одинаковых плиток
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i] === row[i + 1]) {
        row[i] *= 2;
        row[i + 1] = 0;
        this.gameScore += row[i];
      }
    }

    row = this.filterZero(row); // [4, 2]

    // Добавляем нули в конец строки
    while (row.length < this.columns) {
      row.push(0);
    } // [4, 2, 0, 0]

    return row;
  }

  moveLeft() {
    for (let r = 0; r < this.rows; r++) {
      let row = this.board[r];
      row = this.move(row);
      this.board[r] = row;

      for (let c = 0; c < this.columns; c++) {
        const cell = document.getElementById(`${r}-${c}`);
        let num = this.board[r][c];

        this.updateField(cell, num); // Обновляем отображение клетки
      }
    }

    this.setTwo(); // Добавляем новую "двойку" после движения
  }

  // Метод для движения плиток вправо
  moveRight() {
    for (let r = 0; r < this.rows; r++) {
      let row = this.board[r];

      row.reverse();
      row = this.move(row);
      row.reverse();
      this.board[r] = row;

      for (let c = 0; c < this.columns; c++) {
        const cell = document.getElementById(`${r}-${c}`);
        let num = this.board[r][c];

        this.updateField(cell, num); // Обновляем отображение клетки
      }
    }

    this.setTwo(); // Добавляем новую "двойку" после движения
  }

  // Метод для движения плиток вверх
  moveUp() {
    for (let c = 0; c < this.columns; c++) {
      let row = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      row = this.move(row);
      this.board[0][c] = row[0];
      this.board[1][c] = row[1];
      this.board[2][c] = row[2];
      this.board[3][c] = row[3];

      for (let r = 0; r < this.rows; r++) {
        const cell = document.getElementById(`${r}-${c}`);

        let num = this.board[r][c];

        this.updateField(cell, num);
      }
    }

    this.setTwo(); // Добавляем новую "двойку" после движения
  }

  // Метод для движения плиток вниз
  moveDown() {
    for (let c = 0; c < this.columns; c++) {
      let row = [
        this.board[0][c],
        this.board[1][c],
        this.board[2][c],
        this.board[3][c],
      ];

      row.reverse();
      row = this.move(row);
      row.reverse();
      this.board[0][c] = row[0];
      this.board[1][c] = row[1];
      this.board[2][c] = row[2];
      this.board[3][c] = row[3];

      for (let r = 0; r < this.rows; r++) {
        const cell = document.getElementById(`${r}-${c}`);
        let num = this.board[r][c];

        this.updateField(cell, num);
      }
    }

    this.setTwo(); // Добавляем новую "двойку" после движения
  }

  // Метод для добавления обработчиков событий
  addEventListeners() {
    document.addEventListener('keyup', (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          this.moveLeft();
          break;
        case 'ArrowRight':
          this.moveRight();
          break;
        case 'ArrowUp':
          this.moveUp();
          break;
        case 'ArrowDown':
          this.moveDown();
          break;
        default:
          break;
      }
    });
  }

  // Метод для запуска игры
  start() {
    if (buttonStart) {
      buttonStart.addEventListener('click', (e) => {
        this.setTwo();
        this.addEventListeners();
      });
    }
  }

  restart() {
    this.gameScore = 0;
    this.getStatus();
  }

  // Метод для получения текущего счета
  getScore() {
    return this.getScore();
  }

  // Метод для получения текущего состояния игры
  getState() {
    return gameField();
  }

  /**
   * Метод для получения текущего статуса игры.
   * @returns {string} Один из вариантов: 'idle', 'playing', 'win', 'lose'
   *
   * 'idle' - игра еще не началась (начальное состояние);
   * 'playing' - игра идет;
   * 'win' - игра выиграна;
   * 'lose' - игра проиграна
   */
  getStatus() {
    const messageElement = document.querySelector('.message');

    if (this.gameScore >= 2048) {
      messageElement.classList.add(winMessage);
    }

    if (this.gameScore === 0) {
      messageElement.classList.add(startMessage);
    }

    if (this.gameScore < 2048) {
      messageElement.classList.add(loseMessage);
    }
  }
}

const game = new Game(); // Создаем экземпляр игры

game.start(); // Запускаем игру

module.exports = Game; // Экспортируем класс для использования в других файлах
