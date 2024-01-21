'use strict';

const initialField = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let upDatefield = initialField;
let scoreNumber = 0;
const cells = document.getElementsByClassName('field-cell');
const scoreText = document.getElementsByClassName('game-score');
const buttonStart = document.querySelector('button');
const startText = document.getElementsByClassName('message-start');
const lose = document.getElementsByClassName('message-lose')[0];

let gameStarted = false;

buttonStart.addEventListener('click', () => {
  gameStarted = true;
  scoreNumber = 0;
  scoreText[0].innerHTML = scoreNumber;
  upDatefield = replaceRandomZero(initialField);
  upDatefield = replaceRandomZero(upDatefield);
  lose.style.display = 'none';
  initial(upDatefield);
  styleCells();
  startText[0].style.display = 'none';
  buttonStart.classList.add('restart');
  buttonStart.innerHTML = 'restart';
});

document.addEventListener('keydown', function() {
  if (gameStarted) {
    const originalUpDatefield = [...upDatefield];

    switch (event.key) {
      case 'ArrowLeft':
        upDatefield = slide(upDatefield, 'left');

        break;

      case 'ArrowRight':
        upDatefield = slide(upDatefield, ('right'));

        break;

      case 'ArrowUp':
        upDatefield = vertical(upDatefield, 'up');
        break;

      case 'ArrowDown':
        upDatefield = vertical(upDatefield, 'down');
        break;

      default:
    }

    if (JSON.stringify(upDatefield) !== JSON.stringify(originalUpDatefield)) {
      upDatefield = replaceRandomZero(upDatefield);
      initial(upDatefield);
      styleCells();
    }
    checker();
  }
});

function initial(arr) {
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerHTML = arr[i] > 0 ? arr[i] : '';
  }
}

function slide(field, direction) {
  let tempField = [...field];
  const rows = [];

  for (let i = 0; i < tempField.length; i += 4) {
    rows.push(tempField.slice(i, i + 4));
  }

  rows.map((item, index) => {
    if (direction === 'left') {
      rows[index] = horizontal(item, 'left');
    } else if (direction === 'right') {
      rows[index] = horizontal(item.reverse(), 'right');
    }
  });

  tempField = [].concat(...rows);

  if (JSON.stringify(upDatefield) === JSON.stringify(tempField)) {
    return upDatefield;
  }

  upDatefield = tempField;
  scoreText[0].innerHTML = scoreNumber;
  // checker();

  return upDatefield;
}

function horizontal(row, direction) {
  let tempRow = removeZero(row);

  for (let i = 0; i < tempRow.length - 1; i++) {
    if (tempRow[i + 1] === tempRow[i]) {
      [tempRow[i], tempRow[i + 1]] = [tempRow[i] * 2, 0];
      scoreNumber += tempRow[i];
    }
  }

  // Remove 0's
  tempRow = removeZero(tempRow);

  // Fill 0's
  tempRow = fillArrayWithZero(tempRow);

  return direction === 'left' ? tempRow : tempRow.reverse();
}

function vertical(arr, dir) {
  let columns = Array.from({ length: 4 }, (_, colIndex) =>
    arr.filter((__, rowIndex) => rowIndex % 4 === colIndex),
  );

  columns = [].concat(...columns);

  if (dir === 'up') {
    columns = slide(columns, 'left');
  } else if (dir === 'down') {
    columns = slide(columns, 'right');
  }

  const numCols = columns.length / 4;
  const transposedArray = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < numCols; j++) {
      transposedArray.push(columns[i + j * 4]);
    }
  }

  upDatefield = transposedArray;
  scoreText[0].innerHTML = scoreNumber;

  return upDatefield;
}

// manipulate with row
function removeZero(row) {
  return row.filter((item) => item > 0);
}

function fillArrayWithZero(arr) {
  let res = arr;

  res.length = 4;
  res = Array.from(res, (item) => (item || 0));

  return res;
}

function replaceRandomZero(array) {
  const zeroIndices = array.reduce((indices, value, index) => {
    if (value === 0) {
      indices.push(index);
    }

    return indices;
  }, []);

  if (zeroIndices.length === 0) {
    return array;
  }

  const partCondition = Math.floor(Math.random() * zeroIndices.length);
  const randomIndex = zeroIndices[partCondition];

  const replacementValue = Math.random() < 0.9 ? 2 : 4;

  return array.map((value, index) => {
    return (index === randomIndex ? replacementValue : value);
  });
}

function checker() {
  const original = [...upDatefield];
  const left = slide(original, 'left');
  const right = slide(original, 'right');
  const down = vertical(original, 'down');
  const up = vertical(original, 'up');

  if (upDatefield.includes(2048)) {
    const win = document.getElementsByClassName('message-win')[0];

    win.style.display = 'block';
  } else if (
    JSON.stringify(original) === JSON.stringify(left)
    && JSON.stringify(original) === JSON.stringify(right)
    && JSON.stringify(original) === JSON.stringify(down)
    && JSON.stringify(original) === JSON.stringify(up)
  ) {
    upDatefield = original;
    lose.style.display = 'block';

    return true;
  }
  upDatefield = original;

  return false;
}

function styleCells() {
  for (let i = 0; i < cells.length; i++) {
    cells[i].className = ('field-cell');
    cells[i].classList.add(`field-cell--${cells[i].innerHTML}`);
  }
}
