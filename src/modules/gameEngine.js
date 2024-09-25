import { field, scoreTag } from '../scripts/main.js';

const goal = 2048;
let score = 0;

function settingMessage(message) {
  const messageContainer = [
    ...document.querySelector('.message-container').children,
  ];

  for (const p of messageContainer) {
    if (p.classList.contains(message)) {
      p.classList.toggle('hidden', false);
      continue;
    } else {
      p.classList.add('hidden');
    }
  }
}

function creativeGameField() {
  const rows = [...field.querySelectorAll('tr')];

  const cells = rows[0].children.length;

  const gameField = [];

  for (let i = 0; i < rows.length; i++) {
    gameField.push(Array(cells).fill(0));
  }

  return gameField;
}

function getRandomCoord() {
  function getNubmerOfColumn() {
    const number = 0 + Math.random() * (4 + 1 - 1);

    return Math.floor(number);
  }

  function getNubmerOfRows() {
    const rowNubmer = 0 + Math.random() * (4 + 1 - 1);

    return Math.floor(rowNubmer);
  }

  return [getNubmerOfColumn(), getNubmerOfRows()];
}

function creativeElement(obj, state) {
  if (checkEmptyCell(obj)) {
    let randomDigit = Math.random() < 0.9 ? 2 : 4;

    const colRow = getRandomCoord();
    const row = obj[colRow[0]];

    if (state === 'wait') {
      randomDigit = 2; // set 1024 to check win
    }

    if (row[colRow[1]] === 0) {
      row[colRow[1]] = randomDigit;
    } else {
      creativeElement(obj);
    }

    return obj;
  } else {
    settingMessage('message-lose');
  }

  return obj;
}

function checkEmptyCell(obj) {
  for (const array of obj) {
    const check = array.some((digit) => digit === 0);

    if (check === true) {
      return true;
    } else {
      continue;
    }
  }

  return false;
}

function send(obj) {
  for (let i = 0; i < obj.length; i++) {
    const row = obj[i];

    for (let n = 0; n < row.length; n++) {
      const currentElementOnHtml = field.rows[i].cells[n];

      if (row[n] === 0) {
        currentElementOnHtml.removeAttribute('class');
        currentElementOnHtml.classList.add('field-cell');
        currentElementOnHtml.textContent = '';
      } else {
        currentElementOnHtml.removeAttribute('class');
        currentElementOnHtml.classList.add('field-cell');

        const addClass = `field-cell--${row[n]}`;

        currentElementOnHtml.classList.add(addClass);
        currentElementOnHtml.textContent = row[n];

        if (row[n] === goal) {
          settingMessage('message-win');
        }
      }
    }
  }
}

function toLeftRight(obj, direction) {
  for (let i = 0; i < obj.length; i++) {
    obj[i] = move(obj[i], direction);
  }

  return obj;
}

function toUpDown(obj, direction) {
  for (let i = 0; i < obj.length; i++) {
    let coloumn = [];

    const one = obj[0][i];
    const two = obj[1][i];
    const three = obj[2][i];
    const four = obj[3][i];

    coloumn.push(one, two, three, four);

    coloumn = move(coloumn, direction);

    const [z, c, v, d] = coloumn;

    obj[0][i] = z;
    obj[1][i] = c;
    obj[2][i] = v;
    obj[3][i] = d;
  }
}

function move(data, direction) {
  const array2 = data.filter((elem) => elem > 0);

  if (array2.length > 1) {
    for (let i = 0; i < array2.length - 1; i++) {
      if (array2[i] === array2[i + 1]) {
        array2[i] = array2[i] * 2;
        array2[i + 1] = 0;

        score += array2[i];
      }
    }
    scoreTag.textContent = score;
  }

  const array3 = array2.filter((elem) => elem > 0);

  while (array3.length < 4) {
    switch (direction) {
      case 'right':
        array3.unshift(0);
        break;
      case 'left':
        array3.push(0);
        break;
      case 'up':
        array3.push(0);
        break;
      case 'down':
        array3.unshift(0);
        break;
    }
  }

  return array3;
}

function cleanScore(state) {
  if (state === 'wait') {
    score = 0;
  }
}

function checkInline(obj, direction) {
  for (const row of obj) {
    let firstFullSell = row.find((n) => n > 0);

    if (firstFullSell === undefined) {
      continue;
    }

    let index = row.indexOf(firstFullSell);

    if (direction === 'left') {
      firstFullSell = row.findLast((n) => n > 0);
      index = row.lastIndexOf(firstFullSell);
    }

    switch (direction) {
      case 'right':
        if (row[index + 1] === 0) {
          return true;
        }

        for (let i = index; i < row.length - 1; i++) {
          if (row[i] === row[i + 1]) {
            return true;
          }

          if (row[i + 1] === 0) {
            return true;
          }
        }
        break;

      case 'left':
        if (row[index - 1] === 0) {
          return true;
        }

        for (let i = index; i > 0; i--) {
          if (row[i] === row[i - 1]) {
            return true;
          }

          if (row[i - 1] === 0) {
            return true;
          }
        }
        break;
    }
  }

  return false;
}

function checkUpDown(obj, direction) {
  for (let i = 0; i < obj.length; i++) {
    const coloumn = [];

    coloumn.push(obj[0][i], obj[1][i], obj[2][i], obj[3][i]);

    let firstFullSell = coloumn.find((n) => n > 0);

    if (firstFullSell === undefined) {
      continue;
    }

    let index = coloumn.indexOf(firstFullSell);

    if (direction === 'up') {
      firstFullSell = coloumn.findLast((n) => n > 0);
      index = coloumn.lastIndexOf(firstFullSell);
    }

    switch (direction) {
      case 'down':
        if (coloumn[index + 1] === 0) {
          return true;
        }

        for (let m = index; m < coloumn.length - 1; m++) {
          if (coloumn[m] === coloumn[m + 1]) {
            return true;
          }

          if (coloumn[m + 1] === 0) {
            return true;
          }
        }
        break;

      case 'up':
        if (coloumn[index - 1] === 0) {
          return true;
        }

        for (let m = index; m > 0; m--) {
          if (coloumn[m] === coloumn[m - 1]) {
            return true;
          }

          if (coloumn[m - 1] === 0) {
            return true;
          }
        }
        break;
    }
  }

  return false;
}

export {
  settingMessage,
  creativeGameField,
  creativeElement,
  send,
  toLeftRight,
  toUpDown,
  move,
  checkInline,
  checkUpDown,
  checkEmptyCell,
  cleanScore,
};
