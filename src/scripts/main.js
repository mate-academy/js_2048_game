'use strict';

const page = document.querySelector('.page');
const switcherStart = document.querySelector('.start');
const switcherScore = document.querySelector('.game-score');

let workingArray = Array(16).fill(null);
let changeIndicator = true;
let scoreCounter = 0;
let disableFunctions = false;
let direction;

function generateInitialValues() {
  let positionX;
  let positionY;
  const startValueX = Math.floor(Math.random() * 9);
  const startValueY = Math.floor(Math.random() * 9);

  do {
    positionX = Math.floor(Math.random() * 16);
    positionY = Math.floor(Math.random() * 16);
  } while (positionX === positionY);

  if (startValueX !== 0) {
    page.querySelectorAll('.field-cell')[positionX]
      .classList.add('field-cell--2');
    workingArray[positionX] = 2;
  } else {
    page.querySelectorAll('.field-cell')[positionX]
      .classList.add('field-cell--4');
    workingArray[positionX] = 4;
  }

  if (startValueY !== 0) {
    page.querySelectorAll('.field-cell')[positionY]
      .classList.add('field-cell--2');
    workingArray[positionY] = 2;
  } else {
    page.querySelectorAll('.field-cell')[positionY]
      .classList.add('field-cell--4');
    workingArray[positionY] = 4;
  };

  switcherStart.classList.remove('start');
  switcherStart.classList.add('restart');
  switcherStart.textContent = 'Restart';
  page.querySelector('.message-start').classList.add('hidden');
}

function generateTwoOrFour() {
  const findAllIndices = [];

  for (let i = 0; i < workingArray.length; i++) {
    if (workingArray[i]) {
      findAllIndices.push(i);
    }
  }

  let positionX;
  const startValueX = Math.floor(Math.random() * 9);

  do {
    positionX = Math.floor(Math.random() * 16);
  } while (findAllIndices.includes(positionX));

  if (startValueX !== 0) {
    page.querySelectorAll('.field-cell')[positionX]
      .classList.add('field-cell--2');
    workingArray[positionX] = 2;
  } else {
    page.querySelectorAll('.field-cell')[positionX]
      .classList.add('field-cell--4');
    workingArray[positionX] = 4;
  }
};

function removeAllModificators() {
  workingArray = Array(16).fill(null);
  changeIndicator = true;
  scoreCounter = 0;
  switcherScore.textContent = '0';
  page.querySelector('.message-win').classList.add('hidden');
  page.querySelector('.message-lose').classList.add('hidden');
  disableFunctions = false;

  page.querySelectorAll('.field-cell').forEach((element) => {
    page.querySelectorAll('.field-cell').forEach((n, i) => {
      element.classList.remove(`field-cell--${2 ** (i + 1)}`);
    });
  });
}

function winningMessage() {
  if (workingArray.includes(2048)) {
    page.querySelector('.message-win').classList.remove('hidden');
  }
}

function loseMessage() {
  let noMovesAvailable = false;

  if (!workingArray.includes(null)) {
    for (let i = 0; i < workingArray.length; i++) {
      if (
        (workingArray[i] !== null)
        && ((workingArray[i - 4] === workingArray[i])
          || (workingArray[i + 4] === workingArray[i])
          || ((workingArray[i - 1] === workingArray[i])
          && (i !== 0) && (i !== 4) && (i !== 8) && (i !== 12))
          || ((workingArray[i + 1] === workingArray[i])
          && (i !== 3) && (i !== 7) && (i !== 11) && (i !== 15)))
      ) {
        noMovesAvailable = true;
      }
    }

    if (noMovesAvailable === false) {
      page.querySelector('.message-lose').classList.remove('hidden');
      disableFunctions = true;
    }
  }
}

