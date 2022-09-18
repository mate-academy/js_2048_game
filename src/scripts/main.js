'use strict';

const body = document.querySelector('body');
const tbody = document.querySelector('tbody');
const tRows = tbody.rows;
const controls = document.querySelector('.controls');
const maxCellValue = 2048;

const field = [
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
  ['', '', '', ''],
];

const classes = [2, 4, 6, 8, 16, 32, 64, 128, 256, 512, 1024, 2048];

controls.insertAdjacentHTML('beforeend', `
  <button class="button restart hidden">Restart</button>
`);

const restart = controls.querySelector('.restart');
const start = controls.querySelector('.start');

const gameScore = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

let counter;

// переносим все данные с массива field
const getValueField = function() {
  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      tRows[i].cells[j].innerText = field[i][j];
    }
  }
};

// посчитать сумму всех значений
const getScoreValue = function() {
  const scoreValue = filledCellsArr.reduce((sum, current) => sum + current, 0);

  gameScore.textContent = scoreValue;

  return gameScore.textContent;
};

// добавляем свойства ячейкам
const addClassCell = function() {
  let cellField;

  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      for (const newClass of classes) {
        tRows[i].cells[j].classList.remove(`field-cell--${newClass}`);
      }

      if (field[i][j] !== '') {
        cellField = field[i][j];
        tRows[i].cells[j].classList.add(`field-cell--${cellField}`);
      }
    }
  }
};

// обнуляем field
const getEmptyField = () => {
  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      field[i][j] = '';
    }
  }
};

// очищаем страницу (рестарт)
const resetInfo = function() {
  gameScore.textContent = 0;
  restart.classList.add('hidden');
  start.classList.remove('hidden');

  getEmptyField();

  messageStart.classList.remove('hidden');
  filledCellsArr = [];
};

let randomValue;
// выбираем пустую ячейку для заполнения
const getRandomCell = function(min, max) {
  counter = 0;
  randomValue = Math.floor(Math.random() * (max - min)) + min;

  // проверяем наличие пустых ячейки
  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      if (field[i][j] === '') {
        counter++;
      };
    }
  }

  return randomValue;
};

let newValue;

function getRandomValue() {
  const mathNumber = Math.random();

  if (mathNumber < 0.1) {
    newValue = 4;
  } else {
    newValue = 2;
  }
}

let row;
let column;
// проверяем на пустоту
const selectEmptyCell = () => {
  row = getRandomCell(0, field.length);
  column = getRandomCell(0, field.length);

  if (counter !== 0) {
    while (field[row][column] !== '') {
      row = getRandomCell(0, field.length);
      column = getRandomCell(0, field.length);
    }
  } else {
    for (let i = 1; i < 3; i++) {
      for (let j = 1; j < 3; j++) {
        if (field[i][j + 1] !== field[i][j]
          && field[i][j - 1] !== field[i][j]
          && field[i + 1][j] !== field[i][j]
          && field[i - 1][j] !== field[i][j]) {
          messageLose.classList.remove('hidden');
        }
      }
    }
  }
};

let filledCellsArr;
// создаем массив заполненных ячеек
const getFilledCells = function() {
  filledCellsArr = [];

  for (const filledСell of field) {
    for (let i = 0; i <= 3; i++) {
      if (filledСell[i] !== '') {
        filledCellsArr.push(filledСell[i]);
      }
    }
  }

  return filledCellsArr;
};

// добавляем новое значение в ячейку
const addNewValue = () => {
  getRandomValue();
  selectEmptyCell();

  field[row][column] = newValue;
  addClassCell();
};

let fieldCopy;
// копируем field
const getCloneField = () => {
  fieldCopy = [];

  for (let i = 0; i < field.length; i++) {
    fieldCopy.push(field[i].slice());
  };
};

// нажатие start
start.addEventListener('click', (ev) => {
  addNewValue();
  addNewValue();
  getValueField();
  getFilledCells();

  if (filledCellsArr.length >= 1) {
    start.classList.add('hidden');
    restart.classList.remove('hidden');
  }

  getScoreValue();

  messageStart.classList.add('hidden');
});

