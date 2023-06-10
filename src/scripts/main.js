'use strict';

const gameField = document.querySelector('.game-field-content');
const controls = document.querySelector('.controls');
const score = controls.querySelector('.game-score');
const messages = [...document.querySelector('.message-container').children];
const [ messageLose, messageWin, messageStart ] = messages;
const fieldSize = 4;
let fieldValues = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

controls.addEventListener('click', (clickEvent) => {
  const target = clickEvent.target;

  if (target.matches('.restart')) {
    fieldValues = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    displayHighScore();

    score.textContent = '0';

    startGame();
    messageLose.classList.add('hidden');
    messageWin.classList.add('hidden');
    window.addEventListener('keyup', controlInteraction);
  }

  if (target.matches('.start')) {
    startGame();

    clickEvent.target.classList.remove('start');
    clickEvent.target.classList.add('restart');
    clickEvent.target.textContent = 'Restart';

    messageStart.classList.add('hidden');
  }
});

window.addEventListener('keyup', controlInteraction);

function displayHighScore() {
  const highScore = document.querySelector('.high-score');

  if (highScore) {
    highScore.textContent
      = Math.max(score.textContent, highScore.textContent);
  } else {
    score.parentElement.insertAdjacentHTML('beforebegin', `
      <p class="info">
        High
        \n
        score:
        <span class="game-score high-score">${score.innerHTML}</span>
      </p>
    `);
  }
}

function controlInteraction(keyEvent) {
  if (keyEvent.key === 'ArrowLeft') {
    const oldField = JSON.stringify(fieldValues);

    swipeLeft();

    const newField = JSON.stringify(fieldValues);

    if (oldField !== newField) {
      fillRandomCell();
      renderField();
    }
  }

  if (keyEvent.key === 'ArrowRight') {
    const oldField = JSON.stringify(fieldValues);

    swipeRight();

    const newField = JSON.stringify(fieldValues);

    if (oldField !== newField) {
      fillRandomCell();
      renderField();
    }
  }

  if (keyEvent.key === 'ArrowUp') {
    const oldField = JSON.stringify(fieldValues);

    swipeUp();

    const newField = JSON.stringify(fieldValues);

    if (oldField !== newField) {
      fillRandomCell();
      renderField();
    }
  }

  if (keyEvent.key === 'ArrowDown') {
    const oldField = JSON.stringify(fieldValues);

    swipeDown();

    const newField = JSON.stringify(fieldValues);

    if (oldField !== newField) {
      fillRandomCell();
      renderField();
    }
  }

  checkForWin();
  checkForLose();
}

function startGame() {
  fillRandomCell();
  fillRandomCell();
  renderField();
}

function fillRandomCell() {
  const randomRow = Math.floor(Math.random() * fieldSize);
  const randomColumn = Math.floor(Math.random() * fieldSize);

  if (!JSON.stringify(fieldValues).includes('0')) {
    return;
  }

  if (fieldValues[randomRow][randomColumn] === 0) {
    fieldValues[randomRow][randomColumn] = Math.random < 0.1 ? 4 : 2;
  } else {
    fillRandomCell();
  }
}

function renderField() {
  gameField.innerHTML = `
    ${fieldValues.map(row => `
        <tr class="field-row">
          ${row.map(cell => `
            <td class="field-cell ${cell ? 'field-cell--'.concat(cell) : ''}">
              ${cell || ''}
            </td>
          `).join('\n')}
        </tr>
    `).join('\n')}
  `;
}

function swipeRight() {
  for (let i = 0; i < fieldSize; ++i) {
    let row = fieldValues[i].filter(num => num);

    for (let j = row.length - 1; j >= 0; --j) {
      if (row[j] === row[j - 1]) {
        row[j] *= 2;
        updateScore(row[j]);
        row[j - 1] = 0;

        row = row.filter(el => el);
      }
    }

    const missingCells = fieldValues[i].length - row.length;
    const zeros = Array(missingCells).fill(0);

    fieldValues[i] = zeros.concat(row);
  }

  renderField();
}

function swipeLeft() {
  for (let i = 0; i < fieldSize; ++i) {
    let row = fieldValues[i].filter(num => num);

    for (let j = 0; j < row.length; ++j) {
      if (row[j] === row[j + 1]) {
        row[j + 1] *= 2;
        updateScore(row[j + 1]);
        row[j] = 0;

        row = row.filter(el => el);
      }
    }

    const missingCells = fieldValues[i].length - row.length;
    const zeros = Array(missingCells).fill(0);

    fieldValues[i] = row.concat(zeros);
  }

  renderField();
}

function swipeUp() {
  for (let i = 0; i < fieldSize; ++i) {
    let column = [];

    fieldValues.forEach(row => {
      column.push(row[i]);
    });

    column = column.filter(num => num);

    for (let j = 0; j < column.length; ++j) {
      if (column[j] === column[j + 1]) {
        column[j + 1] *= 2;
        updateScore(column[j + 1]);
        column[j] = 0;
        column = column.filter(num => num);
      }
    }

    const missingCells = fieldSize - column.length;
    const zeros = Array(missingCells).fill(0);

    column = column.concat(zeros);

    fieldValues.forEach((row, index) => {
      row[i] = column[index];
    });
  }

  renderField();
}

function swipeDown() {
  for (let i = 0; i < fieldSize; ++i) {
    let column = [];

    fieldValues.forEach(row => {
      column.push(row[i]);
    });

    column = column.filter(num => num);

    for (let j = column.length; j > 0; --j) {
      if (column[j] === column[j - 1]) {
        column[j] *= 2;
        updateScore(column[j]);
        column[j - 1] = 0;
        column = column.filter(num => num);
      }
    }

    const missingCells = fieldSize - column.length;
    const zeros = Array(missingCells).fill(0);

    column = zeros.concat(column);

    fieldValues.forEach((row, index) => {
      row[i] = column[index];
    });
  }

  renderField();
}

function updateScore(value) {
  score.innerHTML = parseInt(score.innerHTML) + value;
}

function checkForWin() {
  if (fieldValues.flat().includes(2048)) {
    messageWin.classList.toggle('hidden');
    window.removeEventListener('keyup', controlInteraction);
  };
}

function checkForLose() {
  const hasEmptyCells = fieldValues.flat().includes(0);
  let canMergeCells = false;

  fieldValues.forEach((row) => {
    for (let i = 1; i < fieldSize; ++i) {
      if (row[i] === row[i - 1]) {
        canMergeCells = true;

        return;
      }
    }
  });

  for (let i = 0; i < fieldValues.length; ++i) {
    for (let j = 1; j < fieldValues[i].length; ++j) {
      if (fieldValues[j][i] === fieldValues[j - 1][i]) {
        canMergeCells = true;

        return;
      }
    }
  }

  if (!hasEmptyCells && !canMergeCells) {
    messageLose.classList.toggle('hidden');
    window.removeEventListener('keyup', controlInteraction);
  };
}
