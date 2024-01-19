'use strict';

const buttonStart = document.querySelector('.button');
const messageStart = document.querySelector('.message-start');
const messageWin = document.querySelector('.message-win');
const messageLose = document.querySelector('.message-lose');
const cells = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');
const addScore = document.querySelector('.add-points');

const twoOrFour = () => {
  let value;

  if (Math.random() <= 0.1) {
    value = 4;
  } else {
    value = 2;
  }

  return value;
};

const randomNewCell = () => {
  let rando;

  do {
    rando = Math.floor(Math.random() * cells.length);
  } while (cells[rando].textContent !== '');

  return rando;
};

const cellStyle = () => {
  cells.forEach(cell => {
    cell.classList.remove(
      'field-cell--2', 'field-cell--4', 'field-cell--8',
      'field-cell--16', 'field-cell--32', 'field-cell--64',
      'field-cell--128', 'field-cell--256', 'field-cell--512',
      'field-cell--1024', 'field-cell--2048',
    );

    switch (cell.textContent) {
      case '':
        break;
      case '2':
        cell.classList.add('field-cell--2');
        break;
      case '4':
        cell.classList.add('field-cell--4');
        break;
      case '8':
        cell.classList.add('field-cell--8');
        break;
      case '16':
        cell.classList.add('field-cell--16');
        break;
      case '32':
        cell.classList.add('field-cell--32');
        break;
      case '64':
        cell.classList.add('field-cell--64');
        break;
      case '128':
        cell.classList.add('field-cell--128');
        break;
      case '256':
        cell.classList.add('field-cell--256');
        break;
      case '512':
        cell.classList.add('field-cell--512');
        break;
      case '1024':
        cell.classList.add('field-cell--1024');
        break;
      case '2048':
        cell.classList.add('field-cell--2048');
        messageWin.classList.remove('hidden');
        break;
    }
  });
};

buttonStart.addEventListener('click', () => {
  buttonStart.classList.remove('start');
  buttonStart.textContent = 'Restart';
  buttonStart.classList.add('restart');
  messageStart.classList.add('hidden');
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');
  score.textContent = '0';

  for (let i = 0; i < cells.length; i++) {
    cells[i].textContent = '';
  }

  const randomCellRestart1 = () => {
    return Math.floor(Math.random() * cells.length);
  };

  const constRandomCellRestart1 = randomCellRestart1();

  const randomCellRestart2 = () => {
    let rando;

    do {
      rando = Math.floor(Math.random() * cells.length);
    } while (rando === constRandomCellRestart1);

    return rando;
  };

  const constRandomCellRestart2 = randomCellRestart2();

  cells[constRandomCellRestart1].textContent = (`${twoOrFour()}`);
  cells[constRandomCellRestart2].textContent = (`${twoOrFour()}`);

  cellStyle();
});

