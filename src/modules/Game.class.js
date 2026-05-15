'use strict';
class Game {
  static StatusList = Object.freeze({
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  });

  static getEmptyBoard = () => {
    return [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
  };
  countStep = 0;

  static makeRandomNumberOnBoard(dataBoard, amountToAdd = 1) {
    const board = dataBoard || this.getEmptyBoard();

    // 1. Визначаємо кількість цифр для додавання:
    // Якщо кроків 0 — додаємо 2 цифри (початок гри), інакше — лише 1 цифру.

    // const amountToAdd = this.countStep === 0 ? 2 : 1;
    // this.countStep++;

    let placedNumbers = 0;
    // 2. Цикл працює, поки не поставимо потрібну кількість цифр

    while (board.flat().includes(0) && placedNumbers < amountToAdd) {
      const row = Math.floor(Math.random() * 4);
      const col = Math.floor(Math.random() * 4);

      // Перевіряємо, чи клітинка порожня
      if (board[row][col] === 0) {
        // 3. Логіка ймовірності:
        // Math.random() дає число від 0 до 1.
        // Якщо воно менше 0.1 (це і є 10%) — обираємо 4, інакше — 2.
        const newValue = Math.random() < 0.1 ? 4 : 2;

        board[row][col] = newValue;
        placedNumbers++;
      }
    }

    return board;
  }

  status = Game.StatusList.IDLE;
  score = 0;
  buttonStart = null;

  constructor(initialState) {
    this.state = initialState || Game.getEmptyBoard();
    this.buttonStart = document.querySelector('.start');
    this.cells = Array.from(document.querySelectorAll('.field-cell'));
    this.eventListenersSetup();
  }

  hasAvailableMoves() {
    const flatState = this.state.flat();
    // Якщо є порожні клітинки — ходи є

    if (flatState.includes(0)) {
      return true;
    }

    // Перевіряємо можливість об'єднання по горизонталі та вертикалі
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const current = this.state[r][c];

        if (
          (r < 3 && current === this.state[r + 1][c]) || // нижній сусід
          (c < 3 && current === this.state[r][c + 1]) // правий сусід
        ) {
          return true;
        }
      }
    }

