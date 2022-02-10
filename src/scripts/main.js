'use strict';

// variables
const score = document.querySelector('.game-score');
let totalScore = 0;
let addingCount = 0;
const cells = document.querySelectorAll('td');
const startButton = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const width = 4;
const resultField = Array(cells.length).fill('');

// function to Start Game
function StartToRestart(num) {
  let clickNum = num;

  clickNum++;

  if (clickNum === 1 && startButton.classList.contains('start')) {
    startButton.classList.add('restart');
    startButton.classList.remove('start');
    startButton.textContent = 'Restart';
    clickNum = 0;
  }
}

// function to generate new 2 or 4 on field
function generateNewNumber() {
  const emptyCells = [];
  let randomCell;

  addingCount++;

  for (let i = 0; i < resultField.length; i++) {
    if (resultField[i] === '') {
      emptyCells.push(i);
    }
  }

  if (emptyCells.length !== 0) {
    randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    if (Number.isInteger((10 * addingCount) / 100)) {
      resultField[randomCell] = 4;
      fillField(resultField);
    } else {
      resultField[randomCell] = 2;
      fillField(resultField);
    }
  } else {
    checkForLose();
  }
}

// function to fill the field
function fillField(array) {
  for (let i = 0; i < array.length; i++) {
    cells[i].textContent = array[i];

    if (array[i] === '') {
      cells[i].className = 'field-cell';
    } else {
      cells[i].className = `field-cell field-cell--${array[i]}`;
    }
  }
}

// function move RIGHT
function moveRight(array) {
  for (let i = 0; i < array.length; i++) {
    if (i % 4 === 0) {
      const one = array[i];
      const two = array[i + 1];
      const three = array[i + 2];
      const four = array[i + 3];
      const row = [
        parseInt(one), parseInt(two), parseInt(three), parseInt(four)];

      const filteredRow = row.filter(num => num);
      const empty = width - filteredRow.length;
      const emptyCells = Array(empty).fill('');
      const newRow = emptyCells.concat(filteredRow);

      array[i] = newRow[0];
      array[i + 1] = newRow[1];
      array[i + 2] = newRow[2];
      array[i + 3] = newRow[3];
    }
  }

  return array;
}

// function move LEFT
function moveLeft(array) {
  for (let i = 0; i < array.length; i++) {
    if (i % 4 === 0) {
      const one = array[i];
      const two = array[i + 1];
      const three = array[i + 2];
      const four = array[i + 3];
      const row = [
        parseInt(one), parseInt(two), parseInt(three), parseInt(four)];

      const filteredRow = row.filter(num => num);
      const empty = width - filteredRow.length;
      const emptyCells = Array(empty).fill('');
      const newRow = filteredRow.concat(emptyCells);

      array[i] = newRow[0];
      array[i + 1] = newRow[1];
      array[i + 2] = newRow[2];
      array[i + 3] = newRow[3];
    }
  }

  return array;
}

// function move UP
function moveUp(array) {
  for (let i = 0; i < width; i++) {
    const one = array[i];
    const two = array[i + width];
    const three = array[i + (width * 2)];
    const four = array[i + (width * 3)];
    const column = [
      parseInt(one), parseInt(two), parseInt(three), parseInt(four)];

    const filteredColumn = column.filter(num => num);
    const empty = width - filteredColumn.length;
    const emptyCells = Array(empty).fill('');
    const newColumn = filteredColumn.concat(emptyCells);

    array[i] = newColumn[0];
    array[i + width] = newColumn[1];
    array[i + (width * 2)] = newColumn[2];
    array[i + (width * 3)] = newColumn[3];
  }

  return array;
}

