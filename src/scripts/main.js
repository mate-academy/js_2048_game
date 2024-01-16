'use strict';

const initialField = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let upDatefield = replaceRandomZero(initialField);
let scoreNumber = 0;
const cells = document.getElementsByClassName('field-cell');
const scoreText = document.getElementsByClassName('game-score');
const buttonStart = document.querySelector('button');
const startText = document.getElementsByClassName('message-start');

buttonStart.addEventListener('click', () => {
  scoreNumber = 0;
  upDatefield = initialField;
  upDatefield = replaceRandomZero(upDatefield);
  initial(upDatefield);
  styleCells();

  startText[0].style.display = 'none';
  buttonStart.innerHTML = 'restart';
  buttonStart.style.backgroundColor = 'rgba(254,105,110,255)';

  document.addEventListener('keydown', function() {
    switch (event.key) {
      case 'ArrowLeft':
        upDatefield = keyLeft(upDatefield);
        upDatefield = replaceRandomZero(upDatefield);
        initial(upDatefield);
        styleCells();
        checker();
        break;

      case 'ArrowRight':
        upDatefield = keyRight(upDatefield);
        upDatefield = replaceRandomZero(upDatefield);
        initial(upDatefield);
        styleCells();
        checker();
        break;

      case 'ArrowUp':
        upDatefield = keyUp(upDatefield);
        upDatefield = replaceRandomZero(upDatefield);
        initial(upDatefield);
        styleCells();
        checker();
        break;

      case 'ArrowDown':
        upDatefield = keyDown(upDatefield);
        upDatefield = replaceRandomZero(upDatefield);
        initial(upDatefield);
        styleCells();
        checker();
        break;

      default:
    }
  });
});

function initial(arr) {
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerHTML = arr[i];
  }
}

// PRESS LEFT <-----------------------------------
// Split the flat array into rows
function keyLeft(field) {
  let matrix = field;
  const rows = [];

  for (let i = 0; i < matrix.length; i += 4) {
    rows.push(matrix.slice(i, i + 4));
  }

  rows.map((item, index) => {
    rows[index] = moveLeft(item);
  });

  matrix = [].concat(...rows);

  // Now `field` is updated based on the manipulated rows
  function moveLeft(row) {
    // remove 0's
    let tempRow = row;

    tempRow = removeZero(row);

    // move & sum rows near cells
    for (let i = 0; i < tempRow.length - 1; i++) {
      if (tempRow[i + 1] === tempRow[i]) {
        scoreNumber += tempRow[i] * 2;
        [tempRow[i], tempRow[i + 1]] = [tempRow[i] * 2, 0];
      }
    }
    tempRow = removeZero(tempRow);

    tempRow = fillArrayWithZero(tempRow);

    return tempRow;
  }

  if (JSON.stringify(upDatefield) === JSON.stringify(matrix)) {
    return upDatefield;
  }

  upDatefield = matrix;
  scoreText[0].innerHTML = scoreNumber;
  // checker();

  return upDatefield;
}

// PRESS RIGHT ----------------------------------->

function keyRight(field) {
  // Split the flat array into rows
  let tempField = field;
  const rows = [];

  for (let i = 0; i < tempField.length; i += 4) {
    rows.push(tempField.slice(i, i + 4));
  }

  rows.map((item, index) => {
    rows[index] = item.reverse();
    rows[index] = moveRight(item);
  });

  tempField = [].concat(...rows);

  function moveRight(row) {
    let tempRow = row;

    tempRow = removeZero(tempRow);

    // move & sum rows near cells
    for (let i = 0; i < tempRow.length - 1; i++) {
      if (tempRow[i + 1] === tempRow[i]) {
        scoreNumber += tempRow[i] * 2;
        [tempRow[i], tempRow[i + 1]] = [tempRow[i] * 2, 0];
      }
    }

    // remove 0's
    tempRow = removeZero(tempRow);

    // fill 0's
    tempRow = fillArrayWithZero(tempRow);

    return tempRow.reverse();
  }

  if (JSON.stringify(upDatefield) === JSON.stringify(tempField)) {
    return upDatefield;
  }

  upDatefield = tempField;
  scoreText[0].innerHTML = scoreNumber;
  // checker();

  return upDatefield;
}

