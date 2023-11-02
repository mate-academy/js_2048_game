'use strict';

const buttonStart = document.querySelector('.start');
const tableField = document.querySelector('tbody');
const scoreGame = document.querySelector('.game_score');

const messageStart = document.querySelector('.message_start');
const messageLose = document.querySelector('.message_lose');
const messageWin = document.querySelector('.message_win');

let score = 0;
const rows = 4;
const columns = 4;

let board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

buttonStart.addEventListener('click', gameStart);

// Зупуск гри
function gameStart() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  score = 0;

  buttonStart.classList.replace('start', 'restart');
  buttonStart.innerText = 'Restart';

  messageStart.classList.add('hidden');

  addRandomNumber();
  addRandomNumber();
};

// Переміщення вгору
function moveUp() {
  let merged = false;

  for (let j = 0; j < columns; j++) {
    for (let i = 1; i < rows; i++) {
      if (board[i][j] !== 0) {
        let currentRow = i;

        while (currentRow > 0) {
          if (board[currentRow - 1][j] === 0) {
            // Пересунути елемент вгору
            board[currentRow - 1][j] = board[currentRow][j];
            board[currentRow][j] = 0;
            currentRow--;
            merged = true;
          } else if (board[currentRow - 1][j] === board[currentRow][j]) {
            // Об'єднати два елементи з однаковими значеннями
            board[currentRow - 1][j] *= 2;
            score += board[currentRow - 1][j];
            board[currentRow][j] = 0;
            merged = true;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  if (merged) {
    addRandomNumber();
  }

  renderHtml();
}

// Переміщення вниз
function moveDown() {
  let merged = false;

  for (let j = 0; j < columns; j++) {
    for (let i = rows - 2; i >= 0; i--) {
      if (board[i][j] !== 0) {
        let currentRow = i;

        while (currentRow < rows - 1) {
          if (board[currentRow + 1][j] === 0) {
            // Пересунути елемент вниз
            board[currentRow + 1][j] = board[currentRow][j];
            board[currentRow][j] = 0;
            currentRow++;
            merged = true;
          } else if (board[currentRow + 1][j] === board[currentRow][j]) {
            // Об'єднати два елементи з однаковими значеннями
            board[currentRow + 1][j] *= 2;
            score += board[currentRow + 1][j];
            board[currentRow][j] = 0;
            merged = true;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  if (merged) {
    addRandomNumber();
  }

  renderHtml();
}

// Переміщення вліво
function moveLeft() {
  let merged = false;

  for (let i = 0; i < rows; i++) {
    for (let j = 1; j < columns; j++) {
      if (board[i][j] !== 0) {
        let currentCol = j;

        while (currentCol > 0) {
          if (board[i][currentCol - 1] === 0) {
            // Пересунути елемент вліво
            board[i][currentCol - 1] = board[i][currentCol];
            board[i][currentCol] = 0;
            currentCol--;
            merged = true;
          } else if (board[i][currentCol - 1] === board[i][currentCol]) {
            // Об'єднати два елементи з однаковими значеннями
            board[i][currentCol - 1] *= 2;
            score += board[i][currentCol - 1];
            board[i][currentCol] = 0;
            merged = true;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  if (merged) {
    addRandomNumber();
  }

  renderHtml();
}

// Переміщення вправо
function moveRight() {
  let merged = false;

  for (let i = 0; i < rows; i++) {
    for (let j = columns - 2; j >= 0; j--) {
      if (board[i][j] !== 0) {
        let currentCol = j;

        while (currentCol < columns - 1) {
          if (board[i][currentCol + 1] === 0) {
            // Пересунути елемент вправо
            board[i][currentCol + 1] = board[i][currentCol];
            board[i][currentCol] = 0;
            currentCol++;
            merged = true;
          } else if (board[i][currentCol + 1] === board[i][currentCol]) {
            // Об'єднати два елементи з однаковими значеннями
            board[i][currentCol + 1] *= 2;
            score += board[i][currentCol + 1];
            board[i][currentCol] = 0;
            merged = true;
            break;
          } else {
            break;
          }
        }
      }
    }
  }

  if (merged) {
    addRandomNumber();
  }

  renderHtml();
}

// Обробка натискання клавіш
window.addEventListener('keydown', (e) => {
  if (!buttonStart.classList.contains('restart')) {
    return;
  };

  e.preventDefault();

  switch (e.key) {
    case 'ArrowUp':
      moveUp();
      break;

    case 'ArrowDown':
      moveDown();
      break;

    case 'ArrowLeft':
      moveLeft();
      break;

    case 'ArrowRight':
      moveRight();
      break;
  }

  renderHtml();
});

// Візуалізація грального поля
function renderHtml() {
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < columns; j++) {
      const currentCell = tableField.rows[i].cells[j];
      const value = board[i][j];

      currentCell.innerText = '';
      currentCell.classList.value = '';
      currentCell.className = `field_cell`;

      if (value > 0) {
        currentCell.innerText = value;
        currentCell.classList.add(`field_cell__${value}`);
      }

      if (value === 2048) {
        messageWin.classList.remove('hidden');
        buttonStart.classList.replace('restart', 'start');
        buttonStart.innerText = 'Start';
      }
    }
  }

  scoreGame.innerText = score;

  if (isGameOver()) {
    messageLose.classList.remove('hidden');
  } else {
    messageLose.classList.add('hidden');
  }
}

// Чи є порожні комірки на гральному полі
function hasEmptyCell() {
  return board.some(row => row.some(cell => !cell));
}

// Викидання випадкового числа
function addRandomNumber() {
  if (!hasEmptyCell()) {
    return;
  }

  let found = false;

  while (!found) {
    const num = Math.random() < 0.5 ? 2 : 4;
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = num;
      found = true;
    }
  }

  renderHtml();
}

// Кінець гри
function isGameOver() {
  if (hasEmptyCell()) {
    return false;
  }

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns - 1; j++) {
      const isNextSame = board[i][j] === board[i][j + 1];
      const isBelowSame = board[j][i] === board[j + 1][i];

      if (isNextSame || isBelowSame) {
        return false;
      }
    }
  }

  return true;
}
