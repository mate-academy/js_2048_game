'use strict';

const buttonStart = document.querySelector('.start');
const tableBody = document.querySelector('tbody');
const score = document.querySelector('.game-score');
const message = document.querySelectorAll('.message');

const [lose, win] = message;
const gameField = [...tableBody.children].map(el => [...el.children]);
const fieldTurnRows = gameField.reduce((acc, curr) => {
  for (let i = 0; i < curr.length; i++) {
    acc[i].push(curr[i]);
  }

  return acc;
}, [[], [], [], []]);
const reversField = gameField.map(rev => [...rev].reverse());
const reversFieldTurnRows = fieldTurnRows.map(rev => [...rev].reverse());
let startGamePress;

buttonStart.addEventListener('click', startGame);
window.addEventListener('keydown', moveItem);

function startGame(eventStart) {
  startGamePress = true;
  eventStart.currentTarget.classList.remove('start');
  eventStart.currentTarget.classList.add('restart');
  eventStart.currentTarget.textContent = 'restart';
  score.textContent = 0;
  message.forEach(m => m.classList.add('hidden'));

  removeStyleCell();
  clearCell();
  fillRandomCell();
  fillRandomCell();
}

function moveItem(eventKey) {
  eventKey.preventDefault();

  const arrKey = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];

  if (!arrKey.includes(eventKey.key) || !startGamePress) {
    return;
  }

  switch (eventKey.key) {
    case 'ArrowUp':
      move(fieldTurnRows);
      break;
    case 'ArrowDown':
      move(reversFieldTurnRows);
      break;
    case 'ArrowRight':
      move(reversField);
      break;
    case 'ArrowLeft':
      move(gameField);
      break;
    default:
      throw Error('key no move');
  }

  const state = fillRandomCell();

  if (!state) {
    gameOver(addScore(0), !state);
  }
}

function move(field) {
  field.forEach(e => {
    for (let i = 1; i < e.length; i++) {
      if (e[i].textContent === '') {
        continue;
      }

      let target;
      let j = i - 1;

      while (
        j >= 0
        && (e[j].textContent === ''
        || e[j].textContent === e[i].textContent)
      ) {
        target = e[j];
        j--;
      }

      if (!target) {
        continue;
      }

      mergeMove(target, e[i]);
    }
  });
}

function mergeMove(targ, cell) {
  if (targ.textContent === '') {
    targ.textContent = cell.textContent;
    cell.textContent = '';
    cell.className = 'field-cell';
  }

  if (targ.textContent === cell.textContent) {
    targ.textContent = cell.textContent * 2;
    cell.textContent = '';
    cell.className = 'field-cell';
    addScore(targ.textContent);
    gameOver(targ.textContent);
  }
}

function random2And4() {
  const arrNum = [4];

  arrNum.length = 10;
  arrNum.fill(2, 1);

  return arrNum[Math.round(Math.random())];
}

function getRandom(max, min = 0) {
  return Math.floor(Math.random() * (max - min) + min);
}

function fillRandomCell() {
  const emptyCells = [...gameField]
    .flat()
    .filter(cell => !cell.textContent);

  if (emptyCells.length === 0) {
    return false;
  }

  emptyCells[getRandom(emptyCells.length)].textContent = random2And4();
  addStyleCell();

  return true;
}

function clearCell() {
  gameField.forEach(row => {
    row.forEach(cell => {
      cell.textContent = '';
    });
  });
}

function removeStyleCell() {
  gameField.forEach(e => {
    e.forEach(a => {
      if (a.textContent !== '') {
        a.className = 'field-cell';
      }
    });
  });
}

function addStyleCell() {
  gameField.forEach(e => {
    e.forEach(a => {
      if (a.textContent !== '') {
        a.classList.add(`field-cell--${a.textContent}`);
      }
    });
  });
}

function addScore(num) {
  score.textContent = +score.textContent + +num;

  return score.textContent;
}

function gameOver(num, over = false) {
  if (num === '2048') {
    win.classList.remove('hidden');
    startGamePress = false;

    return;
  }

  if (over) {
    lose.classList.remove('hidden');
    startGamePress = false;
  }
}
