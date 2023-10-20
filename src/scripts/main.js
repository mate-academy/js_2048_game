'use strict';

const score = document.querySelector('.game-score');
const button = document.querySelector('.button');
let fieldCell = document.querySelectorAll('.field-cell');
const message = document.querySelectorAll('.message');

fieldCell = Array.from(fieldCell);

// change fieldCell so that all array methods are available.
function restartGame() {
  fieldCell.forEach((ch, i) => {
    fieldCell[i].textContent = ''; // I delete all the numbers

    const baseClass = 'field-cell';

    const classList = fieldCell[i].classList;

    // Remove all classes starting with "field-cell--"
    classList.forEach(className => {
      if (className.startsWith(`${baseClass}--`)) {
        fieldCell[i].classList.remove(className);
      }
    });
  });

  const randomNum1 = randomValue();
  const randomNum2 = randomValue();
  const randomVal1 = Math.floor(Math.random() * fieldCell.length);
  let randomVal2;

  // the condition is true as long as the two indices are equal
  do {
    randomVal2 = Math.floor(Math.random() * fieldCell.length);
  } while (randomVal1 === randomVal2);

  fieldCell[randomVal1].textContent = randomNum1;
  fieldCell[randomVal2].textContent = randomNum2;
  fieldCell[randomVal1].classList.add(`field-cell--${randomNum1}`);
  fieldCell[randomVal2].classList.add(`field-cell--${randomNum2}`);
}

function removeClass(elem1) {
  const clasLs = elem1.classList;

  for (const className of clasLs) {
    if (className.startsWith(`field-cell--`)) {
      elem1.classList.remove(className);
    }
  }
}

function randomValue() {
  const random = Math.random();

  return random <= 0.1 ? 4 : 2;
}

function ArrowUp() {
  let newValuePl = false;

  // cycles 1, 2 are required to pass the tile from top to bottom,
  // replacing the previous element with the current one
  for (let c = 0; c < 4; c++) { // 1
    const newAr = [];

    // Cycles 1_1 and 1_2 are necessary for
    // information - how many times can be merged.
    for (let i = 0; i < 4; i++) { // 1_1
      const cer = fieldCell[c + (i * 4)].textContent;

      newAr.push(cer);
    }

    let caunt = 0;

    for (let l = 0; l < newAr.length; l++) { // 1_2
      if (newAr[l] !== '') {
        for (let li = 0; li < newAr.length; li++) {
          if (newAr[l] === newAr[li] && li !== l) {
            caunt++;
            newAr[l] = `0, ${l}`;
            newAr[li] = `0, ${li}`;
          }
        }
      }
    }

    for (let r = 1; r < 4; r++) { // 2
      const currElem = fieldCell[c + (r * 4)].textContent;

      if (currElem !== '') {
        let newR = r;

        while (newR > 0) { // the while loop is needed to move the tile up
          const prevElem = fieldCell[c + ((newR - 1) * 4)].textContent;

          if (prevElem === '') {
            // replaces the previous tile with the current one
            fieldCell[c + ((newR - 1) * 4)].textContent = currElem;
            fieldCell[c + (newR * 4)].textContent = '';
            newValuePl = true;

            fieldCell[c + ((newR - 1) * 4)]
              .classList.add(`field-cell--${currElem}`);
            removeClass(fieldCell[c + (newR * 4)]);
          } else if (prevElem === currElem && caunt > 0) {
            // can be merged
            const total = (+prevElem) + (+currElem);

            fieldCell[c + ((newR - 1) * 4)].textContent = '' + total;
            fieldCell[c + (newR * 4)].textContent = '';
            score.textContent = (+score.textContent) + total;
            newValuePl = true;
            caunt--;
            // I delete all classes that begin with field-cell--
            // and add a new one
            removeClass(fieldCell[c + ((newR - 1) * 4)]);

            fieldCell[c + ((newR - 1) * 4)]
              .classList.add(`field-cell--${'' + total}`);
            removeClass(fieldCell[c + (newR * 4)]);
          } else {
            break;
          }
          newR--;
        }
      }
    }
  }

  // creating a new tile
  if (newValuePl) {
    const lengthFil = fieldCell.filter(el => el.textContent === '');

    if (lengthFil.length > 0) {
      let emtyOr = Math.floor(Math.random() * 16);

      while (fieldCell[emtyOr].textContent !== '') {
        emtyOr = Math.floor(Math.random() * 16);
      }

      const randomCo = randomValue();

      fieldCell[emtyOr].textContent = randomCo;
      fieldCell[emtyOr].classList.add(`field-cell--${randomCo}`);
    }
  }
}

