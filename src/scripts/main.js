'use strict';

const gameField = document.querySelector('.game-field').tBodies[0];
const button = document.querySelector('.controls .button');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const scoreHTML = document.querySelector('.game-score');

const MAX_ROWS = 4;
const MAX_COLS = 4;

const tiles = Array.from(Array(MAX_ROWS), () => new Array(MAX_COLS));
let availableCells = [];
let score = 0;

button.addEventListener('click', onStart);

function start() {
  reset();
  updateInfo();
  render();
}

function render() {
  [...gameField.rows].forEach((row, rowIdx) => {
    [...row.cells].forEach((cell, cellIdx) => {
      cell.className = 'field-cell';

      if (tiles[rowIdx][cellIdx] !== 0) {
        cell.classList.add(`field-cell--${tiles[rowIdx][cellIdx]}`);
        cell.textContent = tiles[rowIdx][cellIdx];
      } else {
        cell.textContent = '';
      }
    });
  });

  scoreHTML.textContent = score;
}

function reset() {
  tiles.forEach(row => row.fill(0));
  availableCells = [];

  score = 0;

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');
}

function updateInfo() {
  availableCells = [];

  tiles.forEach((row, rowIdx) => {
    row.forEach((cell, cellIdx) => {
      if (cell === 0) {
        availableCells.push({
          row: rowIdx,
          col: cellIdx,
        });
      }
    });
  });

  // console.log('>>> Before new cell is added', availableCells);

  const { position, value } = generateNewCell();

  if (position.row < MAX_ROWS && position.col < MAX_COLS) {
    tiles[position.row][position.col] = value;
  }

  availableCells.splice(
    availableCells.indexOf({
      row: position.row,
      col: position.col,
    }),
    1
  );

  // console.log('<<< After new cell is added', availableCells);

  if (availableCells.length === 0) {
    lose();
  }
}

function lose() {
  document.body.removeEventListener('keydown', onKeyDown);
  messageLose.classList.remove('hidden');

  button.classList.remove('restart');
  button.classList.add('start');
  button.textContent = 'Start';
}

function onKeyDown(e) {
  if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
    return;
  }

  const direction = e.code.replace('Arrow', '');

  // if (canBeMoved(direction)) {
  //   moveTiles(direction);
  //   updateInfo();
  // }

  if (tryMoveCell(direction)) {
    updateInfo();
  }

  render();
}

function tryMoveCell(direction) {
  switch (direction) {
    case 'Left':
    case 'Right':
      return tryMoveHorizontally(direction);
    case 'Up':
    case 'Down':
      return tryMoveVertically(direction);
  }

  return false;
}

function tryMoveHorizontally(direction) {
  let wasMoved = false;

  for (let i = 0; i < tiles.length; i++) {
    let row = tiles[i].filter(cell => cell);

    if (direction === 'Right') {
      row.reverse();
    }

    for (let j = 0; j < row.length - 1; j++) {
      if (row[j] === row[j + 1]) {
        row[j] *= 2;
        score += row[j];
        row.splice(j + 1, 1);
      }
      // collapseNeighbors(k, j, row);
    }

    row = row.concat(Array(MAX_COLS - row.length).fill(0));

    if (direction === 'Right') {
      row.reverse();
    }

    if (!row.every((cell, idx) => cell === tiles[i][idx])) {
      wasMoved = true;
    }

    tiles[i] = row;
  }

  return wasMoved;
}

function tryMoveVertically(direction) {
  const wasMoved = false;

  switch (direction) {
    case 'Up':
    case 'Down':

      break;
  }

  return wasMoved;
}

// function canBeMoved(direction) {
//   let movePossible = false;

//   switch (direction) {
//     case 'Up':
//       for (let col = 0; col < MAX_COLS; col++) {
//         for (let row = 1; row < MAX_ROWS; row++) {
//           if (
//             (tiles[row - 1][col] === 0 && tiles[row][col] !== 0)
//             || (tiles[row - 1][col] === tiles[row][col]
//                 && tiles[row][col] !== 0)
//           ) {
//             movePossible = true;
//             break;
//           }
//         }

//         if (movePossible) {
//           break;
//         }
//       }

//       break;

//     case 'Down':
//       for (let col = 0; col < MAX_COLS; col++) {
//         for (let row = MAX_ROWS - 1; row > 0; row--) {
//           if (
//             (tiles[row - 1][col] !== 0 && tiles[row][col] === 0)
//             || (tiles[row - 1][col] === tiles[row][col]
//                 && tiles[row][col] !== 0)
//           ) {
//             movePossible = true;
//             break;
//           }
//         }

