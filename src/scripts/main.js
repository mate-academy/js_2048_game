'use strict';

const button = document.querySelector('.start');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const counter = document.querySelector('.game-score');

const rows = document.querySelectorAll('tr');
const cells = document.querySelectorAll('td');

const tableSize = 4;

// Створення масиву з чотирьох елементів
const arrayCells = new Array(tableSize);

// цикл, аби пройтися по кожному елементу новоствореного масиву
// і присвоїти кожному елементу значення
for (let i = 0; i < arrayCells.length; i++) {
  // присвоєння кожному елементу з масиву
  // масуву з чотирьох нулів, один елемент [0, 0, 0, 0]
  arrayCells[i] = new Array(tableSize).fill(0);
}

let handleKeyDown = false;

// Старт або рестарт гри
button.addEventListener('click', e => {
  handleKeyDown = true;

  if (!button.classList.contains('restart')) {
    button.textContent = 'Restart';
    button.classList.add('restart');
    button.classList.remove('start');
    messageStart.classList.add('hidden');
  } else {
    for (const element of arrayCells) {
      element.fill(0);
    }

    updateTable();
  }

  generateRandomCell();
  generateRandomCell();
});

// функція генерування випадкових чисел на дошці
function generateRandomCell() {
  const rowIndex = Math.floor(Math.random() * tableSize);
  const cellIndex = Math.floor(Math.random() * tableSize);
  const cell = rows[rowIndex].children[cellIndex];

  if (arrayCells[rowIndex][cellIndex] === 0) {
    // Ймовірність 75%, що з'явиться двійка
    const newValue = Math.random() < 0.75 ? 2 : 4;

    arrayCells[rowIndex][cellIndex] = newValue;
    cell.textContent = newValue;
    cell.classList.add(`field-cell--${newValue}`);
  }
}

// Функції руху - подія для пересування елементів по доці
document.addEventListener('keydown', e => {
  if (handleKeyDown) {
    switch (e.key) {
      case 'ArrowRight':
        moveRight();
        generateRandomCell();
        break;

      case 'ArrowLeft':
        moveLeft();
        generateRandomCell();
        break;

      case 'ArrowUp':
        moveUp();
        generateRandomCell();
        break;

      case 'ArrowDown':
        moveDown();
        generateRandomCell();
        break;

      default:
        throw new Error('The wrong button was pressed');
    }
  }
});

function moveRight() {
  let movedRight = false; // для перевірки, чи було зроблено якийсь рух

  for (let i = 0; i < tableSize; i++) {
    for (let j = tableSize - 2; j >= 0; j--) {
      // проходимось з правої сторони до лівої
      if (arrayCells[i][j] !== 0) { // якщо клітинка не порожня
        let k = j;

        while (k < tableSize - 1) {
          // якщо наступна клітинка порожня, перемістити поточну клітинку туди
          if (arrayCells[i][k + 1] === 0) {
            arrayCells[i][k + 1] = arrayCells[i][k];
            arrayCells[i][k] = 0;
            k++;
            movedRight = true; // рух здійснено
          } else if (arrayCells[i][k + 1] === arrayCells[i][k]) {
            // якщо наступна клітинка має таке ж значення, що й поточна
            arrayCells[i][k + 1] *= 2;
            arrayCells[i][k] = 0;
            movedRight = true; // рух здійснено
            // переміщення завершено, не можна об'єднувати з іншими клітинками
            break;
          } else {
            // наступна клітинка має різне значення, не можна переміщати далі
            break;
          }
        }
      }
    }
  }

  if (movedRight) {
    updateTable();

    if (checkWin()) {
      messageWin.classList.remove('hidden');
    }

    if (checkGameOver()) {
      messageLose.classList.remove('hidden');
    }
  }
}

function moveLeft() {
  let movedLeft = false;

  for (let i = 0; i < tableSize; i++) {
    for (let j = 0; j < tableSize; j++) {
      if (arrayCells[i][j] !== 0) { // якщо клітинка не порожня
        let k = j;

        while (k > 0) {
          // якщо попередня клітинка порожня, перемістити поточну клітинку туди
          if (arrayCells[i][k - 1] === 0) {
            arrayCells[i][k - 1] = arrayCells[i][k];
            arrayCells[i][k] = 0;
            k--;
            movedLeft = true; // рух здійснено
          } else if (arrayCells[i][k - 1] === arrayCells[i][k]) {
            // якщо попередня клітинка має таке ж значення, що й поточна
            arrayCells[i][k - 1] *= 2;
            arrayCells[i][k] = 0;
            movedLeft = true; // рух здійснено
            // переміщення завершено, не можна об'єднувати з іншими клітинками
            break;
          } else {
            // попередня клітинка має різне значення, не можна переміщати далі
            break;
          }
        }
      }
    }
  }

  if (movedLeft) {
    updateTable();

    if (checkWin()) {
      messageWin.classList.remove('hidden');
    }

    if (checkGameOver()) {
      messageLose.classList.remove('hidden');
    }
  }
}

