'use strict';

let cells = [...document.querySelectorAll('td')];
const score = document.querySelector('.game-score');
const button = document.querySelector('.start');
const startMassage = document.querySelector('.message-start');
const winMassage = document.querySelector('.message-win');

button.addEventListener('click', () => {
  startMassage.classList.add('hidden');
  button.className = 'button restart';
  button.innerText = 'Restart';

  const restart = document.querySelector('.restart');

  restart.addEventListener('click', () => {
    location.reload();
  });

  document.addEventListener('keydown', (e) => {
    if (cells.some(cell => cell.innerHTML === '2048')) {
      winMassage.classList.remove('hidden');
    }

    if (e.code === 'ArrowLeft') {
      sumContantRow('left');
      addSortRowClasses('left');
    }

    if (e.code === 'ArrowRight') {
      sumContantRow('rigth');
      addSortRowClasses('right');
    }

    if (e.code === 'ArrowUp') {
      sumContantColumn('up');
    }

    if (e.code === 'ArrowDown') {
      sumContantColumn('down');
    }
    generateNewCell();
    checkGameOver();
  });

  function generateNewCell() {
    addUpdatedClassCell();

    const i = Math.floor(Math.random() * cells.length);
    const four = Math.floor(Math.random() * 9);

    if (cells.every(a => a.className !== 'field-cell')) {
      return;
    }

    if (cells[i].className === 'field-cell') {
      cells[i].className = four === 4
        ? 'field-cell field-cell--4' : 'field-cell field-cell--2';

      cells[i].innerText = four === 4 ? 4 : 2;

      return;
    }
    generateNewCell();
  }

  generateNewCell();
  generateNewCell();

  function addSortRowClasses(direction) {
    const rows = [...document.querySelectorAll('.field-row')];
    const classes = [];

    for (const row of [...rows]) {
      const sortRowLeft = [];
      const sortRigth = [];

      for (const cell of [...row.cells]) {
        if (cell.className === 'field-cell') {
          sortRigth.push(cell.className);
        } else {
          sortRowLeft.push(cell.className);
        }
      }

      if (direction === 'left') {
        classes.push(...sortRowLeft, ...sortRigth);
      };

      if (direction === 'right') {
        classes.push(...sortRigth, ...sortRowLeft);
      }
    }

    for (let i = 0; i < cells.length; i++) {
      cells[i].className = classes[i];
    }
  }

  function sortColumnClasses() {
    const classesColumn = [];
    let count = -1;

    for (let i = 0; i < cells.length; i++) {
      count++;

      if (!classesColumn[i] && i <= 3) {
        classesColumn[i] = {
          top: [],
          bottom: [],
        };
      }

      if (cells[i].className === 'field-cell') {
        classesColumn[count].top.push(cells[i].className);
      } else {
        classesColumn[count].bottom.push(cells[i].className);
      }

      if (count === 3) {
        count = -1;
      }
    }

    return classesColumn;
  }

  function addColumnClasses(direction) {
    const some = direction === 'down'
      ? sortColumnClasses().map(a => [...a.top, ...a.bottom])
      : sortColumnClasses().map(a => [...a.bottom, ...a.top]);

    let row = -1;
    let column = 0;

    for (let i = 0; i < cells.length; i++) {
      row++;

      cells[i].className = some[row][column];

      if (row === 3) {
        row = -1;
        column++;
      }
    }
  }

  function addUpdatedClassCell() {
    cells = [...document.querySelectorAll('td')];

    for (let i = 0; i < cells.length; i++) {
      if (cells[i].className === 'field-cell') {
        cells[i].innerText = '';
      }

      if (cells[i].className !== 'field-cell') {
        const index = cells[i].className.indexOf('--');
        const value = cells[i].className.slice(index + 2);

        cells[i].innerText = value;
      }
    }
  }

  function sumContantRow(direction) {
    const rows = [...document.querySelectorAll('.field-row')];

    for (const row of rows) {
      if (direction === 'left') {
        for (let i = 0; i < row.cells.length - 1; i++) {
          addSortRowClasses('left');
          addUpdatedClassCell();

          const cell = row.cells[i];
          const cellNext = cell.nextElementSibling;

          if ((cell.innerText === cellNext.innerText)
            && cell.innerText.length) {
            cell.innerText = (+cell.innerText * 2);
            cell.className = `field-cell field-cell--${cell.innerText}`;
            score.innerHTML = +score.innerHTML + +cell.innerHTML;
            cellNext.className = 'field-cell';
            cellNext.innerText = '';
            addSortRowClasses('left');
          }
        }
      }

      if (direction === 'rigth') {
        for (let i = row.cells.length - 1; i > 0; i--) {
          addSortRowClasses('right');
          addUpdatedClassCell();

          const cell = row.cells[i];
          const cellNext = cell.previousElementSibling;

          if ((cell.innerText === cellNext.innerText)
            && cell.innerText.length) {
            cell.innerText = (+cell.innerText * 2);
            cell.className = `field-cell field-cell--${cell.innerText}`;
            score.innerHTML = +score.innerHTML + +cell.innerHTML;
            cellNext.className = 'field-cell';
            cellNext.innerText = '';
            addSortRowClasses('right');
          }
        }
      }
    }
  }

  function sumContantColumn(direction) {
    const rows = [...document.querySelectorAll('.field-row')];

    if (direction === 'up') {
      for (let b = 0; b < rows.length - 1; b++) {
        const sibling = rows[b].nextElementSibling;

        for (let i = 0; i < rows.length; i++) {
          addColumnClasses();
          addUpdatedClassCell();

          const cell = rows[b].cells[i];

          if (cell.innerText === sibling.cells[i].innerText && cell.innerText) {
            cell.innerText = +cell.innerText * 2;
            cell.className = `field-cell field-cell--${cell.innerText}`;
            score.innerHTML = +score.innerHTML + +cell.innerHTML;
            sibling.cells[i].className = 'field-cell';
            sibling.cells[i].innerText = '';
            addColumnClasses();
          }
        }
      }
    }

    if (direction === 'down') {
      for (let b = rows.length - 1; b > 0; b--) {
        const sibling = rows[b].previousElementSibling;

        for (let i = 0; i < rows.length; i++) {
          addColumnClasses('down');
          addUpdatedClassCell();

          const cell = rows[b].cells[i];

          if (cell.innerText === sibling.cells[i].innerText && cell.innerText) {
            cell.innerText = +cell.innerText * 2;
            cell.className = `field-cell field-cell--${cell.innerText}`;
            score.innerHTML = +score.innerHTML + +cell.innerHTML;
            sibling.cells[i].className = 'field-cell';
            sibling.cells[i].innerText = '';
            addColumnClasses('down');
          }
        }
      }
    }
  }
});

function checkGameOver() {
  const rows = [...document.querySelectorAll('.field-row')];
  let count = 0;

  for (let b = rows.length - 1; b >= 0; b--) {
    const row = rows[b];

    for (let i = 1; i < row.cells.length; i++) {
      const cell = row.cells[i].innerText;
      const nextCell = row.cells[i - 1].innerText;

      if (b === 0) {
        if (cell === nextCell) {
          count++;
        }
      } else {
        if (cell === nextCell
          || cell
          === row.previousElementSibling.cells[i].innerText) {
          count++;
        }
      }
    }
  }

  if (!cells.some(cell => cell.className === 'field-cell') && !count) {
    const loseMassage = document.querySelector('.message-lose');

    loseMassage.classList.remove('hidden');
  }
}
