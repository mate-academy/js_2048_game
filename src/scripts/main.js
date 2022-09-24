'use strict';

const body = document.querySelector('body');
const tbody = document.querySelector('tbody');
const tRows = tbody.rows;
const controls = document.querySelector('.controls');
const maxCellValue = 2048;

const field = [];

// cоздаем пустой массив field
const createNewField = () => {
  for (let i = 0; i < tRows.length; i++) {
    field[i] = [];

    for (let j = 0; j < tRows.length; j++) {
      const id = (i + 1) * 10 + j + 1;

      field[i][j] = {
        id: id, value: 0,
      };
    }
  }
};

const arrValues = [];

for (let n = 1; 2 ** n <= maxCellValue; n++) {
  arrValues.push(2 ** n);
};

controls.insertAdjacentHTML('beforeend', `
  <button class="button restart hidden">Restart</button>
`);

const restart = controls.querySelector('.restart');
const start = controls.querySelector('.start');

const gameScore = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

// переносим все данные с массива field
const letFillCells = function() {
  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      if (field[i][j].value !== 0) {
        tRows[i].cells[j].innerText = field[i][j].value;
      } else {
        tRows[i].cells[j].innerText = '';
      }
    }
  }
  addClassCell();
};

// добавляем классы ячейкам
const addClassCell = function() {
  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      for (const newClass of arrValues) {
        tRows[i].cells[j].classList.remove(`field-cell--${newClass}`);
      }

      if (field[i][j] !== 0) {
        tRows[i].cells[j].classList.add(`field-cell--${field[i][j].value}`);
      }
    }
  }
};

// очищаем страницу
const resetInfo = function() {
  gameScore.textContent = 0;
  restart.classList.add('hidden');
  start.classList.remove('hidden');
  messageStart.classList.remove('hidden');
};

// coздаем массив пустых ячеек
let emptyCellsArr = [];
const getEmptyCellsArr = function() {
  emptyCellsArr = [];

  for (let i = 0; i < tRows.length; i++) {
    for (let j = 0; j < tRows.length; j++) {
      if (field[i][j].value === 0) {
        emptyCellsArr.push(field[i][j].id);
      }
    }
  }

  if (emptyCellsArr.length === 0) {
    let numberMoves = 0;

    for (let i = 3; i > 0; i--) {
      for (let j = 3; j > 0; j--) {
        if (
          field[i][j].value === field[i - 1][j].value
          || field[i][j].value === field[i][j - 1].value
          || field[0][j].value === field[0][j - 1].value
          || field[i][0].value === field[i - 1][0].value
        ) {
          numberMoves++;
        }
      }
    }

    if (numberMoves === 0) {
      messageLose.classList.remove('hidden');
    }
  }

  return emptyCellsArr;
};

// считаем score
const getScoreValue = function() {
  let scoreValue = 0;

  for (let i = 0; i < tRows.length; i++) {
    for (let j = 0; j < tRows.length; j++) {
      scoreValue += field[i][j].value;
    }
  }
  gameScore.textContent = scoreValue;

  return scoreValue;
};

// выбираем пустую ячейку для заполнения
let randomCell = 0;
const getRandomCell = function() {
  const randomValue = Math.floor(Math.random() * emptyCellsArr.length);

  randomCell = emptyCellsArr[randomValue];

  return randomCell;
};

// выбираем случайное значение для заполнения
const getRandomValue = function() {
  const mathNumber = Math.random();

  return mathNumber < 0.1
    ? 4 : 2;
};

// добавляем новое значение в ячейку
const addNewValue = () => {
  getEmptyCellsArr();
  getRandomCell();

  for (let i = 0; i < tRows.length; i++) {
    for (let j = 0; j < tRows.length; j++) {
      if (field[i][j].id === randomCell) {
        field[i][j].value = getRandomValue();
      }
    }
  }
  letFillCells();
  addClassCell();
};

// нажатие start
start.addEventListener('click', () => {
  createNewField();
  start.classList.add('hidden');
  restart.classList.remove('hidden');
  messageStart.classList.add('hidden');
  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  addNewValue();
  addNewValue();
  getScoreValue();
});

// нажатие restart
restart.addEventListener('click', () => {
  createNewField();
  messageLose.classList.add('hidden');
  resetInfo();
  letFillCells();
});

