'use strict';

const field = document.querySelector('.game-field');
const rows = field.querySelectorAll('.field-row');
const startBtn = document.querySelector('.start');
const scores = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const gameOverMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const height = rows.length;
const width = rows[0].children.length;
let idCount = 0;

// установка id для каждой ячейки
[...rows].forEach(row => {
  [...row.children].forEach(cell => {
    cell.id = idCount;
    idCount++;
  });
});

// рандомное значение в дипазоне (включительно макс и мин)
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// возвращает массив пустых ячеек
function getFreeCells() {
  const freeCells = [];

  for (const row of rows) {
    freeCells.push([...row.children].filter(cell => cell.textContent === ''));
  }

  return freeCells.flat(Infinity);
}

// заполнение случайной свободной клетки
function spawnCell() {
  const freeCells = getFreeCells();

  if (freeCells.length === 0) {
    return;
  }

  const idArr = freeCells.map(cell => +cell.id);

  const spawnedId = random(0, idArr.length - 1);
  const spawned = [...freeCells].find(cell => +cell.id === idArr[spawnedId]);

  if (Math.random() >= 0.1) {
    fillCell(spawned, 2);
  } else {
    fillCell(spawned, 4);
  }
}

// очищает поле
function clearField() {
  [...rows].forEach(row => {
    [...row.children].forEach(cell => {
      cell.textContent = '';
      cell.className = 'field-cell';
    });
  });
}

startBtn.addEventListener('click', () => {
  clearField();
  spawnCell();
  spawnCell();

  scores.textContent = 0;
  startBtn.classList.remove('start');
  startBtn.classList.add('restart');
  startBtn.textContent = 'Restart';

  startMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
  gameOverMessage.classList.add('hidden');
});

// очищает ячейку
function makeEmptyCell(cell) {
  cell.textContent = '';
  cell.className = 'field-cell';
}

// заполняет ячейку
function fillCell(cell, value = 2) {
  cell.textContent = value;
  cell.className = `field-cell field-cell--${value}`;
}

// прибавляет к очкам значение value
function updateScores(value) {
  const num = +scores.textContent;

  scores.textContent = num + value;
}

// сдвиг ячейки cell1
function moveCell(cell1, cell2) {
  fillCell(cell2, cell1.textContent);
  makeEmptyCell(cell1);
}

// выводит сообщение о проигрыше
function gameOver() {
  winMessage.classList.add('hidden');
  gameOverMessage.classList.remove('hidden');
}

// выводит сообщение о победе
function win() {
  winMessage.classList.remove('hidden');
}

document.body.addEventListener('keydown', () => {
  let moveFlag = false;
  let isGameOver = true;

  switch (event.key) {
    case 'ArrowUp': {
      for (let count = 0; count < height; count++) {
        for (let i = 1; i < height; i++) {
          for (let j = 0; j < width; j++) {
            if (rows[i].children[j].textContent !== '') {
              while (rows[i - 1].children[j].textContent === '') {
                moveCell(rows[i].children[j], rows[i - 1].children[j]);
                moveFlag = true;
              }

              if (rows[i - 1].children[j].textContent !== '') {
                if (rows[i].children[j].textContent
                      === rows[i - 1].children[j].textContent) {
                  fillCell(rows[i - 1].children[j],
                    +rows[i - 1].children[j].textContent * 2);
                  makeEmptyCell(rows[i].children[j]);
                  updateScores(+rows[i - 1].children[j].textContent);
                  moveFlag = true;

                  if (+rows[i - 1].children[j].textContent === 2048) {
                    win();
                  }
                }
              }
            }
          }
        }
      }

      break;
    }

    case 'ArrowDown': {
      for (let count = 0; count < height; count++) {
        for (let i = height - 2; i >= 0; i--) {
          for (let j = 0; j < width; j++) {
            if (rows[i].children[j].textContent !== '') {
              while (rows[i + 1].children[j].textContent === '') {
                moveCell(rows[i].children[j], rows[i + 1].children[j]);
                moveFlag = true;
              }

              if (rows[i + 1].children[j].textContent !== '') {
                if (rows[i].children[j].textContent
                      === rows[i + 1].children[j].textContent) {
                  fillCell(rows[i + 1].children[j],
                    +rows[i + 1].children[j].textContent * 2);
                  makeEmptyCell(rows[i].children[j]);
                  updateScores(+rows[i + 1].children[j].textContent);
                  moveFlag = true;

                  if (+rows[i + 1].children[j].textContent === 2048) {
                    win();
                  }
                }
              }
            }
          }
        }
      }

      break;
    }

    case 'ArrowLeft': {
      for (let count = 0; count < height; count++) {
        for (let j = 1; j < height; j++) {
          for (let i = 0; i < width; i++) {
            if (rows[i].children[j].textContent !== '') {
              while (rows[i].children[j - 1].textContent === '') {
                moveCell(rows[i].children[j], rows[i].children[j - 1]);
                moveFlag = true;
              }

              if (rows[i].children[j - 1].textContent !== '') {
                if (rows[i].children[j].textContent
                      === rows[i].children[j - 1].textContent) {
                  fillCell(rows[i].children[j - 1],
                    +rows[i].children[j - 1].textContent * 2);
                  makeEmptyCell(rows[i].children[j]);
                  updateScores(+rows[i].children[j - 1].textContent);
                  moveFlag = true;

                  if (+rows[i].children[j - 1].textContent === 2048) {
                    win();
                  }
                }
              }
            }
          }
        }
      }

      break;
    }

    case 'ArrowRight': {
      for (let count = 0; count < height; count++) {
        for (let j = height - 2; j >= 0; j--) {
          for (let i = 0; i < width; i++) {
            if (rows[i].children[j].textContent !== '') {
              while (rows[i].children[j + 1].textContent === '') {
                moveCell(rows[i].children[j], rows[i].children[j + 1]);
                moveFlag = true;
              }

              if (rows[i].children[j + 1].textContent !== '') {
                if (rows[i].children[j].textContent
                      === rows[i].children[j + 1].textContent) {
                  fillCell(rows[i].children[j + 1],
                    +rows[i].children[j + 1].textContent * 2);
                  makeEmptyCell(rows[i].children[j]);
                  updateScores(+rows[i].children[j + 1].textContent);
                  moveFlag = true;

                  if (+rows[i].children[j + 1].textContent === 2048) {
                    win();
                  }
                }
              }
            }
          }
        }
      }

      break;
    }

    default: {
      return;
    }
  }

  if (moveFlag) {
    spawnCell();
  }

  // проверка на проигрыш
  if (getFreeCells().length === 0) {
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (j < width - 1) {
          if (rows[i].children[j].textContent
                === rows[i].children[j + 1].textContent) {
            isGameOver = false;
          }
        }

        if (i < height - 1) {
          if (rows[i].children[j].textContent
                === rows[i + 1].children[j].textContent) {
            isGameOver = false;
          }
        }
      }
    }
  }

  if (isGameOver) {
    gameOver();
  }
});
