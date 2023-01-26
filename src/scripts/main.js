'use strict';

class Game2048 {
  constructor() {
    this.score = 0;
    this.maxValueCell = 0;

    [...field.rows].forEach((row) => {
      [...row.cells].forEach((cellTable) => {
        cellTable.innerText = '';
        cellTable.className = 'field-cell';
      });
    });
  }

  get getMaxValueCell() {
    return this.maxValueCell;
  }

  get getScore() {
    return this.score;
  }

  set setData(value) {
    if (value > this.maxValueCell) {
      this.maxValueCell = value;
    }

    this.score += value;
  }
}

const field = document.getElementsByClassName('game-field')[0];
const buttonStart = document.getElementsByClassName('button start')[0];
const gameScore = document.getElementsByClassName('game-score')[0];

let gameOver = false;
let gamePlay = {};
let blockKey = false;

const message = document.getElementsByClassName('message message-lose')[0];
const messageStart = document.getElementsByClassName('message-start')[0];
const messageWin = document.getElementsByClassName('message-win')[0];

buttonStart.addEventListener('click', () => {
  if (gamePlay !== {}) {
    delete Game2048.gamePlay;
  }
  gamePlay = new Game2048();
  gamePlay.start();
});

function handlerKey(e) {
  e.preventDefault();
  gameScore.innerText = gamePlay.getScore + '';

  if (gameOver || blockKey) {
    return;
  }

  const dataColumns = getDataColumns(field);
  const dataRows = getDataRows(field);

  switch (e.code) {
    case 'ArrowUp':
      blockKey = true;

      const upDataColumns = shiftLeft(dataColumns);
      const calcColumnsUp = upDataColumns.reduce((prev, item) => {
        prev.push(calculate(item));

        return prev;
      }, []);

      updateColumns(field, shiftLeft(calcColumnsUp));
      gameStatus();
      break;
    case 'ArrowDown':
      blockKey = true;

      const DownDataColumns = (shiftLeft(reverse(dataColumns)));
      const calcColumnsDown = DownDataColumns.reduce((prev, item) => {
        prev.push(calculate(item));

        return prev;
      }, []);

      updateColumns(field, reverse(shiftLeft(calcColumnsDown)));
      gameStatus();
      break;
    case 'ArrowLeft':
      blockKey = true;

      const leftdataRows = shiftLeft(dataRows);
      const calcRowsLeft = leftdataRows.reduce((prev, item) => {
        prev.push(calculate(item));

        return prev;
      }, []);

      updateRows(field, shiftLeft(calcRowsLeft));
      gameStatus();
      break;
    case 'ArrowRight':
      blockKey = true;

      const reverseData = reverse(dataRows);
      const rightDataRows = shiftLeft(reverseData);
      const calcRowsRight = rightDataRows.reduce((prev, item) => {
        prev.push(calculate(item));

        return prev;
      }, []);

      updateRows(field, reverse(shiftLeft(calcRowsRight)));
      gameStatus();
      break;
  }
}

function newLoop() {
  buttonStart.classList.add('restart');
  buttonStart.innerHTML = 'Restart';

  if (gamePlay.getMaxValueCell === 2048) {
    gameScore.innerText = gamePlay.getScore + '';
    messageWin.classList.remove('hidden');

    return new Promise(resolve => resolve(true));
  }

  let empty = findAllEmptyCells(field);
  let endInsertNewValue;

  if (empty.length !== 0) {
    const number = rundomNumber();
    const cell = findRandomCell(empty);

    endInsertNewValue = new Promise(resolve => setTimeout(() => {
      cell.innerText = number;
      cell.className = `field-cell field-cell--${number}`;
      empty = findAllEmptyCells(field);

      if (empty.length === 0) {
        const rows = getDataRows(field);
        const collumns = getDataColumns(field);

        const impossibleCalcRows = rows.filter(item =>
          item.join('') !== calculate(item).join(''));
        const impossibleCalcColumns = collumns.filter(item =>
          item.join('') !== calculate(item).join(''));

        if (!impossibleCalcRows.length && !impossibleCalcColumns.length) {
          message.classList.remove('hidden');

          resolve(true);
        }
      }

      resolve(false);
    }, 0));
  } else {
    return new Promise(resolve => resolve(false));
  }

  return endInsertNewValue;
}

