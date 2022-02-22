'use strict';

const startButton = document.querySelector('.start');
const fieldRow = document.querySelectorAll('.field-row');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const gameField = document.querySelector('tbody');
const gameScore = document.querySelector('.game-score');
let score = 0;

startButton.addEventListener('click', (e) => {
  if (e.target.classList.contains('start')) {
    messageStart.classList.add('hidden');
    startButton.classList.add('restart');
    startButton.innerHTML = 'Restart';
    startButton.classList.remove('start');
    getNewCell();
    getNewCell();
  } else {
    const cells = document.querySelectorAll('td');

    cells.forEach(el => {
      el.className = 'field-cell';
      el.innerHTML = '';
    });
    messageLose.classList.add('hidden');
    score = 0;
    gameScore.innerHTML = score;
    getNewCell();
    getNewCell();
  }
});

document.body.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    moveUp();
    toWinGame();
    toOverGame();
  }

  if (e.key === 'ArrowDown') {
    moveDown();
    toWinGame();
    toOverGame();
  }

  if (e.key === 'ArrowRight') {
    moveRight();
    toWinGame();
    toOverGame();
  }

  if (e.key === 'ArrowLeft') {
    moveLeft();
    toWinGame();
    toOverGame();
  }
});

function toOverGame() {
  const cells = document.querySelectorAll('td');
  const arrCells = [...cells];
  const check = arrCells.every(el => el.classList.contains('active'));

  if (check) {
    const rows = document.querySelectorAll('tr');

    if (rows[0].children[0].innerHTML !== rows[0].children[1].innerHTML
      && rows[0].children[0].innerHTML !== rows[1].children[0].innerHTML
      && rows[0].children[1].innerHTML !== rows[0].children[2].innerHTML
      && rows[0].children[1].innerHTML !== rows[1].children[1].innerHTML
      && rows[0].children[2].innerHTML !== rows[0].children[3].innerHTML
      && rows[0].children[2].innerHTML !== rows[1].children[2].innerHTML
      && rows[0].children[3].innerHTML !== rows[1].children[3].innerHTML
      && rows[1].children[0].innerHTML !== rows[1].children[1].innerHTML
      && rows[1].children[0].innerHTML !== rows[2].children[0].innerHTML
      && rows[1].children[1].innerHTML !== rows[1].children[2].innerHTML
      && rows[1].children[1].innerHTML !== rows[2].children[1].innerHTML
      && rows[1].children[2].innerHTML !== rows[1].children[3].innerHTML
      && rows[1].children[2].innerHTML !== rows[2].children[2].innerHTML
      && rows[1].children[3].innerHTML !== rows[2].children[3].innerHTML
      && rows[2].children[0].innerHTML !== rows[2].children[1].innerHTML
      && rows[2].children[0].innerHTML !== rows[3].children[0].innerHTML
      && rows[2].children[1].innerHTML !== rows[2].children[2].innerHTML
      && rows[2].children[1].innerHTML !== rows[3].children[1].innerHTML
      && rows[2].children[2].innerHTML !== rows[2].children[3].innerHTML
      && rows[2].children[2].innerHTML !== rows[3].children[2].innerHTML
      && rows[2].children[3].innerHTML !== rows[3].children[3].innerHTML
      && rows[3].children[0].innerHTML !== rows[3].children[1].innerHTML
      && rows[3].children[1].innerHTML !== rows[3].children[2].innerHTML
      && rows[3].children[2].innerHTML !== rows[3].children[3].innerHTML
    ) {
      messageLose.classList.remove('hidden');
    }
  }
}

function toWinGame() {
  const activeCells = document.querySelectorAll('.active');

  activeCells.forEach(el => {
    if (el.innerHTML === '2048') {
      messageWin.classList.remove('hidden');
      toLockAllMoves();
    }
  });
}

function toLockAllMoves() {
  const activeCells = document.querySelectorAll('.active');

  activeCells.forEach(el => {
    el.classList.remove('active');
  });
}

function getRandomNumber() {
  return Math.floor(Math.random() * 4);
}

function getNewValue() {
  const allNums = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];

  return allNums[Math.floor(Math.random() * 10)];
}

function getNewCell() {
  const cell = fieldRow[getRandomNumber()].children[getRandomNumber()];

  if (!cell.innerHTML) {
    const cellValue = getNewValue();

    cell.classList.add(`field-cell--${cellValue}`, 'active');
    cell.innerHTML = `${cellValue}`;
  } else {
    getNewCell();
  }
}

