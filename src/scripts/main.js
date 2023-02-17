'use strict';

const gameHeader = document.querySelector('.game-header');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');
const messageWin = document.querySelector('.message-win');
const start = gameHeader.querySelector('.start');
const allCell = document.querySelectorAll('.field-cell');
const cell = document.querySelectorAll('.field-cell');
const score = document.querySelector('.game-score');

function randomNumber() {
  const notRandomNumbers = [2, 2, 2, 2, 2, 2, 2, 2, 2, 4];
  const index = Math.floor(Math.random() * notRandomNumbers.length);

  return notRandomNumbers[index];
}

start.addEventListener('click', (e) => {
  if (e.target.textContent === 'Restart') {
    for (const element of allCell) {
      element.classList = 'field-cell';
      element.textContent = '';
    }

    if (!messageWin.classList.contains('hidden')) {
      messageWin.classList = 'hidden';
    }

    if (!messageLose.classList.contains('hidden')) {
      messageLose.classList = 'hidden';
    }

    score.textContent = 0;

    createNewCell(randomNumber());
    createNewCell(randomNumber());

    return;
  };

  createNewCell(randomNumber());
  createNewCell(randomNumber());

  start.textContent = 'Restart';
  start.classList = 'button restart';
  messageStart.classList = 'hidden';
});

document.addEventListener('keydown', (e) => {
  let changes;

  switch (e.key) {
    case 'ArrowRight':
      const array = [...allCell];

      for (let i = 15; i >= 0; i--) {
        if (array[i].innerHTML !== '') {
          const element = array[i];
          const elementParent = element.parentElement;
          const row = [...elementParent.children];
          const position = row
            .find(result => result === element).cellIndex;

          for (let j = position + 1; j < 4; j++) {
            if (row[j].innerHTML === '' && j !== 3) {
              continue;
            } else if (row[j].innerHTML === element.innerHTML) {
              row[j].innerHTML
                = +row[j].innerHTML + +element.innerHTML;
              score.innerText = +score.innerText + +row[j].innerText;
            } else if (row[j].innerHTML !== ''
              && j !== position + 1) {
              row[j - 1].innerHTML = element.innerHTML;
            } else if (row[j].innerHTML === '') {
              row[j].innerHTML = element.innerHTML;
            } else {
              break;
            }
            changes = true;
            row[position].innerHTML = '';
            break;
          }
        } else {
          continue;
        }
      }
      break;
  }

  switch (e.key) {
    case 'ArrowLeft':
      const array = [...allCell];

      for (let i = 0; i < 16; i++) {
        if (array[i].innerHTML) {
          const element = array[i];
          const elementParent = element.parentElement;
          const row = [...elementParent.children];
          const position = row
            .find(result => result === element).cellIndex;

          for (let j = position - 1; j >= 0; j--) {
            if (row[j].innerHTML === '' && j !== 0) {
              continue;
            } else if (row[j].innerHTML === element.innerHTML) {
              row[j].innerHTML
                = +`${row[j].innerHTML}` + +`${element.innerHTML}`;
              score.innerText = +score.innerText + +row[j].innerText;
            } else if (row[j].innerHTML !== ''
              && j !== position - 1) {
              row[j + 1].innerHTML = element.innerHTML;
            } else if (row[j].innerHTML === '') {
              row[j].innerHTML = element.innerHTML;
            } else {
              break;
            }
            changes = true;
            row[position].innerHTML = '';
            break;
          }
        } else {
          continue;
        }
      }
      break;
  }

  switch (e.key) {
    case 'ArrowDown':
      const array = [...allCell];

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
      break;
  }

  switch (e.key) {
    case 'ArrowUp':
      const array = [...allCell];

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
      break;
  }

  if (changes) {
    classAdder();
    createNewCell(randomNumber());
  }

  const freeCells = [...cell].filter(element => element.textContent === ''
  );

  if (!changes && freeCells.length === 0) {
    messageLose.classList = 'message message-lose';

    return;
  };
});

function classAdder() {
  const arr = [...allCell];

  arr.forEach(element => {
    if (element.innerText !== '') {
      element.className = `field-cell field-cell--${element.innerText}`;
    } else {
      element.className = 'field-cell';
    }
  });
}

function createNewCell(number) {
  [...allCell].forEach(element => {
    if (element.innerText === '2048') {
      messageWin.classList.remove('hidden');
    }
  });

  const freeCells = [...cell].filter(element => element.textContent === ''
  );

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const newCell = freeCells[getRandomInt(freeCells.length)];

  newCell.classList.add(`field-cell--${number}`);
  newCell.innerText = number;
};
