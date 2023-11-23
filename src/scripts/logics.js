function startRestart(cells) {
  let cellsArr = cells;

  cellsArr = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  let i = 0;

  while (i < 2) {
    const empty = getEmptyList(cellsArr);

    empty.sort(makeRandomArr);

    const randomNum = empty.pop();
    const coordinates = getIndexFromNumber(randomNum);

    cellsArr = insertTwoOrFour(cellsArr, coordinates[0], coordinates[1]);
    i++;
  }

  return cellsArr;
}

function getNumberFromIndex(i, j) {
  return (i * 4) + Number(j) + 1;
}

function getIndexFromNumber(num) {
  let tempNum = num;

  tempNum -= 1;

  const x = Math.floor(tempNum / 4);
  const y = tempNum % 4;

  return [x, y];
}

function insertTwoOrFour(arr, x, y) {
  if (Math.random() <= 0.75) {
    arr[x][y] = 2;
  } else {
    arr[x][y] = 4;
  }

  return arr;
}

function getEmptyList(arr) {
  const empty = [];

  for (let i = 0; i < arr.length; i++) {
    for (const j in arr) {
      if (arr[i][j] === 0) {
        const num = getNumberFromIndex(i, j);

        empty.push(num);
      }
    }
  }

  return empty;
}

function makeRandomArr(a, b) {
  return Math.random() - 0.5;
}

function moveLeft(arr, gameScore) {
  let score = gameScore;

  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].filter(num => num !== 0);

    while (arr[i].length < 4) {
      arr[i].push(0);
    }
  }

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j <= 3; j++) {
      if (arr[i][j] === arr[i][j + 1] && arr[i][j] !== 0) {
        arr[i][j] *= 2;
        score += arr[i][j];
        arr[i][j + 1] = 0;
      }
    }
  }

  return [arr, score];
}

function moveRight(arr, gameScore) {
  let score = gameScore;

  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i].filter(num => num !== 0);

    while (arr[i].length < 4) {
      arr[i].unshift(0);
    }
  }

  for (let i = 0; i < arr.length; i++) {
    for (let j = 3; j > 0; j--) {
      if (arr[i][j] === arr[i][j - 1] && arr[i][j] !== 0) {
        arr[i][j] *= 2;
        score += arr[i][j];
        arr[i][j - 1] = 0;
      }
    }
  }

  return [arr, score];
}

function moveUp(arr, gameScore) {
  let score = gameScore;
  let j = 0;
  let column = [];

  while (j < 4) {
    for (let i = 0; i < arr.length; i++) {
      column.push(arr[i][j]);
    }
    column = column.filter(num => num !== 0);

    while (column.length < 4) {
      column.push(0);
    }

    for (let i = 0; i < 3; i++) {
      if (column[i] === column[i + 1] && column[i] !== 0) {
        column[i] *= 2;
        score += column[i];
        column[i + 1] = 0;
      }
    }

    for (let i = 0; i < arr.length; i++) {
      arr[i][j] = column[i];
    }
    column = [];
    j++;
  }

  return [arr, score];
}

function moveDown(arr, gameScore) {
  let score = gameScore;
  let j = 0;
  let column = [];

  while (j < 4) {
    for (let i = 0; i < arr.length; i++) {
      column.push(arr[i][j]);
    }
    column = column.filter(num => num !== 0);

    while (column.length < 4) {
      column.unshift(0);
    }

    for (let i = 3; i > 0; i--) {
      if (column[i] === column[i - 1] && column[i] !== 0) {
        column[i] *= 2;
        score += column[i];
        column[i - 1] = 0;
      }
    }

    for (let i = 0; i < arr.length; i++) {
      arr[i][j] = column[i];
    }
    column = [];
    j++;
  }

  return [arr, score];
}

function checkProgress(arr) {
  let progress;
  let num = 0;
  let column = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j <= 3; j++) {
      if (arr[i][j] === arr[i][j + 1] && arr[i][j] !== 0) {
        progress = true;
      }
    }
  }

  while (num < 4) {
    for (let i = 0; i < arr.length; i++) {
      column.push(arr[i][num]);
    }

    for (let i = 0; i < 3; i++) {
      if (column[i] === column[i + 1] && column[i] !== 0) {
        progress = true;
      }
    }
    column = [];
    num++;
  }

  return progress === true ? progress : false;
}

function printArr(cells, fieldCell) {
  for (let i = 0; i < 16; i++) {
    if (cells.flat(Infinity)[i] !== 0) {
      fieldCell[i]
        .className = `field-cell field-cell--${cells.flat(Infinity)[i]}`;
    } else {
      fieldCell[i].className = 'field-cell';
    }
  }

  return cells;
}

export {
  startRestart,
  printArr,
  checkProgress,
  moveDown,
  moveUp,
  moveRight,
  moveLeft,
  getIndexFromNumber,
  insertTwoOrFour,
  getEmptyList,
  makeRandomArr,
};
