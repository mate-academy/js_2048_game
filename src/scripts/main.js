'use strict';

const mainButton = document.querySelector('.button');
const rowsAmount = document.querySelectorAll('.field-row').length;
const looseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const score = document.querySelector('.game-score');
const fieldMatrix = [];
const WIN_SCORE = '2048';
let scoreInner = 0;

for (let i = 0; i < rowsAmount; i++) {
  const rowCells = document.querySelectorAll(`.field-row:nth-child(${i + 1}) `
  + `.field-cell`);
  const empTyArr = [];

  fieldMatrix.push(empTyArr);

  for (let j = 0; j < rowCells.length; j++) {
    fieldMatrix[i].push(rowCells[j]);
  }
}

document.addEventListener('keydown', e => {
  if (isLost(fieldMatrix)) {
    looseMessage.classList.remove('hidden');
    return;
  }

  if (e.key === 'ArrowUp') {
    moveUp(fieldMatrix);
  }

  if (e.key === 'ArrowDown') {
    moveDown(fieldMatrix);
  }

  if (e.key === 'ArrowLeft') {
    moveLeft(fieldMatrix);
  }
  
  if (e.key === 'ArrowRight') {
    moveRight(fieldMatrix);
  }

  if (isWon(fieldMatrix)) {
    winMessage.classList.remove('hidden');
  }
  
  score.innerText = scoreInner;
});

mainButton.addEventListener('click', e => {
  if (mainButton.classList.contains('start')) {
    mainButton.classList.remove('start');
    mainButton.classList.add('restart');
    mainButton.innerHTML = 'Restart';
    document.querySelector('.message-start').classList.add('hidden');
  }

  clearfield(fieldMatrix);
  scoreInner = 0;
  score.innerText = scoreInner;

  if (!looseMessage.classList.contains('hidden')) {
    looseMessage.classList.add('hidden');
  }

  if (!winMessage.classList.contains('hidden')) {
    winMessage.classList.add('hidden');
  }

  addToRandomCell(fieldMatrix);
});

function moveUp(field) {
  let isPossible = false;

  for (let i = 1; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      if (!field[i][j].innerHTML) {
        continue;
      }

      let prevIndex = i - 1;
      let isDoubled = false;
      let cellScore = field[i][j].innerHTML;

      while (prevIndex >= 0) {
        const prevCellScore = field[prevIndex][j].innerHTML;

        if ((cellScore === prevCellScore && isDoubled)
          || (cellScore !== prevCellScore && prevCellScore)) {
          break;
        }

        if (!isPossible) {
          isPossible = true;
        }

        if (cellScore === prevCellScore && !isDoubled) {
          const doubledNumber = (+prevCellScore) + (+cellScore);

          swapCells(field[prevIndex + 1][j]
            , field[prevIndex][j]
            , doubledNumber);
          cellScore = doubledNumber;
          isDoubled = true;
          scoreInner += doubledNumber;
          continue;
        }

        swapCells(field[prevIndex + 1][j], field[prevIndex][j], cellScore);
        prevIndex--;
      }
    }
  }

  if (isPossible) {
    addToRandomCell(fieldMatrix);
  }
}

function moveDown(field) {
  let isPossible = false;

  for (let i = field.length - 2; i >= 0; i--) {
    for (let j = 0; j < field[i].length; j++) {
      if (!field[i][j].innerHTML) {
        continue;
      }

      let downIndex = i + 1;
      let isDoubled = false;
      let cellScore = field[i][j].innerHTML;

      while (downIndex <= field.length - 1) {
        const downCellScore = field[downIndex][j].innerHTML;

        if ((cellScore === downCellScore && isDoubled)
          || (cellScore !== downCellScore && downCellScore)) {
          break;
        }

        if (!isPossible) {
          isPossible = true;
        }

        if (cellScore === downCellScore && !isDoubled) {
          const doubledNumber = (+downCellScore) + (+cellScore);

          swapCells(
            field[downIndex - 1][j], field[downIndex][j], doubledNumber
          );
          cellScore = doubledNumber;
          scoreInner += doubledNumber;
          isDoubled = true;
          continue;
        }

        swapCells(field[downIndex - 1][j], field[downIndex][j], cellScore);
        downIndex++;
      }
    }
  }

  if (isPossible) {
    addToRandomCell(fieldMatrix);
  }
}

