import { field } from './field';
import { findLastIndex } from './utilities';
import { score, winGame } from './game';

export function moveDown() {
  let moved = false;

  for (let i = field.length - 1; i >= 0; --i) {
    for (let j = 0; j < field[i].length; ++j) {
      const nextBlock = findLastIndex(field.slice(0, i), value => value[j]);

      if (nextBlock === -1
        || (field[i][j] && field[i][j] !== field[nextBlock][j])) {
        continue;
      }

      const current = field[i][j];

      field[i][j] += field[nextBlock][j];
      field[nextBlock][j] = 0;
      moved = true;

      if (winGame(i, j)) {
        return;
      }

      if (!current) {
        --j;
      } else {
        score.innerText = +score.innerText + current * 2;
      }
    }
  }

  return moved;
}

export function moveLeft() {
  let moved = false;

  for (let i = 0; i < field[0].length; ++i) {
    for (let j = 0; j < field.length; ++j) {
      const nextBlock = field[j].slice(i + 1).findIndex(value => value);

      if (nextBlock === -1
        || (field[j][i] && field[j][i] !== field[j][nextBlock + i + 1])) {
        continue;
      }

      const current = field[j][i];

      field[j][i] += field[j][nextBlock + i + 1];
      field[j][nextBlock + i + 1] = 0;
      moved = true;

      if (winGame(j, i)) {
        return;
      }

      if (!current) {
        --j;
      } else {
        score.innerText = +score.innerText + current * 2;
      }
    }
  }

  return moved;
}

export function moveRight() {
  let moved = false;

  for (let i = field[0].length - 1; i >= 0; --i) {
    for (let j = 0; j < field.length; ++j) {
      const nextBlock = findLastIndex(field[j].slice(0, i), value => value);

      if (nextBlock === -1
        || (field[j][i] && field[j][i] !== field[j][nextBlock])) {
        continue;
      }

      const current = field[j][i];

      field[j][i] += field[j][nextBlock];
      field[j][nextBlock] = 0;
      moved = true;

      if (winGame(j, i)) {
        return;
      }

      if (!current) {
        --j;
      } else {
        score.innerText = +score.innerText + current * 2;
      }
    }
  }

  return moved;
}

export function moveUp() {
  let moved = false;

  for (let i = 0; i < field.length; ++i) {
    for (let j = 0; j < field[i].length; ++j) {
      const nextBlock = field.slice(i + 1).findIndex(value => value[j]);

      if (nextBlock === -1
        || (field[i][j] && field[i][j] !== field[nextBlock + i + 1][j])) {
        continue;
      }

      const current = field[i][j];

      field[i][j] += field[nextBlock + i + 1][j];
      field[nextBlock + i + 1][j] = 0;
      moved = true;

      if (winGame(i, j)) {
        return;
      }

      if (!current) {
        --j;
      } else {
        score.innerText = +score.innerText + current * 2;
      }
    }
  }

  return moved;
}
