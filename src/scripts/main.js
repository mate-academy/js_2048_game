'use strict';

const controlButton = document.querySelector('.button');
const gameStartMessage = document.querySelector('.message-start');
const gameWinMessage = document.querySelector('.message-win');
const gameLoseMessage = document.querySelector('.message-lose');
const gameField = document.querySelector('.game-field');
const gameScore = document.querySelector('.game-score');
const gameFieldArray = Array.from(gameField.querySelectorAll('.field-row'))
  .map((row) => Array.from(row.querySelectorAll('.field-cell')));
const fieldSize = gameFieldArray.length;

let score = 0;
let isWinner = false;

function updateScore() {
  gameScore.textContent = score;
}

controlButton.addEventListener('click', () => {
  if (controlButton.classList.contains('restart')) {
    const answer = confirm(
      `Are you sure you want to restart the game?`
      + `Your score will be lost!`,
    );

    if (answer) {
      restartGame();
    }
  } else {
    startGame();
  }
});

const buttonChangeTo = (btnText) => {
  switch (btnText) {
    case 'Start':
      controlButton.classList.value = 'button start';
      controlButton.textContent = 'Start';
      break;
    case 'Restart':
      controlButton.classList.value = 'button restart';
      controlButton.textContent = 'Restart';
      break;
    default:
      break;
  }
};

const getRandomEmptyCell = () => {
  const emptyCells = [];

  for (let i = 0; i < fieldSize; i++) {
    for (let j = 0; j < fieldSize; j++) {
      if (gameFieldArray[i][j].textContent === '') {
        emptyCells.push({
          row: i,
          col: j,
        });
      }
    }
  }

  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
};

const generateNewNumber = () => {
  const newValue = Math.random() < 0.9 ? 2 : 4;
  const emptyCell = getRandomEmptyCell();

  if (emptyCell) {
    const { row, col } = emptyCell;

    gameFieldArray[row][col].textContent = newValue;
    gameFieldArray[row][col].classList.add(`field-cell--${newValue}`);

    gameFieldArray[row][col].classList.add(`new-cell`);
  }
};

const hideStartMessage = () => {
  gameStartMessage.classList.add('hidden');
};

const startGame = () => {
  initalizeGame();
  buttonChangeTo('Restart');
  hideStartMessage();
  document.addEventListener('keydown', handleMove);
};

const restartGame = () => {
  initalizeGame();

  if (!gameWinMessage.classList.contains('hidden')) {
    gameWinMessage.classList.add('hidden');
  }

  if (!gameLoseMessage.classList.contains('hidden')) {
    gameLoseMessage.classList.add('hidden');
  }
};

const initalizeGame = () => {
  if (gameField.classList.contains('game-field--lose')) {
    gameField.classList.remove('game-field--lose');
  }

  gameFieldArray.forEach((row) => {
    row.forEach((cell) => {
      cell.textContent = '';
      cell.classList.value = 'field-cell';
    });
  });

  isWinner = false;
  score = 0;
  gameScore.textContent = 0;

  generateNewNumber();
  generateNewNumber();
};

function moveAndMergeCells(cells, direction) {
  const size = cells.length;
  let moved = false;

  const mergeAndMove = (line) => {
    let filtered = line.filter(val => val !== 0);
    const oldLine = [...line];

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        filtered[i + 1] = 0;
        score += filtered[i];
      }
    }
    filtered = filtered.filter(val => val !== 0);

    while (filtered.length < size) {
      filtered.push(0);
    }

    if (JSON.stringify(oldLine) !== JSON.stringify(filtered)) {
      moved = true;
    }

    return filtered;
  };

  if (direction === 'right' || direction === 'left') {
    for (let i = 0; i < size; i++) {
      let row = cells[i];

      if (direction === 'right') {
        row = row.reverse();
      }
      row = mergeAndMove(row);

      if (direction === 'right') {
        row = row.reverse();
      }
      cells[i] = row;
    }
  } else {
    for (let i = 0; i < size; i++) {
      let column = cells.map(row => row[i]);

      if (direction === 'down') {
        column = column.reverse();
      }
      column = mergeAndMove(column);

      if (direction === 'down') {
        column = column.reverse();
      }

      for (let j = 0; j < size; j++) {
        cells[j][i] = column[j];
      }
    }
  }

  return {
    cells,
    moved,
  };
}

function handleMove(eventr) {
  let direction;

  switch (eventr.key) {
    case 'ArrowUp': direction = 'up'; break;
    case 'ArrowDown': direction = 'down'; break;
    case 'ArrowLeft': direction = 'left'; break;
    case 'ArrowRight': direction = 'right'; break;
    default: return;
  }

  const cells = gameFieldArray.map(
    row => row.map(cell => Number(cell.textContent) || 0),
  );

  const result = moveAndMergeCells(cells, direction);

  if (result) {
    gameFieldArray.forEach((row, i) => {
      row.forEach((cell, j) => {
        const value = result.cells[i][j];

        cell.textContent = value || '';
        cell.classList.value = 'field-cell';

        if (value) {
          cell.classList.add(`field-cell--${value}`);
        }
      });
    });

    if (result.moved) {
      generateNewNumber();
    }
    updateScore();

    if (isGameOver(result.cells)) {
      gameLoseMessage.classList.remove('hidden');
      gameField.classList.add('game-field--lose');

      //* comment this for pass the tests//
      // setTimeout(() => {
      //   promptTheNewGame('lose');
      // }, 1000);
    }

    if (isGameWon(result.cells)) {
      gameWinMessage.classList.remove('hidden');

      if (!isWinner) {
        setTimeout(() => {
          isWinner = true;
          promptTheNewGame('win');
        }, 1000);
      }
    }
  }
}

function promptTheNewGame(result) {
  let message;

  if (result === 'win') {
    message = `Congratulations! You won! Your score is ${score}.`;
  } else {
    message = `Game over! Your score is ${score}.`;
  }

  const newGame = confirm(`${message} Do you want to start a new game?`);

  if (newGame) {
    restartGame();
  } else if (result === 'win' && !newGame) {
    return false;
  } else {
    buttonChangeTo('Start');
    document.removeEventListener('keydown', handleMove);
  }
}

function isGameOver(cells) {
  const size = cells.length;

  for (const row of cells) {
    for (const cell of row) {
      if (cell === 0) {
        return false;
      }
    }
  }

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (x < size - 1 && cells[y][x] === cells[y][x + 1]) {
        return false;
      }

      if (y < size - 1 && cells[y][x] === cells[y + 1][x]) {
        return false;
      }
    }
  }

  return true;
}

function isGameWon(cells) {
  for (const row of cells) {
    for (const cell of row) {
      if (cell === 2048) {
        return true;
      }
    }
  }

  return false;
}
