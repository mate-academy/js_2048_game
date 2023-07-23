'use strict';

const table = document.querySelector('table');
const cells = document.querySelectorAll('td');
const start = document.querySelector('.start');
const textStart = document.querySelector('.message-start');
const textLose = document.querySelector('.message-lose');
const textWin = document.querySelector('.message-win');
const score = document.querySelector('.game-score');
const rows = table.rows;
const arr = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    const part = JSON.parse(JSON.stringify(arr));

    for (let i = 0; i < arr.length; i++) {
      arr[i].sort(function sortikLeft(x, y) {
        if (x > 0 && y > 0) {

        } else {
          return y - x;
        }
      });
    }

    if (JSON.stringify(part) !== JSON.stringify(arr)) {
      let countNumbersLeft = 1;

      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          if (arr[i][j] > 0 && arr[i][j - 1] > 0) {
            if (arr[i][j - 1] === arr[i][j] && arr[i][j - 1] !== undefined) {
              const secondNumberPrevLeft = arr[i][j - 1];
              const secondNumberCurrentLeft = arr[i][j];

              arr[i][j - 1] = arr[i][j] * 2;
              arr[i].splice(j, 1);

              const scoreRecLeft = score.innerText;

              score.innerText = secondNumberPrevLeft * 2 + Number(scoreRecLeft);
              arr[i].push(0);

              rows[i].children[j].classList
                .remove(`field-cell--${secondNumberCurrentLeft}`);

              rows[i].children[j - 1].classList
                .remove(`field-cell--${secondNumberPrevLeft}`);
            }
          }

          if (arr[i][j] > 0) {
            countNumbersLeft++;
          }
        }
      }

      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          if (arr[i][j] === 0) {
            if (rows[i].children[j].innerText !== '') {
              rows[i].children[j].classList
                .remove(`field-cell--${rows[i].children[j].innerText}`);
              rows[i].children[j].innerText = '';
            } else {
              rows[i].children[j].innerText = '';
            }
          } else {
            rows[i].children[j].classList
              .remove(`field-cell--${rows[i].children[j].innerText}`);
            rows[i].children[j].innerText = arr[i][j];

            rows[i].children[j].classList
              .add(`field-cell--${rows[i].children[j].innerText}`);
          }
        }
      }

      for (const cell of cells) {
        if (cell.innerText === '2048') {
          textWin.classList.remove('hidden');
        }
      }

      let z = Math.floor(Math.random() * cells.length + 1);

      if (cells[z - 1].innerText !== undefined
        && cells[z - 1].innerText !== '') {
        z = randomMain();
      }

      placingWithProbability(z);
      placing(z);

      if (countNumbersLeft === 16) {
        const checkHorizontal = checkHorizontalAudit(arr);
        const checkVertical = checkVerticalAudit(arr);

        if (checkHorizontal === undefined && checkVertical === undefined) {
          textLose.classList.remove('hidden');
        }
      }
    } else if (JSON.stringify(part) === JSON.stringify(arr)) {
      let countPairNumbers = 0;

      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          if (arr[i][j] > 0 && arr[i][j - 1] > 0) {
            if (arr[i][j - 1] === arr[i][j] && arr[i][j - 1] !== undefined) {
              countPairNumbers++;
            }
          }
        }
      }

      if (countPairNumbers > 0) {
        let countNumbersLeft = 1;

        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] > 0 && arr[i][j - 1] > 0) {
              if (arr[i][j - 1] === arr[i][j] && arr[i][j - 1] !== undefined) {
                const secondNumberPrevLeft = arr[i][j - 1];
                const secondNumberCurrentLeft = arr[i][j];

                arr[i][j - 1] = arr[i][j] * 2;
                arr[i].splice(j, 1);

                const scoreRecLeft = score.innerText;

                score.innerText = secondNumberPrevLeft * 2
                  + Number(scoreRecLeft);
                arr[i].push(0);

                rows[i].children[j].classList
                  .remove(`field-cell--${secondNumberCurrentLeft}`);

                rows[i].children[j - 1].classList
                  .remove(`field-cell--${secondNumberPrevLeft}`);
              }
            }

            if (arr[i][j] > 0) {
              countNumbersLeft++;
            }
          }
        }

        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] === 0) {
              if (rows[i].children[j].innerText !== '') {
                rows[i].children[j].classList
                  .remove(`field-cell--${rows[i].children[j].innerText}`);
                rows[i].children[j].innerText = '';
              } else {
                rows[i].children[j].innerText = '';
              }
            } else {
              rows[i].children[j].classList
                .remove(`field-cell--${rows[i].children[j].innerText}`);
              rows[i].children[j].innerText = arr[i][j];

              rows[i].children[j].classList
                .add(`field-cell--${rows[i].children[j].innerText}`);
            }
          }
        }

        for (const cell of cells) {
          if (cell.innerText === '2048') {
            textWin.classList.remove('hidden');
          }
        }

        let z = Math.floor(Math.random() * cells.length + 1);

        if (cells[z - 1].innerText !== undefined
          && cells[z - 1].innerText !== '') {
          z = randomMain();
        }

        placingWithProbability(z);
        placing(z);

        if (countNumbersLeft === 16) {
          const checkHorizontal = checkHorizontalAudit(arr);
          const checkVertical = checkVerticalAudit(arr);

          if (checkHorizontal === undefined && checkVertical === undefined) {
            textLose.classList.remove('hidden');
          }
        }
      }
    }
  }

  if (e.key === 'ArrowRight') {
    const part = JSON.parse(JSON.stringify(arr));

    for (let i = 0; i < arr.length; i++) {
      arr[i].sort(function sortikRight(x, y) {
        if (x > 0 && y > 0) {

        } else {
          return x - y;
        }
      });
    }

    if (JSON.stringify(part) !== JSON.stringify(arr)) {
      let countNumbersRight = 1;

      for (let i = 0; i < arr.length; i++) {
        for (let j = arr[i].length - 1; j >= 0; j--) {
          if (arr[i][j] > 0 && arr[i][j + 1] > 0) {
            if (arr[i][j] === arr[i][j + 1] && arr[i][j + 1] !== undefined) {
              const secondNumberNextRight = arr[i][j + 1];
              const secondNumberCurrentRight = arr[i][j];

              arr[i][j + 1] = arr[i][j] * 2;
              arr[i].splice(j, 1);

              const scoreRecRight = score.innerText;

              score.innerText = secondNumberNextRight * 2
                + Number(scoreRecRight);
              arr[i].unshift(0);

              rows[i].children[j].classList
                .remove(`field-cell--${secondNumberCurrentRight}`);

              rows[i].children[j + 1].classList
                .remove(`field-cell--${secondNumberNextRight}`);
            }
          }

          if (arr[i][j] > 0) {
            countNumbersRight++;
          }
        }
      }

      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          if (arr[i][j] === 0) {
            if (rows[i].children[j].innerText !== '') {
              rows[i].children[j].classList
                .remove(`field-cell--${rows[i].children[j].innerText}`);
              rows[i].children[j].innerText = '';
            } else {
              rows[i].children[j].innerText = '';
            }
          } else {
            rows[i].children[j].classList
              .remove(`field-cell--${rows[i].children[j].innerText}`);
            rows[i].children[j].innerText = arr[i][j];

            rows[i].children[j].classList
              .add(`field-cell--${rows[i].children[j].innerText}`);
          }
        }
      }

      for (const cell of cells) {
        if (cell.innerText === '2048') {
          textWin.classList.remove('hidden');
        }
      }

      let z = Math.floor(Math.random() * cells.length + 1);

      if (cells[z - 1].innerText !== undefined
        && cells[z - 1].innerText !== '') {
        z = randomMain();
      }

      placingWithProbability(z);
      placing(z);

      if (countNumbersRight === 16) {
        const checkHorizontal = checkHorizontalAudit(arr);
        const checkVertical = checkVerticalAudit(arr);

        if (checkHorizontal === undefined && checkVertical === undefined) {
          textLose.classList.remove('hidden');
        }
      }
    } else if (JSON.stringify(part) === JSON.stringify(arr)) {
      let countPairNumbers = 0;

      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          if (arr[i][j] > 0 && arr[i][j + 1] > 0) {
            if (arr[i][j + 1] === arr[i][j] && arr[i][j + 1] !== undefined) {
              countPairNumbers++;
            }
          }
        }
      }

      if (countPairNumbers > 0) {
        let countNumbersRight = 1;

        for (let i = 0; i < arr.length; i++) {
          for (let j = arr[i].length - 1; j >= 0; j--) {
            if (arr[i][j] > 0 && arr[i][j + 1] > 0) {
              if (arr[i][j] === arr[i][j + 1] && arr[i][j + 1] !== undefined) {
                const secondNumberNextRight = arr[i][j + 1];
                const secondNumberCurrentRight = arr[i][j];

                arr[i][j + 1] = arr[i][j] * 2;
                arr[i].splice(j, 1);

                const scoreRecRight = score.innerText;

                score.innerText = secondNumberNextRight * 2
                  + Number(scoreRecRight);
                arr[i].unshift(0);

                rows[i].children[j].classList
                  .remove(`field-cell--${secondNumberCurrentRight}`);

                rows[i].children[j + 1].classList
                  .remove(`field-cell--${secondNumberNextRight}`);
              }
            }

            if (arr[i][j] > 0) {
              countNumbersRight++;
            }
          }
        }

        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] === 0) {
              if (rows[i].children[j].innerText !== '') {
                rows[i].children[j].classList
                  .remove(`field-cell--${rows[i].children[j].innerText}`);
                rows[i].children[j].innerText = '';
              } else {
                rows[i].children[j].innerText = '';
              }
            } else {
              rows[i].children[j].classList
                .remove(`field-cell--${rows[i].children[j].innerText}`);
              rows[i].children[j].innerText = arr[i][j];

              rows[i].children[j].classList
                .add(`field-cell--${rows[i].children[j].innerText}`);
            }
          }
        }

        for (const cell of cells) {
          if (cell.innerText === '2048') {
            textWin.classList.remove('hidden');
          }
        }

        let z = Math.floor(Math.random() * cells.length + 1);

        if (cells[z - 1].innerText !== undefined
          && cells[z - 1].innerText !== '') {
          z = randomMain();
        }

        placingWithProbability(z);
        placing(z);

        if (countNumbersRight === 16) {
          const checkHorizontal = checkHorizontalAudit(arr);
          const checkVertical = checkVerticalAudit(arr);

          if (checkHorizontal === undefined && checkVertical === undefined) {
            textLose.classList.remove('hidden');
          }
        }
      }
    }
  }

  if (e.key === 'ArrowUp') {
    const part = JSON.parse(JSON.stringify(arr));

    for (let i = 0; i < rows.length; i++) {
      const mass = [arr[0][i], arr[1][i], arr[2][i], arr[3][i]];

      mass.sort(function sortikLeft(x, y) {
        if (x > 0 && y > 0) {

        } else {
          return y - x;
        }
      });
      arr[0][i] = mass[0];
      arr[1][i] = mass[1];
      arr[2][i] = mass[2];
      arr[3][i] = mass[3];
    }

    if (JSON.stringify(part) !== JSON.stringify(arr)) {
      let countNumbersUp = 1;

      for (let i = 0; i < rows.length; i++) {
        const arraY = [arr[0][i], arr[1][i], arr[2][i], arr[3][i]];

        for (let j = 0; j < arraY.length; j++) {
          if (arraY[j] > 0 && arraY[j - 1] > 0) {
            if (arraY[j - 1] === arraY[j] && arraY[j - 1] !== undefined) {
              const secondNumberPrevUp = arraY[j - 1];
              const secondNumberCurrentUp = arraY[j];

              arraY[j - 1] = arraY[j] * 2;
              arraY.splice(j, 1);

              const scoreRecUp = score.innerText;

              score.innerText = secondNumberPrevUp * 2 + Number(scoreRecUp);
              arraY.push(0);

              rows[j - 1].children[i].classList
                .remove(`field-cell--${secondNumberPrevUp}`);

              rows[j].children[i].classList
                .remove(`field-cell--${secondNumberCurrentUp}`);
            }
          }
          arr[0][i] = arraY[0];
          arr[1][i] = arraY[1];
          arr[2][i] = arraY[2];
          arr[3][i] = arraY[3];
        }
      }

      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          if (arr[i][j] === 0) {
            if (rows[i].children[j].innerText !== '') {
              rows[i].children[j].classList
                .remove(`field-cell--${rows[i].children[j].innerText}`);
              rows[i].children[j].innerText = '';
            } else {
              rows[i].children[j].innerText = '';
            }
          } else {
            countNumbersUp++;

            rows[i].children[j].classList
              .remove(`field-cell--${rows[i].children[j].innerText}`);
            rows[i].children[j].innerText = arr[i][j];

            rows[i].children[j].classList
              .add(`field-cell--${rows[i].children[j].innerText}`);
          }
        }
      }

      for (const cell of cells) {
        if (cell.innerText === '2048') {
          textWin.classList.remove('hidden');
        }
      }

      let z = Math.floor(Math.random() * cells.length + 1);

      if (cells[z - 1].innerText !== undefined
        && cells[z - 1].innerText !== '') {
        z = randomMain();
      }

      placingWithProbability(z);
      placing(z);

      if (countNumbersUp === 16) {
        const checkHorizontal = checkHorizontalAudit(arr);
        const checkVertical = checkVerticalAudit(arr);

        if (checkHorizontal === undefined && checkVertical === undefined) {
          textLose.classList.remove('hidden');
        }
      }
    } else if (JSON.stringify(part) === JSON.stringify(arr)) {
      let countPairNumbers = 0;

      for (let i = 0; i < rows.length; i++) {
        const arraY = [arr[0][i], arr[1][i], arr[2][i], arr[3][i]];

        for (let j = 0; j < arraY.length; j++) {
          if (arraY[j] > 0 && arraY[j - 1] > 0) {
            if (arraY[j - 1] === arraY[j] && arraY[j - 1] !== undefined) {
              countPairNumbers++;
            }
          }
        }
      }

      if (countPairNumbers > 0) {
        let countNumbersUp = 1;

        for (let i = 0; i < rows.length; i++) {
          const arraY = [arr[0][i], arr[1][i], arr[2][i], arr[3][i]];

          for (let j = 0; j < arraY.length; j++) {
            if (arraY[j] > 0 && arraY[j - 1] > 0) {
              if (arraY[j - 1] === arraY[j] && arraY[j - 1] !== undefined) {
                const secondNumberPrevUp = arraY[j - 1];
                const secondNumberCurrentUp = arraY[j];

                arraY[j - 1] = arraY[j] * 2;
                arraY.splice(j, 1);

                const scoreRecUp = score.innerText;

                score.innerText = secondNumberPrevUp * 2 + Number(scoreRecUp);
                arraY.push(0);

                rows[j - 1].children[i].classList
                  .remove(`field-cell--${secondNumberPrevUp}`);

                rows[j].children[i].classList
                  .remove(`field-cell--${secondNumberCurrentUp}`);
              }
            }
            arr[0][i] = arraY[0];
            arr[1][i] = arraY[1];
            arr[2][i] = arraY[2];
            arr[3][i] = arraY[3];
          }
        }

        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] === 0) {
              if (rows[i].children[j].innerText !== '') {
                rows[i].children[j].classList
                  .remove(`field-cell--${rows[i].children[j].innerText}`);
                rows[i].children[j].innerText = '';
              } else {
                rows[i].children[j].innerText = '';
              }
            } else {
              countNumbersUp++;

              rows[i].children[j].classList
                .remove(`field-cell--${rows[i].children[j].innerText}`);
              rows[i].children[j].innerText = arr[i][j];

              rows[i].children[j].classList
                .add(`field-cell--${rows[i].children[j].innerText}`);
            }
          }
        }

        for (const cell of cells) {
          if (cell.innerText === '2048') {
            textWin.classList.remove('hidden');
          }
        }

        let z = Math.floor(Math.random() * cells.length + 1);

        if (cells[z - 1].innerText !== undefined
          && cells[z - 1].innerText !== '') {
          z = randomMain();
        }

        placingWithProbability(z);
        placing(z);

        if (countNumbersUp === 16) {
          const checkHorizontal = checkHorizontalAudit(arr);
          const checkVertical = checkVerticalAudit(arr);

          if (checkHorizontal === undefined && checkVertical === undefined) {
            textLose.classList.remove('hidden');
          }
        }
      }
    }
  }

  if (e.key === 'ArrowDown') {
    const part = JSON.parse(JSON.stringify(arr));

    for (let i = 0; i < rows.length; i++) {
      const mass = [arr[0][i], arr[1][i], arr[2][i], arr[3][i]];

      mass.sort(function sortikRight(x, y) {
        if (x > 0 && y > 0) {

        } else {
          return x - y;
        }
      });
      arr[0][i] = mass[0];
      arr[1][i] = mass[1];
      arr[2][i] = mass[2];
      arr[3][i] = mass[3];
    }

    if (JSON.stringify(part) !== JSON.stringify(arr)) {
      let countNumbersDown = 1;

      for (let i = 0; i < rows.length; i++) {
        const arraY = [arr[0][i], arr[1][i], arr[2][i], arr[3][i]];

        for (let j = arraY.length - 1; j >= 0; j--) {
          if (arraY[j] > 0 && arraY[j + 1] > 0) {
            if (arraY[j] === arraY[j + 1] && arraY[j + 1] !== undefined) {
              const secondNumberNextDown = arraY[j + 1];
              const secondNumberCurrentDown = arraY[j];

              arraY[j + 1] = arraY[j] * 2;
              arraY.splice(j, 1);

              const scoreRecDown = score.innerText;

              score.innerText = secondNumberNextDown * 2 + Number(scoreRecDown);
              arraY.unshift(0);

              rows[j + 1].children[i].classList
                .remove(`field-cell--${secondNumberNextDown}`);

              rows[j].children[i].classList
                .remove(`field-cell--${secondNumberCurrentDown}`);
            }
          }
          arr[0][i] = arraY[0];
          arr[1][i] = arraY[1];
          arr[2][i] = arraY[2];
          arr[3][i] = arraY[3];
        }
      }

      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          if (arr[i][j] === 0) {
            if (rows[i].children[j].innerText !== '') {
              rows[i].children[j].classList
                .remove(`field-cell--${rows[i].children[j].innerText}`);
              rows[i].children[j].innerText = '';
            } else {
              rows[i].children[j].innerText = '';
            }
          } else {
            countNumbersDown++;

            rows[i].children[j].classList
              .remove(`field-cell--${rows[i].children[j].innerText}`);
            rows[i].children[j].innerText = arr[i][j];

            rows[i].children[j].classList
              .add(`field-cell--${rows[i].children[j].innerText}`);
          }
        }
      }

      for (const cell of cells) {
        if (cell.innerText === '2048') {
          textWin.classList.remove('hidden');
        }
      }

      let z = Math.floor(Math.random() * cells.length + 1);

      if (cells[z - 1].innerText !== undefined
        && cells[z - 1].innerText !== '') {
        z = randomMain();
      }

      placingWithProbability(z);
      placing(z);

      if (countNumbersDown === 16) {
        const checkHorizontal = checkHorizontalAudit(arr);
        const checkVertical = checkVerticalAudit(arr);

        if (checkHorizontal === undefined && checkVertical === undefined) {
          textLose.classList.remove('hidden');
        }
      }
    } else if (JSON.stringify(part) === JSON.stringify(arr)) {
      let countPairNumbers = 0;

      for (let i = 0; i < rows.length; i++) {
        const arraY = [arr[0][i], arr[1][i], arr[2][i], arr[3][i]];

        for (let j = arraY.length - 1; j >= 0; j--) {
          if (arraY[j] > 0 && arraY[j + 1] > 0) {
            if (arraY[j] === arraY[j + 1] && arraY[j + 1] !== undefined) {
              countPairNumbers++;
            }
          }
        }
      }

      if (countPairNumbers > 0) {
        let countNumbersDown = 1;

        for (let i = 0; i < rows.length; i++) {
          const arraY = [arr[0][i], arr[1][i], arr[2][i], arr[3][i]];

          for (let j = arraY.length - 1; j >= 0; j--) {
            if (arraY[j] > 0 && arraY[j + 1] > 0) {
              if (arraY[j] === arraY[j + 1] && arraY[j + 1] !== undefined) {
                const secondNumberNextDown = arraY[j + 1];
                const secondNumberCurrentDown = arraY[j];

                arraY[j + 1] = arraY[j] * 2;
                arraY.splice(j, 1);

                const scoreRecDown = score.innerText;

                score.innerText = secondNumberNextDown * 2
                  + Number(scoreRecDown);
                arraY.unshift(0);

                rows[j + 1].children[i].classList
                  .remove(`field-cell--${secondNumberNextDown}`);

                rows[j].children[i].classList
                  .remove(`field-cell--${secondNumberCurrentDown}`);
              }
            }
            arr[0][i] = arraY[0];
            arr[1][i] = arraY[1];
            arr[2][i] = arraY[2];
            arr[3][i] = arraY[3];
          }
        }

        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] === 0) {
              if (rows[i].children[j].innerText !== '') {
                rows[i].children[j].classList
                  .remove(`field-cell--${rows[i].children[j].innerText}`);
                rows[i].children[j].innerText = '';
              } else {
                rows[i].children[j].innerText = '';
              }
            } else {
              countNumbersDown++;

              rows[i].children[j].classList
                .remove(`field-cell--${rows[i].children[j].innerText}`);
              rows[i].children[j].innerText = arr[i][j];

              rows[i].children[j].classList
                .add(`field-cell--${rows[i].children[j].innerText}`);
            }
          }
        }

        for (const cell of cells) {
          if (cell.innerText === '2048') {
            textWin.classList.remove('hidden');
          }
        }

        let z = Math.floor(Math.random() * cells.length + 1);

        if (cells[z - 1].innerText !== undefined
          && cells[z - 1].innerText !== '') {
          z = randomMain();
        }

        placingWithProbability(z);
        placing(z);

        if (countNumbersDown === 16) {
          const checkHorizontal = checkHorizontalAudit(arr);
          const checkVertical = checkVerticalAudit(arr);

          if (checkHorizontal === undefined && checkVertical === undefined) {
            textLose.classList.remove('hidden');
          }
        }
      }
    }
  }
});

