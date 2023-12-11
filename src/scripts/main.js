'use strict';

class Data {
  constructor(DOM_CELLS) {
    this.HTML_CELLS = DOM_CELLS;
    this.HTML_MATRIX = [];
    this.madeMove = false;
    this.isGameStarted = false;
    this.winStatus = false;
    this.score = 0;
  }

  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  makeMatrix(array) {
    const OUTPUT_ARRAY = [];
    let counter = 0;

    if (!array) {
      for (let i = 0; i < 4; i++) {
        OUTPUT_ARRAY.push([]);

        for (let j = 0; j < 4; j++) {
          OUTPUT_ARRAY[i].push(0);
        }
      }
    }

    if (array) {
      for (let row = 0; row < array.length / 4; row++) {
        OUTPUT_ARRAY.push([]);

        for (let column = 0; column < array.length / 4; column++) {
          OUTPUT_ARRAY[row].push(array[counter]);
          counter++;
        }
      }
    }

    return OUTPUT_ARRAY;
  }

  rotateMatrix(matrix) {
    const matrixCopy = matrix.map(elem => [...elem]);

    for (let row = 0; row < matrix.length; row++) {
      for (let column = 0; column < matrix[row].length; column++) {
        matrixCopy[row][column] = matrix[matrix.length - 1 - column][row];
      }
    }

    return matrixCopy;
  }

  reverseRotate(matrix) {
    const matrixCopy = matrix.map(elem => [...elem]);

    for (let row = 0; row < matrix.length; row++) {
      for (let column = 0; column < matrix[row].length; column++) {
        matrixCopy[row][column] = matrix[column][matrix[row].length - 1 - row];
      }
    }

    return matrixCopy;
  }

  randomCell(matrix) {
    const FREE_FIELD_CELLS = [];

    for (let row = 0; row < matrix.length; row++) {
      const tempRow = [row];

      for (let column = 0; column < matrix[row].length; column++) {
        if (matrix[row][column] === 0) {
          tempRow.push(column);
        }
      }

      if (tempRow.length > 1) {
        FREE_FIELD_CELLS.push(tempRow);
      }
    }

    const INDEX_OF_RANDOM_ROW = this.randomNumber(0, FREE_FIELD_CELLS.length);
    const RANDOM_ROW = FREE_FIELD_CELLS[INDEX_OF_RANDOM_ROW];

    if (RANDOM_ROW) {
      const RANDOM_CELL = this.randomNumber(1, RANDOM_ROW.length);

      const CELL_VALUE = Math.random() < 0.9 ? 2 : 4;

      const selectedRow = RANDOM_ROW[0];
      const selectedColumn = RANDOM_ROW[RANDOM_CELL];

      matrix[selectedRow][selectedColumn] = CELL_VALUE;

      return [selectedRow, selectedColumn];
    }
  }

