'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

const body = document.querySelector('body');
const button = document.querySelector('.button');
const table = document.querySelector('.game-field');
const tableCopy = table.cloneNode(true);
const score = document.querySelector('.game-score');

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

const delayUpdate = 165;

// функция создающая новый блок в dom
function newTile(num, scale = false) {
  const createTile = document.createElement('div');

  createTile.classList.add('field-tile', `field-tile--${num}`);
  createTile.textContent = num;

  if (scale === true) {
    createTile.style.transform = 'scale(0)';
  }

  return createTile;
}

function updateState() {
  const currentField = game.getState();

  table.innerHTML = tableCopy.innerHTML;

  const rowsTable = Array.from(body.querySelectorAll('.field-row'));

  currentField.forEach((row, iRow) => {
    row.forEach((item, i) => {
      if (item !== 0) {
        const tile = newTile(item);

        const neededRow = rowsTable[iRow].children;

        neededRow[i].append(tile);
      }
    });
  });
}

/**
 * Функция которая создает и вставляет новую цифру
 *  numStart работает в случае если игра начинается через start()
 *  иначе вставляем одну рандомную цифру
 */
function insertNumber(numberStarts) {
  if (game.getNumber() === null) {
    return;
  }

  const rowsTable = Array.from(body.querySelectorAll('.field-row'));

  // Проверка на start()
  if (numberStarts) {
    numberStarts.forEach((num) => {
      const number = num[0];
      const row = num[1];
      const column = num[2];

      const neededRow = rowsTable[row].children;

      const tile = newTile(number, true);

      neededRow[column].append(tile);

      setTimeout(() => {
        tile.style.transform = 'scale(1)';
      }, 0);
    });
  }

  // если вызов произошел без start()
  if (!numberStarts) {
    const values = game.getNumber();
    const number = values[0];
    const row = values[1];
    const column = values[2];

    const neededRow = rowsTable[row].children;

    const tile = newTile(number, true);

    neededRow[column].append(tile);

    setTimeout(() => {
      tile.style.transform = 'scale(1)';
    }, 0);
  }
}

function moveHorizontal(dataItems, direction) {
  if (dataItems === undefined) {
    return 'withoutMove';
  }

  const fieldRow = document.querySelectorAll('.field-row');

  dataItems.forEach((row, iRow) => {
    if (row.length !== 0) {
      row.forEach((obj, iObj) => {
        if (obj.merged === false) {
          const currentCell = fieldRow[iRow].children[obj.indexStart];
          const tile = currentCell.querySelector('.field-tile');
          const tilePosition = currentCell.offsetLeft;

          const moveTarget = fieldRow[iRow].children[obj.to];
          const positionTarget = moveTarget.offsetLeft;

          if (direction === 'left') {
            const coordsCalc = tilePosition - positionTarget;

            tile.style.transform = `translateX(-${coordsCalc}px)`;
          }

          if (direction === 'right') {
            const coordsCalc = positionTarget - tilePosition;

            tile.style.transform = `translateX(${coordsCalc}px)`;
          }
        }

        if (obj.merged === true) {
          obj.indexStart.forEach((index) => {
            const neededCell = fieldRow[iRow].children[index];
            const tile = neededCell.querySelector('.field-tile');
            const tilePosition = neededCell.offsetLeft;

            const moveTarget = fieldRow[iRow].children[obj.to];
            const positionTarget = moveTarget.offsetLeft;

            if (direction === 'left') {
              const coordsCalc = tilePosition - positionTarget;

              tile.style.transform = `translateX(-${coordsCalc}px)`;
            }

            if (direction === 'right') {
              const coordsCalc = positionTarget - tilePosition;

              tile.style.transform = `translateX(${coordsCalc}px)`;
            }
          });
          score.textContent = game.getScore();
        }
      });
    }
  });
}

