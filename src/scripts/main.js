'use strict';

const startButton = document.querySelector('.start');
const fieldCellList = document.querySelectorAll('.field-cell');
const fieldRowList = document.querySelectorAll('.field-row');
const gameScore = document.querySelector('.game-score');

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

    if (startButton.textContent === 'Start') {
      gameScore.textContent = 0;
    }
  });
}

function loseGame() {
  const result = '';
}

function score() {

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

    if (startButton.textContent === 'Start') {
      return;
    }

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
          if (child.textContent.length !== 0) {
            resultArray.push(+child.textContent);
            child.textContent = '';
          }
        });

        for (let x = 0; x < resultArray.length - 1; x++) {
          if (resultArray[x + 1] === undefined) {
            break;
          }

          if (resultArray[x] === resultArray[x + 1]) {
            resultArray[x] = resultArray[x] * 2;
            gameScore.textContent = +gameScore.textContent + resultArray[x];

            resultArray.splice((x + 1), 1);
            x = 0;
          }
        };

        for (let index = 0; index < resultArray.length; index++) {
          currentRow.children[index].textContent = resultArray[index];
        }

        resultArray.splice();
      }
    }

    function ArrowRight() {
      for (let i = 0; i < 4; i++) {
        const currentRow = fieldRowList[i];
        const resultArray = [];

        [...currentRow.children].map((child) => {
          if (child.textContent.length !== 0) {
            resultArray.push(+child.textContent);
            child.textContent = '';
          }
        });

        for (let x = resultArray.length - 1; x >= 0; x--) {
          if (resultArray[x - 1] === undefined) {
            break;
          }

          if (resultArray[x] === resultArray[x - 1]) {
            resultArray[x] = resultArray[x] * 2;
            gameScore.textContent = +gameScore.textContent + resultArray[x];

            resultArray.splice((x - 1), 1);
            x = 0;
          }
        };

        let indexField = 3;

        for (let index = resultArray.length - 1; index >= 0; index--) {
          currentRow.children[indexField].textContent = resultArray[index];
          indexField = indexField - 1;
        }

        resultArray.splice();
      }
    }

    function ArrowUp() {
      for (let i = 0; i < 4; i++) {
        const resultArray = [];

        for (let y = 0; y < 4; y++) {
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
            gameScore.textContent = +gameScore.textContent + resultArray[x];

            resultArray.splice((x - 1), 1);
            x = 0;
          }
        };

        for (let index = 0; index < resultArray.length; index++) {
          fieldRowList[index].children[i].textContent = resultArray[index];
        }

        resultArray.splice();
      }
    }

    function ArrowDown() {
      for (let i = 0; i < 4; i++) {
        const resultArray = [];

        for (let y = 0; y < 4; y++) {
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
            gameScore.textContent = +gameScore.textContent + resultArray[x];

            resultArray.splice((x - 1), 1);
            x = 0;
          }
        };

        let indexField = resultArray.length - 1;

        for (let index = 3; index > 0; index--) {
          fieldRowList[index].children[i].textContent = resultArray[indexField];
          indexField = indexField - 1;
        }

        resultArray.splice();
      }
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