  canMoveVerticaly(matrix) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length - 1; j++) {
        if (matrix[i][j] === matrix[i][j + 1]) {
          return true;
        }
      }
    }

    return false;
  }

  canMoveHorizontaly(matrix) {
    for (let i = 0; i < matrix.length - 1; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === matrix[i + 1][j]) {
          return true;
        }
      }
    }

    return false;
  }

  hasEmptySpace(matrix) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  moveLeft(matrix, row, data, repeat) {
    const moveCount = this.moveList;
    const tempRow = matrix[row];

    for (let column = 0; column < tempRow.length; column++) {
      if (tempRow[column] !== 0) {
        let columnCopy = column;

        for (let i = column - 1; i >= 0; i--) {
          if (tempRow[i] === 0) {
            if (!repeat) {
              tempRow[i] = tempRow[columnCopy];
              moveCount[row][column]++;

              tempRow[columnCopy] = 0;

              if (!data[column].after) {
                data[column].after = column;
                data[column].before = column;
              }

              data[column].after--;
              data[column].before = column;
              columnCopy--;
            }

            if (repeat) {
              let isObjectEmpty = true;

              tempRow[i] = tempRow[columnCopy];
              tempRow[columnCopy] = 0;

              data.forEach(elem => {
                if (elem.after === columnCopy) {
                  moveCount[row][elem.before]++;
                  isObjectEmpty = false;
                }
              });

              if (isObjectEmpty) {
                for (let limith = column; limith < tempRow.length; limith++) {
                  if (tempRow[limith] === 0) {
                    moveCount[row][limith]++;
                  }
                }
              }
            }
          }
        }
      }
    }

    return tempRow;
  }

  moveRight(matrix, row, data, repeat) {
    const moveCount = this.moveList;
    const tempRow = matrix[row];

    for (let column = tempRow.length - 1; column >= 0; column--) {
      if (tempRow[column] !== 0) {
        let columnCopy = column;

        for (let i = column + 1; i < tempRow.length; i++) {
          if (tempRow[i] === 0) {
            if (!repeat) {
              tempRow[i] = tempRow[columnCopy];
              moveCount[row][column]++;
              tempRow[columnCopy] = 0;

              if (!data[column].after) {
                data[column].after = column;
              }

              data[column].after++;
              data[column].before = column;
              columnCopy++;
            }

            if (repeat) {
              let isObjectEmpty = true;

              tempRow[i] = tempRow[columnCopy];
              tempRow[columnCopy] = 0;

              data.forEach(elem => {
                if (elem.after === columnCopy) {
                  moveCount[row][elem.before]++;
                  isObjectEmpty = false;
                }
              });

              if (isObjectEmpty) {
                for (let limith = column; limith >= 0; limith--) {
                  if (tempRow[limith] === 0) {
                    moveCount[row][limith]++;
                  }
                }
              }
            }
          }
        }
      }
    }

    return tempRow;
  }

  mergeLeft(tempRow, data, moveCount) {
    for (let i = 0; i < tempRow.length; i++) {
      if (tempRow[i] === tempRow[i + 1] && tempRow[i] !== 0) {
        tempRow[i] += tempRow[i + 1];
        this.score += tempRow[i];

        let isObjectEmpty = true;

        data.forEach((elem) => {
          if (elem.after === i + 1) {
            moveCount[elem.before]++;
            isObjectEmpty = false;
          }
        });

        if (isObjectEmpty) {
          moveCount[i + 1]++;
        }

        tempRow[i + 1] = 0;
        i++;
      }
    }
  }

  mergeRight(tempRow, data, moveCount) {
    for (let i = tempRow.length - 1; i >= 0; i--) {
      if (tempRow[i] === tempRow[i - 1] && tempRow[i] !== 0) {
        tempRow[i] += tempRow[i - 1];
        this.score += tempRow[i];

        let isObjectEmpty = true;

        data.forEach((elem) => {
          if (elem.after === i - 1) {
            moveCount[elem.before]++;
            isObjectEmpty = false;
          }
        });

        if (isObjectEmpty) {
          moveCount[i - 1]++;
        }

        tempRow[i - 1] = 0;
        i--;
      }
    }
  }

  moveField(field, direction, moveCount) {
    const reversedField = this.rotateMatrix(field);

    for (let i = 0; i < field.length; i++) {
      let tempRow = field[i];
      const moveData = [{}, {}, {}, {}];
      let repeat = 0;

      switch (direction) {
        case 'ArrowLeft':
          tempRow = this.moveLeft(field, i, moveData, repeat);
          repeat = 1;
          this.mergeLeft(tempRow, moveData, moveCount[i]);
          field[i] = tempRow;
          field[i] = this.moveLeft(field, i, moveData, repeat);
          break;

        case 'ArrowRight':
          tempRow = this.moveRight(field, i, moveData, repeat);
          repeat = 1;
          this.mergeRight(tempRow, moveData, moveCount[i]);
          field[i] = tempRow;
          field[i] = this.moveRight(field, i, moveData, repeat);
          break;

        case 'ArrowUp':
          tempRow = this.moveRight(reversedField, i, moveData, repeat);
          repeat = 1;
          this.mergeRight(tempRow, moveData, moveCount[i]);
          field[i] = tempRow;

          field[i] = this.moveRight(
            reversedField, i, moveCount, moveData, repeat
          );
          break;

        case 'ArrowDown':
          tempRow = this.moveLeft(reversedField, i, moveData, repeat);
          repeat = 1;
          this.mergeLeft(tempRow, moveData, moveCount[i]);
          field[i] = tempRow;
          field[i] = this.moveLeft(reversedField, i, moveData, repeat);
          break;
      }
    }

    if (direction === 'ArrowUp' || direction === 'ArrowDown') {
      field.forEach((elem, i) => {
        field[i] = this.reverseRotate(reversedField)[i];
      });

      this.moveList = this.reverseRotate(moveCount);
    }
  }

  visualize(direction, prevField) {
    const field = this.FIELD;
    const htmlField = this.HTML_MATRIX;
    const moveCount = this.moveList;
    let prevFieldCopy = prevField;

    if (!prevField) {
      prevFieldCopy = field;
    }

    let counter = 0;
    let canMove = true;

    for (let i = 0; i < prevFieldCopy.length; i++) {
      for (let j = 0; j < prevFieldCopy[i].length; j++) {
        if (prevFieldCopy[i][j] === field[i][j]) {
          counter++;
        }
      }
    }

    if (counter === field.length * field.length) {
      canMove = false;
    }

    for (let row = 0; row < prevFieldCopy.length; row++) {
      for (let column = 0; column < prevFieldCopy[row].length; column++) {
        while (htmlField[row][column].firstChild) {
          htmlField[row][column].removeChild(htmlField[row][column].lastChild);
        }

        const HTML_CELL = document.createElement('div');

        HTML_CELL.innerText = '';
        HTML_CELL.classList = '';

        if (prevFieldCopy[row][column] > 0) {
          HTML_CELL.style.zIndex = '2';
          HTML_CELL.innerText = `${prevFieldCopy[row][column]}`;

          this.animateMovement(HTML_CELL, direction, moveCount[row][column]);

          HTML_CELL.classList = `
          field-cell
          field-cell--inner-block
          field-cell--${prevFieldCopy[row][column]}`;
          htmlField[row][column].appendChild(HTML_CELL);
        }
      }
    }

    setTimeout(() => {
      for (let row = 0; row < field.length; row++) {
        for (let column = 0; column < field[row].length; column++) {
          const HTML_EL = htmlField[row][column];

          while (HTML_EL.firstChild) {
            HTML_EL.removeChild(HTML_EL.lastChild);
          }

          const HTML_CELL = document.createElement('div');

          HTML_CELL.innerText = '';
          HTML_CELL.classList = '';

          if (field[row][column] > 0) {
            HTML_CELL.style.zIndex = '2';
            HTML_CELL.innerText = `${field[row][column]}`;

            HTML_CELL.classList = `
            field-cell
            field-cell--inner-block
            field-cell--${field[row][column]}`;
            htmlField[row][column].appendChild(HTML_CELL);
          }
          moveCount[row][column] = 0;
        }
      }

      if (this.hasEmptySpace(field) && canMove && this.madeMove) {
        const HTML_CELL = document.createElement('div');

        setTimeout(() => {
          const COORDS = this.randomCell(field);

          HTML_CELL.innerText = `${field[COORDS[0]][COORDS[1]]}`;

          HTML_CELL.classList = `
          field-cell
          field-cell--inner-block
          only-created
          field-cell--${field[COORDS[0]][COORDS[1]]}`;
          htmlField[COORDS[0]][COORDS[1]].appendChild(HTML_CELL);
        }, 100);
      }
    }, 50);
  }

  animateMovement(HTML_CELL, direction, MOVE_SCORE) {
    const SELL_SIZE = 85;
    const TOTAL_PATH = SELL_SIZE * MOVE_SCORE;
    let moveDirection = '';
    let movement = 0;

    switch (direction) {
      case 'ArrowUp':
        moveDirection = 'top';
        break;
      case 'ArrowDown':
        moveDirection = 'bottom';
        break;
      case 'ArrowLeft':
        moveDirection = 'left';
        break;
      case 'ArrowRight':
        moveDirection = 'right';
        break;
    }

    HTML_CELL.style[moveDirection] = 0 + 'px';
    HTML_CELL.style.zIndex = '1';

    setTimeout(() => {
      movement += TOTAL_PATH / MOVE_SCORE;

      if (movement >= TOTAL_PATH) {
        movement = TOTAL_PATH;
      }

      HTML_CELL.style[moveDirection] = -TOTAL_PATH + 'px';
    }, 10);
  }

  checkWinState() {
    const FIELD = this.FIELD;

    FIELD.forEach(row => {
      row.forEach(column => {
        if (column === 2048) {
          this.winStatus = true;
        }
      });
    });

    return this.winStatus;
  }
}

