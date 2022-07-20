import { getRandom } from './utilities';

const tbody = document.querySelector('tbody');

export const field = new Array(tbody.children.length);

export function resetField() {
  for (let i = 0; i < field.length; ++i) {
    field[i] = new Array(tbody.children[i].children.length).fill(0);
  }
}

export function draw() {
  for (let i = 0; i < field.length; ++i) {
    for (let j = 0; j < field[i].length; ++j) {
      tbody.children[i].children[j].innerText = '';
      tbody.children[i].children[j].className = 'field-cell';

      if (field[i][j]) {
        tbody.children[i].children[j].innerText = field[i][j];

        tbody.children[i].children[j]
          .classList.add(`field-cell--${field[i][j]}`);
      }
    }
  }
}

export function spawn() {
  const availableCells = [];

  for (let i = 0; i < field.length; ++i) {
    for (let j = 0; j < field[i].length; ++j) {
      if (!field[i][j]) {
        availableCells.push(i * field[i].length + j);
      }
    }
  }

  const newIndex = availableCells[getRandom(availableCells.length)];

  field[Math.trunc(newIndex / field[0].length)][newIndex % field[0].length]
    = Math.random() >= 0.9 ? 4 : 2;
}

export function checkIsOver() {
  for (let i = 0; i < field.length; ++i) {
    for (let j = 0; j < field[i].length; ++j) {
      if (!field[i][j]) {
        return false;
      }

      if ((i > 0 && field[i][j] === field[i - 1][j])
        || (i < field.length - 1 && field[i][j] === field[i + 1][j])
        || (j > 0 && field[i][j] === field[i][j - 1])
        || (j < field[i].length - 1 && field[i][j] === field[i][j + 1])) {
        return false;
      }
    }
  }

  return true;
}