// PRESS UP
function keyUp(arr) {
  let columns = Array.from({ length: 4 }, (_, colIndex) =>
    arr.filter((__, rowIndex) => rowIndex % 4 === colIndex),
  );

  columns = [].concat(...columns);
  columns = keyLeft(columns);

  const numCols = columns.length / 4;
  const transposedArray = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < numCols; j++) {
      transposedArray.push(columns[i + j * 4]);
    }
  }

  upDatefield = transposedArray;
  scoreText[0].innerHTML = scoreNumber;

  // checker();
  return upDatefield;
}

// press down
function keyDown(arr) {
  let columns = Array.from({ length: 4 }, (_, colIndex) =>
    arr.filter((__, rowIndex) => rowIndex % 4 === colIndex),
  );

  columns = [].concat(...columns);

  columns = keyRight(columns);

  const numCols = columns.length / 4;
  const transposedArray = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < numCols; j++) {
      transposedArray.push(columns[i + j * 4]);
    }
  }

  upDatefield = transposedArray;

  return transposedArray;
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
  // return array;
}

function checker() {
  const original = upDatefield;
  const left = keyLeft(original);
  const right = keyRight(original);
  const down = keyDown(original);
  const up = keyUp(original);

  if (upDatefield.includes(2048)) {
    const win = document.getElementsByClassName('message-win')[0];

    win.style.display = 'block';
  } else if (JSON.stringify(original) === JSON.stringify(left)
    && JSON.stringify(original) === JSON.stringify(right)
    && JSON.stringify(original) === JSON.stringify(down)
    && JSON.stringify(original) === JSON.stringify(up)) {
    const lose = document.getElementsByClassName('message-lose')[0];

    upDatefield = original;
    lose.style.display = 'block';

    return true;
  }
  upDatefield = original;

  return false;
}

function styleCells() {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].innerHTML === '0') {
      cells[i].innerHTML = '';
      cells[i].style.backgroundColor = 'rgba(217,204,195,255)';
    } else if (cells[i].innerHTML === '2') {
      cells[i].style.color = 'rgba(120,111,100,255)';
      cells[i].style.backgroundColor = 'rgba(240,229,216,255)';
    } else if (cells[i].innerHTML === '4') {
      cells[i].style.color = 'rgba(120,111,100,255)';
      cells[i].style.backgroundColor = 'rgba(240,223,197,255)';
    } else if (cells[i].innerHTML === '8') {
      cells[i].style.color = 'white';
      cells[i].style.backgroundColor = 'rgba(255,174,110,255)';
    } else if (cells[i].innerHTML === '16') {
      cells[i].style.color = 'white';
      cells[i].style.backgroundColor = 'rgba(254,142,87,255)';
    } else if (cells[i].innerHTML === '32') {
      cells[i].style.color = 'white';
      cells[i].style.backgroundColor = 'rgba(255,114,84,255)';
    } else if (cells[i].innerHTML === '64') {
      cells[i].style.color = 'white';
      cells[i].style.backgroundColor = 'rgba(255,78,41,255)';
    } else if (cells[i].innerHTML === '128') {
      cells[i].style.color = 'white';
      cells[i].style.backgroundColor = 'rgba(242,206,96,255)';
    } else if (cells[i].innerHTML === '256') {
      cells[i].style.color = 'white';
      cells[i].style.backgroundColor = 'rgba(244,203,72,255)';
    } else if (cells[i].innerHTML === '512') {
      cells[i].style.color = 'white';
      cells[i].style.backgroundColor = 'rgba(245,199,45,255)';
    } else if (cells[i].innerHTML === '1024') {
      cells[i].style.color = 'white';
      cells[i].style.backgroundColor = 'rgba(244,195,1,255)';
    } else if (cells[i].innerHTML === '2048') {
      cells[i].style.color = 'white';
      cells[i].style.backgroundColor = 'rgba(245,192,0,255)';
    }
  }
}

