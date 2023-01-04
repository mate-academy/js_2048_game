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

const animateCells = (item, animate, newOne = false) => {
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
  }
};

const gameOver = () => {
  let canMove = false;

  [...row].forEach((item, index, arr) => {
    for (let i = 0; i <= 3; i++) {
      if (!arr[index].children[i + 1] || !arr[i + 1]) {
        break;
      }

      if (arr[index].children[i].innerText
        === arr[index].children[i + 1].innerText
        || arr[i].children[index].innerText
        === arr[i + 1].children[index].innerText) {
        canMove = true;

        return;
      }
    }
  });

  if (!canMove) {
    message.children[0].classList.remove('hidden');
  }
};

const congratulation = () => {
  const winner = [...cells].some(item => item.innerText >= 2048);

  if (winner) {
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

const movingDirection = (direction, of, to) => {
  let next;
  let prev;

  if (direction === 'UP' || direction === 'RIGHT') {
    next = to + 1;
    prev = to - 1;
  }

  if (direction === 'DOWN' || direction === 'LEFT') {
    next = to - 1;
    prev = to + 1;
  }

  if (direction === 'UP' || direction === 'DOWN') {
    if (row[to].children[of].innerText.length
      && row[to].children[of].innerText === row[next].children[of].innerText) {
      row[to].children[of].innerText = row[to].children[of].innerText * 2;
      row[next].children[of].innerText = '';
      score.innerText = +score.innerText + +row[to].children[of].innerText;
      animateCells(row[to].children[of], true);

      if (row[prev] && row[prev].children[of].innerText === '') {
        animateCells(row[to].children[of], false);
        animateCells(row[prev].children[of], true);
      }
    }
  }

  if (direction === 'LEFT' || direction === 'RIGHT') {
    if (row[of].children[to].innerText.length
      && row[of].children[to].innerText === row[of].children[next].innerText) {
      row[of].children[to].innerText = row[of].children[to].innerText * 2;
      row[of].children[next].innerText = '';
      score.innerText = +score.innerText + +row[of].children[to].innerText;
      animateCells(row[of].children[to], true);

      if (row[of].children[next].innerText === '') {
        animateCells(row[of].children[to], false);
        animateCells(row[of].children[next], true);
      }
    }
  }
};

const moveUp = () => {
  cellsSorting('up');

  for (let i = 0; i <= 3; i++) {
    for (let k = 0; k <= 3; k++) {
      if (!row[k + 1]) {
        break;
      };

      movingDirection('UP', i, k);
    }
  }

  cellsSorting('up');
};

const moveDown = () => {
  cellsSorting('down');

  for (let i = 3; i >= 0; i--) {
    for (let k = 3; k >= 0; k--) {
      if (!row[k - 1]) {
        break;
      };

      movingDirection('DOWN', i, k);
    }
  }

  cellsSorting('down');
};

const moveLeft = () => {
  cellsSorting('left');

  for (let i = 0; i <= 3; i++) {
    for (let k = 3; k >= 0; k--) {
      if (!row[i].children[k - 1]) {
        break;
      };

      movingDirection('LEFT', i, k);
    }
  }

  cellsSorting('left');
};

const moveRight = () => {
  cellsSorting('right');

  for (let i = 0; i <= 3; i++) {
    for (let k = 0; k <= 3; k++) {
      if (!row[i].children[k + 1]) {
        break;
      };

      movingDirection('RIGHT', i, k);
    }
  }

  cellsSorting('right');
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

  if (start.classList.contains('restart')) {
    switch (e.key) {
      case 'ArrowUp':
        moveUp();
        break;

      case 'ArrowDown':
        moveDown();
        break;

      case 'ArrowRight':
        moveRight();
        break;

      case 'ArrowLeft':
        moveLeft();
        break;
    }
    addCellNumber();
    styleCells();
    congratulation();

    if (finish() === true) {
      gameOver();
    }
  }
});
