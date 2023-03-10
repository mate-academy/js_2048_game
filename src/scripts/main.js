'use strict';

const start = document.querySelector('.start');
const restartElement = document.createElement('button');

restartElement.textContent = 'Restart';
restartElement.classList.add('button', 'restart', 'hidden');
document.querySelector('.controls').append(restartElement);

// ******START****** //

document.body.querySelector('.start').addEventListener('click', () => {
  start.classList.add('hidden');
  restartElement.classList.remove('hidden');
  document.querySelector('.message-start').classList.add('hidden');
  game();
});

document.body.querySelector('.restart').addEventListener('click', () => {
  document.querySelector('.message-lose').classList.add('hidden');
  game();
});

function game() {
  const array = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let score = 0;

  setNumberInArray(array);
  setNumberInArray(array);
  putArrayInPage(array);
  showScores(score);

  function putArrayInPage(arr) {
    document.querySelectorAll('td').forEach((item) => {
      item.removeAttribute('class');
      item.classList.add('field-cell');
      item.textContent = '';
    });

    for (let i = 0; i < 16; i++) {
      const tdElem = document.querySelectorAll('td')[i];

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

    for (let i = 0; i < 100000; i++) {
      const freeCell = Math.floor(Math.random() * 16);

      if (arr[freeCell] === 0) {
        arr[freeCell] = twoOrFour;

        return;
      }
    }
    document.querySelector('.message-lose').classList.remove('hidden');
  }

  function showScores(sco) {
    document.querySelector('.game-score').textContent = sco;
  }

  function doublingLeft(arr) {
    for (let row = 0; row <= 12; row = row + 4) {
      for (let i = 0; i <= 2; i++) {
        if (arr[i + row] === arr[i + row + 1]) {
          arr[i + row] = arr[i + row] * 2;
          score = score + arr[i + row];
          arr[i + row + 1] = 0;
        }
      }
    }
  }

  function doublingRight(arr) {
    for (let row = 0; row <= 12; row = row + 4) {
      for (let i = 2; i >= 0; i--) {
        if (arr[i + row] === arr[i + row + 1]) {
          arr[i + row + 1] = arr[i + row + 1] * 2;
          score = score + arr[i + row + 1];
          arr[i + row] = 0;
        }
      }
    }
  }

  function doublingUp(arr) {
    for (let row = 0; row <= 3; row++) {
      for (let i = 0; i <= 12; i = i + 4) {
        if (arr[row + i] === arr[row + i + 4]) {
          arr[row + i] = arr[row + i] * 2;
          score = score + arr[row + i];
          arr[row + i + 4] = 0;
        }
      }
    }
  }

  function doublingDown(arr) {
    for (let row = 0; row <= 3; row++) {
      for (let i = 12; i >= 0; i = i - 4) {
        if (arr[row + i] === arr[row + i - 4]) {
          arr[row + i] = arr[row + i] * 2;
          score = score + arr[row + i];
          arr[row + i - 4] = 0;
        }
      }
    }
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
      movingUp(array);
      doublingUp(array);
      movingUp(array);
      setNumberInArray(array);
      putArrayInPage(array);
      showScores(score);
    }
  });

  document.body.addEventListener('keydown', (eventFunc) => {
    if (eventFunc.key === 'ArrowDown') {
      movingDown(array);
      doublingDown(array);
      movingDown(array);
      setNumberInArray(array);
      putArrayInPage(array);
      showScores(score);
    }
  });

  document.body.addEventListener('keydown', (eventFunc) => {
    if (eventFunc.key === 'ArrowLeft') {
      movingLeft(array);
      doublingLeft(array);
      movingLeft(array);
      setNumberInArray(array);
      putArrayInPage(array);
      showScores(score);
    }
  });

  document.body.addEventListener('keydown', (eventFunc) => {
    if (eventFunc.key === 'ArrowRight') {
      movingRight(array);
      doublingRight(array);
      movingRight(array);
      setNumberInArray(array);
      putArrayInPage(array);
      showScores(score);
    }
  });
}
