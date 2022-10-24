'use strict';

const gameButton = document.querySelector('button');
const startText = document.querySelector('.message-start');
const tableCells = document.getElementsByClassName('field-cell');
const page = document.querySelector('html');
const score = document.getElementsByClassName('game-score')[0];

gameButton.addEventListener('click', () => {
  if (gameButton.dataset.condition === 'restart') {
    gameButton.dataset.condition = 'start';
    gameButton.classList.remove('restart');
    gameButton.innerText = 'Start';
    startText.classList.remove('hidden');
    score.innerText = 0;

    [...tableCells].forEach(element => {
      element.innerText = '';
      element.className = 'field-cell';
    });
  } else {
    gameButton.dataset.condition = 'restart';
    gameButton.classList.add('restart');
    gameButton.innerText = 'Restart';
    startText.classList.add('hidden');
    starter(0, 15);
  }

  classAdder(tableCells);
});

function numberMaker() {
  const random = Math.floor(Math.random() * 100) + 1;

  switch (true) {
    case random < 11:
      return 4;
    default:
      return 2;
  }
};

function getRandomIntInclusive(min, max) {
  let minimal = min;
  let maximum = max;

  minimal = Math.ceil(min);
  maximum = Math.floor(max);

  return Math.floor(Math.random() * (maximum - minimal + 1)) + min;
}

function starter(start, end) {
  const first = getRandomIntInclusive(start, end);
  const second = getRandomIntInclusive(start, end);

  if (first !== second) {
    const initialCells = [first, second];

    const index0 = initialCells[0];
    const index1 = initialCells[1];

    tableCells[index0].innerText = `${numberMaker()}`;
    tableCells[index1].innerText = `${numberMaker()}`;
  } else {
    return starter(start, end);
  }
};

function classAdder(cells) {
  const arr = [...cells];

  arr.forEach(element => {
    if (element.innerText !== '') {
      element.className = `field-cell field-cell--${element.innerText}`;
    } else {
      element.className = 'field-cell';
    }
  });
}

function numberAdder() {
  const array = [...tableCells];

  const fillCells = [];

  array.forEach((element, index) => {
    if (element.innerHTML !== '') {
      fillCells.push(index);
    }
  });

  if (fillCells.length === 16) {
    return;
  }

  for (let i = 0; ; i++) {
    const freeCell = getRandomIntInclusive(0, 15);

    if (fillCells.indexOf(freeCell) === -1) {
      array[freeCell].innerText = `${numberMaker()}`;
      break;
    }
  }
}

page.addEventListener('keydown', () => {
  if (event.key === 'ArrowRight'
  && gameButton.dataset.condition === 'restart') {
    const array = [...tableCells];

    let changes;

    for (let i = 15; i >= 0; i--) {
      if (array[i].innerHTML !== '') {
        const element = array[i];
        const elementParent = element.parentElement;
        const rowOfElement = [...elementParent.children];
        const posOfElementInRow = rowOfElement
          .find(result => result === element).cellIndex;

        for (let j = posOfElementInRow + 1; j < 4; j++) {
          if (rowOfElement[j].innerHTML === '' && j !== 3) {
            continue;
          } else if (rowOfElement[j].innerHTML === element.innerHTML) {
            rowOfElement[j].innerHTML
            = +rowOfElement[j].innerHTML + +element.innerHTML;
            score.innerText = +score.innerText + +rowOfElement[j].innerText;
          } else if (rowOfElement[j].innerHTML !== ''
          && j !== posOfElementInRow + 1) {
            rowOfElement[j - 1].innerHTML = element.innerHTML;
          } else if (rowOfElement[j].innerHTML === '') {
            rowOfElement[j].innerHTML = element.innerHTML;
          } else {
            break;
          }
          changes = true;
          rowOfElement[posOfElementInRow].innerHTML = '';
          break;
        }
      } else {
        continue;
      }
    }

    if (changes) {
      numberAdder();
    }
    classAdder(tableCells);
  }
});

page.addEventListener('keydown', () => {
  if (event.key === 'ArrowLeft'
  && gameButton.dataset.condition === 'restart') {
    const array = [...tableCells];

    let changes;

    for (let i = 0; i < 16; i++) {
      if (array[i].innerHTML !== '') {
        const element = array[i];
        const elementParent = element.parentElement;
        const rowOfElement = [...elementParent.children];
        const posOfElementInRow = rowOfElement
          .find(result => result === element).cellIndex;

        for (let j = posOfElementInRow - 1; j >= 0; j--) {
          if (rowOfElement[j].innerHTML === '' && j !== 0) {
            continue;
          } else if (rowOfElement[j].innerHTML === element.innerHTML) {
            rowOfElement[j].innerHTML
            = +`${rowOfElement[j].innerHTML}` + +`${element.innerHTML}`;
            score.innerText = +score.innerText + +rowOfElement[j].innerText;
          } else if (rowOfElement[j].innerHTML !== ''
          && j !== posOfElementInRow - 1) {
            rowOfElement[j + 1].innerHTML = element.innerHTML;
          } else if (rowOfElement[j].innerHTML === '') {
            rowOfElement[j].innerHTML = element.innerHTML;
          } else {
            break;
          }
          changes = true;
          rowOfElement[posOfElementInRow].innerHTML = '';
          break;
        }
      } else {
        continue;
      }
    }

    if (changes) {
      numberAdder();
    }
    classAdder(tableCells);
  }
});

page.addEventListener('keydown', () => {
  if (event.key === 'ArrowDown'
  && gameButton.dataset.condition === 'restart') {
    const array = [...tableCells];

    let changes;

    for (let i = 15; i >= 0; i--) {
      if (array[i].innerHTML !== '') {
        for (let j = i + 4; j <= 15; j += 4) {
          if (array[j].innerHTML === '' && j < 12) {
            continue;
          } else if (array[j].innerHTML === array[i].innerHTML) {
            array[j].innerHTML
            = +array[j].innerHTML + +array[i].innerHTML;
            score.innerText = +score.innerText + +array[j].innerText;
          } else if (array[j].innerHTML !== ''
          && j !== i + 4) {
            array[j - 4].innerHTML = array[i].innerHTML;
          } else if (array[j].innerHTML === '') {
            array[j].innerHTML = array[i].innerHTML;
          } else {
            break;
          }
          changes = true;
          array[i].innerHTML = '';
          break;
        }
      } else {
        continue;
      }
    }

    if (changes) {
      numberAdder();
    }
    classAdder(tableCells);
  }
});

page.addEventListener('keydown', () => {
  if (event.key === 'ArrowUp'
  && gameButton.dataset.condition === 'restart') {
    const array = [...tableCells];

    let changes;

    for (let i = 0; i < 16; i++) {
      if (array[i].innerHTML !== '') {
        for (let j = i - 4; j >= 0; j -= 4) {
          if (array[j].innerHTML === '' && j > 3) {
            continue;
          } else if (array[j].innerHTML === array[i].innerHTML) {
            array[j].innerHTML
            = +array[j].innerHTML + +array[i].innerHTML;
            score.innerText = +score.innerText + +array[j].innerText;
          } else if (array[j].innerHTML !== ''
          && j !== i - 4) {
            array[j + 4].innerHTML = array[i].innerHTML;
          } else if (array[j].innerHTML === '') {
            array[j].innerHTML = array[i].innerHTML;
          } else {
            break;
          }
          changes = true;
          array[i].innerHTML = '';
          break;
        }
      } else {
        continue;
      }
    }

    if (changes) {
      numberAdder();
    }
    classAdder(tableCells);
  }
});
