'use strict';

const start = document.querySelector('button');
const tr = document.querySelectorAll('tr');
const td = document.querySelectorAll('td');
const tbody = document.querySelector('tbody');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const score = document.querySelector('.game-score');
let step = 0;
let row = false;
let column = false;

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function startGame() {
  const rowFirstCell = tbody.children[getRandom(1, 4) - 1];
  const firstCell = rowFirstCell.children[getRandom(1, 4) - 1];
  const rowSecondCell = tbody.children[getRandom(1, 4) - 1];
  const secondCell = rowSecondCell.children[getRandom(1, 4) - 1];

  if (firstCell === secondCell) {
    return startGame();
  };

  if (getRandom(0, 100) <= 10) {
    firstCell.textContent = '4';
    firstCell.className = 'field-cell field-cell--4';
  } else {
    firstCell.textContent = '2';
    firstCell.className = 'field-cell field-cell--2';
  };

  if (getRandom(0, 100) <= 10) {
    secondCell.textContent = '4';
    secondCell.className = 'field-cell field-cell--4';
  } else {
    secondCell.textContent = '2';
    secondCell.className = 'field-cell field-cell--2';
  };
};

function addCell() {
  const rowThirdCell = tbody.children[getRandom(1, 4) - 1];
  const thirdCell = rowThirdCell.children[getRandom(1, 4) - 1];

  if (step === 0) {
    return;
  };

  if (thirdCell.className.includes('--')) {
    return addCell();
  };

  if (getRandom(0, 100) <= 10) {
    thirdCell.textContent = '4';
    thirdCell.className = 'field-cell field-cell--4';
  } else {
    thirdCell.textContent = '2';
    thirdCell.className = 'field-cell field-cell--2';
  };

  step = 0;
};

function up() {
  for (let r = 1; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (tr[r].children[c].className.includes('--')
      && !tr[r - 1].children[c].className.includes('--')) {
        tr[r - 1].children[c].className = tr[r].children[c].className;
        tr[r - 1].children[c].textContent = tr[r].children[c].textContent;
        tr[r].children[c].className = 'field-cell';
        tr[r].children[c].textContent = '';
        up();
        step = 1;
      };
    };
  };
};

function mergeUp() {
  for (let r = 1; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (tr[r].children[c].className.includes('--')
      && tr[r - 1].children[c].className.includes('--')
      && tr[r - 1].children[c].textContent === tr[r].children[c].textContent) {
        tr[r - 1].children[c].textContent = tr[r].children[c].textContent * 2;

        tr[r - 1].children[c].className
          = `field-cell field-cell--${tr[r - 1].children[c].textContent}`;
        tr[r].children[c].className = 'field-cell';
        tr[r].children[c].textContent = '';
        step = 1;

        score.textContent
          = +score.textContent + +(tr[r - 1].children[c].textContent);
      };
    };
  };
};

function down() {
  for (let r = 2; r >= 0; r--) {
    for (let c = 3; c >= 0; c--) {
      if (tr[r].children[c].className.includes('--')
      && !tr[r + 1].children[c].className.includes('--')) {
        tr[r + 1].children[c].className = tr[r].children[c].className;
        tr[r + 1].children[c].textContent = tr[r].children[c].textContent;
        tr[r].children[c].className = 'field-cell';
        tr[r].children[c].textContent = '';
        down();
        step = 1;
      };
    };
  };
};

function mergeDown() {
  for (let r = 2; r >= 0; r--) {
    for (let c = 3; c >= 0; c--) {
      if (tr[r].children[c].className.includes('--')
      && tr[r + 1].children[c].className.includes('--')
      && tr[r + 1].children[c].textContent === tr[r].children[c].textContent) {
        tr[r + 1].children[c].textContent = tr[r].children[c].textContent * 2;

        tr[r + 1].children[c].className
          = `field-cell field-cell--${tr[r + 1].children[c].textContent}`;
        tr[r].children[c].className = 'field-cell';
        tr[r].children[c].textContent = '';
        step = 1;

        score.textContent
          = +score.textContent + +(tr[r + 1].children[c].textContent);
      };
    };
  };
};

