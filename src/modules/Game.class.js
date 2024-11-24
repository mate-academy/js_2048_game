'use strict';
import * as Handlers from './functions';

class Game {
  constructor(initialState) {
    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    for (let i = 0; i < this.board.length; i++) {
      const container = [];

      // Збираємо всі ненульові елементи в контейнер
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== 0) {
          container.push(this.board[i][j]);
        }
      }

      // Об'єднуємо однакові елементи
      for (let k = container.length - 1; k > 0; k--) {
        if (container[k] === container[k - 1]) {
          container[k] *= 2; // Об'єднуємо елементи
          container[k - 1] = 0; // Обнуляємо елемент, що об'єднався
        }
      }

      // Забираємо нулі з сонтейнера
      const filteredContainer = container.filter((item) => item !== 0);

      while (filteredContainer.length < this.board[i].length) {
        filteredContainer.push(0); // Додаємо нулі зліва
      }
      this.board[i] = filteredContainer; // Записуємо результат в масив
    }
    this.board = addNumberToBoard(this.board);
    this.updateBoard();
  }

  moveRight() {
    for (let i = 0; i < this.board.length; i++) {
      const container = [];

      // Збираємо всі ненульові елементи в контейнер
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== 0) {
          container.push(this.board[i][j]);
        }
      }

      // Об'єднуємо однакові елементи
      for (let k = 0; k < container.length - 1; k++) {
        if (container[k] === container[k + 1]) {
          container[k + 1] *= 2; // Об'єднуємо елементи
          container[k] = 0; // Обнуляємо елемент, що об'єднався
          k++;
        }
      }

      // Забираємо нулі з сонтейнера
      const filteredContainer = container.filter((item) => item !== 0);

      while (filteredContainer.length < this.board[i].length) {
        filteredContainer.unshift(0); // Додаємо нулі зліва
      }
      this.board[i] = filteredContainer; // Записуємо результат в масив
    }
    this.board = addNumberToBoard(this.board);
    this.updateBoard();
  }

  moveUp() {
    for (let i = 0; i < this.board[0].length; i++) {
      const container = [];

      // Зберігаємо всі елементи поточного стовпця, ігноруючи нулі
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[j][i] !== 0) {
          container.push(this.board[j][i]);
        }
      }

      // Виконати злиття елементів у стовпці
      for (let k = 0; k < container.length - 1; k++) {
        if (container[k] === container[k + 1]) {
          container[k] *= 2;
          container[k + 1] = 0;
          k++;
        }
      }

      // Фільтруємо масив від нулів і додаємо їх в кінець
      const filteredContainer = container.filter((item) => item !== 0);

      // Додаємо нулі в кінець контейнера, якщо їх не вистачає
      while (filteredContainer.length < this.board.length) {
        filteredContainer.push(0);
      }

      // Записуємо результат в кожен стовпець масиву result
      for (let k = 0; k < filteredContainer.length; k++) {
        this.board[k][i] = filteredContainer[k];
      }
    }
    this.board = addNumberToBoard(this.board);
    this.updateBoard();
  }

  moveDown() {
    for (let i = 0; i < this.board[0].length; i++) {
      const container = [];

      // Зберігаємо всі елементи поточного стовпця, ігноруючи нулі
      for (let j = 0; j < this.board.length; j++) {
        if (this.board[j][i] !== 0) {
          container.push(this.board[j][i]);
        }
      }

      // Виконати злиття елементів у стовпці
      for (let k = 0; k < container.length - 1; k++) {
        if (container[k] === container[k + 1]) {
          container[k] *= 2;
          container[k + 1] = 0;
          k++;
        }
      }

      // Фільтруємо масив від нулів і додаємо їх в кінець
      const filteredContainer = container.filter((item) => item !== 0);

      // Додаємо нулі в кінець контейнера, якщо їх не вистачає
      while (filteredContainer.length < this.board.length) {
        filteredContainer.unshift(0);
      }

      // Записуємо результат в кожен стовпець масиву result
      for (let k = 0; k < filteredContainer.length; k++) {
        this.board[k][i] = filteredContainer[k];
      }
    }
    this.board = addNumberToBoard(this.board);
    this.updateBoard();
  }

  getScore() {
    const countScrore = (arr) => {
      return arr.reduce((sum, item) => {
        return sum + item.reduce((acc, current) => acc + current, 0);
      }, 0);
    };

    this.score = countScrore(this.board);
    updateScore(this.score);
  }

  getState() {
    if (this.status !== 'playing') {
      removeArrowKeyListener(Handlers.arrowHandlers);
    }

    if (this.start === 'playing') {
      addArrowKeyListener(Handlers.arrowHandlers);
    }
  }

  start() {
    this.status = 'playing';
    this.board = addNumberToBoard(this.board);
    addArrowKeyListener(Handlers.arrowHandlers);

    makeButtonChange(this.status);
    this.updateBoard();
  }

  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.score = 0;
    this.status = 'idle';
    makeButtonChange(this.status);
    this.updateBoard();
  }

  updateBoard() {
    // Отримуємо всі клітинки
    const cells = [...document.querySelectorAll('.field-cell')];
    const cellsArr = sliceArr(cells);

    // Заповнюємо клітинки данними з дошки
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        if (this.board[i][j] !== 0) {
          cellsArr[i][j].innerText = this.board[i][j];
        } else {
          cellsArr[i][j].innerText = '';
        }
        cellsArr[i][j].style.backgroundColor = getColor(this.board[i][j]);
      }
    }

    this.getScore();
    this.status = checkWinOrLose(this.board, this.status);
    changeMessage(this.status);
    this.getState();
  }
}

