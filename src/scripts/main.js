'use strict';

// Uncomment the next lines to use your game instance in the browser
// const Game = require('../modules/Game.class');
// const game = new Game();

// Variables
const buttonStart = document.querySelector('.start');
const buttonRestart = document.querySelector('.restart');

const score = document.querySelector('.game-score');

const cells = document.querySelectorAll('.field-cell');

const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');

let scoreValue = 0;

let connectedCells = {};

// Check status
const isCellConnected = (index) => {
  return connectedCells[index];
};

// Set status
const setCellConnected = (index, value = true) => {
  connectedCells[index] = value;
};

// Returns random indexes
const getRandomIndexes = function (array) {
  const fIndex = Math.floor(Math.random() * array.length);
  let sIndex = Math.floor(Math.random() * array.length);

  while (fIndex === sIndex) {
    sIndex = Math.floor(Math.random() * array.length);
  }

  return [fIndex, sIndex];
};

// Checks if an element has a modification
const includeMod = function (element) {
  const elementClasses = Array.from(element.classList);

  return elementClasses.some((className) => {
    className.startsWith('field-cell--');
  });
};

// Returns modification of classes
const modNumber = function (elementWithMod) {
  const classMod = Array.from(elementWithMod.classList).join(' ');
  const elementMod = classMod.split('--');

  return elementMod[elementMod.length - 1];
};

