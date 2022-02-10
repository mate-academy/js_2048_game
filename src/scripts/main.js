'use strict';

// variables
const body = document.body;
const score = body.querySelector('.game-score');
let totalScore = 0;
const table = body.querySelector('tbody');
const cells = table.querySelectorAll('td');
const startButton = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const width = 4;

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

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].textContent === '') {
      emptyCells.push(i);
    }
  }

  if (emptyCells.length !== 0) {
    randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    cells[randomCell].textContent = 2;
    cells[randomCell].classList.add(`field-cell--2`);
  } else {
    checkForLose();
  }
}

// function move RIGHT
function moveRight() {
  for (let i = 0; i < cells.length; i++) {
    if (i % 4 === 0) {
      const one = cells[i].textContent;
      const two = cells[i + 1].textContent;
      const three = cells[i + 2].textContent;
      const four = cells[i + 3].textContent;
      const row = [
        parseInt(one), parseInt(two), parseInt(three), parseInt(four)];

      if (cells[i].classList.contains(`field-cell--${one}`)) {
        cells[i].classList.remove(`field-cell--${one}`);
      }

      if (cells[i + 1].classList.contains(`field-cell--${two}`)) {
        cells[i + 1].classList.remove(`field-cell--${two}`);
      }

      if (cells[i + 2].classList.contains(`field-cell--${three}`)) {
        cells[i + 2].classList.remove(`field-cell--${three}`);
      }

      if (cells[i + 3].classList.contains(`field-cell--${four}`)) {
        cells[i + 3].classList.remove(`field-cell--${four}`);
      }

      const filteredRow = row.filter(num => num);
      const empty = width - filteredRow.length;
      const emptyCells = Array(empty).fill('');
      const newRow = emptyCells.concat(filteredRow);

      cells[i].textContent = newRow[0];
      cells[i + 1].textContent = newRow[1];
      cells[i + 2].textContent = newRow[2];
      cells[i + 3].textContent = newRow[3];

      if (newRow[0] !== '') {
        cells[i].classList.add(`field-cell--${newRow[0]}`);
      }

      if (newRow[1] !== '') {
        cells[i + 1].classList.add(`field-cell--${newRow[1]}`);
      }

      if (newRow[2] !== '') {
        cells[i + 2].classList.add(`field-cell--${newRow[2]}`);
      }

      if (newRow[3] !== '') {
        cells[i + 3].classList.add(`field-cell--${newRow[3]}`);
      }
    }
  }
}

// function move LEFT
function moveLeft() {
  for (let i = 0; i < cells.length; i++) {
    if (i % 4 === 0) {
      const one = cells[i].textContent;
      const two = cells[i + 1].textContent;
      const three = cells[i + 2].textContent;
      const four = cells[i + 3].textContent;
      const row = [
        parseInt(one), parseInt(two), parseInt(three), parseInt(four)];

      if (cells[i].classList.contains(`field-cell--${one}`)) {
        cells[i].classList.remove(`field-cell--${one}`);
      }

      if (cells[i + 1].classList.contains(`field-cell--${two}`)) {
        cells[i + 1].classList.remove(`field-cell--${two}`);
      }

      if (cells[i + 2].classList.contains(`field-cell--${three}`)) {
        cells[i + 2].classList.remove(`field-cell--${three}`);
      }

      if (cells[i + 3].classList.contains(`field-cell--${four}`)) {
        cells[i + 3].classList.remove(`field-cell--${four}`);
      }

      const filteredRow = row.filter(num => num);
      const empty = width - filteredRow.length;
      const emptyCells = Array(empty).fill('');
      const newRow = filteredRow.concat(emptyCells);

      cells[i].textContent = newRow[0];
      cells[i + 1].textContent = newRow[1];
      cells[i + 2].textContent = newRow[2];
      cells[i + 3].textContent = newRow[3];

      if (newRow[0] !== '') {
        cells[i].classList.add(`field-cell--${newRow[0]}`);
      }

      if (newRow[1] !== '') {
        cells[i + 1].classList.add(`field-cell--${newRow[1]}`);
      }

      if (newRow[2] !== '') {
        cells[i + 2].classList.add(`field-cell--${newRow[2]}`);
      }

      if (newRow[3] !== '') {
        cells[i + 3].classList.add(`field-cell--${newRow[3]}`);
      }
    }
  }
}

// function move UP
function moveUp() {
  for (let i = 0; i < 4; i++) {
    const one = cells[i].textContent;
    const two = cells[i + width].textContent;
    const three = cells[i + (width * 2)].textContent;
    const four = cells[i + (width * 3)].textContent;
    const column = [
      parseInt(one), parseInt(two), parseInt(three), parseInt(four)];

    if (cells[i].classList.contains(`field-cell--${one}`)) {
      cells[i].classList.remove(`field-cell--${one}`);
    }

    if (cells[i + width].classList.contains(`field-cell--${two}`)) {
      cells[i + width].classList.remove(`field-cell--${two}`);
    }

    if (cells[i + (width * 2)].classList.contains(`field-cell--${three}`)) {
      cells[i + (width * 2)].classList.remove(`field-cell--${three}`);
    }

    if (cells[i + (width * 3)].classList.contains(`field-cell--${four}`)) {
      cells[i + (width * 3)].classList.remove(`field-cell--${four}`);
    }

    const filteredColumn = column.filter(num => num);
    const empty = width - filteredColumn.length;
    const emptyCells = Array(empty).fill('');
    const newColumn = filteredColumn.concat(emptyCells);

    cells[i].textContent = newColumn[0];
    cells[i + width].textContent = newColumn[1];
    cells[i + (width * 2)].textContent = newColumn[2];
    cells[i + (width * 3)].textContent = newColumn[3];

    if (newColumn[0] !== '') {
      cells[i].classList.add(`field-cell--${newColumn[0]}`);
    }

    if (newColumn[1] !== '') {
      cells[i + width].classList.add(`field-cell--${newColumn[1]}`);
    }

    if (newColumn[2] !== '') {
      cells[i + (width * 2)].classList.add(`field-cell--${newColumn[2]}`);
    }

    if (newColumn[3] !== '') {
      cells[i + (width * 3)].classList.add(`field-cell--${newColumn[3]}`);
    }
  }
}

