'use strict';

const field = document.querySelector('.game-field');
const supportField = document.querySelector('.supporting-field');
const tbody = document.querySelector('tbody');
const allCellList = document.querySelectorAll('td');
const fieldSize = tbody.rows.length;
const startButton = document.querySelector('.start');
const firstNumb = [2, 2, 2, 2, 4];
const globalScoreElement = document.querySelector('.game-score');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
let globalScore = 0;
let localScore = 0;
let promise;
const cellTransDur = 100;

supportField.style.top = field.offsetTop + 'px';
supportField.style.left = field.offsetLeft + 'px';

[...allCellList].forEach(cell => {
  cell.dataset.currNumb = '';
});

function generateIndex(numberList) {
  return Math.floor(Math.random() * numberList.length);
};

function createNewNumb() {
  const freeCell = [...allCellList].filter(item => {
    return item.dataset.currNumb === '';
  });

  const numbValue = firstNumb[generateIndex(firstNumb)];
  const cellGlobalIdx = generateIndex(freeCell);
  const cell = freeCell[cellGlobalIdx];

  cell.classList.add(`field-cell--${numbValue}`);
  cell.innerHTML = numbValue;
  cell.dataset.currNumb = numbValue;
}

function letsStart(e) {
  startMessage.classList.add('hidden');
  createNewNumb();
  createNewNumb();

  e.target.blur();
  startButton.addEventListener('click', reset);
  startButton.removeEventListener('click', letsStart);
  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.innerHTML = 'Restart';
  document.addEventListener('keydown', moveCell);
}

function reset(e) {
  [...allCellList].forEach(cell => {
    cell.dataset.currNumb = '';
    cell.className = `field-cell`;
    cell.innerHTML = ``;
  });

  createNewNumb();
  createNewNumb();
  e.target.blur();
  globalScoreElement.innerHTML = 0;
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');
}

function showLocalScore(score) {
  const localScoreElem = document.createElement('span');
  const scoreTimeDur = '1s';

  document.querySelector('.info').append(localScoreElem);
  localScoreElem.className = 'local-score';
  localScoreElem.innerHTML = '+' + score;
  localScoreElem.style.transitionDuration = scoreTimeDur;

  setTimeout(() => {
    localScoreElem.style.bottom = '15px';
    localScoreElem.style.opacity = 0;
  }, 200);

  setTimeout(() => {
    localScoreElem.remove();
  }, parseInt(scoreTimeDur) * 1000);
}

function performCellTransform(currCell, newCell, e) {
  const activeCell = document.createElement('div');
  let isMerge = false;

  activeCell.style.left = currCell.offsetLeft + 'px';
  activeCell.style.top = currCell.offsetTop + 'px';
  activeCell.style.width = currCell.clientWidth + 'px';
  activeCell.style.height = currCell.clientHeight + 'px';

  activeCell.className = `
    active-cell
    field-cell
    field-cell--${currCell.innerText}
  `;

  activeCell.innerHTML = currCell.innerText;
  activeCell.dataset.currNumb = currCell.dataset.currNumb;
  activeCell.style.transitionDuration = cellTransDur + 'ms';
  supportField.append(activeCell);
  currCell.className = 'field-cell';
  currCell.innerHTML = '';
  currCell.dataset.currNumb = '';

  if (e.keyCode === 37 || e.keyCode === 39) {
    activeCell.style.left = newCell.offsetLeft + 'px';
  }

  if (e.keyCode === 38 || e.keyCode === 40) {
    activeCell.style.top = newCell.offsetTop + 'px';
  }

  if (newCell.dataset.currNumb === activeCell.dataset.currNumb) {
    newCell.style.transitionDuration = cellTransDur + 'ms';
    newCell.dataset.currNumb *= 2;
    globalScore += +newCell.dataset.currNumb;
    localScore += +newCell.dataset.currNumb;
    globalScoreElement.innerHTML = globalScore;
    isMerge = true;
  } else {
    newCell.dataset.currNumb = activeCell.dataset.currNumb;
  }

  promise = new Promise(resolve => {
    setTimeout(() => {
      newCell.innerHTML = newCell.dataset.currNumb;
      newCell.classList.add(`field-cell--${newCell.dataset.currNumb}`);
      activeCell.innerHTML = newCell.dataset.currNumb;
      activeCell.classList.add(`field-cell--${newCell.dataset.currNumb}`);

      if (newCell.innerHTML === '2048') {
        winMessage.classList.remove('hidden');
      }

      if (isMerge) {
        activeCell.style.transform = 'scale(1.2)';
      }

      setTimeout(() => {
        activeCell.style.transform = 'scale(1)';
        resolve();
      }, cellTransDur);
    }, cellTransDur);
  });

  promise.then(() => activeCell.remove());
}

