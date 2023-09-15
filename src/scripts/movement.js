import { board } from './main';

export function filterZeros(arr) {
  return arr.filter(num => num !== 0);
}

export function mergeNumbers(arr) {
  const merged = [];

  for (let i = 0; i < arr.length; i++) {
    if (i < arr.length - 1 && arr[i] === arr[i + 1]) {
      merged.push(arr[i] * 2);
      i++;
    } else {
      merged.push(arr[i]);
    }
  }

  return merged;
}

export function fillZeros(arr, size) {
  const missing = size - arr.length;

  return arr.concat(Array(missing).fill(0));
}

export function move(direction) {
  for (let i = 0; i < 4; i++) {
    let currentLine;

    if (direction === 'Up' || direction === 'Down') {
      currentLine = [];

      for (let j = 0; j < 4; j++) {
        currentLine.push(board[j][i]);
      }
    } else {
      currentLine = board[i].slice();
    }

    if (direction === 'Down' || direction === 'Right') {
      currentLine.reverse();
    }

    const filtered = filterZeros(currentLine);
    const merged = mergeNumbers(filtered);
    const filled = fillZeros(merged, 4);

    if (direction === 'Down' || direction === 'Right') {
      filled.reverse();
    }

    if (direction === 'Up' || direction === 'Down') {
      for (let j = 0; j < 4; j++) {
        board[j][i] = filled[j];
      }
    } else {
      board[i] = filled;
    }
  }
}
