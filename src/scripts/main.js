/* eslint-disable */
let initialField = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let upDatefield = initialField;
let scoreNumber = 0;
const cells = document.getElementsByClassName('field-cell');
const scoreText = document.getElementsByClassName('game-score');
const buttonStart = document.querySelector('button');



buttonStart.addEventListener('click', () => {
  initialField = replaceRandomZero(initialField);
  upDatefield = initialField;
  initial(initialField)
  scoreNumber = 0;
  document.addEventListener('keydown', function(event) {
    switch (event.key) {
      case 'ArrowLeft':
        keyLeft(upDatefield);
        break;

      case 'ArrowRight':
        keyRight(upDatefield);
        break;

      case 'ArrowUp':
        keyUp(upDatefield);
        break;

      case 'ArrowDown':
        keyDown(upDatefield);
        break;

      default:
        return;
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
  let rows = [];
  for (let i = 0; i < field.length; i += 4) {
    rows.push(field.slice(i, i + 4));
  }

  rows.map((item, index) => {
    rows[index] = moveLeft(item);
  });

  field = [].concat(...rows);
  // Now `field` is updated based on the manipulated rows
  function moveLeft(row) {
    // remove 0's
    row = removeZero(row);

    // move & sum rows near cells
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i + 1] === row[i]) {
        scoreNumber += row[i] * 2;
        [row[i], row[i + 1]] = [row[i] * 2, 0];
      }
    }
    row = removeZero(row);

    row = fillArrayWithZero(row);

    return row;
  }

  if (JSON.stringify(upDatefield) === JSON.stringify(field)) {
    return upDatefield;
  }

  upDatefield = replaceRandomZero(field);
  initial(upDatefield)
  scoreText[0].innerHTML = scoreNumber;
  finishChecker();

  return upDatefield;
}

// PRESS RIGHT ----------------------------------->

function keyRight(field) {
  // Split the flat array into rows
  let rows = [];
  for (let i = 0; i < field.length; i += 4) {
    rows.push(field.slice(i, i + 4));
  }

  rows.map((item, index) => {
    rows[index] = item.reverse();
    rows[index] = moveRight(item);
  });

  field = [].concat(...rows);

  function moveRight(row) {

    row = removeZero(row);

    // move & sum rows near cells
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i + 1] === row[i]) {
        scoreNumber += row[i] * 2;
        [row[i], row[i + 1]] = [row[i] * 2, 0];
      }
    }

    // remove 0's
    row = removeZero(row);

    // fill 0's
    row = fillArrayWithZero(row);

    return row.reverse();
  }

  if (JSON.stringify(upDatefield) === JSON.stringify(field)) {
    return upDatefield;
  }

  upDatefield = replaceRandomZero(field);
  scoreText[0].innerHTML = scoreNumber;
  initial(upDatefield);
  finishChecker();

  return field;
}

// PRESS UP
function keyUp(arr) {
  let columns = Array.from({ length: 4 }, (_, colIndex) =>
    arr.filter((_, rowIndex) => rowIndex % 4 === colIndex)
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
  initial(upDatefield);

  return transposedArray;
}

//press down
function keyDown(arr) {
  let columns = Array.from({ length: 4 }, (_, colIndex) =>
    arr.filter((_, rowIndex) => rowIndex % 4 === colIndex)
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
  initial(upDatefield);

  return transposedArray;
}

// manipulate with row
function removeZero(row) {
  return row.filter((item) => item > 0);
}

function fillArrayWithZero(arr) {
  let res = arr;

  res.length = 4;
  res = Array.from(res, (item) => (item ? item : 0));

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

  const randomIndex = zeroIndices[Math.floor(Math.random() * zeroIndices.length)];

  const replacementValue = Math.random() < 0.9 ? 2 : 4;

  return array.map((value, index) => (index === randomIndex ? replacementValue : value));
}

