'use strict';

const cells = Array.from(document.querySelectorAll('.field-cell'));

const field = [
  cells.slice(0, 4),
  cells.slice(4, 8),
  cells.slice(8, 12),
  cells.slice(12, 16),
];

const messages = {
  win: document.querySelector('.message-win'),
  lose: document.querySelector('.message-lose'),
  start: document.querySelector('.message-start'),
};

const score = document.querySelector('.game-score');

const mainButton = document.querySelector('.button');

let isFirstMove;

mainButton.addEventListener('click', () => {
  cells.forEach(cell => {
    changeCell(cell, '');
  });

  changeMessage();
  mainButton.classList.replace('restart', 'start');
  mainButton.innerHTML = 'Start';

  score.innerHTML = 0;
  isFirstMove = true;

  document.removeEventListener('keydown', makeMove);
  fillRandomCell();
  fillRandomCell();
  document.addEventListener('keydown', makeMove);
});

function fillRandomCell() {
  const emptyCells = cells.filter(cell => !cell.innerHTML);
  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const value = Math.random() < 0.1 ? 4 : 2;

  changeCell(emptyCells[randomIndex], value);
}

function changeCell(cell, value) {
  if (!value) {
    cell.classList.remove(`field-cell--${cell.innerHTML}`);
    cell.innerHTML = '';

    return;
  }

  if (cell.innerHTML) {
    cell.classList.replace(
      `field-cell--${cell.innerHTML}`,
      `field-cell--${value}`,
    );

    cell.innerHTML = value;

    return;
  }

  cell.innerHTML = value;
  cell.classList.add(`field-cell--${value}`);
}

function changeMessage(newMessage) {
  const currentMessage = Object.values(messages).find(
    message => !message.classList.contains('hidden'),
  );

  if (currentMessage) {
    currentMessage.classList.add('hidden');
  }

  if (newMessage) {
    newMessage.classList.remove('hidden');
  }
}

function checkWin(value) {
  if (value === 2048) {
    changeMessage(messages.win);
  }
}

function increaseScore(value) {
  score.innerHTML = +score.innerHTML + value;
}

function makeMove(action) {
  const GAME_BUTTONS = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];

  if (!GAME_BUTTONS.includes(action.key)) {
    return;
  }

  let isAnythingChanged = false;

  checkFirstMove();

  switch (action.key) {
    case 'ArrowUp':
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          for (let k = i + 1; k < 4; k++) {
            const value = field[k][j].innerHTML;

            if (!value) {
              continue;
            }

            if (!field[i][j].innerHTML) {
              moveValue(field[k][j], field[i][j]);
              isAnythingChanged = true;

              continue;
            }

            if (value === field[i][j].innerHTML) {
              const newValue = value * 2;

              mergeCells(field[k][j], field[i][j]);
              increaseScore(newValue);
              checkWin(newValue);
              isAnythingChanged = true;

              break;
            }

            break;
          }
        }
      }

      break;

    case 'ArrowDown':
      for (let i = 3; i >= 0; i--) {
        for (let j = 0; j < 4; j++) {
          for (let k = i - 1; k >= 0; k--) {
            const value = field[k][j].innerHTML;

            if (!value) {
              continue;
            }

            if (!field[i][j].innerHTML) {
              moveValue(field[k][j], field[i][j]);
              isAnythingChanged = true;

              continue;
            }

            if (value === field[i][j].innerHTML) {
              const newValue = value * 2;

              mergeCells(field[k][j], field[i][j]);
              increaseScore(newValue);
              checkWin(newValue);
              isAnythingChanged = true;

              break;
            }

            break;
          }
        }
      }

      break;

    case 'ArrowRight':
      for (let i = 0; i < 4; i++) {
        for (let j = 3; j >= 0; j--) {
          for (let k = j - 1; k >= 0; k--) {
            const value = field[i][k].innerHTML;

            if (!value) {
              continue;
            }

            if (!field[i][j].innerHTML) {
              moveValue(field[i][k], field[i][j]);
              isAnythingChanged = true;
              continue;
            }

            if (value === field[i][j].innerHTML) {
              const newValue = value * 2;

              mergeCells(field[i][k], field[i][j]);
              increaseScore(newValue);
              checkWin(newValue);
              isAnythingChanged = true;

              break;
            }

            break;
          }
        }
      }

      break;

    case 'ArrowLeft':
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          for (let k = j + 1; k < 4; k++) {
            const value = field[i][k].innerHTML;

            if (!value) {
              continue;
            }

            if (!field[i][j].innerHTML) {
              moveValue(field[i][k], field[i][j]);
              isAnythingChanged = true;
              continue;
            }

            if (value === field[i][j].innerHTML) {
              const newValue = value * 2;

              mergeCells(field[i][k], field[i][j]);
              increaseScore(newValue);
              checkWin(newValue);
              isAnythingChanged = true;

              break;
            }

            break;
          }
        }
      }

      break;
  }

  if (isAnythingChanged) {
    fillRandomCell();
  } else if (isLose()) {
    changeMessage(messages.lose);
    document.removeEventListener('keydown', makeMove);
  }
}

function moveValue(fromCell, toCell) {
  changeCell(toCell, fromCell.innerHTML);
  changeCell(fromCell, '');
}

function mergeCells(fromCell, toCell) {
  changeCell(toCell, fromCell.innerHTML * 2);
  changeCell(fromCell, '');
}

function isLose() {
  if (cells.some(cell => !cell.innerHTML)) {
    return false;
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const currentVal = field[i][j].innerHTML;
      const valuesToCheck = [];

      if (field[i + 1]) {
        valuesToCheck.push(field[i + 1][j].innerHTML);
      }

      if (field[i][j + 1]) {
        valuesToCheck.push(field[i][j + 1].innerHTML);
      }

      if (valuesToCheck.includes(currentVal)) {
        return false;
      }
    }
  }

  return true;
}

function checkFirstMove() {
  if (isFirstMove) {
    mainButton.classList.replace('start', 'restart');
    mainButton.innerHTML = 'Restart';
    isFirstMove = false;
  }
}