function checkHorizontalAudit(elem) {
  for (let i = 0; i < elem.length; i++) {
    for (let j = 1; j < elem[i].length; j++) {
      if (elem[i][j] === elem[i][j - 1]) {
        return false;
      }
    }
  }
}

function checkVerticalAudit(elem) {
  for (let i = 0; i < rows.length; i++) {
    const massFunc = [elem[0][i], elem[1][i], elem[2][i], elem[3][i]];

    for (let j = 1; j < massFunc.length; j++) {
      if (massFunc[j] === massFunc[j - 1]) {
        return false;
      }
    }
  }
}

function randomMain() {
  const a = Math.floor(Math.random() * cells.length + 1);

  if (cells[a - 1].innerText !== '') {
    return randomMain();
  } else {
    return a;
  }
}

function random(x) {
  const y = Math.floor(Math.random() * cells.length + 1);

  if (x === y) {
    return random(x);
  } else {
    return y;
  }
}

function placing(a) {
  if (a > 0 && a <= 4) {
    arr[0][a - 1] = Number(cells[a - 1].innerHTML);
  } else if (a > 4 && a <= 8) {
    arr[1][cells[a - 1].cellIndex] = Number(cells[a - 1].innerHTML);
  } else if (a > 8 && a <= 12) {
    arr[2][cells[a - 1].cellIndex] = Number(cells[a - 1].innerHTML);
  } else if (a > 12) {
    arr[3][cells[a - 1].cellIndex] = Number(cells[a - 1].innerHTML);
  }
}