document.addEventListener('keydown', action => {
  action.preventDefault();

  let notEmpty;
  let flyPoints = '0';

  const floatingScore = () => {
    if (addScore.classList.contains('animationScore')) {
      addScore.classList.remove('animationScore');
    }

    void addScore.offsetWidth;

    addScore.classList.remove('hidden');
    addScore.textContent = `+${flyPoints}`;
    addScore.classList.add('animationScore');

    addScore.addEventListener('animationend', () => {
      addScore.classList.add('hidden');
    });
  };

  for (const cell of cells) {
    if (cell.textContent !== '') {
      notEmpty = true;
      break;
    }
  }

  if (
    action.key === 'ArrowUp'
    && notEmpty === true
  ) {
    let changesOccurred = false;

    for (let i = 0; i < cells.length; i++) {
      let target = i;

      const mover = () => {
        if (
          target > 3
          && cells[target].textContent !== ''
          && cells[target - 4].textContent === ''
        ) {
          cells[target - 4].textContent = cells[target].textContent;
          cells[target].textContent = '';
          target -= 4;
          changesOccurred = true;
          mover();
        } else if (
          target > 3
          && cells[target].textContent !== ''
          && cells[target - 4].textContent === cells[target].textContent
          && !cells[target - 4].classList.contains('reserved')
        ) {
          cells[target - 4].textContent *= 2;
          cells[target].textContent = '';
          cells[target - 4].classList.add('animationMerge');
          cells[target - 4].classList.add('reserved');
          flyPoints = `${+flyPoints + +(cells[target - 4].textContent)}`;

          cells[target - 4].addEventListener('animationend', () => {
            cells[target - 4].classList.remove('animationMerge');
          });

          changesOccurred = true;

          score.textContent
          = `${+(cells[target - 4].textContent) + +(score.textContent)}`;
          floatingScore();
        }
      };

      mover();
    }

    if (changesOccurred) {
      const constRandomNewCell = randomNewCell();

      cells[constRandomNewCell].textContent = (`${twoOrFour()}`);
      cells[constRandomNewCell].classList.add('animationAppear');

      cells[constRandomNewCell].addEventListener('animationend', () => {
        cells[constRandomNewCell].classList.remove('animationAppear');
      });
    }

    cellStyle();
  }

  if (
    action.key === 'ArrowDown'
    && notEmpty === true
  ) {
    let changesOccurred = false;

    for (let i = cells.length - 1; i >= 0; i--) {
      let target = i;

      const mover = () => {
        if (
          target < 12
          && cells[target].textContent !== ''
          && cells[target + 4].textContent === ''
        ) {
          cells[target + 4].textContent = cells[target].textContent;
          cells[target].textContent = '';
          target += 4;
          changesOccurred = true;
          mover();
        } else if (
          target < 12
          && cells[target].textContent !== ''
          && cells[target + 4].textContent === cells[target].textContent
          && !cells[target + 4].classList.contains('reserved')
        ) {
          cells[target + 4].textContent *= 2;
          cells[target].textContent = '';
          cells[target + 4].classList.add('animationMerge');
          cells[target + 4].classList.add('reserved');
          flyPoints = `${+flyPoints + +(cells[target + 4].textContent)}`;

          cells[target + 4].addEventListener('animationend', () => {
            cells[target + 4].classList.remove('animationMerge');
          });

          changesOccurred = true;

          score.textContent
            = `${+(cells[target + 4].textContent) + +(score.textContent)}`;
          floatingScore();
        }
      };

      mover();
    }

    if (changesOccurred) {
      const constRandomNewCell = randomNewCell();

      cells[constRandomNewCell].textContent = (`${twoOrFour()}`);
      cells[constRandomNewCell].classList.add('animationAppear');

      cells[constRandomNewCell].addEventListener('animationend', () => {
        cells[constRandomNewCell].classList.remove('animationAppear');
      });
    }

    cellStyle();
  }

  if (
    action.key === 'ArrowLeft'
    && notEmpty === true
  ) {
    let changesOccurred = false;

    for (let i = 0; i < cells.length; i++) {
      let target = i;

      const mover = () => {
        if (
          target % 4 !== 0
          && cells[target].textContent !== ''
          && cells[target - 1].textContent === ''
        ) {
          cells[target - 1].textContent = cells[target].textContent;
          cells[target].textContent = '';
          target -= 1;
          changesOccurred = true;
          mover();
        } else if (
          target % 4 !== 0
          && cells[target].textContent !== ''
          && cells[target - 1].textContent === cells[target].textContent
          && !cells[target - 1].classList.contains('reserved')
        ) {
          cells[target - 1].textContent *= 2;
          cells[target].textContent = '';
          cells[target - 1].classList.add('animationMerge');
          cells[target - 1].classList.add('reserved');
          flyPoints = `${+flyPoints + +(cells[target - 1].textContent)}`;

          cells[target - 1].addEventListener('animationend', () => {
            cells[target - 1].classList.remove('animationMerge');
          });

          changesOccurred = true;

          score.textContent
            = `${+(cells[target - 1].textContent) + +(score.textContent)}`;
          floatingScore();
        }
      };

      mover();
    }

    if (changesOccurred) {
      const constRandomNewCell = randomNewCell();

      cells[constRandomNewCell].textContent = (`${twoOrFour()}`);
      cells[constRandomNewCell].classList.add('animationAppear');

      cells[constRandomNewCell].addEventListener('animationend', () => {
        cells[constRandomNewCell].classList.remove('animationAppear');
      });
    }

    cellStyle();
  }

  if (
    action.key === 'ArrowRight'
    && notEmpty === true
  ) {
    let changesOccurred = false;

    for (let i = cells.length - 1; i >= 0; i--) {
      let target = i;

      const mover = () => {
        if (
          (target - 3) % 4 !== 0
          && cells[target].textContent !== ''
          && cells[target + 1].textContent === ''
        ) {
          cells[target + 1].textContent = cells[target].textContent;
          cells[target].textContent = '';
          target += 1;
          changesOccurred = true;
          mover();
        } else if (
          (target - 3) % 4 !== 0
          && cells[target].textContent !== ''
          && cells[target + 1].textContent === cells[target].textContent
          && !cells[target + 1].classList.contains('reserved')
        ) {
          cells[target + 1].textContent *= 2;
          cells[target].textContent = '';
          cells[target + 1].classList.add('animationMerge');
          cells[target + 1].classList.add('reserved');
          flyPoints = `${+flyPoints + +(cells[target + 1].textContent)}`;

          cells[target + 1].addEventListener('animationend', () => {
            cells[target + 1].classList.remove('animationMerge');
          });

          changesOccurred = true;

          score.textContent
            = `${+(cells[target + 1].textContent) + +(score.textContent)}`;
          floatingScore();
        }
      };

      mover();
    }

    if (changesOccurred) {
      const constRandomNewCell = randomNewCell();

      cells[constRandomNewCell].textContent = (`${twoOrFour()}`);
      cells[constRandomNewCell].classList.add('animationAppear');

      cells[constRandomNewCell].addEventListener('animationend', () => {
        cells[constRandomNewCell].classList.remove('animationAppear');
      });
    }

    cellStyle();
  }

  const countCells = () => {
    let isSixteen = true;

    for (const cell of cells) {
      if (cell.textContent === '') {
        isSixteen = false;
      }
    }

    return isSixteen;
  };

  const isFiled = countCells();

  let isOriginal = true;

  for (let cell = 4; cell < cells.length - 4; cell++) {
    if (cells[cell].textContent === cells[cell - 4].textContent
    || cells[cell].textContent === cells[cell + 4].textContent) {
      isOriginal = false;
    }
  }

  for (let cell = 0; cell < cells.length; cell++) {
    if (cell % 4 !== 0) {
      if (cells[cell].textContent === cells[cell - 1].textContent) {
        isOriginal = false;
      }
    } else if ((cell - 3) % 4 !== 0) {
      if (cells[cell].textContent === cells[cell + 1].textContent) {
        isOriginal = false;
      }
    }
  }

  if (
    isFiled === true
    && isOriginal === true
  ) {
    messageLose.classList.remove('hidden');
  }

  for (const cell of cells) {
    cell.classList.remove('reserved');
  }
});
