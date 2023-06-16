'use strict';

const startButton = document.querySelector('.start');
const fieldCellList = document.querySelectorAll('.field-cell');
const fieldRowList = document.querySelectorAll('.field-row');

function startTheGame() {
  startButton.addEventListener('click', () => {
    startButton.classList.toggle('restart');
    createNewCell();
    createNewCell();

    startButton.textContent = startButton.classList.contains('restart')
      ? 'Restart' : 'Start';

    if (startButton.classList.contains('restart')) {
      fieldCellAdder();
    } else {
      for (const item of fieldCellList) {
        item.className = 'field-cell';
        item.textContent = '';
      }
    }
  });
}

function loseGame() {
  const checkEmpty = [...fieldCellList].find(
    (empty) => empty.textContent.length === 0);
  let chekRow = false;
  let chekCol = false;

  function callbackRow(row) {
    for (let i = 0; i < row.length - 2; i++) {
      if (row[i] === row[i + 1]) {
        return true;
      }
    }
  }

  function callbackColumn() {
    for (let indexCol = 0; indexCol < 4; indexCol++) {
      for (let indexRow = 0; indexRow < 3; indexRow++) {
        // eslint-disable-next-line max-len
        if (fieldRowList[indexCol].children[indexRow] === fieldRowList[indexCol].children[indexRow + 1]) {
          return true;
        }
      }
    }
  }

  if (checkEmpty === false) {
    chekRow = [...fieldRowList].some(callbackRow);
    chekCol = callbackColumn(fieldRowList);

    if (chekRow === true || chekCol === true) {
      return true;
    }
  }
}

function emptyFieldNumber() {
  let index;

  const endTheGame = loseGame();

  if (endTheGame !== false) {
    do {
      index = Math.floor(Math.random() * 16);
    } while (fieldCellList[index].textContent.length !== 0);

    return index;
  } else {
    document.body.innerHTML = '';
  }
};

function fieldCellAdder() {
  document.body.addEventListener('keydown', (e) => {
    const key = e.key;

    switch (key) {
      case 'ArrowLeft':
        // Left pressed
        ArrowLeft();
        break;
      case 'ArrowRight':
        // Right pressed
        ArrowRight();
        break;
      case 'ArrowUp':
        // Up pressed
        ArrowUp();
        break;
      case 'ArrowDown':
        // Down pressed
        ArrowDown();
        break;
    }

    function ArrowLeft() {
      for (let i = 0; i < 4; i++) {
        const currentRow = fieldRowList[i];
        const resultArray = [];

        [...currentRow.children].map((child) => {
          // console.log(child.textContent);

          if (child.textContent.length !== 0) {
            resultArray.push(+child.textContent);
            // console.log(resultArray);
            child.textContent = '';
          }
        });

        // debugger;

        for (let x = 0; x < resultArray.length - 1; x++) {
          if (resultArray[x + 1] === undefined) {
            break;
          }

          if (resultArray[x] === resultArray[x + 1]) {
            resultArray[x] = resultArray[x] * 2;

            resultArray.splice((x + 1), 1);
            x = 0;

            console.log(resultArray.length);
            console.log(resultArray);
            // continue;
          }
        };

        for (let index = 0; index < resultArray.length; index++) {
          currentRow.children[index].textContent = resultArray[index];
          console.log(`field-cell--${currentRow.children[index].textContent}`);
        }

        resultArray.splice();
      }
    }

    function ArrowRight() {
      // debugger;

      for (let i = 0; i < 4; i++) {
        const currentRow = fieldRowList[i];
        const resultArray = [];

        [...currentRow.children].map((child) => {
          // console.log(child.textContent);

          if (child.textContent.length !== 0) {
            resultArray.push(+child.textContent);
            // console.log(resultArray);
            child.textContent = '';
          }
        });

        // debugger;

        for (let x = resultArray.length - 1; x >= 0; x--) {
          if (resultArray[x - 1] === undefined) {
            break;
          }

          if (resultArray[x] === resultArray[x - 1]) {
            resultArray[x] = resultArray[x] * 2;

            resultArray.splice((x - 1), 1);
            x = 0;

            console.log(resultArray.length);
            console.log(resultArray);
            // continue;
          }
        };
        // debugger;

        let indexField = 3;

        for (let index = resultArray.length - 1; index >= 0; index--) {
          currentRow.children[indexField].textContent = resultArray[index];
          indexField = indexField - 1;
          // currentRow.children[index].classList.add
        }

        resultArray.splice();
      }
    }

    function ArrowUp() {
      for (let i = 0; i < 4; i++) {
        const resultArray = [];

        for (let y = 0; y < 4; y++) {
          const currentRow = fieldRowList[y];
          const currentChild = fieldRowList[y].children[i];

          console.log(currentChild);

          console.log(currentChild.textContent);

          if (currentChild.textContent.length !== 0) {
            resultArray.push(+currentChild.textContent);
            // console.log(resultArray);
            currentChild.textContent = '';
          }
        };

        for (let x = resultArray.length - 1; x >= 0; x--) {
          if (resultArray[x - 1] === undefined) {
            break;
          }

          if (resultArray[x] === resultArray[x - 1]) {
            resultArray[x] = resultArray[x] * 2;

            resultArray.splice((x - 1), 1);
            x = 0;

            console.log(resultArray.length);
            console.log(resultArray);
            // continue;
          }
        };

        for (let index = 0; index < resultArray.length; index++) {
          fieldRowList[index].children[i].textContent = resultArray[index];
          // currentRow.children[index].classList.add
        }

        resultArray.splice();
      }
      // debugger;
      // debugger;
    }

    function ArrowDown() {
      // debugger;

      for (let i = 0; i < 4; i++) {
        const resultArray = [];

        for (let y = 0; y < 4; y++) {
          const currentRow = fieldRowList[y];
          const currentChild = fieldRowList[y].children[i];

          if (currentChild.textContent.length !== 0) {
            resultArray.push(+currentChild.textContent);
            currentChild.textContent = '';
          }
        };

        for (let x = resultArray.length - 1; x >= 0; x--) {
          if (resultArray[x - 1] === undefined) {
            break;
          }

          if (resultArray[x] === resultArray[x - 1]) {
            resultArray[x] = resultArray[x] * 2;

            resultArray.splice((x - 1), 1);
            x = 0;
          }
        };

        let indexField = resultArray.length - 1;

        for (let index = 3; index > 0; index--) {
          fieldRowList[index].children[i].textContent = resultArray[indexField];
          indexField = indexField - 1;
          // currentRow.children[index].classList.add
        }

        resultArray.splice();
      }
      // debugger;
    }

    function ColorField() {
      for (const fieldCell of fieldCellList) {
        const textCon = fieldCell.textContent;

        if (fieldCell.textContent > 0) {
          fieldCell.className = `field-cell field-cell--${textCon}`;
        } else {
          fieldCell.className = 'field-cell';
        }
      }
    }

    ColorField();

    setTimeout(() => {
      createNewCell();
      ColorField();
    }, 200);
  });
}

function createNewCell() {
  const emptyCell = emptyFieldNumber();

  fieldCellList[emptyCell].classList.add = 'field-cell--2';
  fieldCellList[emptyCell].textContent = '2';
}

startTheGame();
