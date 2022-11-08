'use strict';

const score = document.querySelector('.game-score');
const start = document.querySelector('.start');
const message = document.querySelector('.message-container');
const row = document.querySelectorAll('.field-row');
const cells = document.querySelectorAll('.field-cell');

const styleCells = () => {
  const regx = new RegExp('\\b' + 'field-cell--' + '[^ ]*[ ]?\\b', 'g');

  cells.forEach(item => {
    if (item.innerText === ''
    || !item.classList.contains(`field-cell--${item.innerText}`)) {
      item.className = item.className.replace(regx, '');
    }

    if (item.innerText !== '') {
      item.classList.add(`field-cell--${item.innerText}`);
    }
  });
};

const animateCells = (item, animate) => {
  const scaleTo = 'scale(1.2,1.2)';
  const defaultScale = 'scale(1,1)';
  const transition = '.3s transform';

  if (animate) {
    item.style.transform = scaleTo;
    item.style.transition = transition;
  } else {
    item.style.transform = defaultScale;
  }

  setTimeout(() => {
    item.style.transform = defaultScale;
  }, 200);
};

const randomCell = (min, max) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

const finish = () => {
  return [...cells].every(item => item.innerText !== '');
};

const addCellNumber = () => {
  if (finish() === false) {
    const number = Math.random() > 0.9 ? 4 : 2;
    let index = randomCell(0, 15);

    if (cells[index].innerText) {
      while (cells[index].innerText !== '') {
        index = randomCell(0, 15);
      }
    }
    cells[index].innerText = number;
  } else {
    message.children[0].classList.remove('hidden');
  }
};

const congratulation = () => {
  if (score.innerText >= 2048) {
    message.children[1].classList.remove('hidden');
  }
};

const cellsSorting = (direction) => {
  const gameArr = [];
  const cellArr = [];

  for (let i = 0; i <= 3; i++) {
    for (let k = 0; k <= 3; k++) {
      if (direction === 'up' || direction === 'down') {
        cellArr.push(row[k].children[i].innerText);
      } else {
        cellArr.push(row[i].children[k].innerText);
      }
    }
    gameArr.push([...cellArr]);
    cellArr.splice(0, 4);
  }

  for (let i = 0; i <= gameArr.length - 1; i++) {
    for (let k = gameArr.length - 1; k >= 0; k--) {
      const empty = '';
      let index;

      if (direction === 'up' || direction === 'left') {
        index = gameArr[i].indexOf('');
      } else {
        index = gameArr[i].lastIndexOf('');
      }

      if (gameArr[i].includes('')) {
        gameArr[i].splice(index, 1);

        if (direction === 'up' || direction === 'left') {
          index = gameArr[i].push(empty);
        } else {
          index = gameArr[i].unshift(empty);
        }
      }
    }
  }

  for (let i = 0; i <= 3; i++) {
    row.forEach((item, index) => {
      if (direction === 'up' || direction === 'down') {
        item.children[i].innerText = gameArr[i][index];
      } else {
        item.children[i].innerText = gameArr[index][i];
      }
    });
  }
  gameArr.splice(0, 4);
};

const moveUp = () => {
  for (let i = 0; i <= 3; i++) {
    for (let k = 0; k <= 3; k++) {
      if (!row[k + 1]) {
        break;
      };

      if (row[k].children[i].innerText.length
        && row[k].children[i].innerText === row[k + 1].children[i].innerText) {
        row[k].children[i].innerText = row[k].children[i].innerText * 2;
        row[k + 1].children[i].innerText = '';
        score.innerText = +score.innerText + +row[k].children[i].innerText;
        animateCells(row[k].children[i], true);

        if (row[k - 1] && row[k - 1].children[i].innerText === '') {
          animateCells(row[k].children[i], false);
          animateCells(row[k - 1].children[i], true);
        }
      }
    }
  }
};

const moveDown = () => {
  for (let i = 3; i >= 0; i--) {
    for (let k = 3; k >= 0; k--) {
      if (!row[k - 1]) {
        break;
      };

      if (row[k].children[i].innerText.length
        && row[k].children[i].innerText === row[k - 1].children[i].innerText) {
        row[k].children[i].innerText = row[k].children[i].innerText * 2;
        row[k - 1].children[i].innerText = '';
        score.innerText = +score.innerText + +row[k].children[i].innerText;
        animateCells(row[k].children[i], true);

        if (row[k + 1] && row[k + 1].children[i].innerText === '') {
          animateCells(row[k].children[i], false);
          animateCells(row[k + 1].children[i], true);
        }
      }
    }
  }
};

const moveLeft = () => {
  for (let i = 0; i <= 3; i++) {
    for (let k = 3; k >= 0; k--) {
      if (!row[i].children[k - 1]) {
        break;
      };

      if (row[i].children[k].innerText.length
        && row[i].children[k].innerText === row[i].children[k - 1].innerText) {
        row[i].children[k].innerText = row[i].children[k].innerText * 2;
        row[i].children[k - 1].innerText = '';
        score.innerText = +score.innerText + +row[i].children[k].innerText;
        animateCells(row[i].children[k], true);

        if (row[i].children[k - 1].innerText === '') {
          animateCells(row[i].children[k], false);
          animateCells(row[i].children[k - 1], true);
        }
      }
    }
  }
};

const moveRight = () => {
  for (let i = 0; i <= 3; i++) {
    for (let k = 0; k <= 3; k++) {
      if (!row[i].children[k + 1]) {
        break;
      };

      if (row[i].children[k].innerText.length
        && row[i].children[k].innerText === row[i].children[k + 1].innerText) {
        row[i].children[k].innerText = row[i].children[k].innerText * 2;
        row[i].children[k + 1].innerText = '';
        score.innerText = +score.innerText + +row[i].children[k].innerText;
        animateCells(row[i].children[k], true);

        if (row[i].children[k + 1].innerText === '') {
          animateCells(row[i].children[k], false);
          animateCells(row[i].children[k + 1], true);
        }
      }
    }
  }
};

start.addEventListener('click', () => {
  cells.forEach(item => {
    item.innerText = '';
  });
  addCellNumber();
  addCellNumber();
  styleCells();
  start.innerText = 'Restart';
  score.innerText = 0;
  start.classList.add('restart');
  start.classList.remove('start');

  [...message.children].forEach(item => {
    item.classList.add('hidden');
  });
});

document.addEventListener('keydown', (e) => {
  e.preventDefault();

  switch (e.key) {
    case 'ArrowUp':
      cellsSorting('up');
      moveUp();
      cellsSorting('up');
      break;

    case 'ArrowDown':
      cellsSorting('down');
      moveDown();
      cellsSorting('down');
      break;

    case 'ArrowRight':
      cellsSorting('right');
      moveRight();
      cellsSorting('right');
      break;

    case 'ArrowLeft':
      cellsSorting('left');
      moveLeft();
      cellsSorting('left');
      break;
  }
  addCellNumber();
  styleCells();
  congratulation();
});
