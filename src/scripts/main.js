/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
'use strict';

const Game = require('../modules/Game.class');
const game = new Game();

const cels = document.querySelectorAll('td');
const emptyCell = cels[0].textContent;

// work at the every click
function spawnCellByClick(e) {
  // if (isGameEnd()) {
  //   console.clear();
  //   console.log('Spawn by click, GAME END');

  //   document.removeEventListener('keydown', spawnCellByClick);
  //   return;
  // }
  if (
    e.key === 'ArrowUp' ||
    e.key === 'ArrowDown' ||
    e.key === 'ArrowLeft' ||
    e.key === 'ArrowRight'
  ) {
    spawnCell();
  }
}

function spawnCell() {
  console.log('SpawnCell on!');

  const index = getRandom(-1, cels.length, cels);

  if (index === undefined) {
    return;
  }

  const value = Math.random() < 0.9 ? '2' : '4';

  cels[index].classList.add(`field-cell--${value}`);
  cels[index].textContent = value;
}

function getRandom(max, min, celsElements) {
  const resultIndex = Math.floor(Math.random() * (max - min + 1)) + min;

  if (!isMixPossible()) {
    console.log('Mix is not possible');
  }

  if (isFiedFull()) {
    console.log('Field is full!');

    return;
  }

  if (!isCellEmpty(celsElements[resultIndex]) && !isFiedFull()) {
    return getRandom(max, min, celsElements);
  }

  return resultIndex;
}

function isCellEmpty(cell) {
  return cell.textContent === emptyCell;
}

function isFiedFull() {
  const celsElements = document.querySelectorAll('td');

  for (const cel of celsElements) {
    if (isCellEmpty(cel, celsElements)) {
      return false;
    }
  }

  return true;
}

// #region start

function restart() {
  const celsElements = Array.from(document.querySelectorAll('td'));
  const messageStart = document.querySelector('.message-start');

  celsElements.forEach((cell) => {
    if (cell.textContent !== emptyCell) {
      cell.textContent = emptyCell;
      cell.className = '';
      cell.classList.add('field-cell');
    }
  });
  operationBtn.classList.remove('restart');
  operationBtn.classList.add('start');
  operationBtn.textContent = 'Start';
  messageStart.classList.remove('hidden');
}

const operationBtn = document.querySelector('.start');
let clkCount = 0;

operationBtn.addEventListener('click', () => {
  if (clkCount > 0) {
    restart();
    clkCount = 0;

    return;
  }

  clkCount++;
  start();
});

// #endregion

function compareCells(firstCell, secondCell) {
  // console.log('compareCellsFN on');

  if (!isCellEmpty(firstCell) && !isCellEmpty(secondCell)) {
    // console.log('--------------------------------------------------');
    // console.log('FIRST CELL FROM COMPARECELLS',firstCell.textContent);
    // console.log('SECOND CELL FROM COMPARECELLS',secondCell.textContent);
    // console.log('--------------------------------------------------');
    // if (firstCell.textContent === secondCell.textContent){
    //   console.log('POSSIBLE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', firstCell, secondCell);
    // }

    return firstCell.textContent === secondCell.textContent;
  }

  return false;
}

function moveRight() {
  document.addEventListener('keydown', handleClick);

  function handleClick(e) {
    console.clear();

    if (e.key !== 'ArrowRight') {
      return;
    }

    if (isGameEnd()) {
      // console.log('remove listner');

      document.removeEventListener('keydown', handleClick);
    }

    const rows = document.querySelectorAll('tr');

    rows.forEach((row) => {
      let mixCount = 0;

      for (let i = 0; i < row.children.length; i++) {
        if (!isCellEmpty(row.children[i])) {
          // console.log('----------first filled cell found-----------', row.children[i]);

          for (let j = i + 1; j < row.children.length; j++) {
            if (!isCellEmpty(row.children[j])) {
              // console.log('second filled cell found', row.children[j]);

              if (compareCells(row.children[i], row.children[j])) {
                // console.log('mix is possible');
                const cellValue = Number(row.children[i].textContent) * 2;

                row.children[i].textContent = '';
                row.children[i].className = 'field-cell';

                row.children[j].textContent = cellValue;

                row.children[j].className =
                  `field-cell field-cell--${cellValue}`;
                // console.log('compare succesfull');
                mixCount++;
              } else {
                // console.log('Compare was not succesfull');
              }
              break;
            }

            if (isCellEmpty(row.children[j])) {
              const tempCellValue = row.children[i].textContent;
              const tempCellClassName = row.children[i].className;

              row.children[i].textContent = '';
              row.children[i].className = 'field-cell';
              // тут я чищу елемент який був рахується як first filled cell, тому потім
              // це викличе проблеми при поєднуванні двох клітинок в одну

              if (isCellEmpty(row.children[j])) {
                i = j;
              }

              row.children[i].textContent = tempCellValue;
              row.children[i].className = tempCellClassName;

              // console.log('transport completed', 'index:',i);
              // console.log('j', j);
            }
          }

          if (mixCount > 0) {
            break;
          }
        }
      }
    });
  }
}

