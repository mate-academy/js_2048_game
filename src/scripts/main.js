'use strict';

const field = document.querySelector('.game-field').firstElementChild;
const cellList = document.querySelectorAll('TD');
const startButton = document.querySelector('.start');
const score = document.querySelector('.game-score');
const rows = [...field.rows].reduce((res, el, index) => {
  if (!res[index]) {
    res[index] = [];
  };

  [...el.children].forEach((item) => {
    res[index].push(item);
  });

  return res;
}, []);
const cols = [...field.rows].reduce((res, el) => {
  [...el.children].forEach((item, index) => {
    if (!res[index]) {
      res[index] = [];
    };

    res[index].push(item);
  });

  return res;
}, []);

startButton.onclick = e => {
  if (!startButton.toggle) {
    document.addEventListener('keydown', game);
    showMessage();
    start();
    startButton.innerText = 'Restart';
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.toggle = !startButton.toggle;
  } else {
    document.removeEventListener('keydown', game);
    document.addEventListener('keydown', game);
    score.innerText = 0;
    cellList.forEach(el => (el.innerText = ''));
    start();
    showMessage();
  }
};

function game(e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    move(rows, e.key);
  };

  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    move(cols, e.key);
  };

  addNewNumber(rows);
  classHandler();
}

function move(arr, direction) {
  arr.forEach(el => {
    let clear = getClearArray(el);

    for (let i = clear.length; i > 0; i--) {
      if (clear[i - 1] && clear[i] === clear[i - 1]) {
        clear[i] = +clear[i] + +clear[i - 1];
        clear[i - 1] = '';
      };
    }

    clear = clear.filter(item => {
      if (item) {
        return item;
      }
    });

    if (direction === 'ArrowRight' || direction === 'ArrowDown') {
      for (let index = el.length - 1; index >= 0; index--) {
        if (clear.length) {
          el[index].innerText = clear.pop();
        } else {
          el[index].innerText = '';
        }
      }
    }

    if (direction === 'ArrowLeft' || direction === 'ArrowUp') {
      for (let ind = 0; ind < el.length; ind++) {
        if (clear.length) {
          el[ind].innerText = clear.shift();
        } else {
          el[ind].innerText = '';
        }
      }
    }
  });

  classHandler();

  cellList.forEach(el => {
    if (+el.innerText === 2048) {
      showMessage('win');
    }
  });
};

function findEmptyCell(arr) {
  const result = [];

  arr.forEach(el => {
    el.forEach(cell => {
      if (!cell.innerText) {
        result.push(cell);
      }
    });
  });

  return result;
};

function randomCell(max) {
  return Math.floor(Math.random() * max);
};

function addNewNumber(array) {
  const emptyCells = findEmptyCell(array);
  const position = randomCell(emptyCells.length);
  let number = randomCell(10);

  if (number <= 1) {
    number = 4;
  } else {
    number = 2;
  }

  try {
    emptyCells[position].innerText = number;
    score.innerText = +score.innerText + +number;
  } catch (error) {
    document.removeEventListener('keydown', game);
    showMessage('lose');
  }
};

function getClearArray(arr = []) {
  const result = [];

  arr.forEach(el => {
    if (el.innerText) {
      result.push(el.innerText);
    }
  });

  return result;
};

function classHandler() {
  cellList.forEach(el => {
    while (el.classList.length > 0) {
      el.classList.remove(el.classList.item(0));
    }
    el.classList.add(`field-cell`);

    if (el.innerText) {
      el.classList.add(`field-cell--${el.innerText}`);
    }
  });
};

function start() {
  addNewNumber(rows);
  addNewNumber(rows);
  classHandler();
};

function showMessage(type) {
  const allMsg = document.querySelectorAll('.message');

  if (!type) {
    allMsg.forEach(el => el.classList.add('hidden'));

    return;
  }

  const msg = document.querySelector(`.message-${type}`);

  allMsg.forEach(el => el.classList.add('hidden'));
  msg.classList.remove('hidden');
};