const HTML_CELLS = document.querySelectorAll('.field-cell');

const Game = new Data(HTML_CELLS);

Game.FIELD = Game.makeMatrix();
Game.moveList = Game.makeMatrix();
Game.HTML_MATRIX = Game.makeMatrix(HTML_CELLS);

function eventListener(keyEvent) {
  const PREV_FIELD = Game.FIELD.map(elem => [...elem]);

  Game.madeMove = true;

  Game.moveField(Game.FIELD, keyEvent.key, Game.moveList);
  Game.visualize(keyEvent.key, PREV_FIELD);

  for (let i = 0; i < Game.moveList.length; i++) {
    for (let j = 0; j < Game.moveList.length; j++) {
      Game.moveList[i][j] = 0;
    }
  }

  document.querySelector('.game-score').innerText = `${Game.score}`;

  if (!Game.canMoveHorizontaly(Game.FIELD)
  && !Game.canMoveVerticaly(Game.FIELD)
  && !Game.hasEmptySpace(Game.FIELD)) {
    document.querySelector('.game-field__game-over').style.display = 'flex';
    document.removeEventListener('keydown', eventListener);

    setTimeout(() => {
      document.querySelector('.game-field__game-over').style.opacity = '1';
      document.querySelector('.message-lose').classList.remove('hidden');
    }, 10);
  } else if (Game.winStatus) {
    document.querySelector('.game-field__game-win').style.display = 'flex';
    document.removeEventListener('keydown', eventListener);

    setTimeout(() => {
      document.querySelector('.game-field__game-win').style.opacity = '1';
      document.querySelector('.message-win').classList.remove('hidden');
    }, 10);
  }
};

