'use strict';

class Game {
  constructor(initialState) {
    // зберігаємо стан гри який було передано до нашого обєкта
    this.initialState = initialState;

    // тепер зберігаємо стан ношої гри (дошки)
    // якщо було передано, якщо ні то за замовчуванням
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    // початковий рахунок 0
    this.boardScore = 0;

    // поточний статус ставимо 'idle'-(непрацюючий)
    this.currentStatus = 'idle'; // 'playing', 'win', 'lose'

    // !!!!тут поки не розумію що до чого потрібно буде додати коменти
    this.isAbleToMove = true;
    this.isGameActive = false;
    this.isGameWon = false;
    this.isGameLost = false;
  }

  // тут думаю теж зрозуміло
  // викликаємо функцію за натиском клавіши
  // moveLeft() і інші викликаються в 'main.js'
  moveLeft() {
    if (this.isGameActive) {
      this.moveTo('left');
    }
  }
  moveRight() {
    if (this.isGameActive) {
      this.moveTo('right');
    }
  }
  moveUp() {
    if (this.isGameActive) {
      this.moveTo('up');
    }
  }
  moveDown() {
    if (this.isGameActive) {
      this.moveTo('down');
    }
  }

  getScore() {
    return this.boardScore;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    switch (true) {
      case this.isGameWon:
        this.currentStatus = 'win';
        break;
      case this.isGameLost:
        this.currentStatus = 'lose';
        break;
      case this.isGameActive:
        this.currentStatus = 'playing';
        break;
      default:
        this.currentStatus = 'idle';
        break;
    }

    return this.currentStatus;
  }

  start() {
    this.isGameActive = true;
    this.placeNewCell();
    this.placeNewCell();
  }

  restart() {
    /**
     * не проходить один тест коли при рестарті
     * потрібно повернути initialState
     *
     *    const INITIAL_STATE = [
      [2, 2, 4, 4],
      [2, 2, 4, 4],
      [2, 2, 4, 4],
      [0, 0, 4, 4],
    ];
     *
     * але коли роблю так:
     * this.board = this.initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
     * то тести виснуть і не завершуються
     *
     *
     *
     */
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.boardScore = 0;

    this.currentStatus = 'idle';
    this.isGameActive = false;
    this.isGameWon = false;
    this.isGameLost = false;
  }

  placeNewCell() {
    let randomRow, randomColumn;

    do {
      randomRow = Math.floor(Math.random() * 4);
      randomColumn = Math.floor(Math.random() * 4);
    } while (this.board[randomRow][randomColumn] !== 0);

    this.board[randomRow][randomColumn] = this.createCell();
  }

  createCell() {
    const randomValue = Math.random();

    return randomValue < 0.1 ? 4 : 2;
  }