// Функція перетворення одновимірного масиву на масив 4х4
function sliceArr(arr) {
  const contaienr = [];

  for (let i = 0; i < arr.length; i = i + 4) {
    contaienr.push(arr.slice(i, i + 4));
  }

  return contaienr;
}

// Функція яка генерує рандомне число 2 або 4
function createNumberTwoOrFour(arr) {
  const numbers = [2, 2, 2, 2, 2, 4, 2, 2, 2, 2];
  const randomNumber = Math.floor(Math.random() * (9 + 1));

  return numbers[randomNumber];
}

// Функція яка генерує рандомне число в діапазоні 0-3 включно
function createNumberZeroToThree() {
  return Math.floor(Math.random() * (3 + 1));
}

// Функція генерує 2 або 4 на випадковому вільному місці
function addNumberToBoard(arr) {
  if (!arr.flat().includes(0)) {
    return arr;
  } // Перевірка на вільні клітинки

  let a, b;

  do {
    a = createNumberZeroToThree();
    b = createNumberZeroToThree();
  } while (arr[a][b] !== 0);

  arr[a][b] = createNumberTwoOrFour();

  return arr;
}

// Функція яка змінює напис в кнопці та встановлює відповідний EventListener
function makeButtonChange(stat) {
  const button = document.querySelector('.button');

  if (stat === 'playing') {
    button.innerHTML = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');

    button.removeEventListener('click', Handlers.handleStartClickWrapper);
    button.addEventListener('click', Handlers.handleRestartClickWrapper);
  }

  if (stat === 'idle') {
    button.innerHTML = 'Start';
    button.classList.add('start');
    button.classList.remove('restart');

    button.removeEventListener('click', Handlers.handleRestartClickWrapper);
    button.addEventListener('click', Handlers.handleStartClickWrapper);
  }
}

// Функція перевіряє статус гри
// та змінює класи на повідомленнях відповідно до статусу
function changeMessage(stat) {
  const messages = [...document.querySelectorAll('.message')];

  messages.forEach((item) => {
    if (item.classList.contains(`message-${stat}`)) {
      item.classList.remove('hidden');
    } else {
      item.classList.add('hidden');
    }

    if (stat === 'idle') {
      const start = document.querySelector('.message-start');

      start.classList.remove('hidden');
    }
  });
}

// Функція яка відображає рахунок
function updateScore(num) {
  const count = document.querySelector('.game-score');

  count.innerHTML = num;
}

// Перевірка чи є доступні ходи
function hasAvailableMoves(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[i].length; j++) {
      // Перевірка сусідніх клітинок (вгору, вниз, ліво, право)
      if (
        (i > 0 && board[i][j] === board[i - 1][j]) || // Вгору
        (i < board.length - 1 && board[i][j] === board[i + 1][j]) || // Вниз
        (j > 0 && board[i][j] === board[i][j - 1]) || // Ліво
        (j < board[i].length - 1 && board[i][j] === board[i][j + 1]) // Право
      ) {
        return true;
      }
    }
  }

  return false;
}

// Функція перевірка виграш чи прошраш
function checkWinOrLose(board, stat) {
  const array = board.flat();

  if (array.includes(2048)) {
    return 'win';
  }

  const clearArr = array.filter((item) => item !== 0);

  if (clearArr.length === 16 && !hasAvailableMoves(board)) {
    return 'lose';
  }

  return stat;
}

// Функція яка додає EventListener
let arrowKeyHandler;

function addArrowKeyListener(handlerMap) {
  arrowKeyHandler = (e) => {
    const handler = handlerMap[e.key];

    if (handler) {
      handler();
    }
  };

  document.addEventListener('keyup', arrowKeyHandler);
}

function removeArrowKeyListener() {
  if (arrowKeyHandler) {
    document.removeEventListener('keyup', arrowKeyHandler);
    arrowKeyHandler = null;
  }
}

// Функція ствоерення кольору для клітинок
function getColor(value) {
  if (value === 0) {
    return 'rgb(200, 200, 200)';
  }

  const maxColor = [255, 0, 0];
  const baseColor = [255, 255, 0];
  const scale = Math.log2(value) - 1;
  const factor = Math.min(scale / 10, 1);

  const color = baseColor.map((c, i) => {
    return Math.round(c + (maxColor[i] - c) * factor);
  });

  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
}
module.exports = Game;
