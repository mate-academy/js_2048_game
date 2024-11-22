/* eslint-disable prefer-const */
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
  initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
   */
  // TODO: Замінити по індексу числа
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    // eslint-disable-next-line no-console
    console.log(this.initialState);
  }

  moveLeft() {
    for (const row of this.initialState) {
      // 1. Видаляємо всі нулі
      let numbers = row.filter((num) => num !== 0);

      // 2. Об'єднуємо однакові числа
      for (let i = 0; i < numbers.length - 1; i++) {
        if (numbers[i] === numbers[i + 1]) {
          numbers[i] *= numbers[i]; // Об'єднуємо
          numbers[i + 1] = 0; // Очищуємо наступну клітинку
        }
      }

      // 3. Видаляємо нові нулі після об'єднання
      numbers = numbers.filter((num) => num !== 0);

      // 4. Заповнюємо рядок нулями праворуч
      const newRow = numbers.concat(Array(row.length - numbers.length).fill(0));

      // 5. Оновлюємо рядок у `this.initialState`
      row.length = 0;
      row.push(...newRow);
    }

    this.addRandomOneNumber();
    // eslint-disable-next-line no-console
    console.log(this.initialState);
  }

  moveRight() {
    for (const row of this.initialState) {
      let numbers = row.filter((num) => num !== 0);

      for (let i = numbers.length - 1; i > 0; i--) {
        if (numbers[i] === numbers[i - 1]) {
          numbers[i] *= numbers[i];
          numbers[i - 1] = 0;
        }
      }

      numbers = numbers.filter((num) => num !== 0);

      const newRow = Array(row.length - numbers.length)
        .fill(0)
        .concat(numbers);

      row.length = 0;
      row.push(...newRow);
    }
    this.addRandomOneNumber();
    // eslint-disable-next-line no-console
    console.log(this.initialState);
  }
  moveUp() {
    for (let col = 0; col < this.initialState[0].length; col++) {
      // Створюємо масив для кожної колонки, видаляючи нулі
      let column = this.initialState
        .map((row) => row[col])
        .filter((num) => num !== 0);

      // Об'єднуємо однакові числа
      for (let i = 0; i < column.length - 1; i++) {
        if (column[i] === column[i + 1]) {
          column[i] *= column[i]; // Об'єднуємо числа
          column[i + 1] = 0; // Очищуємо наступну клітинку
        }
      }

      // Видаляємо всі нулі, які з'явилися після об'єднання
      column = column.filter((num) => num !== 0);

      // Додаємо нулі в кінець, щоб заповнити колонку до повної довжини
      const newColumn = column.concat(
        Array(this.initialState.length - column.length).fill(0),
      );

      // Записуємо нові значення в колонку
      for (let row = 0; row < this.initialState.length; row++) {
        this.initialState[row][col] = newColumn[row];
      }
    }

    this.addRandomOneNumber();
    // eslint-disable-next-line no-console
    console.log(this.initialState);
  }

  // довн не працює
  moveDown() {
    for (let col = 0; col < this.initialState[0].length; col++) {
      // Створюємо масив для кожної колонки
      let column = this.initialState
        .map((row) => row[col])
        .filter((num) => num !== 0);

      // Об'єднуємо однакові числа, починаючи знизу
      // рухаємось знизу вверх по колонці, не рядку
      // якщо ми бачимо, що цей елемент {і} === {і - 1}
      // тобто дорівнює попередньому елементу, то ми множимо числа на 2
      // TODO: зробити типу такої логіки з двійкою, але можна винести
      // TODO: поточне число в окрему змінну
      for (let i = column.length - 1; i > 0; i--) {
        if (column[i] === column[i - 1]) {
          column[i] *= column[i]; // Об'єднуємо числа
          column[i - 1] = 0; // Очищуємо об'єднану клітинку
        }
      }

      // Видаляємо нулі після об'єднання
      column = column.filter((num) => num !== 0);

      // Додаємо нулі на початок, щоб заповнити верх колонки
      // Відніманням ми визначаємо скільки нулів потрібно, щоб заповнити простір
      // недостающий нулями this.initialState.length - column.length
      //  конкат та філ з'єднує числа які в нас є з нулями в 1 колонку
      const newColumn = Array(this.initialState.length - column.length)
        .fill(0)
        .concat(column);

      // Записуємо нові значення в колонку
      for (let row = 0; row < this.initialState.length; row++) {
        this.initialState[row][col] = newColumn[row];
      }
    }

    this.addRandomOneNumber();
    // eslint-disable-next-line no-console
    console.log(this.initialState);
  }

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
  getStatus() {
    // повертає видозмінений масив
    // eslint-disable-next-line no-console
    console.log(this.initialState);
  }

  /**
   * Starts the game.
   */
  start() {
    this.state = [...this.initialState]; // Скидаємо поле до початкового стану
    this.addRandomNumber(); // Додаємо два числа 2 на випадкові позиції
  }

  // Метод для додавання випадкових двійок на поле
  addRandomNumber() {
    let emptyCells = [];

    // Збираємо всі порожні клітинки
    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ rowIndex, colIndex });
        }
      });
    });

    // Вибираємо дві випадкові клітинки
    for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { rowIndex, colIndex } = emptyCells[randomIndex];

      this.state[rowIndex][colIndex] = 2; // Поміщаємо двійку в клітинку
      emptyCells.splice(randomIndex, 1);
    }
  }

  addRandomOneNumber() {
    let emptyCells = [];

    // Збираємо всі порожні клітинки
    this.state.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push({ rowIndex, colIndex });
        }
      });
    });

    // Вибираємо дві випадкові клітинки
    for (let i = 0; i < 1; i++) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { rowIndex, colIndex } = emptyCells[randomIndex];

      this.state[rowIndex][colIndex] = 2; // Поміщаємо двійку в клітинку
      emptyCells.splice(randomIndex, 1);
    }
  }
  /**
   * Resets the game.
   */
  restart() {}

  // Add your own methods here
}

module.exports = Game;
