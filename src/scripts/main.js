'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const gameField = document.querySelector('.game-field');
  const scores = document.querySelector('.game-score');
  const resultMessageWin = document.querySelector('.message-win');
  const resultMessageLose = document.querySelector('.message-lose');
  const messageStart = document.querySelector('.message-start');
  const start = document.querySelector('.start');
  // const reStart = document.querySelector('.restart-lose');
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

    // generateNumber();
    // generateNumber();
  }

  createField();

  // click Start button
  start.addEventListener('click', () => {
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
    generateNumber();
    document.addEventListener('keyup', moveArror);
  });

  // generate a number randomly
  function generateNumber() {
    const randomNumber = Math.floor(Math.random() * cells.length);

    if (cells[randomNumber].innerHTML == 0) {
      cells[randomNumber].innerHTML = 2;
      lose();
    } else {
      generateNumber();
    }

    // if (cells[randomNumber].innerHTML > 0) {
    //   cells[randomNumber].classList.add(`x${randomNumber}`);
    // } else if (cells[randomNumber].innerHTML == 2048) {
    //   cells[randomNumber].classList.add('2048');
    // }

    // console.log(cells[randomNumber]);

    // if (cells[randomNumber].innerHTML == 2) {
    //   cells[randomNumber].classList.add(`x${2}`);
    // } else if (cells[randomNumber].innerHTML == 4) {
    //   cells[randomNumber].classList.add('x4');
    // } else if (cells[randomNumber].innerHTML == 8) {
    //   cells[randomNumber].classList.add('x8');
    // }

    // console.log(cells[randomNumber]);
  };

  // function addClasses(randomNumber, cell) {
  //   if (cells[randomNumber].innerHTML > 0) {
  //     cells[randomNumber].classList.add(`x${randomNumber}`);
  //   } else if (cells[randomNumber].innerHTML === 2048) {
  //     cells[randomNumber].classList.add('2048');
  //   }
  // }

  // addClasses();

  // swipe right
  function moveRight() {
    for (let i = 0; i < cells.length; i++) {
      if (i % 4 === 0) {
        const totalOne = cells[i].innerHTML;
        const totalTwo = cells[i + 1].innerHTML;
        const totalThree = cells[i + 2].innerHTML;
        const totalFour = cells[i + 3].innerHTML;

        const row = [Number(totalOne), Number(totalTwo), Number(totalThree), Number(totalFour)];

        const filteredRow = row.filter(num => num);

        const missing = 4 - filteredRow.length;

        const zeros = Array(missing).fill(0);

        const newRow = zeros.concat(filteredRow);

        cells[i].innerHTML = newRow[0];
        cells[i + 1].innerHTML = newRow[1];
        cells[i + 2].innerHTML = newRow[2];
        cells[i + 3].innerHTML = newRow[3];
      }
    }
  }

  // moveRight();

  // swipe left

  function moveLeft() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        const totalOne = cells[i].innerHTML;
        const totalTwo = cells[i + 1].innerHTML;
        const totalThree = cells[i + 2].innerHTML;
        const totalFour = cells[i + 3].innerHTML;

        const row = [Number(totalOne), Number(totalTwo), Number(totalThree), Number(totalFour)];

        const filteredRow = row.filter(num => num);

        const missing = 4 - filteredRow.length;

        const zeros = Array(missing).fill(0);

        const newRow = filteredRow.concat(zeros);

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
      const totalOne = cells[i].innerHTML;
      const totalTwo = cells[i + width].innerHTML;
      const totalThree = cells[i + width * 2].innerHTML;
      const totalFour = cells[i + width * 3].innerHTML;

      const column = [Number(totalOne), Number(totalTwo), Number(totalThree), Number(totalFour)];

      const filteredColumn = column.filter(num => num);

      const missing = 4 - filteredColumn.length;

      const zeros = Array(missing).fill(0);

      const newColumn = zeros.concat(filteredColumn);

      cells[i].innerHTML = newColumn[0];
      cells[i + width].innerHTML = newColumn[1];
      cells[i + width * 2].innerHTML = newColumn[2];
      cells[i + width * 3].innerHTML = newColumn[3];
    }
  }

  // swipe up

  function moveUp() {
    for (let i = 0; i < 4; i++) {
      const totalOne = cells[i].innerHTML;
      const totalTwo = cells[i + width].innerHTML;
      const totalThree = cells[i + width * 2].innerHTML;
      const totalFour = cells[i + width * 3].innerHTML;

      const column = [Number(totalOne), Number(totalTwo), Number(totalThree), Number(totalFour)];

      const filteredColumn = column.filter(num => num);

      const missing = 4 - filteredColumn.length;

      const zeros = Array(missing).fill(0);

      const newColumn = filteredColumn.concat(zeros);

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

        cells[i + 1].innerHTML = combinedTotal;
        cells[i].innerHTML = 0;
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

  // keycodes
  // function control(e) {
  //   if (e.keyCode === 39) {
  //     keyRight();
  //   } else if (e.keyCode === 37) {
  //     keyLeft();
  //   } else if (e.keyCode === 38) {
  //     keyUp();
  //   } else if (e.keyCode === 40) {
  //     keyDown();
  //   }
  // }

  // document.addEventListener('keyup', control);

  // document.addEventListener('keyup', (e) => {
  function moveArror(e) {
    if (e.code === 'ArrowRight') {
      moveRight();
      combineRows();
      moveRight();
      generateNumber();
    } else if (e.code === 'ArrowLeft') {
      moveLeft();
      combineRows();
      moveLeft();
      generateNumber();
    } else if (e.code === 'ArrowDown') {
      moveDown();
      combineColumn();
      moveDown();
      generateNumber();
    } else if (e.code === 'ArrowUp') {
      moveUp();
      combineColumn();
      moveUp();
      generateNumber();
    }
  }

  document.addEventListener('keyup', moveArror);

  // function keyRight() {
  //   moveRight();
  //   combineRows();
  //   moveRight();
  //   generateNumber();
  // }

  // function keyLeft() {
  //   moveLeft();
  //   combineRows();
  //   moveLeft();
  //   generateNumber();
  // }

  // function keyDown() {
  //   moveDown();
  //   combineColumn();
  //   moveDown();
  //   generateNumber();
  // }

  // function keyUp() {
  //   moveUp();
  //   combineColumn();
  //   moveUp();
  //   generateNumber();
  // }

  function win() {
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].innerHTML == 2048) {
        messageStart.classList.add('hidden');
        resultMessageWin.classList.remove('hidden');
        document.removeEventListener('keyup', moveArror);
      }
    }
  }

  // no zeros on the field - game is over
  function lose() {
    let zeros = 0;

    for (let i = 0; i < cells.length; i++) {
      if (cells[i].innerHTML == 0) {
        zeros++;
      }
    }

    if (zeros === 0) {
      messageStart.classList.add('hidden');
      resultMessageLose.classList.remove('hidden');
      start.classList.remove('restart');
      start.classList.add('restart-lose');
      document.removeEventListener('keyup', moveArror);
    }
  }

  // function addClassColor(num) {
  //   for (let i = 0; i < cells.length; i++) {
  //     if (cells[i].innerHTML === num || num > 0) {
  //       // cells[i].className = `field-cell x${num}`;
  //       cells[i].classList.add(`field-cell x${num}`);
  //     }
  //   }
  // }

  // addColorClass();

  // for (let i = 0; i < cells.length; i++) {
  //   const num = cells[i];

  //   if (cells[i].innerHTML > 0) {
  //     // cells[i].classList.add(`x${cells[i]}`);
  //     cells[i].className = `field-cell x${num}`;
  //   } else if (cells[i].innerHTML == 2048) {
  //     cells[i].classList.add('2048');
  //   }

  //   console.log(cells[i]);
  // }
  // =======
  // const num = cells[i];

  //       if (cells[i].innerHTML > 0) {
  //         // cells[i].classList.add(`x${cells[i]}`);
  //         // cells[i].className = `field-cell x${num}`;
  //         cells[i].classList.add(`field-cell x${num}`);
  //       } else if (cells[i].innerHTML == 2048) {
  //         cells[i].classList.add('2048');
  //       }
});
