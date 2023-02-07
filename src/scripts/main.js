'use strict';

// const body = document.querySelector('body');
// const fieldRowAll = body.querySelectorAll('.field-row');
// const start = body.querySelector('.start');
// let probabilityCount = 0;
// const board = [
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
// ];

// function changeAdditionalClassCell(element, newAddClass) {
//   for (let i = 2; i <= 2048; i = i * 2) {
//     element.classList.remove('field-cell--' + i);
//   }

//   if (newAddClass) {
//     element.classList.add(newAddClass);
//   }
// }

// function newCell() {
//   let cellNew = getRandomInt(16);
//   let count = 0;

//   for (const row of fieldRowAll) {
//     const cells = row.querySelectorAll('.field-cell');

//     for (const cell of cells) {
//       if (count === cellNew && !cell.textContent) {
//         if (probabilityCount < 10) {
//           cell.textContent = 2;
//           cell.classList.add('field-cell--2');
//           probabilityCount++;
//         } else {
//           cell.textContent = 4;
//           cell.classList.add('field-cell--4');
//           probabilityCount = 0;
//         }
//       } else if (count === cellNew && cell.textContent) {
//         cellNew = getRandomInt(16);
//       }
//       count++;
//     }
//   }
// };

// function moveLeft() {
//   for (let i = 0; i < fieldRowAll.length; i++) {
//     const cells = fieldRowAll[i].querySelectorAll('.field-cell');

//     for (let j = 0; j < cells.length; j++) {
//       if (cells[i].textContent) {
//         board[i][j] = parseInt(cells[i].textContent);
//       }
//     }
//   }

//   for (let i = 0; i < board.length; i++) {
//     const newRow = [];

//     for (let j = 0; j < board[i].length; j++) {
//       if (board[i][j] !== 0) {
//         newRow.push(board[i][j]);
//       }
//     }

//     for (let j = 0; j < newRow.length; j++) {
//       board[i][j] = newRow[j];
//     }

//     for (let j = newRow.length; j < board[i].length; j++) {
//       board[i][j] = 0;
//     }
//   }

//   for (let i = 0; i < board.length; i++) {
//     for (let j = 1; j < board[i].length; j++) {
//       if (board[i][j - 1] === board[i][j]) {
//         board[i][j - 1] = board[i][j - 1] * 2;
//         board[i][j] = 0;
//       }
//     }
//   }

//   for (let i = 0; i < board.length; i++) {
//     const newRow = [];

//     for (let j = 0; j < board[i].length; j++) {
//       if (board[i][j] !== 0) {
//         newRow.push(board[i][j]);
//       }
//     }

//     for (let j = 0; j < newRow.length; j++) {
//       board[i][j] = newRow[j];
//     }

//     for (let j = newRow.length; j < board[i].length; j++) {
//       board[i][j] = 0;
//     }

//     console.log(newRow);
//   }

//   for (let i = 0; i < board.length; i++) {
//     const cells = fieldRowAll[i].querySelectorAll('.field-cell');

//     for (let j = 0; j < board[i].length; j++) {
//       if (board[i][j] !== 0) {
//         cells[j].textContent = board[i][j];

//         const addClass = 'field-cell--' + board[i][j];

//         changeAdditionalClassCell(cells[j], addClass);
//       } else {
//         cells[j].textContent = '';
//         changeAdditionalClassCell(cells[j]);
//       }
//     }
//   }

//   newCell();
// }

// function getRandomInt(max) {
//   return Math.floor(Math.random() * max);
// }

// start.addEventListener('click', ourEvent => {
//   if (start.classList.contains('start')) {
//     start.textContent = 'Restart';
//     newCell();
//     newCell();
//   }

//   start.classList.remove('start');
//   start.classList.add('restart');

//   document.addEventListener('keydown', e => {
//     switch (e.key) {
//       case 'ArrowRight':
//         break;

//       case 'ArrowLeft':
//         moveLeft();
//         break;

//       case 'ArrowUp':
//         break;

//       case 'ArrowDown':
//         break;

//       default:
//         break;
//     }
//   });
// });

let board;
let score = 0;
const rows = 4;
const columns = 4;

window.onload = function() {
  setGame();
};

function setGame() {
  // board = [
  //     [2, 2, 2, 2],
  //     [2, 2, 2, 2],
  //     [4, 4, 8, 8],
  //     [4, 4, 8, 8]
  // ];

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.createElement('div');

      tile.id = r.toString() + '-' + c.toString();

      const num = board[r][c];

      updateTile(tile, num);
      document.getElementById('board').append(tile);
    }
  }
  //  create 2 to begin the game
  setTwo();
  setTwo();
}

function updateTile(tile, num) {
  tile.innerText = '';
  tile.classList.value = ''; // clear the classList
  tile.classList.add('tile');

  if (num > 0) {
    tile.innerText = num.toString();

    if (num <= 4096) {
      tile.classList.add('x' + num.toString());
    } else {
      tile.classList.add('x8192');
    }
  }
}

document.addEventListener('keyup', (e) => {
  if (e.code === 'ArrowLeft') {
    slideLeft();
    setTwo();
  } else if (e.code === 'ArrowRight') {
    slideRight();
    setTwo();
  } else if (e.code === 'ArrowUp') {
    slideUp();
    setTwo();
  } else if (e.code === 'ArrowDown') {
    slideDown();
    setTwo();
  }
  document.getElementById('score').innerText = score;
});

function filterZero(row) {
  return row.filter(num => num !== 0); // create new array of all nums != 0
}

function slide(row_) {
  // [0, 2, 2, 2]
  let row = filterZero(row_); // [2, 2, 2]

  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  } // [4, 0, 2]
  row = filterZero(row); // [4, 2]
  // add zeroes

  while (row.length < columns) {
    row.push(0);
  } // [4, 2, 0, 0]

  return row;
}

function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];

    row = slide(row);

    board[r] = row;

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r]; // [0, 2, 2, 2]

    row.reverse(); // [2, 2, 2, 0]
    row = slide(row); // [4, 2, 0, 0]
    board[r] = row.reverse(); // [0, 0, 2, 4];

    for (let c = 0; c < columns; c++) {
      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row = slide(row);
    // board[0][c] = row[0];
    // board[1][c] = row[1];
    // board[2][c] = row[2];
    // board[3][c] = row[3];

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];

    row.reverse();
    row = slide(row);
    row.reverse();
    // board[0][c] = row[0];
    // board[1][c] = row[1];
    // board[2][c] = row[2];
    // board[3][c] = row[3];

    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];

      const tile = document.getElementById(r.toString() + '-' + c.toString());
      const num = board[r][c];

      updateTile(tile, num);
    }
  }
}

function setTwo() {
  if (!hasEmptyTile()) {
    return;
  }

  let found = false;

  while (!found) {
    // find random row and column to place a 2 in
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * columns);

    if (board[r][c] === 0) {
      board[r][c] = 2;

      const tile = document.getElementById(r.toString() + '-' + c.toString());

      tile.innerText = '2';
      tile.classList.add('x2');
      found = true;
    }
  }
}

function hasEmptyTile() {
  // const count = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if (board[r][c] === 0) { // at least one zero in the board
        return true;
      }
    }
  }

  return false;
}
