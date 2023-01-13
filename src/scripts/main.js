'use strict';

const allFieldCell = document.getElementsByClassName('field-cell');
const startButton = document.querySelector('.start');
const score = document.querySelector('.game-score');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const fieldRow = document.getElementsByClassName('field-row');
const fielCell = document.getElementsByClassName('field-cell');
let startClick = 0;

// --------------score window-------------

function summ() {
  const fullField = [...allFieldCell].filter(cell => cell.textContent !== '');
  const val = fullField.map(x => +x.textContent);
  const res = val.reduce((a, b) => a + b);
  const result = fullField.length !== 1 ? res : fullField[0].textContent;

  score.textContent = result;
}

// ------------------random number 2 or 4 -----------

function randNewElement() {
  const value = Math.floor(Math.random() * 100) <= 90 ? 2 : 4;

  const emptyCell = [...allFieldCell].filter(cell =>
    cell.classList.length === 1);

  const rand = Math.floor(Math.random() * emptyCell.length);

  emptyCell[rand].classList.add(`field-cell--${value}`);
  emptyCell[rand].textContent = value;
}

// ------------------button start / refresh----------

startButton.addEventListener('click', () => {
  if (startClick === 0) {
    randNewElement();
    randNewElement();
    startClick = 1;
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';

    messageStart.classList.add('hidden');

    summ();

    return;
  }

  if (startClick === 1) {
    [...allFieldCell].forEach(cell => {
      cell.textContent = '';
      cell.className = 'field-cell';
    });
    startButton.classList.remove('restart');
    startButton.classList.add('start');
    startButton.textContent = 'Start';

    score.textContent = 0;

    startClick = 0;

    messageStart.classList.remove('hidden');
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
  }
});

// -------------------------move----------

function moveRightLeft(direction) {
  for (let i = 0; i < 16; i++) {
    if (i % 4 === 0) {
      const totalOne = fielCell[i].innerHTML;
      const totalTwo = fielCell[i + 1].innerHTML;
      const totalThree = fielCell[i + 2].innerHTML;
      const totalFour = fielCell[i + 3].innerHTML;

      const row = [+totalOne, +totalTwo, +totalThree, +totalFour];
      const filteredRow = row.filter(num => num);
      const missing = 4 - filteredRow.length;
      const zero = Array(missing).fill('');
      let newRow;

      if (direction === 'right') {
        newRow = zero.concat(filteredRow);
      }

      if (direction === 'left') {
        newRow = filteredRow.concat(zero);
      }

      fielCell[i].innerHTML = newRow[0];
      fielCell[i + 1].innerHTML = newRow[1];
      fielCell[i + 2].innerHTML = newRow[2];
      fielCell[i + 3].innerHTML = newRow[3];

      fielCell[i].className = newRow[0] === '' ? 'field-cell'
        : `field-cell field-cell--${newRow[0]}`;

      fielCell[i + 1].className = newRow[1] === '' ? 'field-cell'
        : `field-cell field-cell--${newRow[1]}`;

      fielCell[i + 2].className = newRow[2] === '' ? 'field-cell'
        : `field-cell field-cell--${newRow[2]}`;

      fielCell[i + 3].className = newRow[3] === '' ? 'field-cell'
        : `field-cell field-cell--${newRow[3]}`;
    }
  }
}

function moveUpDown(direction) {
  const r = [];

  for (let i = 0; i < 4; i++) {
    const kon = [];

    for (let rrr = 0; rrr < 4; rrr++) {
      kon.push([...fieldRow][rrr].children[i].innerHTML);
    }

    r.push(kon);
  }

  for (let i = 0; i < 4; i++) {
    const row = [+r[i][0], +r[i][1], +r[i][2], +r[i][3]];
    const filteredRow = row.filter(num => num);
    const missing = 4 - filteredRow.length;
    const zero = Array(missing).fill('');
    let newRow;

    if (direction === 'up') {
      newRow = filteredRow.concat(zero);
    }

    if (direction === 'down') {
      newRow = zero.concat(filteredRow);
    }

    fielCell[i].innerHTML = newRow[0];
    fielCell[i + 4].innerHTML = newRow[1];
    fielCell[i + 8].innerHTML = newRow[2];
    fielCell[i + 12].innerHTML = newRow[3];

    fielCell[i].className = newRow[0] === '' ? 'field-cell'
      : `field-cell field-cell--${newRow[0]}`;

    fielCell[i + 4].className = newRow[1] === '' ? 'field-cell'
      : `field-cell field-cell--${newRow[1]}`;

    fielCell[i + 8].className = newRow[2] === '' ? 'field-cell'
      : `field-cell field-cell--${newRow[2]}`;

    fielCell[i + 12].className = newRow[3] === '' ? 'field-cell'
      : `field-cell field-cell--${newRow[3]}`;
  }
};

// ----------------------plus the same----------------

