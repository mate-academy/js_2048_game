'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.button');
  const score = document.querySelector('.game-score');
  const messageStart = document.querySelector('.message--start');
  const messageWin = document.querySelector('.message--win');
  const messageLose = document.querySelector('.message--lose');
  const fieldCells = document.querySelectorAll('.field-cell');
  const cells = Array.from(fieldCells);
  let board = [];
  const cellsNumber = 4;
  const fieldSize = cellsNumber * cellsNumber;

  button.addEventListener('click', function() {
    if (button.classList.contains('button--start')) {
      button.classList.remove('button--start');
      button.classList.add('button--restart');
      messageStart.classList.add('_hidden');
      button.textContent = 'Restart';
      initGame();
    }

    if (button.classList.contains('button--restart')) {
      restartGame();
    }
  });

  function restartGame() {
    score.textContent = '0';
    messageLose.classList.add('_hidden');
    messageWin.classList.add('_hidden');
    initGame();
  }

  function updateScore(value) {
    score.textContent = +score.textContent + value;
  }

  function initGame() {
    for (let i = 0; i < fieldSize; i++) {
      cells[i].dataset.row = Math.floor(i / cellsNumber);
      cells[i].dataset.column = i % cellsNumber;
    }

    board = [...Array(cellsNumber)].map(elem => Array(cellsNumber).fill(0));
    placeRandom();
    placeRandom();
    renderBoard();
  }

  function placeRandom() {
    const available = [];

    for (let i = 0; i < cellsNumber; i++) {
      for (let j = 0; j < cellsNumber; j++) {
        if (board[i][j] === 0) {
          available.push({
            x: i, y: j,
          });
        }
      }
    }

    if (available.length > 0) {
      const randomCell
        = available[Math.floor(Math.random() * available.length)];
      const cell = document.querySelector(
        `[data-row='${randomCell.x}'][data-column='${randomCell.y}']`,
      );

      board[randomCell.x][randomCell.y] = Math.random() < 0.9 ? 2 : 4;
      cell.classList.add('new-tile');
    }
  }

  function renderBoard() {
    for (let i = 0; i < cellsNumber; i++) {
      for (let j = 0; j < cellsNumber; j++) {
        const cell = document.querySelector(
          `[data-row='${i}'][data-column='${j}']`,
        );
        const prevValue = cell.dataset.value;
        const currentValue = board[i][j];

        if (currentValue === 2048) {
          messageWin.classList.remove('_hidden');
        }

        if (currentValue !== 0) {
          cell.dataset.value = currentValue;
          cell.textContent = currentValue;

          if (
            currentValue !== parseInt(prevValue)
            && !cell.classList.contains('new-tile')
          ) {
            cell.classList.add('merged-tile');
          }
        } else {
          cell.textContent = '';
          delete cell.dataset.value;
          cell.classList.remove('merged-tile', 'new-tile');
        }
      }
    }

    setTimeout(() => {
      fieldCells.forEach(cell => {
        cell.classList.remove('merged-tile', 'new-tile');
      });
    }, 300);
  }

  function move(direction) {
    let hasChanged = false;

    if (direction === 'ArrowUp' || direction === 'ArrowDown') {
      for (let j = 0; j < cellsNumber; j++) {
        const column = [...Array(cellsNumber)]
          .map((e, index) => board[index][j]);
        const newColumn = transform(column, direction === 'ArrowUp');

        for (let i = 0; i < cellsNumber; i++) {
          if (board[i][j] !== newColumn[i]) {
            hasChanged = true;
            board[i][j] = newColumn[i];
          }
        }
      }
    } else if (direction === 'ArrowLeft' || direction === 'ArrowRight') {
      for (let i = 0; i < cellsNumber; i++) {
        const row = board[i];
        const newRow = transform(row, direction === 'ArrowLeft');

        if (row.join(',') !== newRow.join(',')) {
          hasChanged = true;
          board[i] = newRow;
        }
      }
    }

    if (hasChanged) {
      placeRandom();
      renderBoard();
      checkGameOver();
    }
  }

  function transform(line, moveTowardsStart) {
    const newLine = line.filter(cell => cell !== 0);

    if (!moveTowardsStart) {
      newLine.reverse();
    }

    for (let i = 0; i < newLine.length - 1; i++) {
      if (newLine[i] === newLine[i + 1]) {
        newLine[i] *= 2;
        updateScore(newLine[i]);
        newLine.splice(i + 1, 1);
      }
    }

    while (newLine.length < cellsNumber) {
      newLine.push(0);
    }

    if (!moveTowardsStart) {
      newLine.reverse();
    }

    return newLine;
  }

  function checkGameOver() {
    for (let i = 0; i < cellsNumber; i++) {
      for (let j = 0; j < cellsNumber; j++) {
        if (board[i][j] === 0) {
          return;
        }

        if (j < cellsNumber - 1 && board[i][j] === board[i][j + 1]) {
          return;
        }

        if (i < cellsNumber - 1 && board[i][j] === board[i + 1][j]) {
          return;
        }
      }
    }

    messageLose.classList.remove('_hidden');
  }

  // eslint-disable-next-line no-shadow
  document.addEventListener('keydown', (event) => {
    event.preventDefault();

    if (
      messageWin.classList.contains('_hidden')
      && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)
    ) {
      move(event.key);
    }
  });
});