function moveUp() {
  let movedUp = false;

  for (let j = 0; j < tableSize; j++) {
    for (let i = 1; i < tableSize; i++) {
      if (arrayCells[i][j] !== 0) { // якщо клітинка не порожня
        let k = i;

        while (k > 0) {
          // якщо наступна клітинка порожня, перемістити поточну клітинку туди
          if (arrayCells[k - 1][j] === 0) {
            arrayCells[k - 1][j] = arrayCells[k][j];
            arrayCells[k][j] = 0;
            k--;
            movedUp = true; // рух здійснено
          } else if (arrayCells[k - 1][j] === arrayCells[k][j]) {
            // якщо наступна клітинка має таке ж значення, що й поточна
            arrayCells[k - 1][j] *= 2;
            arrayCells[k][j] = 0;
            movedUp = true; // рух здійснено
            // переміщення завершено, не можна об'єднувати з іншими клітинками
            break;
          } else {
            // наступна клітинка має різне значення, не можна переміщати далі
            break;
          }
        }
      }
    }
  }

  if (movedUp) {
    updateTable();

    if (checkWin()) {
      messageWin.classList.remove('hidden');
    }

    if (checkGameOver()) {
      messageLose.classList.remove('hidden');
    }
  }
}

function moveDown() {
  let movedDown = false;

  for (let j = 0; j < tableSize; j++) {
    for (let i = tableSize - 2; i >= 0; i--) {
      if (arrayCells[i][j] !== 0) { // якщо клітинка не порожня
        let k = i;

        while (k < tableSize - 1) {
          if (arrayCells[k + 1][j] === 0) {
            arrayCells[k + 1][j] = arrayCells[k][j];
            arrayCells[k][j] = 0;
            k++;
            movedDown = true; // рух здійснено
          } else if (arrayCells[k + 1][j] === arrayCells[k][j]) {
            // якщо нижня клітинка має таке ж значення, що й поточна
            arrayCells[k + 1][j] *= 2;
            arrayCells[k][j] = 0;
            movedDown = true; // рух здійснено
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  if (movedDown) {
    updateTable();

    if (checkWin()) {
      messageWin.classList.remove('hidden');
    }

    if (checkGameOver()) {
      messageLose.classList.remove('hidden');
    }
  }
}

// Функція оновлення таблиці
function updateTable() {
  // Очистити таблицю від старих даних
  cells.forEach((cell) => {
    cell.textContent = '';
    cell.className = 'field-cell';
  });

  // Додати нові значення на таблицю з оновленого масиву
  for (let i = 0; i < arrayCells.length; i++) {
    for (let j = 0; j < arrayCells[i].length; j++) {
      const cell = rows[i].children[j];
      const value = arrayCells[i][j];

      if (value !== 0) {
        cell.textContent = value;
        cell.classList.add(`field-cell--${value}`);
      }
    }
  }

  const score = calculateScore();

  counter.textContent = score;
}

// Функція перевірки перемоги
function checkWin() {
  for (let i = 0; i < tableSize; i++) {
    for (let j = 0; j < tableSize; j++) {
      if (arrayCells[i][j] === 2048) {
        return true;
      }
    }
  }

  return false;
}

// Функція перевірки поразки
function checkGameOver() {
  // Перевіряємо, чи є хоча б одна порожня клітинка
  for (let i = 0; i < tableSize; i++) {
    for (let j = 0; j < tableSize; j++) {
      if (arrayCells[i][j] === 0) {
        return false;
      }
    }
  }

  // Перевіряємо, чи є хоча б одна пара сусідніх клітинок з однаковим значенням
  for (let i = 0; i < tableSize; i++) {
    for (let j = 0; j < tableSize; j++) {
      if (i < tableSize - 1 && arrayCells[i][j] === arrayCells[i + 1][j]) {
        return false;
      }

      if (j < tableSize - 1 && arrayCells[i][j] === arrayCells[i][j + 1]) {
        return false;
      }
    }
  }

  // Якщо жодна з умов не виконана, значить гра закінчилася поразкою
  return true;
}

// Функція підрахунку
function calculateScore() {
  let score = 0;

  for (let i = 0; i < tableSize; i++) {
    for (let j = 0; j < tableSize; j++) {
      score += arrayCells[i][j];
    }
  }

  return score;
}
