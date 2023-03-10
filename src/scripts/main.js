'use strict';

const tdElements = document.querySelectorAll('td');

const array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

function putArrayInPage(arr) {
  for (let i = 0; i < 16; i++) {
    tdElements[i].removeAttribute('class');
    tdElements[i].classList.add('field-cell');
    tdElements[i].textContent = '';

    if (arr[i] !== 0) {
      tdElements[i].textContent = arr[i];
      tdElements[i].classList.add('field-cell--' + arr[i]);
    }
  }
}

function setNumberInArray() {
  let random = Math.random() * 100;

  random = random <= 10 ? 4 : 2;

  for (let i = 0; i < 10000; i++) {
    const x = Math.floor(Math.random() * 16);

    if (array[x] === 0) {
      array[x] = random;

      return;
    }
  }
}

setNumberInArray();
setNumberInArray();
putArrayInPage(array);

let score = 0;

function doublingLeft() {
  for (let row = 0; row <= 12; row = row + 4) {
    const innerArr
      = [array[row], array[row + 1], array[row + 2], array[row + 3]];

    for (let i = 0; i < innerArr.length; i++) {
      if (innerArr[i] === innerArr[i + 1]) {
        innerArr[i] = innerArr[i] * 2 + 0.1;
        score = score + Math.floor(innerArr[i]);
        innerArr[i + 1] = 0;
        continue;
      }

      if (innerArr[i] === innerArr[i + 3]
        && innerArr[i + 1] === 0
        && innerArr[i + 2] === 0) {
        innerArr[i] = innerArr[i] * 2 + 0.1;
        score = score + Math.floor(innerArr[i]);
        innerArr[i + 3] = 0;
        continue;
      }

      if (innerArr[i] === innerArr[i + 2] && innerArr[i + 1] === 0) {
        innerArr[i] = innerArr[i] * 2 + 0.1;
        score = score + Math.floor(innerArr[i]);
        innerArr[i + 2] = 0;
      }
    }

    for (let i = 0; i < innerArr.length; i++) {
      innerArr[i] = Math.floor(innerArr[i]);
      array[row + i] = innerArr[i];
    }
  }
} // done

function movingLeft() {
  for (let j = 0; j < 6; j++) {
    for (let i = 15; i >= 1; i--) {
      if (i === 4 || i === 8 || i === 12) {
        continue;
      }

      if (array[i - 1] === 0) {
        array[i - 1] = array[i];
        array[i] = 0;
      }
    }
  }
}

function doublingRight() {
  for (let row = 0; row <= 12; row = row + 4) {
    const innerArr
      = [array[row], array[row + 1], array[row + 2], array[row + 3]];

    for (let i = innerArr.length - 1; i >= 0; i--) {
      if (innerArr[i] === innerArr[i - 1]) {
        innerArr[i] = innerArr[i] * 2 + 0.1;
        score = score + Math.floor(innerArr[i]);
        innerArr[i - 1] = 0;
        continue;
      }

      if (innerArr[i] === innerArr[i - 3]
        && innerArr[i - 1] === 0
        && innerArr[i - 2] === 0) {
        innerArr[i] = innerArr[i] * 2 + 0.1;
        score = score + Math.floor(innerArr[i]);
        innerArr[i - 3] = 0;
        continue;
      }

      if (innerArr[i] === innerArr[i - 2] && innerArr[i - 1] === 0) {
        innerArr[i] = innerArr[i] * 2 + 0.1;
        score = score + Math.floor(innerArr[i]);
        innerArr[i - 2] = 0;
      }
    }

    for (let i = 0; i < innerArr.length; i++) {
      innerArr[i] = Math.floor(innerArr[i]);
      array[row + i] = innerArr[i];
    }
  }
}

function movingRight() {
  for (let j = 0; j < 6; j++) {
    for (let i = 14; i >= 0; i--) {
      if (i === 3 || i === 7 || i === 11) {
        continue;
      }

      if (array[i + 1] === 0) {
        array[i + 1] = array[i];
        array[i] = 0;
      }
    }
  }
}

