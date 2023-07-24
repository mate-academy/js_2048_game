'use strict';

const button = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageRules = document.querySelector('.message-rules');
// const cells = [...document.querySelectorAll('.field-cell')];
const cells = document.querySelectorAll('.field-cell');

let emptyCells = [];
let filledCells = [];

const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

document.addEventListener('keydown', keydownEvent => {
  const key = keydownEvent.key;

  if (arrows.includes(key)) {
    handleArrowKeyAction(key);

    if (button.classList.contains('start')
      && !messageRules.classList.contains('hidden')) {
      setGameRestart();
    }
  }
});

button.addEventListener('click', () => {
  if (button.classList.contains('start')) {
    startGame();
  }

  if (button.classList.contains('restart')) {
    restartGame();
  }
});

function startGame() {
  clearField();

  if (!messageStart.classList.contains('hidden')) {
    messageStart.classList.add('hidden');
    messageRules.classList.remove('hidden');
  }

  for (let i = 0; i < 2; i++) {
    addNewTile();
  }
}

function restartGame() {
  clearField();
  setGameStart();
}

function addNewTile() {
  const randomCellIndex = getRandomCellIndex();
  const randomNumber = getRandomNumber();
  const randomCell = emptyCells[randomCellIndex];

  randomCell.classList.add(`field-cell--${randomNumber}`);
  randomCell.textContent = `${randomNumber}`;

  updateCellLists();
}

