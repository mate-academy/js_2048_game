'use strict';

const placeColums = [[], [], [], []];
const buttonPlay = document.querySelector('.button');
const BASE_CELL_CLASS = 'field-cell';
const score = document.querySelector('.game-score');
const gameTable = document.querySelector('.game-header');
const plaseRow = [...document.querySelector('tbody').children]
  .map(element => [...element.children]);

for (let i = 0; i < 4; i++) {
  for (let k = 0; k < 4; k++) {
    placeColums[k].push(plaseRow[i][k]);
  }
}

gameTable.dataset.value = 'off';

function randomInteger(min, max) {
  const rand = min - 0.5 + Math.random() * (max - min + 1);

  return Math.round(rand);
}

function FirtsValue(arr) {
  const a = randomInteger(0, arr.length - 1);
  const valueA = randomInteger(1, 10) === 10 ? 4 : 2;

  arr[a].innerHTML = `${valueA}`;
  arr[a].classList.add(`${BASE_CELL_CLASS}--${valueA}`);
  arr.splice(a, 1);
}

function restartMesagge() {
  const messageList = document.querySelectorAll('.message');

  for (const element of messageList) {
    if (!element.classList.contains('hidden')) {
      element.classList.add('hidden');
    }
  }
}

buttonPlay.addEventListener('click', e => {
  const placePlay = [...document.querySelectorAll(`.${BASE_CELL_CLASS}`)];

  if (buttonPlay.classList.contains('start')) {
    buttonPlay.classList.remove('start');
    buttonPlay.classList.add('restart');
    restartMesagge();

    buttonPlay.innerHTML = `Restart`;

    FirtsValue(placePlay);
    FirtsValue(placePlay);

    gameTable.dataset.value = 'on';

    return;
  }

  if (buttonPlay.classList.contains('restart')) {
    buttonPlay.classList.remove('restart');
    buttonPlay.classList.add('start');

    buttonPlay.innerHTML = 'Start';

    for (const element of placePlay) {
      element.className = `${BASE_CELL_CLASS}`;

      element.innerHTML = '';
    }

    restartMesagge();

    gameTable.dataset.value = 'off';

    document.querySelector('.message-start').classList.remove('hidden');
    score.innerText = '0';

    return;
  };
});

function clearCell(cell) {
  cell.classList.remove(cell.classList[1]);
  cell.innerHTML = '';
}

function updateCell(cell, num) {
  clearCell(cell);
  cell.classList.add(`${BASE_CELL_CLASS}--${num}`);
  cell.innerText = `${num}`;
}

function checkPlace(arr) {
  for (const element of arr) {
    for (let i = 2; i >= 0; i--) {
      if (element[i + 1].innerText === element[i].innerText
          && element[i].innerText !== '') {
        return true;
      }
    }
  }

  return false;
}

function sumCell(arr) {
  for (let i = 2; i >= 0; i--) {
    if (arr[i + 1].innerText === arr[i].innerText && arr[i].innerText !== '') {
      const newValue = Number(arr[i].innerText) * 2;

      if (newValue === 2048) {
        gameTable.dataset.value = 'off';
        document.querySelector('.message-win').classList.remove('hidden');
      }

      score.innerText = `${Number(score.innerText) + newValue}`;

      clearCell(arr[i]);
      updateCell(arr[i + 1], newValue);

      arr[i].dataset.status = 'block';
    }
  }
}

function newCell() {
  const blanckCell = [...document.querySelectorAll('td')]
    .filter(element => element.classList.length === 1);

  if (blanckCell.length === 0) {
    if (checkPlace(placeColums) === false && checkPlace(plaseRow) === false) {
      document.querySelector('.message-lose').classList.remove('hidden');

      return;
    }

    return;
  }

  FirtsValue(blanckCell);
}

function moveCell(line) {
  for (let i = 3; i >= 0; i--) {
    if (line[i].innerText) {
      for (let k = i + 1; k < line.length; k++) {
        if (!line[k].innerText) {
          const value = line[k - 1].innerText;

          clearCell(line[k - 1]);
          updateCell(line[k], value);
        }
      }
    }
  }
  sumCell(line);

  if (document.querySelector('[data-status]')) {
    document.querySelector('[data-status]').removeAttribute('data-status');
  }
}

addEventListener('keydown', e => {
  if (gameTable.dataset.value === 'on') {
    switch (e.key) {
      case 'ArrowLeft':
        for (const row of plaseRow) {
          moveCell([...row].reverse());
        };

        newCell();
        break;

      case 'ArrowRight':
        for (const row of plaseRow) {
          moveCell(row);
        };

        newCell();
        break;

      case 'ArrowUp':
        for (const column of placeColums) {
          moveCell([...column].reverse());
        };

        newCell();
        break;

      case 'ArrowDown':
        for (const column of placeColums) {
          moveCell(column);
        };

        newCell();
        break;

      default:
        break;
    }
  }
});
