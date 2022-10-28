/* eslint-disable max-len */
'use strict';

// FIELD SIZE
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

  return i + '' + j;
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

  // SETTING INITIAL TWO VALUES

  document.getElementById(id1).innerHTML = '2';
  document.getElementById(id2).innerHTML = '2';

  document.getElementById(id1).classList.add('field-cell--2');
  document.getElementById(id2).classList.add('field-cell--2');

  score = 0;
  document.querySelector('.game-score').innerHTML = score;

  return false;
}

function up() {
  isMoved = false;
  excludeIds = [];

  for (let j = min; j <= max; j++) {
    for (let i = min; i <= max; i++) {
      const id = i + '' + j;

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
      const nId = k + '' + j;

      const val = parseInt(document.getElementById((k + 1) + '' + j).innerHTML);
      const nVal = parseInt(document.getElementById(nId).innerHTML);

      if (document.getElementById(nId).innerHTML !== '') {
        if (val === nVal) {
          if (excludeIds.indexOf(nId) === -1) {
            excludeIds.push(nId);
            document.getElementById(nId).innerHTML = (val + nVal);
            document.getElementById(nId).classList.replace(`field-cell--${nVal}`, `field-cell--${val + nVal}`);
            document.getElementById((k + 1) + '' + j).innerHTML = '';
            document.getElementById((k + 1) + '' + j).classList.remove(`field-cell--${val}`);
            isMoved = true;
            score += (val + nVal);
          }
        }
        break;
      } else {
        document.getElementById(nId).innerHTML = document.getElementById((k + 1) + '' + j).innerHTML;
        document.getElementById(nId).classList.add(`field-cell--${val}`);
        document.getElementById((k + 1) + '' + j).innerHTML = '';
        document.getElementById((k + 1) + '' + j).classList.remove(`field-cell--${val}`);
        isMoved = true;
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
      const id = i + '' + j;

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
      const nId = i + '' + k;

      const val = parseInt(document.getElementById(i + '' + (k + 1)).innerHTML);
      const nVal = parseInt(document.getElementById(nId).innerHTML);

      if (document.getElementById(nId).innerHTML !== '') {
        if (val === nVal) {
          if (excludeIds.indexOf(nId) === -1) {
            excludeIds.push(nId);
            document.getElementById(nId).innerHTML = (val + nVal);
            document.getElementById(nId).classList.replace(`field-cell--${nVal}`, `field-cell--${val + nVal}`);
            document.getElementById(i + '' + (k + 1)).innerHTML = '';
            document.getElementById(i + '' + (k + 1)).classList.remove(`field-cell--${val}`);
            isMoved = true;
            score += (val + nVal);
          }
        }
        break;
      } else {
        document.getElementById(nId).innerHTML = document.getElementById(i + '' + (k + 1)).innerHTML;
        document.getElementById(nId).classList.add(`field-cell--${val}`);
        document.getElementById(i + '' + (k + 1)).innerHTML = '';
        document.getElementById(i + '' + (k + 1)).classList.remove(`field-cell--${val}`);
        isMoved = true;
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
      const id = i + '' + j;

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
      const nId = k + '' + j;

      const val = parseInt(document.getElementById((k - 1) + '' + j).innerHTML);
      const nVal = parseInt(document.getElementById(nId).innerHTML);

      if (document.getElementById(nId).innerHTML !== '') {
        if (val === nVal) {
          if (excludeIds.indexOf(nId) === -1) {
            excludeIds.push(nId);
            document.getElementById(nId).innerHTML = (val + nVal);
            document.getElementById(nId).classList.replace(`field-cell--${nVal}`, `field-cell--${val + nVal}`);
            document.getElementById((k - 1) + '' + j).innerHTML = '';
            document.getElementById((k - 1) + '' + j).classList.remove(`field-cell--${val}`);
            isMoved = true;
            score += (val + nVal);
          }
        }
        break;
      } else {
        document.getElementById(nId).innerHTML = document.getElementById((k - 1) + '' + j).innerHTML;
        document.getElementById(nId).classList.add(`field-cell--${val}`);
        document.getElementById((k - 1) + '' + j).innerHTML = '';
        document.getElementById((k - 1) + '' + j).classList.remove(`field-cell--${val}`);
        isMoved = true;
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
      const id = i + '' + j;

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
      const nId = i + '' + k;

      const val = parseInt(document.getElementById(i + '' + (k - 1)).innerHTML);
      const nVal = parseInt(document.getElementById(nId).innerHTML);

      if (document.getElementById(nId).innerHTML !== '') {
        if (val === nVal) {
          if (excludeIds.indexOf(nId) === -1) {
            excludeIds.push(nId);
            document.getElementById(nId).innerHTML = (val + nVal);
            document.getElementById(nId).classList.replace(`field-cell--${nVal}`, `field-cell--${val + nVal}`);
            document.getElementById(i + '' + (k - 1)).innerHTML = '';
            document.getElementById(i + '' + (k - 1)).classList.remove(`field-cell--${val}`);
            isMoved = true;
            score += (val + nVal);
          }
        }
        break;
      } else {
        document.getElementById(nId).innerHTML = document.getElementById(i + '' + (k - 1)).innerHTML;
        document.getElementById(nId).classList.add(`field-cell--${val}`);
        document.getElementById(i + '' + (k - 1)).innerHTML = '';
        document.getElementById(i + '' + (k - 1)).classList.remove(`field-cell--${val}`);
        isMoved = true;
      }
    }
  }

  return false;
}

// ADDING NEW VALUE

function update() {
// WINNER CHECK

  if (score === 8) {
    winMsg.classList.remove('hidden');
  }

  const ids = [];

  for (let i = min; i <= max; i++) {
    for (let j = min; j <= max; j++) {
      const idNew = i + '' + j;

      if (document.getElementById(idNew).innerHTML === '') {
        ids.push(idNew);
      }
    }
  }

  const id = ids[Math.floor(Math.random() * ids.length)];

  document.getElementById(id).innerHTML = '2';
  document.getElementById(id).classList.add('field-cell--2');

  // FULL FIELD CHECK

  let allFilled = true;

  for (let i = min; i <= max; i++) {
    for (let j = min; j <= max; j++) {
      const idCheck = i + '' + j;

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
      const val = parseInt(document.getElementById(i + '' + j).innerHTML);
      const nVal = parseInt(document.getElementById((i + 1) + '' + j).innerHTML);

      if (val === nVal) {
        isOver = false;
        break;
      }
    }
  }

  if (isOver === true) {
    for (let i = min; i <= max; i++) {
      for (let j = min; j <= (max - 1); j++) {
        const val = parseInt(document.getElementById(i + '' + j).innerHTML);
        const nVal = parseInt(document.getElementById(i + '' + (j + 1)).innerHTML);

        if (val === nVal) {
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

// CONTROLS

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

// BUTTON

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
        const id = i + '' + j;

        document.getElementById(id).innerHTML = '';
        document.getElementById(id).className = 'field-cell';
      }
    }
    load();
  }
}
