'use strict';

const startButton = document.querySelector('button.button.start');
const listCells = document.querySelectorAll('.field-cell');
let firstField = 0;
let secondField = 0;

startButton.addEventListener('click', () => {
  start();
});

function randomNumbForStart() {
  const min = 1;
  const max = 16;

  firstField = Math.floor(Math.random() * (max - min)) + min;
  secondField = Math.floor(Math.random() * (max - min)) + min;

  while (secondField === firstField) {
    secondField = Math.floor(Math.random() * (max - min)) + min;
  }

  return [firstField, secondField];
}

function start() {
  const arr = randomNumbForStart();

  for (let i = 0; i < listCells.length; i++) {
    listCells[i].className = '';
    listCells[i].classList.add('field-cell');
    listCells[i].textContent = '';
  }

  startButton.classList.remove('start');
  startButton.classList.add('restart');
  startButton.textContent = 'Restart';
  listCells[arr[0]].textContent = '2';
  listCells[arr[1]].textContent = '2';
  listCells[arr[0]].classList.add('field-cell--2');
  listCells[arr[1]].classList.add('field-cell--2');
}
