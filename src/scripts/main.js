'use strict';

const start = document.querySelector('.start');
const cells = document.querySelectorAll('.field-cell');
const bookedCells = [];
const arrayWithValues = [];

const score = document.querySelector('.game-score');
let scoreCounter = 0;

const messageLose = document.querySelector('.message-lose');
let noUpdates = true;
let finish = false;

const messagWin = document.querySelector('.message-win');
let win = false;

const takeStep = () => {
  let position = Math.floor(Math.random() * 16);

  while (bookedCells.includes(position)) {
    position = Math.floor(Math.random() * 16);
  }

  const step = cells[position];
  const value = Math.ceil((Math.random() * 10) % 2) * 2;

  step.classList.add(`field-cell--${value}`);
  step.innerHTML = value;

  bookedCells.push(position);
};

const newGame = () => {
  changeScore(0);

  takeStep();
  takeStep();
};

const clearCell = () => {
  for (const cell of cells) {
    if (cell.classList.length > 1) {
      const listOfClasses
        = cell.classList.toString().replace('field-cell ', '');

      cell.classList.remove(listOfClasses);
      cell.innerHTML = '';
    }
  }
};

const saveCellsValues = () => {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].innerHTML) {
      arrayWithValues.push([i, +cells[i].innerHTML]);
    }
  }
};

const getBookedPositions = () => {
  clearArray(bookedCells);

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].innerHTML !== '') {
      bookedCells.push(i);
    }
  }
};

const fillInBoard = (array) => {
  array.forEach(cell => {
    cells[cell[0]].classList.add(`field-cell--${cell[1]}`);
    cells[cell[0]].innerHTML = cell[1];
  });
};

const clearArray = (array) => {
  while (array.length > 0) {
    array.pop();
  }
};

const changeScore = (value) => {
  value === 0 ? scoreCounter = value : scoreCounter += value;
  score.innerHTML = scoreCounter;
};

newGame();

start.addEventListener('click', () => {
  clearCell();
  clearArray(bookedCells);
  clearArray(arrayWithValues);
  newGame();
  messageLose.classList.add('hidden');
});

const handleArrowClick = (side) => {
  for (let i = 0; i < 4; i++) {
    let slice;

    if (side === 'ArrowUp' || side === 'ArrowDown') {
      slice = arrayWithValues.filter(value => value[0] % 4 === i);
    } else {
      slice = arrayWithValues.filter(value => Math.floor(value[0] / 4) === i);
    }

    if (slice.length) {
      let extremeCellStep;
      let extremeCellPosition;
      // let start;

      switch (side) {
        case 'ArrowUp':
          // start = 0;
          extremeCellPosition = i;
          extremeCellStep = 4;
          break;

        case 'ArrowDown':
          // start = 3;
          extremeCellPosition = 12 + i;
          extremeCellStep = -4;
          break;

        case 'ArrowRight':
          // start = 3;
          extremeCellPosition = 4 * i + 3;
          extremeCellStep = -1;
          break;

        case 'ArrowLeft':
          // start = 0;
          extremeCellPosition = 4 * i;
          extremeCellStep = 1;
          break;
      }

      const step = extremeCellStep > 0 ? 1 : -1;

      if (side === 'ArrowUp' || side === 'ArrowLeft') {
        for (let j = 0; j < 4; j++) {
          if (slice[j]) {
            if (slice[j][0] - extremeCellPosition > 0) {
              slice[j][0] = extremeCellPosition;
              noUpdates = false;
            }

            if (slice[j + step] && slice[j][1] === slice[j + step][1]) {
              const newValue = slice[j][1] * 2;

              slice[j][1] = newValue;
              slice.splice(j + step, 1);
              changeScore(newValue);

              if (newValue === 2048) {
                win = true;
              }

              noUpdates = false;
            }

            extremeCellPosition += extremeCellStep;
          }
        }
      } else {
        for (let j = 3; j >= 0; j--) {
          if (slice[j]) {
            if (slice[j][0] - extremeCellPosition < 0) {
              slice[j][0] = extremeCellPosition;
              noUpdates = false;
            }

            if (slice[j + step] && slice[j][1] === slice[j + step][1]) {
              const newValue = slice[j][1] * 2;

              slice[j][1] = newValue;
              slice.splice(j + step, 1);
              changeScore(newValue);

              if (newValue === 2048) {
                win = true;
              }

              noUpdates = false;
            }
            extremeCellPosition += extremeCellStep;
          }
        }
      }

      fillInBoard(slice);
    }
  }

  if (bookedCells.length === 16 && noUpdates) {
    finish = true;
    console.log('finish');
    // div.classList.toggle("visible", i < 10);
  }
};

document.addEventListener('keydown', evn => {
  if (finish) {
    console.log('return');
    return;
  }

  const key = evn.key;

  saveCellsValues();
  clearCell();

  handleArrowClick(key);

  clearArray(arrayWithValues);
  getBookedPositions();
  takeStep();

  messagWin.classList.toggle('hidden', !win);
  messageLose.classList.toggle('hidden', !finish);
});

// 'use strict';

// const start = document.querySelector('.start');
// const cells = document.querySelectorAll('.field-cell');
// const score = document.querySelector('.game-score');

// let scoreCounter = 0;
// const bookedCells = [];
// const arrayWithValues = [];

// const takeStep = () => {
//   let position = Math.floor(Math.random() * 16);