    return false;
  }

  calculateNextState(direction) {
    if (this.status !== Game.StatusList.PLAYING) {
      return;
    }

    // 1. Створюємо копію поточного стану, щоб не змінювати оригінал одразу
    // (це важливо для порівняння: чи змінилося щось після ходу)

    let newState = JSON.parse(JSON.stringify(this.state));

    // 2. Допоміжна функція для обробки ОДНОГО рядка (логіка руху ВЛІВО)
    const slideRowLeft = (row) => {
      // КРОК А: Викидаємо всі нулі, залишаємо тільки цифри
      // Наприклад: [2, 0, 2, 4] стає [2, 2, 4]
      const numbers = [];

      for (let i = 0; i < row.length; i++) {
        if (row[i] !== 0) {
          numbers.push(row[i]);
        }
      }

      // КРОК Б: Об'єднуємо однакові цифри, що стоять поруч
      // Проходимо по масиву [2, 2, 4]
      for (let i = 0; i < numbers.length - 1; i++) {
        // Якщо поточне число дорівнює наступному
        if (numbers[i] === numbers[i + 1]) {
          numbers[i] = numbers[i] * 2; // Подвоюємо перше
          this.score += numbers[i]; // Додаємо бали в рахунок гри
          numbers[i + 1] = 0; // Друге перетворюємо на нуль (воно "зникло")
          i++; // Пропускаємо наступний елемент, бо ми його вже використали
        }
      }

      // КРОК В: Знову викидаємо нулі, які з'явилися після об'єднання
      // Наприклад: [4, 0, 4] стає [4, 4]
      const result = [];

      for (let i = 0; i < numbers.length; i++) {
        if (numbers[i] !== 0) {
          result.push(numbers[i]);
        }
      }

      // КРОК Г: Додаємо в кінець нулі, щоб довжина рядка знову була 4
      // Наприклад: [4, 4] стає [4, 4, 0, 0]
      while (result.length < 4) {
        result.push(0);
      }

      return result;
    };

    // 3. ПІДГОТОВКА ПОЛЯ ПЕРЕД ОБРОБКОЮ (Трансформація)
    // Якщо рух вправо — розвертаємо кожен рядок навпаки,
    // щоб рахувати як "вліво"
    if (direction === 'right') {
      for (let i = 0; i < 4; i++) {
        newState[i].reverse();
      }
    }

    // Якщо рух вгору — міняємо рядки та стовпці місцями (транспонування)
    if (direction === 'up') {
      newState = this.rotateMatrix(newState);
    }

    // Якщо рух вниз — міняємо місцями і розвертаємо
    if (direction === 'down') {
      newState = this.rotateMatrix(newState);

      for (let i = 0; i < 4; i++) {
        newState[i].reverse();
      }
    }

    // 4. ОСНОВНИЙ РОЗРАХУНОК:
    // Застосовуємо функцію slideRowLeft до кожного рядка
    for (let i = 0; i < 4; i++) {
      newState[i] = slideRowLeft(newState[i]);
    }

    // 5. ПОВЕРТАЄМО ПОЛЕ У ВИХІДНУ ФОРМУ (Зворотна трансформація)
    if (direction === 'right') {
      for (let i = 0; i < 4; i++) {
        newState[i].reverse();
      }
    }

    if (direction === 'up') {
      // Повертаємо стовпці назад у рядки
      newState = this.rotateMatrix(newState);
    }

    if (direction === 'down') {
      for (let i = 0; i < 4; i++) {
        newState[i].reverse();
      }
      newState = this.rotateMatrix(newState);
    }

    // Перевіряємо, чи змінилося поле після ходу
    if (JSON.stringify(this.state) === JSON.stringify(newState)) {
      return;
    }

    if (this.buttonStart.textContent !== 'Restart') {
      this.buttonStart.textContent = 'Restart';
      this.buttonStart.classList.replace('start', 'restart');
    }

    // 6. ОНОВЛЮЄМО СТАН ГРИ
    this.state = newState;

    // 7. Додаємо нове число (2 або 4) у випадкову порожню клітинку
    this.state = Game.makeRandomNumberOnBoard(this.state, 1);

    // 8
    if (this.state.flat().includes(2048)) {
      this.status = Game.StatusList.WIN;
      alert('You win!');
      // TODO: Додати виклик функції для показу повідомлення WIN
    }

    // 9
    if (this.status !== Game.StatusList.WIN && !this.hasAvailableMoves()) {
      this.status = Game.StatusList.LOSE;
      alert('Game Over!');
      // TODO: Додати виклик функції для показу повідомлення GAME OVER
    }
  }

  rotateMatrix(matrix) {
    const newMatrix = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        newMatrix[col][row] = matrix[row][col];
      }
    }

    return newMatrix;
  }

  updateView() {
    // Розгортаємо 2D масив [[0,2...], [0,0...]] у плаский [0, 2, 0, 0, 0, 0...]
    const flatState = this.state.flat();

    this.cells.forEach((cell, index) => {
      const value = flatState[index];

      cell.className = 'field-cell';

      if (value > 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.textContent = '';
        cell.className = 'field-cell';
      }
    });
  }

  moveLeft() {
    // eslint-disable-next-line no-console
    console.log('move left');
    this.calculateNextState('left');
    this.updateView();
  }
  moveRight() {
    // eslint-disable-next-line no-console
    console.log('move right');
    this.calculateNextState('right');
    this.updateView();
  }
  moveUp() {
    // eslint-disable-next-line no-console
    console.log('move up');
    this.calculateNextState('up');
    this.updateView();
  }
  moveDown() {
    // eslint-disable-next-line no-console
    console.log('move down');
    this.calculateNextState('down');
    this.updateView();
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start = () => {
    this.state = Game.makeRandomNumberOnBoard(null, 2);
    this.updateView();

    if (this.status !== Game.StatusList.IDLE) {
      this.restart();

      return;
    }

    this.status = Game.StatusList.PLAYING;
    // this.buttonStart.textContent = 'Restart';
    // this.buttonStart.classList.replace('start', 'restart');
  };

  restart() {
    this.state = Game.getEmptyBoard();
    this.score = 0;
    this.status = Game.StatusList.PLAYING;
    // Game.countStep = 0;
    this.state = Game.makeRandomNumberOnBoard(null, 2);
  }

  eventListenersSetup() {
    document.addEventListener('keydown', (events) => {
      if (
        ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(events.key)
      ) {
        events.preventDefault();
      }

      switch (events.key) {
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
      }
    });

    this.buttonStart.addEventListener('click', this.start);
  }
}

export default Game;
