
'use strict';

const table = document.querySelector('.game-field');

const tbody = table.querySelector('tbody');
const tbody2 = tbody.cloneNode(true);

table.dataset.moove = 1;
table.dataset.cellCount = 0;

const gameLengthField = tbody.rows.length;
const sizeGameFild = gameLengthField * gameLengthField;
const arrFild = [];

for (let i = 0; i < gameLengthField; i++) {
  arrFild.push(i);
}

let score = 0;
let arrScore = [0];
const arrMoveRevers = arrFild.slice(0, -1);
const arrMove = arrMoveRevers.reverse();
let moveCount = 0;

document.querySelector('.start').addEventListener('click', (e) => {
  document.querySelector('.message-lose').className
   = 'message message-lose hidden';

  document.querySelector('.message-win').className
  = 'message message-win hidden';

  if (table.dataset.start === 'Start') {
    tbody.innerHTML = tbody2.innerHTML;
  }
  addRandomitem(2);
  addRandomitem(2);

  table.dataset.start = 'Start';
  cellCounter();
  arrScore = [0];
  score = 0;
  document.querySelector('.game-score').textContent = score;
});

document.addEventListener('keydown', e => {
  document.querySelector('.start').textContent = 'Restart';

  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft'
  && e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
    return;
  }
  document.querySelector('.message-start').classList.add('hidden');

  if (table.dataset.start !== 'Start') {
    return;
  }

  if (e.key === 'ArrowLeft') {
    sumArrowLeft();
  }

  if (e.key === 'ArrowRight') {
    sumArowRight();
  }

  if (e.key === 'ArrowDown') {
    sumArowDown();
  }

  if (e.key === 'ArrowUp') {
    sumArowUp();
  }

  score = arrScore.reduce((prev, value) => +prev + (+value));

  document.querySelector('.game-score').textContent = score;

  possibilitySum();

  if (table.dataset.moove === '1') {
    moveCount++;

    if (moveCount % 2 === 0 || moveCount % 4 === 0) {
      addRandomitem(randomItemValue());
    } else {
      addRandomitem(2);
    }
  }

  cellCounter();

  function possibilitySum() {
    table.dataset.possibilitySum = 0;

    for (let rowindex = 0; rowindex < gameLengthField; rowindex++) {
      for (let i = 0; i <= arrMove.length - 1; i++) {
        if (tbody.rows[rowindex].cells[i].textContent
          && tbody.rows[rowindex].cells[i].textContent
          === tbody.rows[rowindex].cells[i + 1].textContent) {
          table.dataset.possibilitySum++;
        }
      }
    }

    for (let rowindex = 0; rowindex < gameLengthField; rowindex++) {
      for (let i = arrMove.length; i >= 1; i--) {
        if (tbody.rows[rowindex].cells[i].textContent
          && tbody.rows[rowindex].cells[i].textContent
          === tbody.rows[rowindex].cells[i - 1].textContent) {
          table.dataset.possibilitySum++;
        }
      }
    }

    for (let cellIndex = 0; cellIndex < gameLengthField; cellIndex++) {
      for (let i = arrMove.length; i >= 1; i--) {
        if (tbody.rows[i].cells[cellIndex].textContent
          && tbody.rows[i].cells[cellIndex].textContent
          === tbody.rows[i - 1].cells[cellIndex].textContent) {
          table.dataset.possibilitySum++;
        }
      }
    }

    for (let cellIndex = 0; cellIndex < gameLengthField; cellIndex++) {
      for (let i = 0; i <= arrMove.length - 1; i++) {
        if (tbody.rows[i].cells[cellIndex].textContent
          && tbody.rows[i].cells[cellIndex].textContent
          === tbody.rows[i + 1].cells[cellIndex].textContent) {
          table.dataset.possibilitySum++;
        }
      }
    }
  }
  possibilitySum();

  if (table.dataset.cellcount >= sizeGameFild
    && +table.dataset.possibilitySum === 0) {
    document.querySelector('.message-lose').className = 'message message-lose';
  }

  if (gameWiner() > 0) {
    document.querySelector('.message-win').className = 'message message-win';
  }
});

