'use strict';

const board = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

// const board = [
//   [0, 2, 2, 2],
//   [0, 0, 2, 2],
//   [0, 0, 0, 2],
//   [2, 0, 0, 0],
// ];

console.table(board);

let probabilityCount = 0;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function newCell() {
  let rowInd = 0;
  let cellInd = 0;

  while (true) {
    rowInd = getRandomInt(4);
    cellInd = getRandomInt(4);

    if (board[rowInd][cellInd] === 0) {
      if (probabilityCount < 10) {
        board[rowInd][cellInd] = 2;
        probabilityCount++;
      } else {
        board[rowInd][cellInd] = 4;
        probabilityCount = 0;
      }

      console.log('add new cell');
      console.table(board);

      return;
    }
  }
};

function shiftRowLeft(row) {
  const newRow = [];

  for (let j = 0; j < row.length; j++) {
    if (row[j] !== 0) {
      newRow.push(row[j]);
    }
  }

  for (let j = newRow.length; j < row.length; j++) {
    newRow.push(0);
  }

  return newRow;
}

function moveRight() {
  for (let i = 0; i < board.length; i++) {
    board[i] = shiftRowLeft(board[i]).reverse();
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 1; j < board[i].length; j++) {
      if (board[i][j - 1] === board[i][j]) {
        board[i][j - 1] = 0;
        board[i][j] = board[i][j] * 2;
      }
    }
  }

  for (let i = 0; i < board.length; i++) {
    board[i] = shiftRowLeft(board[i]).reverse();
  }

  console.log('move right');
  console.table(board);
}

function moveLeft() {
  for (let i = 0; i < board.length; i++) {
    board[i] = shiftRowLeft(board[i]);
  }

  for (let i = 0; i < board.length; i++) {
    for (let j = 1; j < board[i].length; j++) {
      if (board[i][j - 1] === board[i][j]) {
        board[i][j - 1] = board[i][j - 1] * 2;
        board[i][j] = 0;
      }
    }
  }

  for (let i = 0; i < board.length; i++) {
    board[i] = shiftRowLeft(board[i]);
  }

  console.log('move left');
  console.table(board);
}

function moveUp() {
  for (let i = 0; i < board.length; i++) {
    let newColumn = [];

    for (let j = 0; j < board[0].length; j++) {
      newColumn.push(board[j][i]);
    }

    newColumn = shiftRowLeft(newColumn);

    for (let j = 1; j < newColumn.length; j++) {
      if (newColumn[j - 1] === newColumn[j]) {
        newColumn[j - 1] = newColumn[j - 1] * 2;
        newColumn[j] = 0;
      }
    }

    newColumn = shiftRowLeft(newColumn);

    for (let j = 0; j < newColumn.length; j++) {
      board[j][i] = newColumn[j];
    }
  }

  console.log('move up');
  console.table(board);
}

function moveDown() {
  for (let i = 0; i < board.length; i++) {
    let newColumn = [];

    for (let j = 0; j < board[0].length; j++) {
      newColumn.push(board[j][i]);
    }

    newColumn = shiftRowLeft(newColumn).reverse();

    for (let j = 1; j < newColumn.length; j++) {
      if (newColumn[j - 1] === newColumn[j]) {
        newColumn[j - 1] = 0;
        newColumn[j] = newColumn[j] * 2;
      }
    }

    newColumn = shiftRowLeft(newColumn).reverse();

    for (let j = 0; j < newColumn.length; j++) {
      board[j][i] = newColumn[j];
    }
  }

  console.log('move down');
  console.table(board);
}

function changeAdditionalClassCell(element, newAddClass) {
  element.classList = '';
  element.classList.add('field-cell');

  if (newAddClass) {
    element.classList.add(newAddClass);
  }
}

function display() {
  const body = document.querySelector('body');
  const fieldRowAll = body.querySelectorAll('.field-row');

  for (let i = 0; i < board.length; i++) {
    const cells = fieldRowAll[i].querySelectorAll('.field-cell');

    for (let j = 0; j < board[i].length; j++) {
      if (board[i][j] !== 0) {
        cells[j].textContent = board[i][j];

        const addClass = 'field-cell--' + board[i][j];

        changeAdditionalClassCell(cells[j], addClass);
      } else {
        cells[j].textContent = '';
        changeAdditionalClassCell(cells[j]);
      }
    }
  }
}

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'ArrowRight':
      moveRight();
      display();
      newCell();
      display();
      break;

    case 'ArrowLeft':
      moveLeft();
      display();
      newCell();
      display();
      break;

    case 'ArrowUp':
      moveUp();
      display();
      newCell();
      display();
      break;

    case 'ArrowDown':
      moveDown();
      display();
      newCell();
      display();
      break;

    default:
      break;
  }
});

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

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
