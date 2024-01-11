'use strict';

const gameFieldElement = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');

const rows = 4;
const columns = 4;
let score = 0;

// const gameField = [
//   [2, 2, 2, 0],
//   [4, 4, 2, 0],
//   [8, 8, 2, 0],
//   [2, 2, 2, 2],
// ];

const gameField = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

window.onload = function() {
  setGame();
  addTwo();
  addTwo();
};

const setGame = () => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = document.createElement('div');

      cell.id = `${r}-${c}`;

      const num = gameField[r][c];

      updateCell(cell, num);
      gameFieldElement.append(cell);
    }
  }
};

function hasEmptyTile() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (gameField[r][c] === 0) {
        return true;
      }
    }
  }

  return false;
}

function addTwo() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (gameField[r][c] === 0) {
      gameField[r][c] = 2;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = '2';
      tile.classList.add('field-cell--2');
      found = true;
    }
  }
}

function updateCell(cell, num) {
  cell.innerText = '';
  cell.classList.value = '';
  cell.classList.add('field-cell');

  if (num > 0) {
    cell.innerText = num;
    cell.classList.add(`field-cell--${num}`);
  }
}

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') {
    slideLeft();
    addTwo();
  }

  if (e.code === 'ArrowRight') {
    slideRight();
    addTwo();
  }

  if (e.code === 'ArrowUp') {
    slideUp();
    addTwo();
  }

  if (e.code === 'ArrowDown') {
    slideDown();
    addTwo();
  }
});

function updateGameField() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = gameField[r][c];

      updateCell(cell, num);
    }
  }
}

function slide(row) {
  let slidedRow = row.filter(num => num !== 0);

  for (let c = 0; c < columns - 1; c++) {
    if (slidedRow[c] === slidedRow[c + 1]) {
      slidedRow[c] *= 2;
      slidedRow[c + 1] = 0;
      score += +slidedRow[c] | 0;
      gameScore.innerText = score;
    }
  }
  slidedRow = slidedRow.filter(num => num !== 0 && !isNaN(num));

  while (slidedRow.length < columns) {
    slidedRow.push(0);
  };

  return slidedRow;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = gameField[r];

    row = slide(row);

    gameField[r] = row;

    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = gameField[r][c];

      updateCell(cell, num);
    }
  };
};

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = gameField[r];

    row = row.reverse();
    row = slide(row);
    gameField[r] = row.reverse();

    for (let c = 0; c < columns; c++) {
      const cell = document.getElementById(r.toString() + '-' + c.toString());
      const num = gameField[r][c];

      updateCell(cell, num);
    }
  };
};

function slideUp() {
  for (let c = 0; c < rows; c++) {
    let row = [
      gameField[0][c],
      gameField[1][c],
      gameField[2][c],
      gameField[3][c],
    ];

    row = slide(row);

    for (let index = 0; index < rows; index++) {
      gameField[index][c] = row[index];
    }
  };

  updateGameField();
};

function slideDown() {
  for (let c = 0; c < rows; c++) {
    let row = [
      gameField[0][c],
      gameField[1][c],
      gameField[2][c],
      gameField[3][c],
    ];

    row = slide(row.reverse());
    row = row.reverse();

    for (let index = 0; index < rows; index++) {
      gameField[index][c] = row[index];
    }
  };

  updateGameField();
};

// function check(a) {
//   for (let q = 1; q < a.length; ++q) {
//     if (a[q] > 0 && a[q] === a[q - 1]) {
//       return true;
//     }
//   }

//   return false;
// }

// function isCanSlide() {
//   for (let r = 0; r < rows; r++) {
//     const row = gameField[r].filter(num => num !== 0);

//     if (check(row)) {
//       return true;
//     }
//   }

//   return false;
// }

// function hasSpaceLeft() {
//   for (let r = 0; r < rows; r++) {
//     if (gameField[r][0] === 0) {
//       return true;
//     }
//   }

//   return false;
// }
