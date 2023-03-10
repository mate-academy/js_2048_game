'use strict';

const start = document.querySelector('.start');
const restartElement = document.createElement('button');

restartElement.textContent = 'Restart';
restartElement.classList.add('button', 'restart', 'hidden');
document.querySelector('.controls').append(restartElement);

//* *****START******//

document.body.querySelector('.start').addEventListener('click', () => {
  start.classList.add('hidden');
  restartElement.classList.remove('hidden');
  document.querySelector('.message-start').classList.add('hidden');
  game();
});

document.body.querySelector('.restart').addEventListener('click', () => {
  game();
});

function game() {
  const array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let score = 0;

  setNumberInArray(array);
  setNumberInArray(array);
  putArrayInPage(array);
  showScores(score);

  function doublingLeft(arr) {
    for (let row = 0; row <= 12; row = row + 4) {
      const innerArr
        = [arr[row], arr[row + 1], arr[row + 2], arr[row + 3]];

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
        arr[row + i] = innerArr[i];
      }
    }
  }

  function doublingRight(arr) {
    for (let row = 0; row <= 12; row = row + 4) {
      const innerArr
        = [arr[row], arr[row + 1], arr[row + 2], arr[row + 3]];

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
        arr[row + i] = innerArr[i];
      }
    }
  }

  function doublingUp(arr) {
    for (let row = 0; row <= 3; row++) {
      const innerArr
        = [arr[row], arr[row + 4], arr[row + 8], arr[row + 12]];

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
        arr[row + i * 4] = innerArr[i];
      }
    }
  }

  function doublingDown(arr) {
    for (let row = 0; row <= 3; row++) {
      const innerArr
        = [arr[row], arr[row + 4], arr[row + 8], arr[row + 12]];

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
        arr[row + i * 4] = innerArr[i];
      }
    }
  }

  function putArrayInPage(arr) {
    for (let i = 0; i < 16; i++) {
      const tdElem = document.querySelectorAll('td')[i];

      tdElem.removeAttribute('class');
      tdElem.classList.add('field-cell');
      tdElem.textContent = '';

      if (arr[i] !== 0) {
        tdElem.textContent = arr[i];
        tdElem.classList.add('field-cell--' + arr[i]);
      }

      if (Number(tdElem.textContent) >= 2048) {
        document.querySelector('.message-win').classList.remove('hidden');
      }
    }
  }

  function setNumberInArray(arr) {
    let twoOrFour = Math.random() * 100;

    twoOrFour = twoOrFour <= 10 ? 4 : 2;

    for (let i = 0; i < 10000; i++) {
      const freeCell = Math.floor(Math.random() * 16);

      if (arr[freeCell] === 0) {
        arr[freeCell] = twoOrFour;

        return;
      }
    }
  }

  function showScores(sco) {
    document.querySelector('.game-score').textContent = sco;
  }

  function movingLeft(arr) {
    for (let j = 0; j < 6; j++) {
      for (let i = 15; i >= 1; i--) {
        if (i === 4 || i === 8 || i === 12) {
          continue;
        }

        if (arr[i - 1] === 0) {
          arr[i - 1] = arr[i];
          arr[i] = 0;
        }
      }
    }
  }

  function movingRight(arr) {
    for (let j = 0; j < 6; j++) {
      for (let i = 14; i >= 0; i--) {
        if (i === 3 || i === 7 || i === 11) {
          continue;
        }

        if (arr[i + 1] === 0) {
          arr[i + 1] = arr[i];
          arr[i] = 0;
        }
      }
    }
  }

  function movingUp(arr) {
    for (let j = 0; j < 6; j++) {
      for (let i = 4; i <= 15; i++) {
        if (arr[i - 4] === 0) {
          arr[i - 4] = arr[i];
          arr[i] = 0;
        }
      }
    }
  }

  function movingDown(arr) {
    for (let j = 0; j < 6; j++) {
      for (let i = 11; i >= 0; i--) {
        if (arr[i + 4] === 0) {
          arr[i + 4] = arr[i];
          arr[i] = 0;
        }
      }
    }
  }

  document.body.addEventListener('keydown', (eventFunc) => {
    if (eventFunc.key === 'ArrowUp') {
      doublingUp(array);
      movingUp(array);
      setNumberInArray(array);
      putArrayInPage(array);
      showScores(score);
    }
  });

  document.body.addEventListener('keydown', (eventFunc) => {
    if (eventFunc.key === 'ArrowDown') {
      doublingDown(array);
      movingDown(array);
      setNumberInArray(array);
      putArrayInPage(array);
      showScores(score);
    }
  });

  document.body.addEventListener('keydown', (eventFunc) => {
    if (eventFunc.key === 'ArrowLeft') {
      doublingLeft(array);
      movingLeft(array);
      setNumberInArray(array);
      putArrayInPage(array);
      showScores(score);
    }
  });

  document.body.addEventListener('keydown', (eventFunc) => {
    if (eventFunc.key === 'ArrowRight') {
      doublingRight(array);
      movingRight(array);
      setNumberInArray(array);
      putArrayInPage(array);
      showScores(score);
    }
  });
}