// function move DOWN
function moveDown() {
  for (let i = 0; i < 4; i++) {
    const one = cells[i].textContent;
    const two = cells[i + width].textContent;
    const three = cells[i + (width * 2)].textContent;
    const four = cells[i + (width * 3)].textContent;
    const column = [
      parseInt(one), parseInt(two), parseInt(three), parseInt(four)];

    if (cells[i].classList.contains(`field-cell--${one}`)) {
      cells[i].classList.remove(`field-cell--${one}`);
    }

    if (cells[i + width].classList.contains(`field-cell--${two}`)) {
      cells[i + width].classList.remove(`field-cell--${two}`);
    }

    if (cells[i + (width * 2)].classList.contains(`field-cell--${three}`)) {
      cells[i + (width * 2)].classList.remove(`field-cell--${three}`);
    }

    if (cells[i + (width * 3)].classList.contains(`field-cell--${four}`)) {
      cells[i + (width * 3)].classList.remove(`field-cell--${four}`);
    }

    const filteredColumn = column.filter(num => num);
    const empty = width - filteredColumn.length;
    const emptyCells = Array(empty).fill('');
    const newColumn = emptyCells.concat(filteredColumn);

    cells[i].textContent = newColumn[0];
    cells[i + width].textContent = newColumn[1];
    cells[i + (width * 2)].textContent = newColumn[2];
    cells[i + (width * 3)].textContent = newColumn[3];

    if (newColumn[0] !== '') {
      cells[i].classList.add(`field-cell--${newColumn[0]}`);
    }

    if (newColumn[1] !== '') {
      cells[i + width].classList.add(`field-cell--${newColumn[1]}`);
    }

    if (newColumn[2] !== '') {
      cells[i + (width * 2)].classList.add(`field-cell--${newColumn[2]}`);
    }

    if (newColumn[3] !== '') {
      cells[i + (width * 3)].classList.add(`field-cell--${newColumn[3]}`);
    }
  }
}

// function combine rows
function combineRow() {
  for (let i = 0; i < 15; i++) {
    if (cells[i].textContent === cells[i + 1].textContent
        && cells[i].textContent !== '') {
      cells[i].classList.remove(`field-cell--${cells[i].textContent}`);
      cells[i + 1].classList.remove(`field-cell--${cells[i + 1].textContent}`);

      const total = parseInt(cells[i].textContent)
        + parseInt(cells[i + 1].textContent);

      cells[i].textContent = total;
      cells[i + 1].textContent = '';
      cells[i].classList.add(`field-cell--${cells[i].textContent}`);

      totalScore += total;

      score.textContent = totalScore;
    }
  }

  checkForWin();
}

// function combine column
function combineColumn() {
  for (let i = 0; i < 12; i++) {
    if (cells[i].textContent === cells[i + width].textContent
        && cells[i].textContent !== '') {
      cells[i].classList.remove(`field-cell--${cells[i].textContent}`);

      cells[i + width].classList
        .remove(`field-cell--${cells[i + width].textContent}`);

      const total = parseInt(cells[i].textContent)
        + parseInt(cells[i + width].textContent);

      cells[i].textContent = total;
      cells[i + width].textContent = '';
      cells[i].classList.add(`field-cell--${cells[i].textContent}`);

      totalScore += total;

      score.textContent = totalScore;
    }
  }

  checkForWin();
}

// function of moves by keyboard arrow
function moves(e) {
  const firstArrowClick = 0;

  switch (e.key) {
    // move UP
    case 'ArrowUp':
      e.preventDefault();
      StartToRestart(firstArrowClick);
      moveUp();
      combineColumn();
      moveUp();

      setTimeout(() => {
        generateNewNumber();
      }, 500);

      break;

    // move DOWN
    case 'ArrowDown':
      e.preventDefault();
      StartToRestart(firstArrowClick);
      moveDown();
      combineColumn();
      moveDown();

      setTimeout(() => {
        generateNewNumber();
      }, 500);
      break;

    // move LEFT
    case 'ArrowLeft':
      StartToRestart(firstArrowClick);
      moveLeft();
      combineRow();
      moveLeft();

      setTimeout(() => {
        generateNewNumber();
      }, 500);
      break;

    // move RIGHT
    case 'ArrowRight':
      StartToRestart(firstArrowClick);
      moveRight();
      combineRow();
      moveRight();

      setTimeout(() => {
        generateNewNumber();
      }, 500);
      break;
  }
}

// empty field
function emptyField() {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].classList.contains(`field-cell--${cells[i].textContent}`)) {
      cells[i].classList.remove(`field-cell--${cells[i].textContent}`);
    }

    cells[i].textContent = '';
  }
}

// function Win Message
function checkForWin() {
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].textContent === '2048') {
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

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].textContent === '') {
      emptyes++;
    }

    if ((i + 1) % 4 !== 0) {
      if (cells[i].textContent === cells[i + 1].textContent) {
        equalRow++;
      }
    }

    if (i < 12) {
      if (cells[i].textContent === cells[i + width].textContent) {
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
