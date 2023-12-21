'use strict';

window.onload = function() {
  let score = 0;
  const rows = 4;
  const columns = 4;
  let board = [];
  let isGameStarted = false;

  const gameField = document.querySelector('.game-field');
  const gameScore = document.querySelector('.game-score');
  const startButton = document.querySelector('.start');

  startButton.addEventListener('click', startGame);

  function startGame() {
    if (isGameStarted) {
      restartGame();
    } else {
      isGameStarted = true;
      setGame();
    }
  }

  function restartGame() {
    const messageLose = document.querySelector('.message-lose');

    if (messageLose.style.display === 'block') {
      messageLose.style.display = 'none';
    }
    setGame();
  }

  function setGame() {
    board = Array.from(
      { length: rows },
      () => Array.from({ length: columns }, () => 0),
    );

    if (isGameStarted) {
      startButton.textContent = 'Restart';
    }

    score = 0;
    updateScore();
    setTwo();
    setTwo();
    renderBoard();

    const messageStart = document.querySelector('.message-start');

    messageStart.style.display = 'none';
  }

  function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        if (board[r][c] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  function setTwo() {
    if (!hasEmptyTile()) {
      return;
    }

    let found = false;

    while (!found) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * columns);

      if (board[r][c] === 0) {
        board[r][c] = Math.random() < 0.5 ? 2 : 4;
        found = true;
      }
    }
  }

  function updateScore() {
    gameScore.textContent = score;
  }

  function renderBoard() {
    gameField.innerHTML = '';

    for (let r = 0; r < rows; r++) {
      const row = document.createElement('tr');

      for (let c = 0; c < columns; c++) {
        const cell = document.createElement('td');
        const num = board[r][c];

        cell.textContent = num !== 0 ? num.toString() : '';
        cell.className = 'field-cell';

        if (num > 0 && num <= 4096) {
          cell.classList.add('field-cell--' + num.toString());
        }

        if (num === 2048) {
          const messageWin = document.querySelector('.message-win');

          messageWin.style.display = 'block';
          isGameStarted = false;
        }

        row.appendChild(cell);
      }
      gameField.appendChild(row);
    }
  }

  document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft') {
      slideLeft();
    } else if (e.code === 'ArrowRight') {
      slideRight();
    } else if (e.code === 'ArrowUp') {
      slideUp();
    } else if (e.code === 'ArrowDown') {
      slideDown();
    }
  });

  function filterZero(row) {
    return row.filter(num => num !== 0);
  }

  function checkGameOver() {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        if (board[r][c] === 0) {
          return false;
        }

        if (
          (r < rows - 1 && board[r][c] === board[r + 1][c])
          || (c < columns - 1 && board[r][c] === board[r][c + 1])
        ) {
          return false;
        }
      }
    }

    return true;
  }

  function slide(row) {
    const filteredRow = filterZero(row);
    const newRow = [];

    for (let i = 0; i < filteredRow.length; i++) {
      if (filteredRow[i] === filteredRow[i + 1]) {
        newRow.push(filteredRow[i] * 2);
        score += filteredRow[i] * 2;
        i++;
      } else {
        newRow.push(filteredRow[i]);
      }
    }

    while (newRow.length < columns) {
      newRow.push(0);
    }

    return newRow;
  }

  function slideLeft() {
    for (let r = 0; r < rows; r++) {
      board[r] = slide(board[r]);
    }
    setTwo();
    renderBoard();
    updateScore();

    if (checkGameOver()) {
      const messageGameOver = document.querySelector('.message-game-over');

      messageGameOver.style.display = 'block';
    }
  }

  function slideRight() {
    for (let r = 0; r < rows; r++) {
      board[r] = slide(board[r].reverse()).reverse();
    }
    setTwo();
    renderBoard();
    updateScore();

    if (checkGameOver()) {
      const messageLose = document.querySelector('.message-lose');

      messageLose.style.display = 'block';
    }
  }

  function slideUp() {
    for (let c = 0; c < columns; c++) {
      const column = [];

      for (let r = 0; r < rows; r++) {
        column.push(board[r][c]);
      }

      const slidColumn = slide(column);

      for (let r = 0; r < rows; r++) {
        board[r][c] = slidColumn[r];
      }
    }
    setTwo();
    renderBoard();
    updateScore();

    if (checkGameOver()) {
      const messageLose = document.querySelector('.message-lose');

      messageLose.style.display = 'block';
    }
  }

  function slideDown() {
    for (let c = 0; c < columns; c++) {
      const column = [];

      for (let r = 0; r < rows; r++) {
        column.push(board[r][c]);
      }

      const slidColumn = slide(column.reverse());

      for (let r = 0; r < rows; r++) {
        board[r][c] = slidColumn[rows - 1 - r];
      }
    }
    setTwo();
    renderBoard();
    updateScore();

    if (checkGameOver()) {
      const messageLose = document.querySelector('.message-lose');

      messageLose.style.display = 'block';
    }
  }
};
