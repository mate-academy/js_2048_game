'use strict';

const body = document.querySelector('body');
const container = document.createElement('div');

container.classList.add('container');
body.insertBefore(container, body.firstChild);

function initializeGame(stage) {
  gameHeader();
  gameField();
  gameNotification(stage);
}

function gameHeader() {
  container.insertAdjacentHTML('afterbegin', `
    <div class="game-header">
      <h1>2048</h1>
      <div class="controls">
        <p class="info">
          Score: <span class="game-score">0</span>
        </p>
        <button class="button start">Start</button>
      </div>
    </div>
  `);
}

function gameField() {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');
  const numRows = 4;
  const numColumns = 4;

  table.classList.add('game-field');
  table.append(tbody);

  for (let i = 0; i < numRows; i++) {
    const tr = document.createElement('tr');

    tr.classList.add('field-row"');

    for (let j = 0; j < numColumns; j++) {
      const td = document.createElement('td');

      td.classList.add('field-cell');
      tr.append(td);
    }

    tbody.append(tr);
  }

  table.append(tbody);

  container.append(table);
}

function gameNotification(stage) {
  const messages = {
    lose: 'You lose! Restart the game?',
    win: 'Winner! Congrats! You did it!',
    start: 'Press "Start" to begin game. Good luck!',
  };

  container.insertAdjacentHTML('beforeend', `
    <div class="message-container">
    </div>
  `);

  if (stage) {
    container.querySelectorAll('.message-container').forEach(el => el.remove());

    container.insertAdjacentHTML('beforeend', `
      <div class="message-container">
        <p class="message message-${stage}">${messages[stage]}</p>
      </div>
    `);
  }
};

initializeGame('start');

function createTile() {
  const emptyCells = [...document.querySelectorAll('.game-field td:empty')];

  if (emptyCells.length) {
    const emptyRandomCell
      = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    emptyRandomCell.textContent = Math.random() < 0.9 ? 2 : 4;
    emptyRandomCell.classList.add(`field-cell--${emptyRandomCell.textContent}`);
  }

  return emptyCells;
}

container.addEventListener('click', (ev) => {
  if (ev.target.closest('.button')) {
    container.innerHTML = '';
    initializeGame();
    createTile();
    createTile();
    moveTile('add');

    const button = container.querySelector('.button');

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }
});

function moveRowsLeft(rows) {
  rows.forEach(row => {
    const rowValues = [];

    for (let i = 0; i < row.cells.length; i++) {
      const cell = row.cells[i];

      if (cell.textContent !== '') {
        const value = cell.textContent;

        cell.classList.remove(`field-cell--${value}`);
        rowValues.push(value);
        cell.textContent = '';
      }
    }

    const rowValuesMerged = rowValues.map((num, index, array) => {
      if (num === array[index + 1]) {
        array[index + 1] = null;
        scoring(num * 2);

        return num * 2;
      } else {
        return num;
      }
    }).filter((num) => num);

    for (let i = 0; i < row.cells.length; i++) {
      const cell = row.cells[i];
      const newValue = rowValuesMerged.shift();

      if (newValue) {
        cell.classList.add(`field-cell--${newValue}`);
        cell.textContent = newValue;
      }
    }
  });

  gameOver();
}

function moveRowsRight(rows) {
  rows.forEach(row => {
    const rowValues = [];

    for (let i = row.cells.length - 1; i >= 0; i--) {
      const cell = row.cells[i];

      if (cell.textContent !== '') {
        const value = cell.textContent;

        cell.classList.remove(`field-cell--${value}`);
        rowValues.unshift(value);
        cell.textContent = '';
      }
    }

    const rowValuesMerged = rowValues.map((num, index, array) => {
      if (num === array[index + 1]) {
        array[index + 1] = null;
        scoring(num * 2);

        return num * 2;
      } else {
        return num;
      }
    }).filter((num) => num);

    for (let i = row.cells.length - 1; i >= 0; i--) {
      const cell = row.cells[i];
      const newValue = rowValuesMerged.pop();

      if (newValue) {
        cell.classList.add(`field-cell--${newValue}`);
        cell.textContent = newValue;
      }
    }
  });

  gameOver();
}

function moveColumnsUp(columns) {
  columns.forEach(column => {
    const columnValues = [...column.map(el => el.textContent)];

    const columnValuesMerged = columnValues.map((num, index, array) => {
      if (num === array[index + 1]) {
        array[index + 1] = null;
        scoring(num * 2);

        return num * 2;
      } else {
        return num;
      }
    }).filter((num) => num);

    for (let i = 0; i < column.length; i++) {
      const cell = column[i];

      cell.classList.remove(`field-cell--${cell.textContent}`);

      const newValue = columnValuesMerged.shift();

      cell.textContent = newValue;
      cell.classList.add(`field-cell--${newValue}`);
    }
  });

  gameOver();
}

function moveColumnsDown(columns) {
  columns.forEach(column => {
    const columnValues = [...column.map(el => el.textContent)].reverse();

    const columnValuesMerged = columnValues.map((num, index, array) => {
      if (num === array[index + 1]) {
        array[index + 1] = null;
        scoring(num * 2);

        return num * 2;
      } else {
        return num;
      }
    }).filter((num) => num);

    for (let i = column.length - 1; i >= 0; i--) {
      const cell = column[i];

      cell.classList.remove(`field-cell--${cell.textContent}`);

      const newValue = columnValuesMerged.shift();

      cell.textContent = newValue;
      cell.classList.add(`field-cell--${newValue}`);
    }
  });

  gameOver();
}

function arrowCallback(ev) {
  const table = body.querySelector('table');

  const columns = Array.from(table.rows[0].cells).map((_, index) =>
    Array.from(table.rows).map(row => row.cells[index]));

  const rows = document.querySelectorAll('tr');

  if (ev.key === 'ArrowLeft') {
    moveRowsLeft(rows);
  }

  if (ev.key === 'ArrowRight') {
    moveRowsRight(rows);
  }

  if (ev.key === 'ArrowUp') {
    moveColumnsUp(columns);
  }

  if (ev.key === 'ArrowDown') {
    moveColumnsDown(columns);
  }
};

function moveTile(option) {
  if (option === 'add') {
    window.addEventListener('keydown', arrowCallback);
  }

  if (option === 'delete') {
    window.removeEventListener('keydown', arrowCallback);
  }
}

function scoring(mergeAcc) {
  const score = container.querySelector('.game-score');

  score.textContent = parseInt(score.textContent) + parseInt(mergeAcc);
};

function gameOver() {
  const fieldCells = document.querySelectorAll('.game-field td');

  const win = Array.from(fieldCells).some(cell => cell.textContent === '2048');

  if (win) {
    gameNotification('win');
    moveTile('delete');
  }

  const table = document.querySelector('table');
  const columns = Array.from(table.rows[0].cells).map((_, index) =>
    Array.from(table.rows).map(row => row.cells[index]));
  const rows = Array.from(document.querySelectorAll('tr'))
    .map(row => Array.from(row.cells));
  const noEmptyTile = !createTile().length;
  let canMove = false;

  for (const arr of rows.concat(columns)) {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i].textContent === arr[i + 1].textContent) {
        canMove = true;
        break;
      }
    }
  }

  if (noEmptyTile && !canMove) {
    gameNotification('lose');
    moveTile('delete');
  }
}