function ArrowDown() {
  let newValuePl = false;

  for (let c = 0; c < 4; c++) {
    const newAr = [];

    for (let i = 0; i < 4; i++) {
      const cer = fieldCell[c + (i * 4)].textContent;

      newAr.push(cer);
    }

    let caunt = 0;

    for (let l = 0; l < newAr.length; l++) {
      if (newAr[l] !== '') {
        for (let li = 0; li < newAr.length; li++) {
          if (newAr[l] === newAr[li] && li !== l) {
            caunt++;
            newAr[l] = `0, ${l}`;
            newAr[li] = `0, ${li}`;
          }
        }
      }
    }

    for (let r = 2; r >= 0; r--) {
      const currElem = fieldCell[c + (r * 4)].textContent;

      if (currElem !== '') {
        let newR = r;

        while (newR < 3) {
          const prevElem = fieldCell[c + ((newR + 1) * 4)].textContent;

          if (prevElem === '') {
            fieldCell[c + (newR * 4)].textContent = '';
            fieldCell[c + ((newR + 1) * 4)].textContent = currElem;
            newValuePl = true;

            fieldCell[c + ((newR + 1) * 4)]
              .classList.add(`field-cell--${currElem}`);
            removeClass(fieldCell[c + (newR * 4)]);
          } else if (prevElem === currElem && caunt > 0) {
            const total = (+prevElem) + (+currElem);

            fieldCell[c + ((newR + 1) * 4)].textContent = '' + total;
            fieldCell[c + (newR * 4)].textContent = '';
            score.textContent = (+score.textContent) + total;
            newValuePl = true;
            caunt--;
            removeClass(fieldCell[c + ((newR + 1) * 4)]);

            fieldCell[c + ((newR + 1) * 4)]
              .classList.add(`field-cell--${'' + total}`);
            removeClass(fieldCell[c + (newR * 4)]);
          } else {
            break;
          }

          newR++;
        }
      }
    }
  }

  if (newValuePl) {
    const lengthFil = fieldCell.filter(el => el.textContent === '');

    if (lengthFil.length > 0) {
      let emtyOr = Math.floor(Math.random() * 16);

      while (fieldCell[emtyOr].textContent !== '') {
        emtyOr = Math.floor(Math.random() * 16);
      }

      const randomCo = randomValue();

      fieldCell[emtyOr].textContent = randomCo;
      fieldCell[emtyOr].classList.add(`field-cell--${randomCo}`);
    }
  }
}

function ArrowLeft() {
  let newValuePl = false;

  for (let r = 0; r < 4; r++) {
    const newAr = [];

    for (let i = 0; i < 4; i++) {
      const cer = fieldCell[i + (r * 4)].textContent;

      newAr.push(cer);
    }

    let caunt = 0;

    for (let l = 0; l < newAr.length; l++) {
      if (newAr[l] !== '') {
        for (let li = 0; li < newAr.length; li++) {
          if (newAr[l] === newAr[li] && li !== l) {
            caunt++;
            newAr[l] = `0, ${l}`;
            newAr[li] = `0, ${li}`;
          }
        }
      }
    }

    for (let c = 1; c < 4; c++) {
      const currElem = fieldCell[c + (r * 4)].textContent;

      if (currElem !== '') {
        let newCol = c;

        while (newCol > 0) {
          const prevElem = fieldCell[(newCol - 1) + (r * 4)].textContent;

          if (prevElem === '') {
            fieldCell[(newCol - 1) + (r * 4)].textContent = currElem;
            fieldCell[newCol + (r * 4)].textContent = '';
            newValuePl = true;

            fieldCell[(newCol - 1) + (r * 4)]
              .classList.add(`field-cell--${currElem}`);
            removeClass(fieldCell[newCol + (r * 4)]);
          } else if (prevElem === currElem && caunt > 0) {
            const total = (+prevElem) + (+currElem);

            fieldCell[(newCol - 1) + (r * 4)].textContent = '' + total;
            fieldCell[newCol + (r * 4)].textContent = '';
            score.textContent = (+score.textContent) + total;
            newValuePl = true;
            caunt--;
            removeClass(fieldCell[(newCol - 1) + (r * 4)]);

            fieldCell[(newCol - 1) + (r * 4)]
              .classList.add(`field-cell--${'' + total}`);
            removeClass(fieldCell[newCol + (r * 4)]);
          } else {
            break;
          }

          newCol--;
        }
      }
    }
  }

  if (newValuePl) {
    const lengthFil = fieldCell.filter(el => el.textContent === '');

    if (lengthFil.length > 0) {
      let emtyOr = Math.floor(Math.random() * 16);

      while (fieldCell[emtyOr].textContent !== '') {
        emtyOr = Math.floor(Math.random() * 16);
      }

      const randomCo = randomValue();

      fieldCell[emtyOr].textContent = randomCo;
      fieldCell[emtyOr].classList.add(`field-cell--${randomCo}`);
    }
  }
}

