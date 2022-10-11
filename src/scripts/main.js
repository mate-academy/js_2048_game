'use strict';

const gameButton = document.querySelector('button');
const startText = document.querySelector('.message-start');
const tableCells = document.getElementsByClassName('field-cell');
const page = document.querySelector('html');

gameButton.addEventListener('click', () => {
  if (gameButton.dataset.condition === 'restart') {
    gameButton.dataset.condition = 'start';
    gameButton.classList.remove('restart');
    gameButton.innerText = 'Start';
    startText.classList.remove('hidden');

    [...tableCells].forEach(element => {
      element.innerText = '';
      element.className = 'field-cell';
    });
  } else {
    gameButton.dataset.condition = 'restart';
    gameButton.classList.add('restart');
    gameButton.innerText = 'Restart';
    startText.classList.add('hidden');
    starter();
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

function starter() {
  const first = getRandomIntInclusive(0, 9);
  const second = getRandomIntInclusive(0, 9);

  if (first !== second) {
    const initialCells = [first, second];

    const index0 = initialCells[0];
    const index1 = initialCells[1];

    tableCells[index0].innerText = `${numberMaker()}`;
    tableCells[index1].innerText = `${numberMaker()}`;
  } else {
    return starter();
  }
};

function classAdder(cells) {
  const arr = [...cells];

  arr.forEach(element => {
    if (element.innerText === '2') {
      element.classList.add('field-cell--2');
    }

    if (element.innerText === '4') {
      element.classList.add('field-cell--4');
    }
  });
}

page.addEventListener('keydown', () => {
  if (event.key === 'ArrowRight') {
    [...tableCells].forEach(element => {
      if (element.innerText !== '') {
        const postionOfElement = element.cellIndex;
        const elementParent = element.parentElement;
        const rowOfCurrentElement = [...elementParent.children];

        for (let i = postionOfElement + 1; i < 4; i++) {
          // console.log(i);

          if (rowOfCurrentElement[i].innerHTML !== ''
          || rowOfCurrentElement[i].innerHTML !== undefined) {
            const freeCell = rowOfCurrentElement[i - 1];

            freeCell.innerHTML = element.innerHTML;
            freeCell.className = element.className;

            element.innerHTML = '';
            element.className = 'field-cell';
          }
        }
      }
    });
  }
});