function moveVertical(dataItems, direction) {
  if (dataItems === undefined) {
    return 'withoutMove';
  }

  const fieldRow = document.querySelectorAll('.field-row');

  dataItems.forEach((column, iCol) => {
    if (column.length !== 0) {
      column.forEach((row) => {
        if (row.merged === false) {
          const currentCell = fieldRow[row.rowStart].children[iCol];
          const tile = currentCell.querySelector('.field-tile');
          const tilePosition = currentCell.offsetTop;

          const moveTarget = fieldRow[row.to].children[iCol];
          const targetPosition = moveTarget.offsetTop;

          if (direction === 'up') {
            const coordsCalc = tilePosition - targetPosition;

            tile.style.transform = `translateY(-${coordsCalc}px)`;
          }

          if (direction === 'down') {
            const coordsCalc = targetPosition - tilePosition;

            tile.style.transform = `translateY(${coordsCalc}px)`;
          }
        }

        if (row.merged === true) {
          row.rowStart.forEach((iRow) => {
            const currentCell = fieldRow[iRow].children[iCol];
            const tile = currentCell.querySelector('.field-tile');
            const tilePosition = currentCell.offsetTop;

            const moveTarget = fieldRow[row.to].children[iCol];
            const targetPosition = moveTarget.offsetTop;

            if (direction === 'up') {
              const coordsCalc = tilePosition - targetPosition;

              tile.style.transform = `translateY(-${coordsCalc}px)`;
            }

            if (direction === 'down') {
              const coordsCalc = targetPosition - tilePosition;

              tile.style.transform = `translateY(${coordsCalc}px)`;
            }
          });
          score.textContent = game.getScore();
        }
      });
    }
  });
}

let isMoving = false;

const move = (e) => {
  if (isMoving) {
    return;
  }

  if (e.key === 'ArrowLeft') {
    isMoving = true;

    const resultMove = moveHorizontal(game.moveLeft(), 'left');

    if (resultMove !== 'withoutMove') {
      insertNumber();
    }

    setTimeout(() => {
      updateState();
      isMoving = false;
    }, delayUpdate);
  }

  if (e.key === 'ArrowRight') {
    isMoving = true;

    const resultMove = moveHorizontal(game.moveRight(), 'right');

    if (resultMove !== 'withoutMove') {
      insertNumber();
    }

    setTimeout(() => {
      updateState();
      isMoving = false;
    }, delayUpdate);
  }

  if (e.key === 'ArrowUp') {
    isMoving = true;

    const resultMove = moveVertical(game.moveUp(), 'up');

    if (resultMove !== 'withoutMove') {
      insertNumber();
    }

    setTimeout(() => {
      updateState();
      isMoving = false;
    }, delayUpdate);
  }

  if (e.key === 'ArrowDown') {
    isMoving = true;

    const resultMove = moveVertical(game.moveDown(), 'down');

    if (resultMove !== 'withoutMove') {
      insertNumber();
    }

    setTimeout(() => {
      updateState();
      isMoving = false;
    }, delayUpdate);
  }

  const checkStatus = game.checkStatus();

  switch (checkStatus) {
    case 'lose':
      messageLose.classList.toggle('hidden');
      document.removeEventListener('keydown', move);
      break;

    case 'win':
      messageWin.classList.toggle('hidden');
      document.removeEventListener('keydown', move);
      break;
  }
};

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    const message = document.querySelector('.message-start');

    message.classList.toggle('hidden');

    button.classList.toggle('start');
    button.classList.add('restart');

    button.innerHTML = 'Restart';

    insertNumber(game.start());

    document.addEventListener('keydown', move);
  } else {
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    messageStart.classList.toggle('hidden');

    button.classList.toggle('restart');
    button.classList.add('start');

    button.innerHTML = 'Start';

    game.restart();
    score.textContent = game.getScore();

    document.removeEventListener('keydown', move);

    table.innerHTML = tableCopy.innerHTML;
  }
});

const modeButton = document.querySelector('.color-mode');

modeButton.addEventListener('click', () => {
  body.classList.toggle('body--dark');
});
