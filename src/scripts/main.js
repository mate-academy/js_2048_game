'use strict';

let score = 0;
const boardRows = 4;
const boardColumn = 4;
const board = [];
// let canMoveNumber = 0

const rows = document.getElementsByTagName('tr'); // get rows in table (0-3)
const start = document.querySelector('.start');

let keyInit = false;

start.addEventListener('click', () => {
  board.length = 0;

  for (let r = 0; r < boardRows; r++) {
    const arr = [];

    for (let c = 0; c < boardColumn; c++) {
      arr.push(0);
    }
    board.push(arr);
  };

  if (!keyInit) {
    document.addEventListener('keydown', startGame);
  };

  startGame();
  setNumbers();
  setNumbers();
  score = 0;

  start.textContent = 'Restart';
});

const startGame = (action) => {
  switch (action.key) {
    case 'ArrowUp':
      slide('up');
      // if (!canMoveNumber) {
      //   console.log(canMoveNumber);
      //   break;
      // }
      // console.log(canMoveNumber);
      setNumbers();
      // setNumbers();
      addScore();
      // canMoveNumber = 0;
      break;
    case 'ArrowDown':
      slide('down');
      setNumbers();
      // setNumbers();
      addScore();
      break;
    case 'ArrowLeft':
      slide('left');
      setNumbers();
      // setNumbers();
      addScore();
      break;
    case 'ArrowRight':
      slide('right');
      setNumbers();
      // setNumbers();
      addScore();
      break;
  }

  keyInit = true;
};

function addScore() {
  const scoreOnPage = document.querySelector('.game-score');

  scoreOnPage.textContent = score;
}

// пошук порожньоъ комірки в масиві board
function findEmpty() {
  for (const line of board) {
    const finds = line.some((element) => element === 0);

    if (finds) {
      return true;
    }
  };

  return false;
};

function getRandomNumber() {
  const randomNumber = Math.floor(Math.random() * 100);

  if (randomNumber < 10) {
    return 4;
  } else {
    return 2;
  }
};

function setNumbers() {
  if (!findEmpty()) {
    // const lose = dropdown.querySelector('.message-lose');
    // lose.style.display = 'block'
    return;
  };

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * boardRows);
    const c = Math.floor(Math.random() * boardColumn);

    if (board[r][c] === 0) {
      board[r][c] = getRandomNumber();
      cellsAndNumbers();
      found = true;
    }
  }
};

function cellsAndNumbers() {
  for (let r = 0; r < board.length; r++) {
    const row = rows[r];
    const cells = row.getElementsByTagName('td'); // get cells in row[0-3]

    for (let c = 0; c < cells.length; c++) {
      const cell = cells[c];
      const number = board[r][c];

      updateTyle(cell, number);
    };
  };
};

// add numbers to cells from the array (board)
function updateTyle(cell, number) {
  if (number) {
    cell.textContent = '';
    cell.textContent = `${number}`;
    cell.className = 'field-cell';
    cell.classList.add(`field-cell--${number}`);
  } else {
    cell.textContent = '';
    cell.className = 'field-cell';
  }
};

function slide(moveDerection) {
  for (let r = 0; r < boardRows; r++) {
    const column = [];

    // Перебір по колонках
    for (let c = 0; c < boardColumn; c++) {
      let number = 0;

      if (moveDerection === 'right' || moveDerection === 'left') {
        number = board[r][c];
      } else {
        number = board[c][r];
      }
      column.push(number);
    }

    // canMove(column);
    // if (!canMove(column)) {
    //   return;
    // }

    // Змішщення комірок зі значеннями на початок і додавання нулів в кінець
    const result = sameCells(column, moveDerection);

    while (result.length < column.length) {
      if (moveDerection === 'right' || moveDerection === 'down') {
        result.unshift(0);
      } else {
        result.push(0);
      }
    };

    for (let i = 0; i < boardColumn; i++) {
      if (moveDerection === 'right' || moveDerection === 'left') {
        board[r][i] = result[i];
      } else {
        board[i][r] = result[i];
      }
    }
  };

  cellsAndNumbers();
};

// function canMove(column) {
//   return column.forEach((element, i, arr) => {
//     if (element === 0 && i === 0) {
//       canMoveNumber++;
//       return true;
//     }
//     if (element === 0 && arr[i+1] !== 0) {
//       canMoveNumber++;
//       return true;
//     } else if (element === arr[i+1] && element !== 0) {
//       canMoveNumber++;
//       return true;
//     }
//     return false;
//   })
// }

// додаемо однакові значення сусідніх комірок
function sameCells(column, moveDerection) {
  if (moveDerection === 'right' || moveDerection === 'down') {
    return column
      .reverse()
      .filter(n => n > 0)
      .map((num, i, arr) => {
        if (num === arr[i + 1]) {
          arr[i + 1] = 0;

          const res = num * 2;

          score += res;

          return res;
        } else {
          return num;
        }
      })
      .reverse()
      .filter(n => n > 0);
  } else {
    return column
      .filter(n => n > 0)
      .map((num, i, arr) => {
        if (num === arr[i + 1]) {
          arr[i + 1] = 0;

          const res = num * 2;

          score += res;

          return res;
        } else {
          return num;
        }
      })
      .filter(n => n > 0);
  }
};
