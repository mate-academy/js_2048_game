function moveRight(arr) {
  for (let i = arr.length - 2; i >= 0; i--) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] > 0) {
        break;
      } else {
        const value = arr[j - 1];

        arr[j - 1] = arr[j];
        arr[j] = value;
      }
    }
  }

  return arr;
}

function sumInArray(arr) {
  let addedSum = 0;

  for (let i = arr.length - 2; i >= 0; i--) {
    if (arr[i] === arr[i + 1]) {
      const sumCount = arr[i] + arr[i + 1];

      arr[i + 1] = sumCount;
      arr[i] = 0;
      addedSum += sumCount;
    }
  }

  return addedSum;
}

function moveRightWithSumm(arr) {
  moveRight(arr);

  const addedSum = sumInArray(arr);

  moveRight(arr);

  return addedSum;
}

function reverse(arr) {
  const newArr = arr.reverse();

  return newArr;
}

function getColumn(arr, i) {
  const newColumn = [];

  for (let r = 0; r < arr.length; r++) {
    const column = arr[r];

    newColumn.push(column[i]);
  }

  return newColumn;
}

function getCoords(arr, n) {
  let count = 0;

  for (let r = 0; r < arr.length; r++) {
    const row = arr[r];

    for (let c = 0; c < row.length; c++) {
      if (row[c] === 0) {
        count++;

        if (count === n) {
          return [r, c];
        }
      }
    }
  }
}

function getRandomValue() {
  const value = Math.ceil(Math.random() * 2);

  if (value === 1) {
    return 4;
  } else {
    return value;
  }
}

export function setRandomValue(arr) {
  const res = getRandomCoords(arr);
  const [row, col] = res;

  arr[row][col] = getRandomValue();
}

export function getEmptyCellCount(arr) {
  let count = 0;

  for (let r = 0; r < arr.length; r++) {
    const row = arr[r];

    for (let c = 0; c < row.length; c++) {
      if (row[c] === 0) {
        count++;
      }
    }
  }

  return count;
}

function getRandomCoords(arr) {
  const res = getEmptyCellCount(arr);

  const n = Math.ceil(Math.random() * res);

  const res2 = getCoords(arr, n);

  return res2;
}

function replaceColumn(arr, getArr, i) {
  for (let r = 0; r < arr.length; r++) {
    const column = arr[r];

    column[i] = getArr[r];
  }

  return arr;
}

export function isWin(arr) {
  for (let r = 0; r < arr.length; r++) {
    const column = arr[r];

    for (let c = 0; c < column.length; c++) {
      if (column[c] === 2048) {
        return true;
      }
    }
  }

  return false;
}

export function isLose(arr) {
  const cloneArr = copyField(arr);
  const res = getEmptyCellCount(cloneArr);
  const score1 = moveAllToDownWithSumm(cloneArr);
  const score2 = moveAllToUpWithSumm(cloneArr);
  const score3 = moveAllToLeftWithSumm(cloneArr);
  const score4 = moveAllToRightWithSumm(cloneArr);

  if (res + score1 + score2 + score3 + score4 === 0) {
    return true;
  }

  return false;
}

function copyField(arr) {
  const res = [];

  for (let r = 0; r < arr.length; r++) {
    const row = arr[r];

    res.push([...row]);
  }

  return res;
}

function moveLeftWithSumm(arr) {
  reverse(arr);

  const addedSum = moveRightWithSumm(arr);

  reverse(arr);

  return addedSum;
}

export function moveAllToRightWithSumm(arr) {
  let addedScore = 0;

  for (let i = 0; i < arr.length; i++) {
    addedScore += moveRightWithSumm(arr[i]);
  }

  return addedScore;
}

export function moveAllToLeftWithSumm(arr) {
  let addedScore = 0;

  for (let i = 0; i < arr.length; i++) {
    addedScore += moveLeftWithSumm(arr[i]);
  }

  return addedScore;
}

export function moveAllToDownWithSumm(arr) {
  let addedScore = 0;

  for (let c = 0; c < arr.length; c++) {
    const res = getColumn(arr, c);

    addedScore += moveRightWithSumm(res);
    replaceColumn(arr, res, c);
  }

  return addedScore;
}

export function moveAllToUpWithSumm(arr) {
  let addedScore = 0;

  for (let c = 0; c < arr.length; c++) {
    const res = getColumn(arr, c);

    addedScore += moveLeftWithSumm(res);
    replaceColumn(arr, res, c);
  }

  return addedScore;
}