function moveCell(e) {
  e.preventDefault();

  let newCellstatus = false;

  if (e.keyCode === 37) {
    for (let i = 0; i < fieldSize; i++) {
      let mergeCell = false;

      for (let j = 1; j < fieldSize; j++) {
        const currCell = tbody.rows[i].cells[j];

        if (currCell.dataset.currNumb !== '') {
          let k = j;

          do {
            k--;

            const prevCell = tbody.rows[i].cells[k];

            if (prevCell.dataset.currNumb !== currCell.dataset.currNumb
              && prevCell.dataset.currNumb !== '') {
              k++;
              mergeCell = false;
              break;
            }

            if (prevCell.dataset.currNumb === currCell.dataset.currNumb) {
              if (!mergeCell) {
                mergeCell = true;
              } else {
                mergeCell = false;
                k++;
              }
              break;
            }
          } while (k > 0);

          if (k !== j) {
            const newCell = tbody.rows[i].cells[k];

            performCellTransform(currCell, newCell, e);
            newCellstatus = true;
          }
        }
      }
    }
  };

  if (e.keyCode === 38) {
    for (let i = 0; i < fieldSize; i++) {
      let mergeCell = false;

      for (let j = 1; j < fieldSize; j++) {
        const currCell = tbody.rows[j].cells[i];

        if (currCell.dataset.currNumb !== '') {
          let k = j;

          do {
            k--;

            const prevCell = tbody.rows[k].cells[i];

            if (prevCell.dataset.currNumb !== currCell.dataset.currNumb
              && tbody.rows[k].cells[i].dataset.currNumb !== '') {
              k++;
              mergeCell = false;
              break;
            }

            if (prevCell.dataset.currNumb === currCell.dataset.currNumb) {
              if (!mergeCell) {
                mergeCell = true;
              } else {
                mergeCell = false;
                k++;
              }
              break;
            }
          } while (k > 0);

          if (k !== j) {
            const newCell = tbody.rows[k].cells[i];

            performCellTransform(currCell, newCell, e);
            newCellstatus = true;
          }
        }
      }
    }
  };

  if (e.keyCode === 39) {
    for (let i = 0; i < fieldSize; i++) {
      let mergeCell = false;

      for (let j = fieldSize - 2; j >= 0; j--) {
        const currCell = tbody.rows[i].cells[j];

        if (currCell.dataset.currNumb !== '') {
          let k = j;

          do {
            k++;

            const prevCell = tbody.rows[i].cells[k];

            if (prevCell.dataset.currNumb !== currCell.dataset.currNumb
              && prevCell.dataset.currNumb !== '') {
              k--;
              mergeCell = false;
              break;
            }

            if (prevCell.dataset.currNumb === currCell.dataset.currNumb) {
              if (!mergeCell) {
                mergeCell = true;
              } else {
                mergeCell = false;
                k--;
              }
              break;
            }
          } while (k < fieldSize - 1);

          if (k !== j) {
            const newCell = tbody.rows[i].cells[k];

            performCellTransform(currCell, newCell, e);
            newCellstatus = true;
          }
        }
      }
    }
  }

  if (e.keyCode === 40) {
    for (let i = 0; i < fieldSize; i++) {
      let mergeCell = false;

      for (let j = fieldSize - 2; j >= 0; j--) {
        const currCell = tbody.rows[j].cells[i];

        if (currCell.dataset.currNumb !== '') {
          let k = j;

          do {
            k++;

            const prevCell = tbody.rows[k].cells[i];

            if (prevCell.dataset.currNumb !== currCell.dataset.currNumb
              && prevCell.dataset.currNumb !== '') {
              k--;
              mergeCell = false;
              break;
            }

            if (prevCell.dataset.currNumb === currCell.dataset.currNumb) {
              if (!mergeCell) {
                mergeCell = true;
              } else {
                mergeCell = false;
                k--;
              }
              break;
            }
          } while (k < fieldSize - 1);

          if (k !== j) {
            const newCell = tbody.rows[k].cells[i];

            performCellTransform(currCell, newCell, e);
            newCellstatus = true;
          }
        }
      }
    }
  };

  if (newCellstatus) {
    promise.then(() => {
      createNewNumb();

      const availableCell = [...allCellList].filter(item => {
        return item.dataset.currNumb === '';
      });

      if (availableCell.length === 0) {
        for (let i = 0; i < fieldSize; i++) {
          for (let j = 1; j < fieldSize; j++) {
            const currCellX = tbody.rows[i].cells[j];
            const prevCellX = tbody.rows[i].cells[j - 1];
            const currCellY = tbody.rows[j].cells[i];
            const prevCellY = tbody.rows[j - 1].cells[i];

            if (currCellX.dataset.currNumb === prevCellX.dataset.currNumb
              || currCellY.dataset.currNumb === prevCellY.dataset.currNumb) {
              return;
            }
          }
        }

        loseMessage.classList.remove('hidden');
      }
    });
    newCellstatus = false;
  }

  if (localScore > 0) {
    showLocalScore(localScore);
    localScore = 0;
  }
}

startButton.addEventListener('click', letsStart);