  // ==========================================================
  // функція переміщення плиток з номерами відповідно до 'direction'
  moveTo(direction) {
    if (!this.isGameActive) {
      return;
    }

    const numColumns = this.board[0].length; // завжди буде 4 (я так гадаю)

    // тут ми робимо глибоку копію масива 'this.board'
    // 'JSON.stringify()'- робить з обєкта строку а потім
    // 'JSON.parse()' уже перетворює строку в обєкт (в нашому випадку масив)
    // !!!чому ми робимо саме глибоку копію???
    // тому що вона нам робить копію і масивів всередені масиву
    // а не просто посилання на них
    let currentTable = JSON.parse(JSON.stringify(this.board));

    // змінна для підрахунку очок гри
    let addScore = 0;

    // !!! так тут трішки для мене складнувато!!!
    // !!! навіщо ми це робимо потрібно теж розібратись!!!!
    // що ми тут робимо???
    // ми перетворюємо строки в колонки
    // зовнішній 'map' приймає тільки індекси а внутрішній формує
    // формує рядки з однаковими індексами
    const transpose = (table) => {
      return table[0].map((_, colIndex) => table.map((row) => row[colIndex]));
      // return table.map((_, colIndex) => table.map(row => row[colIndex]));
    };

    // !!! тут більш зрозуміліше що ми робимо але поки що
    // не зрозуміло навіщо!!!!
    const reverseRow = (table) => {
      return table.map((row) => row.slice().reverse());
    };

    // тут у нас виходить зсув ВПРАВО всієї дошки
    const moveTable = (table) => {
      // створюємо копію вхідного 'table'
      const newTable = table.map((row) => {
        // створюємо нові рядки в 'table' без нулів 0
        // [0, 2, 4, 0] ==> [2, 4]
        let newRow = row.filter((num) => num !== 0);
        // тут ми отримуємо значення скільки нулів потрібно додати
        const zerosToAdd = numColumns - newRow.length;

        // ми копіюємо 'newRow' з новим масивом з нулями який
        // створюємо
        // [2, 4] ==> [0, 0, 2, 4]
        // (здвигаємо їх щоб вони були поруч для цикла)
        newRow = [...Array(zerosToAdd).fill(0), ...newRow];

        // якщо плитки однакові ОБЄДНУЄМО
        for (let i = newRow.length; i >= 0; i--) {
          if (newRow[i - 1] === newRow[i]) {
            newRow[i - 1] *= 2;
            newRow[i] = 0;
            addScore += newRow[i - 1];
            i--;
          }
        }

        // знову прибираємо нулі щоб здвинути до краю
        // [0, 2, 4, 0] ==> [2, 4]
        newRow = newRow.filter((num) => num !== 0);

        // скільки додати нулів
        const zerosToAddEnd = numColumns - newRow.length;

        // знову додаємо нулі щоб числа були біля краю
        newRow = [...Array(zerosToAddEnd).fill(0), ...newRow];

        return newRow;
      });

      return newTable;
    };

    const isGameOver = () => {
      const GAME_FIELD = 4;

      // тут перевірка чи є хоч один нуль
      for (let i = 0; i < GAME_FIELD; i++) {
        for (let j = 0; j < GAME_FIELD; j++) {
          if (this.board[i][j] === 0) {
            return false;
          }
        }
      }

      // тут перевірка чи є по горизонталі однакові числа
      for (let i = 0; i < GAME_FIELD; i++) {
        for (let j = 0; j < GAME_FIELD; j++) {
          if (j < GAME_FIELD - 1 && this.board[i][j] === this.board[i][j + 1]) {
            return false;
          }

          // тут перевірка чи є по вертикалі однакові числа
          if (i < GAME_FIELD - 1 && this.board[i][j] === this.board[i + 1][j]) {
            return false;
          }
        }
      }

      // само собою якщо всі цикли нічого не повернули
      // то гра завершена
      this.isGameActive = false;
      this.isGameLost = true;

      return true;
    };

    const makeMove = (moveToSide) => {
      if (JSON.stringify(moveToSide) === JSON.stringify(currentTable)) {
        return;
      }

      this.board = moveToSide;
      currentTable = moveToSide;

      if (this.board.flat().includes(2048)) {
        this.isGameActive = false;
        this.isGameWon = true;

        this.getStatus();

        return;
      }

      this.placeNewCell();

      if (isGameOver()) {
        this.isAbleToMove = false;
      }
    };

    switch (direction) {
      case 'up':
        const moveUp = transpose(
          reverseRow(moveTable(reverseRow(transpose(currentTable)))),
        );

        makeMove(moveUp);

        this.boardScore += addScore;
        break;

      case 'down':
        const moveDown = transpose(moveTable(transpose(currentTable)));

        makeMove(moveDown);

        this.boardScore += addScore;
        break;

      case 'right':
        const moveRight = moveTable(currentTable);

        makeMove(moveRight);

        this.boardScore += addScore;
        break;

      case 'left':
        const moveLeft = reverseRow(moveTable(reverseRow(currentTable)));

        makeMove(moveLeft);

        this.boardScore += addScore;
        break;
    }
  }
}

module.exports = Game;
