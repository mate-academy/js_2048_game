'use strict';

const field = document.querySelector('tbody');
const start = document.querySelector('.game-header');
const rows = field.children;
const body = document.querySelector('body');
const score = document.querySelector('.game-score');
const starMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
let scoreValue = 0;
let gameBlock = false;
const arrayIndex = [];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getStartPoint() {
  let index;
  const arrayPoint = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];

  if (arrayIndex.length >= 10) {
    arrayIndex.length = 0;
  }

  do {
    index = getRandomInt(0, 10);
  } while (arrayIndex.includes(index));

  arrayIndex.push(index);

  return arrayPoint[index];
}

function newPoint() {
  const value = getStartPoint();
  let row;
  let column;

  if (freeCeilCount() > 0) {
    do {
      row = getRandomInt(0, 4);
      column = getRandomInt(0, 4);
    } while (rows[row].children[column].classList.value !== 'field-cell');

    rows[row].children[column].classList
    = `field-cell field-cell--${value}`;
    rows[row].children[column].innerText = value;
  }
}

function freeCeilCount() {
  let freeCeil = 16;

  [ ...rows ].forEach((row) => [ ...row.children ].forEach((column) => {
    if (column.innerText !== '') {
      freeCeil--;
    }
  }));

  return freeCeil;
}

function lose() {
  let xCount = 12;
  let yCount = 12;

  if (freeCeilCount() === 0) {
    for (let i = 0; i < 3; i++) {
      for (let n = 0; n < 4; n++) {
        if (rows[i].children[n].innerText
          !== rows[i + 1].children[n].innerText) {
          xCount--;
        }
      }
    }
  }

  if (freeCeilCount() === 0) {
    [ ...rows ].forEach((row) => {
      for (let n = 0; n < 3; n++) {
        if (row.children[n].innerText
          !== row.children[n + 1].innerText) {
          yCount--;
        }
      }
    });
  }

  if (freeCeilCount() === 0 && yCount === 0 && xCount === 0) {
    loseMessage.classList = 'message message-lose';
    gameBlock = false;
  }
}

function checkWin() {
  if (document.querySelector('.field-cell--2048')) {
    winMessage.classList = 'message message-win';
    gameBlock = false;
  }
}

start.addEventListener('click', (evnt) => {
  if (evnt.target.innerText === 'Start') {
    gameBlock = true;
    evnt.target.classList = 'button restart';
    evnt.target.innerText = 'Rerstart';
    starMessage.classList = 'message message-start hidden';
    newPoint();
    newPoint();
  }

  if (evnt.target.innerText === 'Rerstart') {
    gameBlock = true;
    evnt.target.classList = 'button restart';
    evnt.target.innerText = 'Rerstart';
    loseMessage.classList = 'message message-lose hidden';
    winMessage.classList = 'message message-win hidden';

    [ ...rows ].forEach((row) => [ ...row.children ].forEach((column) => {
      column.classList = 'field-cell';
      column.innerText = '';
    }));

    scoreValue = 0;
    score.innerText = scoreValue;

    newPoint();
    newPoint();
  }
});

function mooveDown() {
  for (let i = 3; i > 0; i--) {
    for (let n = 0; n < 4; n++) {
      if (rows[i - 1].children[n].classList.value !== 'field-cell') {
        for (let k = i - 1; k < 4; k++) {
          if (rows[k].children[n].classList.value === 'field-cell') {
            rows[k].children[n].classList = rows[i - 1].children[n].classList;
            rows[k].children[n].innerText = rows[i - 1].children[n].innerText;
            rows[i - 1].children[n].classList = 'field-cell';
            rows[i - 1].children[n].innerText = '';
          }
        }
      }
    }
  }
}

function mooveUp() {
  for (let i = 1; i < 4; i++) {
    for (let n = 0; n < 4; n++) {
      if (rows[i].children[n].classList.value !== 'field-cell') {
        for (let k = i - 1; k > -1; k--) {
          if (rows[k].children[n].classList.value === 'field-cell') {
            rows[k].children[n].classList = rows[i].children[n].classList;
            rows[k].children[n].innerText = rows[i].children[n].innerText;
            rows[i].children[n].classList = 'field-cell';
            rows[i].children[n].innerText = '';
          }
        }
      }
    }
  }
}

function mooveRight() {
  for (let i = 0; i < 4; i++) {
    for (let n = 3; n > 0; n--) {
      if (rows[i].children[n - 1].classList.value !== 'field-cell') {
        for (let k = n - 1; k < 4; k++) {
          if (rows[i].children[k].classList.value === 'field-cell') {
            rows[i].children[k].classList = rows[i].children[n - 1].classList;
            rows[i].children[k].innerText = rows[i].children[n - 1].innerText;
            rows[i].children[n - 1].classList = 'field-cell';
            rows[i].children[n - 1].innerText = '';
          }
        }
      }
    }
  }
}