function gameStatus() {
  newLoop().then((result) => {
    blockKey = false;
    gameOver = result;
  });
}

function findAllEmptyCells(table) {
  const emptyCells = [];

  [...table.rows].forEach((row) => {
    [...row.cells].forEach((cell) => {
      if (cell.innerText === '') {
        emptyCells.push(cell);
      }
    });
  });

  return emptyCells;
}

function findRandomCell(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function rundomNumber() {
  return Math.random() <= 0.1 ? 4 : 2;
}

function getDataRows(table) {
  const result = [];

  for (const row of table.rows) {
    result.push([...row.cells].map((item) => {
      return item.innerText === '' ? '0' : item.innerText;
    }));
  }

  return result;
}

function getDataColumns(table) {
  const res = [];

  for (let i = 0; i < [...table.rows[0].cells].length; i++) {
    const column = [];

    for (const row of table.rows) {
      row.cells[i].innerText === ''
        ? column.push('0')
        : column.push(row.cells[i].innerText);
    }
    res.push(column);
  }

  return res;
}

function updateRows(table, rows) {
  rows.forEach((row, indexRow) => {
    row.forEach((cell, indexCell) => {
      cell === '0'
        ? table.rows[indexRow].cells[indexCell].innerText = ''
        : table.rows[indexRow].cells[indexCell].innerText = cell;

      cell === '0'
        ? table.rows[indexRow].cells[indexCell].className = 'field-cell'
        : table.rows[indexRow].cells[indexCell].className = `
        field-cell field-cell--${+cell}`;
    });
  });
}

function updateColumns(table, columns) {
  [...table.rows].forEach((row, indexRow) => {
    [...row.cells].forEach((cell, indexCell) => {
      columns[indexCell][indexRow] === '0'
        ? cell.innerText = ''
        : cell.innerText = columns[indexCell][indexRow];

      columns[indexCell][indexRow] === '0'
        ? cell.className = 'field-cell'
        : cell.className = `
        field-cell field-cell--${+columns[indexCell][indexRow]}`;
    });
  });
}

function shiftLeft(rows) {
  const resOut = [];

  for (const row of rows) {
    const result = row.reduce((prev, item) => {
      if (item !== '0') {
        prev.push(item);

        return prev;
      }

      return prev;
    }, []);

    let arr = [];

    if (result.length < row.length) {
      const addEmptyCells = row.length - result.length;
      const newArray = Array(addEmptyCells).fill('0');

      arr = [...result, ...newArray];

      resOut.push(arr);
    } else {
      resOut.push(result);
    }
  }

  return resOut;
}

function reverse(lines) {
  return lines.reduce((prev, line) => {
    prev.push(line.reverse());

    return prev;
  }, []);
}

function calculate(array) {
  let flag = false;
  const result = array;

  do {
    for (let i = 1; i < result.length; i++) {
      if (result[i - 1] === result[i]) {
        result[i - 1] = +result[i] * 2 + '';
        gamePlay.setData = +result[i - 1];
        result[i] = '0';
        flag = true;
      }
    }
    flag = false;
  } while (flag);

  return result;
}

Game2048.prototype.start = function() {
  gameOver = false;
  this.score = 0;
  this.maxValueCell = 0;
  gameScore.innerText = this.score + '';
  message.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.classList.add('hidden');

  for (let i = 0; i < 2; i++) {
    const emptyCells = findAllEmptyCells(field);
    const number = rundomNumber();
    const cell = findRandomCell(emptyCells);

    cell.innerText = number;
    cell.className = `field-cell field-cell--${number}`;
  }
  document.addEventListener('keydown', handlerKey);
};