function left() {
  for (let r = 0; r < 4; r++) {
    for (let c = 1; c < 4; c++) {
      if (tr[r].children[c].className.includes('--')
      && !tr[r].children[c - 1].className.includes('--')) {
        tr[r].children[c - 1].className = tr[r].children[c].className;
        tr[r].children[c - 1].textContent = tr[r].children[c].textContent;
        tr[r].children[c].className = 'field-cell';
        tr[r].children[c].textContent = '';
        left();
        step = 1;
      };
    };
  };
};

function mergeLeft() {
  for (let r = 0; r < 4; r++) {
    for (let c = 1; c < 4; c++) {
      if (tr[r].children[c].className.includes('--')
      && tr[r].children[c - 1].className.includes('--')
      && tr[r].children[c - 1].textContent === tr[r].children[c].textContent) {
        tr[r].children[c - 1].textContent = tr[r].children[c].textContent * 2;

        tr[r].children[c - 1].className
          = `field-cell field-cell--${tr[r].children[c - 1].textContent}`;
        tr[r].children[c].className = 'field-cell';
        tr[r].children[c].textContent = '';
        step = 1;

        score.textContent
          = +score.textContent + +(tr[r].children[c - 1].textContent);
      };
    };
  };
};

function right() {
  for (let r = 3; r >= 0; r--) {
    for (let c = 2; c >= 0; c--) {
      if (tr[r].children[c].className.includes('--')
      && !tr[r].children[c + 1].className.includes('--')) {
        tr[r].children[c + 1].className = tr[r].children[c].className;
        tr[r].children[c + 1].textContent = tr[r].children[c].textContent;
        tr[r].children[c].className = 'field-cell';
        tr[r].children[c].textContent = '';
        right();
        step = 1;
      };
    };
  };
};

function mergeRight() {
  for (let r = 3; r >= 0; r--) {
    for (let c = 2; c >= 0; c--) {
      if (tr[r].children[c].className.includes('--')
      && tr[r].children[c + 1].className.includes('--')
      && tr[r].children[c + 1].textContent === tr[r].children[c].textContent) {
        tr[r].children[c + 1].textContent = tr[r].children[c].textContent * 2;

        tr[r].children[c + 1].className
          = `field-cell field-cell--${tr[r].children[c + 1].textContent}`;
        tr[r].children[c].className = 'field-cell';
        tr[r].children[c].textContent = '';
        step = 1;

        score.textContent
          = +score.textContent + +(tr[r].children[c + 1].textContent);
      };
    };
  };
};

document.addEventListener('click', (c) => {
  if (c.target.className.includes('start')) {
    startGame();

    if (start.className.includes('restart')) {
      for (const key of td) {
        key.className = 'field-cell';
        key.textContent = '';
      };

      score.textContent = 0;

      startGame();
    };

    start.className = 'button restart';
    start.textContent = 'Restart';
    startMessage.className = 'message message-lose hidden';
    loseMessage.className = 'message message-lose hidden';
  };
});

document.addEventListener('keydown', (e) => {
  if (startMessage.className === 'message message-lose hidden') {
    if (e.key === 'ArrowUp') {
      up();
      mergeUp();
      up();
      addCell();
    };

    if (e.key === 'ArrowDown') {
      down();
      mergeDown();
      down();
      addCell();
    };

    if (e.key === 'ArrowLeft') {
      left();
      mergeLeft();
      left();
      addCell();
    };

    if (e.key === 'ArrowRight') {
      right();
      mergeRight();
      right();
      addCell();
    };
  };

  const lose = [...td].every(x => x.className.includes('--'));
  const win = [...td].some(x => x.className.includes('--2048'));

  if (lose === true) {
    row = false;
    column = false;

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        if (tr[r].children[c].textContent
          === tr[r + 1].children[c].textContent) {
          return;
        };

        if (tr[r].children[c].textContent
          !== tr[r + 1].children[c].textContent) {
          row = true;
        };
      };
    };

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        if (tr[r].children[c].textContent
          === tr[r].children[c + 1].textContent) {
          return;
        };

        if (tr[r].children[c].textContent
          !== tr[r].children[c + 1].textContent) {
          column = true;
        };
      };
    };

    if (lose === true && row === true && column === true) {
      loseMessage.className = 'message message-lose';

      return;
    };
  };

  if (win === true) {
    winMessage.className = 'message message-win';

    return;
  };
});