function mooveLeft() {
  for (let i = 0; i < 4; i++) {
    for (let n = 1; n < 4; n++) {
      if (rows[i].children[n].classList.value !== 'field-cell') {
        for (let k = n - 1; k > -1; k--) {
          if (rows[i].children[k].classList.value === 'field-cell') {
            rows[i].children[k].classList = rows[i].children[n].classList;
            rows[i].children[k].innerText = rows[i].children[n].innerText;
            rows[i].children[n].classList = 'field-cell';
            rows[i].children[n].innerText = '';
          }
        }
      }
    }
  }
}

body.addEventListener('keydown', (evnt) => {
  if (gameBlock) {
    if (evnt.key === 'ArrowDown') {
      mooveDown();
      mooveDown();
      mooveDown();

      for (let i = 3; i > 0; i--) {
        for (let n = 0; n < 4; n++) {
          if (rows[i - 1].children[n].classList.value !== 'field-cell') {
            if (rows[i - 1].children[n].innerText
              === rows[i].children[n].innerText
              && !rows[i - 1].children[n].classList.contains('changed')) {
              const value = rows[i].children[n].innerText;

              rows[i - 1].children[n].classList = 'field-cell';
              rows[i - 1].children[n].innerText = '';

              rows[i].children[n].classList = `field-cell field-cell--`
               + `${value * 2}`;
              rows[i].children[n].innerText = value * 2;
              rows[i].children[n].name = true;
              rows[i].children[n].classList.toggle('changed', true);

              scoreValue = +score.innerText;

              scoreValue += value * 2;
              score.innerText = scoreValue;
            }
          }
        }
      }
      mooveDown();
      mooveDown();

      newPoint();
    }

    if (evnt.key === 'ArrowUp') {
      mooveUp();
      mooveUp();
      mooveUp();

      for (let i = 1; i < 4; i++) {
        for (let n = 0; n < 4; n++) {
          if (rows[i].children[n].classList.value !== 'field-cell') {
            if (rows[i].children[n].innerText
              === rows[i - 1].children[n].innerText) {
              const value = rows[i].children[n].innerText;

              if (!rows[i].children[n].classList.contains('changed')) {
                rows[i].children[n].classList = 'field-cell';
                rows[i].children[n].innerText = '';

                rows[i - 1].children[n].classList = `field-cell field-cell--`
                  + `${value * 2}`;
                rows[i - 1].children[n].innerText = value * 2;
                rows[i - 1].children[n].name = true;
                rows[i - 1].children[n].classList.toggle('changed', true);

                scoreValue = +score.innerText;

                scoreValue += value * 2;
                score.innerText = scoreValue;
              }
            }
          }
        }
      }
      mooveUp();
      mooveUp();
      newPoint();
    }

    if (evnt.key === 'ArrowRight') {
      mooveRight();
      mooveRight();
      mooveRight();

      for (let i = 0; i < 4; i++) {
        for (let n = 3; n > 0; n--) {
          if (rows[i].children[n - 1].classList.value !== 'field-cell') {
            if (rows[i].children[n - 1].innerText
              === rows[i].children[n].innerText
              && !rows[i].children[n - 1].classList.contains('changed')) {
              const value = rows[i].children[n].innerText;

              rows[i].children[n - 1].classList = 'field-cell';
              rows[i].children[n - 1].innerText = '';

              rows[i].children[n].classList = `field-cell field-cell--`
               + `${value * 2}`;
              rows[i].children[n].innerText = value * 2;
              rows[i].children[n].name = true;
              rows[i].children[n].classList.toggle('changed', true);

              scoreValue = +score.innerText;

              scoreValue += value * 2;
              score.innerText = scoreValue;
            }
          }
        }
      }
      mooveRight();
      mooveRight();

      newPoint();
    }

    if (evnt.key === 'ArrowLeft') {
      mooveLeft();
      mooveLeft();
      mooveLeft();

      for (let i = 0; i < 4; i++) {
        for (let n = 1; n < 4; n++) {
          if (rows[i].children[n - 1].classList.value !== 'field-cell') {
            if (rows[i].children[n - 1].innerText
              === rows[i].children[n].innerText
              && !rows[i].children[n - 1].classList.contains('changed')) {
              const value = rows[i].children[n].innerText;

              rows[i].children[n - 1].classList = 'field-cell';
              rows[i].children[n - 1].innerText = '';

              rows[i].children[n].classList = `field-cell field-cell--`
               + `${value * 2}`;
              rows[i].children[n].innerText = value * 2;
              rows[i].children[n].name = true;
              rows[i].children[n].classList.toggle('changed', true);

              scoreValue = +score.innerText;

              scoreValue += value * 2;
              score.innerText = scoreValue;
            }
          }
        }
      }
      mooveLeft();
      mooveLeft();

      newPoint();
    }

    const changed = document.querySelectorAll('.changed');

    if (changed.length > 0) {
      for (let i = 0; i < changed.length; i++) {
        changed[i].classList.toggle('changed', false);
      }
    }

    lose();
    checkWin();
  }
});