function placingWithProbability(b) {
  if (b >= 15) {
    cells[b - 1].classList.add('field-cell--4');
    cells[b - 1].innerText = '4';
  } else {
    cells[b - 1].classList.add('field-cell--2');
    cells[b - 1].innerText = '2';
  }
}

start.addEventListener('click', (e) => {
  const item = e.target;

  if (item.classList.contains('start')) {
    const x = Math.floor(Math.random() * cells.length + 1);
    const y = random(x);

    placingWithProbability(x);
    placingWithProbability(y);
    start.classList.add('restart');
    start.innerText = 'Restart';
    start.classList.remove('start');
    textStart.setAttribute('hidden', '');
    placing(x);
    placing(y);
  } else if (item.classList.contains('restart')) {
    score.innerText = 0;
    textLose.classList.add('hidden');

    for (let r = 0; r < arr.length; r++) {
      for (let c = 0; c < arr[r].length; c++) {
        arr[r][c] = 0;
      }
    }

    for (const cell of cells) {
      cell.classList.remove(`field-cell--${cell.innerText}`);
      cell.innerText = '';
    }

    const x = Math.floor(Math.random() * cells.length + 1);
    const y = random(x);

    placingWithProbability(x);
    placingWithProbability(y);
    placing(x);
    placing(y);
  }
});
