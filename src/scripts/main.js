'use strict';

const buttonStartRestart = document.querySelector('.start');
const tableBody = document.querySelector('tbody');
const score = document.querySelector('.game-score');
const info = {
  1: [],
  2: [],
  3: [],
  4: [],
};
let rondomCounter = 0;

tableBody.dataset.countEmplyCells = '16';

buttonStartRestart.addEventListener('click', (evt) => {
  start();
});

document.body.addEventListener('keydown', (evt) => {
  if (!tableBody.hasAttribute('clickedStart')) {
    return;
  }

  evt.preventDefault();

  switch (evt.code) {
    case 'ArrowUp':
      moveCells(evt.code);
      break;
    case 'ArrowDown':
      moveCells(evt.code);
      break;
    case 'ArrowLeft':
      moveCells(evt.code);
      break;
    case 'ArrowRight':
      moveCells(evt.code);
      break;
    default:
      break;
  }
});

function moveCells(direction) {
  const counter = score.textContent;

  restart();

  const infoTraffic = {
    1: [],
    2: [],
    3: [],
    4: [],
  };

  infoTrafficInteration(infoTraffic, direction);

  const infoTrafficSort = {
    1: [],
    2: [],
    3: [],
    4: [],
  };

  infoTrafficInterationSort(infoTraffic, infoTrafficSort, direction);

  for (let i = 0; i < 4; i++) {
    infoTrafficSort[i + 1].forEach((cell, index) => {
      if (cell !== undefined) {
        const currentCell = tableBody.children[i].children[index];

        currentCell.textContent = `${cell}`;
        currentCell.classList.add(`field-cell--${currentCell.textContent}`);
      }
    });
  }

  winnerGame();
  stopGame(counter);
  addRondomNumber();
  upDateInfo();
};

function winnerGame() {
  if (+score.textContent !== 2048) {
    return;
  }
  document.getElementsByClassName('message-win')[0].classList.remove('hidden');
};

function infoTrafficInterationSort(infoTraffic, infoTrafficSort, direction) {
  switch (direction) {
    case 'ArrowLeft':
      for (let i = 0; i < 4; i++) {
        infoTrafficSort[i + 1] = [
          infoTraffic[i + 1][0],
          infoTraffic[i + 1][1],
          infoTraffic[i + 1][2],
          infoTraffic[i + 1][3],
        ];
      }
      break;
    case 'ArrowRight':
      for (let i = 0; i < 4; i++) {
        infoTrafficSort[i + 1] = [
          infoTraffic[i + 1][infoTraffic[i + 1].length - 4],
          infoTraffic[i + 1][infoTraffic[i + 1].length - 3],
          infoTraffic[i + 1][infoTraffic[i + 1].length - 2],
          infoTraffic[i + 1][infoTraffic[i + 1].length - 1],
        ];
      }
      break;
    case 'ArrowUp':
      for (let i = 0; i < 4; i++) {
        infoTrafficSort[i + 1] = [
          infoTraffic[1][i],
          infoTraffic[2][i],
          infoTraffic[3][i],
          infoTraffic[4][i],
        ];
      }
      break;
    case 'ArrowDown':
      for (let i = 0; i < 4; i++) {
        infoTrafficSort[4 - i] = [
          infoTraffic[1][infoTraffic[1].length - 1 - i],
          infoTraffic[2][infoTraffic[2].length - 1 - i],
          infoTraffic[3][infoTraffic[3].length - 1 - i],
          infoTraffic[4][infoTraffic[4].length - 1 - i],
        ];
      }
      break;
    default:
      break;
  }
};

function infoTrafficInteration(infoTraffic, direction) {
  if (direction === 'ArrowUp'
      || direction === 'ArrowDown') {
    for (let i = 0; i < 4; i++) {
      infoTraffic[i + 1] = [
        info[1][i],
        info[2][i],
        info[3][i],
        info[4][i],
      ].filter(cell => cell !== 0);

      infoTraffic[i + 1].forEach((cell, index) => {
        if (Number(cell) === Number(infoTraffic[i + 1][index + 1])) {
          infoTraffic[i + 1][index] = `${+cell * 2}`;
          score.textContent = `${+score.textContent + ((+cell) * 2)}`;
          infoTraffic[i + 1].splice(index + 1, 1);
        }
      });
    }
  }

  if (direction === 'ArrowLeft'
    || direction === 'ArrowRight') {
    for (let i = 0; i < 4; i++) {
      infoTraffic[i + 1] = info[i + 1].filter(cell => cell !== 0);

      infoTraffic[i + 1].forEach((cell, index) => {
        if (Number(cell) === Number(infoTraffic[i + 1][index + 1])) {
          infoTraffic[i + 1][index + 1] = `${+cell * 2}`;
          score.textContent = `${+score.textContent + ((+cell) * 2)}`;
          infoTraffic[i + 1].splice(index, 1);
        }
      });
    }
  }
};

function stopGame(counter) {
  if ((+score.textContent) - counter === 0
    && tableBody.dataset.countEmplyCells.trim() === '0') {
    document.querySelector('.message-lose')
      .classList.remove('hidden');
  }
};

function start() {
  if (tableBody.hasAttribute('clickedStart')) {
    document.getElementsByClassName('message-win')[0].classList.add('hidden');
  }

  rondomCounter = 0;
  tableBody.dataset.countEmplyCells = '16';
  document.querySelector('.message-lose').classList.add('hidden');
  buttonStartRestart.classList.remove('start');
  buttonStartRestart.classList.add('restart');
  buttonStartRestart.textContent = 'Restart';
  document.querySelector('.message-start').classList.add('hidden');

  tableBody.setAttribute('clickedStart', true);
  score.textContent = '0';
  restart();
  addRondomNumber();
  addRondomNumber();
  upDateInfo();
};

function restart() {
  for (const row of tableBody.children) {
    for (const cell of row.children) {
      cell.classList.remove(`field-cell--${cell.textContent}`);
      cell.textContent = '';
    }
  }

  if (!tableBody.hasAttribute('clickedStart')) {
    score.textContent = '0';
  }
};

function addRondomNumber() {
  if (tableBody.dataset.countEmplyCells.trim() === '0') {
    return;
  }

  const rondomCell = tableBody.children[getRondomNumber(0, 4)]
    .children[getRondomNumber(0, 4)];

  if (rondomCell.textContent.length > 0) {
    return addRondomNumber();
  }

  let number = '2';
  const rondomIndex = getRondomNumber(1, 10);

  if (rondomIndex === 1
    || rondomCounter === 0) {
    rondomCounter += 1;
    number = '4';
    rondomCell.textContent = `${number}`;
    rondomCell.classList.add(`field-cell--${number}`);

    return;
  }
  rondomCell.textContent = `${number}`;
  rondomCell.classList.add(`field-cell--${number}`);
};

function getRondomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
};

function upDateInfo() {
  tableBody.dataset.countEmplyCells = '16';

  for (let i = 1; i <= 4; i++) {
    info[i] = [...tableBody.children[i - 1].children]
      .map(cell => {
        if (cell.textContent.length > 0) {
          tableBody.dataset.countEmplyCells = `
            ${Number(tableBody.dataset.countEmplyCells) - 1}
          `;

          return cell.textContent;
        }

        return 0;
      });
  }
};