function getRandomIndex(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Sets new values on the field
const newValuesOnField = function () {
  const freeCells = [];

  for (let index = 0; index < cells.length; index++) {
    const cell = cells[index];

    if (!includeMod(cell)) {
      freeCells.push(index);
    }
  }

  if (freeCells.length > 0) {
    const randomIndex = getRandomIndex(freeCells);

    const number = Math.random() < 0.1 ? 4 : 2;

    cells[randomIndex].classList.add(`field-cell--${number}`);
    cells[randomIndex].textContent = `${number}`;
  }
};

// Checks all Modified
const areAllCellsModified = function (ch) {
  for (let index = 0; index < ch.length; index++) {
    if (!includeMod(ch[index])) {
      return false;
    }
  }

  return true;
};

// Checks coonect
const canConnectCells = function (item) {
  for (let index = 0; index < item.length; index++) {
    const cell = item[index];

    if (includeMod(cell)) {
      const mod = modNumber(cell);

      if (index - 4 >= 0) {
        const topCell = item[index - 4];

        if (includeMod(topCell) && modNumber(topCell) === mod) {
          return true;
        }
      }

      if (index + 4 < item.length) {
        const bottomCell = item[index + 4];

        if (includeMod(bottomCell) && modNumber(bottomCell) === mod) {
          return true;
        }
      }

      if (index % 4 !== 0) {
        const leftCell = item[index - 1];

        if (includeMod(leftCell) && modNumber(leftCell) === mod) {
          return true;
        }
      }

      if ((index + 1) % 4 !== 0) {
        const rightCell = item[index + 1];

        if (includeMod(rightCell) && modNumber(rightCell) === mod) {
          return true;
        }
      }
    }
  }

  return false;
};

// Loose the Game
const checkToRestart = function (arr) {
  const messageWinClasses = Array.from(messageWin.classList);

  if (messageWinClasses.includes('hidden')) {
    if (areAllCellsModified(arr) && !canConnectCells(arr)) {
      messageLose.classList.remove('hidden');
    }
  }
};

// Win the Game
const checkToWin = function (mod) {
  if (mod * 2 === 2048) {
    messageWin.classList.remove('hidden');
  }
};

// Sets score
const setScore = function (modification) {
  const value = modification * 2;

  scoreValue += value;

  score.textContent = '';
  score.textContent = `${scoreValue}`;
};

// Event Move Up
const moveUp = function (arrayOfCells) {
  let cellsMoved = false;

  for (let index = 0; index < arrayOfCells.length; index++) {
    const cell = arrayOfCells[index];

    if (includeMod(cell)) {
      if (index - 4 >= 0) {
        let newCellIndex = index - 4;

        const mod = modNumber(cell);

        while (newCellIndex >= 0) {
          if (
            includeMod(arrayOfCells[newCellIndex]) &&
            !isCellConnected(newCellIndex)
          ) {
            const firstClass = Array.from(arrayOfCells[newCellIndex].classList);
            const secondClass = Array.from(
              arrayOfCells[newCellIndex + 4].classList,
            );

            if (
              firstClass[firstClass.length - 1] !==
              secondClass[secondClass.length - 1]
            ) {
              break;
            }
          } else if (isCellConnected(newCellIndex) !== undefined) {
            break;
          }

          const modClasses = Array.from(
            arrayOfCells[newCellIndex + 4].classList,
          );

          for (let i = 0; i < modClasses.length; i++) {
            const className = modClasses[i];

            if (className !== 'field-cell') {
              arrayOfCells[newCellIndex + 4].classList.remove(className);
            }
          }

          arrayOfCells[newCellIndex + 4].textContent = '';

          if (
            arrayOfCells[newCellIndex].classList.contains(`field-cell--${mod}`)
          ) {
            arrayOfCells[newCellIndex].classList.remove(`field-cell--${mod}`);
            arrayOfCells[newCellIndex].classList.add(`field-cell--${mod * 2}`);

            arrayOfCells[newCellIndex].textContent = `${mod * 2}`;

            setCellConnected(newCellIndex);

            setScore(mod);

            cellsMoved = true;

            checkToWin(mod);

            break;
          }

          arrayOfCells[newCellIndex].classList.add(`field-cell--${mod}`);
          arrayOfCells[newCellIndex].textContent = `${mod}`;

          cellsMoved = true;

          newCellIndex -= 4;
        }
      }
    }
  }

  if (cellsMoved) {
    newValuesOnField();
  }

  checkToRestart(arrayOfCells);

  connectedCells = {};
};

// Event Move Dowm
const moveDown = function (arrayOfCells) {
  let cellsMoved = false;

  for (let index = arrayOfCells.length - 1; index >= 0; index--) {
    const cell = arrayOfCells[index];

    if (includeMod(cell)) {
      if (index + 4 < cells.length) {
        let newCellIndex = index + 4;

        const mod = modNumber(cell);

        while (newCellIndex < cells.length) {
          if (
            includeMod(arrayOfCells[newCellIndex]) &&
            !isCellConnected(newCellIndex)
          ) {
            const firstClass = Array.from(arrayOfCells[newCellIndex].classList);
            const secondClass = Array.from(
              arrayOfCells[newCellIndex - 4].classList,
            );

            if (
              firstClass[firstClass.length - 1] !==
              secondClass[secondClass.length - 1]
            ) {
              break;
            }
          } else if (isCellConnected(newCellIndex) !== undefined) {
            break;
          }

          const modClasses = Array.from(
            arrayOfCells[newCellIndex - 4].classList,
          );

          for (let i = 0; i < modClasses.length; i++) {
            const className = modClasses[i];

            if (className !== 'field-cell') {
              arrayOfCells[newCellIndex - 4].classList.remove(className);
            }
          }

          arrayOfCells[newCellIndex - 4].textContent = '';

          if (
            arrayOfCells[newCellIndex].classList.contains(`field-cell--${mod}`)
          ) {
            arrayOfCells[newCellIndex].classList.remove(`field-cell--${mod}`);
            arrayOfCells[newCellIndex].classList.add(`field-cell--${mod * 2}`);

            arrayOfCells[newCellIndex].textContent = `${mod * 2}`;

            setCellConnected(newCellIndex);

            setScore(mod);

            cellsMoved = true;

            checkToWin(mod);

            break;
          }

          arrayOfCells[newCellIndex].classList.add(`field-cell--${mod}`);
          arrayOfCells[newCellIndex].textContent = `${mod}`;

          cellsMoved = true;

          newCellIndex += 4;
        }
      }
    }
  }

  if (cellsMoved) {
    newValuesOnField();
  }

  checkToRestart(arrayOfCells);

  connectedCells = {};
};

// Event Move Left
const moveLeft = function (arrayOfCells) {
  const specialNumbers = [0, 4, 8, 12];
  let cellsMoved = false;

  for (let index = 0; index < arrayOfCells.length; index++) {
    const cell = arrayOfCells[index];

    if (includeMod(cell)) {
      let newCellIndex = index - 1;

      const mod = modNumber(cell);

      while (!specialNumbers.includes(newCellIndex + 1)) {
        if (!specialNumbers.includes(index)) {
          if (
            includeMod(arrayOfCells[newCellIndex]) &&
            !isCellConnected(newCellIndex)
          ) {
            const firstClass = Array.from(arrayOfCells[newCellIndex].classList);
            const secondClass = Array.from(
              arrayOfCells[newCellIndex + 1].classList,
            );

            if (
              firstClass[firstClass.length - 1] !==
              secondClass[secondClass.length - 1]
            ) {
              break;
            }
          } else if (isCellConnected(newCellIndex) !== undefined) {
            break;
          }

          const modClasses = Array.from(
            arrayOfCells[newCellIndex + 1].classList,
          );

          for (let i = 0; i < modClasses.length; i++) {
            const className = modClasses[i];

            if (className !== 'field-cell') {
              arrayOfCells[newCellIndex + 1].classList.remove(className);
            }
          }

          arrayOfCells[newCellIndex + 1].textContent = '';

          if (
            arrayOfCells[newCellIndex].classList.contains(`field-cell--${mod}`)
          ) {
            arrayOfCells[newCellIndex].classList.remove(`field-cell--${mod}`);
            arrayOfCells[newCellIndex].classList.add(`field-cell--${mod * 2}`);

            arrayOfCells[newCellIndex].textContent = `${mod * 2}`;

            setCellConnected(newCellIndex);

            setScore(mod);

            cellsMoved = true;

            checkToWin(mod);

            break;
          }

          arrayOfCells[newCellIndex].classList.add(`field-cell--${mod}`);
          arrayOfCells[newCellIndex].textContent = `${mod}`;

          cellsMoved = true;

          newCellIndex -= 1;
        } else {
          break;
        }
      }
    }
  }

  if (cellsMoved) {
    newValuesOnField();
  }

  checkToRestart(arrayOfCells);

  connectedCells = {};
};

// Event Move Left
const moveRight = function (arrayOfCells) {
  const specialNumbers = [3, 7, 11, 15];
  let cellsMoved = false;

  for (let index = arrayOfCells.length - 1; index >= 0; index--) {
    const cell = arrayOfCells[index];

    if (includeMod(cell)) {
      let newCellIndex = index + 1;

      const mod = modNumber(cell);

      while (!specialNumbers.includes(newCellIndex - 1)) {
        if (!specialNumbers.includes(index)) {
          if (
            includeMod(arrayOfCells[newCellIndex]) &&
            !isCellConnected(newCellIndex)
          ) {
            const firstClass = Array.from(arrayOfCells[newCellIndex].classList);
            const secondClass = Array.from(
              arrayOfCells[newCellIndex - 1].classList,
            );

            if (
              firstClass[firstClass.length - 1] !==
              secondClass[secondClass.length - 1]
            ) {
              break;
            }
          } else if (isCellConnected(newCellIndex) !== undefined) {
            break;
          }

          const modClasses = Array.from(
            arrayOfCells[newCellIndex - 1].classList,
          );

          for (let i = 0; i < modClasses.length; i++) {
            const className = modClasses[i];

            if (className !== 'field-cell') {
              arrayOfCells[newCellIndex - 1].classList.remove(className);
            }
          }

          arrayOfCells[newCellIndex - 1].textContent = '';

          if (
            arrayOfCells[newCellIndex].classList.contains(`field-cell--${mod}`)
          ) {
            arrayOfCells[newCellIndex].classList.remove(`field-cell--${mod}`);
            arrayOfCells[newCellIndex].classList.add(`field-cell--${mod * 2}`);

            arrayOfCells[newCellIndex].textContent = `${mod * 2}`;

            setCellConnected(newCellIndex);

            setScore(mod);

            cellsMoved = true;

            checkToWin(mod);

            break;
          }

          arrayOfCells[newCellIndex].classList.add(`field-cell--${mod}`);
          arrayOfCells[newCellIndex].textContent = `${mod}`;

          cellsMoved = true;

          newCellIndex += 1;
        } else {
          break;
        }
      }
    }
  }

  if (cellsMoved) {
    newValuesOnField();
  }

  checkToRestart(arrayOfCells);

  connectedCells = {};
};

// Start
buttonStart.addEventListener('click', function () {
  buttonStart.classList.add('hidden');
  buttonRestart.classList.remove('hidden');

  const indexes = getRandomIndexes(cells);

  cells[indexes[0]].classList.add('field-cell--2');
  cells[indexes[0]].textContent = '2';

  cells[indexes[1]].classList.add('field-cell--2');
  cells[indexes[1]].textContent = '2';

  // cells[15].classList.add('field-cell--1024');
  // cells[15].textContent = '1024';

  // cells[2].classList.add('field-cell--1024');
  // cells[2].textContent = '1024';

  // cells[0].classList.add('field-cell--8');
  // cells[0].textContent = '8';

  // cells[11].classList.add('field-cell--1024');
  // cells[11].textContent = '1024';

  // cells[13].classList.add('field-cell--32');
  // cells[13].textContent = '32';

  // cells[7].classList.add('field-cell--64');
  // cells[7].textContent = '64';

  // cells[6].classList.add('field-cell--128');
  // cells[6].textContent = '128';

  // cells[8].classList.add('field-cell--256');
  // cells[8].textContent = '256';

  // cells[9].classList.add('field-cell--8');
  // cells[9].textContent = '8';

  // cells[10].classList.add('field-cell--1024');
  // cells[10].textContent = '1024';

  // cells[1].classList.add('field-cell--256');
  // cells[1].textContent = '256';

  // cells[4].classList.add('field-cell--512');
  // cells[4].textContent = '512';

  // cells[5].classList.add('field-cell--2');
  // cells[5].textContent = '2';

  // cells[14].classList.add('field-cell--128');
  // cells[14].textContent = '128';

  // cells[3].classList.add('field-cell--8');
  // cells[3].textContent = '8';

  // cells[12].classList.add('field-cell--64');
  // cells[12].textContent = '64';

  messageStart.classList.add('hidden');
});

// Restart
buttonRestart.addEventListener('click', () => {
  location.reload();
});

// Events
document.addEventListener('keydown', (ev) => {
  const isMessageWinVisible = !messageWin.classList.contains('hidden');

  if (isMessageWinVisible) {
    return;
  }

  if (ev.key === 'ArrowUp') {
    moveUp(cells);
  } else if (ev.key === 'ArrowDown') {
    moveDown(cells);
  } else if (ev.key === 'ArrowLeft') {
    moveLeft(cells);
  } else if (ev.key === 'ArrowRight') {
    moveRight(cells);
  }
});
