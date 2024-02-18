'use strict';

const cells = document.querySelectorAll('.field-cell');
const message = document.querySelector('.message');
const startMessage = document.getElementsByClassName("message message-start");
const win = document.getElementsByClassName('message message-win');
const lose = document.getElementsByClassName('message message-lose');
const button = document.querySelector('.button');
const gameScore = document.getElementsByClassName('game-score');

function fillCells() {
  initialState.forEach((row, i) => {
    row.forEach((value, j) => {
      const cell = cells[i * 4 + j];
      cell.textContent = value > 0 ? value : '';
      cell.className = `field-cell field-cell--${value}`;
    });
  });
}

let initialState =
  [[0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]];

let score = 0;
let stat = 'idle';
let result = [];
let row = [];
let addTwo = 2;
let canMove = false;



function  moveLeft() {
  for (let i = 0; i < initialState.length; i++) {
    row = initialState[i];
    moveCells();

    initialState[i] = result;
    result = [];
  }

    getState();
    fillCells();
    gameScore[0].innerHTML = `${score}`;
}

function  moveRight() {
  for (let i = 0; i < initialState.length; i++) {
    row = initialState[i].reverse();
    moveCells();

    initialState[i] = result.reverse();
    result = [];
  }

    getState();
    fillCells();
    gameScore[0].innerHTML = `${score}`;
}

function  moveUp() {
  for (let i = 0; i < initialState.length; i++) {
    row =
      [initialState[0][i],
      initialState[1][i],
      initialState[2][i],
      initialState[3][i]];
    moveCells();

    initialState[0][i] = result[0];
    initialState[1][i] = result[1];
    initialState[2][i] = result[2];
    initialState[3][i] = result[3];

    result =[];
  }

    getState();
    fillCells();
    gameScore[0].innerHTML = `${score}`;
}

function  moveDown() {
  for (let i = 0; i < initialState.length; i++) {
    let column =
      [initialState[0][i],
      initialState[1][i],
      initialState[2][i],
      initialState[3][i]];
    row = column.reverse();
    moveCells();

    column = result.reverse();
    initialState[0][i] = column[0];
    initialState[1][i] = column[1];
    initialState[2][i] = column[2];
    initialState[3][i] = column[3];

    result = [];
  }

    getState();
    fillCells();
    gameScore[0].innerHTML = `${score}`;
}

function  getScore() {
  return score;
}

function  getState() {
  let arrayOfZero = [];
  let countZero = 0;
  initialState.forEach((item, i) => {
    item.forEach((value, j) => {
      if (value === 0) {
        const coords = {};
        coords.x = i;
        coords.y = j;
        arrayOfZero.push(coords);
        countZero++;
      }

      if (value === 2048) {
        stat = 'win';
        win[0].classList.remove('hidden');
        canMove === false;
      }
    });
  });

  if (countZero === 0 && canMove === false) {
    stat = 'lose';
    lose[0].classList.remove('hidden');
  }

  if (canMove === true) {
    addTwoOrFour();

    if (arrayOfZero.length <= 2) {
      let addX = arrayOfZero[0].x;
      let addY = arrayOfZero[0].y;
      initialState[`${addX}`][`${addY}`] = addTwo;
      score += addTwo;
    } else {
      for (let i = 0; i < 1; i++) {
        let addX = Math.floor(Math.random() * 4);
        let addY = Math.floor(Math.random() * 4);
        const checkCompare = arrayOfZero.find(coord => {
          return coord.x === addX && coord.y === addY;
        });
        if (checkCompare === undefined) {
          i--;
        } else {
          initialState[`${addX}`][`${addY}`] = addTwo;
          score += addTwo;
        }
      }
    }
  }

  canMove = false;
  let tempor = initialState;
  console.log(tempor);

  return initialState;
}

function  getStatus() {
  return stat;
}

function  start() {
  restart();
}

function  restart() {
  stat = 'playing';
  initialState =
    [[0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]]
    ;
  score = 0;
  newAdd();
}

function  moveCells() {
  const withoutZero = row.filter((item, index) => {
    return item !== 0;
  });

  for (let j = 0; j < withoutZero.length; j++) {
    if (withoutZero[j] !== 0 && withoutZero[j] === withoutZero[j + 1]) {
      withoutZero[j] = withoutZero[j] * 2;
      withoutZero[j + 1] = withoutZero[j + 2] || 0;

      if ((j + 2) < withoutZero.length) {
        withoutZero[j + 2] = withoutZero[j + 3] || 0;
      }
      withoutZero[withoutZero.length - 1] = 0;
      result.push(withoutZero[j]);
      canMove = true;
    } else {
      result.push(withoutZero[j]);
    }
  }

  for (let i = result.length; i < 4; i++) {
    result.push(0);
  }

  if (canMove === false) {
    let checkMove = 0;
    for (const ch of row) {
      if (ch === 0) {
        checkMove++;
      }

      if (ch !== 0 && checkMove !== 0) {
        canMove = true;
      } 
    }
  }

  return result;
}

function addTwoOrFour() {
  let addTwo = 2;
  const addRandom = Math.floor(Math.random() * 10);
  if (addRandom <= 1) {
    addTwo = 4;
  }

  return addTwo;
}

function newAdd() {
  addTwoOrFour();
  let addX = Math.floor(Math.random() * 4); 
  let addY = Math.floor(Math.random() * 4);
  initialState[`${addX}`][`${addY}`] = addTwo;
  score += addTwo;

  for (let i = 0; i < 1; i++) {
    addTwoOrFour();
    let addXx = Math.floor(Math.random() * 4);
    let addYy = Math.floor(Math.random() * 4);

    if (addX === addXx || addY === addYy) {
      i--;
    } else {
      initialState[`${addXx}`][`${addYy}`] = addTwo;
      score += addTwo;
    }
  }
}

button.addEventListener('click', eventOne => {
  button.innerHTML = "Restart";
  button.className = "button restart";
  startMessage[0].classList.add('hidden');
  start();
  fillCells(initialState);
  gameScore[0].innerHTML = `${score}`;
});

document.addEventListener('keydown', eventTwo => {
  if (stat === 'playing') {
    switch (eventTwo.code) {
      case 'ArrowLeft':
        moveLeft();
        break;
      case 'ArrowRight':
        moveRight();
        break;
      case 'ArrowUp':
        moveUp();
        break;
      case 'ArrowDown':
        moveDown();
        break;
    }
  }
})
