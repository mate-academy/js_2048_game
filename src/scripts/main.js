'use strict';

function getRandonCell() {
  let randomCellIndex;

  do {
    randomCellIndex = Math.floor(Math.random() * 16);
  } while (fields[randomCellIndex].classList.length > 1);

  return randomCellIndex;
}

function appearingTwoCells() {
  const firstIndex = getRandonCell();
  const firstField = fields[firstIndex];

  firstField.textContent = `${number1}`;

  if (number1 === '2') {
    firstField.classList.add('field-cell--2');
  } else {
    firstField.classList.add('field-cell--4');
  }

  const secondIndex = getRandonCell();
  const secondField = fields[secondIndex];

  secondField.textContent = `${number2}`;

  if (number2 === '2') {
    secondField.classList.add('field-cell--2');
  } else {
    secondField.classList.add('field-cell--4');
  }
}

const fields = document.querySelectorAll('.field-cell');
const startButton = document.querySelector('.button');

const arrOfFirstNumbers = ['2', '2', '2', '2', '2', '4', '2', '2', '2', '2'];
const randomIndex1 = Math.floor(Math.random() * 10);
const randomIndex2 = Math.floor(Math.random() * 10);
const number1 = arrOfFirstNumbers[randomIndex1];
const number2 = arrOfFirstNumbers[randomIndex2];

startButton.addEventListener('click', () => {
  startButton.textContent = 'restart';
  startButton.classList.add('restart');

  appearingTwoCells();
});

// addEventListener('keydown', (event) => {
//   if (event.code === 'ArrowLeft') {
//     console.log('left');
//   }

//   if (event.code === 'ArrowRight') {
//     console.log('right');
//   }

//   if (event.code === 'ArrowUp') {
//     console.log('up');
//   }

//   if (event.code === 'ArrowDown') {
//     console.log('down');
//   }
// });

// const table = [
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
//   [0, 0, 0, 0],
// ];

// function tableAddValue(index) {
//   switch (index) {
//     case 0:
//       table[0][0] = 2;

//       break;
//     case 1:
//       table[0][1] = 2;

//       break;
//     case 2:
//       table[0][2] = 2;

//       break;
//     case 3:
//       table[0][3] = 2;

//       break;
//     case 4:
//       table[1][0] = 2;

//       break;
//   }

//   console.log(table);
// }

// tableAddValue(2);