function sumArowUp() {
  table.dataset.moove = '';

  for (let cellIndex = 0; cellIndex < gameLengthField; cellIndex++) {
    moveCellUp(cellIndex);

    for (let i = 0; i <= arrMove.length - 1; i++) {
      if (tbody.rows[i].cells[cellIndex].textContent
        && tbody.rows[i].cells[cellIndex].textContent
        === tbody.rows[i + 1].cells[cellIndex].textContent) {
        tbody.rows[i].cells[cellIndex].textContent
        = (+tbody.rows[i].cells[cellIndex].textContent) * 2;
        arrScore.push((+tbody.rows[i].cells[cellIndex].textContent));

        tbody.rows[i].cells[cellIndex].className
        = (`field-cell field-cell--
        ${tbody.rows[i].cells[cellIndex].textContent}`);

        tbody.rows[i + 1].cells[cellIndex].className = 'field-cell';
        tbody.rows[i + 1].cells[cellIndex].textContent = '';
        table.dataset.moove = 1;
      }
    }
    moveCellUp(cellIndex);
  }
}

function moveCellUp(cellIndex) {
  arrMove.forEach(el => {
    if (!tbody.rows[el].cells[cellIndex].textContent) {
      for (let i = el + 1; i <= arrMove.length; i++) {
        if (tbody.rows[i].cells[cellIndex].textContent) {
          tbody.rows[i - 1].cells[cellIndex].textContent
          = tbody.rows[i].cells[cellIndex].textContent;

          tbody.rows[i - 1].cells[cellIndex].className
          = (`field-cell field-cell--
          ${tbody.rows[i].cells[cellIndex].textContent}`);

          tbody.rows[i].cells[cellIndex].className = 'field-cell'; ;
          tbody.rows[i].cells[cellIndex].textContent = '';
          table.dataset.moove = 1;
        }
      }
    }
  });
}

function sumArowDown() {
  table.dataset.moove = '';

  for (let cellIndex = 0; cellIndex < gameLengthField; cellIndex++) {
    moveCellDown(cellIndex);

    for (let i = arrMove.length; i >= 1; i--) {
      if (tbody.rows[i].cells[cellIndex].textContent
        && tbody.rows[i].cells[cellIndex].textContent
        === tbody.rows[i - 1].cells[cellIndex].textContent) {
        tbody.rows[i].cells[cellIndex].textContent
        = (+tbody.rows[i].cells[cellIndex].textContent) * 2;
        arrScore.push(tbody.rows[i].cells[cellIndex].textContent);

        tbody.rows[i].cells[cellIndex].className
        = (`field-cell field-cell--
        ${tbody.rows[i].cells[cellIndex].textContent}`);

        tbody.rows[i - 1].cells[cellIndex].className = 'field-cell';
        tbody.rows[i - 1].cells[cellIndex].textContent = '';
        table.dataset.moove = 1;
      }
    }
    moveCellDown(cellIndex);
  }
}

function moveCellDown(cellIndex) {
  arrMoveRevers.forEach(el => {
    if (!tbody.rows[el + 1].cells[cellIndex].textContent) {
      for (let i = el; i >= 0; i--) {
        if (tbody.rows[i].cells[cellIndex].textContent) {
          tbody.rows[i + 1].cells[cellIndex].textContent
          = tbody.rows[i].cells[cellIndex].textContent;

          tbody.rows[i + 1].cells[cellIndex].className
          = (`field-cell field-cell--
          ${tbody.rows[i].cells[cellIndex].textContent}`);

          tbody.rows[i].cells[cellIndex].className = 'field-cell'; ;
          tbody.rows[i].cells[cellIndex].textContent = '';
          table.dataset.moove = 1;
        }
      }
    }
  });
}

function sumArowRight() {
  table.dataset.moove = '';

  for (let rowindex = 0; rowindex < gameLengthField; rowindex++) {
    moveCellRight(rowindex);

    for (let i = arrMove.length; i >= 1; i--) {
      if (tbody.rows[rowindex].cells[i].textContent
        && tbody.rows[rowindex].cells[i].textContent
        === tbody.rows[rowindex].cells[i - 1].textContent) {
        tbody.rows[rowindex].cells[i].textContent
        = (+tbody.rows[rowindex].cells[i].textContent) * 2;
        arrScore.push(tbody.rows[rowindex].cells[i].textContent);

        tbody.rows[rowindex].cells[i].className
        = (`field-cell field-cell--
        ${tbody.rows[rowindex].cells[i].textContent}`);
        tbody.rows[rowindex].cells[i - 1].className = 'field-cell';
        tbody.rows[rowindex].cells[i - 1].textContent = '';
        table.dataset.moove = 1;
      }
    }

    moveCellRight(rowindex);
  }
}

