'use strict';

// const scoreBlock = document.querySelector('.game-score');
const btnStart = document.querySelector('.start');
// const allRow = document.querySelectorAll('.field-row');
const tbody = document.querySelector('tbody');
const message = document.querySelector('.message-start');

const block = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

let start = false;
// let scoreValue = 0;

window.addEventListener('keydown', (e) => {
  if (start) {
    switch (e.key) {
      case 'ArrowUp':
        return getUp();

      case 'ArrowDown':
        return getDown();

      case 'ArrowLeft':
        return getLeft();

      case 'ArrowRight':
        return getRight();

      default:
    }
  }
});

function updateNewValue() {
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  for (let l = 0; l < block.length; l++) {
    const row = document.createElement('tr');

    row.classList.add('field-row');

    for (let k = 0; k < block[l].length; k++) {
      const cell = document.createElement('td');

      cell.classList.add('field-cell');

      if (block[l][k] > 1) {
        cell.classList.add(`field-cell--${block[l][k]}`);
        cell.innerText = `${block[l][k]}`;
      }

      row.appendChild(cell);
    }

    tbody.appendChild(row);
  }
}

btnStart.addEventListener('click', () => {
  start = !start;
  btnStart.classList.toggle('restart');
  btnStart.classList.toggle('start');
  message.classList.toggle('hidden');
  btnStart.innerText = start ? 'Restart' : 'Start';

  if (!start) {
    getRestart();
  }

  getStart();
});

function addNewValue() {
  const randomValue = Math.ceil(Math.random() * 100);
  const randomRow = Math.ceil(Math.random() * 4) - 1;
  const randomCell = Math.ceil(Math.random() * 4) - 1;

  if (block[randomRow][randomCell] === 0) {
    block[randomRow][randomCell] = randomValue >= 90 ? 4 : 2;
  } else {
    addNewValue();
  }

  updateNewValue();
}

function getStart() {
  if (start) {
    addNewValue();
    addNewValue();
  }
}

function getRestart() {
  for (let i = 0; i < block.length; i++) {
    for (let q = 0; q < block[i].length; q++) {
      block[i][q] = 0;
    }
  }

  updateNewValue();
}

function getUp() {
  for (let i = 0; i < block.length; i++) {
    for (let q = 0; q < block[i].length; q++) {
      const value = block[q][i];//  2 = 1 1

      if (value !== 0) {
        if (q !== 0) {
          let k = q - 1;

          while (k > 0 && block[k][i] === 0) {
            k--;
          }

          if (block[k][i] === block[q][i]) {
            block[k][i] += block[q][i];
            block[q][i] = 0;
          } else if (block[k][i] === 0) {
            block[k][i] += block[q][i];
            block[q][i] = 0;
          } else {
            if (block[k + 1][i] !== block[q][i] && k + 1 !== q) {
              block[q][i] = 0;
            }
            block[k + 1][i] = block[q][i];
          }
        }
      }
    }
  }
  addNewValue();
}

function getDown() {

}

function getLeft() {

}

function getRight() {

}