function ArrowRight() {
  let newValuePl = false;

  for (let r = 0; r < 4; r++) {
    const newAr = [];

    for (let i = 0; i < 4; i++) {
      const cer = fieldCell[i + (r * 4)].textContent;

      newAr.push(cer);
    }

    let caunt = 0;

    for (let l = 0; l < newAr.length; l++) {
      if (newAr[l] !== '') {
        for (let li = 0; li < newAr.length; li++) {
          if (newAr[l] === newAr[li] && li !== l) {
            caunt++;
            newAr[l] = `0, ${l}`;
            newAr[li] = `0, ${li}`;
          }
        }
      }
    }

    for (let c = 2; c >= 0; c--) {
      const currElem = fieldCell[c + (r * 4)].textContent;

      if (currElem !== '') {
        let newCol = c;

        while (newCol < 3) {
          const prevElem = fieldCell[(newCol + 1) + (r * 4)].textContent;

          if (prevElem === '') {
            fieldCell[(newCol + 1) + (r * 4)].textContent = currElem;
            fieldCell[newCol + (r * 4)].textContent = '';
            newValuePl = true;

            fieldCell[(newCol + 1) + (r * 4)]
              .classList.add(`field-cell--${currElem}`);
            removeClass(fieldCell[newCol + (r * 4)]);
          } else if (prevElem === currElem && caunt > 0) {
            const total = (+prevElem) + (+currElem);

            fieldCell[(newCol + 1) + (r * 4)].textContent = '' + total;
            fieldCell[newCol + (r * 4)].textContent = '';
            score.textContent = (+score.textContent) + total;
            newValuePl = true;
            caunt--;
            removeClass(fieldCell[(newCol + 1) + (r * 4)]);

            fieldCell[(newCol + 1) + (r * 4)]
              .classList.add(`field-cell--${'' + total}`);
            removeClass(fieldCell[newCol + (r * 4)]);
          } else {
            break;
          }

          newCol++;
        }
      }
    }
  }

  if (newValuePl) {
    const lengthFil = fieldCell.filter(el => el.textContent === '');

    if (lengthFil.length > 0) {
      let emtyOr = Math.floor(Math.random() * 16);

      while (fieldCell[emtyOr].textContent !== '') {
        emtyOr = Math.floor(Math.random() * 16);
      }

      const randomCo = randomValue();

      fieldCell[emtyOr].textContent = randomCo;
      fieldCell[emtyOr].classList.add(`field-cell--${randomCo}`);
    }
  }
}

function noMovesLeft() {
  let youCanMoove = true;

  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      const currentCell = fieldCell[c + r * 4];

      if (currentCell.textContent === '') {
        // there is an empty tile, so there are moves available
        youCanMoove = false;
      }

      const neighbors = [
        {
          row: r - 1, col: c,
        }, // The neighbor from above
        {
          row: r + 1, col: c,
        }, // Neighbor from below
        {
          row: r, col: c - 1,
        }, // Neighbor on the left
        {
          row: r, col: c + 1,
        }, // Neighbor on the right
      ];

      for (const neighbor of neighbors) {
        if (isValid(neighbor.row, neighbor.col)) {
          const neighborCell = fieldCell[neighbor.col + neighbor.row * 4];

          if (neighborCell.textContent === currentCell.textContent) {
            // You can merge with neighbors, there are available moves
            youCanMoove = false;
          }
        }
      }
    }
  }

  if (youCanMoove) {
    // there are no moves, so we show the message about defeat
    // and hide the message about victory if there is one.
    message[0].classList.remove('hidden');
    message[1].classList.add('hidden');
  }
}

// function to check that the passed arguments pass the correct tile location
function isValid(row, col) {
  return row >= 0 && row < 4 && col >= 0 && col < 4;
}

function youWon() {
  const youWond = fieldCell.some(el => el.textContent === '2048');

  // shows a win message
  if (youWond) {
    message[1].classList.remove('hidden');
  }
}

button.addEventListener('click', () => {
  restartGame();
  button.textContent = 'restart';
  button.classList.remove('start');
  button.classList.add('restart');
  message[2].classList.add('hidden');

  document.addEventListener('keydown', () => {
    if (event.key === 'ArrowUp') {
      ArrowUp();
      noMovesLeft();
      youWon();
    }

    if (event.key === 'ArrowDown') {
      ArrowDown();
      noMovesLeft();
      youWon();
    }

    if (event.key === 'ArrowLeft') {
      ArrowLeft();
      noMovesLeft();
      youWon();
    }

    if (event.key === 'ArrowRight') {
      ArrowRight();
      noMovesLeft();
      youWon();
    }
  });
});