function moveCellRight(rowindex) {
  arrMoveRevers.forEach(el => {
    if (!tbody.rows[rowindex].cells[el + 1].textContent) {
      for (let i = el; i >= 0; i--) {
        if (tbody.rows[rowindex].cells[i].textContent) {
          tbody.rows[rowindex].cells[i + 1].textContent
          = tbody.rows[rowindex].cells[i].textContent;

          tbody.rows[rowindex].cells[i + 1].className
          = (`field-cell field-cell--
          ${tbody.rows[rowindex].cells[i].textContent}`);

          tbody.rows[rowindex].cells[i].className = 'field-cell'; ;
          tbody.rows[rowindex].cells[i].textContent = '';
          table.dataset.moove = 1;
        }
      }
    }
  });
}

function sumArrowLeft() {
  table.dataset.moove = '';

  for (let rowindex = 0; rowindex < gameLengthField; rowindex++) {
    moveCellLeft(rowindex);

    for (let i = 0; i <= arrMove.length - 1; i++) {
      if (tbody.rows[rowindex].cells[i].textContent
        && tbody.rows[rowindex].cells[i].textContent
        === tbody.rows[rowindex].cells[i + 1].textContent) {
        tbody.rows[rowindex].cells[i].textContent
        = (+tbody.rows[rowindex].cells[i].textContent) * 2;
        arrScore.push(tbody.rows[rowindex].cells[i].textContent);

        tbody.rows[rowindex].cells[i].className
        = (`field-cell field-cell--
        ${tbody.rows[rowindex].cells[i].textContent}`);

        tbody.rows[rowindex].cells[i + 1].className = 'field-cell';
        tbody.rows[rowindex].cells[i + 1].textContent = '';
        table.dataset.moove = 1;
      }
    }
    moveCellLeft(rowindex);
  }
}

function moveCellLeft(rowindex) {
  arrMove.forEach(el => {
    if (!tbody.rows[rowindex].cells[el].textContent) {
      for (let i = el + 1; i <= arrMove.length; i++) {
        if (tbody.rows[rowindex].cells[i].textContent) {
          tbody.rows[rowindex].cells[i - 1].textContent
          = tbody.rows[rowindex].cells[i].textContent;

          tbody.rows[rowindex].cells[i - 1].className
          = (`field-cell field-cell--
          ${tbody.rows[rowindex].cells[i].textContent}`);
          tbody.rows[rowindex].cells[i].className = 'field-cell';
          tbody.rows[rowindex].cells[i].textContent = '';
          table.dataset.moove = 1;
        }
      }
    }
  });
}

function randomRow(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);

  return Math.round(rand);
}

function randomCell(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);

  return Math.round(rand);
}

function cellCounter() {
  table.dataset.cellcount = 0;

  for (const row of tbody.rows) {
    for (const cell of row.cells) {
      if (cell.textContent) {
        table.dataset.cellcount++;
      }
    }
  }
}

function addRandomitem(value) {
  const row = randomRow(0, arrMove.length);
  const cell = randomCell(0, arrMove.length);

  if (tbody.rows[row].cells[cell].textContent) {
    return addRandomitem(value);
  }

  tbody.rows[row].cells[cell].textContent = value;
  tbody.rows[row].cells[cell].classList.add(`field-cell--${value}`);
}

function randomItemValue() {
  const randomValue = Math.random();

  if (randomValue < 0.1) {
    return 2048;
  } else {
    return 2;
  }
}

function gameWiner() {
  for (let rowindex = 0; rowindex < gameLengthField; rowindex++) {
    for (let cellIndex = 0; cellIndex < gameLengthField; cellIndex++) {
      if (tbody.rows[rowindex].cells[cellIndex].textContent === '2048') {
        return 1;
      }
    }
  }
}
