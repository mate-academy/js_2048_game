'use strict';

const field = document.querySelector('.game-field');
const startBtn = document.querySelector('.start');
const score = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
let shouldCreateCell = false;

function createCell() {
  const cell = document.createElement('div');

  cell.innerHTML = `0`;
  cell.className = `field-cell field-cell--0`;

  return cell;
}

let gameSells = [];

function start() {
  score.innerHTML = 0;
  field.innerHTML = '';
  gameSells = [];

  for (let i = 0; i < 16; i++) {
    const newCell = createCell();
    const leftCoord = i % 4;
    const topCoord = (i - leftCoord) / 4;

    newCell.style.left = `${leftCoord * 100}px`;
    newCell.style.top = `${topCoord * 100}px`;
    field.append(newCell);
    gameSells.push(newCell);
  }

  createNumber();
  createNumber();
}

function createNumber() {
  const randId = Math.floor(Math.random() * gameSells.length);

  if (+gameSells[randId].innerHTML === 0) {
    gameSells[randId].innerHTML = 2;

    gameSells[randId].className
     = `field-cell field-cell--${gameSells[randId].innerHTML}`;
  } else {
    createNumber();
  }
}

startBtn.addEventListener('click', () => {
  start();
  loseMessage.hidden = true;
  startMessage.hidden = false;
  winMessage.hidden = true;
  startBtn.className = ' button restart';
  startBtn.innerHTML = 'restart';
});

document.addEventListener('keyup', (e) => {
  if (e.keyCode === 39) {
    moveRight();

    if (shouldCreateCell) {
      createNumber();
      shouldCreateCell = false;
    }
  }

  if (e.keyCode === 37) {
    moveLeft();

    if (shouldCreateCell) {
      createNumber();
      shouldCreateCell = false;
    }
  }

  if (e.keyCode === 38) {
    moveUp();

    if (shouldCreateCell) {
      createNumber();
      shouldCreateCell = false;
    }
  }

  if (e.keyCode === 40) {
    moveDown();

    if (shouldCreateCell) {
      createNumber();
      shouldCreateCell = false;
    }
  }

  if (loseChecking()) {
    startMessage.hidden = true;
    loseMessage.hidden = false;
    winMessage.hidden = true;
  };
});

function moveRowRight(row) {
  const cellsValue = row.map(cell => +cell.innerHTML);
  const values = cellsValue.filter(num => num);
  const zeros = cellsValue.filter(num => !num);

  if (values.length >= 1) {
    for (let i = values.length - 1; i >= 0; i--) {
      if (values[i] === values[i + 1]) {
        values[i + 1]
        = values[i] + values[i + 1];
        values[i] = 0;
        score.innerHTML = +values[i + 1] + +score.innerHTML;

        if (+values[i + 1] === 2048) {
          winMessage.hidden = false;
        }
      }

      if (values[i + 1] === 0) {
        values[i + 1] = values[i];
        values[i] = 0;
      }
    }
  }

  const resRow = zeros.concat(values);

  for (let i = 0; i < resRow.length; i++) {
    if (cellsValue[i] !== resRow[i]) {
      shouldCreateCell = true;
    }
    row[i].innerHTML = resRow[i];

    row[i].className
    = `field-cell field-cell--${resRow[i]}`;
  }
}

function moveRowLeft(row) {
  const cellsValue = row.map(cell => +cell.innerHTML);
  const values = cellsValue.filter(num => num);
  const zeros = cellsValue.filter(num => !num);

  if (values.length >= 1) {
    for (let i = 1; i < values.length; i++) {
      if (values[i] === values[i - 1]) {
        values[i - 1]
        = values[i] + values[i - 1];
        values[i] = 0;
        score.innerHTML = +values[i - 1] + +score.innerHTML;

        if (+values[i - 1] === 2048) {
          winMessage.hidden = false;
        }
      }

      if (values[i - 1] === 0) {
        values[i - 1] = values[i];
        values[i] = 0;
      }
    }
  }

  const resRow = values.concat(zeros);

  for (let i = 0; i < resRow.length; i++) {
    if (cellsValue[i] !== resRow[i]) {
      shouldCreateCell = true;
    }
    row[i].innerHTML = resRow[i];

    row[i].className
    = `field-cell field-cell--${resRow[i]}`;
  }
}

function moveUp() {
  const firstColumn = gameSells.filter(cell => cell.style.left === '0px');
  const secondColumn = gameSells.filter(cell => cell.style.left === '100px');
  const thirdColumn = gameSells.filter(cell => cell.style.left === '200px');
  const fourthColumn = gameSells.filter(cell => cell.style.left === '300px');

  moveRowLeft(firstColumn);
  moveRowLeft(secondColumn);
  moveRowLeft(thirdColumn);
  moveRowLeft(fourthColumn);
}

function moveDown() {
  const firstColumn = gameSells.filter(cell => cell.style.left === '0px');
  const secondColumn = gameSells.filter(cell => cell.style.left === '100px');
  const thirdColumn = gameSells.filter(cell => cell.style.left === '200px');
  const fourthColumn = gameSells.filter(cell => cell.style.left === '300px');

  moveRowRight(firstColumn);
  moveRowRight(secondColumn);
  moveRowRight(thirdColumn);
  moveRowRight(fourthColumn);
}

function moveRight() {
  const firstRow = gameSells.filter(cell => cell.style.top === '0px');
  const secondRow = gameSells.filter(cell => cell.style.top === '100px');
  const thirdRow = gameSells.filter(cell => cell.style.top === '200px');
  const fourthRow = gameSells.filter(cell => cell.style.top === '300px');

  moveRowRight(firstRow);
  moveRowRight(secondRow);
  moveRowRight(thirdRow);
  moveRowRight(fourthRow);
}

function moveLeft() {
  const firstRow = gameSells.filter(cell => cell.style.top === '0px');
  const secondRow = gameSells.filter(cell => cell.style.top === '100px');
  const thirdRow = gameSells.filter(cell => cell.style.top === '200px');
  const fourthRow = gameSells.filter(cell => cell.style.top === '300px');

  moveRowLeft(firstRow);
  moveRowLeft(secondRow);
  moveRowLeft(thirdRow);
  moveRowLeft(fourthRow);
}

function loseChecking() {
  const zeros = gameSells.filter(cell => cell.innerHTML === '0');

  if (zeros.length > 0) {
    return false;
  }

  const firstRow = gameSells.filter(cell => cell.style.top === '0px');
  const secondRow = gameSells.filter(cell => cell.style.top === '100px');
  const thirdRow = gameSells.filter(cell => cell.style.top === '200px');
  const fourthRow = gameSells.filter(cell => cell.style.top === '300px');

  const rows = [firstRow, secondRow, thirdRow, fourthRow];

  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length - 1; j++) {
      if (rows[i][j].innerHTML === rows[i][j + 1].innerHTML) {
        return false;
      }
    }
  }

  const firstColumn = gameSells.filter(cell => cell.style.left === '0px');
  const secondColumn = gameSells.filter(cell => cell.style.left === '100px');
  const thirdColumn = gameSells.filter(cell => cell.style.left === '200px');
  const fourthColumn = gameSells.filter(cell => cell.style.left === '300px');

  const columns = [firstColumn, secondColumn, thirdColumn, fourthColumn];

  for (let i = 0; i < columns.length; i++) {
    for (let j = 0; j < columns[i].length - 1; j++) {
      if (columns[i][j].innerHTML === columns[i][j + 1].innerHTML) {
        return false;
      }
    }
  }

  return true;
}
