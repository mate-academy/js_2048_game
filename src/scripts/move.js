import { createBox } from './box';
import getMatrix, { checkNextMove, getEmptyMatrixCoordinates
  , changeScore, getAddScore, resetAddScore, setupInputOnce
  , getWinner, getLoser, loseGame } from './main';

function isArraysEqual(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }

  for (let i = 0; i < array1.length; i++) {
    if (array1[i].length !== array2[i].length) {
      return false;
    }

    for (let j = 0; j < array1[i].length; j++) {
      if (array1[i][j] !== array2[i][j]) {
        return false;
      }
    }
  }

  return true;
}

export function handleInput(ownEvent) {
  const matrix = getMatrix();
  const clone = [];

  for (let i = 0; i < matrix.length; i++) {
    const row = matrix[i].slice();

    clone.push(row);
  }

  if (ownEvent.key === 'ArrowLeft') {
    for (let index = 0; index < matrix.length; index++) {
      matrix.forEach(line => {
        if (line[index]) {
          line[index].move(ownEvent.key);
        }
      });
    }
  } else if (ownEvent.key === 'ArrowRight') {
    for (let index = matrix.length - 1; index >= 0; index--) {
      matrix.forEach(line => {
        if (line[index]) {
          line[index].move(ownEvent.key);
        }
      });
    }
  } else if (ownEvent.key === 'ArrowUp') {
    matrix.forEach(line => {
      line.forEach(box => {
        if (box) {
          box.move(ownEvent.key);
        }
      });
    });
  } else if (ownEvent.key === 'ArrowDown') {
    for (let index = matrix.length - 1; index >= 0; index--) {
      matrix[index].forEach(box => {
        if (box) {
          box.move(ownEvent.key);
        }
      });
    }
  }

  matrix.forEach(line => {
    line.forEach(box => {
      if (box) {
        box.merged = false;
      }
    });
  });

  const addScore = getAddScore();

  if (addScore !== 0) {
    changeScore(addScore);
    resetAddScore();
  }

  const emptyMatrix = getEmptyMatrixCoordinates();

  if (emptyMatrix.length === 0) {
    if (checkNextMove()) {
      loseGame();
    };
  }

  if ((!isArraysEqual(matrix, clone)) && (emptyMatrix.length !== 0)) {
    setTimeout(() => {
      createBox();
    }, 110);
  }

  const winner = getWinner();
  const loserGame = getLoser();

  if (!winner && !loserGame) {
    setupInputOnce();
  };
}
