/* eslint-disable max-len */
'use strict';

const startButton = document.querySelector('.button');
const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const allMessages = document.querySelectorAll('.message');
const winMessage = document.querySelector('.message-win');
const scoreCountElement = document.querySelector('.game-score');

const fieldRows = document.querySelectorAll('.field-row');

const firstRow = fieldRows[0].children;
const secondRow = fieldRows[1].children;
const thirdRow = fieldRows[2].children;
const fourthRow = fieldRows[3].children;

let scoreOfTheGame = 500;
let theGameStarted = false;

const gameMarkup = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

startButton.addEventListener('click', () => {
  if (startButton.classList.contains('start')) {
    theGameStarted = true;

    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';

    scoreOfTheGame = 0;
    startMessage.classList.add('hidden');

    gameMarkup.map(row => row.fill(0));

    fillRandomCell();
    fillRandomCell();
    render();
  } else if (startButton.classList.contains('restart')) {
    if (checkGameOver()) {
      startButton.classList.remove('restart');
      startButton.classList.add('start');
      startButton.textContent = 'Start';

      for (const message of allMessages) {
        message.classList.add('hidden');
      }

      startMessage.classList.remove('hidden');
    }
    scoreOfTheGame = 0;

    gameMarkup.map(row => row.fill(0));

    fillRandomCell();
    fillRandomCell();
    render();
  }
});

const render = () => {
  handleRowRender(firstRow, gameMarkup[0]);
  handleRowRender(secondRow, gameMarkup[1]);
  handleRowRender(thirdRow, gameMarkup[2]);
  handleRowRender(fourthRow, gameMarkup[3]);

  scoreCountElement.textContent = scoreOfTheGame;
};

const handleRowRender = (gameRow, markupRow) => {
  for (let i = 0; i < gameRow.length; i++) {
    for (let j = 0; j < markupRow.length; j++) {
      if (markupRow[j] !== 0) {
        gameRow[j].textContent = markupRow[j];
        gameRow[j].className = `field-cell field-cell--${markupRow[j]}`;
      } else {
        gameRow[j].textContent = '';
        gameRow[j].className = 'field-cell';
      }
    }
  }
};

const fillRandomCell = () => {
  if (gameMarkup.some(row => row.includes(0))) {
    const randomNum = Math.random() < 0.9 ? 2 : 4;
    const randomRow = Math.floor(Math.random() * 4);
    const randomCol = Math.floor(Math.random() * 4);

    if (gameMarkup[randomRow][randomCol] === 0) {
      gameMarkup[randomRow][randomCol] = randomNum;
    }
  }
};

document.addEventListener('keydown', (action) => {
  const key = action.key;

  if (theGameStarted) {
    switch (key) {
      case 'ArrowUp':
        moveUp();
        break;
      case 'ArrowDown':
        moveDown();
        break;
      case 'ArrowLeft':
        moveLeft();
        break;
      case 'ArrowRight':
        moveRight();
        break;
    }

    fillRandomCell();
    render();
  }

  if (checkGameOver()) {
    loseMessage.classList.remove('hidden');
  }

  if (gameMarkup.some(row => row.includes(2048))) {
    winMessage.classList.remove('hidden');
  }
});

const moveUp = () => {
  for (let col = 0; col < 4; col++) {
    for (let row = 1; row < 4; row++) {
      if (gameMarkup[row][col] !== 0) {
        let currentRow = row;

        while (currentRow > 0 && gameMarkup[currentRow - 1][col] === 0) {
          gameMarkup[currentRow - 1][col] = gameMarkup[currentRow][col];
          gameMarkup[currentRow][col] = 0;
          currentRow--;
        }

        if (currentRow > 0 && gameMarkup[currentRow - 1][col] === gameMarkup[currentRow][col]) {
          gameMarkup[currentRow - 1][col] *= 2;
          scoreOfTheGame += gameMarkup[currentRow - 1][col];
          gameMarkup[currentRow][col] = 0;
        }
      }
    }
  }
};

const moveDown = () => {
  for (let col = 0; col < 4; col++) {
    for (let row = 2; row >= 0; row--) {
      if (gameMarkup[row][col] !== 0) {
        let currentRow = row;

        while (currentRow < 3 && gameMarkup[currentRow + 1][col] === 0) {
          gameMarkup[currentRow + 1][col] = gameMarkup[currentRow][col];
          gameMarkup[currentRow][col] = 0;
          currentRow++;
        }

        if (currentRow < 3 && gameMarkup[currentRow + 1][col] === gameMarkup[currentRow][col]) {
          gameMarkup[currentRow + 1][col] *= 2;
          scoreOfTheGame += gameMarkup[currentRow + 1][col];
          gameMarkup[currentRow][col] = 0;
        }
      }
    }
  }
};

const moveLeft = () => {
  for (let row = 0; row < 4; row++) {
    for (let col = 1; col < 4; col++) {
      if (gameMarkup[row][col] !== 0) {
        let currentCol = col;

        while (currentCol > 0 && gameMarkup[row][currentCol - 1] === 0) {
          gameMarkup[row][currentCol - 1] = gameMarkup[row][currentCol];
          gameMarkup[row][currentCol] = 0;
          currentCol--;
        }

        if (currentCol > 0 && gameMarkup[row][currentCol - 1] === gameMarkup[row][currentCol]) {
          gameMarkup[row][currentCol - 1] *= 2;
          scoreOfTheGame += gameMarkup[row][currentCol - 1];
          gameMarkup[row][currentCol] = 0;
        }
      }
    }
  }
};

const moveRight = () => {
  for (let row = 0; row < 4; row++) {
    for (let col = 2; col >= 0; col--) {
      if (gameMarkup[row][col] !== 0) {
        let currentCol = col;

        while (currentCol < 3 && gameMarkup[row][currentCol + 1] === 0) {
          gameMarkup[row][currentCol + 1] = gameMarkup[row][currentCol];
          gameMarkup[row][currentCol] = 0;
          currentCol++;
        }

        if (currentCol < 3 && gameMarkup[row][currentCol + 1] === gameMarkup[row][currentCol]) {
          gameMarkup[row][currentCol + 1] *= 2;
          scoreOfTheGame += gameMarkup[row][currentCol + 1];
          gameMarkup[row][currentCol] = 0;
        }
      }
    }
  }
};

const checkGameOver = () => {
  if (!gameMarkup.some(row => row.includes(0))) {
    let gameOver = true;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        if (gameMarkup[row][col] === gameMarkup[row][col + 1]) {
          gameOver = false;
          break;
        }
      }

      if (!gameOver) {
        break;
      }
    }

    if (gameOver) {
      for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 3; row++) {
          if (gameMarkup[row][col] === gameMarkup[row + 1][col]) {
            gameOver = false;
            break;
          }
        }

        if (!gameOver) {
          break;
        }
      }
    }

    if (gameOver) {
      return true;
    }
  }
};