// нажатие restart
restart.addEventListener('click', (ev) => {
  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      for (const newClass of classes) {
        tRows[i].cells[j].classList.remove(`field-cell--${newClass}`);
      }
    }
  }

  messageLose.classList.add('hidden');
  resetInfo();
  getValueField();
});

// нажатие клавиш
body.addEventListener('keydown', (evKey) => {
  if (!filledCellsArr.length || !messageLose.classList.contains('hidden')) {
    return;
  };

  // проверка на выиграш
  for (const cellValue of filledCellsArr) {
    if (cellValue === maxCellValue) {
      messageWin.classList.remove('hidden');
      resetInfo();
    }
  }

  switch (evKey.code) {
    case 'ArrowRight':
      let checkRight = 0;

      do {
        for (let i = 0; i <= 3; i++) {
          for (let j = 2; j >= 0; j--) {
            // проверяем на наличие значения
            if (field[i][j] !== '') {
              const cellInfo = field[i][j];

              // если следующий пустой - сдвигаем, переносим значение
              if (field[i][j + 1] === '') {
                field[i][j] = '';
                field[i][j + 1] = cellInfo;
              } else if (field[i][j + 1] === cellInfo) {
                // если с одинаковым значением - сверяем не был ли удвоен
                if (field[i][j + 1] === fieldCopy[i][j + 1]) {
                  field[i][j] = '';
                  field[i][j + 1] += cellInfo;
                }
              }
            }
          }
        }
        checkRight++;
      } while (checkRight < 3);

      break;

    case 'ArrowLeft':
      let checkLeft = 0;

      do {
        for (let i = 0; i <= 3; i++) {
          for (let j = 1; j <= 3; j++) {
            // проверяем на наличие значения
            if (field[i][j] !== '') {
              const cellInfo = field[i][j];

              // если следующий пустой - сдвигаем, переносим значение
              if (field[i][j - 1] === '') {
                field[i][j] = '';
                field[i][j - 1] = cellInfo;
              } else if (field[i][j - 1] === cellInfo) {
                // если одинаковое значение, сверяем не был ли удвоен
                if (field[i][j - 1] === fieldCopy[i][j - 1]) {
                  field[i][j] = '';
                  field[i][j - 1] += cellInfo;
                }
              }
            }
          }
        }
        checkLeft++;
      } while (checkLeft < 3);
      break;

    case 'ArrowDown':
      let checkDown = 0;

      do {
        for (let i = 2; i >= 0; i--) {
          for (let j = 0; j <= 3; j++) {
            // проверяем на наличие значения
            if (field[i][j] !== '') {
              const cellInfo = field[i][j];

              // если следующий пустой - сдвигаем, переносим значение
              if (field[i + 1][j] === '') {
                field[i][j] = '';
                field[i + 1][j] = cellInfo;
              } else if (field[i + 1][j] === cellInfo) {
              // если с одинаковым значением - сверяем не был ли удвоен
                if (field[i + 1][j] === fieldCopy[i + 1][j]) {
                  field[i][j] = '';
                  field[i + 1][j] += cellInfo;
                }
              }
            }
          }
        }
        checkDown++;
      } while (checkDown < 3);
      break;

    case 'ArrowUp':
      let checkUp = 0;

      do {
        for (let i = 1; i <= 3; i++) {
          for (let j = 0; j <= 3; j++) {
            // проверяем на наличие значения
            if (field[i][j] !== '') {
              const cellInfo = field[i][j];

              // если следующий пустой - сдвигаем, переносим значение
              if (field[i - 1][j] === '') {
                field[i][j] = '';
                field[i - 1][j] = cellInfo;
              // если с одинаковым значением - сверяем не был ли удвоен
              } else if (field[i - 1][j] === cellInfo) {
                if (field[i - 1][j] === fieldCopy[i - 1][j]) {
                  field[i][j] = '';
                  field[i - 1][j] += cellInfo;
                }
              }
            }
          }
        }
        checkUp++;
      } while (checkUp < 3);
      break;
  }

  addNewValue();
  getFilledCells();
  getScoreValue();
  getValueField();
  getCloneField();
});