function move() {
  if (disableFunctions) {
    return;
  }

  changeIndicator = false;

  const allIndices = [];

  switch (true) {
    case (direction === 'ArrowUp') || (direction === 'ArrowDown'):
      for (let i = 0; i < workingArray.length; i++) {
        if (workingArray[i] !== null) {
          allIndices.push(i);
        }
      }

      if (direction === 'ArrowDown') {
        allIndices.reverse();
      }
      break;

    case ((direction === 'ArrowLeft') || (direction === 'ArrowRight')):
      for (let i = 0; i < workingArray.length; i += 4) {
        if (workingArray[i] !== null) {
          allIndices.push(i);
        }
      }

      for (let i = 1; i < workingArray.length; i += 4) {
        if (workingArray[i] !== null) {
          allIndices.push(i);
        }
      }

      for (let i = 2; i < workingArray.length; i += 4) {
        if (workingArray[i] !== null) {
          allIndices.push(i);
        }
      }

      for (let i = 3; i < workingArray.length; i += 4) {
        if (workingArray[i] !== null) {
          allIndices.push(i);
        }
      }

      if (direction === 'ArrowRight') {
        allIndices.reverse();
      }
      break;

    default:
      break;
  }

  for (let i = 0; i < allIndices.length; i++) {
    const currentCellIndex = allIndices[i];
    let nearestCellIndex;
    let indexThroughOneCell;
    let indexThroughTwoCells;

    switch (true) {
      case (direction === 'ArrowUp'):
        nearestCellIndex = allIndices[i] - 4;
        indexThroughOneCell = allIndices[i] - 8;
        indexThroughTwoCells = allIndices[i] - 12;

        break;
      case (direction === 'ArrowDown'):
        nearestCellIndex = allIndices[i] + 4;
        indexThroughOneCell = allIndices[i] + 8;
        indexThroughTwoCells = allIndices[i] + 12;

        break;
      case (direction === 'ArrowLeft'):
        nearestCellIndex = allIndices[i] - 1;

        if ((currentCellIndex === 0) || (currentCellIndex === 4)
        || (currentCellIndex === 8) || (currentCellIndex === 12)) {
          nearestCellIndex = undefined;
        };

        indexThroughOneCell = allIndices[i] - 2;

        if ((currentCellIndex === 0) || (currentCellIndex === 1)
        || (currentCellIndex === 4) || (currentCellIndex === 5)
        || (currentCellIndex === 8) || (currentCellIndex === 9)
        || (currentCellIndex === 12) || (currentCellIndex === 13)
        ) {
          indexThroughOneCell = undefined;
        }

        indexThroughTwoCells = allIndices[i] - 3;

        if ((currentCellIndex === 0) || (currentCellIndex === 1)
        || (currentCellIndex === 2) || (currentCellIndex === 4)
        || (currentCellIndex === 5) || (currentCellIndex === 6)
        || (currentCellIndex === 8) || (currentCellIndex === 9)
        || (currentCellIndex === 10) || (currentCellIndex === 12)
        || (currentCellIndex === 13) || (currentCellIndex === 14)
        ) {
          indexThroughTwoCells = undefined;
        };

        break;

      case (direction === 'ArrowRight'):
        nearestCellIndex = allIndices[i] + 1;

        if ((currentCellIndex === 3) || (currentCellIndex === 7)
          || (currentCellIndex === 11) || (currentCellIndex === 15)) {
          nearestCellIndex = undefined;
        };

        indexThroughOneCell = allIndices[i] + 2;

        if ((currentCellIndex === 2) || (currentCellIndex === 3)
          || (currentCellIndex === 6) || (currentCellIndex === 7)
          || (currentCellIndex === 10) || (currentCellIndex === 11)
          || (currentCellIndex === 14) || (currentCellIndex === 15)
        ) {
          indexThroughOneCell = undefined;
        }

        indexThroughTwoCells = allIndices[i] + 3;

        if ((currentCellIndex === 1) || (currentCellIndex === 2)
          || (currentCellIndex === 3) || (currentCellIndex === 5)
          || (currentCellIndex === 6) || (currentCellIndex === 7)
          || (currentCellIndex === 9) || (currentCellIndex === 10)
          || (currentCellIndex === 11) || (currentCellIndex === 13)
          || (currentCellIndex === 14) || (currentCellIndex === 15)
        ) {
          indexThroughTwoCells = undefined;
        }
        break;

      default:
        break;
    }

    const sideBySideAndEqual = ((workingArray[nearestCellIndex] !== null)
    && (workingArray[nearestCellIndex] === workingArray[currentCellIndex]));
    const throughOneAndEqual = ((workingArray[indexThroughOneCell] !== null)
    && (workingArray[indexThroughOneCell] === workingArray[currentCellIndex]));
    const throughTwoAndEqual = ((workingArray[indexThroughTwoCells] !== null)
    && (workingArray[indexThroughTwoCells] === workingArray[currentCellIndex]));

    const currentModifier = `field-cell--${workingArray[currentCellIndex]}`;
    const changeableModifier
    = `field-cell--${workingArray[currentCellIndex] * 2}`;

    switch (true) {
      case sideBySideAndEqual:
        page.querySelectorAll('.field-cell')[nearestCellIndex]
          .classList.remove(currentModifier);

        page.querySelectorAll('.field-cell')[nearestCellIndex]
          .classList.add(changeableModifier);

        page.querySelectorAll('.field-cell')[currentCellIndex]
          .classList.remove(currentModifier);
        workingArray[nearestCellIndex] *= 2;
        workingArray[currentCellIndex] = null;
        changeIndicator = true;
        scoreCounter += workingArray[nearestCellIndex];
        switcherScore.textContent = scoreCounter;

        if (workingArray[indexThroughOneCell] === null) {
          page.querySelectorAll('.field-cell')[indexThroughOneCell]
            .classList.add(changeableModifier);

          page.querySelectorAll('.field-cell')[nearestCellIndex]
            .classList.remove(changeableModifier);
          workingArray[indexThroughOneCell] = workingArray[nearestCellIndex];
          workingArray[nearestCellIndex] = null;
          changeIndicator = true;
        };

        if ((workingArray[indexThroughTwoCells] === null)) {
          page.querySelectorAll('.field-cell')[indexThroughTwoCells]
            .classList.add(changeableModifier);

          page.querySelectorAll('.field-cell')[indexThroughOneCell]
            .classList.remove(changeableModifier);

          workingArray[indexThroughTwoCells]
          = workingArray[indexThroughOneCell];
          workingArray[indexThroughOneCell] = null;
          changeIndicator = true;
        }
        break;

      case ((throughOneAndEqual)
        && (workingArray[nearestCellIndex] === null)):
        page.querySelectorAll('.field-cell')[indexThroughOneCell]
          .classList.remove(currentModifier);

        page.querySelectorAll('.field-cell')[indexThroughOneCell]
          .classList.add(changeableModifier);

        page.querySelectorAll('.field-cell')[currentCellIndex]
          .classList.remove(currentModifier);
        workingArray[indexThroughOneCell] *= 2;
        workingArray[currentCellIndex] = null;
        changeIndicator = true;
        scoreCounter += workingArray[indexThroughOneCell];
        switcherScore.textContent = scoreCounter;

        if (workingArray[indexThroughTwoCells] === null) {
          page.querySelectorAll('.field-cell')[indexThroughTwoCells]
            .classList.add(changeableModifier);

          page.querySelectorAll('.field-cell')[indexThroughOneCell]
            .classList.remove(changeableModifier);

          workingArray[indexThroughTwoCells]
          = workingArray[indexThroughOneCell];
          workingArray[indexThroughOneCell] = null;
          changeIndicator = true;
        }
        break;

      case ((throughTwoAndEqual) && (workingArray[nearestCellIndex] === null)
      && (workingArray[indexThroughOneCell] === null)):
        page.querySelectorAll('.field-cell')[indexThroughTwoCells]
          .classList.remove(currentModifier);

        page.querySelectorAll('.field-cell')[indexThroughTwoCells]
          .classList.add(changeableModifier);

        page.querySelectorAll('.field-cell')[currentCellIndex]
          .classList.remove(currentModifier);
        workingArray[indexThroughTwoCells] *= 2;
        workingArray[currentCellIndex] = null;
        changeIndicator = true;
        scoreCounter += workingArray[indexThroughTwoCells];
        switcherScore.textContent = scoreCounter;
        break;

      default:
        switch (true) {
          case (workingArray[nearestCellIndex] === null):
            page.querySelectorAll('.field-cell')[nearestCellIndex]
              .classList.add(currentModifier);

            page.querySelectorAll('.field-cell')[currentCellIndex]
              .classList.remove(currentModifier);
            workingArray[nearestCellIndex] = workingArray[currentCellIndex];
            workingArray[currentCellIndex] = null;
            changeIndicator = true;

            if (workingArray[indexThroughOneCell] === null) {
              page.querySelectorAll('.field-cell')[indexThroughOneCell]
                .classList.add(currentModifier);

              page.querySelectorAll('.field-cell')[nearestCellIndex]
                .classList.remove(currentModifier);

              workingArray[indexThroughOneCell]
              = workingArray[nearestCellIndex];
              workingArray[nearestCellIndex] = null;
              changeIndicator = true;
            };

            if ((workingArray[indexThroughTwoCells] === null)) {
              page.querySelectorAll('.field-cell')[indexThroughTwoCells]
                .classList.add(currentModifier);

              page.querySelectorAll('.field-cell')[indexThroughOneCell]
                .classList.remove(currentModifier);

              workingArray[indexThroughTwoCells]
                = workingArray[indexThroughOneCell];
              workingArray[indexThroughOneCell] = null;
              changeIndicator = true;
            };
            break;

          case (workingArray[indexThroughOneCell] === null):
            page.querySelectorAll('.field-cell')[indexThroughOneCell]
              .classList.add(currentModifier);

            page.querySelectorAll('.field-cell')[currentCellIndex]
              .classList.remove(currentModifier);
            workingArray[indexThroughOneCell] = workingArray[nearestCellIndex];
            workingArray[currentCellIndex] = null;
            changeIndicator = true;

            if (workingArray[indexThroughTwoCells] === null) {
              page.querySelectorAll('.field-cell')[indexThroughTwoCells]
                .classList.add(currentModifier);

              page.querySelectorAll('.field-cell')[indexThroughOneCell]
                .classList.remove(currentModifier);

              workingArray[indexThroughTwoCells]
                = workingArray[indexThroughOneCell];
              workingArray[indexThroughOneCell] = null;
              changeIndicator = true;
            }
            break;
          case (workingArray[indexThroughTwoCells] === null):
            page.querySelectorAll('.field-cell')[indexThroughTwoCells]
              .classList.add(currentModifier);

            page.querySelectorAll('.field-cell')[currentCellIndex]
              .classList.remove(currentModifier);
            workingArray[indexThroughTwoCells] = workingArray[nearestCellIndex];
            workingArray[currentCellIndex] = null;
            changeIndicator = true;
            break;

          default:
            break;
        };
    };
  };

  winningMessage();

  if (changeIndicator) {
    generateTwoOrFour();
  }

  loseMessage();
};

switcherStart.addEventListener('click', () => {
  if (switcherStart.classList.contains('start')) {
    generateInitialValues();
  } else {
    removeAllModificators();
    generateInitialValues();
  };
});

document.addEventListener('keydown', keyEvent => {
  changeIndicator = true;
  direction = keyEvent.key;
  move();
});