function isMixPossible() {
  const allRows = document.querySelectorAll('tr');
  let result = null;
  // let numberRow = 1;

  allRows.forEach((row) => {
    // console.log('row number:', numberRow);
    // numberRow++;

    for (let i = 0; i < row.children.length - 1; i++) {
      result = compareCells(row.children[i], row.children[i + 1]);

      if (result) {
        // console.log('Value from isMixPossibleFn', result, numberRow);
        return true;
      }
    }
  });

  // potential problem
  // функція перевіряє чи можуть поєднюватися дві сусідні клітки, але поєднування також можливе якщо
  // клітки знаходяться в різних частинах дошки або якщо між ними стоїть пуста клітка
  // питання в тому чи функція яка рухає клітки по полю спрацьовує швидше

  return false;
}

function moveLeft() {
  document.addEventListener('keydown', handleClick);

  function handleClick(e) {
    if (e.key !== 'ArrowLeft') {
      return;
    }
    console.clear();
    console.log('moveLeft works');

    const rows = document.querySelectorAll('tr');

    rows.forEach((row) => {
      console.log('row');

      let mixCount = 0;

      for (let i = row.children.length - 1; i >= 0; i--) {
        console.log(row.children[i]);

        if (!isCellEmpty(row.children[i])) {
          console.log('found first filled cell, from moveLeft');

          for (let j = i - 1; j >= 0; j--) {
            if (!isCellEmpty(row.children[j])) {
              // console.log('second filled cell found', row.children[j]);

              if (compareCells(row.children[i], row.children[j])) {
                // console.log('mix is possible');
                const cellValue = Number(row.children[i].textContent) * 2;

                row.children[i].textContent = '';
                row.children[i].className = 'field-cell';

                row.children[j].textContent = cellValue;

                row.children[j].className =
                  `field-cell field-cell--${cellValue}`;
                // console.log('compare succesfull');
                mixCount++;
              } else {
                // console.log('Compare was not succesfull');
              }
              break;
            }

            if (isCellEmpty(row.children[j])) {
              // console.log('found empty cell');

              const tempCellValue = row.children[i].textContent;
              const tempCellClassName = row.children[i].className;

              row.children[i].textContent = '';
              row.children[i].className = 'field-cell';
              // тут я чищу елемент який був рахується як first filled cell, тому потім
              // це викличе проблеми при поєднуванні двох клітинок в одну

              i = j;

              row.children[i].textContent = tempCellValue;
              row.children[i].className = tempCellClassName;
            }
          }
        }

        if (mixCount > 0) {
          break;
        }
      }
    });
  }
}

