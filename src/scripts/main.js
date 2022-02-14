'use strict';

const scoreInfo = document.querySelector('.game-score');
const bestScore = document.querySelector('.game-best-score');
const button = document.querySelector('.button');

const lose = document.querySelector('.message-lose');
const win = document.querySelector('.message-win');
let isStart = false;
let count = 0;
let bestCount = 0;

const currentCube = [
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
  [ 0, 0, 0, 0 ],
];

const cleareCube = () => {
  return currentCube.forEach(row => {
    for (let i = 0; i < 4; i++) {
      row[i] = 0;
    }
  });
};

const renderCube = (arr) => {
  return arr.map(row => {
    return `<tr class="field-row">
      ${row.map(cell => {
    return `<td class="field-cell ${cell > 0 ? `field-cell--${cell}` : ''}">
        ${cell > 0 ? cell : ''}
        </td>`;
  }).join('')}
    </tr>`;
  }).join('');
};

const initCube = (arr) => {
  const cube = document.querySelector('tbody');

  cube.innerHTML = `
    ${renderCube(arr)}
  `;
};

const randomCell = (val) => {
  const row = Math.floor(Math.random() * 4);
  const cell = Math.floor(Math.random() * 4);

  if (currentCube[row][cell] > 0) {
    randomCell(val);
  } else {
    currentCube[row][cell] = val;
  }
};

const randomStart = () => {
  return Math.random() < 0.1 ? 4 : 2;
};

button.addEventListener('click', () => {
  const start = document.querySelector('.message-start');

  count = 0;
  scoreInfo.textContent = count;

  cleareCube(currentCube);

  start.classList.add('hidden');
  lose.classList.add('hidden');
  win.classList.add('hidden');

  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
  isStart = true;

  randomCell(randomStart());
  randomCell(randomStart());

  initCube(currentCube);
});

const makeColumn = (num) => {
  const column = [];

  for (let i = 0; i < 4; i++) {
    column.push(currentCube[i][num]);
  }

  return column;
};

const pushToCube = (arr, index) => {
  for (let i = 0; i < 4; i++) {
    currentCube[i][index] = arr[i];
  }
};

const filterCube = (arr) => {
  for (let i = 1; i < 4; i++) {
    switch (true) {
      case arr[i] === 0:
        break;

      case arr[i] > 0:
        switch (i) {
          case 1:
            if (arr[0] === arr[1]) {
              arr[0] = arr[1] * 2;
              count += arr[0];
              arr[1] = 0;
              break;
            }

            if (arr[0] === 0) {
              arr[0] = arr[1];
              arr[1] = 0;
            }
            break;

          case 2:
            if (arr.slice(0, 2).includes(arr[2])) {
              if (arr[1] === 0) {
                arr[0] = arr[2] * 2;
                count += arr[0];
                arr[i] = 0;
                break;
              }

              if (arr[1] === arr[2]) {
                arr[1] = arr[2] * 2;
                count += arr[1];
                arr[2] = 0;
                break;
              }
              break;
            }

            if (arr[0] === 0 && arr[1] === 0) {
              arr[0] = arr[2];
              arr[2] = 0;
              break;
            }

            if (arr[1] === 0) {
              arr[1] = arr[2];
              arr[2] = 0;
              break;
            }
            break;

          case 3:
            if (arr.slice(0, 3).includes(arr[3])) {
              if (arr[2] === 0 && arr[1] === 0) {
                arr[0] = arr[3] * 2;
                count += arr[0];
                arr[3] = 0;
                break;
              }

              if (arr[2] === 0 && arr[1] === arr[3]) {
                arr[1] = arr[3] * 2;
                count += arr[1];
                arr[3] = 0;
                break;
              }

              if (arr[2] === arr[3]) {
                arr[2] = arr[3] * 2;
                count += arr[2];
                arr[3] = 0;
                break;
              }
              break;
            }

            if (arr[0] === 0 && arr[1] === 0 && arr[2] === 0) {
              arr[0] = arr[3];
              arr[3] = 0;
              break;
            }

            if (arr[1] === 0 && arr[2] === 0) {
              arr[1] = arr[3];
              arr[3] = 0;
              break;
            }

            if (arr[2] === 0) {
              arr[2] = arr[3];
              arr[3] = 0;
              break;
            }
            break;
        }
    }
  }

  return arr;
};

const pareCell = (arr) => {
  for (let i = 1; i < 3; i++) {
    if (arr[i - 1] === arr[i] || arr[i + 1] === arr[i]) {
      return;
    }
  }

  return 1;
};

const canMove = () => {
  const horizontal = [];
  const vertical = [];
  const num = currentCube.reduce((acc, row) =>
    acc + row.filter(el => el === 0).length, 0);

  if (!num) {
    currentCube.forEach(el => {
      horizontal.push(pareCell(el));
    });

    for (let i = 0; i < 4; i++) {
      const column = makeColumn(i);

      vertical.push(pareCell(column));
    }
  }

  if (horizontal.filter(el => el === 1).length === 4
    && vertical.filter(el => el === 1).length === 4) {
    lose.classList.remove('hidden');
  }
};

const areWin = () => {
  currentCube.forEach(row => {
    row.forEach(cell => {
      if (cell >= 2048) {
        win.classList.remove('hidden');
      }
    });
  });
};

const best = () => {
  if (count < bestCount) {
    return;
  }

  bestCount = count;
  bestScore.textContent = bestCount;
};

document.addEventListener('keydown', ev => {
  if (!isStart) {
    return;
  }

  if (ev.key === 'ArrowUp') {
    for (let i = 0; i < 4; i++) {
      const column = makeColumn(i);

      const filtered = filterCube(column);

      pushToCube(filtered, i);
    }

    randomCell(randomStart());
    initCube(currentCube);
  }

  if (ev.key === 'ArrowDown') {
    for (let i = 0; i < 4; i++) {
      const column = makeColumn(i);

      const filtered = filterCube(column.reverse());

      pushToCube(filtered.reverse(), i);
    }

    randomCell(randomStart());
    initCube(currentCube);
  }

  if (ev.key === 'ArrowLeft') {
    for (let i = 0; i < 4; i++) {
      const filtered = filterCube(currentCube[i]);

      currentCube[i] = filtered;
    }

    randomCell(randomStart());
    initCube(currentCube);
  }

  if (ev.key === 'ArrowRight') {
    for (let i = 0; i < 4; i++) {
      const filtered = filterCube(currentCube[i].reverse());

      currentCube[i] = filtered.reverse();
    }

    randomCell(randomStart());
    initCube(currentCube);
  }

  best();
  areWin();
  canMove();
  scoreInfo.textContent = count;
});