//   while (bookedCells.includes(position)) {
//     position = Math.floor(Math.random() * 16);
//   }

//   const step = cells[position];
//   const value = Math.ceil((Math.random() * 10) % 2) * 2;

//   step.classList.add(`field-cell--${value}`);
//   step.innerHTML = value;

//   bookedCells.push(position);
// };

// const newGame = () => {
//   changeScore(0);

//   takeStep();
//   takeStep();
// };

// const clearCell = () => {
//   for (const cell of cells) {
//     if (cell.classList.length > 1) {
//       const listOfClasses
//         = cell.classList.toString().replace('field-cell ', '');

//       cell.classList.remove(listOfClasses);
//       cell.innerHTML = '';
//     }
//   }
// };

// const saveCellsValues = () => {
//   for (let i = 0; i < cells.length; i++) {
//     if (cells[i].innerHTML) {
//       arrayWithValues.push([i, +cells[i].innerHTML]);
//     }
//   }
// };

// const getBookedPositions = () => {
//   clearArray(bookedCells);

//   for (let i = 0; i < cells.length; i++) {
//     if (cells[i].innerHTML !== '') {
//       bookedCells.push(i);
//     }
//   }
// };

// const fillInBoard = (array) => {
//   array.forEach(cell => {
//     cells[cell[0]].classList.add(`field-cell--${cell[1]}`);
//     cells[cell[0]].innerHTML = cell[1];
//   });
// };

// const clearArray = (array) => {
//   while (array.length > 0) {
//     array.pop();
//   }
// };

// const changeScore = (value) => {
//   value === 0 ? scoreCounter = value : scoreCounter += value;
//   score.innerHTML = scoreCounter;
// };

// newGame();

// start.addEventListener('click', () => {
//   clearCell();
//   clearArray(bookedCells);
//   clearArray(arrayWithValues);
//   newGame();
// });

// document.addEventListener('keydown', evn => {
//   const key = evn.key;

//   saveCellsValues();
//   clearCell();

//   switch (key) {
//     case 'ArrowUp':
//       for (let i = 0; i < 4; i++) {
//         const slice = arrayWithValues.filter(value => value[0] % 4 === i);

//         if (slice.length) {
//           let upperCell = i;

//           for (let j = 0; j < 4; j++) {
//             if (slice[j]) {
//               if (slice[j][0] > upperCell) {
//                 slice[j][0] = upperCell;
//               }

//               if (slice[j + 1] && slice[j][1] === slice[j + 1][1]) {
//                 const newValue = slice[j][1] * 2;

//                 slice[j][1] = newValue;
//                 slice.splice(j + 1, 1);
//                 changeScore(newValue);
//               }

//               upperCell += 4;
//             }
//           }

//           fillInBoard(slice);
//         }
//       }
//       break;

//     case 'ArrowDown':
//       for (let i = 0; i < 4; i++) {
//         const slice = arrayWithValues.filter(value => value[0] % 4 === i);

//         if (slice.length) {
//           let lowerCell = 12 + i;

//           for (let j = 3; j >= 0; j--) {
//             if (slice[j]) {
//               if (slice[j][0] < lowerCell) {
//                 slice[j][0] = lowerCell;
//               }

//               if (slice[j - 1] && slice[j][1] === slice[j - 1][1]) {
//                 const newValue = slice[j][1] * 2;

//                 slice[j][1] = newValue;
//                 slice.splice(j - 1, 1);
//                 changeScore(newValue);
//               }
//               lowerCell -= 4;
//             }
//           }

//           fillInBoard(slice);
//         }
//       }
//       break;

//     case 'ArrowRight':
//       for (let i = 0; i < 4; i++) {
//         const slice = arrayWithValues.filter(
//           value => Math.floor(value[0] / 4) === i
//         );

//         if (slice.length) {
//           let rightCell = 4 * i + 3;

//           for (let j = 3; j >= 0; j--) {
//             if (slice[j]) {
//               if (slice[j][0] < rightCell) {
//                 slice[j][0] = rightCell;
//               }

//               if (slice[j - 1] && slice[j][1] === slice[j - 1][1]) {
//                 const newValue = slice[j][1] * 2;

//                 slice[j][1] = newValue;
//                 slice.splice(j - 1, 1);
//                 changeScore(newValue);
//               }
//               rightCell -= 1;
//             }
//           }

//           fillInBoard(slice);
//         }
//       }
//       break;

//     case 'ArrowLeft':
//       for (let i = 0; i < 4; i++) {
//         const slice
//           = arrayWithValues.filter(value => Math.floor(value[0] / 4) === i);

//         if (slice.length) {
//           let leftCell = 4 * i;

//           for (let j = 0; j < 4; j++) {
//             if (slice[j]) {
//               if (slice[j][0] > leftCell) {
//                 slice[j][0] = leftCell;
//               }

//               if (slice[j + 1] && slice[j][1] === slice[j + 1][1]) {
//                 const newValue = slice[j][1] * 2;

//                 slice[j][1] = newValue;
//                 slice.splice(j + 1, 1);
//                 changeScore(newValue);
//               }
//               leftCell += 1;
//             }
//           }

//           fillInBoard(slice);
//         }
//       }
//       break;
//   }

//   clearArray(arrayWithValues);
//   getBookedPositions();
//   takeStep();
// });
