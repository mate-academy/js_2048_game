'use strict';

const restartElement = document.createElement('button');

restartElement.textContent = 'Restart';
restartElement.classList.add('button', 'restart', 'hidden');
document.querySelector('.controls').append(restartElement);

// *********************** START ************************ //

document.body.querySelector('.start').addEventListener('click', () => {
  document.querySelector('.start').classList.add('hidden');
  restartElement.classList.remove('hidden');
  document.querySelector('.message-start').classList.add('hidden');
  game();
});

document.body.querySelector('.restart').addEventListener('click', () => {
  document.querySelector('.message-win').classList.add('hidden');
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
    }
  }

  function winCheck(arr) {
    const max = Math.max.apply(null, arr);
    const element = document.querySelector('.message-win').classList;

    if (max >= 2048) {
      element.remove('hidden');
    } else {
      element.add('hidden');
    }
  }

  function lossCheck(arr) {
    const zeroCount = arr.includes(0);
    let mirrors = 0;

    for (let i = 0; i <= 3; i++) {
      for (let j = 0; j <= 8; j = j + 4) {
        if (arr[i + j] === arr[i + j + 4]) {
          mirrors++;
        }
      }
    }

    for (let i = 0; i <= 12; i = i + 4) {
      for (let j = 0; j <= 2; j++) {
        if (arr[i + j] === arr[i + j + 1]) {
          mirrors++;
        }
      }
    }

    if (mirrors === 0 && zeroCount === false) {
      document.querySelector('.message-lose').classList.remove('hidden');
    } else {
      document.querySelector('.message-lose').classList.add('hidden');
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

  // ***************** moving and dubling function **************** //
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

  function canMoveUp(arr) {
    for (let i = 4; i <= 7; i++) {
      for (let j = 0; j <= 8; j = j + 4) {
        const firstNum = arr[i + j];
        const secondNum = arr[i + j - 4];

        if ((firstNum !== 0) && (firstNum === secondNum || secondNum === 0)) {
          return true;
        }
      }
    }

    return false;
  }

  function canMoveDown(arr) {
    for (let i = 8; i <= 11; i++) {
      for (let j = 0; j <= 8; j = j + 4) {
        const firstNum = arr[i - j];
        const secondNum = arr[i - j + 4];

        if ((firstNum !== 0) && (firstNum === secondNum || secondNum === 0)) {
          return true;
        }
      }
    }

    return false;
  }

  function canMoveLeft(arr) {
    for (let i = 1; i <= 13; i = i + 4) {
      for (let j = 0; j <= 2; j++) {
        const firstNum = arr[i + j];
        const secondNum = arr[i + j - 1];

        if ((firstNum !== 0) && (firstNum === secondNum || secondNum === 0)) {
          return true;
        }
      }
    }

    return false;
  }

  function canMoveRight(arr) {
    for (let i = 2; i <= 14; i = i + 4) {
      for (let j = 0; j <= 2; j++) {
        const firstNum = arr[i - j];
        const secondNum = arr[i - j + 1];

        if ((firstNum !== 0) && (firstNum === secondNum || secondNum === 0)) {
          return true;
        }
      }
    }

    return false;
  }

  function completeForMoving() {
    putArrayInPage(array);
    showScores(score);
    winCheck(array);
    lossCheck(array);
  }

  // ***************** events: up down left right **************** //
  document.body.addEventListener('keydown', (eventFunc) => {
    if (eventFunc.key === 'ArrowUp') {
      if (canMoveUp(array) === true) {
        movingUp(array);
        doublingUp(array);
        movingUp(array);
        setNumberInArray(array);
      }
      completeForMoving();
    }
  });

  document.body.addEventListener('keydown', (eventFunc) => {
    if (eventFunc.key === 'ArrowDown') {
      if (canMoveDown(array) === true) {
        movingDown(array);
        doublingDown(array);
        movingDown(array);
        setNumberInArray(array);
      }
      completeForMoving();
    }
  });

  document.body.addEventListener('keydown', (eventFunc) => {
    if (eventFunc.key === 'ArrowLeft') {
      if (canMoveLeft(array) === true) {
        movingLeft(array);
        doublingLeft(array);
        movingLeft(array);
        setNumberInArray(array);
      }
      completeForMoving();
    }
  });

  document.body.addEventListener('keydown', (eventFunc) => {
    if (eventFunc.key === 'ArrowRight') {
      if (canMoveRight(array) === true) {
        movingRight(array);
        doublingRight(array);
        movingRight(array);
        setNumberInArray(array);
      }
      completeForMoving();
    }
  });
}
