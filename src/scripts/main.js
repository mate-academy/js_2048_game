'use strict';

const game = {
  matrix: [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  score: 0,
  moved: false,
};

const gameFieldBody = document.querySelector('.game-field tbody');
const controls = document.querySelector('.controls');
const button = controls.querySelector('.start');
const gameScore = controls.querySelector('.game-score');
const messageContainer = document.querySelector('.message-container');

render();

function clearData() {
  game.matrix = game.matrix.map(col => col.map(() => 0));
  game.score = 0;
  game.moved = false;

  render();
}

function render() {
  gameFieldBody.innerHTML = '';

  game.matrix.forEach(col => {
    const tr = document.createElement('tr');

    tr.className = 'field-row';

    col.forEach(row => {
      const td = document.createElement('td');

      if (row !== 0) {
        td.className = `field-cell field-cell--${row}`;

        td.textContent = row;
      } else if (row === 0) {
        td.className = `field-cell`;
      }

      tr.append(td);
    });

    gameFieldBody.append(tr);
  });

  renderMessage('message-start', 'Press "Start" to begin game. Good luck!');

  const isWin = isGameWin();

  if (!isWin) {
    isGameLose();
  }
}

function addRandomCell() {
  const emptyCell = [];

  game.matrix.forEach((col, colInd) => {
    col.forEach((row, rowInd) => {
      if (row === 0) {
        emptyCell.push([colInd, rowInd]);
      }
    });
  });

  const randomCellNum = Math.random() <= 0.1 ? 4 : 2;
  const randomPosition = Math.floor(Math.random() * emptyCell.length);

  const randomCol = emptyCell[randomPosition][0];
  const randomRow = emptyCell[randomPosition][1];

  game.matrix[randomCol][randomRow] = randomCellNum;
}

function checkEmptyTail(col, row, currCol, currRow) {
  if (currCol !== col || currRow !== row) {
    game.matrix[currCol][currRow] = game.matrix[col][row];
    game.matrix[col][row] = 0;

    game.moved = true;
  }
}

function searchEmptyTails(move) {
  if (move === 'up') {
    for (let col = 1; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        if (game.matrix[col][row] === 0) {
          continue;
        }

        let currCol = col;

        while (currCol > 0 && game.matrix[currCol - 1][row] === 0) {
          currCol--;
        }

        checkEmptyTail(col, row, currCol, row);
      }
    }
  } else if (move === 'down') {
    for (let col = 2; col >= 0; col--) {
      for (let row = 0; row < 4; row++) {
        if (game.matrix[col][row] === 0) {
          continue;
        }

        let currCol = col;

        while (currCol < 3 && game.matrix[currCol + 1][row] === 0) {
          currCol++;
        }

        checkEmptyTail(col, row, currCol, row);
      }
    }
  } else if (move === 'left') {
    for (let col = 0; col < 4; col++) {
      for (let row = 1; row < 4; row++) {
        if (game.matrix[col][row] === 0) {
          continue;
        }

        let currRow = row;

        while (currRow > 0 && game.matrix[col][currRow - 1] === 0) {
          currRow--;
        }

        checkEmptyTail(col, row, col, currRow);
      }
    }
  } else if (move === 'right') {
    for (let col = 0; col < 4; col++) {
      for (let row = 2; row >= 0; row--) {
        if (game.matrix[col][row] === 0) {
          continue;
        }

        let currRow = row;

        while (currRow < 3 && game.matrix[col][currRow + 1] === 0) {
          currRow++;
        }

        checkEmptyTail(col, row, col, currRow);
      }
    }
  }
}

function checkSameTail(col, row, anotherCol, anotherRow) {
  if (game.matrix[anotherCol][anotherRow] === game.matrix[col][row]) {
    game.matrix[anotherCol][anotherRow] *= 2;
    game.score += game.matrix[anotherCol][anotherRow];
    game.matrix[col][row] = 0;

    game.moved = true;
  }
}

function searchSameTails(move) {
  if (move === 'up') {
    for (let col = 1; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        if (game.matrix[col][row] === 0) {
          continue;
        }

        checkSameTail(col, row, col - 1, row);
      }
    }
  } else if (move === 'down') {
    for (let col = 2; col >= 0; col--) {
      for (let row = 0; row < 4; row++) {
        if (game.matrix[col][row] === 0) {
          continue;
        }

        checkSameTail(col, row, col + 1, row);
      }
    }
  } else if (move === 'left') {
    for (let col = 0; col < 4; col++) {
      for (let row = 1; row < 4; row++) {
        if (game.matrix[col][row] === 0) {
          continue;
        }

        checkSameTail(col, row, col, row - 1);
      }
    }
  } else if (move === 'right') {
    for (let col = 0; col < 4; col++) {
      for (let row = 2; row >= 0; row--) {
        if (game.matrix[col][row] === 0) {
          continue;
        }

        checkSameTail(col, row, col, row + 1);
      }
    }
  }
}

function isGameLose() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const current = game.matrix[i][j];

      if (current === 0) {
        return;
      }

      if (i !== game.matrix.length - 1 && current === game.matrix[i + 1][j]) {
        return;
      }

      if (j !== game.matrix[i].length - 1
        && current === game.matrix[i][j + 1]) {
        return;
      }
    }
  }

  renderMessage('message-lose', 'You lose! Restart the game?');

  window.removeEventListener('keydown', handlerKey);
}

function isGameWin() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const current = game.matrix[i][j];

      if (current === 2048) {
        renderMessage('message-win', 'Winner! Congrats! You did it!');

        window.removeEventListener('keydown', handlerKey);

        return true;
      }
    }
  }
}

function renderMessage(classMessage, message) {
  messageContainer.innerHTML = `
    <p class="message ${classMessage}">
      ${message}
    </p>
  `;
}

function startGame() {
  clearData();
  addRandomCell();
  addRandomCell();

  render();

  window.addEventListener('keydown', handlerKey);
}

function handlerKey(e) {
  switch (e.key) {
    case 'w':
    case 'ArrowUp':
      searchEmptyTails('up');
      searchSameTails('up');
      searchEmptyTails('up');

      break;
    case 's':
    case 'ArrowDown':
      searchEmptyTails('down');
      searchSameTails('down');
      searchEmptyTails('down');

      break;
    case 'a':
    case 'ArrowLeft':
      searchEmptyTails('left');
      searchSameTails('left');
      searchEmptyTails('left');

      break;
    case 'd':
    case 'ArrowRight':
      searchEmptyTails('right');
      searchSameTails('right');
      searchEmptyTails('right');

      break;
  }

  render();

  if (game.moved) {
    setTimeout(() => {
      gameScore.textContent = game.score;

      addRandomCell();

      render();
    }, 240);

    game.moved = false;
  }
}

controls.addEventListener('click', e => {
  const { target } = e;

  if (target.closest('.button')) {
    startGame();

    button.classList.remove('start');
    button.classList.add('restart');
    button.textContent = 'Restart';
  }
});