// function move DOWN
function moveDown(array) {
  for (let i = 0; i < width; i++) {
    const one = array[i];
    const two = array[i + width];
    const three = array[i + (width * 2)];
    const four = array[i + (width * 3)];
    const column = [
      parseInt(one), parseInt(two), parseInt(three), parseInt(four)];

    const filteredColumn = column.filter(num => num);
    const empty = width - filteredColumn.length;
    const emptyCells = Array(empty).fill('');
    const newColumn = emptyCells.concat(filteredColumn);

    array[i] = newColumn[0];
    array[i + width] = newColumn[1];
    array[i + (width * 2)] = newColumn[2];
    array[i + (width * 3)] = newColumn[3];
  }

  return array;
}

// function combine rows
function combineRow(array) {
  for (let i = 0; i < array.length; i++) {
    if ((i + 1) % 4 !== 0) {
      if (array[i] === array[i + 1]
          && array[i] !== '') {
        const total = array[i] + array[i + 1];

        array[i] = total;
        array[i + 1] = '';

        totalScore += total;

        score.textContent = totalScore;
      }
    }
  }

  checkForWin();

  return array;
}

// function combine column
function combineColumn(array) {
  for (let i = 0; i < array.length - width; i++) {
    if (array[i] === array[i + width] && array[i] !== '') {
      const total = parseInt(array[i]) + parseInt(array[i + width]);

      array[i] = total;
      array[i + width] = '';
      totalScore += total;

      score.textContent = totalScore;
    }
  }

  checkForWin();

  return array;
}

// function of moves by keyboard arrow
function moves(e) {
  const firstArrowClick = 0;

  switch (e.key) {
    // move UP
    case 'ArrowUp':
      e.preventDefault();
      StartToRestart(firstArrowClick);
      moveUp(resultField);
      combineColumn(resultField);
      moveUp(resultField);
      fillField(resultField);

      generateNewNumber();
      break;

    // move DOWN
    case 'ArrowDown':
      e.preventDefault();
      StartToRestart(firstArrowClick);
      moveDown(resultField);
      combineColumn(resultField);
      moveDown(resultField);
      fillField(resultField);

      generateNewNumber();
      break;

    // move LEFT
    case 'ArrowLeft':
      StartToRestart(firstArrowClick);
      moveLeft(resultField);
      combineRow(resultField);
      moveLeft(resultField);
      fillField(resultField);

      generateNewNumber();
      break;

    // move RIGHT
    case 'ArrowRight':
      StartToRestart(firstArrowClick);
      moveRight(resultField);
      combineRow(resultField);
      moveRight(resultField);
      fillField(resultField);

      generateNewNumber();
      break;
  }
}

// empty field
function emptyField() {
  for (let i = 0; i < resultField.length; i++) {
    resultField[i] = '';
  }

  fillField(resultField);
}

// function Win Message
function checkForWin() {
  for (let i = 0; i < resultField.length; i++) {
    if (resultField[i] === 2048) {
      winMessage.classList.remove('hidden');

      document.removeEventListener('keydown', moves);
    }
  }
}

// function Lose Message
function checkForLose() {
  let emptyes = 0;
  let equalRow = 0;
  let equalColumn = 0;

  for (let i = 0; i < resultField.length; i++) {
    if (resultField[i] === '') {
      emptyes++;
    }

    if ((i + 1) % 4 !== 0) {
      if (resultField[i] === resultField[i + 1]) {
        equalRow++;
      }
    }

    if (i < 12) {
      if (resultField[i] === resultField[i + width]) {
        equalColumn++;
      }
    }
  }

  if (equalRow === 0 && equalColumn === 0 && emptyes === 0) {
    loseMessage.classList.remove('hidden');

    document.removeEventListener('keydown', moves);
  }
}

// listener on click START button and all game engine
startButton.addEventListener('click', (evn) => {
  startMessage.classList.add('hidden');

  if (evn.target.classList.contains('start')) {
    addingCount = 0;
    score.textContent = 0;
    emptyField();
    generateNewNumber();
    generateNewNumber();
  }

  if (evn.target.classList.contains('restart')) {
    startMessage.classList.remove('hidden');
    startButton.classList.add('start');
    startButton.classList.remove('restart');
    startButton.textContent = 'Start';
    emptyField();
  }

  document.addEventListener('keydown', moves);
});