function handleArrowKeyAction(key) {
  switch (key) {
    case 'ArrowUp':
      for (let i = 0; i < filledCells.length; i++) {
        const cell = filledCells[i];
        const cellIndex = [...cells].indexOf(cell);
        let emptyCell = filledCells[i];

        for (let j = cellIndex - 4; j >= 0; j -= 4) {
          if (emptyCells.includes([...cells][j])) {
            emptyCell = [...cells][j];
          } else {
            break;
          }
        }

        // if ([4, 5, 6, 7].includes(cellIndex)) {
        //   for (let j = cellIndex - 4; j >= 0; j -= 4) {
        //     if (emptyCells.includes([...cells][j])) {
        //       emptyCell = [...cells][j];
        //     } else {
        //       break;
        //     }
        //   }
        // }

        // if ([8, 9, 10, 11].includes(cellIndex)) {
        //   for (let j = cellIndex - 4; j >= 0; j -= 4) {
        //     if (emptyCells.includes([...cells][j])) {
        //       emptyCell = [...cells][j];
        //     } else {
        //       break;
        //     }
        //   }
        // }

        // if ([12, 13, 14, 15].includes(cellIndex)) {
        //   for (let j = cellIndex - 4; j >= 0; j -= 4) {
        //     if (emptyCells.includes([...cells][j])) {
        //       emptyCell = [...cells][j];
        //     } else {
        //       break;
        //     }
        //   }
        // }

        if (emptyCell !== cell) {
          emptyCell.classList.add(cell.classList[1]);
          emptyCell.textContent = cell.textContent;
          clearCell([...cells][cellIndex]);
        }
      }
      // updateCellLists();
      break;

    case 'ArrowDown':
      for (let i = filledCells.length - 1; i >= 0; i--) {
        const cell = filledCells[i];
        const cellIndex = [...cells].indexOf(cell);
        let emptyCell = filledCells[i];

        for (let j = cellIndex + 4; j <= 15; j += 4) {
          if (emptyCells.includes([...cells][j])) {
            emptyCell = [...cells][j];
          } else {
            break;
          }
        }

        // if ([8, 9, 10, 11].includes(cellIndex)) {
        //   for (let j = cellIndex + 4; j <= 15; j += 4) {
        //     if (emptyCells.includes([...cells][j])) {
        //       emptyCell = [...cells][j];
        //     } else {
        //       break;
        //     }
        //   }
        // }

        // if ([4, 5, 6, 7].includes(cellIndex)) {
        //   for (let j = cellIndex + 4; j <= 15; j += 4) {
        //     if (emptyCells.includes([...cells][j])) {
        //       emptyCell = [...cells][j];
        //     } else {
        //       break;
        //     }
        //   }
        // }

        // if ([0, 1, 2, 3].includes(cellIndex)) {
        //   for (let j = cellIndex + 4; j <= 15; j += 4) {
        //     if (emptyCells.includes([...cells][j])) {
        //       emptyCell = [...cells][j];
        //     } else {
        //       break;
        //     }
        //   }
        // }

        if (emptyCell !== cell) {
          emptyCell.classList.add(cell.classList[1]);
          emptyCell.textContent = cell.textContent;
          clearCell([...cells][cellIndex]);
        }
      }
      // updateCellLists();
      break;

    case 'ArrowLeft':
      for (let i = 0; i < filledCells.length; i++) {
        const cell = filledCells[i];
        const cellIndex = [...cells].indexOf(cell);
        let emptyCell = filledCells[i];

        if ([1, 5, 9, 13].includes(cellIndex)) {
          for (let j = cellIndex - 1; j > cellIndex - 2; j--) {
            if (emptyCells.includes([...cells][j])) {
              emptyCell = [...cells][j];
            } else {
              break;
            }
          }
        }

        if ([2, 6, 10, 14].includes(cellIndex)) {
          for (let j = cellIndex - 1; j > cellIndex - 3; j--) {
            if (emptyCells.includes([...cells][j])) {
              emptyCell = [...cells][j];
            } else {
              break;
            }
          }
        }

        if ([3, 7, 11, 15].includes(cellIndex)) {
          for (let j = cellIndex - 1; j > cellIndex - 4; j--) {
            if (emptyCells.includes([...cells][j])) {
              emptyCell = [...cells][j];
            } else {
              break;
            }
          }
        }

        if (emptyCell !== cell) {
          emptyCell.classList.add(cell.classList[1]);
          emptyCell.textContent = cell.textContent;
          clearCell([...cells][cellIndex]);
        }
      }
      // updateCellLists();
      break;

    case 'ArrowRight':
      for (let i = filledCells.length - 1; i >= 0; i--) {
        const cell = filledCells[i];
        const cellIndex = [...cells].indexOf(cell);
        let emptyCell = filledCells[i];

        if ([2, 6, 10, 14].includes(cellIndex)) {
          for (let j = cellIndex + 1; j < cellIndex + 2; j++) {
            if (emptyCells.includes([...cells][j])) {
              emptyCell = [...cells][j];
            } else {
              break;
            }
          }
        }

        if ([1, 5, 9, 13].includes(cellIndex)) {
          for (let j = cellIndex + 1; j < cellIndex + 3; j++) {
            if (emptyCells.includes([...cells][j])) {
              emptyCell = [...cells][j];
            } else {
              break;
            }
          }
        }

        if ([0, 4, 8, 12].includes(cellIndex)) {
          for (let j = cellIndex + 1; j < cellIndex + 4; j++) {
            if (emptyCells.includes([...cells][j])) {
              emptyCell = [...cells][j];
            } else {
              break;
            }
          }
        }

        if (emptyCell !== cell) {
          emptyCell.classList.add(cell.classList[1]);
          emptyCell.textContent = cell.textContent;
          clearCell([...cells][cellIndex]);
        }
      }
      // updateCellLists();
      break;
  }
}

function getRandomCellIndex() {
  return Math.floor(Math.random() * emptyCells.length);
}

function getRandomNumber() {
  return Math.random() < 0.9 ? 2 : 4;
}

function clearField() {
  filledCells.forEach(item => {
    const cssClass = item.classList[1];

    item.classList.remove(cssClass);
    item.textContent = '';
  });

  updateCellLists();
}

function clearCell(cell) {
  const cssClass = cell.classList[1];

  cell.classList.remove(cssClass);
  cell.textContent = '';
  updateCellLists();
}

function updateCellLists() {
  emptyCells = [...cells].filter(item => item.classList.length === 1);
  filledCells = [...cells].filter(item => item.classList.length > 1);
}

function setGameStart() {
  button.classList.remove('restart');
  button.classList.add('start');
  button.textContent = 'Start';
  messageStart.classList.remove('hidden');
}

function setGameRestart() {
  button.classList.remove('start');
  button.classList.add('restart');
  button.textContent = 'Restart';
  messageRules.classList.add('hidden');
}
