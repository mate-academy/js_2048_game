const gameField = document.querySelector('.game-field tbody');

const DIRECTIONS = {
  left: (prevState, state) => moveLeft(prevState, state),
  right: (prevState, state) => moveRight(prevState, state),
  up: (prevState, state) => moveUp(prevState, state),
  down: (prevState, state) => moveDown(prevState, state),
};

let lastChange = null;
let lastTimeout = null;

const ANIMATION_DURATION = 250;

export function updateField(state, direction) {
  if (lastChange) {
    clearTimeout(lastTimeout);

    clearField();
    fillField(lastChange);

    lastChange = null;
    lastTimeout = null;
  }

  const changes = [createCopy(clearField())];

  if (direction) {
    while (true) {
      changes.push(
        createCopy(DIRECTIONS[direction](createCopy(changes.at(-1)), state)),
      );

      if (!isChanged(changes.at(-1), changes.at(-2))) {
        changes.shift();
        changes[changes.length - 1] = state;

        break;
      }
    }

    lastChange = state;
    addChanges(changes, ANIMATION_DURATION / changes.length);

    return;
  }

  fillField(state);
}

export function isChanged(prevState, state) {
  for (let i = 0; i < prevState.length; i++) {
    for (let j = 0; j < prevState[i].length; j++) {
      if (prevState[i][j] !== state[i][j]) {
        return true;
      }
    }
  }

  return false;
}

function createCopy(state) {
  return state.map((row) => [...row]);
}

function addChanges(changes, duration) {
  clearField();
  fillField(changes.shift());

  if (changes.length) {
    lastTimeout = setTimeout(addChanges, duration, changes, duration);

    return;
  }

  lastChange = null;
  lastTimeout = null;
}

function fillField(state) {
  for (let i = 0; i < state.length; i++) {
    const row = state[i];

    for (let j = 0; j < row.length; j++) {
      if (state[i][j]) {
        gameField.rows[i].cells[j].textContent = state[i][j];
        gameField.rows[i].cells[j].classList.add(`field-cell--${state[i][j]}`);
      }
    }
  }
}

function moveLeft(prevState, state) {
  for (let i = 0; i < prevState.length; i++) {
    const row = prevState[i];
    const end = row.length - 1;

    let next = false;

    for (let j = 0; j < end && !next; j++) {
      if (row[j] === state[i][j]) {
        continue;
      }

      if (!row[j]) {
        next = true;

        row.splice(j, 1);
        row.push(0);

        continue;
      }

      if (row[j + 1] && row[j] === row[j + 1]) {
        next = true;

        row[j] = +row[j] * 2;

        row.splice(j + 1, 1);
        row.push(0);
      }
    }
  }

  return prevState;
}

function moveRight(prevState, state) {
  for (let i = 0; i < prevState.length; i++) {
    const row = prevState[i];

    let next = false;

    for (let j = row.length - 1; j > 0 && !next; j--) {
      if (row[j] === state[i][j]) {
        continue;
      }

      if (!row[j]) {
        next = true;

        row.splice(j, 1);
        row.unshift(0);

        continue;
      }

      if (row[j - 1] && row[j] === row[j - 1]) {
        next = true;

        row[j] = +row[j] * 2;

        row.splice(j - 1, 1);
        row.unshift(0);
      }
    }
  }

  return prevState;
}

function moveUp(prevState, state) {
  for (let j = 0; j < prevState.length; j++) {
    const end = prevState.length - 1;

    let next = false;

    for (let i = 0; i < end && !next; i++) {
      if (prevState[i][j] === state[i][j]) {
        continue;
      }

      if (!prevState[i][j]) {
        next = true;
        removeUp(prevState, i, j);

        continue;
      }

      if (prevState[i + 1][j] && prevState[i][j] === prevState[i + 1][j]) {
        prevState[i][j] = +prevState[i][j] * 2;

        next = true;
        removeUp(prevState, i + 1, j);
      }
    }
  }

  return prevState;
}

function moveDown(prevState, state) {
  for (let j = 0; j < prevState.length; j++) {
    let next = false;

    for (let i = prevState.length - 1; i > 0 && !next; i--) {
      if (prevState[i][j] === state[i][j]) {
        continue;
      }

      if (!prevState[i][j]) {
        next = true;
        removeDown(prevState, i, j);

        continue;
      }

      if (prevState[i - 1][j] && prevState[i][j] === prevState[i - 1][j]) {
        prevState[i][j] = +prevState[i][j] * 2;

        next = true;
        removeDown(prevState, i - 1, j);
      }
    }
  }

  return prevState;
}

function removeUp(prevState, init, j) {
  const end = prevState.length - 1;

  for (let i = init; i < end; i++) {
    prevState[i][j] = prevState[i + 1][j];
  }

  prevState[prevState.length - 1][j] = 0;
}

function removeDown(prevState, init, j) {
  for (let i = init; i > 0; i--) {
    prevState[i][j] = prevState[i - 1][j];
  }

  prevState[0][j] = 0;
}

function clearField() {
  const state = [];

  for (let i = 0; i < gameField.rows.length; i++) {
    state.push([]);

    const row = gameField.rows[i].cells;

    for (let j = 0; j < row.length; j++) {
      state[i].push(+row[j].textContent);

      if (row[j].textContent) {
        row[j].classList.remove(`field-cell--${row[j].textContent}`);
        row[j].textContent = '';
      }
    }
  }

  return state;
}