function moveLeft(field) {
  let isPossible = false;

  for (let i = 0; i < field.length; i++) {
    for (let j = 1; j < field[i].length; j++) {
      if (!field[i][j].innerHTML) {
        continue;
      }

      let leftIndex = j - 1;
      let isDoubled = false;
      let cellScore = field[i][j].innerHTML;

      while (leftIndex >= 0) {
        const leftCellScore = field[i][leftIndex].innerHTML;

        if ((cellScore === leftCellScore && isDoubled)
            || (cellScore !== leftCellScore && leftCellScore)) {
          break;
        }

        if (!isPossible) {
          isPossible = true;
        }

        if (cellScore === leftCellScore && !isDoubled) {
          const doubledNumber = (+leftCellScore) + (+cellScore);

          swapCells(
            field[i][leftIndex + 1], field[i][leftIndex], doubledNumber
          );
          cellScore = doubledNumber;
          isDoubled = true;
          scoreInner += doubledNumber;
          continue;
        }

        swapCells(field[i][leftIndex + 1], field[i][leftIndex], cellScore);
        leftIndex--;
      }
    }
  }

  if (isPossible) {
    addToRandomCell(fieldMatrix);
  }
}

function moveRight(field) {
  let isPossible = false;

  for (let i = 0; i < field.length; i++) {
    for (let j = field[i].length - 2; j >= 0; j--) {
      if (!field[i][j].innerHTML) {
        continue;
      }

      let rightIndex = j + 1;
      let isDoubled = false;
      let cellScore = field[i][j].innerHTML;

      while (rightIndex <= field[i].length - 1) {
        const rightCellScore = field[i][rightIndex].innerHTML;

        if ((cellScore === rightCellScore && isDoubled)
            || (cellScore !== rightCellScore && rightCellScore)) {
          break;
        }

        if (!isPossible) {
          isPossible = true;
        }

        if (cellScore === rightCellScore && !isDoubled) {
          const doubledNumber = (+rightCellScore) + (+cellScore);

          swapCells(
            field[i][rightIndex - 1], field[i][rightIndex], doubledNumber
          );
          cellScore = doubledNumber;
          isDoubled = true;
          scoreInner += doubledNumber;
          continue;
        }

        swapCells(field[i][rightIndex - 1], field[i][rightIndex], cellScore);
        rightIndex++;
      }
    }
  }

  if (isPossible) {
    addToRandomCell(fieldMatrix);
  }
}

function isLost(field) {
  for (let i = 0; i < field.length; i++) {
    if (field[i].findIndex(cell => {
      if (!cell.innerHTML) {
        return true;
      }
    }) !== -1) {
      return false;
    }
  }

  for (let i = 0; i < field.length; i++) {
    const topIndex = (i - 1) >= 0 ? (i - 1) : 0;

    for (let j = 0; j < field[i].length; j++) {
      const currentCellScore = field[i][j].innerHTML;
      const leftIndex = (j - 1) >= 0 ? (j - 1) : 0;

      if (currentCellScore === field[topIndex][j].innerHTML && i !== 0) {
        return false;
      }

      if (currentCellScore === field[i][leftIndex].innerHTML && j !== 0) {
        return false;
      }
    }
  }

  return true;
}

function isWon(field) {
  for(let i = 0; i < field.length; i++) {
    for(let j = 0; j < field[i].length; j++) {
      if (field[i][j].innerHTML === WIN_SCORE) {
        return true;
      }
    }
  }

  return false;
}

function swapCells(mainCell, targetCell, mainCellScore) {
  mainCell.innerHTML = '';
  mainCell.className = 'field-cell';
  targetCell.innerHTML = mainCellScore;
  targetCell.className = `field-cell field-cell--${mainCellScore}`;
}

function addToRandomCell(field) {
  const emptyCells = [];

  field.forEach(row => {
    row.forEach(cell => {
      if (!cell.innerHTML) {
        emptyCells.push(cell);
      }
    });
  });

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  const random = Math.random();

  const numberToAdd = random <= 0.1 ? 4 : 2;

  emptyCells[randomIndex].classList.add(`field-cell--${numberToAdd}`);
  emptyCells[randomIndex].innerHTML = numberToAdd;
}

function clearfield(field) {
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
      field[i][j].className = 'field-cell';
      field[i][j].innerHTML = '';
    }
  }
}