function moveUp() {
  function handleClick(e) {
    if (e.key !== 'ArrowUp') {
      return;
    }

    const rows = document.querySelectorAll('tr');

    for (let i = 0; i < rows.length; i++) {
      let mixCount = 0;

      for (let j = rows.length - 1; j >= 0; j--) {
        if (!isCellEmpty(rows[j].children[i])) {
          console.log('FOUND FIRST FILLED CELL', rows[j].children[i]);

          for (let k = j - 1; k >= 0; k--) {
            if (!isCellEmpty(rows[k].children[i])) {
              console.log(
                'FOUND SECOND FILLED CELL FROM MOVE_UP',
                rows[k].children[i],
              );

              if (compareCells(rows[j].children[i], rows[k].children[i])) {
                // console.log('mix is possible');
                const cellValue = Number(rows[k].children[i].textContent) * 2;

                rows[j].children[i].textContent = '';
                rows[j].children[i].className = 'field-cell';

                rows[k].children[i].textContent = cellValue;

                rows[k].children[i].className =
                  `field-cell field-cell--${cellValue}`;
                // console.log('compare succesfull');
                mixCount++;
              } else {
                // console.log('Compare was not succesfull');
              }
              break;
            }

            if (isCellEmpty(rows[k].children[i])) {
              console.log('EMPTY CELL', rows[k].children[i]);

              const tempCellValue = rows[j].children[i].textContent;
              const tempCellClassName = rows[j].children[i].className;

              rows[j].children[i].textContent = '';
              rows[j].children[i].className = 'field-cell';
              // тут я чищу елемент який був рахується як first filled cell, тому потім
              // це викличе проблеми при поєднуванні двох клітинок в одну

              j = k;

              rows[j].children[i].textContent = tempCellValue;
              rows[j].children[i].className = tempCellClassName;
            }
          }
        }

        if (mixCount > 0) {
          break;
        }
      }
    }
  }
  document.addEventListener('keydown', handleClick);
}

function moveDown() {
  function handleClick(e) {
    if (e.key !== 'ArrowDown') {
      return;
    }
    console.log('DOWN');

    const rows = document.querySelectorAll('tr');

    for (let i = 0; i < rows.length; i++) {
      let mixCount = 0;

      for (let j = 0; j < rows.length; j++) {
        if (!isCellEmpty(rows[j].children[i])) {
          console.log('DOWN FIRST', rows[j].children[i]);

          for (let k = j + 1; k < rows.length; k++) {
            if (!isCellEmpty(rows[k].children[i])) {
              console.log('DOWN SECOND', rows[k].children[i]);

              if (compareCells(rows[j].children[i], rows[k].children[i])) {
                // console.log('mix is possible');
                const cellValue = Number(rows[j].children[i].textContent) * 2;

                rows[j].children[i].textContent = '';
                rows[j].children[i].className = 'field-cell';

                rows[k].children[i].textContent = cellValue;

                rows[k].children[i].className =
                  `field-cell field-cell--${cellValue}`;
                // console.log('compare succesfull');
                mixCount++;
              } else {
                // console.log('Compare was not succesfull');
              }
              break;
            }

            if (isCellEmpty(rows[k].children[i])) {
              console.log('EMPTY CELL', rows[k].children[i]);

              const tempCellValue = rows[j].children[i].textContent;
              const tempCellClassName = rows[j].children[i].className;

              rows[j].children[i].textContent = '';
              rows[j].children[i].className = 'field-cell';
              // тут я чищу елемент який був рахується як first filled cell, тому потім
              // це викличе проблеми при поєднуванні двох клітинок в одну
              j = k;

              rows[j].children[i].textContent = tempCellValue;
              rows[j].children[i].className = tempCellClassName;
            }
          }
        }

        if (mixCount > 0) {
          break;
        }
      }
    }
  }
  document.addEventListener('keydown', handleClick);
}

function getScore() {
  const cells = Array.from(document.querySelectorAll('td'));
  const result = cells.reduce((acc, curr) => acc + Number(curr.textContent), 0);

  return result;
}

function isGameWon() {
  const cells = Array.from(document.querySelectorAll('td'));

  return cells.find((el) => el.textContent === '2048');
}

function isGameEnd() {
  if (isFiedFull() && !isMixPossible()) {
    return true;
  }

  return false;
}

function start() {
  const messageStart = document.querySelector('.message-start');

  document.addEventListener('keydown', spawnCellByClick);
  moveRight();
  moveLeft();
  moveUp();
  moveDown();

  spawnCell();
  spawnCell();

  operationBtn.classList.remove('start');
  operationBtn.classList.add('restart');
  operationBtn.textContent = 'Restart';
  messageStart.classList.add('hidden');
}