function combineRow(direction) {
  for (let k = 0; k < 4; k++) {
    const array = [
      +[...fieldRow][k].children[0].innerHTML,
      +[...fieldRow][k].children[1].innerHTML,
      +[...fieldRow][k].children[2].innerHTML,
      +[...fieldRow][k].children[3].innerHTML,
    ];

    const res = [...array];

    if (direction === 'right') {
      for (let i = 3; i > 0; i--) {
        if (array[i] === array[i - 1] && res[i] === array[i]) {
          res[i] = array[i - 1] * 2;
          res[i - 1] = 0;
        }
      }
    }

    if (direction === 'left') {
      for (let i = 0; i < 4; i++) {
        if (array[i] === array[i + 1] && res[i] === array[i]) {
          res[i] = array[i] * 2;
          res[i + 1] = 0;
        }
      }
    }

    [...fieldRow][k].children[0].innerHTML = res[0] === 0 ? '' : res[0];
    [...fieldRow][k].children[1].innerHTML = res[1] === 0 ? '' : res[1];
    [...fieldRow][k].children[2].innerHTML = res[2] === 0 ? '' : res[2];
    [...fieldRow][k].children[3].innerHTML = res[3] === 0 ? '' : res[3];

    [...fieldRow][k].children[0].className = res[0] === 0 ? 'field-cell'
      : `field-cell field-cell--${res[0]}`;

    [...fieldRow][k].children[1].className = res[1] === 0 ? 'field-cell'
      : `field-cell field-cell--${res[1]}`;

    [...fieldRow][k].children[2].className = res[2] === 0 ? 'field-cell'
      : `field-cell field-cell--${res[2]}`;

    [...fieldRow][k].children[3].className = res[3] === 0 ? 'field-cell'
      : `field-cell field-cell--${res[3]}`;
  }
}

function combineRowUpDown(direction) {
  for (let k = 0; k < 4; k++) {
    const array = [
      +[...fieldRow][0].children[k].innerHTML,
      +[...fieldRow][1].children[k].innerHTML,
      +[...fieldRow][2].children[k].innerHTML,
      +[...fieldRow][3].children[k].innerHTML,
    ];

    const res = [...array];

    if (direction === 'top') {
      for (let i = 0; i < 4; i++) {
        if (array[i] === array[i + 1] && res[i] === array[i]) {
          res[i] = array[i + 1] * 2;
          res[i + 1] = 0;
        }
      }
    }

    if (direction === 'down') {
      for (let i = 3; i >= 0; i--) {
        if (array[i] === array[i - 1] && res[i] === array[i]) {
          res[i - 1] = array[i] * 2;
          res[i] = 0;
        }
      }
    }

    [...fieldRow][0].children[k].innerHTML = res[0] === 0 ? '' : res[0];
    [...fieldRow][1].children[k].innerHTML = res[1] === 0 ? '' : res[1];
    [...fieldRow][2].children[k].innerHTML = res[2] === 0 ? '' : res[2];
    [...fieldRow][3].children[k].innerHTML = res[3] === 0 ? '' : res[3];

    [...fieldRow][0].children[k].className = res[0] === 0 ? 'field-cell'
      : `field-cell field-cell--${res[0]}`;

    [...fieldRow][1].children[k].className = res[1] === 0 ? 'field-cell'
      : `field-cell field-cell--${res[1]}`;

    [...fieldRow][2].children[k].className = res[2] === 0 ? 'field-cell'
      : `field-cell field-cell--${res[2]}`;

    [...fieldRow][3].children[k].className = res[3] === 0 ? 'field-cell'
      : `field-cell field-cell--${res[3]}`;
  }
}

// --------------check if 2048 win-------------------

function win() {
  for (let i = 0; i < 16; i++) {
    if ([...fielCell][i].innerHTML === '2048') {
      messageWin.classList.remove('hidden');
    }
  }
}

// -----------------check for steps ------------------------

function checkSteps() {
  const rowValue = [];
  const columnValue = [];
  const emptyСell = [...allFieldCell].filter(cell =>
    cell.textContent === '').length === 0;

  for (let i = 0; i < 4; i++) {
    const kon = [];

    for (let rrr = 0; rrr < 4; rrr++) {
      kon.push(+[...fieldRow][rrr].children[i].innerHTML);
    }

    const filt = kon.filter(num => num);

    columnValue.push(filt);
  }

  for (let i = 0; i < 16; i++) {
    if (i % 4 === 0) {
      const totalOne = fielCell[i].innerHTML;
      const totalTwo = fielCell[i + 1].innerHTML;
      const totalThree = fielCell[i + 2].innerHTML;
      const totalFour = fielCell[i + 3].innerHTML;

      const row = [+totalOne, +totalTwo, +totalThree, +totalFour];
      const filteredRow = row.filter(num => num);

      rowValue.push(filteredRow);
    }
  }

  let noMove;

  for (let i = 0; i < 4; i++) {
    if (rowValue[i].length > 1) {
      for (let k = 0; k < rowValue[i].length; k++) {
        if (rowValue[i][k] === rowValue[i][k + 1]) {
          noMove = true;

          return;
        }
      }
    }

    if (columnValue[i].length > 1) {
      for (let k = 0; k < columnValue[i].length; k++) {
        if (columnValue[i][k] === columnValue[i][k + 1]) {
          noMove = true;

          return;
        }
      }
    }

    noMove = false;
  }

  if (!noMove && emptyСell) {
    messageLose.classList.remove('hidden');
  }
}

// --------------------addEventListener---------

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && startClick !== 0) {
    moveUpDown('up');
    combineRowUpDown('top');
    moveUpDown('up');
    randNewElement();
    summ();
    win();
    checkSteps();
  };

  if (e.key === 'ArrowDown' && startClick !== 0) {
    moveUpDown('down');
    combineRowUpDown('down');
    moveUpDown('down');
    randNewElement();
    summ();
    win();
    checkSteps();
  };

  if (e.key === 'ArrowLeft' && startClick !== 0) {
    moveRightLeft('left');
    combineRow('left');
    moveRightLeft('left');
    randNewElement();
    summ();
    win();
    checkSteps();
  };

  if (e.key === 'ArrowRight' && startClick !== 0) {
    moveRightLeft('right');
    combineRow('right');
    moveRightLeft('right');
    randNewElement();
    summ();
    win();
    checkSteps();
  };
});
