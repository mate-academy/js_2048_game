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

  if (isLost(fieldMatrix)) {
    looseMessage.classList.remove('hidden');
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
  addToRandomCell(fieldMatrix);
});

function moveUp(field) {
  let isPossible = false;

  for (let i = 0; i < field.length; i++) {
    let lastDoubledIndex = null;

    for (let j = 1; j < field.length; j++) {
      if (!field[j][i].innerHTML) {
        continue;
      }

      let upIndex = j - 1;
      let isDoubled = false;
      let cellScore = field[j][i].innerHTML;

      while (upIndex >= 0
          && (upIndex > lastDoubledIndex || lastDoubledIndex === null)) {
        const upCellScore = field[upIndex][i].innerHTML;

        if ((cellScore === upCellScore && isDoubled)
          || (cellScore !== upCellScore && upCellScore)) {
          break;
        }

        if (!isPossible) {
          isPossible = true;
        }

        if (cellScore === upCellScore && !isDoubled) {
          const doubledNumber = (+upCellScore) + (+cellScore);

          swapCells(field[upIndex + 1][i]
            , field[upIndex][i]
            , doubledNumber);
          cellScore = doubledNumber;
          isDoubled = true;
          scoreInner += doubledNumber;
          lastDoubledIndex = upIndex;
        } else {
          swapCells(field[upIndex + 1][i], field[upIndex][i], cellScore);
        }

        upIndex--;
      }
    }
  }

  if (isPossible) {
    addToRandomCell(fieldMatrix);
  }
}

function moveDown(field) {
  let isPossible = false;

  for (let i = 0; i < field.length; i++) {
    let lastDoubledIndex = null;

    for (let j = field.length - 2; j >= 0; j--) {
      if (!field[j][i].innerHTML) {
        continue;
      }

      let downIndex = j + 1;
      let isDoubled = false;
      let cellScore = field[j][i].innerHTML;

      while (downIndex < (lastDoubledIndex || field.length)) {
        const downCellScore = field[downIndex][i].innerHTML;

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
            field[downIndex - 1][i], field[downIndex][i], doubledNumber
          );
          cellScore = doubledNumber;
          scoreInner += doubledNumber;
          lastDoubledIndex = downIndex;
          isDoubled = true;
        } else {
          swapCells(field[downIndex - 1][i], field[downIndex][i], cellScore);
        }

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
    let lastDoubledIndex = null;

    for (let j = 1; j < field[i].length; j++) {
      if (!field[i][j].innerHTML) {
        continue;
      }

      let leftIndex = j - 1;
      let isDoubled = false;
      let cellScore = field[i][j].innerHTML;

      while (leftIndex >= 0
          && (leftIndex > lastDoubledIndex || lastDoubledIndex === null)) {
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
          lastDoubledIndex = leftIndex;
        } else {
          swapCells(field[i][leftIndex + 1], field[i][leftIndex], cellScore);
        }

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
    let lastDoubledIndex = null;

    for (let j = field[i].length - 2; j >= 0; j--) {
      if (!field[i][j].innerHTML) {
        continue;
      }

      let rightIndex = j + 1;
      let isDoubled = false;
      let cellScore = field[i][j].innerHTML;

      while (rightIndex < (lastDoubledIndex || field[i].length)) {
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
          lastDoubledIndex = rightIndex;
        } else {
          swapCells(field[i][rightIndex - 1], field[i][rightIndex], cellScore);
        }

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
  for (let i = 0; i < field.length; i++) {
    for (let j = 0; j < field[i].length; j++) {
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