function doublingUp() {
  for (let row = 0; row <= 3; row++) {
    const innerArr
      = [array[row], array[row + 4], array[row + 8], array[row + 12]];

    for (let i = 0; i < innerArr.length; i++) {
      if (innerArr[i] === innerArr[i + 1]) {
        innerArr[i] = innerArr[i] * 2 + 0.1;
        score = score + Math.floor(innerArr[i]);
        innerArr[i + 1] = 0;
        continue;
      }

      if (innerArr[i] === innerArr[i + 3]
        && innerArr[i + 1] === 0
        && innerArr[i + 2] === 0) {
        innerArr[i] = innerArr[i] * 2 + 0.1;
        score = score + Math.floor(innerArr[i]);
        innerArr[i + 3] = 0;
        continue;
      }

      if (innerArr[i] === innerArr[i + 2] && innerArr[i + 1] === 0) {
        innerArr[i] = innerArr[i] * 2 + 0.1;
        score = score + Math.floor(innerArr[i]);
        innerArr[i + 2] = 0;
      }
    }

    for (let i = 0; i < innerArr.length; i++) {
      innerArr[i] = Math.floor(innerArr[i]);
      array[row + i * 4] = innerArr[i];
    }
  }
}

function movingUp() {
  for (let j = 0; j < 6; j++) {
    for (let i = 4; i <= 15; i++) {
      if (array[i - 4] === 0) {
        array[i - 4] = array[i];
        array[i] = 0;
      }
    }
  }
}

function doublingDown() {
  for (let row = 0; row <= 3; row++) {
    const innerArr
      = [array[row], array[row + 4], array[row + 8], array[row + 12]];

    for (let i = innerArr.length - 1; i >= 0; i--) {
      if (innerArr[i] === innerArr[i - 1]) {
        innerArr[i] = innerArr[i] * 2 + 0.1;
        score = score + Math.floor(innerArr[i]);
        innerArr[i - 1] = 0;
        continue;
      }

      if (innerArr[i] === innerArr[i - 3]
        && innerArr[i - 1] === 0
        && innerArr[i - 2] === 0) {
        innerArr[i] = innerArr[i] * 2 + 0.1;
        score = score + Math.floor(innerArr[i]);
        innerArr[i - 3] = 0;
        continue;
      }

      if (innerArr[i] === innerArr[i + 2] && innerArr[i + 1] === 0) {
        innerArr[i] = innerArr[i] * 2 + 0.1;
        score = score + Math.floor(innerArr[i]);
        innerArr[i + 2] = 0;
      }
    }

    for (let i = 0; i < innerArr.length; i++) {
      innerArr[i] = Math.floor(innerArr[i]);
      array[row + i * 4] = innerArr[i];
    }
  }
}

function movingDown() {
  for (let j = 0; j < 6; j++) {
    for (let i = 11; i >= 0; i--) {
      if (array[i + 4] === 0) {
        array[i + 4] = array[i];
        array[i] = 0;
      }
    }
  }
}// done

document.body.addEventListener('keydown', (eventFunc) => {
  if (eventFunc.key === 'ArrowUp') {
    doublingUp();
    movingUp();
    setNumberInArray();
    putArrayInPage(array);
    document.querySelector('.game-score').textContent = score;
  }
});

document.body.addEventListener('keydown', (eventFunc) => {
  if (eventFunc.key === 'ArrowDown') {
    doublingDown();
    movingDown();
    setNumberInArray();
    putArrayInPage(array);
    document.querySelector('.game-score').textContent = score;
  }
});

document.body.addEventListener('keydown', (eventFunc) => {
  if (eventFunc.key === 'ArrowLeft') {
    doublingLeft();
    movingLeft();
    setNumberInArray();
    putArrayInPage(array);
    document.querySelector('.game-score').textContent = score;
  }
});

document.body.addEventListener('keydown', (eventFunc) => {
  if (eventFunc.key === 'ArrowRight') {
    doublingRight();
    movingRight();
    setNumberInArray();
    putArrayInPage(array);
    document.querySelector('.game-score').textContent = score;
  }
});