//         if (movePossible) {
//           break;
//         }
//       }

//       break;

//     case 'Left':
//       tiles.some((row) => {
//         row.slice().reduce((prev, cell, idx, arr) => {
//           if ((prev === 0 && cell !== 0)
//             || (prev === cell && cell !== 0)) {
//             movePossible = true;
//             arr.splice(1);
//           }

//           return cell;
//         });

//         if (movePossible) {
//           return true;
//         }
//       });

//       break;

//     case 'Right':
//       tiles.some((row) => {
//         row.slice().reduceRight((prev, cell, idx, arr) => {
//           if ((prev === 0 && cell !== 0)
//             || (prev === cell && cell !== 0)) {
//             movePossible = true;
//             arr.splice(1);
//           }

//           return cell;
//         });

//         if (movePossible) {
//           return true;
//         }
//       });

//       break;
//   }

//   return availableCells.length !== 0 && movePossible;
// }

// function moveTiles(direction) {
//   switch (direction) {
//     case 'Up':
//       for (let col = 0; col < MAX_COLS; col++) {
//         let column = [];

//         for (let row = 0; row < MAX_ROWS; row++) {
//           if (tiles[row][col] !== 0) {
//             column.push(tiles[row][col]);
//           }
//         }

//         column = column.concat(Array(MAX_ROWS - column.length).fill(0));

//         for (let k = 0, j = 1; j < column.length; k++, j++) {
//           collapseNeighbors(k, j, column);
//         }

//         for (let row = 0; row < MAX_ROWS; row++) {
//           tiles[row][col] = column[row];
//         }
//       }

//       break;

//     case 'Down':
//       for (let col = 0; col < MAX_COLS; col++) {
//         let column = [];

//         for (let row = 0; row < MAX_ROWS; row++) {
//           if (tiles[row][col] !== 0) {
//             column.push(tiles[row][col]);
//           }
//         }

//         column = Array(MAX_ROWS - column.length).fill(0).concat(column);

//         for (let k = column.length - 1, j = k - 1; j >= 0; k--, j--) {
//           if (column[k] === column[j]) {
//             column[k] *= 2;
//             score += column[k];
//             column.splice(j, 1);
//             column.unshift(0);
//           }
//         }

//         for (let row = 0; row < MAX_ROWS; row++) {
//           tiles[row][col] = column[row];
//         }
//       }

//       break;

//     case 'Left':
//       for (let i = 0; i < tiles.length; i++) {
//         let row = tiles[i].filter(cell => cell);

//         row = row.concat(Array(MAX_COLS - row.length).fill(0));

//         for (let k = 0, j = 1; j < row.length; k++, j++) {
//           collapseNeighbors(k, j, row);
//         }

//         tiles[i] = row;
//       }

//       break;

//     case 'Right':
//       for (let i = 0; i < tiles.length; i++) {
//         const newRow = tiles[i].filter(cell => cell);

//         // move zeros to the front
//         tiles[i] = Array(MAX_COLS - newRow.length).fill(0).concat(newRow);

//         // collapse neighbors
//         for (let k = tiles[i].length - 1, j = k - 1; j >= 0; k--, j--) {
//           const row = tiles[i];

//           if (row[k] === row[j]) {
//             row[k] *= 2;
//             score += row[k];
//             row.splice(j, 1);
//             row.unshift(0);
//           }
//         }
//       }

//       break;
//   }
// }

// function collapseNeighbors(k, j, row) {
//   const collapsedRow = row;

//   if (collapsedRow[k] === collapsedRow[j]) {
//     collapsedRow[k] *= 2;
//     score += collapsedRow[k];
//     collapsedRow.splice(j, 1);
//     collapsedRow.push(0);
//   }
// }

function generateNewCell() {
  const position = Math.floor(Math.random() * availableCells.length);
  const value = Math.random() < 0.9 ? 2 : 4;

  return {
    position: availableCells[position],
    value,
  };
}

function onStart(e) {
  if (!e.target.matches('.button')) {
    return;
  }

  if (e.target.classList.contains('start')) {
    e.target.classList.remove('start');
    e.target.classList.add('restart');
    e.target.textContent = 'Restart';

    document.body.addEventListener('keydown', onKeyDown);
  }

  start();
}