function moveUp() {
  const activeCells = document.querySelectorAll('.active');
  let isFieldChanged = false;

  activeCells.forEach(item => item.classList.remove('protected'));

  for (let i = 0; i < activeCells.length; i++) {
    const el = activeCells[i];
    const rowIndex = el.parentElement.rowIndex;
    const cellIndex = el.cellIndex;

    if (rowIndex !== 0) {
      for (let j = 0; j < rowIndex; j++) {
        const newCell = el.cloneNode(true);
        const nextEl = gameField.children[j].children[cellIndex];

        if (!nextEl.classList.contains('active')) {
          nextEl.replaceWith(newCell);
          el.className = 'field-cell';
          el.innerHTML = '';
          isFieldChanged = true;
        } else {
          const curValue = +(nextEl.innerHTML);
          const prevValue = +(el.innerHTML);

          if (curValue === prevValue
            && !nextEl.classList.contains('protected')) {
            el.className = 'field-cell';
            el.innerHTML = '';
            nextEl.innerHTML = `${curValue * 2}`;
            nextEl.className = 'field-cell';

            nextEl.classList.add(
              `field-cell--${curValue * 2}`, 'active', 'protected');
            score += curValue * 2;
            gameScore.innerHTML = score;
            isFieldChanged = true;
          } else {
            nextEl.classList.add('protected');
          }
        }
      }
    }
  }

  if (isFieldChanged === true) {
    getNewCell();
  }
}

function moveDown() {
  const activeCells = document.querySelectorAll('.active');
  let isFieldChanged = false;

  activeCells.forEach(item => item.classList.remove('protected'));

  for (let i = activeCells.length - 1; i >= 0; i--) {
    const el = activeCells[i];
    const rowIndex = el.parentElement.rowIndex;
    const cellIndex = el.cellIndex;

    if (rowIndex !== 3) {
      for (let j = 3; j > rowIndex; j--) {
        const newCell = el.cloneNode(true);
        const nextEl = gameField.children[j].children[cellIndex];

        if (!nextEl.classList.contains('active')) {
          nextEl.replaceWith(newCell);
          el.className = 'field-cell';
          el.innerHTML = '';
          isFieldChanged = true;
        } else {
          const curValue = +(nextEl.innerHTML);
          const prevValue = +(el.innerHTML);

          if (curValue === prevValue
            && !nextEl.classList.contains('protected')) {
            el.className = 'field-cell';
            el.innerHTML = '';
            nextEl.innerHTML = `${curValue * 2}`;
            nextEl.className = 'field-cell';

            nextEl.classList.add(
              `field-cell--${curValue * 2}`, 'active', 'protected');
            score += curValue * 2;
            gameScore.innerHTML = score;
            isFieldChanged = true;
          } else {
            nextEl.classList.add('protected');
          }
        }
      }
    }
  }

  if (isFieldChanged === true) {
    getNewCell();
  }
}

function moveRight() {
  const activeCells = document.querySelectorAll('.active');
  let isFieldChanged = false;

  activeCells.forEach(item => item.classList.remove('protected'));

  for (let i = activeCells.length - 1; i >= 0; i--) {
    const el = activeCells[i];
    const rowIndex = el.parentElement.rowIndex;
    const cellIndex = el.cellIndex;

    if (cellIndex !== 3) {
      for (let j = 3; j > cellIndex; j--) {
        const newCell = el.cloneNode(true);
        const nextEl = gameField.children[rowIndex].children[j];

        if (!nextEl.classList.contains('active')) {
          nextEl.replaceWith(newCell);
          el.className = 'field-cell';
          el.innerHTML = '';
          isFieldChanged = true;
        } else {
          const curValue = +(nextEl.innerHTML);
          const prevValue = +(el.innerHTML);

          if (curValue === prevValue
            && !nextEl.classList.contains('protected')) {
            el.className = 'field-cell';
            el.innerHTML = '';
            nextEl.innerHTML = `${curValue * 2}`;
            nextEl.className = 'field-cell';

            nextEl.classList.add(
              `field-cell--${curValue * 2}`, 'active', 'protected');
            score += curValue * 2;
            gameScore.innerHTML = score;
            isFieldChanged = true;
          } else {
            nextEl.classList.add('protected');
          }
        }
      }
    }
  }

  if (isFieldChanged === true) {
    getNewCell();
  }
}

function moveLeft() {
  const activeCells = document.querySelectorAll('.active');
  let isFieldChanged = false;

  activeCells.forEach(item => item.classList.remove('protected'));

  for (let i = 0; i < activeCells.length; i++) {
    const el = activeCells[i];
    const rowIndex = el.parentElement.rowIndex;
    const cellIndex = el.cellIndex;

    if (cellIndex !== 0) {
      for (let j = 0; j < cellIndex; j++) {
        const newCell = el.cloneNode(true);
        const nextEl = gameField.children[rowIndex].children[j];

        if (!nextEl.classList.contains('active')) {
          nextEl.replaceWith(newCell);
          el.className = 'field-cell';
          el.innerHTML = '';
          isFieldChanged = true;
        } else {
          const curValue = +(nextEl.innerHTML);
          const prevValue = +(el.innerHTML);

          if (curValue === prevValue
            && !nextEl.classList.contains('protected')) {
            el.className = 'field-cell';
            el.innerHTML = '';
            nextEl.innerHTML = `${curValue * 2}`;
            nextEl.className = 'field-cell';

            nextEl.classList.add(
              `field-cell--${curValue * 2}`, 'active', 'protected');
            score += curValue * 2;
            gameScore.innerHTML = score;
            isFieldChanged = true;
          } else {
            nextEl.classList.add('protected');
          }
        }
      }
    }
  }

  if (isFieldChanged === true) {
    getNewCell();
  }
}
