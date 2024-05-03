'use strict';

// Uncomment the next lines to use your game instance in the browser
const Game = require('../modules/Game.class');
const game = new Game();

// Write your code here

const table = document.querySelector('table');
const tbody = table.tBodies[0];
const button = document.querySelector('button');

const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const score = document.querySelector('.game-score');

button.addEventListener('click', () => {
  // here I update state and table to the initial state

  game.state = JSON.parse(JSON.stringify(game.initialState));

  const { state } = game;

  for (let row = 0; row < 4; row++) {
    for (let cell = 0; cell < 4; cell++) {
      tbody.rows[row].cells[cell].className = 'field-cell';
      tbody.rows[row].cells[cell].innerText = '';
    }
  }

  if (button.classList.contains('restart')) {
    button.classList.remove('restart');
    button.classList.add('start');
    button.textContent = 'Start';

    score.innerText = '0';
    game.status = 'idle';

    startMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');

    return;
  }

  game.status = 'playing';

  startMessage.classList.add('hidden');
  loseMessage.classList.add('hidden');
  winMessage.classList.add('hidden');

  // here I add 2 digits to the empty cells

  let addedDigitsCount = 0;

  while (addedDigitsCount < 2) {
    const [row, cell] = getRandomCoordinates();

    if (state[row][cell]) {
      continue;
    }

    const randomDigit = getRandomDigit();

    state[row][cell] = randomDigit;

    tbody.rows[row].cells[cell].classList.add(`field-cell--${randomDigit}`);
    tbody.rows[row].cells[cell].innerText = `${randomDigit}`;

    addedDigitsCount++;
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    const { status: gameStatus } = game;

    if (
      gameStatus === 'idle' ||
      gameStatus === 'lose' ||
      gameStatus === 'win'
    ) {
      return;
    }

    // after the first move I change the Start button to Restart button

    if (button.classList.contains('start')) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';
    }

    const { state } = game;
    const prevStateString = JSON.stringify(state);

    for (let row = 0; row < 4; row++) {
      const cache = [];

      // here I push all digits (except 0) of current row to the cache array

      for (let cell = 0; cell < 4; cell++) {
        const currentDigit = state[row][cell];

        if (!currentDigit) {
          continue;
        }

        cache.push(currentDigit);
      }

      // here I sum equal numbers in the cache array and update the score

      // if we press ArrowRight, digits should sum from right to left
      // [4, 4, 4] -> [4, 8]
      // but I used the cycle 'for' for inconvenience from start to end
      // and therefore reverse cache array twice

      cache.reverse();

      for (let i = 0; i < cache.length; i++) {
        const cacheCurrentDigit = cache[i];

        if (i + 1 < cache.length && cacheCurrentDigit === cache[i + 1]) {
          const prevScore = +score.innerText;
          const currentScore = prevScore + cacheCurrentDigit * 2;

          score.innerText = `${currentScore}`;

          cache.splice(i, 2, cacheCurrentDigit * 2);
        }
      }

      cache.reverse();

      // if row doesn't change then go to the next row

      if (cache.length === state[row].length) {
        continue;
      }

      // here I need to fill cache array with 0 for equality cache.length === 4

      while (cache.length < 4) {
        cache.unshift(0);
      }

      // here I rewrite current row in the state

      for (let cell = 0; cell < 4; cell++) {
        state[row][cell] = cache[cell];
      }
    }

    const currentStateString = JSON.stringify(state);

    // if state doesn't change, then do nothing

    if (prevStateString === currentStateString) {
      return;
    }

    // updating table if state has changed

    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 4; cell++) {
        const currentDigit = state[row][cell];

        if (!currentDigit) {
          tbody.rows[row].cells[cell].className = 'field-cell';
          tbody.rows[row].cells[cell].innerText = '';

          continue;
        }

        tbody.rows[row].cells[cell].className =
          `field-cell field-cell--${currentDigit}`;

        tbody.rows[row].cells[cell].innerText = `${currentDigit}`;
      }
    }

    // here I add 1 new digit to an empty cell

    let addedDigitCount = 0;

    while (!addedDigitCount) {
      const [row, cell] = getRandomCoordinates();
      const randomDigit = getRandomDigit();

      if (state[row][cell]) {
        continue;
      }

      state[row][cell] = randomDigit;

      tbody.rows[row].cells[cell].className =
        `field-cell field-cell--${randomDigit}`;
      tbody.rows[row].cells[cell].innerText = `${randomDigit}`;

      addedDigitCount++;
    }

    // here I need to check if 2048 exist

    for (let row = 0; row < 4; row++) {
      if (state[row].includes(2048)) {
        game.status = 'win';
        winMessage.classList.remove('hidden');

        return;
      }
    }

    // if there are no more available moves, a game over message is shown

    let hasEmptyCell = false;
    let hasPairedDigits = false;

    for (let row = 0; row < 4; row++) {
      const currentRow = state[row];

      if (currentRow.includes(0)) {
        hasEmptyCell = true;
      }

      for (let cell = 0; cell < 3; cell++) {
        if (currentRow[cell] === currentRow[cell + 1]) {
          hasPairedDigits = true;

          break;
        }
      }

      if (hasEmptyCell && hasPairedDigits) {
        break;
      }
    }

    // here I find paired digits in columns

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (state[row][col] === state[row + 1][col]) {
          hasPairedDigits = true;

          break;
        }
      }
    }

    if (!hasEmptyCell && !hasPairedDigits) {
      game.status = 'lose';

      loseMessage.classList.remove('hidden');
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    const { status: gameStatus } = game;

    if (
      gameStatus === 'idle' ||
      gameStatus === 'lose' ||
      gameStatus === 'win'
    ) {
      return;
    }

    // after the first move I change the Start button to Restart button

    if (button.classList.contains('start')) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';
    }

    const { state } = game;
    const prevStateString = JSON.stringify(state);

    for (let row = 0; row < 4; row++) {
      const cache = [];

      // here I push all digits (except 0) of current row to the cache array

      for (let cell = 0; cell < 4; cell++) {
        const currentDigit = state[row][cell];

        if (!currentDigit) {
          continue;
        }

        cache.push(currentDigit);
      }

      // here I sum equal numbers in the cache array and update score

      for (let i = 0; i < cache.length; i++) {
        const cacheCurrentDigit = cache[i];

        if (i + 1 < cache.length && cacheCurrentDigit === cache[i + 1]) {
          const prevScore = +score.innerText;
          const currentScore = prevScore + cacheCurrentDigit * 2;

          score.innerText = `${currentScore}`;

          cache.splice(i, 2, cacheCurrentDigit * 2);
        }
      }

      // if row doesn't change then go to the next row

      if (cache.length === state[row].length) {
        continue;
      }

      // here I need to fill cache array with 0 for equality cache.length === 4

      while (cache.length < 4) {
        cache.push(0);
      }

      // here I rewrite current row in the state

      for (let cell = 0; cell < 4; cell++) {
        state[row][cell] = cache[cell];
      }
    }

    const currentStateString = JSON.stringify(state);

    // if state doesn't change, then do nothing

    if (prevStateString === currentStateString) {
      return;
    }

    // updating table if state has changed

    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 4; cell++) {
        const currentDigit = state[row][cell];

        if (!currentDigit) {
          tbody.rows[row].cells[cell].className = 'field-cell';
          tbody.rows[row].cells[cell].innerText = '';

          continue;
        }

        tbody.rows[row].cells[cell].className =
          `field-cell field-cell--${currentDigit}`;

        tbody.rows[row].cells[cell].innerText = `${currentDigit}`;
      }
    }

    // here I add 1 new digit to an empty cell

    let addedDigitCount = 0;

    while (!addedDigitCount) {
      const [row, cell] = getRandomCoordinates();
      const randomDigit = getRandomDigit();

      if (state[row][cell]) {
        continue;
      }

      state[row][cell] = randomDigit;

      tbody.rows[row].cells[cell].className =
        `field-cell field-cell--${randomDigit}`;
      tbody.rows[row].cells[cell].innerText = `${randomDigit}`;

      addedDigitCount++;
    }

    // here I need to check if 2048 exist

    for (let row = 0; row < 4; row++) {
      if (state[row].includes(2048)) {
        game.status = 'win';
        winMessage.classList.remove('hidden');

        return;
      }
    }

    // if there are no more available moves, a game over message is shown

    let hasEmptyCell = false;
    let hasPairedDigits = false;

    for (let row = 0; row < 4; row++) {
      const currentRow = state[row];

      if (currentRow.includes(0)) {
        hasEmptyCell = true;
      }

      for (let cell = 0; cell < 3; cell++) {
        if (currentRow[cell] === currentRow[cell + 1]) {
          hasPairedDigits = true;

          break;
        }
      }

      if (hasEmptyCell && hasPairedDigits) {
        break;
      }
    }

    // here I find paired digits in columns

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (state[row][col] === state[row + 1][col]) {
          hasPairedDigits = true;

          break;
        }
      }
    }

    if (!hasEmptyCell && !hasPairedDigits) {
      game.status = 'lose';

      loseMessage.classList.remove('hidden');
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') {
    const { status: gameStatus } = game;

    if (
      gameStatus === 'idle' ||
      gameStatus === 'lose' ||
      gameStatus === 'win'
    ) {
      return;
    }

    // after the first move I change the Start button to Restart button

    if (button.classList.contains('start')) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';
    }

    const { state } = game;
    const prevStateString = JSON.stringify(state);

    for (let col = 0; col < 4; col++) {
      const cache = [];

      // here I push all digits (except 0) of current column to the cache array

      for (let row = 0; row < 4; row++) {
        const currentDigit = state[row][col];

        if (!currentDigit) {
          continue;
        }

        cache.push(currentDigit);
      }

      // here I sum equal numbers in the cache array and update score

      for (let i = 0; i < cache.length; i++) {
        const cacheCurrentDigit = cache[i];

        if (i + 1 < cache.length && cacheCurrentDigit === cache[i + 1]) {
          const prevScore = +score.innerText;
          const currentScore = prevScore + cacheCurrentDigit * 2;

          score.innerText = `${currentScore}`;

          cache.splice(i, 2, cacheCurrentDigit * 2);
        }
      }

      // if row doesn't change then go to the next row

      if (cache.length === state[col].length) {
        continue;
      }

      // here I need to fill cache array with 0 for equality cache.length === 4

      while (cache.length < 4) {
        cache.push(0);
      }

      // here I rewrite current column in the state

      for (let row = 0; row < 4; row++) {
        state[row][col] = cache[row];
      }
    }

    const currentStateString = JSON.stringify(state);

    // if state doesn't change, then do nothing

    if (prevStateString === currentStateString) {
      return;
    }

    // updating table if state has changed

    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 4; cell++) {
        const currentDigit = state[row][cell];

        if (!currentDigit) {
          tbody.rows[row].cells[cell].className = 'field-cell';
          tbody.rows[row].cells[cell].innerText = '';

          continue;
        }

        tbody.rows[row].cells[cell].className =
          `field-cell field-cell--${currentDigit}`;

        tbody.rows[row].cells[cell].innerText = `${currentDigit}`;
      }
    }

    // here I add 1 new digit to an empty cell

    let addedDigitCount = 0;

    while (!addedDigitCount) {
      const [row, cell] = getRandomCoordinates();
      const randomDigit = getRandomDigit();

      if (state[row][cell]) {
        continue;
      }

      state[row][cell] = randomDigit;

      tbody.rows[row].cells[cell].className =
        `field-cell field-cell--${randomDigit}`;
      tbody.rows[row].cells[cell].innerText = `${randomDigit}`;

      addedDigitCount++;
    }

    // here I need to check if 2048 exist

    for (let row = 0; row < 4; row++) {
      if (state[row].includes(2048)) {
        game.status = 'win';
        winMessage.classList.remove('hidden');

        return;
      }
    }

    // if there are no more available moves, a game over message is shown

    let hasEmptyCell = false;
    let hasPairedDigits = false;

    for (let row = 0; row < 4; row++) {
      const currentRow = state[row];

      if (currentRow.includes(0)) {
        hasEmptyCell = true;
      }

      for (let cell = 0; cell < 3; cell++) {
        if (currentRow[cell] === currentRow[cell + 1]) {
          hasPairedDigits = true;

          break;
        }
      }

      if (hasEmptyCell && hasPairedDigits) {
        break;
      }
    }

    // here I find paired digits in columns

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (state[row][col] === state[row + 1][col]) {
          hasPairedDigits = true;

          break;
        }
      }
    }

    if (!hasEmptyCell && !hasPairedDigits) {
      game.status = 'lose';

      loseMessage.classList.remove('hidden');
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowDown') {
    const { status: gameStatus } = game;

    if (
      gameStatus === 'idle' ||
      gameStatus === 'lose' ||
      gameStatus === 'win'
    ) {
      return;
    }

    // after the first move I change the Start button to Restart button

    if (button.classList.contains('start')) {
      button.classList.remove('start');
      button.classList.add('restart');
      button.textContent = 'Restart';
    }

    const { state } = game;
    const prevStateString = JSON.stringify(state);

    for (let col = 0; col < 4; col++) {
      const cache = [];

      // here I push all digits (except 0) of current column to the cache array

      for (let row = 0; row < 4; row++) {
        const currentDigit = state[row][col];

        if (!currentDigit) {
          continue;
        }

        cache.push(currentDigit);
      }

      // here I sum equal numbers in the cache array and update score

      // if we press ArrowDown, digits should sum from down to up
      // [4,
      //  4, -> [4,
      //  4]     8]
      // but I used the cycle 'for' for inconvenience from left to right
      // and reverse cache array twice

      cache.reverse();

      for (let i = 0; i < cache.length; i++) {
        const cacheCurrentDigit = cache[i];

        if (i + 1 < cache.length && cacheCurrentDigit === cache[i + 1]) {
          const prevScore = +score.innerText;
          const currentScore = prevScore + cacheCurrentDigit * 2;

          score.innerText = `${currentScore}`;

          cache.splice(i, 2, cacheCurrentDigit * 2);
        }
      }

      cache.reverse();

      // if row doesn't change then go to the next row

      if (cache.length === state[col].length) {
        continue;
      }

      // here I need to fill cache array with 0 for equality cache.length === 4

      while (cache.length < 4) {
        cache.unshift(0);
      }

      // here I rewrite current column in the state

      for (let row = 0; row < 4; row++) {
        state[row][col] = cache[row];
      }
    }

    const currentStateString = JSON.stringify(state);

    // if state doesn't change, then do nothing

    if (prevStateString === currentStateString) {
      return;
    }

    // updating table if state has changed

    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 4; cell++) {
        const currentDigit = state[row][cell];

        if (!currentDigit) {
          tbody.rows[row].cells[cell].className = 'field-cell';
          tbody.rows[row].cells[cell].innerText = '';

          continue;
        }

        tbody.rows[row].cells[cell].className =
          `field-cell field-cell--${currentDigit}`;

        tbody.rows[row].cells[cell].innerText = `${currentDigit}`;
      }
    }

    // here I add 1 new digit to an empty cell

    let addedDigitCount = 0;

    while (!addedDigitCount) {
      const [row, cell] = getRandomCoordinates();
      const randomDigit = getRandomDigit();

      if (state[row][cell]) {
        continue;
      }

      state[row][cell] = randomDigit;

      tbody.rows[row].cells[cell].className =
        `field-cell field-cell--${randomDigit}`;
      tbody.rows[row].cells[cell].innerText = `${randomDigit}`;

      addedDigitCount++;
    }

    // here I need to check if 2048 exist

    for (let row = 0; row < 4; row++) {
      if (state[row].includes(2048)) {
        game.status = 'win';
        winMessage.classList.remove('hidden');

        return;
      }
    }

    // if there are no more available moves, a game over message is shown

    let hasEmptyCell = false;
    let hasPairedDigits = false;

    for (let row = 0; row < 4; row++) {
      const currentRow = state[row];

      if (currentRow.includes(0)) {
        hasEmptyCell = true;
      }

      for (let cell = 0; cell < 3; cell++) {
        if (currentRow[cell] === currentRow[cell + 1]) {
          hasPairedDigits = true;

          break;
        }
      }

      if (hasEmptyCell && hasPairedDigits) {
        break;
      }
    }

    // here I find paired digits in columns

    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 3; row++) {
        if (state[row][col] === state[row + 1][col]) {
          hasPairedDigits = true;

          break;
        }
      }
    }

    if (!hasEmptyCell && !hasPairedDigits) {
      game.status = 'lose';

      loseMessage.classList.remove('hidden');
    }
  }
});

function getRandomCoordinates() {
  const rowCoordinate = Math.floor(Math.random() * 4);
  const cellCoordinate = Math.floor(Math.random() * 4);

  return [rowCoordinate, cellCoordinate];
}

function getRandomDigit() {
  const randomNumber1To100 = Math.floor(Math.random() * 100) + 1;

  if (randomNumber1To100 > 90) {
    return 4;
  }

  return 2;
}
