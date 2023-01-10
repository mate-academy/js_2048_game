'use strict';

const table = document.querySelector('tbody');
const button = document.querySelector('.button');
const cells = table.querySelectorAll('td');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const messageStart = document.querySelector('.message-start');
const rows = table.rows;
const columnsQnt = 4;
let total = 0;

function looser() {
  let result = false;

  for (let row = 0; row < rows.length; row++) {
    const temp = rowArrayer(rows[row]);

    temp.forEach((el, ind, arr) => {
      if (el === arr[ind + 1]) {
        result = true;
      }
    });
  };

  for (let i = 0; i < columnsQnt; i++) {
    const arr = [
      +rows[0].children[i].innerText,
      +rows[1].children[i].innerText,
      +rows[2].children[i].innerText,
      +rows[3].children[i].innerText,
    ];

    arr.forEach((el, ind, ar) => {
      if (el === ar[ind + 1]) {
        result = true;
      };
    });
  }

  if (!hasEmptyCells() && result === false) {
    messageLose.classList.remove('hidden');
  };
};

function rowArrayer(row) {
  const result = [];

  for (const child of row.children) {
    if (child.innerText === '') {
      result.push(0);
      continue;
    }
    result.push(Number(child.innerText));
  };

  return result;
};

function rowReverseArrayer(arr, row) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === 0) {
      row.children[i].innerHTML = '';
      continue;
    };

    row.children[i].innerText = arr[i];
  }

  styleUpdater();
}

function move(row) {
  let filtered = row.filter(el => el > 0);

  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) {
      const value = filtered[i] * 2;

      total += value;
      filtered[i] = value;
      filtered[i + 1] = 0;
    };
  };

  filtered = filtered.filter(el => el > 0);

  while (filtered.length < columnsQnt) {
    filtered.push(0);
  };

  return filtered;
};

function styleUpdater() {
  const score = document.querySelector('.game-score');

  score.innerText = `${total}`;

  for (let row = 0; row < rows.length; row++) {
    for (let column = 0; column < columnsQnt; column++) {
      const num = rows[row].children[column].innerText;

      rows[row].children[column].classList.value = '';
      rows[row].children[column].classList.add('field-cell');

      if (num !== '') {
        rows[row].children[column].classList.add(`field-cell--${num}`);
      }
    }
  };
};

function moveLeft() {
  for (const row of rows) {
    let temp = rowArrayer(row);

    temp = move(temp);
    rowReverseArrayer(temp, row);
  };

  cellsAdder();
};

function moveRight() {
  for (const row of rows) {
    let temp = rowArrayer(row);

    temp.reverse();
    temp = move(temp);
    temp.reverse();
    rowReverseArrayer(temp, row);
  }
  cellsAdder();
}

function columnArayer(collection, index) {
  return [
    +collection[0].children[index].innerText,
    +collection[1].children[index].innerText,
    +collection[2].children[index].innerText,
    +collection[3].children[index].innerText,
  ];
}

function moveUp() {
  for (let i = 0; i < columnsQnt; i++) {
    const arr = columnArayer(rows, i);

    const moved = move(arr);

    [...rows].forEach((row, index) => {
      row.children[i].innerText = moved[index] === 0 ? '' : moved[index];
    });
  };
  cellsAdder();
};

function moveDown() {
  for (let i = 0; i < columnsQnt; i++) {
    const arr = columnArayer(rows, i);

    arr.reverse();

    const moved = move(arr);

    moved.reverse();

    [...rows].forEach((row, index) => {
      row.children[i].innerText = moved[index] === 0 ? '' : moved[index];
    });
  };
  cellsAdder();
}

function gameStarter() {
  const index1 = Math.floor(Math.random() * cells.length);
  let index2 = Math.floor(Math.random() * cells.length);

  while (index1 === index2) {
    index2 = Math.floor(Math.random() * cells.length);
  }

  const value1 = cellsCreator();
  let value2 = cellsCreator();

  while (value1 === value2) {
    value2 = cellsCreator();
  }

  cells[index1].innerText = cellsCreator();
  cells[index2].innerText = cellsCreator();

  styleUpdater();
};

function cellsCreator() {
  let resultCell;
  const probability = Math.random();

  if (probability < 0.1) {
    resultCell = 4;
  } else {
    resultCell = 2;
  }

  return resultCell;
}

function restarter() {
  for (const cell of cells) {
    cell.innerHTML = '';
    cell.classList.value = '';
    cell.className = 'field-cell';
  }
  total = 0;
  styleUpdater();
}

function cellsAdder() {
  if (!hasEmptyCells()) {
    return;
  }

  let wasAdded = false;

  while (!wasAdded) {
    const index = Math.floor(Math.random() * cells.length);

    if (cells[index].innerText === '') {
      cells[index].innerText = cellsCreator();
      wasAdded = true;
    };
  };
  styleUpdater();
};

function hasEmptyCells() {
  for (const cell of cells) {
    if (cell.innerText === '') {
      return true;
    }
  }

  return false;
};

function messageUpdater() {
  for (const cell of cells) {
    if (cell.innerText === '2048') {
      messageWin.classList.remove('hidden');
    };
  };
};

button.addEventListener('click', e => {
  switch (e.target.innerText) {
    case 'Start':
      e.target.classList.value = '';
      e.target.classList.add('button', 'restart');
      e.target.innerText = 'Restart';
      messageStart.classList.add('hidden');

      gameStarter();
      break;
    case 'Restart':
      e.target.classList.value = '';
      e.target.classList.add('button', 'start');
      e.target.innerText = 'Start';
      messageStart.classList.remove('hidden');
      messageWin.classList.add('hidden');
      messageLose.classList.add('hidden');

      restarter();
      break;
  };
});

document.addEventListener('keyup', e => {
  if (e.code === 'ArrowLeft') {
    moveLeft();
    styleUpdater();
    messageUpdater();
    looser();
  };
});

document.addEventListener('keyup', e => {
  if (e.code === 'ArrowRight') {
    moveRight();
    styleUpdater();
    messageUpdater();
    looser();
  };
});

document.addEventListener('keyup', e => {
  if (e.code === 'ArrowUp') {
    moveUp();
    styleUpdater();
    messageUpdater();
    looser();
  };
});

document.addEventListener('keyup', e => {
  if (e.code === 'ArrowDown') {
    moveDown();
    messageUpdater();
    styleUpdater();
    looser();
  };
});
