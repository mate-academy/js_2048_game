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

function mergeValues(values) {
  const valuesMerged = values.map((num, index, array) => {
    if (num === array[index + 1]) {
      array[index + 1] = null;
      scoring(num * 2);

      return num * 2;
    } else {
      return num;
    }
  }).filter((num) => num);

  return valuesMerged;
}

function classEditor(values, cell) {
  cell.classList.remove(`field-cell--${cell.textContent}`);

  const newValue = values.splice(0, 1)[0];

  cell.textContent = newValue;

  if (!newValue) {
    return;
  }

  cell.classList.add(`field-cell--${newValue}`);
}

function moveCells(data, key) {
  let arr;

  switch (key) {
    case 'ArrowLeft':
    case 'ArrowRight':
      arr = data.rows;
      break;
    case 'ArrowUp':
    case 'ArrowDown':
      arr = data.columns;
      break;
  }

  arr.forEach(el => {
    const arrValues = [...el.map(сell => сell.textContent)]
      .filter((num) => num);

    if (key === 'ArrowDown' || key === 'ArrowRight') {
      arrValues.reverse();
    }

    const valuesMerged = mergeValues(arrValues);

    for (let i = 0; i < el.length; i++) {
      const cell = key === 'ArrowUp' || key === 'ArrowLeft'
        ? el[i] : el[el.length - i - 1];

      classEditor(valuesMerged, cell);
    }
  });

  gameOver(data);
}

function arrowCallback(ev) {
  const table = body.querySelector('table');

  const tableData = {
    rows:
      Array.from(document.querySelectorAll('tr'))
        .map(row => Array.from(row.cells)),
    columns:
      Array.from(table.rows[0].cells)
        .map((_, index) => Array.from(table.rows).map(row => row.cells[index])),
  };

  switch (ev.key) {
    case 'ArrowLeft':
    case 'ArrowRight':
    case 'ArrowUp':
    case 'ArrowDown':
      moveCells(tableData, ev.key);
      break;
  }
};

function moveTile(option) {
  switch (option) {
    case 'add':
      window.addEventListener('keydown', arrowCallback);
      break;
    case 'delete':
      window.removeEventListener('keydown', arrowCallback);
      break;
  }
}

function scoring(acc) {
  const score = container.querySelector('.game-score');

  score.textContent = parseInt(score.textContent) + parseInt(acc);
};

function gameOver(data) {
  const win = Array.from(
    document.querySelectorAll('.game-field td'))
    .some(cell => cell.textContent === '2048');

  if (win) {
    gameNotification('win');
    moveTile('delete');
  }

  const noEmptyTile = !createTile().length;
  let cantMove = true;

  for (const arr of data.rows.concat(data.columns)) {
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i].textContent === arr[i + 1].textContent) {
        cantMove = false;
        break;
      }
    }
  }

  if (noEmptyTile && cantMove) {
    gameNotification('lose');
    moveTile('delete');
  }
}