Game.FIELD = [
  [4, 16, 32, 64],
  [16, 32, 64, 4],
  [2, 4, 2, 0],
  [4, 8, 64, 0],
]

document.body.querySelector('.button').addEventListener('click', () => {
  document.querySelector('.message-start').classList.add('hidden');

  if (Game.isGameStarted) {
    Game.FIELD.forEach((elem, row) => {
      elem.forEach((secEl, column) => {
        Game.FIELD[row][column] = 0;
      });
    });

    HTML_CELLS.forEach(cell => {
      cell.innerHTML = '';

      while (cell.firstChild) {
        cell.removeChild(cell.firstChild);
      }
    });

    document.body.querySelector('button').classList = 'button start';
    document.body.querySelector('button').innerHTML = 'Start';
    document.body.querySelector('.game-score').innerHTML = '0';
    document.body.querySelector('.game-field__game-over').style.display = 'none';
    document.body.querySelector('.message-lose').classList.add('hidden');
    document.body.querySelector('.message-start').classList.remove('hidden');
    Game.madeMove = false;
    Game.score = 0;
  }

  if (!Game.madeMove) {
    setTimeout(() => {
      Game.randomCell(Game.FIELD);
      Game.randomCell(Game.FIELD);
      Game.visualize(Game.FIELD, Game.HTML_MATRIX, Game.moveList);
    }, 50);

    document.querySelector('.button').classList = 'button restart';
    document.querySelector('.button').innerText = 'Restart';
    Game.isGameStarted = true;
  }

  document.addEventListener('keydown', eventListener);
});
