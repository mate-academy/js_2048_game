'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const gameField = document.querySelector('.game-field');
  const scores = document.querySelector('.game-score');
  const resultMessageWin = document.querySelector('.message-win');
  const resultMessageLose = document.querySelector('.message-lose');
  const messageStart = document.querySelector('.message-start');
  const start = document.querySelector('.start');
  const width = 4;
  const cells = [];
  let score = 0;

  function createField() {
    for (let i = 0; i < width * width; i++) {
      const cell = document.createElement('div');

      cell.classList.add('field-cell');

      cell.innerHTML = 0;
      gameField.appendChild(cell);
      cells.push(cell);
    }
  }
  createField();

  // click Start button
  start.addEventListener('click', () => {
    document.addEventListener('keyup', moveArrow);
    score = 0;
    scores.innerHTML = score;
    messageStart.classList.add('hidden');
    start.innerHTML = 'Restart';
    start.classList.add('restart');

    for (let i = 0; i < cells.length; i++) {
      cells[i].innerHTML = 0;

      resultMessageWin.classList.add('hidden');
      resultMessageLose.classList.add('hidden');
    }

    if (start.classList.contains('restart-lose')) {
      start.classList.remove('restart-lose');
      start.classList.add('restart');
    }

    generateNumber();
    addClassColor();
    generateNumber();
    addClassColor();
  });

  // function generateNumber() {
  //   const randomNumber = Math.floor(Math.random() * cells.length);

  //   if (cells[randomNumber].innerHTML == 0) {
  //     cells[randomNumber].innerHTML = 2;
  //     lose();
  //   }
  // }

  // function addNumber() {
  //   generateNumber();
  //     if (!waysRow() || !waysColumn()) {
  //       return;
  //     }

  // }

  // generate a number randomly
  function generateNumber() {
    const randomNumber = Math.floor(Math.random() * cells.length);

    if (cells[randomNumber].innerHTML == 0) {
      cells[randomNumber].innerHTML = 2;
      lose();
    } else {
      // if (!waysRow() && !waysColumn()) {
      //   return;
      // }

      generateNumber();
    }
  }

  // swipe right
  function moveRight() {
    for (let i = 0; i < cells.length; i++) {
      if (i % 4 === 0) {
        const one = cells[i].innerHTML;
        const two = cells[i + 1].innerHTML;
        const three = cells[i + 2].innerHTML;
        const four = cells[i + 3].innerHTML;

        const row = [Number(one), Number(two), Number(three), Number(four)];

        const filteredRowNum = row.filter(num => num !== 0);

        const zeros = Array(4 - filteredRowNum.length).fill(0);
        const newRow = zeros.concat(filteredRowNum);

        cells[i].innerHTML = newRow[0];
        cells[i + 1].innerHTML = newRow[1];
        cells[i + 2].innerHTML = newRow[2];
        cells[i + 3].innerHTML = newRow[3];
      }
    }
  }

  // swipe left
  function moveLeft() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        const one = cells[i].innerHTML;
        const two = cells[i + 1].innerHTML;
        const three = cells[i + 2].innerHTML;
        const four = cells[i + 3].innerHTML;

        const row = [Number(one), Number(two), Number(three), Number(four)];

        const filteredNum = row.filter(num => num !== 0);

        const zeros = Array(4 - filteredNum.length).fill(0);
        const newRow = filteredNum.concat(zeros);

        cells[i].innerHTML = newRow[0];
        cells[i + 1].innerHTML = newRow[1];
        cells[i + 2].innerHTML = newRow[2];
        cells[i + 3].innerHTML = newRow[3];
      }
    }
  }

  // swipe down
  function moveDown() {
    for (let i = 0; i < 4; i++) {
      const one = cells[i].innerHTML;
      const two = cells[i + width].innerHTML;
      const three = cells[i + width * 2].innerHTML;
      const four = cells[i + width * 3].innerHTML;

      const column = [Number(one), Number(two), Number(three), Number(four)];

      const filteredColumnNum = column.filter(num => num !== 0);

      const zeros = Array(4 - filteredColumnNum.length).fill(0);

      const newColumn = zeros.concat(filteredColumnNum);

      cells[i].innerHTML = newColumn[0];
      cells[i + width].innerHTML = newColumn[1];
      cells[i + width * 2].innerHTML = newColumn[2];
      cells[i + width * 3].innerHTML = newColumn[3];
    }
  }

  // swipe up
  function moveUp() {
    for (let i = 0; i < 4; i++) {
      const one = cells[i].innerHTML;
      const two = cells[i + width].innerHTML;
      const three = cells[i + width * 2].innerHTML;
      const four = cells[i + width * 3].innerHTML;

      const column = [Number(one), Number(two), Number(three), Number(four)];

      const filteredColumnNum = column.filter(num => num !== 0);

      const zeros = Array(4 - filteredColumnNum.length).fill(0);

      const newColumn = filteredColumnNum.concat(zeros);

      cells[i].innerHTML = newColumn[0];
      cells[i + width].innerHTML = newColumn[1];
      cells[i + width * 2].innerHTML = newColumn[2];
      cells[i + width * 3].innerHTML = newColumn[3];
    }
  }

  function combineRows() {
    for (let i = 0; i < 15; i++) {
      if (cells[i].innerHTML === cells[i + 1].innerHTML) {
        const combinedTotal
         = Number(cells[i].innerHTML) + Number(cells[i + 1].innerHTML);

        cells[i + 1].innerHTML = 0;
        cells[i].innerHTML = combinedTotal;
        score += combinedTotal;
        scores.innerHTML = score;
      }
    }
    win();
  }

  function combineColumn() {
    for (let i = 0; i < 12; i++) {
      if (cells[i].innerHTML === cells[i + width].innerHTML) {
        const combinedTotal
         = Number(cells[i].innerHTML) + Number(cells[i + width].innerHTML);

        cells[i].innerHTML = combinedTotal;
        cells[i + width].innerHTML = 0;
        score += combinedTotal;
        scores.innerHTML = score;
      }
    }
    win();
  }

  function moveArrow(e) {
    if (e.code === 'ArrowRight') {
      moveRight();
      // generateNumber();
      combineRows();
      addClassColor();
      moveRight();
      addClassColor();
      generateNumber();
      addClassColor();
    } else if (e.code === 'ArrowLeft') {
      moveLeft();
      //  generateNumber();
      combineRows();
      addClassColor();
      moveLeft();
      addClassColor();
      generateNumber();
      addClassColor();
    } else if (e.code === 'ArrowDown') {
      moveDown();
      //  generateNumber();
      combineColumn();
      addClassColor();
      moveDown();
      addClassColor();
      generateNumber();
      addClassColor();
    } else if (e.code === 'ArrowUp') {
      moveUp();
      //  generateNumber();
      combineColumn();
      addClassColor();
      moveUp();
      addClassColor();
      generateNumber();
      addClassColor();
    }
  }

  function win() {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].innerHTML == 2048) {
        messageStart.classList.add('hidden');
        resultMessageWin.classList.remove('hidden');
        document.removeEventListener('keyup', moveArrow);
      }
    }
  }

  function waysRow() {
    for (let i = 0; i < cells.length - 1; i++) {
      if (cells[i].innerHTML === cells[i + 1].innerHTML) {
        return true;
      }
    }

    return false;
  }

  function waysColumn() {
    for (let i = 0; i < 12; i++) {
      if (cells[i].innerHTML === cells[i + width].innerHTML) {
        return true;
      }
    }

    return false;
  }

  // no zeros on the field - game is over
  function lose() {
    let zeros = 0;

    for (let i = 0; i < cells.length; i++) {
      if (cells[i].innerHTML == 0) {
        zeros++;
      }
    }

    if (zeros === 0 && !waysRow() && !waysColumn()) {
      messageStart.classList.add('hidden');
      resultMessageLose.classList.remove('hidden');
      start.classList.remove('restart');
      start.classList.add('restart-lose');
      document.removeEventListener('keyup', moveArrow);
    }
  }

  function addClassColor() {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].innerHTML == 0) {
        cells[i].className = '';
        cells[i].classList.add('field-cell');
      } else if (cells[i].innerHTML == 2) {
        cells[i].className = '';
        cells[i].classList.add(`field-cell--2`, 'field-cell');
      } else if (cells[i].innerHTML == 4) {
        cells[i].className = '';
        cells[i].classList.add(`field-cell--4`, 'field-cell');
      } else if (cells[i].innerHTML == 8) {
        cells[i].className = '';
        cells[i].classList.add(`field-cell--8`, 'field-cell');
      } else if (cells[i].innerHTML == 16) {
        cells[i].className = '';
        cells[i].classList.add(`field-cell--16`, 'field-cell');
      } else if (cells[i].innerHTML == 32) {
        cells[i].className = '';
        cells[i].classList.add(`field-cell--32`, 'field-cell');
      } else if (cells[i].innerHTML == 64) {
        cells[i].className = '';
        cells[i].classList.add(`field-cell--64`, 'field-cell');
      } else if (cells[i].innerHTML == 128) {
        cells[i].className = '';
        cells[i].classList.add(`field-cell--128`, 'field-cell');
      } else if (cells[i].innerHTML == 256) {
        cells[i].className = '';
        cells[i].classList.add(`field-cell--256`, 'field-cell');
      } else if (cells[i].innerHTML == 512) {
        cells[i].className = '';
        cells[i].classList.add(`field-cell--512`, 'field-cell');
      } else if (cells[i].innerHTML == 1024) {
        cells[i].className = '';
        cells[i].classList.add(`field-cell--1024`, 'field-cell');
      } else if (cells[i].innerHTML == 2048) {
        cells[i].className = '';
        cells[i].classList.add(`field-cell--2048`, 'field-cell');
      }
    }
  }
});