const moveRight = function() {
  let checkRight = 0;

  do {
    for (let i = 0; i <= 3; i++) {
      for (let j = 2; j >= 0; j--) {
        // проверяем на наличие значения
        if (field[i][j].value !== 0) {
          const prevValue = field[i][j].value;

          // если следующий пустой - сдвигаем, переносим значение
          if (field[i][j + 1].value === 0) {
            field[i][j].value = 0;
            field[i][j + 1].value = prevValue;
          }
        }
      }
    }
    checkRight++;
  } while (checkRight < 3);
};

const moveLeft = function() {
  let checkLeft = 0;

  do {
    for (let i = 0; i <= 3; i++) {
      for (let j = 1; j <= 3; j++) {
        // проверяем на наличие значения
        if (field[i][j].value !== 0) {
          // если следующий пустой - сдвигаем, переносим значение
          if (field[i][j - 1].value === 0) {
            const prevValue = field[i][j].value;

            field[i][j].value = 0;
            field[i][j - 1].value = prevValue;
          }
        }
      }
    }
    checkLeft++;
  } while (checkLeft < 3);
};

const moveDown = function() {
  let checkDown = 0;

  do {
    for (let i = 2; i >= 0; i--) {
      for (let j = 0; j <= 3; j++) {
        // проверяем на наличие значения
        if (field[i][j].value !== 0) {
          // если следующий пустой - сдвигаем, переносим значение
          const prevValue = field[i][j].value;

          if (field[i + 1][j].value === 0) {
            field[i][j].value = 0;
            field[i + 1][j].value = prevValue;
          }
        }
      }
    }
    checkDown++;
  } while (checkDown < 3);
};

const moveUp = function() {
  let checkUp = 0;

  do {
    for (let i = 1; i <= 3; i++) {
      for (let j = 0; j <= 3; j++) {
        // проверяем на наличие значения
        if (field[i][j].value !== 0) {
          // если следующий пустой - сдвигаем, переносим значение
          if (field[i - 1][j].value === 0) {
            const prevValue = field[i][j].value;

            field[i][j].value = 0;
            field[i - 1][j].value = prevValue;
          }
        }
      }
    }
    checkUp++;
  } while (checkUp < 3);
};

// нажатие клавиш
body.addEventListener('keydown', (evKey) => {
  if (!messageLose.classList.contains('hidden')) {
    return;
  };

  if (
    evKey.code !== 'ArrowRight'
    && evKey.code !== 'ArrowLeft'
    && evKey.code !== 'ArrowDown'
    && evKey.code !== 'ArrowUp'
  ) {
    return;
  }

  switch (evKey.code) {
    case 'ArrowRight':
      moveRight();

      // плюсуем
      for (let i = 0; i <= 3; i++) {
        for (let j = 3; j > 0; j--) {
          if (field[i][j].value === field[i][j - 1].value) {
            field[i][j].value *= 2;
            field[i][j - 1].value = 0;
          }
        }
      };
      moveRight();
      break;

    case 'ArrowLeft':
      moveLeft();

      // плюсуем
      for (let i = 0; i <= 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (field[i][j].value === field[i][j + 1].value) {
            field[i][j].value *= 2;
            field[i][j + 1].value = 0;
          }
        }
      };
      moveLeft();
      break;

    case 'ArrowDown':
      moveDown();

      // плюсуем
      for (let i = 3; i > 0; i--) {
        for (let j = 0; j <= 3; j++) {
          if (field[i][j].value === field[i - 1][j].value) {
            field[i][j].value *= 2;
            field[i - 1][j].value = 0;
          }
        }
      };
      moveDown();
      break;

    case 'ArrowUp':
      moveUp();

      // плюсуем
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j <= 3; j++) {
          if (field[i][j].value === field[i + 1][j].value) {
            field[i][j].value *= 2;
            field[i + 1][j].value = 0;
          }
        }
      };
      moveUp();
      break;
  }

  // проверка на выиграш
  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      if (field[i][j].value === maxCellValue) {
        messageWin.classList.remove('hidden');
        resetInfo();
      }
    }
  };

  letFillCells();

  if (emptyCellsArr.length > 0) {
    addNewValue();
  };
  getScoreValue();
  getEmptyCellsArr();
});
