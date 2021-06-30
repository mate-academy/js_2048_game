'use strict';

const root = document.querySelector('.container');

const allRowsField = root.querySelectorAll('tbody tr');
const btnStart = root.querySelector('.start');
const messageFooter = root.querySelector('.message-container');
const gameScore = root.querySelector('.game-score');
const widthField = allRowsField[0].children.length;

let field = [];

const createarrField = (arr, column) => {
  for (let m = 0; m < column; m++) {
    arr.push([]);

    for (let i = 0; i < widthField; i++) {
      arr[m].push([]);

      for (let count = 0; count < widthField; count++) {
        arr[m][i].push('');
      }
    }
  }
};

const updateHtml = () => {
  localStorage.setItem('fieldGame2048', JSON.stringify({field:field, score: gameScore.textContent,}));

  for (let i = 1; i <= widthField; i++) {
    [...root.querySelectorAll(`tr :nth-child(${i})`)].map((cell, index) => {
      cell.textContent = field[1][i - 1][index];
      cell.className = `field-cell field-cell--${cell.textContent}`;
    });
  }
};

const randomNumber = (min = 0, max = (widthField * widthField)) => {
  return Math.ceil(Math.random() * (max - min) + min);
};

const cauntFreeCell = () => {
  let count = 0;

  for (let i = 0; i < field[1].length; i++) {
    for (let y = 0; y < field[1][i].length; y++) {
      if (!field[1][i][y]) {
        count++;
      }
    }
  }

  return count;
};

const changeCellValue = (numberChange) => {
  for (let i = 0; i < numberChange; i++) {
    const freeCell = cauntFreeCell();

    if (freeCell < 1) {
      return;
    }

    const random = randomNumber(0, freeCell);

    const valueCell = randomNumber(0, 10) > 9 ? 4 : 2;

    let count = 0;

    for (let k = 0; k < field[1].length; k++) {
      for (let y = 0; y < field[1][k].length; y++) {
        if (!field[1][k][y]) {
          count++;

          if (count === random) {
            field[1][k][y] = valueCell;
            field[0][y][k] = valueCell;
          }
        }
      }
    }
    updateHtml();
  }
};

const changeHidden = (messegeClass) => {
  root.querySelector(`.${messegeClass}`).classList.remove('hidden');
};

const startGame = (newGame = true, startScore = 0) => {
  btnStart.textContent = 'Restart';
  btnStart.classList.add('restart');
  gameScore.textContent = startScore;

  if (newGame) {
    removeField();
    changeCellValue(2);
  }

  [...messageFooter.children].map(message => {
    message.classList.add('hidden');
  });
};

if (localStorage.getItem('fieldGame2048')) {
  const valueJsonCoocie = localStorage.getItem('fieldGame2048');
  field = JSON.parse(valueJsonCoocie).field;
  startGame(false, JSON.parse(valueJsonCoocie).score);
  updateHtml();
} else {
  createarrField(field, 2);
}

btnStart.addEventListener('click', () => startGame());

const validTwoRows = (arr, arrNext) => {
  let valid = false;

  if (arr.some((num, index) => num !== arrNext[index])) {
    valid = true;
  }

  return valid;
};

const possibilityMove = () => {
  if (cauntFreeCell() > 0) {
    return true;
  }

  for (let i = 1; i <= widthField; i++) {
    const newArrMergeX = [...field[0][i - 1]];
    const newArrMergeY = [...field[1][i - 1]];

    merge(newArrMergeX);
    merge(newArrMergeY);

    if (validTwoRows(newArrMergeX, field[0][i - 1]) ||
      validTwoRows(newArrMergeY, field[1][i - 1])) {
      return true;
    }
  }
  changeHidden('message-lose');
};

const removeField = () => {
  for (let i = 0; i < field[1].length; i++) {
    for (let y = 0; y < field[1][i].length; y++) {
      field[1][i][y] = '';
      field[0][y][i] = '';
    }
  }

  updateHtml();
};

function move(arrCell, direction, column) {
  const arrNotFreeCell = [...arrCell].filter((cell) => {
    return cell;
  });

  for (let i = 0; i < arrCell.length; i++) {
    if (i >= arrNotFreeCell.length) {
      arrCell[i] = '';
      continue;
    }

    arrCell[i] = arrNotFreeCell[i];
  }

  if (direction === 'toRight' || direction === 'toDown') {
    arrCell.reverse();
  }

  for (let i = 0; i < 4; i++) {
    field[column][i].map((num, index) => {
      field[+!column][index][i] = num;
    });
  }

  updateHtml();
};

function merge(arrCell) {
  for (let i = 1; i < arrCell.length; i++) {
    if (arrCell[i - 1] === arrCell[i] && arrCell[i]) {
      arrCell[i - 1] = +arrCell[i - 1] * 2;
      arrCell[i] = '';

      gameScore.textContent = +gameScore.textContent + (+arrCell[i - 1]);

      if (arrCell[i - 1] === '2048') {
        changeHidden('message-win');
      }
    }
  }
};

window.addEventListener('touchstart', (e) => {
  let startY = e.targetTouches['0'].clientY;
  let startX = e.targetTouches['0'].clientX;

  window.ontouchend = (event) => {
    let endX = event.changedTouches['0'].clientX;
    let endY = event.changedTouches['0'].clientY;

    if (endY - startY > 130) {
      oneSteep('ArrowDown')
    }

    if (startY - endY > 130) {
      oneSteep('ArrowUp')
    }

    if (startX - endX > 130) {
      oneSteep('ArrowLeft')
    }

    if (endX - startX > 130) {
      oneSteep('ArrowRight')
    }
  };
})


const oneSteep = (nameEvent) => {

  let validMove = false;
  let newArr;

  const startFuncMove = (row, columnField, direction = '') => {
    newArr = [...row];
    move(row, direction, columnField);
    merge(row);
    move(row, direction, columnField);

    if (validTwoRows(newArr, row)) {
      validMove = true;
    };
  };

  for (let i = 0; i < widthField; i++) {
    switch (nameEvent) {
      case 'ArrowUp':
        startFuncMove(field[1][i], 1);
        break;

      case 'ArrowDown':
        startFuncMove(field[1][i], 1, 'toDown');
        break;

      case 'ArrowLeft':
        revMatrix();
        startFuncMove(field[0][i], 0, 'toLeft');
        break;

      case 'ArrowRight':
        startFuncMove(field[0][i], 0, 'toRight');
        break;
    }
  }

  possibilityMove();

  if (validMove) {
    changeCellValue(1);
  }
};

window.addEventListener('keydown', (e) => {
  if (e.code === 'ArrowUp' || e.code === 'ArrowDown' ||
    e.code === 'ArrowLeft' || e.code === 'ArrowRight') {
    oneSteep(e.code)
  }
});

