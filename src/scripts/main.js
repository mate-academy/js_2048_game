'use strict';

const start = document.querySelector('.start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const score = document.querySelector('.game-score');
let allRows = document.querySelectorAll(`.field-row`);
let countScore = 0;
let wasMove = false;
let restartButton;
const winGame = 2048;

const Directions = {
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
};

start.addEventListener('click', () => {
  reset();
  randomCell();
  randomCell(true);
  document.addEventListener('keydown', listener);
});

function listener(e) {
  e.preventDefault();

  const allCells = document.querySelectorAll(`.field-cell`);

  allRows = document.querySelectorAll(`.field-row`);

  const activeCells = [...allCells].filter(elem => {
    return elem.innerHTML !== '';
  });

  if (e.code === Directions.ArrowLeft) {
    if (!restartButton) {
      restart();
    }

    allRows.forEach(tr => {
      let children = [...tr.children];

      children.forEach(td => {
        if (td.innerHTML !== '') {
          for (let i = td.cellIndex + 1; i < children.length; i++) {
            const nextTd = children[i];

            if (td.innerHTML === nextTd.innerHTML) {
              addCells(td, nextTd);

              break;
            }

            if ((td.innerHTML !== children[i].innerHTML)
              && children[i].innerHTML) {
              return;
            }
          }
        }

        if (td.innerHTML === '') {
          for (let i = td.cellIndex + 1; i < children.length; i++) {
            const nextTd = children[i];

            if (nextTd.innerHTML) {
              tr.append(td);
              children = tr.children;
              wasMove = true;
            }
          }
        }
      });
    });

    if (wasMove) {
      randomCell(true);
      wasMove = false;
    }
  }

  if (e.code === Directions.ArrowRight) {
    if (!restartButton) {
      restart();
    }

    allRows.forEach(tr => {
      let children = [...tr.children];

      children.forEach(cell => {
        const td = children[children.length - 1 - cell.cellIndex];

        if (td.innerHTML !== '') {
          for (let i = td.cellIndex - 1; i >= 0; i--) {
            const nextTd = children[i];

            if (td.innerHTML === nextTd.innerHTML) {
              addCells(td, nextTd);
              break;
            }

            if ((td.innerHTML !== nextTd.innerHTML) && nextTd.innerHTML) {
              return;
            }
          }
        }
      });

      children.forEach(td => {
        if (td.innerHTML === '') {
          for (let i = td.cellIndex - 1; i >= 0; i--) {
            const nextTd = children[i];

            if (nextTd.innerHTML) {
              tr.prepend(td);
              children = tr.children;
              wasMove = true;
            }
          }
        }
      });
    });

    if (wasMove) {
      randomCell(true);
      wasMove = false;
    }
  }

  if (e.code === Directions.ArrowUp) {
    if (!restartButton) {
      restart();
    }

    allRows.forEach(row => {
      [...row.children].forEach(td => {
        for (let i = row.rowIndex + 1; i < allRows.length; i++) {
          const nextTd = allRows[i].children[td.cellIndex];

          if (!td.innerHTML || !nextTd.innerHTML) {
            continue;
          }

          if (td.innerHTML === nextTd.innerHTML) {
            addCells(td, nextTd);
            break;
          }

          if (td.innerHTML !== nextTd.innerHTML && nextTd.innerHTML) {
            break;
          }
        }
      });
    });

    activeCells.forEach(cell => {
      const cellIndex = cell.cellIndex;
      const cellParentIndex = cell.parentElement.rowIndex;
      const clone = cell.cloneNode(true);

      let td;
      const emptyrow = [...allRows].find(tr => {
        td = tr.querySelector(`.field-cell:nth-child(${cellIndex + 1})`);

        return !td.innerHTML;
      });

      if (!emptyrow || cellParentIndex < emptyrow.rowIndex) {
        return;
      }

      emptyrow.cells[cellIndex].replaceWith(clone);
      cell.replaceWith(td);
      wasMove = true;
    });

    if (wasMove) {
      randomCell(true);
      wasMove = false;
    }
  }

  if (e.code === Directions.ArrowDown) {
    if (!restartButton) {
      restart();
    }

    [...allRows].reverse().forEach(row => {
      [...row.children].reverse().forEach(td => {
        for (let i = row.rowIndex - 1; i >= 0; i--) {
          const nextTd = allRows[i].children[td.cellIndex];

          if (!td.innerHTML || !nextTd.innerHTML) {
            continue;
          }

          if (td.innerHTML === nextTd.innerHTML) {
            addCells(td, nextTd);
            break;
          }

          if (td.innerHTML !== nextTd.innerHTML && nextTd.innerHTML) {
            break;
          }
        }
      });
    });

    activeCells.reverse().forEach(cell => {
      const cellIndex = cell.cellIndex;
      const cellParentIndex = cell.parentElement.rowIndex;
      const clone = cell.cloneNode(true);

      let td;
      const reverseRows = [...allRows].reverse();
      const emptyrow = [...reverseRows].find(tr => {
        td = tr.querySelector(`.field-cell:nth-child(${cellIndex + 1})`);

        return !td.innerHTML;
      });

      if (!emptyrow || cellParentIndex > emptyrow.rowIndex) {
        return;
      }

      emptyrow.cells[cellIndex].replaceWith(clone);
      cell.replaceWith(td);
      wasMove = true;
    });

    if (wasMove) {
      randomCell(true);
      wasMove = false;
    }
  }
}

function restart() {
  restartButton = true;
  start.innerText = 'Restart';
  start.classList.remove('start');
  start.classList.add('restart');
}

function randomInteger(min, max) {
  const rand = min + Math.random() * (max + 1 - min);

  return Math.floor(rand);
}

function randomCell(random4) {
  const allCells = document.querySelectorAll(`.field-cell`);
  const emptyCells = [...allCells].filter(td => {
    return !td.innerHTML;
  });

  const randomNum = randomInteger(0, emptyCells.length - 1);
  const cell = emptyCells[randomNum];

  let num = 2;

  if (random4) {
    const integer = randomInteger(1, 100);

    if (integer <= 10) {
      num = 4;
    }
  }

  cell.classList.add(`field-cell--${num}`);
  cell.innerText = num;

  if (emptyCells.length === 1) {
    checkNewMoves();
  }
}

function reset() {
  countScore = 0;
  score.innerHTML = countScore;

  const allCells = document.querySelectorAll('.field-cell');
  const messageStart = document.querySelector('.message-start');
  const messageRules = document.querySelector('.message-rules');

  messageLose.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageStart.hidden = true;
  messageRules.hidden = true;

  allCells.forEach(td => {
    td.className = 'field-cell';
    td.innerHTML = '';
  });
  document.addEventListener('keydown', listener);
}

function addCells(td, nextTd) {
  td.classList.remove(`field-cell--${td.innerHTML}`);
  nextTd.classList.remove(`field-cell--${nextTd.innerHTML}`);

  td.innerText = +td.innerHTML + +nextTd.innerHTML;

  td.classList.add(`field-cell--${td.innerText}`);
  nextTd.innerText = '';

  countScore += +td.innerText;
  score.innerHTML = countScore;

  wasMove = true;
  check2048(td.innerText);
}

function checkNewMoves() {
  const noMoves = [];

  allRows.forEach(tr => {
    const children = [...tr.children];

    for (let i = 0; i < children.length - 1; i++) {
      const td = children[i];
      const nextTd = children[i + 1];

      if (td.innerHTML === nextTd.innerHTML) {
        noMoves.push(false);
      }
    }
  });

  for (let i = 0; i < allRows.length - 1; i++) {
    const row = allRows[i];

    for (let j = 0; j < allRows.length; j++) {
      const td = row.children[j];
      const nextTd = allRows[row.rowIndex + 1].children[j];

      if (td.innerHTML === nextTd.innerHTML) {
        noMoves.push(false);
      }
    }
  }

  const noMove = noMoves.every(value => {
    return value === true;
  });

  if (noMove) {
    messageLose.classList.remove('hidden');
    document.removeEventListener('keydown', listener);
  }
}

function check2048(num) {
  if (+num === winGame) {
    messageWin.classList.remove('hidden');
    document.removeEventListener('keydown', listener);
  }
}
