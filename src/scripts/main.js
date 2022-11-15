/* eslint-disable max-len */
'use strict';

const size = 4;
const min = 0;
const max = size - 1;

let isMoved = false;
let score = 0;

let excludeIds = [];
const startMsg = document.querySelector('.message-start');
const loseMsg = document.querySelector('.message-lose');
const winMsg = document.querySelector('.message-win');

function getRandom() {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getId() {
  const i = getRandom();
  const j = getRandom();

  return `${i}${j}`;
}

function load() {
  const id1 = getId();
  let id2 = '';

  while (true) {
    id2 = getId();

    if (id1 !== id2) {
      break;
    }
  }

  document.getElementById(id1).innerHTML = '2';
  document.getElementById(id2).innerHTML = '2';

  document.getElementById(id1).classList.add('field-cell--2');
  document.getElementById(id2).classList.add('field-cell--2');

  score = 0;
  document.querySelector('.game-score').innerHTML = score;

  return false;
}

function combineCells(newId, element, elemValue, newElement, newElemValue) {
  if (elemValue === newElemValue) {
    if (excludeIds.indexOf(newId) === -1) {
      excludeIds.push(newId);
      newElement.innerHTML = (elemValue + newElemValue);
      newElement.classList.replace(`field-cell--${newElemValue}`, `field-cell--${elemValue + newElemValue}`);
      element.innerHTML = '';
      element.classList.remove(`field-cell--${elemValue}`);
      isMoved = true;
      score += (elemValue + newElemValue);
    }
  }
}

function moveToEmptyCell(newId, value, elemValue) {
  document.getElementById(newId).innerHTML = value.innerHTML;
  document.getElementById(newId).classList.add(`field-cell--${elemValue}`);
  value.innerHTML = '';
  value.classList.remove(`field-cell--${elemValue}`);
  isMoved = true;
}

function up() {
  isMoved = false;
  excludeIds = [];

  for (let j = min; j <= max; j++) {
    for (let i = min; i <= max; i++) {
      const id = `${i}${j}`;

      if (document.getElementById(id).innerHTML !== '') {
        moveUp(id);
      }
    }
  }

  if (isMoved === true) {
    update();
  }

  return false;
}

function moveUp(id) {
  if (!id.startsWith(min)) {
    const arr = id.split('');
    const i = parseInt(arr[0]);
    const j = parseInt(arr[1]);

    for (let k = (i - 1); k >= min; k--) {
      const nId = `${k}${j}`;
      const elem = document.getElementById(`${k + 1}${j}`);
      const newElem = document.getElementById(nId);

      const elValue = parseInt(elem.innerHTML);
      const newElValue = parseInt(newElem.innerHTML);

      if (newElem.innerHTML !== '') {
        combineCells(nId, elem, elValue, newElem, newElValue);

        break;
      } else {
        moveToEmptyCell(nId, elem, elValue);
      }
    }
  }

  return false;
}

function left() {
  isMoved = false;
  excludeIds = [];

  for (let i = min; i <= max; i++) {
    for (let j = min; j <= max; j++) {
      const id = `${i}${j}`;

      if (document.getElementById(id).innerHTML !== '') {
        moveLeft(id);
      }
    }
  }

  if (isMoved === true) {
    update();
  }

  return false;
}

function moveLeft(id) {
  if (!id.endsWith(min)) {
    const arr = id.split('');
    const i = parseInt(arr[0]);
    const j = parseInt(arr[1]);

    for (let k = (j - 1); k >= min; k--) {
      const nId = `${i}${k}`;
      const elem = document.getElementById(`${i}${k + 1}`);
      const newElem = document.getElementById(nId);

      const elValue = parseInt(elem.innerHTML);
      const newElValue = parseInt(newElem.innerHTML);

      if (newElem.innerHTML !== '') {
        combineCells(nId, elem, elValue, newElem, newElValue);

        break;
      } else {
        moveToEmptyCell(nId, elem, elValue);
      }
    }
  }

  return false;
}

function down() {
  isMoved = false;
  excludeIds = [];

  for (let j = min; j <= max; j++) {
    for (let i = max; i >= min; i--) {
      const id = `${i}${j}`;

      if (document.getElementById(id).innerHTML !== '') {
        moveDown(id);
      }
    }
  }

  if (isMoved === true) {
    update();
  }

  return false;
}

function moveDown(id) {
  if (!id.startsWith(max)) {
    const arr = id.split('');
    const i = parseInt(arr[0]);
    const j = parseInt(arr[1]);

    for (let k = (i + 1); k <= max; k++) {
      const nId = `${k}${j}`;
      const elem = document.getElementById(`${k - 1}${j}`);
      const newElem = document.getElementById(nId);

      const elValue = parseInt(elem.innerHTML);
      const newElValue = parseInt(newElem.innerHTML);

      if (newElem.innerHTML !== '') {
        combineCells(nId, elem, elValue, newElem, newElValue);

        break;
      } else {
        moveToEmptyCell(nId, elem, elValue);
      }
    }
  }

  return false;
}

function right() {
  isMoved = false;
  excludeIds = [];

  for (let i = min; i <= max; i++) {
    for (let j = max; j >= min; j--) {
      const id = `${i}${j}`;

      if (document.getElementById(id).innerHTML !== '') {
        moveRight(id);
      }
    }
  }

  if (isMoved === true) {
    update();
  }

  return false;
}

function moveRight(id) {
  if (!id.endsWith(max)) {
    const arr = id.split('');
    const i = parseInt(arr[0]);
    const j = parseInt(arr[1]);

    for (let k = (j + 1); k <= max; k++) {
      const nId = `${i}${k}`;
      const elem = document.getElementById(`${i}${k - 1}`);
      const newElem = document.getElementById(nId);

      const elValue = parseInt(elem.innerHTML);
      const newElValue = parseInt(newElem.innerHTML);

      if (newElem.innerHTML !== '') {
        combineCells(nId, elem, elValue, newElem, newElValue);

        break;
      } else {
        moveToEmptyCell(nId, elem, elValue);
      }
    }
  }

  return false;
}

function update() {
  if (score === 2048) {
    winMsg.classList.remove('hidden');
  }

  const ids = [];

  for (let i = min; i <= max; i++) {
    for (let j = min; j <= max; j++) {
      const idNew = `${i}${j}`;

      if (document.getElementById(idNew).innerHTML === '') {
        ids.push(idNew);
      }
    }
  }

  const id = ids[Math.floor(Math.random() * ids.length)];

  document.getElementById(id).innerHTML = '2';
  document.getElementById(id).classList.add('field-cell--2');

  let allFilled = true;

  for (let i = min; i <= max; i++) {
    for (let j = min; j <= max; j++) {
      const idCheck = `${i}${j}`;

      if (document.getElementById(idCheck).innerHTML === '') {
        allFilled = false;
        break;
      }
    }
  }

  document.querySelector('.game-score').innerHTML = score;

  if (allFilled) {
    checkGameOver();
  }
}

function checkGameOver() {
  let isOver = true;

  for (let j = min; j <= max; j++) {
    for (let i = min; i <= (max - 1); i++) {
      const value = parseInt(document.getElementById(`${i}${j}`).innerHTML);
      const newValue = parseInt(document.getElementById(`${i + 1}${j}`).innerHTML);

      if (value === newValue) {
        isOver = false;
        break;
      }
    }
  }

  if (isOver === true) {
    for (let i = min; i <= max; i++) {
      for (let j = min; j <= (max - 1); j++) {
        const value = parseInt(document.getElementById(`${i}${j}`).innerHTML);
        const newValue = parseInt(document.getElementById(`${i}${j + 1}`).innerHTML);

        if (value === newValue) {
          isOver = false;
          break;
        }
      }
    }
  }

  if (isOver) {
    loseMsg.classList.remove('hidden');
  }

  return false;
}

document.body.addEventListener('keydown', (e) => {
  e.preventDefault();

  switch (e.code) {
    case 'ArrowLeft':
      left();
      break;
    case 'ArrowUp':
      up();
      break;
    case 'ArrowRight':
      right();
      break;
    case 'ArrowDown':
      down();
      break;
  }
});

const start = document.querySelector('.button');

start.addEventListener('click', first);

function first() {
  startMsg.classList.add('hidden');

  load();

  start.classList.add('restart');
  start.innerHTML = 'Restart';

  start.removeEventListener('click', first);

  start.addEventListener('click', second);

  function second() {
    loseMsg.classList.add('hidden');
    winMsg.classList.add('hidden');

    for (let i = min; i <= max; i++) {
      for (let j = min; j <= max; j++) {
        const id = `${i}${j}`;

        document.getElementById(id).innerHTML = '';
        document.getElementById(id).className = 'field-cell';
      }
    }
    load();
  }
}
